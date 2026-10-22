'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { WizardProgress } from './WizardProgress'
import { StepCreatorIdentity, validateCreatorIdentity } from './steps/StepCreatorIdentity'
import { StepIndustryNiche, validateIndustryNiche } from './steps/StepIndustryNiche'
import {
  type BrandIdentityDraft,
  type WizardStepId,
  createEmptyDraft,
} from '@/lib/identity/types'
import { loadOrCreateIdentityDraft, saveIdentityDraft } from '@/lib/identity/draftStorage'

const MAX_IMPLEMENTED_STEP: WizardStepId = 2

/**
 * M0: Steps 1–2 only.
 * Steps 3–7 are reserved in progress UI; navigation stops at step 2.
 * No Supabase writes — local React state + optional localStorage only.
 */
export function OnboardingWizard() {
  const [draft, setDraft] = useState<BrandIdentityDraft>(() => createEmptyDraft())
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedHint, setSavedHint] = useState(false)

  useEffect(() => {
    const loaded = loadOrCreateIdentityDraft()
    // Clamp to implemented steps for M0
    const currentStep =
      loaded.currentStep > MAX_IMPLEMENTED_STEP ? MAX_IMPLEMENTED_STEP : loaded.currentStep
    setDraft({ ...loaded, currentStep })
    setHydrated(true)
  }, [])

  const persist = useCallback((next: BrandIdentityDraft) => {
    setDraft(next)
    saveIdentityDraft(next)
    setSavedHint(true)
    window.setTimeout(() => setSavedHint(false), 1500)
  }, [])

  function goNext() {
    setError(null)
    if (draft.currentStep === 1) {
      const msg = validateCreatorIdentity(draft.creator)
      if (msg) {
        setError(msg)
        return
      }
      persist({ ...draft, currentStep: 2 })
      return
    }
    if (draft.currentStep === 2) {
      const msg = validateIndustryNiche(draft.industry)
      if (msg) {
        setError(msg)
        return
      }
      // M0 complete for implemented steps — stay on 2, show completion note
      persist({ ...draft, currentStep: 2 })
      setError(null)
      setCompletedM0(true)
    }
  }

  const [completedM0, setCompletedM0] = useState(false)

  function goBack() {
    setError(null)
    setCompletedM0(false)
    if (draft.currentStep === 2) {
      persist({ ...draft, currentStep: 1 })
    }
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading wizard…
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-purple-400 mb-1">
            Brand identity
          </p>
          <h1 className="text-lg font-semibold text-white sm:hidden">Onboarding</h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Draft saved in this browser only — not written to your account yet.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {savedHint && (
            <span className="text-xs text-green-400/90" aria-live="polite">
              Draft saved
            </span>
          )}
          <Link
            href="/app/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Exit
          </Link>
        </div>
      </div>

      <WizardProgress
        currentStep={draft.currentStep}
        maxImplementedStep={MAX_IMPLEMENTED_STEP}
      />

      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 sm:p-8">
        {draft.currentStep === 1 && (
          <StepCreatorIdentity
            value={draft.creator}
            onChange={(creator) => persist({ ...draft, creator })}
          />
        )}
        {draft.currentStep === 2 && (
          <StepIndustryNiche
            value={draft.industry}
            onChange={(industry) => persist({ ...draft, industry })}
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

        {completedM0 && draft.currentStep === 2 && !error && (
          <div
            role="status"
            className="mt-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm"
          >
            Steps 1–2 draft complete. Personality, audience, goals, and blueprint steps
            come next — your selections stay in this browser until account save is enabled.
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
        <button
          type="button"
          onClick={goNext}
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
        >
          {draft.currentStep === 1 ? 'Next' : 'Complete steps 1–2'}
        </button>
      </div>

      <p className="text-center text-xs text-gray-600">
        Steps 3–7 (personality, audience, goals, creative, blueprint) are prepared in the
        progress bar and will unlock in later milestones.
      </p>
    </div>
  )
}
