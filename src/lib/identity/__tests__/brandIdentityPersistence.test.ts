/**
 * Focused unit tests for Task 2E-1 (no live Supabase / OpenAI).
 * Run: npx tsx --test src/lib/identity/__tests__/brandIdentityPersistence.test.ts
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildBrandBlueprint,
  normalizeBrandBlueprint,
} from '../blueprint'
import {
  buildProfileUpdateFromBlueprint,
  legacyFieldsFromBlueprint,
} from '../brandIdentityPersistence'
import {
  invalidateLocalActivation,
  reconcileLocalAndAccountDrafts,
} from '../draftReconcile'
import {
  identityContentFingerprint,
  validateBlueprintForPersistence,
  validateWizardForReview,
} from '../stepValidation'
import {
  createEmptyDraft,
  type BrandIdentityDraft,
} from '../types'

function completeDraft(): BrandIdentityDraft {
  const d = createEmptyDraft()
  return {
    ...d,
    creator: {
      entityType: 'organization',
      displayName: 'Interior1',
      primaryKind: 'business_brand',
      secondaryKinds: [],
      otherKindLabel: '',
    },
    industry: {
      selections: [
        {
          industryId: 'design',
          industryLabel: 'Design',
          pathIds: ['interior'],
          pathLabels: ['Interior'],
          slug: 'design/interior',
        },
      ],
      customNiches: [],
    },
    personality: {
      primaryPersonality: 'sophisticated',
      secondaryPersonalities: ['warm'],
      voiceAttributes: ['confident', 'direct'],
      communicationTone: 'polished_premium',
      customDescriptor: '',
    },
    visual: {
      aesthetics: ['modern_luxury'],
      colorPalettes: ['black_gold'],
      contentStyles: ['photography', 'lifestyle'],
      moods: ['warm'],
    },
    audience: {
      unsureYet: false,
      audienceTypes: ['homeowners'],
      ageRanges: ['35_44'],
      geography: 'regional',
      interests: ['design', 'lifestyle'],
      needs: ['inspiration', 'professional_expertise'],
      familiarity: 'mixed',
      customDescription: '',
    },
    goals: {
      offerings: ['services', 'consultations'],
      primaryGoal: 'generate_leads',
      secondaryGoals: ['brand_awareness'],
      callsToAction: ['book_now', 'learn_more'],
      contentPriorities: ['educational', 'product_showcase'],
      offerName: 'Interior consult',
      shortDescription: 'Design consults',
      websiteUrl: 'https://example.com',
    },
  }
}

describe('blueprint validation', () => {
  it('accepts a complete Interior1-style blueprint', () => {
    const draft = completeDraft()
    assert.equal(validateWizardForReview(draft).length, 0)
    const bp = buildBrandBlueprint(draft)
    const result = validateBlueprintForPersistence(bp)
    assert.equal(result.ok, true)
  })

  it('rejects incomplete blueprints', () => {
    const result = validateBlueprintForPersistence({
      schemaVersion: 1,
      status: 'activation_ready',
      preparedAt: new Date().toISOString(),
      creator: createEmptyDraft().creator,
      industry: createEmptyDraft().industry,
      personality: createEmptyDraft().personality,
      visual: createEmptyDraft().visual,
      audience: createEmptyDraft().audience,
      goals: createEmptyDraft().goals,
    })
    assert.equal(result.ok, false)
    if (!result.ok) {
      assert.ok(result.issues && result.issues.length > 0)
    }
  })

  it('rejects malformed payloads', () => {
    const result = validateBlueprintForPersistence({ foo: 'bar' })
    assert.equal(result.ok, false)
  })
})

describe('profile update mapping', () => {
  it('maps display name and does not invent secrets', () => {
    const bp = buildBrandBlueprint(completeDraft())
    const cols = buildProfileUpdateFromBlueprint(bp, 7)
    assert.equal(cols.name, 'Interior1')
    assert.ok(cols.brand_identity)
    assert.equal(cols.wizard_step, 7)
    assert.ok(cols.wizard_completed_at)
    const json = JSON.stringify(cols)
    assert.equal(json.includes('service_role'), false)
    assert.equal(json.includes('anon'), false)
  })

  it('legacy fields stay compatible', () => {
    const legacy = legacyFieldsFromBlueprint(buildBrandBlueprint(completeDraft()))
    assert.equal(legacy.name, 'Interior1')
    assert.ok(legacy.genre)
  })
})

describe('draft reconciliation', () => {
  it('prefers account when local is empty', () => {
    const account = completeDraft()
    account.blueprint = {
      status: 'account_active',
      preparedAt: account.updatedAt,
      schemaVersion: 1,
      syncedAt: account.updatedAt,
    }
    const decision = reconcileLocalAndAccountDrafts(null, account)
    assert.equal(decision.kind, 'use_account')
  })

  it('keeps local when account is empty', () => {
    const local = completeDraft()
    const decision = reconcileLocalAndAccountDrafts(local, null)
    assert.equal(decision.kind, 'use_local')
    if (decision.kind === 'use_local') {
      assert.equal(decision.draft.creator.displayName, 'Interior1')
    }
  })

  it('surfaces conflict when fingerprints differ', () => {
    const local = completeDraft()
    const account = completeDraft()
    account.creator = { ...account.creator, displayName: 'Account Name' }
    const decision = reconcileLocalAndAccountDrafts(local, account)
    assert.equal(decision.kind, 'conflict')
  })

  it('merges when fingerprints match', () => {
    const local = completeDraft()
    const account = completeDraft()
    assert.equal(
      identityContentFingerprint(local),
      identityContentFingerprint(account)
    )
    const decision = reconcileLocalAndAccountDrafts(local, account)
    assert.equal(decision.kind, 'use_account')
  })
})

describe('stale blueprint prevention', () => {
  it('clears local activation meta on edit invalidation', () => {
    const draft = completeDraft()
    draft.blueprint = {
      status: 'account_active',
      preparedAt: draft.updatedAt,
      schemaVersion: 1,
      syncedAt: draft.updatedAt,
    }
    const next = invalidateLocalActivation(draft)
    assert.equal(next.blueprint, null)
    assert.equal(draft.creator.displayName, 'Interior1')
  })

  it('normalizeBrandBlueprint ignores non-ready status', () => {
    const bp = buildBrandBlueprint(completeDraft())
    const bad = normalizeBrandBlueprint({ ...bp, status: 'account_active' })
    assert.equal(bad, null)
  })
})

describe('unauthorized save contract (mocked)', () => {
  it('validateBlueprintForPersistence is required before any write', () => {
    // Documents API contract: no blueprint → 400, never reaches Supabase
    const denied = validateBlueprintForPersistence(undefined)
    assert.equal(denied.ok, false)
  })

  it('workspace ownership is server-resolved (documented invariant)', () => {
    // API ignores client workspaceId; this test locks the helper surface.
    const cols = buildProfileUpdateFromBlueprint(
      buildBrandBlueprint(completeDraft())
    )
    assert.equal('workspace_id' in cols, false)
  })
})
