/**
 * Activation-ready brand blueprint.
 * Persisted locally and (after Task 2E-1) to artist_profiles.brand_identity.
 */

import type {
  BrandIdentityDraft,
  BlueprintLocalMeta,
  CreatorIdentityDraft,
  IndustryNicheDraft,
  BrandPersonalityDraft,
  VisualIdentityDraft,
  TargetAudienceDraft,
  ProductsGoalsDraft,
  WizardStepId,
} from './types'

export const BRAND_BLUEPRINT_SCHEMA_VERSION = 1 as const

export const BLUEPRINT_STORAGE_KEY = 'dreamstreet.brandIdentity.blueprint.v1'

/**
 * Stable, reusable blueprint for future account sync / AI.
 * Reuses draft section shapes — no duplicated domain model.
 */
export interface BrandBlueprint {
  schemaVersion: typeof BRAND_BLUEPRINT_SCHEMA_VERSION
  status: 'activation_ready'
  preparedAt: string
  creator: CreatorIdentityDraft
  industry: IndustryNicheDraft
  personality: BrandPersonalityDraft
  visual: VisualIdentityDraft
  audience: TargetAudienceDraft
  goals: ProductsGoalsDraft
}

export interface WizardValidationIssue {
  step: WizardStepId
  label: string
  message: string
}

export function buildBrandBlueprint(draft: BrandIdentityDraft): BrandBlueprint {
  const preparedAt = new Date().toISOString()
  return {
    schemaVersion: BRAND_BLUEPRINT_SCHEMA_VERSION,
    status: 'activation_ready',
    preparedAt,
    creator: { ...draft.creator, secondaryKinds: [...draft.creator.secondaryKinds] },
    industry: {
      selections: draft.industry.selections.map((s) => ({
        ...s,
        pathIds: [...s.pathIds],
        pathLabels: [...s.pathLabels],
      })),
      customNiches: [...draft.industry.customNiches],
    },
    personality: {
      ...draft.personality,
      secondaryPersonalities: [...draft.personality.secondaryPersonalities],
      voiceAttributes: [...draft.personality.voiceAttributes],
    },
    visual: {
      aesthetics: [...draft.visual.aesthetics],
      colorPalettes: [...draft.visual.colorPalettes],
      contentStyles: [...draft.visual.contentStyles],
      moods: [...draft.visual.moods],
    },
    audience: {
      ...draft.audience,
      audienceTypes: [...draft.audience.audienceTypes],
      ageRanges: [...draft.audience.ageRanges],
      interests: [...draft.audience.interests],
      needs: [...draft.audience.needs],
    },
    goals: {
      ...draft.goals,
      offerings: [...draft.goals.offerings],
      secondaryGoals: [...draft.goals.secondaryGoals],
      callsToAction: [...draft.goals.callsToAction],
      contentPriorities: [...draft.goals.contentPriorities],
    },
  }
}

export function blueprintMetaFrom(
  blueprint: BrandBlueprint
): BlueprintLocalMeta {
  return {
    status: 'activation_ready',
    preparedAt: blueprint.preparedAt,
    schemaVersion: blueprint.schemaVersion,
  }
}

export function saveBrandBlueprint(blueprint: BrandBlueprint): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(blueprint))
    return true
  } catch {
    return false
  }
}

/** Clear local activation-ready blueprint (e.g. after edits invalidate it). */
export function clearBrandBlueprint(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(BLUEPRINT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function draftFromBlueprint(
  blueprint: BrandBlueprint,
  currentStep: WizardStepId = 7
): BrandIdentityDraft {
  return {
    version: 2,
    currentStep,
    updatedAt: blueprint.preparedAt,
    creator: blueprint.creator,
    industry: blueprint.industry,
    personality: blueprint.personality,
    visual: blueprint.visual,
    audience: blueprint.audience,
    goals: blueprint.goals,
    blueprint: {
      status: 'account_active',
      preparedAt: blueprint.preparedAt,
      schemaVersion: blueprint.schemaVersion,
      syncedAt: blueprint.preparedAt,
    },
  }
}

export function loadBrandBlueprint(): BrandBlueprint | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(BLUEPRINT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return normalizeBrandBlueprint(parsed)
  } catch {
    return null
  }
}

export function normalizeBrandBlueprint(raw: unknown): BrandBlueprint | null {
  if (!raw || typeof raw !== 'object') return null
  const b = raw as Partial<BrandBlueprint>
  if (b.status !== 'activation_ready') return null
  if (typeof b.preparedAt !== 'string') return null
  if (
    !b.creator ||
    !b.industry ||
    !b.personality ||
    !b.visual ||
    !b.audience ||
    !b.goals
  ) {
    return null
  }
  return {
    schemaVersion: BRAND_BLUEPRINT_SCHEMA_VERSION,
    status: 'activation_ready',
    preparedAt: b.preparedAt,
    creator: b.creator,
    industry: b.industry,
    personality: b.personality,
    visual: b.visual,
    audience: b.audience,
    goals: b.goals,
  }
}
