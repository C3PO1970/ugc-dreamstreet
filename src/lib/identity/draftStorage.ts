import type { BrandIdentityDraft } from './types'
import { createEmptyDraft, normalizeBrandIdentityDraft } from './types'

const STORAGE_KEY = 'dreamstreet.brandIdentity.draft.v1'

export function loadIdentityDraft(): BrandIdentityDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return normalizeBrandIdentityDraft(parsed)
  } catch {
    return null
  }
}

export function saveIdentityDraft(draft: BrandIdentityDraft): boolean {
  if (typeof window === 'undefined') return false
  try {
    const payload: BrandIdentityDraft = {
      ...normalizeBrandIdentityDraft(draft),
      version: 2,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function clearIdentityDraft(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function loadOrCreateIdentityDraft(): BrandIdentityDraft {
  return loadIdentityDraft() ?? createEmptyDraft()
}
