# P0 Inspection Notes — subscriptions & usage_counters

**Status:** Draft remediation prepared. Migration **not** executed. Live DB **not** modified.

## Repo vs live

| Location | Finding |
|----------|---------|
| `supabase-schema.sql` | Does **not** define `subscriptions` or `usage_counters` |
| App TS/TSX | **No** references to either table |
| `stripe` / `resend` npm packages | Installed; **no** billing/usage server logic implemented |
| Live Supabase | Tables exist; RLS was disabled (your audit) |

## Discovered live columns (read-only select probes)

### `subscriptions`
`id`, `workspace_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `status`, `tier`, `current_period_end`, `created_at`, `updated_at`

**PK:** `id` (assumed UUID; not catalog-confirmed)  
**Ownership:** `workspace_id` → `workspaces.id` where `workspaces.user_id = auth.uid()`

### `usage_counters`
`id`, `workspace_id`, `period_start`, `period_end`, `count`, `updated_at`

**No** `metric` / `key` column found via probe — single counter per period window, or schema incomplete for multi-metric metering later.

### `workspaces` (ownership root)
`id`, `user_id`, `name`, `created_at`

## Existing policies (from your live audit)

**subscriptions:** four authenticated policies — SELECT, INSERT, UPDATE, DELETE (workspace ownership). Write policies are **unsafe** for client roles.

**usage_counters:** no `pg_policies` rows.

## Grants (OPTIONS probe)

Both tables exposed to PostgREST with at least `GET, HEAD, POST` — writes must be blocked by RLS + REVOKE.

## Breakage risk if migration applied

| Area | Risk |
|------|------|
| Current DreamStreet UI / `/api/generate` | **None** — no table usage |
| Future client `supabase.from('subscriptions').insert()` | **Will fail** (intended) |
| Future Stripe webhook using **anon** key | **Will fail** — must use **service_role** server-side |
| Dashboard SQL as postgres | **OK** (bypasses RLS unless FORCE) |
| Empty tables today | Enabling RLS is low data-risk |

## Draft files

- `supabase/migrations/draft_p0_rls_subscriptions_usage_counters.sql`
- `supabase/diagnostics/p0_rls_verification.sql`
