'use client'

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

/**
 * M0 Creator & Audience Identity Wizard — Steps 1–2.
 * Authenticated via /app layout middleware. No Supabase profile writes.
 */
export default function OnboardingPage() {
  return <OnboardingWizard />
}
