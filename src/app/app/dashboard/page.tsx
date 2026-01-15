'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Post, ArtistProfile } from '@/lib/supabase'
import { handlePostNow, getPlatformInfo } from '@/lib/deeplink'
import Link from 'next/link'

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [artist, setArtist] = useState<ArtistProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!workspace) {
      setIsLoading(false)
      return
    }

    // Get artist profile
    const { data: profile } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('workspace_id', workspace.id)
      .single()

    setArtist(profile)

    // Get upcoming posts
    const today = new Date().toISOString().split('T')[0]
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('workspace_id', workspace.id)
      .gte('scheduled_date', today)
      .order('scheduled_date', { ascending: true })
      .limit(10)

    setPosts(postsData || [])
    setIsLoading(false)
  }

  async function handlePost(post: Post) {
    const { copied } = await handlePostNow(post.platform, post.caption)
    if (copied) {
      setCopiedId(post.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  async function copyCaption(post: Post) {
    await navigator.clipboard.writeText(post.caption)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Group posts by date
  const groupedPosts = posts.reduce((acc, post) => {
    const date = post.scheduled_date
    if (!acc[date]) acc[date] = []
    acc[date].push(post)
    return acc
  }, {} as Record<string, Post[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {artist ? `Welcome, ${artist.name}` : 'Dashboard'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Your upcoming content is ready to post.
          </p>
        </div>
        <Link
          href="/app/plan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
        >
          <span>✨</span>
          Generate New Plan
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="text-2xl font-bold text-white">{posts.length}</div>
          <div className="text-sm text-gray-400">Upcoming Posts</div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="text-2xl font-bold text-white">
            {posts.filter(p => p.platform === 'instagram').length}
          </div>
          <div className="text-sm text-gray-400">Instagram</div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="text-2xl font-bold text-white">
            {posts.filter(p => p.platform === 'facebook').length}
          </div>
          <div className="text-sm text-gray-400">Facebook</div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="text-2xl font-bold text-white">
            {Object.keys(groupedPosts).length}
          </div>
          <div className="text-sm text-gray-400">Days Planned</div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-lg font-semibold text-white mb-2">No posts scheduled</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Generate a content plan to get AI-powered posts ready for your social media.
          </p>
          <Link
            href="/app/plan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            <span>✨</span>
            Create Content Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPosts).map(([date, datePosts]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </h3>
              <div className="space-y-3">
                {datePosts.map((post) => {
                  const platform = getPlatformInfo(post.platform)
                  const isCopied = copiedId === post.id

                  return (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Platform Badge */}
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-lg flex-shrink-0`}
                        >
                          {platform.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">
                              {platform.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400">
                              {post.content_type}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300">
                              {post.objective}
                            </span>
                          </div>
                          <p className="text-white font-medium mb-1">{post.hook}</p>
                          <p className="text-gray-400 text-sm line-clamp-2">{post.caption}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => copyCaption(post)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                          >
                            {isCopied ? '✓ Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handlePost(post)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                          >
                            Post Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TODO: Add reminder settings section */}
      {/* TODO: Add Stripe billing upgrade prompt */}
    </div>
  )
}
