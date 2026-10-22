-- ============================================================================
-- FINAL P0 — READ-ONLY verification (run AFTER approved migration)
-- Does not modify customer data. Safe to run multiple times.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) RLS enabled on target tables only
-- ---------------------------------------------------------------------------
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('subscriptions', 'usage_counters')
ORDER BY c.relname;
-- Expect: rls_enabled = true; rls_forced = false

-- ---------------------------------------------------------------------------
-- 2) Policies: SELECT only; expected names
-- ---------------------------------------------------------------------------
SELECT tablename, policyname, cmd, roles::text AS roles, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('subscriptions', 'usage_counters')
ORDER BY tablename, policyname;
-- Expect exactly:
--   subscriptions | Workspace owners can view subscriptions | SELECT
--   usage_counters | Workspace owners can view usage counters | SELECT
-- Expect no INSERT / UPDATE / DELETE policies on either table
-- Expect qual references workspaces + auth.uid()

-- ---------------------------------------------------------------------------
-- 3) workspaces SELECT policy still correct (read-only check; no ALTER)
-- ---------------------------------------------------------------------------
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'workspaces'
  AND cmd = 'SELECT'
ORDER BY policyname;
-- Expect policy using auth.uid() = user_id
-- (repo name: "Users can view own workspaces")

-- Confirm ownership predicate string for subscriptions/usage SELECT
SELECT tablename, policyname, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('subscriptions', 'usage_counters')
  AND cmd = 'SELECT';
-- Expect workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
-- or equivalent with schema qualification

-- ---------------------------------------------------------------------------
-- 4) Grants: PUBLIC / anon / authenticated must not have writes
-- ---------------------------------------------------------------------------
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee IN ('PUBLIC', 'anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- authenticated / anon / PUBLIC must not have any privilege except
-- authenticated SELECT (expect 0 rows for non-SELECT on those grantees)
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee IN ('PUBLIC', 'anon', 'authenticated')
  AND privilege_type <> 'SELECT';
-- Expect: 0 rows

-- anon and PUBLIC should have no privileges at all on these tables
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee IN ('PUBLIC', 'anon');
-- Expect: 0 rows

-- authenticated should retain SELECT only
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee = 'authenticated';
-- Expect: exactly 2 rows, both privilege_type = SELECT

-- Other roles with table privileges (review for unintended access)
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('subscriptions', 'usage_counters')
  AND grantee NOT IN ('PUBLIC', 'anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin')
ORDER BY table_name, grantee, privilege_type;
-- Expect: empty, or only known admin/maintenance roles you intentionally keep

-- Policy count: no unexpected policies
SELECT tablename, COUNT(*) AS policy_count,
       COUNT(*) FILTER (WHERE cmd <> 'SELECT') AS non_select_policies
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('subscriptions', 'usage_counters')
GROUP BY tablename;
-- Expect: policy_count = 1 and non_select_policies = 0 per table

-- ---------------------------------------------------------------------------
-- 5) Client / PostgREST checklist (run with tokens; no SQL writes required)
-- ---------------------------------------------------------------------------
-- Anonymous (anon key, no user JWT):
--   GET  /rest/v1/subscriptions?select=*     → [] or denied
--   GET  /rest/v1/usage_counters?select=*    → [] or denied
--   POST /rest/v1/subscriptions              → fail (RLS and/or grants)
--   POST /rest/v1/usage_counters             → fail
--   PATCH/DELETE either table                → fail
--
-- User A JWT:
--   SELECT own workspace rows                → allowed
--   SELECT User B workspace rows             → []
--   INSERT/UPDATE/DELETE either table      → fail
--
-- service_role (server only):
--   INSERT/UPDATE subscriptions + usage_counters → allowed
--
-- Application code (repo verification — already confirmed):
--   No supabase.from('subscriptions'|'usage_counters') write calls in src/

-- ---------------------------------------------------------------------------
-- 6) Pass criteria
-- ---------------------------------------------------------------------------
-- [ ] Both tables rls_enabled = true
-- [ ] Only the two SELECT policies above exist on these tables
-- [ ] workspaces SELECT still uses auth.uid() = user_id
-- [ ] No INSERT/UPDATE/DELETE/TRUNCATE grants for PUBLIC, anon, authenticated
-- [ ] authenticated has SELECT on both tables
-- [ ] Anon cannot read private rows; User A cannot read User B
-- [ ] Authenticated cannot write; service_role can write
-- [ ] Advisor rls_disabled_in_public cleared for these two tables
-- ============================================================================
