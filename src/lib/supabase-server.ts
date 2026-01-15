import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getWorkspace(userId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function getArtistProfile(workspaceId: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('artist_profiles')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single()
  return data
}
