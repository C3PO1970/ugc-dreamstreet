'use client'

import { TaxonomyPicker } from '../TaxonomyPicker'
import { INDUSTRY_CATALOG } from '@/lib/identity/catalogs'
import type { IndustryNicheDraft } from '@/lib/identity/types'

interface StepIndustryNicheProps {
  value: IndustryNicheDraft
  onChange: (next: IndustryNicheDraft) => void
}

export function StepIndustryNiche({ value, onChange }: StepIndustryNicheProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Industry & niche</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Browse or search categories that match your work. Select up to five niches,
          including custom ones. Music is one option among many.
        </p>
      </div>

      <TaxonomyPicker
        industries={INDUSTRY_CATALOG}
        selections={value.selections}
        customNiches={value.customNiches}
        onChangeSelections={(selections) => onChange({ ...value, selections })}
        onChangeCustomNiches={(customNiches) => onChange({ ...value, customNiches })}
      />
    </div>
  )
}

export { validateIndustryNiche } from '@/lib/identity/stepValidation'
