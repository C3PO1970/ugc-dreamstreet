'use client'

import { SelectionCard } from '../SelectionCard'
import { SelectionGrid } from '../SelectionGrid'
import {
  COMMUNICATION_TONES,
  MAX_SECONDARY_PERSONALITIES,
  MAX_VOICE_ATTRIBUTES,
  PERSONALITY_TRAITS,
  VOICE_ATTRIBUTES,
} from '@/lib/identity/catalogs'
import type {
  BrandPersonalityDraft,
  CommunicationToneId,
  PersonalityTraitId,
  VoiceAttributeId,
} from '@/lib/identity/types'

interface StepBrandPersonalityProps {
  value: BrandPersonalityDraft
  onChange: (next: BrandPersonalityDraft) => void
}

export function StepBrandPersonality({
  value,
  onChange,
}: StepBrandPersonalityProps) {
  function setPrimary(id: PersonalityTraitId) {
    onChange({
      ...value,
      primaryPersonality: id,
      secondaryPersonalities: value.secondaryPersonalities.filter((x) => x !== id),
    })
  }

  function toggleSecondary(id: PersonalityTraitId) {
    if (id === value.primaryPersonality) return
    const exists = value.secondaryPersonalities.includes(id)
    let secondaryPersonalities: PersonalityTraitId[]
    if (exists) {
      secondaryPersonalities = value.secondaryPersonalities.filter((x) => x !== id)
    } else {
      if (value.secondaryPersonalities.length >= MAX_SECONDARY_PERSONALITIES) return
      secondaryPersonalities = [...value.secondaryPersonalities, id]
    }
    onChange({ ...value, secondaryPersonalities })
  }

  function toggleVoice(id: VoiceAttributeId) {
    const exists = value.voiceAttributes.includes(id)
    let voiceAttributes: VoiceAttributeId[]
    if (exists) {
      voiceAttributes = value.voiceAttributes.filter((x) => x !== id)
    } else {
      if (value.voiceAttributes.length >= MAX_VOICE_ATTRIBUTES) return
      voiceAttributes = [...value.voiceAttributes, id]
    }
    onChange({ ...value, voiceAttributes })
  }

  function setTone(id: CommunicationToneId) {
    onChange({
      ...value,
      communicationTone: value.communicationTone === id ? null : id,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Brand personality & voice</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Choose how your brand feels and speaks. Tap options — no essays required.
          These choices will later guide captions, tone, and messaging.
        </p>
      </div>

      <SelectionGrid
        label="Primary personality *"
        description="Pick the single trait that best defines your brand."
        columns={2}
      >
        {PERSONALITY_TRAITS.map((trait) => (
          <SelectionCard
            key={trait.id}
            title={trait.label}
            description={trait.description}
            selected={value.primaryPersonality === trait.id}
            badge={value.primaryPersonality === trait.id ? 'Primary' : undefined}
            onSelect={() => setPrimary(trait.id)}
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label="Secondary traits (optional)"
        description={`Add up to ${MAX_SECONDARY_PERSONALITIES} supporting traits.`}
        columns={2}
        multiSelect
      >
        {PERSONALITY_TRAITS.filter((t) => t.id !== value.primaryPersonality).map(
          (trait) => (
            <SelectionCard
              key={trait.id}
              title={trait.label}
              description={trait.description}
              selected={value.secondaryPersonalities.includes(trait.id)}
              disabled={
                !value.secondaryPersonalities.includes(trait.id) &&
                value.secondaryPersonalities.length >= MAX_SECONDARY_PERSONALITIES
              }
              onSelect={() => toggleSecondary(trait.id)}
            />
          )
        )}
      </SelectionGrid>

      <SelectionGrid
        label="Brand voice *"
        description={`Select up to ${MAX_VOICE_ATTRIBUTES} compatible voice attributes.`}
        columns={2}
        multiSelect
      >
        {VOICE_ATTRIBUTES.map((voice) => (
          <SelectionCard
            key={voice.id}
            title={voice.label}
            description={voice.description}
            selected={value.voiceAttributes.includes(voice.id)}
            disabled={
              !value.voiceAttributes.includes(voice.id) &&
              value.voiceAttributes.length >= MAX_VOICE_ATTRIBUTES
            }
            onSelect={() => toggleVoice(voice.id)}
          />
        ))}
      </SelectionGrid>

      <SelectionGrid
        label="Preferred communication tone *"
        description="One overall tone for how you usually speak to your audience."
        columns={2}
      >
        {COMMUNICATION_TONES.map((tone) => (
          <SelectionCard
            key={tone.id}
            title={tone.label}
            description={tone.description}
            selected={value.communicationTone === tone.id}
            onSelect={() => setTone(tone.id)}
          />
        ))}
      </SelectionGrid>

      <div>
        <label
          htmlFor="custom-personality"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Optional custom descriptor
        </label>
        <input
          id="custom-personality"
          type="text"
          value={value.customDescriptor}
          onChange={(e) =>
            onChange({ ...value, customDescriptor: e.target.value.slice(0, 120) })
          }
          placeholder="e.g., Quiet luxury with a rebellious streak"
          maxLength={120}
          className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">Optional · max 120 characters</p>
      </div>
    </div>
  )
}

export { validateBrandPersonality } from '@/lib/identity/stepValidation'
