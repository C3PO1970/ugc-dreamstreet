'use client'

import { SelectionCard } from '../SelectionCard'
import { SelectionGrid } from '../SelectionGrid'
import {
  COLOR_PALETTES,
  MAX_COLOR_PALETTES,
  MAX_CONTENT_STYLES,
  MAX_VISUAL_AESTHETICS,
  MAX_VISUAL_MOODS,
  VISUAL_AESTHETICS,
  VISUAL_CONTENT_STYLES,
  VISUAL_MOODS,
} from '@/lib/identity/catalogs'
import type {
  ColorPaletteId,
  VisualAestheticId,
  VisualContentStyleId,
  VisualIdentityDraft,
  VisualMoodId,
} from '@/lib/identity/types'

interface StepVisualIdentityProps {
  value: VisualIdentityDraft
  onChange: (next: VisualIdentityDraft) => void
}

function toggleLimited<T extends string>(
  list: T[],
  id: T,
  max: number
): T[] {
  if (list.includes(id)) return list.filter((x) => x !== id)
  if (list.length >= max) return list
  return [...list, id]
}

export function StepVisualIdentity({ value, onChange }: StepVisualIdentityProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Visual identity & aesthetic</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Choose look, color, and mood with taps — not mood boards. These selections will
          later inform creative direction and visuals.
        </p>
      </div>

      <SelectionGrid
        label="Visual aesthetic *"
        description={`Select up to ${MAX_VISUAL_AESTHETICS} aesthetics that fit your brand.`}
        columns={2}
        multiSelect
      >
        {VISUAL_AESTHETICS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.aesthetics.includes(item.id)}
            disabled={
              !value.aesthetics.includes(item.id) &&
              value.aesthetics.length >= MAX_VISUAL_AESTHETICS
            }
            onSelect={() =>
              onChange({
                ...value,
                aesthetics: toggleLimited(
                  value.aesthetics,
                  item.id,
                  MAX_VISUAL_AESTHETICS
                ) as VisualAestheticId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-medium text-gray-200">Color direction *</h2>
          <p className="text-xs text-gray-500 mt-1">
            Select up to {MAX_COLOR_PALETTES} palettes. Swatches are previews only.
          </p>
        </div>
        <div
          role="listbox"
          aria-label="Color direction"
          aria-multiselectable
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {COLOR_PALETTES.map((palette) => {
            const selected = value.colorPalettes.includes(palette.id)
            const disabled =
              !selected && value.colorPalettes.length >= MAX_COLOR_PALETTES
            return (
              <button
                key={palette.id}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={disabled}
                onClick={() =>
                  onChange({
                    ...value,
                    colorPalettes: toggleLimited(
                      value.colorPalettes,
                      palette.id,
                      MAX_COLOR_PALETTES
                    ) as ColorPaletteId[],
                  })
                }
                className={`text-left p-4 rounded-xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  selected
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex gap-1.5 mb-3" aria-hidden>
                  {palette.swatches.map((hex) => (
                    <span
                      key={hex}
                      className="h-8 flex-1 rounded-md border border-white/10"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="text-sm font-semibold text-white">{palette.label}</div>
                <p className="text-xs text-gray-400 mt-1">{palette.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <SelectionGrid
        label="Visual content style *"
        description={`Select up to ${MAX_CONTENT_STYLES} content styles.`}
        columns={2}
        multiSelect
      >
        {VISUAL_CONTENT_STYLES.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.contentStyles.includes(item.id)}
            disabled={
              !value.contentStyles.includes(item.id) &&
              value.contentStyles.length >= MAX_CONTENT_STYLES
            }
            onSelect={() =>
              onChange({
                ...value,
                contentStyles: toggleLimited(
                  value.contentStyles,
                  item.id,
                  MAX_CONTENT_STYLES
                ) as VisualContentStyleId[],
              })
            }
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label="Visual mood *"
        description={`Select up to ${MAX_VISUAL_MOODS} moods.`}
        columns={2}
        multiSelect
      >
        {VISUAL_MOODS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.label}
            description={item.description}
            selected={value.moods.includes(item.id)}
            disabled={
              !value.moods.includes(item.id) &&
              value.moods.length >= MAX_VISUAL_MOODS
            }
            onSelect={() =>
              onChange({
                ...value,
                moods: toggleLimited(
                  value.moods,
                  item.id,
                  MAX_VISUAL_MOODS
                ) as VisualMoodId[],
              })
            }
          />
        ))}
      </SelectionGrid>
    </div>
  )
}

export { validateVisualIdentity } from '@/lib/identity/stepValidation'
