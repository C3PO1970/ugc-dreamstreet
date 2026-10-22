/**
 * Reserved step modules for M1–M5 (not implemented in M0).
 * Keeps import paths stable for future:
 * - StepBrandPersonality
 * - StepAudienceIdentity
 * - StepGoals
 * - StepCreativeDirection
 * - StepBrandBlueprint
 */
export const FUTURE_ONBOARDING_STEPS = [
  'personality',
  'audience',
  'goals',
  'creative',
  'blueprint',
] as const
