/**
 * Pure wizard validators — safe for client and server (API) use.
 */

import type {
  BrandIdentityDraft,
  BrandPersonalityDraft,
  CreatorIdentityDraft,
  IndustryNicheDraft,
  ProductsGoalsDraft,
  TargetAudienceDraft,
  VisualIdentityDraft,
  WizardStepId,
} from './types'
import { WIZARD_STEP_LABELS } from './types'
import type { BrandBlueprint, WizardValidationIssue } from './blueprint'
import { normalizeBrandBlueprint } from './blueprint'

export function validateCreatorIdentity(
  value: CreatorIdentityDraft
): string | null {
  if (!value.entityType) return 'Select Individual or Organization.'
  if (!value.displayName.trim()) return 'Enter a display name.'
  if (!value.primaryKind) return 'Select a primary identity.'
  if (value.primaryKind === 'other' && !value.otherKindLabel.trim()) {
    return 'Describe your identity for “Other”.'
  }
  return null
}

export function validateIndustryNiche(value: IndustryNicheDraft): string | null {
  if (value.selections.length === 0 && value.customNiches.length === 0) {
    return 'Select at least one industry, niche, or custom niche.'
  }
  return null
}

export function validateBrandPersonality(
  value: BrandPersonalityDraft
): string | null {
  if (!value.primaryPersonality) {
    return 'Select a primary personality.'
  }
  if (value.voiceAttributes.length === 0) {
    return 'Select at least one brand voice attribute.'
  }
  if (!value.communicationTone) {
    return 'Select a preferred communication tone.'
  }
  return null
}

export function validateVisualIdentity(value: VisualIdentityDraft): string | null {
  if (value.aesthetics.length === 0) {
    return 'Select at least one visual aesthetic.'
  }
  if (value.colorPalettes.length === 0) {
    return 'Select at least one color direction.'
  }
  if (value.contentStyles.length === 0) {
    return 'Select at least one visual content style.'
  }
  if (value.moods.length === 0) {
    return 'Select at least one visual mood.'
  }
  return null
}

export function validateTargetAudience(value: TargetAudienceDraft): string | null {
  if (value.unsureYet) return null

  if (value.audienceTypes.length === 0) {
    return 'Select at least one audience type, or choose “I’m not sure yet.”'
  }
  if (value.ageRanges.length === 0) {
    return 'Select at least one age range, or choose “I’m not sure yet.”'
  }
  if (value.ageRanges.includes('all_ages') && value.ageRanges.length > 1) {
    return '“All Ages” cannot be combined with specific age ranges.'
  }
  if (!value.geography) {
    return 'Select a geography, or choose “I’m not sure yet.”'
  }
  if (value.interests.length === 0) {
    return 'Select at least one audience interest, or choose “I’m not sure yet.”'
  }
  if (value.needs.length === 0) {
    return 'Select at least one audience need, or choose “I’m not sure yet.”'
  }
  if (value.needs.includes('luxury') && value.needs.includes('affordability')) {
    return 'Choose either Luxury or Affordability — not both.'
  }
  if (!value.familiarity) {
    return 'Select audience familiarity, or choose “I’m not sure yet.”'
  }
  return null
}

function looksLikeUrl(raw: string): boolean {
  const trimmed = raw.trim()
  if (!trimmed) return true
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`
    const u = new URL(withProtocol)
    return Boolean(u.hostname.includes('.'))
  } catch {
    return false
  }
}

export function validateProductsGoals(value: ProductsGoalsDraft): string | null {
  if (value.offerings.length === 0) {
    return 'Select at least one offering type.'
  }
  if (!value.primaryGoal) {
    return 'Choose a primary marketing goal.'
  }
  if (value.secondaryGoals.includes(value.primaryGoal)) {
    return 'Secondary goals cannot include your primary goal.'
  }
  if (value.callsToAction.length === 0) {
    return 'Select at least one call to action.'
  }
  if (value.contentPriorities.length === 0) {
    return 'Select at least one content priority.'
  }
  if (!looksLikeUrl(value.websiteUrl)) {
    return 'Enter a valid website URL, or leave it blank.'
  }
  return null
}

export function validateWizardForReview(
  draft: BrandIdentityDraft
): WizardValidationIssue[] {
  const checks: { step: WizardStepId; message: string | null }[] = [
    { step: 1, message: validateCreatorIdentity(draft.creator) },
    { step: 2, message: validateIndustryNiche(draft.industry) },
    { step: 3, message: validateBrandPersonality(draft.personality) },
    { step: 4, message: validateVisualIdentity(draft.visual) },
    { step: 5, message: validateTargetAudience(draft.audience) },
    { step: 6, message: validateProductsGoals(draft.goals) },
  ]

  return checks
    .filter((c): c is { step: WizardStepId; message: string } => Boolean(c.message))
    .map((c) => ({
      step: c.step,
      label: WIZARD_STEP_LABELS[c.step],
      message: c.message,
    }))
}

/** Server-side blueprint gate before Supabase write. */
export function validateBlueprintForPersistence(
  raw: unknown
): { ok: true; blueprint: BrandBlueprint } | { ok: false; error: string; issues?: WizardValidationIssue[] } {
  const blueprint = normalizeBrandBlueprint(raw)
  if (!blueprint) {
    return { ok: false, error: 'Invalid brand blueprint payload.' }
  }

  const asDraft: BrandIdentityDraft = {
    version: 2,
    currentStep: 7,
    updatedAt: blueprint.preparedAt,
    creator: blueprint.creator,
    industry: blueprint.industry,
    personality: blueprint.personality,
    visual: blueprint.visual,
    audience: blueprint.audience,
    goals: blueprint.goals,
    blueprint: {
      status: 'activation_ready',
      preparedAt: blueprint.preparedAt,
      schemaVersion: blueprint.schemaVersion,
    },
  }

  const issues = validateWizardForReview(asDraft)
  if (issues.length > 0) {
    return {
      ok: false,
      error: `Incomplete brand identity: ${issues.map((i) => i.label).join(', ')}.`,
      issues,
    }
  }

  return { ok: true, blueprint }
}

/** Stable content fingerprint for local vs account reconciliation. */
export function identityContentFingerprint(parts: {
  creator: CreatorIdentityDraft
  industry: IndustryNicheDraft
  personality: BrandPersonalityDraft
  visual: VisualIdentityDraft
  audience: TargetAudienceDraft
  goals: ProductsGoalsDraft
}): string {
  return JSON.stringify({
    creator: parts.creator,
    industry: parts.industry,
    personality: parts.personality,
    visual: parts.visual,
    audience: parts.audience,
    goals: parts.goals,
  })
}
