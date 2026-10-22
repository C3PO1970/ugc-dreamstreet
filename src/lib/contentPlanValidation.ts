/**
 * Validate AI-generated content plan posts before persistence.
 * Dates are ignored — the application assigns scheduled_date separately.
 */

export const ALLOWED_PLATFORMS = ['instagram', 'facebook'] as const
export const ALLOWED_CONTENT_TYPES = ['reel', 'story', 'feed'] as const
export const ALLOWED_OBJECTIVES = [
  'promo',
  'viral',
  'bts',
  'education',
  'community',
] as const

export type AllowedPlatform = (typeof ALLOWED_PLATFORMS)[number]
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]
export type AllowedObjective = (typeof ALLOWED_OBJECTIVES)[number]

export interface RawGeneratedPost {
  platform: AllowedPlatform
  content_type: AllowedContentType
  objective: AllowedObjective
  hook: string
  caption: string
  script: string | null
  cta: string | null
}

function asNonEmptyString(value: unknown, field: string, index: number): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Post ${index + 1}: missing or empty "${field}"`)
  }
  return value.trim()
}

function asOptionalString(value: unknown): string | null {
  if (value == null) return null
  if (typeof value !== 'string') return null
  const t = value.trim()
  return t.length ? t : null
}

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
  index: number
): T {
  if (typeof value !== 'string') {
    throw new Error(`Post ${index + 1}: invalid "${field}"`)
  }
  const normalized = value.trim().toLowerCase() as T
  if (!allowed.includes(normalized)) {
    throw new Error(
      `Post ${index + 1}: unsupported ${field} "${value}". Allowed: ${allowed.join(', ')}`
    )
  }
  return normalized
}

/**
 * Extract posts array from OpenAI JSON object (or rare array root).
 */
export function extractPostsArray(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) {
    return parsed
  }
  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>
    if (Array.isArray(obj.posts)) return obj.posts
    if (Array.isArray(obj.data)) return obj.data
    if (Array.isArray(obj.items)) return obj.items
  }
  throw new Error(
    'Invalid AI response: expected a JSON object with a non-empty "posts" array'
  )
}

/**
 * Validate and normalize AI posts (content only — no scheduling dates).
 */
export function validateGeneratedPosts(
  parsed: unknown,
  options: {
    durationDays: number
    allowedPlatforms: string[]
  }
): RawGeneratedPost[] {
  const rawList = extractPostsArray(parsed)

  if (rawList.length === 0) {
    throw new Error('AI returned zero posts')
  }

  const platformAllow = options.allowedPlatforms
    .map((p) => p.toLowerCase())
    .filter((p): p is AllowedPlatform =>
      (ALLOWED_PLATFORMS as readonly string[]).includes(p)
    )

  if (platformAllow.length === 0) {
    throw new Error('No valid platforms selected for generation')
  }

  const posts: RawGeneratedPost[] = rawList.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Post ${index + 1}: invalid post object`)
    }
    const row = item as Record<string, unknown>

    const platform = normalizeEnum(
      row.platform,
      ALLOWED_PLATFORMS,
      'platform',
      index
    )
    if (!platformAllow.includes(platform)) {
      throw new Error(
        `Post ${index + 1}: platform "${platform}" was not selected for this plan`
      )
    }

    return {
      platform,
      content_type: normalizeEnum(
        row.content_type,
        ALLOWED_CONTENT_TYPES,
        'content_type',
        index
      ),
      objective: normalizeEnum(
        row.objective,
        ALLOWED_OBJECTIVES,
        'objective',
        index
      ),
      hook: asNonEmptyString(row.hook, 'hook', index),
      caption: asNonEmptyString(row.caption, 'caption', index),
      script: asOptionalString(row.script),
      cta: asOptionalString(row.cta),
    }
  })

  // Soft scheduling rule: prefer ~1 post per plan day; allow a reasonable band
  // for multi-post days without silently accepting empty or tiny plans.
  const minPosts = Math.max(1, Math.floor(options.durationDays * 0.5))
  const maxPosts = options.durationDays * 3
  if (posts.length < minPosts) {
    throw new Error(
      `AI returned only ${posts.length} post(s); expected at least ${minPosts} for a ${options.durationDays}-day plan`
    )
  }
  if (posts.length > maxPosts) {
    throw new Error(
      `AI returned ${posts.length} posts; maximum for a ${options.durationDays}-day plan is ${maxPosts}`
    )
  }

  return posts
}
