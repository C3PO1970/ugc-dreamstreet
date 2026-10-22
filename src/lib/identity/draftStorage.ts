import type { BrandIdentityDraft } from './types'
import { createEmptyDraft } from './types'

const STORAGE_KEY = 'dreamstreet.brandIdentity.draft.v1'

export function loadIdentityDraft(): BrandIdentityDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BrandIdentityDraft
    if (!parsed || parsed.version !== 1) return null
    return parsed
  } catch {
    return null
  }
}

export function saveIdentityDraft(draft: BrandIdentityDraft): void {
  if (typeof window === 'undefined') return
  try {
    const payload: BrandIdentityDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota or private mode — ignore; in-memory state still works
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
