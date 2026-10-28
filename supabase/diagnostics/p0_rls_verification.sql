-- ============================================================================
-- DRAFT verification suite for P0 subscriptions + usage_counters RLS
-- Run AFTER the approved migration (manual). Does not modify customer data
-- beyond optional temp rows created in a transaction that must ROLLBACK.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- A) Catalog checks (safe, read-only)
-- ---------------------------------------------------------------------------

SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('subscriptions', 'usage_counters')
ORDER BY c.relname;
-- Expect: rls_enabled = true for both

SELECT tablename, policyname, cmd, roles::text, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('subscriptions', 'usage_counters')
ORDER BY tablename, cmd, policyname;
-- Expect: SELECT policies only; no INSERT/UPDATE/DELETE

SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;
-- Expect: authenticated has SELECT; anon lacks write (and ideally lacks ALL);
--         service_role retains needed privileges for backend

-- ---------------------------------------------------------------------------
-- B) Functional tests (use two real user UUIDs + two workspace IDs)
-- Replace placeholders before running. Prefer a dedicated staging project.
-- ---------------------------------------------------------------------------
-- Placeholders:
--   :user_a_id, :user_b_id
--   :workspace_a_id (owned by user A)
--   :workspace_b_id (owned by user B)
--
-- Recommended approach in SQL Editor:
-- 1) As postgres/service: insert two disposable test rows (or use existing).
-- 2) Open two authenticated sessions (or use request.jwt claims via
--    set_config in a carefully controlled test), OR verify via the
--    client app / PostgREST with each user's access token.
--
-- PostgREST / client checklist (preferred; mirrors production path):
--
-- 1. Anonymous (anon key only, no user JWT):
--    GET /rest/v1/subscriptions?select=*
--    GET /rest/v1/usage_counters?select=*
--    Expect: [] empty (or 401/403 depending on grants)
--    POST /rest/v1/subscriptions  body: {...}
--    POST /rest/v1/usage_counters body: {...}
--    Expect: failure (42501 / RLS / grant)
--
-- 2. User A JWT:
--    GET subscriptions?workspace_id=eq.<workspace_a>  → may return A's rows
--    GET subscriptions?workspace_id=eq.<workspace_b>  → []
--    GET usage_counters?workspace_id=eq.<workspace_b> → []
--    POST/PATCH/DELETE on either table → failure
--
-- 3. User B JWT: symmetric to (2)
--
-- 4. service_role key (server only — never in browser):
--    INSERT/UPDATE/DELETE on both tables → success
--    Confirms trusted backend billing/usage writers still work

-- ---------------------------------------------------------------------------
-- C) Optional transactional smoke test (ROLLBACK — no lasting data)
-- Requires: you supply valid workspace_a_id that exists.
-- ---------------------------------------------------------------------------
2
BEGIN;

-- Example disposable inserts (service/postgres role). Adjust column values.
-- INSERT INTO public.subscriptions (
--   workspace_id, status, tier
-- ) VALUES (
--   '<workspace_a_id>'::uuid, 'inactive', 'free'
-- ) RETURNING id;
--
-- INSERT INTO public.usage_counters (
--   workspace_id, period_start, period_end, count
-- ) VALUES (
--   '<workspace_a_id>'::uuid, date_trunc('month', now()), date_trunc('month', now()) + interval '1 month', 0
-- ) RETURNING id;

-- Simulate authenticated role if your environment supports it:
-- SET LOCAL ROLE authenticated;
-- SELECT set_config('request.jwt.claim.sub', '<user_a_id>', true);
-- SELECT * FROM public.subscriptions;  -- expect only A
-- INSERT INTO public.subscriptions (workspace_id, status, tier)
--   VALUES ('<workspace_a_id>'::uuid, 'active', 'pro');  -- expect FAIL
-- INSERT INTO public.usage_counters (workspace_id, period_start, period_end, count)
--   VALUES ('<workspace_a_id>'::uuid, now(), now(), 1);  -- expect FAIL

ROLLBACK;

-- ---------------------------------------------------------------------------
-- D) Pass criteria
-- ---------------------------------------------------------------------------
-- [ ] Both tables show rls_enabled = true
-- [ ] Only SELECT policies remain
-- [ ] Anon cannot read or write private rows
-- [ ] User A cannot read User B rows
-- [ ] Authenticated cannot INSERT/UPDATE/DELETE either table
-- [ ] service_role can still INSERT/UPDATE usage and subscriptions
-- [ ] Advisors: rls_disabled_in_public cleared for these two tables
-- ============================================================================
