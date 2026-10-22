'use client'

import Link from 'next/link'

type PublishingStatus = 'Draft' | 'Planned' | 'Ready to Post' | 'Posted'

interface SampleVideo {
  id: string
  title: string
  platform: 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube Shorts'
  plannedDate: string | null
  status: PublishingStatus
}

/** Temporary sample data — replace with Supabase records in a later step. */
const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'sample-1',
    title: 'Studio session — verse 2 teaser',
    platform: 'Instagram',
    plannedDate: '2026-10-22',
    status: 'Planned',
  },
  {
    id: 'sample-2',
    title: 'Behind the drop: beat breakdown',
    platform: 'TikTok',
    plannedDate: '2026-10-24',
    status: 'Draft',
  },
  {
    id: 'sample-3',
    title: 'Fan Q&A highlight reel',
    platform: 'YouTube Shorts',
    plannedDate: null,
    status: 'Ready to Post',
  },
  {
    id: 'sample-4',
    title: 'Weekend vibe — acoustic cover',
    platform: 'Facebook',
    plannedDate: '2026-10-18',
    status: 'Posted',
  },
]

const STATUS_STYLES: Record<PublishingStatus, string> = {
  Draft: 'bg-gray-800 text-gray-300',
  Planned: 'bg-blue-500/20 text-blue-300',
  'Ready to Post': 'bg-purple-500/20 text-purple-300',
  Posted: 'bg-green-500/20 text-green-300',
}

function formatDate(date: string | null) {
  if (!date) return 'Not scheduled'
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ClipsDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-purple-400 mb-1">
            ClipSlot Lite
          </p>
          <h1 className="text-2xl font-bold text-white">Video Library</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Upload finished videos, organize your library, and prepare captions for
            manual publishing. Sample videos below are placeholders until saving is enabled.
          </p>
        </div>
        <Link
          href="/app/clips/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors self-start"
        >
          <span>+</span>
          Add Video
        </Link>
      </div>

      {/* Sample data notice */}
      <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm">
        Showing labeled sample data for layout preview. Real video storage and saving
        will be added in the next development steps.
      </div>

      {/* Actions */}
      <section>
        <h2 className="text-sm font-medium text-gray-300 mb-3">Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/app/clips/new"
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-colors text-left"
          >
            <div className="text-lg mb-1">➕</div>
            <div className="text-sm font-medium text-white">Add Video</div>
            <div className="text-xs text-gray-500 mt-1">Open the new video form</div>
          </Link>

          <button
            type="button"
            disabled
            className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-left opacity-60 cursor-not-allowed"
            title="Coming soon"
          >
            <div className="text-lg mb-1">✨</div>
            <div className="text-sm font-medium text-gray-300">Generate Content</div>
            <div className="text-xs text-amber-500/80 mt-1">Coming Soon</div>
          </button>

          <button
            type="button"
            disabled
            className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-left opacity-60 cursor-not-allowed"
            title="Coming soon"
          >
            <div className="text-lg mb-1">🗓️</div>
            <div className="text-sm font-medium text-gray-300">Schedule Post</div>
            <div className="text-xs text-amber-500/80 mt-1">Coming Soon</div>
          </button>

          <button
            type="button"
            disabled
            className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-left opacity-60 cursor-not-allowed"
            title="Coming soon"
          >
            <div className="text-lg mb-1">📅</div>
            <div className="text-sm font-medium text-gray-300">View Calendar</div>
            <div className="text-xs text-amber-500/80 mt-1">Coming Soon</div>
          </button>
        </div>
      </section>

      {/* Video library */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-300">Your Videos</h2>
          <span className="text-xs text-gray-500">{SAMPLE_VIDEOS.length} sample items</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {SAMPLE_VIDEOS.map((video) => (
            <article
              key={video.id}
              className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
            >
              <div className="flex gap-4 p-4">
                {/* Thumbnail placeholder */}
                <div
                  className="w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex flex-col items-center justify-center text-gray-500"
                  aria-hidden
                >
                  <span className="text-2xl mb-1">🎬</span>
                  <span className="text-[10px] uppercase tracking-wide">Thumbnail</span>
                  <span className="text-[10px] text-gray-600">Placeholder</span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {video.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300/90 flex-shrink-0">
                      Sample
                    </span>
                  </div>

                  <dl className="space-y-1.5 text-sm flex-1">
                    <div className="flex gap-2">
                      <dt className="text-gray-500 w-20 flex-shrink-0">Platform</dt>
                      <dd className="text-gray-200">{video.platform}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-500 w-20 flex-shrink-0">Publish</dt>
                      <dd className="text-gray-200">{formatDate(video.plannedDate)}</dd>
                    </div>
                    <div className="flex gap-2 items-center">
                      <dt className="text-gray-500 w-20 flex-shrink-0">Status</dt>
                      <dd>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${STATUS_STYLES[video.status]}`}
                        >
                          {video.status}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    disabled
                    className="mt-3 w-full sm:w-auto self-start px-3 py-1.5 rounded-lg text-sm bg-gray-800/80 text-gray-400 cursor-not-allowed border border-gray-700/80"
                    title="Coming soon"
                  >
                    View Details · Coming Soon
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
