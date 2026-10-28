/**
 * Reconcile localStorage drafts with account-saved brand identity.
 * Never silently overwrites newer account data with stale browser data.
 */

import type { BrandIdentityDraft } from './types'
import { createEmptyDraft, normalizeBrandIdentityDraft } from './types'
import { identityContentFingerprint } from './stepValidation'

export type DraftReconcileDecision =
  | { kind: 'use_account'; draft: BrandIdentityDraft }
  | { kind: 'use_local'; draft: BrandIdentityDraft }
  | { kind: 'empty'; draft: BrandIdentityDraft }
  | {
      kind: 'conflict'
      local: BrandIdentityDraft
      account: BrandIdentityDraft
      localFingerprint: string
      accountFingerprint: string
    }

function hasMeaningfulContent(draft: BrandIdentityDraft): boolean {
  return (
    Boolean(draft.creator.displayName.trim()) ||
    Boolean(draft.creator.primaryKind) ||
    draft.industry.selections.length > 0 ||
    draft.industry.customNiches.length > 0 ||
    Boolean(draft.personality.primaryPersonality) ||
    draft.visual.aesthetics.length > 0 ||
    draft.audience.audienceTypes.length > 0 ||
    draft.audience.unsureYet ||
    draft.goals.offerings.length > 0 ||
    Boolean(draft.blueprint)
  )
}

export function reconcileLocalAndAccountDrafts(
  localRaw: BrandIdentityDraft | null,
  accountRaw: BrandIdentityDraft | null
): DraftReconcileDecision {
  const local = localRaw ? normalizeBrandIdentityDraft(localRaw) : null
  const account = accountRaw ? normalizeBrandIdentityDraft(accountRaw) : null

  const localOk = local && hasMeaningfulContent(local)
  const accountOk = account && hasMeaningfulContent(account)

  if (!localOk && !accountOk) {
    return { kind: 'empty', draft: createEmptyDraft() }
  }
  if (!localOk && accountOk) {
    return { kind: 'use_account', draft: account! }
  }
  if (localOk && !accountOk) {
    return { kind: 'use_local', draft: local! }
  }

  const localFp = identityContentFingerprint(local!)
  const accountFp = identityContentFingerprint(account!)

  if (localFp === accountFp) {
    // Prefer account meta (synced timestamps) while keeping shared content
    return {
      kind: 'use_account',
      draft: {
        ...account!,
        currentStep: local!.currentStep || account!.currentStep,
      },
    }
  }

  return {
    kind: 'conflict',
    local: local!,
    account: account!,
    localFingerprint: localFp,
    accountFingerprint: accountFp,
  }
}

/** Invalidate local activation markers after content edits. */
export function invalidateLocalActivation(
  draft: BrandIdentityDraft
): BrandIdentityDraft {
  if (!draft.blueprint) return draft
  return {
    ...draft,
    blueprint: null,
  }
}
