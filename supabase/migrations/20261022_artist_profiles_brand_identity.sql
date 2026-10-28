-- DreamStreet Task 2E-1
-- Additive brand identity persistence on artist_profiles
-- DO NOT auto-apply — review and run in Supabase SQL Editor after approval.
--
-- Preserves existing rows and RLS. Does not alter unrelated tables.
-- Idempotent: safe to re-run.

-- brand_identity: full BrandBlueprint JSON (wizard selections)
ALTER TABLE public.artist_profiles
  ADD COLUMN IF NOT EXISTS brand_identity JSONB;

-- Last wizard step the user reached (1–7)
ALTER TABLE public.artist_profiles
  ADD COLUMN IF NOT EXISTS wizard_step INTEGER;

-- Set when Activate My Brand succeeds and blueprint is persisted
ALTER TABLE public.artist_profiles
  ADD COLUMN IF NOT EXISTS wizard_completed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.artist_profiles.brand_identity IS
  'Brand Identity Wizard blueprint JSON (schemaVersion + creator/industry/personality/visual/audience/goals).';

COMMENT ON COLUMN public.artist_profiles.wizard_step IS
  'Last Brand Identity Wizard step (1-7).';

COMMENT ON COLUMN public.artist_profiles.wizard_completed_at IS
  'Timestamp when brand identity was activated and saved to the account.';

-- Soft check: wizard_step in range when present (idempotent drop/create)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'artist_profiles_wizard_step_range'
      AND conrelid = 'public.artist_profiles'::regclass
  ) THEN
    ALTER TABLE public.artist_profiles
      ADD CONSTRAINT artist_profiles_wizard_step_range
      CHECK (
        wizard_step IS NULL
        OR (wizard_step >= 1 AND wizard_step <= 7)
      );
  END IF;
END $$;

-- Optional index for “has completed wizard” lookups (no uniqueness change)
CREATE INDEX IF NOT EXISTS idx_artist_profiles_wizard_completed_at
  ON public.artist_profiles (wizard_completed_at)
  WHERE wizard_completed_at IS NOT NULL;

-- NOTE: Existing RLS policies on artist_profiles already scope SELECT/INSERT/UPDATE/DELETE
-- to workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()).
-- No RLS changes required for these columns.
