'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { WizardProgress } from './WizardProgress'
import {
  StepCreatorIdentity,
  validateCreatorIdentity,
} from './steps/StepCreatorIdentity'
import {
  StepIndustryNiche,
  validateIndustryNiche,
} from './steps/StepIndustryNiche'
import {
  StepBrandPersonality,
  validateBrandPersonality,
} from './steps/StepBrandPersonality'
import {
  StepVisualIdentity,
  validateVisualIdentity,
} from './steps/StepVisualIdentity'
import {
  StepTargetAudience,
  validateTargetAudience,
} from './steps/StepTargetAudience'
import {
  StepProductsGoals,
  validateProductsGoals,
} from './steps/StepProductsGoals'
import {
  StepBrandReview,
  validateWizardForReview,
} from './steps/StepBrandReview'
import {
  type BrandIdentityDraft,
  type WizardStepId,
  MAX_IMPLEMENTED_STEP,
  createEmptyDraft,
} from '@/lib/identity/types'
import {
  loadIdentityDraft,
  saveIdentityDraft,
} from '@/lib/identity/draftStorage'
import {
  blueprintMetaFrom,
  buildBrandBlueprint,
  clearBrandBlueprint,
  saveBrandBlueprint,
} from '@/lib/identity/blueprint'
import {
  invalidateLocalActivation,
  reconcileLocalAndAccountDrafts,
  type DraftReconcileDecision,
} from '@/lib/identity/draftReconcile'

const ACCOUNT_SUCCESS_MESSAGE =
  'Brand activated and saved to your account.'

type ConflictState = Extract<DraftReconcileDecision, { kind: 'conflict' }>

/**
 * Steps 1–7. Drafts autosave locally; Activate persists blueprint to Supabase.
 */
export function OnboardingWizard() {
  const [draft, setDraft] = useState<BrandIdentityDraft>(() => createEmptyDraft())
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedHint, setSavedHint] = useState<string | null>(null)
  const [activationMessage, setActivationMessage] = useState<string | null>(null)
  const [activating, setActivating] = useState(false)
  const [conflict, setConflict] = useState<ConflictState | null>(null)
  const activateLock = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const local = loadIdentityDraft()

      let accountDraft: BrandIdentityDraft | null = null
      try {
        const res = await fetch('/api/brand-identity', { method: 'GET' })
        if (res.ok) {
          const data = (await res.json()) as {
            draft?: BrandIdentityDraft | null
          }
          accountDraft = data.draft ?? null
        } else if (res.status === 503) {
          // Migration not applied yet — continue with local only
          const data = (await res.json().catch(() => ({}))) as {
            error?: string
          }
          if (!cancelled && data.error) {
            setSavedHint(data.error)
            window.setTimeout(() => setSavedHint(null), 4000)
          }
        }
      } catch {
        // Offline / network — keep local draft
      }

      if (cancelled) return

      const decision = reconcileLocalAndAccountDrafts(local, accountDraft)

      if (decision.kind === 'conflict') {
        setConflict(decision)
        // Hold local edits in memory; do not overwrite account or discard local
        setDraft(decision.local)
        setActivationMessage(null)
      } else {
        setConflict(null)
        setDraft(decision.draft)
        if (decision.draft.blueprint?.status === 'account_active') {
          setActivationMessage(ACCOUNT_SUCCESS_MESSAGE)
          saveIdentityDraft(decision.draft)
        } else if (decision.kind === 'use_account') {
          saveIdentityDraft(decision.draft)
        }
      }

      setHydrated(true)
    }

    bootstrap().catch(() => {
      if (!cancelled) {
        setDraft(loadIdentityDraft() ?? createEmptyDraft())
        setHydrated(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(
    (next: BrandIdentityDraft, showHint = true) => {
      setDraft(next)
      const ok = saveIdentityDraft(next)
      if (showHint) {
        setSavedHint(ok ? 'Draft saved' : 'Could not save draft in this browser')
        window.setTimeout(() => setSavedHint(null), 1800)
      }
      return ok
    },
    []
  )

  /** Persist a content edit and invalidate stale activation markers. */
  const persistEdit = useCallback(
    (next: BrandIdentityDraft) => {
      const invalidated = invalidateLocalActivation(next)
      clearBrandBlueprint()
      setActivationMessage(null)
      setError(null)
      persist(invalidated, false)
    },
    [persist]
  )

  const reviewIssues = useMemo(
    () => (draft.currentStep === 7 ? validateWizardForReview(draft) : []),
    [draft]
  )

  function validateStep(step: WizardStepId): string | null {
    if (step === 1) return validateCreatorIdentity(draft.creator)
    if (step === 2) return validateIndustryNiche(draft.industry)
    if (step === 3) return validateBrandPersonality(draft.personality)
    if (step === 4) return validateVisualIdentity(draft.visual)
    if (step === 5) return validateTargetAudience(draft.audience)
    if (step === 6) return validateProductsGoals(draft.goals)
    if (step === 7) {
      const issues = validateWizardForReview(draft)
      if (issues.length === 0) return null
      return `Complete incomplete sections before finishing: ${issues
        .map((i) => i.label)
        .join(', ')}.`
    }
    return null
  }

  function goNext() {
    setError(null)

    if (draft.currentStep === 6) {
      const allIssues = validateWizardForReview(draft)
      if (allIssues.length > 0) {
        const step6 = validateProductsGoals(draft.goals)
        if (step6) {
          setError(step6)
          return
        }
        setError(
          `Finish these before review: ${allIssues
            .map((i) => i.label)
            .join(', ')}.`
        )
        return
      }
    } else {
      const msg = validateStep(draft.currentStep)
      if (msg) {
        setError(msg)
        return
      }
    }

    if (draft.currentStep < MAX_IMPLEMENTED_STEP) {
      const nextStep = (draft.currentStep + 1) as WizardStepId
      persist({ ...draft, currentStep: nextStep }, false)
      return
    }

    persist({ ...draft, currentStep: 7 }, false)
  }

  function goBack() {
    setError(null)
    if (draft.currentStep > 1) {
      const prev = (draft.currentStep - 1) as WizardStepId
      persist({ ...draft, currentStep: prev }, false)
    }
  }

  function handleEditStep(step: WizardStepId) {
    setError(null)
    persist({ ...draft, currentStep: step }, false)
  }

  function handleSaveDraft() {
    setError(null)
    const ok = persist(draft, true)
    if (!ok) {
      setError(
        'Draft could not be saved (storage full or private browsing). Your selections remain on this page until you leave.'
      )
    }
  }

  function resolveConflict(choice: 'local' | 'account') {
    if (!conflict) return
    const chosen = choice === 'local' ? conflict.local : conflict.account
    setConflict(null)
    persist(chosen, false)
    if (chosen.blueprint?.status === 'account_active') {
      setActivationMessage(ACCOUNT_SUCCESS_MESSAGE)
    } else {
      setActivationMessage(null)
    }
  }

  async function handleActivate() {
    if (activateLock.current || activating) return

    setError(null)
    const issues = validateWizardForReview(draft)
    if (issues.length > 0) {
      setError(
        `Cannot activate yet — fix: ${issues.map((i) => i.label).join(', ')}.`
      )
      setActivationMessage(null)
      return
    }

    activateLock.current = true
    setActivating(true)

    const blueprint = buildBrandBlueprint(draft)
    // Keep local copy as backup if account save fails
    saveBrandBlueprint(blueprint)

    try {
      const res = await fetch('/api/brand-identity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          wizardStep: 7,
        }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        code?: string
        wizardCompletedAt?: string
        ok?: boolean
      }

      if (!res.ok) {
        setError(
          data.error ||
            'Could not save brand identity to your account. Your local draft is preserved.'
        )
        setActivationMessage(null)
        // Preserve local activation_ready as fallback marker only
        persist(
          {
            ...draft,
            currentStep: 7,
            blueprint: blueprintMetaFrom(blueprint),
          },
          false
        )
        return
      }

      const syncedAt = data.wizardCompletedAt || new Date().toISOString()
      const next: BrandIdentityDraft = {
        ...draft,
        currentStep: 7,
        updatedAt: syncedAt,
        blueprint: {
          status: 'account_active',
          preparedAt: blueprint.preparedAt,
          schemaVersion: blueprint.schemaVersion,
          syncedAt,
        },
      }
      persist(next, false)
      saveBrandBlueprint(blueprint)
      setConflict(null)
      setActivationMessage(ACCOUNT_SUCCESS_MESSAGE)
      setSavedHint('Saved to your account')
      window.setTimeout(() => setSavedHint(null), 2500)
    } catch {
      setError(
        'Network error while saving. Your local draft is preserved — try again when online.'
      )
      setActivationMessage(null)
    } finally {
      setActivating(false)
      activateLock.current = false
    }
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading wizard…
      </div>
    )
  }

  const onReview = draft.currentStep === 7
  const accountSynced = draft.blueprint?.status === 'account_active'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-purple-400 mb-1">
            Brand identity
          </p>
          <h1 className="text-lg font-semibold text-white sm:hidden">Onboarding</h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            {accountSynced
              ? 'Saved to your account. Local drafts still autosave while you edit.'
              : 'Drafts autosave in this browser. Activate to save to your account.'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {savedHint && (
            <span className="text-xs text-green-400/90" aria-live="polite">
              {savedHint}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
          >
            Save Draft
          </button>
          <Link
            href="/app/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Exit
          </Link>
        </div>
      </div>

      {conflict && (
        <div
          role="alertdialog"
          aria-labelledby="draft-conflict-title"
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3"
        >
          <h2
            id="draft-conflict-title"
            className="text-sm font-semibold text-amber-100"
          >
            Browser draft differs from your account
          </h2>
          <p className="text-xs text-amber-100/80">
            This browser has unsaved edits that do not match the brand identity
            saved to your account. Choose which version to keep. Nothing is
            discarded until you choose.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => resolveConflict('local')}
              className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-50 text-sm font-medium hover:bg-amber-500/30"
            >
              Keep browser draft
            </button>
            <button
              type="button"
              onClick={() => resolveConflict('account')}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm font-medium hover:bg-gray-700"
            >
              Use account version
            </button>
          </div>
        </div>
      )}

      <WizardProgress
        currentStep={draft.currentStep}
        maxImplementedStep={MAX_IMPLEMENTED_STEP}
      />

      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 sm:p-8">
        {draft.currentStep === 1 && (
          <StepCreatorIdentity
            value={draft.creator}
            onChange={(creator) => persistEdit({ ...draft, creator })}
          />
        )}
        {draft.currentStep === 2 && (
          <StepIndustryNiche
            value={draft.industry}
            onChange={(industry) => persistEdit({ ...draft, industry })}
          />
        )}
        {draft.currentStep === 3 && (
          <StepBrandPersonality
            value={draft.personality}
            onChange={(personality) => persistEdit({ ...draft, personality })}
          />
        )}
        {draft.currentStep === 4 && (
          <StepVisualIdentity
            value={draft.visual}
            onChange={(visual) => persistEdit({ ...draft, visual })}
          />
        )}
        {draft.currentStep === 5 && (
          <StepTargetAudience
            value={draft.audience}
            onChange={(audience) => persistEdit({ ...draft, audience })}
          />
        )}
        {draft.currentStep === 6 && (
          <StepProductsGoals
            value={draft.goals}
            onChange={(goals) => persistEdit({ ...draft, goals })}
          />
        )}
        {draft.currentStep === 7 && (
          <StepBrandReview
            draft={draft}
            issues={reviewIssues}
            activationMessage={activationMessage}
            activating={activating}
            onEditStep={handleEditStep}
            onActivate={handleActivate}
          />
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={draft.currentStep <= 1}
          className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-200 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
          >
            Save Draft
          </button>
          {!onReview && (
            <button
              type="button"
              onClick={goNext}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-600">
        AI content generation from this blueprint arrives in Task 2E-2.
      </p>
    </div>
  )
}
