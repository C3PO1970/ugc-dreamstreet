/**
 * Application-controlled scheduling dates (UTC).
 * AI must not invent absolute calendar dates — the app assigns YYYY-MM-DD values.
 */

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidYmd(value: string): boolean {
  if (!YMD_RE.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  )
}

/** Today's date in UTC as YYYY-MM-DD. */
export function getUtcTodayYmd(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function addUtcDays(ymd: string, days: number): string {
  if (!isValidYmd(ymd)) {
    throw new Error(`Invalid date: ${ymd}`)
  }
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

export function compareYmd(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

/**
 * Default plan start: tomorrow (UTC), never today or the past.
 * Optional startDate must be YYYY-MM-DD and >= tomorrow UTC.
 */
export function resolvePlanStartDate(
  startDate: string | null | undefined,
  now: Date = new Date()
): string {
  const tomorrow = addUtcDays(getUtcTodayYmd(now), 1)
  if (startDate && isValidYmd(startDate) && compareYmd(startDate, tomorrow) >= 0) {
    return startDate
  }
  return tomorrow
}

/**
 * Build `durationDays` consecutive calendar dates starting at resolvePlanStartDate.
 */
export function buildScheduleDates(
  durationDays: number,
  startDate?: string | null,
  now: Date = new Date()
): string[] {
  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error('durationDays must be a positive integer')
  }
  const start = resolvePlanStartDate(startDate, now)
  return Array.from({ length: durationDays }, (_, i) => addUtcDays(start, i))
}

/**
 * Assign each post a publishing date within the plan window.
 * - One post per day when counts match.
 * - Multiple posts per day distributed evenly when there are more posts than days.
 * - Spreads across the window when fewer posts than days.
 * Never assigns a date before tomorrow (UTC).
 */
export function assignScheduleDates<T extends object>(
  posts: T[],
  durationDays: number,
  startDate?: string | null,
  now: Date = new Date()
): (T & { scheduled_date: string })[] {
  if (posts.length === 0) {
    throw new Error('Cannot assign dates to an empty posts list')
  }
  const window = buildScheduleDates(durationDays, startDate, now)
  const tomorrow = addUtcDays(getUtcTodayYmd(now), 1)

  return posts.map((post, index) => {
    let ymd: string
    if (posts.length === window.length) {
      ymd = window[index]
    } else if (posts.length > window.length) {
      // Multiple posts per day — map evenly into the window
      const dayIndex = Math.min(
        window.length - 1,
        Math.floor((index * window.length) / posts.length)
      )
      ymd = window[dayIndex]
    } else {
      // Fewer posts than days — spread across the window
      const dayIndex =
        posts.length === 1
          ? 0
          : Math.round((index * (window.length - 1)) / (posts.length - 1))
      ymd = window[dayIndex]
    }

    if (compareYmd(ymd, tomorrow) < 0) {
      ymd = tomorrow
    }

    return {
      ...post,
      scheduled_date: ymd,
    }
  })
}
