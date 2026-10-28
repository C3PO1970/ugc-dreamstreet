/**
 * Future AI integration helpers.
 * Builds structured instruction fragments from wizard catalogs.
 * Not wired to /api/generate yet — no paid AI calls.
 */

import {
  AGE_RANGES,
  AUDIENCE_FAMILIARITY,
  AUDIENCE_INTERESTS,
  AUDIENCE_NEEDS,
  AUDIENCE_TYPES,
  CALLS_TO_ACTION,
  COLOR_PALETTES,
  COMMUNICATION_TONES,
  CONTENT_PRIORITIES,
  GEOGRAPHY_OPTIONS,
  MARKETING_GOALS,
  OFFERING_TYPES,
  PERSONALITY_TRAITS,
  VISUAL_AESTHETICS,
  VISUAL_CONTENT_STYLES,
  VISUAL_MOODS,
  VOICE_ATTRIBUTES,
} from './catalogs'
import type { BrandIdentityDraft, AiInfluenceHints } from './types'

function mergeHints(target: AiInfluenceHints, source?: AiInfluenceHints) {
  if (!source) return
  ;(Object.keys(source) as (keyof AiInfluenceHints)[]).forEach((key) => {
    const values = source[key]
    if (!values?.length) return
    const existing = new Set(target[key] ?? [])
    values.forEach((v) => existing.add(v))
    target[key] = Array.from(existing)
  })
}

/**
 * Project Steps 3–6 (and available identity) into stable AI hint bags.
 * Identifiers remain catalog IDs for future prompt builders.
 */
export function projectBrandIdentityToAiHints(
  draft: BrandIdentityDraft
): {
  personalityIds: string[]
  voiceIds: string[]
  toneId: string | null
  aestheticIds: string[]
  paletteIds: string[]
  contentStyleIds: string[]
  moodIds: string[]
  audienceTypeIds: string[]
  ageRangeIds: string[]
  geographyId: string | null
  interestIds: string[]
  needIds: string[]
  familiarityId: string | null
  audienceUnsure: boolean
  offeringIds: string[]
  primaryGoalId: string | null
  secondaryGoalIds: string[]
  ctaIds: string[]
  contentPriorityIds: string[]
  hints: AiInfluenceHints
  customDescriptor: string
  audienceCustomDescription: string
  offerName: string
  offerDescription: string
  websiteUrl: string
} {
  const hints: AiInfluenceHints = {}

  const primary = PERSONALITY_TRAITS.find(
    (t) => t.id === draft.personality.primaryPersonality
  )
  mergeHints(hints, primary?.aiHints)

  draft.personality.secondaryPersonalities.forEach((id) => {
    mergeHints(hints, PERSONALITY_TRAITS.find((t) => t.id === id)?.aiHints)
  })

  draft.personality.voiceAttributes.forEach((id) => {
    mergeHints(hints, VOICE_ATTRIBUTES.find((t) => t.id === id)?.aiHints)
  })

  const tone = COMMUNICATION_TONES.find(
    (t) => t.id === draft.personality.communicationTone
  )
  mergeHints(hints, tone?.aiHints)

  draft.visual.aesthetics.forEach((id) => {
    mergeHints(hints, VISUAL_AESTHETICS.find((t) => t.id === id)?.aiHints)
  })
  draft.visual.colorPalettes.forEach((id) => {
    mergeHints(hints, COLOR_PALETTES.find((t) => t.id === id)?.aiHints)
  })
  draft.visual.contentStyles.forEach((id) => {
    mergeHints(hints, VISUAL_CONTENT_STYLES.find((t) => t.id === id)?.aiHints)
  })
  draft.visual.moods.forEach((id) => {
    mergeHints(hints, VISUAL_MOODS.find((t) => t.id === id)?.aiHints)
  })

  if (!draft.audience.unsureYet) {
    draft.audience.audienceTypes.forEach((id) => {
      mergeHints(hints, AUDIENCE_TYPES.find((t) => t.id === id)?.aiHints)
    })
    draft.audience.ageRanges.forEach((id) => {
      mergeHints(hints, AGE_RANGES.find((t) => t.id === id)?.aiHints)
    })
    if (draft.audience.geography) {
      mergeHints(
        hints,
        GEOGRAPHY_OPTIONS.find((t) => t.id === draft.audience.geography)?.aiHints
      )
    }
    draft.audience.interests.forEach((id) => {
      mergeHints(hints, AUDIENCE_INTERESTS.find((t) => t.id === id)?.aiHints)
    })
    draft.audience.needs.forEach((id) => {
      mergeHints(hints, AUDIENCE_NEEDS.find((t) => t.id === id)?.aiHints)
    })
    if (draft.audience.familiarity) {
      mergeHints(
        hints,
        AUDIENCE_FAMILIARITY.find((t) => t.id === draft.audience.familiarity)
          ?.aiHints
      )
    }
  } else {
    mergeHints(hints, {
      audience: ['audience still exploratory'],
      messaging: ['keep audience assumptions light'],
    })
  }

  draft.goals.offerings.forEach((id) => {
    mergeHints(hints, OFFERING_TYPES.find((t) => t.id === id)?.aiHints)
  })
  if (draft.goals.primaryGoal) {
    mergeHints(
      hints,
      MARKETING_GOALS.find((t) => t.id === draft.goals.primaryGoal)?.aiHints
    )
  }
  draft.goals.secondaryGoals.forEach((id) => {
    mergeHints(hints, MARKETING_GOALS.find((t) => t.id === id)?.aiHints)
  })
  draft.goals.callsToAction.forEach((id) => {
    mergeHints(hints, CALLS_TO_ACTION.find((t) => t.id === id)?.aiHints)
  })
  draft.goals.contentPriorities.forEach((id) => {
    mergeHints(hints, CONTENT_PRIORITIES.find((t) => t.id === id)?.aiHints)
  })

  return {
    personalityIds: [
      ...(draft.personality.primaryPersonality
        ? [draft.personality.primaryPersonality]
        : []),
      ...draft.personality.secondaryPersonalities,
    ],
    voiceIds: [...draft.personality.voiceAttributes],
    toneId: draft.personality.communicationTone,
    aestheticIds: [...draft.visual.aesthetics],
    paletteIds: [...draft.visual.colorPalettes],
    contentStyleIds: [...draft.visual.contentStyles],
    moodIds: [...draft.visual.moods],
    audienceTypeIds: [...draft.audience.audienceTypes],
    ageRangeIds: [...draft.audience.ageRanges],
    geographyId: draft.audience.geography,
    interestIds: [...draft.audience.interests],
    needIds: [...draft.audience.needs],
    familiarityId: draft.audience.familiarity,
    audienceUnsure: draft.audience.unsureYet,
    offeringIds: [...draft.goals.offerings],
    primaryGoalId: draft.goals.primaryGoal,
    secondaryGoalIds: [...draft.goals.secondaryGoals],
    ctaIds: [...draft.goals.callsToAction],
    contentPriorityIds: [...draft.goals.contentPriorities],
    hints,
    customDescriptor: draft.personality.customDescriptor.trim(),
    audienceCustomDescription: draft.audience.customDescription.trim(),
    offerName: draft.goals.offerName.trim(),
    offerDescription: draft.goals.shortDescription.trim(),
    websiteUrl: draft.goals.websiteUrl.trim(),
  }
}
