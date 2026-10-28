'use client'

import {
  MAX_IMPLEMENTED_STEP,
  WIZARD_STEP_LABELS,
  WIZARD_TOTAL_STEPS,
  type WizardStepId,
} from '@/lib/identity/types'

interface WizardProgressProps {
  currentStep: WizardStepId
  /** Highest step with a full UI. Steps beyond show as upcoming. */
  maxImplementedStep?: WizardStepId
}

export function WizardProgress({
  currentStep,
  maxImplementedStep = MAX_IMPLEMENTED_STEP,
}: WizardProgressProps) {
  const steps = Array.from({ length: WIZARD_TOTAL_STEPS }, (_, i) => (i + 1) as WizardStepId)

  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {steps.map((step) => {
          const isCurrent = step === currentStep
          const isComplete = step < currentStep
          const isAvailable = step <= maxImplementedStep
          const label = WIZARD_STEP_LABELS[step]

          return (
            <li key={step} className="flex-1 min-w-0">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  isCurrent
                    ? 'bg-purple-500'
                    : isComplete
                      ? 'bg-purple-500/70'
                      : 'bg-gray-800'
                }`}
                aria-hidden
              />
              <span
                className={`mt-2 hidden sm:block text-[10px] md:text-xs truncate ${
                  isCurrent
                    ? 'text-purple-300 font-medium'
                    : isAvailable
                      ? 'text-gray-500'
                      : 'text-gray-700'
                }`}
              >
                {step}. {label}
              </span>
              <span className="sr-only">
                Step {step}: {label}
                {isCurrent ? ' (current)' : isComplete ? ' (completed)' : ''}
                {!isAvailable ? ' (coming soon)' : ''}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-sm text-gray-400">
        Step {currentStep} of {WIZARD_TOTAL_STEPS}
        {currentStep <= maxImplementedStep
          ? ` — ${WIZARD_STEP_LABELS[currentStep]}`
          : ''}
        {currentStep > maxImplementedStep ? ' — Coming soon' : ''}
      </p>
    </nav>
  )
}
