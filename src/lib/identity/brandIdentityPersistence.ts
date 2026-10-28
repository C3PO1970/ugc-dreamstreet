/**
 * Map brand blueprints ↔ artist_profiles fields (additive sync).
 * Does not call Supabase — used by the API route.
 */

import {
  draftFromBlueprint,
  normalizeBrandBlueprint,
  type BrandBlueprint,
} from './blueprint'
import {
  COMMUNICATION_TONES,
  CREATOR_KIND_OPTIONS,
  PERSONALITY_TRAITS,
} from './catalogs'
import type { BrandIdentityDraft, WizardStepId } from './types'

export interface ArtistProfileBrandColumns {
  brand_identity: BrandBlueprint
  wizard_step: number
  wizard_completed_at: string
  name: string
  genre: string | null
  brand_voice: string | null
  vibe_keywords: string[] | null
  updated_at: string
}

/** Derive legacy Creator Profile columns for generate/dashboard compatibility. */
export function legacyFieldsFromBlueprint(blueprint: BrandBlueprint): {
  name: string
  genre: string | null
  brand_voice: string | null
  vibe_keywords: string[]
} {
  const name =
    blueprint.creator.displayName.trim() ||
    (blueprint.creator.primaryKind === 'other'
      ? blueprint.creator.otherKindLabel.trim()
      : '') ||
    'Creator'

  const nicheLabel =
    blueprint.industry.selections[0]?.pathLabels.slice(-1)[0] ||
    blueprint.industry.selections[0]?.industryLabel ||
    blueprint.industry.customNiches[0] ||
    null

  const kindLabel =
    CREATOR_KIND_OPTIONS.find((k) => k.id === blueprint.creator.primaryKind)
      ?.label ?? null

  const genre = nicheLabel || kindLabel

  const tone =
    COMMUNICATION_TONES.find(
      (t) => t.id === blueprint.personality.communicationTone
    )?.label ?? null
  const primaryTrait =
    PERSONALITY_TRAITS.find(
      (t) => t.id === blueprint.personality.primaryPersonality
    )?.label ?? null
  const custom = blueprint.personality.customDescriptor.trim()
  const brand_voice =
    [primaryTrait, tone, custom].filter(Boolean).join(' · ') || null

  const vibe_keywords = [
    ...(primaryTrait ? [primaryTrait] : []),
    ...blueprint.personality.secondaryPersonalities
      .map((id) => PERSONALITY_TRAITS.find((t) => t.id === id)?.label)
      .filter((x): x is string => Boolean(x)),
  ].slice(0, 8)

  return { name, genre, brand_voice, vibe_keywords }
}

export function buildProfileUpdateFromBlueprint(
  blueprint: BrandBlueprint,
  wizardStep: WizardStepId = 7
): ArtistProfileBrandColumns {
  const legacy = legacyFieldsFromBlueprint(blueprint)
  const now = new Date().toISOString()
  return {
    brand_identity: blueprint,
    wizard_step: wizardStep,
    wizard_completed_at: now,
    name: legacy.name,
    genre: legacy.genre,
    brand_voice: legacy.brand_voice,
    vibe_keywords: legacy.vibe_keywords,
    updated_at: now,
  }
}

export function accountDraftFromProfile(row: {
  brand_identity: unknown
  wizard_step: number | null
  wizard_completed_at: string | null
}): BrandIdentityDraft | null {
  const blueprint = normalizeBrandBlueprint(row.brand_identity)
  if (!blueprint) return null
  const step = (
    row.wizard_step && row.wizard_step >= 1 && row.wizard_step <= 7
      ? row.wizard_step
      : 7
  ) as WizardStepId
  const draft = draftFromBlueprint(blueprint, step)
  if (row.wizard_completed_at) {
    draft.blueprint = {
      status: 'account_active',
      preparedAt: blueprint.preparedAt,
      schemaVersion: blueprint.schemaVersion,
      syncedAt: row.wizard_completed_at,
    }
    draft.updatedAt = row.wizard_completed_at
  }
  return draft
}
