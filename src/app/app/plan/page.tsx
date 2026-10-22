'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { CreatorProfile, ContentLibraryItem } from '@/lib/supabase'

const DURATION_OPTIONS = [
  { value: 7, label: '7 Days', description: 'Perfect for a week of content' },
  { value: 14, label: '14 Days', description: 'Two weeks of consistent posting' },
  { value: 30, label: '30 Days', description: 'Full month content strategy' },
]

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
]

/** Map DB item_type → creator-neutral API library keys (legacy keys still accepted by API). */
const LIBRARY_API_KEYS: Record<ContentLibraryItem['item_type'], string> = {
  lyrics: 'keyLines',
  song_meaning: 'coreMessage',
  release_notes: 'launchNotes',
  personal_story: 'brandStory',
  audience_notes: 'audienceNotes',
}

export default function PlanPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [libraryItems, setLibraryItems] = useState<ContentLibraryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const [duration, setDuration] = useState(7)
  const [platforms, setPlatforms] = useState<string[]>(['instagram'])

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!workspace) {
      setIsLoading(false)
      return
    }

    setWorkspaceId(workspace.id)

    // Table remains artist_profiles for compatibility
    const { data: profile } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('workspace_id', workspace.id)
      .single()

    setCreator(profile)

    const { data: items } = await supabase
      .from('content_library_items')
      .select('*')
      .eq('workspace_id', workspace.id)

    setLibraryItems(items || [])
    setIsLoading(false)
  }

  function togglePlatform(platform: string) {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((p) => p !== platform))
      }
    } else {
      setPlatforms([...platforms, platform])
    }
  }

  async function handleGenerate() {
    if (!workspaceId || !creator) return

    setIsGenerating(true)
    setError(null)

    try {
      const contentLibrary: Record<string, string> = {}
      libraryItems.forEach((item) => {
        const key = LIBRARY_API_KEYS[item.item_type]
        if (!key) return
        if (!contentLibrary[key]) {
          contentLibrary[key] = item.content
        } else {
          contentLibrary[key] += '\n\n' + item.content
        }
      })

      const industry = creator.genre || 'general'

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          creatorName: creator.name,
          industry,
          category: industry,
          // Legacy fields kept for compatibility with older clients
          artistName: creator.name,
          genre: industry,
          vibeKeywords: creator.vibe_keywords || [],
          brandVoice: creator.brand_voice || 'casual and friendly',
          platforms,
          durationDays: duration,
          contentLibrary,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          (data && data.error) || 'Failed to generate content plan'
        )
      }

      const postsGenerated =
        typeof data.postsGenerated === 'number' ? data.postsGenerated : 0

      if (!data.success || postsGenerated < 1) {
        throw new Error(
          data.error ||
            'Generation finished but no posts were saved. Please try again.'
        )
      }

      router.push('/app/dashboard')
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-4xl mb-4">✨</div>
        <h2 className="text-lg font-semibold text-white mb-2">Set up your creator profile first</h2>
        <p className="text-gray-400 text-sm mb-6">
          We need your industry, audience, and voice to generate personalized content.
        </p>
        <a
          href="/app/profile?setup=true"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
        >
          Create Profile
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Generate Content Plan</h1>
        <p className="text-gray-400 text-sm mt-1">
          AI will create a customized posting schedule based on your profile and library.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <div className="font-medium text-white">{creator.name}</div>
            <div className="text-sm text-gray-400">
              {creator.genre} • {(creator.vibe_keywords || []).slice(0, 3).join(', ')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">Content Library</div>
            <div className="text-sm text-gray-400">
              {libraryItems.length} items will be used for generation
            </div>
          </div>
          <a
            href="/app/library"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Add more →
          </a>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Plan Duration
        </label>
        <div className="grid grid-cols-3 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setDuration(option.value)}
              className={`p-4 rounded-xl text-left transition-all ${
                duration === option.value
                  ? 'bg-purple-600 border-purple-500'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              } border`}
            >
              <div className="text-lg font-bold text-white">{option.label}</div>
              <div className="text-xs text-gray-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Platforms
        </label>
        <div className="flex gap-3">
          {PLATFORM_OPTIONS.map((option) => {
            const isSelected = platforms.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => togglePlatform(option.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-600/50 disabled:to-pink-600/50 text-white font-semibold text-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating {duration} posts...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>✨</span>
            Generate {duration}-Day Content Plan
          </span>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        This usually takes 10-20 seconds. You can edit posts after generation.
      </p>
    </div>
  )
}
