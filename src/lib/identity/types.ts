/**
 * Brand identity wizard types.
 * M0 implements Steps 1–2; Steps 3–7 shapes are reserved for later milestones.
 */

export type WizardStepId =
  | 1 // Creator identity (M0)
  | 2 // Industry & niche (M0)
  | 3 // Brand personality (future)
  | 4 // Audience identity (future)
  | 5 // Goals (future)
  | 6 // Creative direction (future)
  | 7 // Brand blueprint (future)

export const WIZARD_STEP_LABELS: Record<WizardStepId, string> = {
  1: 'Identity',
  2: 'Industry',
  3: 'Personality',
  4: 'Audience',
  5: 'Goals',
  6: 'Creative',
  7: 'Blueprint',
}

export const WIZARD_TOTAL_STEPS = 7

export type EntityType = 'individual' | 'organization'

export type CreatorKindId =
  | 'musician_artist'
  | 'music_producer'
  | 'influencer'
  | 'content_creator'
  | 'business_brand'
  | 'entrepreneur'
  | 'educator'
  | 'podcaster'
  | 'designer'
  | 'photographer'
  | 'writer'
  | 'other'

export interface CreatorKindOption {
  id: CreatorKindId
  label: string
  description: string
}

export interface NicheNode {
  id: string
  label: string
  children?: NicheNode[]
}

export interface IndustryOption {
  id: string
  label: string
  niches: NicheNode[]
}

/** Selected niche path, e.g. music → electronic → tech-house */
export interface NicheSelection {
  industryId: string
  industryLabel: string
  pathIds: string[]
  pathLabels: string[]
  /** Full slug path for stable AI/catalog use */
  slug: string
}

export interface CreatorIdentityDraft {
  entityType: EntityType | null
  displayName: string
  primaryKind: CreatorKindId | null
  secondaryKinds: CreatorKindId[]
  otherKindLabel: string
}

export interface IndustryNicheDraft {
  selections: NicheSelection[]
  customNiches: string[]
}

/** Full wizard draft — Steps 3–7 reserved as optional placeholders */
export interface BrandIdentityDraft {
  version: 1
  currentStep: WizardStepId
  updatedAt: string
  creator: CreatorIdentityDraft
  industry: IndustryNicheDraft
  /** Reserved for M1+ */
  personality?: unknown
  audience?: unknown
  goals?: unknown
  creative?: unknown
  blueprint?: unknown
}

export function createEmptyDraft(): BrandIdentityDraft {
  return {
    version: 1,
    currentStep: 1,
    updatedAt: new Date().toISOString(),
    creator: {
      entityType: null,
      displayName: '',
      primaryKind: null,
      secondaryKinds: [],
      otherKindLabel: '',
    },
    industry: {
      selections: [],
      customNiches: [],
    },
  }
}
