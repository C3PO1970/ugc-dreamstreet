'use client'

import { SelectionCard } from '../SelectionCard'
import { SelectionGrid } from '../SelectionGrid'
import {
  CALLS_TO_ACTION,
  CONTENT_PRIORITIES,
  MARKETING_GOALS,
  MAX_CALLS_TO_ACTION,
  MAX_CONTENT_PRIORITIES,
  MAX_OFFERINGS,
  MAX_SECONDARY_GOALS,
  OFFERING_TYPES,
} from '@/lib/identity/catalogs'
import type {
  CallToActionId,
  ContentPriorityId,
  MarketingGoalId,
  OfferingTypeId,
  ProductsGoalsDraft,
} from '@/lib/identity/types'

interface StepProductsGoalsProps {
  value: ProductsGoalsDraft
  onChange: (next: ProductsGoalsDraft) => void
}

function toggleLimited<T extends string>(list: T[], id: T, max: number): T[] {
  if (list.includes(id)) return list.filter((x) => x !== id)
  if (list.length >= max) return list
  return [...list, id]
}

export function StepProductsGoals({ value, onChange }: StepProductsGoalsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Products, services & goals</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          What you offer and what content should achieve — pick, don’t write essays.
        </p>
      </div>

      <SelectionGrid
        label="Offering types *"
        description={`Select up to ${MAX_OFFERINGS}.`}
        columns={2}
        multiSelect
      >
        {OFFERING_TYPES.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.offerings.includes(item.id)}
            disabled={
              !value.offerings.includes(item.id) &&
              value.offerings.length >= MAX_OFFERINGS
            }
            onSelect={() =>
              onChange({
                ...value,
                offerings: toggleLimited(
                  value.offerings,
                  item.id,
                  MAX_OFFERINGS
                ) as OfferingTypeId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="offer-name" className="text-sm font-medium text-gray-200">
            Offer name <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="offer-name"
            type="text"
            maxLength={80}
            value={value.offerName}
            onChange={(e) => onChange({ ...value, offerName: e.target.value })}
            placeholder="e.g. Signature coaching package"
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="website-url" className="text-sm font-medium text-gray-200">
            Website URL <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="website-url"
            type="url"
            maxLength={200}
            value={value.websiteUrl}
            onChange={(e) => onChange({ ...value, websiteUrl: e.target.value })}
            placeholder="https://…"
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="offer-desc" className="text-sm font-medium text-gray-200">
          Short description <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="offer-desc"
          rows={2}
          maxLength={240}
          value={value.shortDescription}
          onChange={(e) =>
            onChange({ ...value, shortDescription: e.target.value })
          }
          placeholder="One or two lines about what you sell or deliver…"
          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 resize-y min-h-[72px]"
        />
        <p className="text-xs text-gray-600">{value.shortDescription.length}/240</p>
      </div>

      <SelectionGrid
        label="Primary marketing goal *"
        description="Choose one primary outcome for your content."
        columns={2}
      >
        {MARKETING_GOALS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.primaryGoal === item.id}
            badge={value.primaryGoal === item.id ? 'Primary' : undefined}
            onSelect={() => {
              const nextPrimary =
                value.primaryGoal === item.id ? null : (item.id as MarketingGoalId)
              onChange({
                ...value,
                primaryGoal: nextPrimary,
                secondaryGoals: value.secondaryGoals.filter((g) => g !== nextPrimary),
              })
            }}
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label="Secondary goals"
        description={`Optional — up to ${MAX_SECONDARY_GOALS}. Your primary goal is excluded.`}
        columns={2}
        multiSelect
      >
        {MARKETING_GOALS.map((item) => {
          const isPrimary = value.primaryGoal === item.id
          return (
            <SelectionCard
              key={item.id}
              title={item.label}
              description={
                isPrimary
                  ? 'Already set as primary — pick a different secondary.'
                  : item.description
              }
              selected={value.secondaryGoals.includes(item.id)}
              disabled={
                isPrimary ||
                (!value.secondaryGoals.includes(item.id) &&
                  value.secondaryGoals.length >= MAX_SECONDARY_GOALS)
              }
              onSelect={() =>
                onChange({
                  ...value,
                  secondaryGoals: toggleLimited(
                    value.secondaryGoals,
                    item.id,
                    MAX_SECONDARY_GOALS
                  ) as MarketingGoalId[],
                })
              }
            />
          )
        })}
      </SelectionGrid>

      <SelectionGrid
        label="Calls to action *"
        description={`Select up to ${MAX_CALLS_TO_ACTION}.`}
        columns={2}
        multiSelect
      >
        {CALLS_TO_ACTION.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.callsToAction.includes(item.id)}
            disabled={
              !value.callsToAction.includes(item.id) &&
              value.callsToAction.length >= MAX_CALLS_TO_ACTION
            }
            onSelect={() =>
              onChange({
                ...value,
                callsToAction: toggleLimited(
                  value.callsToAction,
                  item.id,
                  MAX_CALLS_TO_ACTION
                ) as CallToActionId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label="Content priorities *"
        description={`Select up to ${MAX_CONTENT_PRIORITIES}.`}
        columns={2}
        multiSelect
      >
        {CONTENT_PRIORITIES.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.contentPriorities.includes(item.id)}
            disabled={
              !value.contentPriorities.includes(item.id) &&
              value.contentPriorities.length >= MAX_CONTENT_PRIORITIES
            }
            onSelect={() =>
              onChange({
                ...value,
                contentPriorities: toggleLimited(
                  value.contentPriorities,
                  item.id,
                  MAX_CONTENT_PRIORITIES
                ) as ContentPriorityId[],
              })
            }
          />
        ))}
      </SelectionGrid>
    </div>
  )
}

export { validateProductsGoals } from '@/lib/identity/stepValidation'
