-- ============================================================================
-- FINAL P0 MIGRATION — DO NOT EXECUTE until explicitly approved
-- ============================================================================
-- DreamStreet: Secure RLS for public.subscriptions + public.usage_counters
--
-- Safe to re-run (idempotent): ENABLE RLS, DROP POLICY IF EXISTS, REVOKE ALL,
-- then CREATE SELECT-only policies + GRANT SELECT to authenticated.
--
-- Does NOT modify or delete customer row data.
-- Does NOT alter unrelated tables or policies (including workspaces).
-- Writes remain available to service_role (bypasses RLS; FORCE not set).
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1) subscriptions
-- ---------------------------------------------------------------------------

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Remove the four known policies (including unsafe writes)
DROP POLICY IF EXISTS "Workspace owners can view subscriptions"
  ON public.subscriptions;
DROP POLICY IF EXISTS "Workspace owners can insert subscriptions"
  ON public.subscriptions;
DROP POLICY IF EXISTS "Workspace owners can update subscriptions"
  ON public.subscriptions;
DROP POLICY IF EXISTS "Workspace owners can delete subscriptions"
  ON public.subscriptions;

-- SELECT only: workspace owner via workspaces.user_id = auth.uid()
CREATE POLICY "Workspace owners can view subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id
      FROM public.workspaces
      WHERE user_id = auth.uid()
    )
  );

REVOKE ALL ON TABLE public.subscriptions FROM PUBLIC;
REVOKE ALL ON TABLE public.subscriptions FROM anon;
REVOKE ALL ON TABLE public.subscriptions FROM authenticated;
GRANT SELECT ON TABLE public.subscriptions TO authenticated;

-- ---------------------------------------------------------------------------
-- 2) usage_counters
-- ---------------------------------------------------------------------------

ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- Idempotent: drop our SELECT policy if a previous run created it
DROP POLICY IF EXISTS "Workspace owners can view usage counters"
  ON public.usage_counters;

CREATE POLICY "Workspace owners can view usage counters"
  ON public.usage_counters
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id
      FROM public.workspaces
      WHERE user_id = auth.uid()
    )
  );

REVOKE ALL ON TABLE public.usage_counters FROM PUBLIC;
REVOKE ALL ON TABLE public.usage_counters FROM anon;
REVOKE ALL ON TABLE public.usage_counters FROM authenticated;
GRANT SELECT ON TABLE public.usage_counters TO authenticated;

COMMIT;
