/**
 * Brand identity wizard types.
 * Steps 1–7 implemented (local draft + activation-ready blueprint only).
 */

export type WizardStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const WIZARD_STEP_LABELS: Record<WizardStepId, string> = {
  1: 'Creator Identity',
  2: 'Industry & Niche',
  3: 'Brand Personality',
  4: 'Visual Identity',
  5: 'Target Audience',
  6: 'Products & Goals',
  7: 'Review & Activate',
}

export const WIZARD_TOTAL_STEPS = 7

/** Highest step with a full UI implementation. */
export const MAX_IMPLEMENTED_STEP: WizardStepId = 7

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

export interface NicheSelection {
  industryId: string
  industryLabel: string
  pathIds: string[]
  pathLabels: string[]
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

/** Structured hints for future AI prompt projection (not used by /api/generate yet). */
export interface AiInfluenceHints {
  vocabulary?: string[]
  tone?: string[]
  messaging?: string[]
  visual?: string[]
  audience?: string[]
  offerings?: string[]
  goals?: string[]
  cta?: string[]
  content?: string[]
}

export type PersonalityTraitId =
  | 'sophisticated'
  | 'elegant'
  | 'luxurious'
  | 'playful'
  | 'bold'
  | 'rebellious'
  | 'mysterious'
  | 'warm'
  | 'welcoming'
  | 'minimalist'
  | 'creative'
  | 'futuristic'
  | 'authentic'
  | 'adventurous'
  | 'romantic'
  | 'energetic'
  | 'calm'
  | 'professional'
  | 'edgy'
  | 'inspirational'

export type VoiceAttributeId =
  | 'conversational'
  | 'authoritative'
  | 'educational'
  | 'witty'
  | 'emotional'
  | 'inspirational'
  | 'direct'
  | 'friendly'
  | 'confident'
  | 'storytelling'
  | 'informative'
  | 'humorous'

export type CommunicationToneId =
  | 'warm_approachable'
  | 'polished_premium'
  | 'bold_direct'
  | 'calm_reassuring'
  | 'playful_light'
  | 'serious_expert'

export interface CatalogOption<T extends string> {
  id: T
  label: string
  description: string
  aiHints: AiInfluenceHints
}

export interface BrandPersonalityDraft {
  primaryPersonality: PersonalityTraitId | null
  secondaryPersonalities: PersonalityTraitId[]
  voiceAttributes: VoiceAttributeId[]
  communicationTone: CommunicationToneId | null
  customDescriptor: string
}

export type VisualAestheticId =
  | 'modern_luxury'
  | 'editorial'
  | 'minimalist'
  | 'cinematic'
  | 'streetwear'
  | 'vintage'
  | 'futuristic'
  | 'organic'
  | 'playful'
  | 'dark_moody'
  | 'bright_airy'
  | 'elegant'
  | 'artistic'
  | 'industrial'
  | 'retro'

export type ColorPaletteId =
  | 'black_gold'
  | 'cream_charcoal'
  | 'white_neutral'
  | 'earth_tones'
  | 'pastel'
  | 'bold_primary'
  | 'neon'
  | 'monochrome'
  | 'jewel_tones'

export type VisualContentStyleId =
  | 'photography'
  | 'illustration'
  | 'typography'
  | 'product_focused'
  | 'lifestyle'
  | 'cinematic'
  | 'abstract'
  | 'mixed_media'

export type VisualMoodId =
  | 'warm'
  | 'cool'
  | 'dramatic'
  | 'soft'
  | 'vibrant'
  | 'muted'
  | 'high_contrast'
  | 'natural'

export interface ColorPaletteOption extends CatalogOption<ColorPaletteId> {
  /** Hex swatches for UI preview only */
  swatches: string[]
}

export interface VisualIdentityDraft {
  aesthetics: VisualAestheticId[]
  colorPalettes: ColorPaletteId[]
  contentStyles: VisualContentStyleId[]
  moods: VisualMoodId[]
}

export type AudienceTypeId =
  | 'consumers'
  | 'businesses'
  | 'fans'
  | 'professionals'
  | 'students'
  | 'homeowners'
  | 'creators'
  | 'entrepreneurs'
  | 'parents'
  | 'travelers'
  | 'other'

export type AgeRangeId =
  | '18_24'
  | '25_34'
  | '35_44'
  | '45_54'
  | '55_plus'
  | 'all_ages'

export type GeographyId =
  | 'local'
  | 'regional'
  | 'national'
  | 'international'
  | 'online_global'

export type AudienceInterestId =
  | 'music'
  | 'fashion'
  | 'beauty'
  | 'technology'
  | 'design'
  | 'wellness'
  | 'fitness'
  | 'entertainment'
  | 'education'
  | 'business'
  | 'food'
  | 'travel'
  | 'lifestyle'

export type AudienceNeedId =
  | 'education'
  | 'inspiration'
  | 'entertainment'
  | 'convenience'
  | 'affordability'
  | 'luxury'
  | 'community'
  | 'professional_expertise'
  | 'problem_solving'

export type AudienceFamiliarityId =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'mixed'

export interface TargetAudienceDraft {
  /** When true, detailed audience fields are optional */
  unsureYet: boolean
  audienceTypes: AudienceTypeId[]
  ageRanges: AgeRangeId[]
  geography: GeographyId | null
  interests: AudienceInterestId[]
  needs: AudienceNeedId[]
  familiarity: AudienceFamiliarityId | null
  customDescription: string
}

export type OfferingTypeId =
  | 'physical_products'
  | 'digital_products'
  | 'services'
  | 'consultations'
  | 'subscriptions'
  | 'memberships'
  | 'courses'
  | 'events'
  | 'music'
  | 'merchandise'
  | 'content'
  | 'other'

export type MarketingGoalId =
  | 'brand_awareness'
  | 'generate_leads'
  | 'increase_sales'
  | 'grow_social_audience'
  | 'build_community'
  | 'promote_releases'
  | 'drive_website_traffic'
  | 'establish_authority'
  | 'educate_audience'

export type CallToActionId =
  | 'book_now'
  | 'shop_now'
  | 'learn_more'
  | 'subscribe'
  | 'join_community'
  | 'listen_now'
  | 'download'
  | 'visit_website'
  | 'send_message'
  | 'register'

export type ContentPriorityId =
  | 'educational'
  | 'promotional'
  | 'behind_the_scenes'
  | 'storytelling'
  | 'entertainment'
  | 'community'
  | 'product_showcase'
  | 'thought_leadership'

export interface ProductsGoalsDraft {
  offerings: OfferingTypeId[]
  primaryGoal: MarketingGoalId | null
  secondaryGoals: MarketingGoalId[]
  callsToAction: CallToActionId[]
  contentPriorities: ContentPriorityId[]
  offerName: string
  shortDescription: string
  websiteUrl: string
}

/**
 * Local activation / account-sync marker on the draft.
 * Full blueprint payload lives in blueprintStorage + artist_profiles.brand_identity.
 */
export interface BlueprintLocalMeta {
  status: 'activation_ready' | 'account_active'
  preparedAt: string
  schemaVersion: number
  /** Set when Supabase persistence succeeds */
  syncedAt?: string
}

export interface BrandIdentityDraft {
  version: 2
  currentStep: WizardStepId
  updatedAt: string
  creator: CreatorIdentityDraft
  industry: IndustryNicheDraft
  personality: BrandPersonalityDraft
  visual: VisualIdentityDraft
  audience: TargetAudienceDraft
  goals: ProductsGoalsDraft
  /** Local activation-ready marker — not synced to account */
  blueprint?: BlueprintLocalMeta | null
}

export function createEmptyPersonality(): BrandPersonalityDraft {
  return {
    primaryPersonality: null,
    secondaryPersonalities: [],
    voiceAttributes: [],
    communicationTone: null,
    customDescriptor: '',
  }
}

export function createEmptyVisual(): VisualIdentityDraft {
  return {
    aesthetics: [],
    colorPalettes: [],
    contentStyles: [],
    moods: [],
  }
}

export function createEmptyAudience(): TargetAudienceDraft {
  return {
    unsureYet: false,
    audienceTypes: [],
    ageRanges: [],
    geography: null,
    interests: [],
    needs: [],
    familiarity: null,
    customDescription: '',
  }
}

export function createEmptyGoals(): ProductsGoalsDraft {
  return {
    offerings: [],
    primaryGoal: null,
    secondaryGoals: [],
    callsToAction: [],
    contentPriorities: [],
    offerName: '',
    shortDescription: '',
    websiteUrl: '',
  }
}

export function createEmptyDraft(): BrandIdentityDraft {
  return {
    version: 2,
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
    personality: createEmptyPersonality(),
    visual: createEmptyVisual(),
    audience: createEmptyAudience(),
    goals: createEmptyGoals(),
  }
}

/**
 * Normalize drafts from localStorage (v1 or partial) into the current shape.
 */
export function normalizeBrandIdentityDraft(raw: unknown): BrandIdentityDraft {
  const base = createEmptyDraft()
  if (!raw || typeof raw !== 'object') return base

  const incoming = raw as Record<string, unknown>
  const creator = (incoming.creator as CreatorIdentityDraft) || base.creator
  const industry = (incoming.industry as IndustryNicheDraft) || base.industry

  let personality = createEmptyPersonality()
  if (incoming.personality && typeof incoming.personality === 'object') {
    personality = {
      ...createEmptyPersonality(),
      ...(incoming.personality as Partial<BrandPersonalityDraft>),
    }
  }

  let visual = createEmptyVisual()
  if (incoming.visual && typeof incoming.visual === 'object') {
    visual = {
      ...createEmptyVisual(),
      ...(incoming.visual as Partial<VisualIdentityDraft>),
    }
  } else if (incoming.creative && typeof incoming.creative === 'object') {
    visual = createEmptyVisual()
  }

  let audience = createEmptyAudience()
  if (incoming.audience && typeof incoming.audience === 'object') {
    audience = {
      ...createEmptyAudience(),
      ...(incoming.audience as Partial<TargetAudienceDraft>),
    }
  }

  let goals = createEmptyGoals()
  if (incoming.goals && typeof incoming.goals === 'object') {
    goals = {
      ...createEmptyGoals(),
      ...(incoming.goals as Partial<ProductsGoalsDraft>),
    }
  }

  let currentStep = Number(incoming.currentStep) as WizardStepId
  if (![1, 2, 3, 4, 5, 6, 7].includes(currentStep)) {
    currentStep = 1
  }
  if (currentStep > MAX_IMPLEMENTED_STEP) {
    currentStep = MAX_IMPLEMENTED_STEP
  }

  return {
    version: 2,
    currentStep,
    updatedAt:
      typeof incoming.updatedAt === 'string'
        ? incoming.updatedAt
        : new Date().toISOString(),
    creator: {
      ...base.creator,
      ...creator,
      secondaryKinds: Array.isArray(creator.secondaryKinds)
        ? creator.secondaryKinds
        : [],
    },
    industry: {
      selections: Array.isArray(industry.selections) ? industry.selections : [],
      customNiches: Array.isArray(industry.customNiches)
        ? industry.customNiches
        : [],
    },
    personality: {
      ...personality,
      secondaryPersonalities: Array.isArray(personality.secondaryPersonalities)
        ? personality.secondaryPersonalities
        : [],
      voiceAttributes: Array.isArray(personality.voiceAttributes)
        ? personality.voiceAttributes
        : [],
    },
    visual: {
      aesthetics: Array.isArray(visual.aesthetics) ? visual.aesthetics : [],
      colorPalettes: Array.isArray(visual.colorPalettes)
        ? visual.colorPalettes
        : [],
      contentStyles: Array.isArray(visual.contentStyles)
        ? visual.contentStyles
        : [],
      moods: Array.isArray(visual.moods) ? visual.moods : [],
    },
    audience: {
      ...audience,
      unsureYet: Boolean(audience.unsureYet),
      audienceTypes: Array.isArray(audience.audienceTypes)
        ? audience.audienceTypes
        : [],
      ageRanges: Array.isArray(audience.ageRanges) ? audience.ageRanges : [],
      interests: Array.isArray(audience.interests) ? audience.interests : [],
      needs: Array.isArray(audience.needs) ? audience.needs : [],
      customDescription:
        typeof audience.customDescription === 'string'
          ? audience.customDescription
          : '',
    },
    goals: {
      ...goals,
      offerings: Array.isArray(goals.offerings) ? goals.offerings : [],
      secondaryGoals: Array.isArray(goals.secondaryGoals)
        ? goals.secondaryGoals.filter((g) => g !== goals.primaryGoal)
        : [],
      callsToAction: Array.isArray(goals.callsToAction)
        ? goals.callsToAction
        : [],
      contentPriorities: Array.isArray(goals.contentPriorities)
        ? goals.contentPriorities
        : [],
      offerName: typeof goals.offerName === 'string' ? goals.offerName : '',
      shortDescription:
        typeof goals.shortDescription === 'string' ? goals.shortDescription : '',
      websiteUrl: typeof goals.websiteUrl === 'string' ? goals.websiteUrl : '',
    },
    blueprint: normalizeBlueprintMeta(incoming.blueprint),
  }
}

function normalizeBlueprintMeta(raw: unknown): BlueprintLocalMeta | null {
  if (!raw || typeof raw !== 'object') return null
  const m = raw as Record<string, unknown>
  if (m.status !== 'activation_ready' && m.status !== 'account_active') {
    return null
  }
  if (typeof m.preparedAt !== 'string') return null
  return {
    status: m.status,
    preparedAt: m.preparedAt,
    schemaVersion:
      typeof m.schemaVersion === 'number' ? m.schemaVersion : 1,
    syncedAt: typeof m.syncedAt === 'string' ? m.syncedAt : undefined,
  }
}
