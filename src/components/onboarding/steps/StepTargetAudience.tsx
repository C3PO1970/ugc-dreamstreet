'use client'

import { SelectionCard } from '../SelectionCard'
import { SelectionGrid } from '../SelectionGrid'
import {
  AGE_RANGES,
  AUDIENCE_FAMILIARITY,
  AUDIENCE_INTERESTS,
  AUDIENCE_NEEDS,
  AUDIENCE_TYPES,
  GEOGRAPHY_OPTIONS,
  MAX_AUDIENCE_INTERESTS,
  MAX_AUDIENCE_NEEDS,
  MAX_AUDIENCE_TYPES,
} from '@/lib/identity/catalogs'
import type {
  AgeRangeId,
  AudienceInterestId,
  AudienceNeedId,
  AudienceTypeId,
  TargetAudienceDraft,
} from '@/lib/identity/types'

interface StepTargetAudienceProps {
  value: TargetAudienceDraft
  onChange: (next: TargetAudienceDraft) => void
}

function toggleLimited<T extends string>(list: T[], id: T, max: number): T[] {
  if (list.includes(id)) return list.filter((x) => x !== id)
  if (list.length >= max) return list
  return [...list, id]
}

function toggleAgeRange(list: AgeRangeId[], id: AgeRangeId): AgeRangeId[] {
  if (id === 'all_ages') {
    return list.includes('all_ages') ? [] : ['all_ages']
  }
  const withoutAll = list.filter((x) => x !== 'all_ages')
  if (withoutAll.includes(id)) return withoutAll.filter((x) => x !== id)
  return [...withoutAll, id]
}

export function StepTargetAudience({ value, onChange }: StepTargetAudienceProps) {
  const detailDisabled = value.unsureYet

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Target audience</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Who are you speaking to? Tap categories — skip long essays. You can refine later.
        </p>
      </div>

      <SelectionGrid label="Not sure yet?" columns={1}>
        <SelectionCard
          title="I'm not sure yet."
          description="Skip detailed audience picks for now. You can still add a short note below."
          selected={value.unsureYet}
          onSelect={() =>
            onChange({
              ...value,
              unsureYet: !value.unsureYet,
            })
          }
        />
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Audience type' : 'Audience type *'}
        description={
          detailDisabled
            ? 'Optional while “I’m not sure yet” is selected.'
            : `Select up to ${MAX_AUDIENCE_TYPES}.`
        }
        columns={2}
        multiSelect
      >
        {AUDIENCE_TYPES.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.audienceTypes.includes(item.id)}
            disabled={
              detailDisabled ||
              (!value.audienceTypes.includes(item.id) &&
                value.audienceTypes.length >= MAX_AUDIENCE_TYPES)
            }
            onSelect={() =>
              onChange({
                ...value,
                audienceTypes: toggleLimited(
                  value.audienceTypes,
                  item.id,
                  MAX_AUDIENCE_TYPES
                ) as AudienceTypeId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Age ranges' : 'Age ranges *'}
        description="“All Ages” clears other ranges. Specific ages clear “All Ages”."
        columns={3}
        multiSelect
      >
        {AGE_RANGES.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.ageRanges.includes(item.id)}
            disabled={detailDisabled}
            onSelect={() =>
              onChange({
                ...value,
                ageRanges: toggleAgeRange(value.ageRanges, item.id),
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Geography' : 'Geography *'}
        description="Choose the primary reach of your audience."
        columns={2}
      >
        {GEOGRAPHY_OPTIONS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.geography === item.id}
            disabled={detailDisabled}
            onSelect={() =>
              onChange({
                ...value,
                geography: value.geography === item.id ? null : item.id,
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Audience interests' : 'Audience interests *'}
        description={`Select up to ${MAX_AUDIENCE_INTERESTS}.`}
        columns={2}
        multiSelect
      >
        {AUDIENCE_INTERESTS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.interests.includes(item.id)}
            disabled={
              detailDisabled ||
              (!value.interests.includes(item.id) &&
                value.interests.length >= MAX_AUDIENCE_INTERESTS)
            }
            onSelect={() =>
              onChange({
                ...value,
                interests: toggleLimited(
                  value.interests,
                  item.id,
                  MAX_AUDIENCE_INTERESTS
                ) as AudienceInterestId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Audience needs' : 'Audience needs *'}
        description={`Select up to ${MAX_AUDIENCE_NEEDS}. Luxury and Affordability cannot both be selected.`}
        columns={2}
        multiSelect
      >
        {AUDIENCE_NEEDS.map((item) => {
          const conflict =
            (item.id === 'luxury' && value.needs.includes('affordability')) ||
            (item.id === 'affordability' && value.needs.includes('luxury'))
          return (
            <SelectionCard
              key={item.id}
              title={item.label}
              description={item.description}
              selected={value.needs.includes(item.id)}
              disabled={
                detailDisabled ||
                conflict ||
                (!value.needs.includes(item.id) &&
                  value.needs.length >= MAX_AUDIENCE_NEEDS)
              }
              onSelect={() =>
                onChange({
                  ...value,
                  needs: toggleLimited(
                    value.needs,
                    item.id,
                    MAX_AUDIENCE_NEEDS
                  ) as AudienceNeedId[],
                })
              }
            />
          )
        })}
      </SelectionGrid>

      <SelectionGrid
        label={detailDisabled ? 'Audience familiarity' : 'Audience familiarity *'}
        description="How familiar is your audience with your category?"
        columns={2}
      >
        {AUDIENCE_FAMILIARITY.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.familiarity === item.id}
            disabled={detailDisabled}
            onSelect={() =>
              onChange({
                ...value,
                familiarity: value.familiarity === item.id ? null : item.id,
              })
            }
          />
        ))}
      </SelectionGrid>

      <div className="space-y-2">
        <label htmlFor="audience-custom" className="text-sm font-medium text-gray-200">
          Custom audience note <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="audience-custom"
          rows={2}
          maxLength={280}
          value={value.customDescription}
          onChange={(e) =>
            onChange({ ...value, customDescription: e.target.value })
          }
          placeholder="Optional: a short phrase about who you serve…"
          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 resize-y min-h-[72px]"
        />
        <p className="text-xs text-gray-600">{value.customDescription.length}/280</p>
      </div>
    </div>
  )
}

export { validateTargetAudience } from '@/lib/identity/stepValidation'
