/**
 * Focused automated checks for UTC scheduling helpers (no OpenAI calls).
 * Run: node scripts/verify-scheduling.mjs
 *
 * Mirrors src/lib/contentPlanSchedule.ts logic for CI-less verification.
 */

function getUtcTodayYmd(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function addUtcDays(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

function resolvePlanStartDate(startDate, now = new Date()) {
  const tomorrow = addUtcDays(getUtcTodayYmd(now), 1)
  if (startDate && startDate >= tomorrow) return startDate
  return tomorrow
}

function buildScheduleDates(durationDays, startDate, now = new Date()) {
  const start = resolvePlanStartDate(startDate, now)
  return Array.from({ length: durationDays }, (_, i) => addUtcDays(start, i))
}

function assignScheduleDates(posts, durationDays, startDate, now = new Date()) {
  const window = buildScheduleDates(durationDays, startDate, now)
  const tomorrow = addUtcDays(getUtcTodayYmd(now), 1)
  return posts.map((post, index) => {
    let ymd
    if (posts.length === window.length) ymd = window[index]
    else if (posts.length > window.length) {
      ymd = window[Math.min(window.length - 1, Math.floor((index * window.length) / posts.length))]
    } else {
      ymd =
        posts.length === 1
          ? window[0]
          : window[Math.round((index * (window.length - 1)) / (posts.length - 1))]
    }
    if (ymd < tomorrow) ymd = tomorrow
    return { ...post, scheduled_date: ymd }
  })
}

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    failed++
  } else {
    console.log('PASS:', msg)
  }
}

const fixedNow = new Date(Date.UTC(2026, 9, 22)) // 2026-10-22
const today = getUtcTodayYmd(fixedNow)
const tomorrow = addUtcDays(today, 1)

assert(today === '2026-10-22', 'fixed today is 2026-10-22')
assert(tomorrow === '2026-10-23', 'tomorrow is 2026-10-23')

const pastIgnored = resolvePlanStartDate('2023-10-01', fixedNow)
assert(pastIgnored === '2026-10-23', 'past startDate is ignored')

const dates7 = buildScheduleDates(7, null, fixedNow)
assert(dates7.length === 7, '7-day window length')
assert(dates7[0] === '2026-10-23', '7-day starts tomorrow')
assert(dates7[6] === '2026-10-29', '7-day ends correctly')
assert(dates7.every((d) => d >= tomorrow), 'no past dates in window')

const posts = Array.from({ length: 7 }, (_, i) => ({ id: i }))
const assigned = assignScheduleDates(posts, 7, null, fixedNow)
assert(
  assigned.every((p) => p.scheduled_date >= tomorrow),
  'assigned dates are never in the past'
)
assert(
  assigned[0].scheduled_date === '2026-10-23' &&
    assigned[6].scheduled_date === '2026-10-29',
  'one post per day for matching counts'
)

// AI-invented past date must not survive (we overwrite entirely)
const withJunk = assignScheduleDates(
  [{ date: '2023-10-01' }, { date: '2023-10-02' }],
  7,
  null,
  fixedNow
)
assert(
  withJunk.every((p) => p.scheduled_date >= tomorrow),
  'AI past dates are replaced by scheduled_date (app field)'
)
assert(
  withJunk[0].scheduled_date === '2026-10-23' &&
    withJunk[1].scheduled_date >= '2026-10-23',
  'scheduled_date is app-controlled, not 2023'
)

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed`)
  process.exit(1)
}
console.log('\nAll scheduling checks passed.')
