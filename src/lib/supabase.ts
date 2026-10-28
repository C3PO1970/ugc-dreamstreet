import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Types for database tables
export interface Workspace {
  id: string
  user_id: string
  name: string
  created_at: string
}

/** Maps to Supabase table `artist_profiles` (legacy name; product term: Creator Profile). */
export interface ArtistProfile {
  id: string
  workspace_id: string
  name: string
  /** Industry / category (column name remains `genre` for compatibility). */
  genre: string | null
  vibe_keywords: string[] | null
  brand_voice: string | null
  platforms: string[] | null
  /** Brand Identity Wizard blueprint (Task 2E-1). Requires migration. */
  brand_identity?: unknown | null
  wizard_step?: number | null
  wizard_completed_at?: string | null
  created_at: string
  updated_at: string
}

/** Preferred product type alias — same shape as ArtistProfile. */
export type CreatorProfile = ArtistProfile

export interface ContentLibraryItem {
  id: string
  workspace_id: string
  item_type: 'lyrics' | 'song_meaning' | 'release_notes' | 'personal_story' | 'audience_notes'
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface ContentPlan {
  id: string
  workspace_id: string
  name: string
  duration_days: number
  platforms: string[]
  status: 'draft' | 'active' | 'completed'
  created_at: string
}

export interface Post {
  id: string
  content_plan_id: string
  workspace_id: string
  scheduled_date: string
  platform: 'instagram' | 'facebook'
  content_type: 'reel' | 'story' | 'feed'
  objective: 'promo' | 'viral' | 'bts' | 'education' | 'community'
  hook: string
  caption: string
  script: string | null
  cta: string | null
  status: 'scheduled' | 'posted' | 'skipped'
  created_at: string
}
