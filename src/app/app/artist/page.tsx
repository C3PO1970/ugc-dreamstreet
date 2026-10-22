'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { CreatorProfile } from '@/lib/supabase'

/** Stored in artist_profiles.genre — creator industry/category (music genres preserved). */
const CREATOR_CATEGORIES = [
  'Influencer',
  'UGC Creator',
  'Video Creator',
  'Musician / Artist',
  'Podcaster',
  'YouTuber',
  'TikTok / Instagram Creator',
  'Photographer',
  'Educator',
  'Coach / Educator',
  'Entrepreneur / Small Business',
  'Brand / Marketing',
  // Music genres (existing users + music-focused creators)
  'Pop',
  'Hip-Hop',
  'R&B',
  'Rock',
  'Electronic',
  'Country',
  'Jazz',
  'Classical',
  'Reggae',
  'Latin',
  'Indie',
  'Metal',
  'Other',
]

const PLATFORMS = ['instagram', 'facebook']

function ProfileLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-gray-400">Loading...</div>
    </div>
  )
}

/**
 * useSearchParams requires a Suspense boundary for Next.js static generation.
 * /app/profile re-exports this page default, so both routes are covered.
 */
export default function ArtistProfilePage() {
  return (
    <Suspense fallback={<ProfileLoadingFallback />}>
      <ArtistProfileContent />
    </Suspense>
  )
}

function ArtistProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSetup = searchParams.get('setup') === 'true'

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Partial<CreatorProfile>>({
    name: '',
    genre: '',
    vibe_keywords: [],
    brand_voice: '',
    platforms: ['instagram'],
  })
  const [vibeInput, setVibeInput] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
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

    const { data: existingProfile } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('workspace_id', workspace.id)
      .single()

    if (existingProfile) {
      setProfile(existingProfile)
      setVibeInput((existingProfile.vibe_keywords || []).join(', '))
    }

    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspaceId) return

    setIsSaving(true)
    setMessage(null)

    const vibeKeywords = vibeInput
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

    const profileData = {
      workspace_id: workspaceId,
      name: profile.name,
      genre: profile.genre,
      vibe_keywords: vibeKeywords,
      brand_voice: profile.brand_voice,
      platforms: profile.platforms,
      updated_at: new Date().toISOString(),
    }

    let error

    if (profile.id) {
      // Update existing
      const result = await supabase
        .from('artist_profiles')
        .update(profileData)
        .eq('id', profile.id)
      error = result.error
    } else {
      // Create new
      const result = await supabase
        .from('artist_profiles')
        .insert(profileData)
      error = result.error
    }

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile saved!' })
      if (isSetup) {
        // Redirect to dashboard after setup
        setTimeout(() => router.push('/app/dashboard'), 1000)
      }
    }

    setIsSaving(false)
  }

  function togglePlatform(platform: string) {
    const current = profile.platforms || []
    if (current.includes(platform)) {
      setProfile({ ...profile, platforms: current.filter((p) => p !== platform) })
    } else {
      setProfile({ ...profile, platforms: [...current, platform] })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {isSetup ? 'Set Up Your Creator Profile' : 'Creator Profile'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {isSetup
            ? 'Tell us who you create for so we can personalize captions, hooks, and plans.'
            : 'Update your profile so AI content matches your industry, audience, and voice.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Creator / brand name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Creator / Brand Name *
          </label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g., Nova Media, Studio Bloom, your channel or brand name"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
        </div>

        {/* Industry / category (stored in genre column) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Industry / Category
          </label>
          <select
            value={profile.genre || ''}
            onChange={(e) => setProfile({ ...profile, genre: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          >
            <option value="">Select a category</option>
            {CREATOR_CATEGORIES.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose the option that best fits you. AI adapts captions and plans to this category
            (including music genres when relevant).
          </p>
        </div>

        {/* Vibe Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Vibe Keywords
          </label>
          <input
            type="text"
            value={vibeInput}
            onChange={(e) => setVibeInput(e.target.value)}
            placeholder="e.g., chill, summer vibes, emotional, high energy"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate with commas. These help the AI match your style.
          </p>
        </div>

        {/* Brand Voice */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Brand Voice
          </label>
          <textarea
            value={profile.brand_voice || ''}
            onChange={(e) => setProfile({ ...profile, brand_voice: e.target.value })}
            placeholder="How do you speak to your audience? e.g., Casual and fun, like talking to a friend. I use slang and emojis."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors resize-none"
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Platforms
          </label>
          <div className="flex gap-3">
            {PLATFORMS.map((platform) => {
              const isSelected = (profile.platforms || []).includes(platform)
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {platform === 'instagram' ? '📸 Instagram' : '📘 Facebook'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : isSetup ? 'Continue to Dashboard' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
