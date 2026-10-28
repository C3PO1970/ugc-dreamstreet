'use client'

import { SelectionCard } from '../SelectionCard'
import { SelectionGrid } from '../SelectionGrid'
import { CREATOR_KIND_OPTIONS, MAX_SECONDARY_KINDS } from '@/lib/identity/catalogs'
import type { CreatorIdentityDraft, CreatorKindId, EntityType } from '@/lib/identity/types'

interface StepCreatorIdentityProps {
  value: CreatorIdentityDraft
  onChange: (next: CreatorIdentityDraft) => void
}

export function StepCreatorIdentity({ value, onChange }: StepCreatorIdentityProps) {
  function setEntityType(entityType: EntityType) {
    onChange({ ...value, entityType })
  }

  function setPrimary(kind: CreatorKindId) {
    const secondaryKinds = value.secondaryKinds.filter((k) => k !== kind)
    onChange({
      ...value,
      primaryKind: kind,
      secondaryKinds,
      otherKindLabel: kind === 'other' ? value.otherKindLabel : value.otherKindLabel,
    })
  }

  function toggleSecondary(kind: CreatorKindId) {
    if (kind === value.primaryKind) return
    const exists = value.secondaryKinds.includes(kind)
    let secondaryKinds: CreatorKindId[]
    if (exists) {
      secondaryKinds = value.secondaryKinds.filter((k) => k !== kind)
    } else {
      if (value.secondaryKinds.length >= MAX_SECONDARY_KINDS) return
      secondaryKinds = [...value.secondaryKinds, kind]
    }
    onChange({ ...value, secondaryKinds })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Who are you creating as?</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Choose how you show up. You can refine industry and niche next — this is not
          limited to music.
        </p>
      </div>

      <SelectionGrid
        label="Account type"
        description="Are you building as a person or as an organization?"
        columns={2}
      >
        <SelectionCard
          title="Individual"
          description="Personal creator, freelancer, or solo brand"
          selected={value.entityType === 'individual'}
          onSelect={() => setEntityType('individual')}
        />
        <SelectionCard
          title="Organization"
          description="Company, brand, team, or collective"
          selected={value.entityType === 'organization'}
          onSelect={() => setEntityType('organization')}
        />
      </SelectionGrid>

      <div>
        <label htmlFor="display-name" className="block text-sm font-medium text-gray-300 mb-1.5">
          Display name *
        </label>
        <input
          id="display-name"
          type="text"
          value={value.displayName}
          onChange={(e) => onChange({ ...value, displayName: e.target.value })}
          placeholder={
            value.entityType === 'organization'
              ? 'e.g., Nova Studio, Bloom Co.'
              : 'e.g., your name or creator handle'
          }
          autoComplete="organization"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          required
        />
      </div>

      <SelectionGrid
        label="Primary identity *"
        description="Pick the role that best fits. One primary selection."
        columns={2}
      >
        {CREATOR_KIND_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            description={opt.description}
            selected={value.primaryKind === opt.id}
            badge={value.primaryKind === opt.id ? 'Primary' : undefined}
            onSelect={() => setPrimary(opt.id)}
          />
        ))}
      </SelectionGrid>

      {value.primaryKind === 'other' && (
        <div>
          <label htmlFor="other-kind" className="block text-sm font-medium text-gray-300 mb-1.5">
            Describe your identity
          </label>
          <input
            id="other-kind"
            type="text"
            value={value.otherKindLabel}
            onChange={(e) => onChange({ ...value, otherKindLabel: e.target.value })}
            placeholder="e.g., Community organizer, NFT artist…"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
        </div>
      )}

      <SelectionGrid
        label="Secondary identities (optional)"
        description={`Add up to ${MAX_SECONDARY_KINDS} more if you wear multiple hats.`}
        columns={2}
        multiSelect
      >
        {CREATOR_KIND_OPTIONS.filter((o) => o.id !== value.primaryKind).map((opt) => (
          <SelectionCard
            key={opt.id}
            title={opt.label}
            description={opt.description}
            selected={value.secondaryKinds.includes(opt.id)}
            disabled={
              !value.secondaryKinds.includes(opt.id) &&
              value.secondaryKinds.length >= MAX_SECONDARY_KINDS
            }
            onSelect={() => toggleSecondary(opt.id)}
          />
        ))}
      </SelectionGrid>
    </div>
  )
}

export { validateCreatorIdentity } from '@/lib/identity/stepValidation'
