'use client'

import type { ReactNode } from 'react'
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
  CREATOR_KIND_OPTIONS,
  GEOGRAPHY_OPTIONS,
  MARKETING_GOALS,
  OFFERING_TYPES,
  PERSONALITY_TRAITS,
  VISUAL_AESTHETICS,
  VISUAL_CONTENT_STYLES,
  VISUAL_MOODS,
  VOICE_ATTRIBUTES,
} from '@/lib/identity/catalogs'
import type {
  BrandIdentityDraft,
  WizardStepId,
} from '@/lib/identity/types'
import type { WizardValidationIssue } from '@/lib/identity/blueprint'

export { validateWizardForReview } from '@/lib/identity/stepValidation'

interface StepBrandReviewProps {
  draft: BrandIdentityDraft
  issues: WizardValidationIssue[]
  activationMessage: string | null
  activating: boolean
  onEditStep: (step: WizardStepId) => void
  onActivate: () => void
}

function labelOf<T extends string>(
  id: T | null | undefined,
  options: { id: T; label: string }[]
): string | null {
  if (!id) return null
  return options.find((o) => o.id === id)?.label ?? id
}

function labelsOf<T extends string>(
  ids: T[],
  options: { id: T; label: string }[]
): string[] {
  return ids.map((id) => labelOf(id, options) ?? id)
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-800/80 border border-gray-700 text-xs text-gray-200">
      {children}
    </span>
  )
}

function ReviewSection({
  step,
  title,
  onEdit,
  children,
}: {
  step: WizardStepId
  title: string
  onEdit: (step: WizardStepId) => void
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-950/50 p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
            Step {step}
          </p>
          <h2 className="text-base font-semibold text-white mt-0.5">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-200 hover:border-purple-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-300">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3 gap-1">
      <dt className="text-xs text-gray-500 sm:w-36 shrink-0 pt-0.5">{label}</dt>
      <dd className="min-w-0 flex-1 flex flex-wrap gap-1.5">{children}</dd>
    </div>
  )
}

function EmptyHint() {
  return <span className="text-xs text-gray-600 italic">Not set</span>
}

export function StepBrandReview({
  draft,
  issues,
  activationMessage,
  activating,
  onEditStep,
  onActivate,
}: StepBrandReviewProps) {
  const { creator, industry, personality, visual, audience, goals } = draft
  const isAccountActive = draft.blueprint?.status === 'account_active'
  const canActivate = issues.length === 0

  const primaryKind = labelOf(creator.primaryKind, CREATOR_KIND_OPTIONS)
  const secondaryKinds = labelsOf(creator.secondaryKinds, CREATOR_KIND_OPTIONS)
  const primaryPersonality = labelOf(
    personality.primaryPersonality,
    PERSONALITY_TRAITS
  )
  const secondaryPersonalities = labelsOf(
    personality.secondaryPersonalities,
    PERSONALITY_TRAITS
  )
  const voiceAttrs = labelsOf(personality.voiceAttributes, VOICE_ATTRIBUTES)
  const tone = labelOf(personality.communicationTone, COMMUNICATION_TONES)

  const aesthetics = labelsOf(visual.aesthetics, VISUAL_AESTHETICS)
  const contentStyles = labelsOf(visual.contentStyles, VISUAL_CONTENT_STYLES)
  const moods = labelsOf(visual.moods, VISUAL_MOODS)
  const palettes = visual.colorPalettes
    .map((id) => COLOR_PALETTES.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Review &amp; activate</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Confirm your brand blueprint, then activate to save it securely to your
          DreamStreet account.
        </p>
      </div>

      {issues.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 space-y-2"
        >
          <p className="text-sm font-medium text-amber-200">
            Complete these sections before activating
          </p>
          <ul className="space-y-1.5">
            {issues.map((issue) => (
              <li
                key={issue.step}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-amber-100/90"
              >
                <span>
                  <span className="font-medium">{issue.label}:</span> {issue.message}
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(issue.step)}
                  className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-md border border-amber-500/40 hover:bg-amber-500/20 transition-colors"
                >
                  Fix step {issue.step}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(activationMessage || isAccountActive) && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            isAccountActive
              ? 'border-green-500/30 bg-green-500/10 text-green-100'
              : 'border-sky-500/30 bg-sky-500/10 text-sky-100'
          }`}
        >
          {activationMessage ??
            (isAccountActive
              ? 'Brand activated and saved to your account.'
              : null)}
          {draft.blueprint?.syncedAt && (
            <p className="text-xs opacity-70 mt-1">
              Account save{' '}
              {new Date(draft.blueprint.syncedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <ReviewSection
          step={1}
          title="Creator or business identity"
          onEdit={onEditStep}
        >
          <dl className="space-y-2.5">
            <Row label="Entity">
              {creator.entityType ? (
                <Chip>
                  {creator.entityType === 'individual'
                    ? 'Individual'
                    : 'Organization'}
                </Chip>
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Display name">
              {creator.displayName.trim() ? (
                <span className="text-white font-medium">{creator.displayName}</span>
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Primary type">
              {primaryKind ? <Chip>{primaryKind}</Chip> : <EmptyHint />}
              {creator.primaryKind === 'other' && creator.otherKindLabel.trim() && (
                <Chip>{creator.otherKindLabel.trim()}</Chip>
              )}
            </Row>
            {secondaryKinds.length > 0 && (
              <Row label="Also">
                {secondaryKinds.map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))}
              </Row>
            )}
          </dl>
        </ReviewSection>

        <ReviewSection
          step={2}
          title="Industry & niche"
          onEdit={onEditStep}
        >
          {industry.selections.length === 0 &&
          industry.customNiches.length === 0 ? (
            <EmptyHint />
          ) : (
            <ul className="space-y-2">
              {industry.selections.map((s) => (
                <li key={s.slug} className="flex flex-wrap gap-1.5 items-center">
                  <Chip>{s.industryLabel}</Chip>
                  {s.pathLabels.map((p) => (
                    <Chip key={`${s.slug}-${p}`}>{p}</Chip>
                  ))}
                </li>
              ))}
              {industry.customNiches.map((n) => (
                <li key={n}>
                  <Chip>Custom: {n}</Chip>
                </li>
              ))}
            </ul>
          )}
        </ReviewSection>

        <ReviewSection
          step={3}
          title="Brand personality & voice"
          onEdit={onEditStep}
        >
          <dl className="space-y-2.5">
            <Row label="Primary">
              {primaryPersonality ? (
                <Chip>{primaryPersonality}</Chip>
              ) : (
                <EmptyHint />
              )}
            </Row>
            {secondaryPersonalities.length > 0 && (
              <Row label="Secondary">
                {secondaryPersonalities.map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))}
              </Row>
            )}
            <Row label="Voice">
              {voiceAttrs.length ? (
                voiceAttrs.map((l) => <Chip key={l}>{l}</Chip>)
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Tone">
              {tone ? <Chip>{tone}</Chip> : <EmptyHint />}
            </Row>
            {personality.customDescriptor.trim() && (
              <Row label="Note">
                <span className="text-gray-300">
                  {personality.customDescriptor.trim()}
                </span>
              </Row>
            )}
          </dl>
        </ReviewSection>

        <ReviewSection
          step={4}
          title="Visual identity & aesthetic"
          onEdit={onEditStep}
        >
          <dl className="space-y-2.5">
            <Row label="Aesthetics">
              {aesthetics.length ? (
                aesthetics.map((l) => <Chip key={l}>{l}</Chip>)
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Colors">
              {palettes.length ? (
                palettes.map((p) =>
                  p ? (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-800/80 border border-gray-700"
                    >
                      <span className="flex gap-1" aria-hidden>
                        {p.swatches.map((hex) => (
                          <span
                            key={hex}
                            className="w-3.5 h-3.5 rounded-full border border-white/10"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </span>
                      <span className="text-xs text-gray-200">{p.label}</span>
                    </span>
                  ) : null
                )
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Content style">
              {contentStyles.length ? (
                contentStyles.map((l) => <Chip key={l}>{l}</Chip>)
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Mood">
              {moods.length ? (
                moods.map((l) => <Chip key={l}>{l}</Chip>)
              ) : (
                <EmptyHint />
              )}
            </Row>
          </dl>
        </ReviewSection>

        <ReviewSection step={5} title="Target audience" onEdit={onEditStep}>
          {audience.unsureYet ? (
            <p className="text-gray-400 text-sm">
              Marked as <Chip>I&apos;m not sure yet</Chip>
              {audience.customDescription.trim() && (
                <span className="block mt-2 text-gray-300">
                  {audience.customDescription.trim()}
                </span>
              )}
            </p>
          ) : (
            <dl className="space-y-2.5">
              <Row label="Types">
                {audience.audienceTypes.length ? (
                  labelsOf(audience.audienceTypes, AUDIENCE_TYPES).map((l) => (
                    <Chip key={l}>{l}</Chip>
                  ))
                ) : (
                  <EmptyHint />
                )}
              </Row>
              <Row label="Ages">
                {audience.ageRanges.length ? (
                  labelsOf(audience.ageRanges, AGE_RANGES).map((l) => (
                    <Chip key={l}>{l}</Chip>
                  ))
                ) : (
                  <EmptyHint />
                )}
              </Row>
              <Row label="Geography">
                {audience.geography ? (
                  <Chip>
                    {labelOf(audience.geography, GEOGRAPHY_OPTIONS)}
                  </Chip>
                ) : (
                  <EmptyHint />
                )}
              </Row>
              <Row label="Interests">
                {audience.interests.length ? (
                  labelsOf(audience.interests, AUDIENCE_INTERESTS).map((l) => (
                    <Chip key={l}>{l}</Chip>
                  ))
                ) : (
                  <EmptyHint />
                )}
              </Row>
              <Row label="Needs">
                {audience.needs.length ? (
                  labelsOf(audience.needs, AUDIENCE_NEEDS).map((l) => (
                    <Chip key={l}>{l}</Chip>
                  ))
                ) : (
                  <EmptyHint />
                )}
              </Row>
              <Row label="Familiarity">
                {audience.familiarity ? (
                  <Chip>
                    {labelOf(audience.familiarity, AUDIENCE_FAMILIARITY)}
                  </Chip>
                ) : (
                  <EmptyHint />
                )}
              </Row>
              {audience.customDescription.trim() && (
                <Row label="Note">
                  <span>{audience.customDescription.trim()}</span>
                </Row>
              )}
            </dl>
          )}
        </ReviewSection>

        <ReviewSection
          step={6}
          title="Products, services & goals"
          onEdit={onEditStep}
        >
          <dl className="space-y-2.5">
            <Row label="Offerings">
              {goals.offerings.length ? (
                labelsOf(goals.offerings, OFFERING_TYPES).map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))
              ) : (
                <EmptyHint />
              )}
            </Row>
            {(goals.offerName.trim() ||
              goals.shortDescription.trim() ||
              goals.websiteUrl.trim()) && (
              <>
                {goals.offerName.trim() && (
                  <Row label="Offer name">
                    <span className="text-white">{goals.offerName.trim()}</span>
                  </Row>
                )}
                {goals.shortDescription.trim() && (
                  <Row label="Description">
                    <span>{goals.shortDescription.trim()}</span>
                  </Row>
                )}
                {goals.websiteUrl.trim() && (
                  <Row label="Website">
                    <span className="break-all">{goals.websiteUrl.trim()}</span>
                  </Row>
                )}
              </>
            )}
            <Row label="Primary goal">
              {goals.primaryGoal ? (
                <Chip>{labelOf(goals.primaryGoal, MARKETING_GOALS)}</Chip>
              ) : (
                <EmptyHint />
              )}
            </Row>
            {goals.secondaryGoals.length > 0 && (
              <Row label="Secondary">
                {labelsOf(goals.secondaryGoals, MARKETING_GOALS).map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))}
              </Row>
            )}
            <Row label="CTAs">
              {goals.callsToAction.length ? (
                labelsOf(goals.callsToAction, CALLS_TO_ACTION).map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))
              ) : (
                <EmptyHint />
              )}
            </Row>
            <Row label="Content focus">
              {goals.contentPriorities.length ? (
                labelsOf(goals.contentPriorities, CONTENT_PRIORITIES).map(
                  (l) => <Chip key={l}>{l}</Chip>
                )
              ) : (
                <EmptyHint />
              )}
            </Row>
          </dl>
        </ReviewSection>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 sm:p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Activate brand</h2>
        <p className="text-xs text-gray-500">
          Validates your selections and saves the blueprint to your account.
          Editing any step clears local activation until you activate again.
        </p>
        <button
          type="button"
          disabled={!canActivate || activating}
          onClick={onActivate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
        >
          {activating
            ? 'Saving to your account…'
            : isAccountActive
              ? 'Save updates to account'
              : 'Activate My Brand'}
        </button>
      </div>
    </div>
  )
}
