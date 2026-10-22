import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete(name)
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has a workspace, if not create one
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: workspace } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!workspace) {
          // Create default workspace
          await supabase.from('workspaces').insert({
            user_id: user.id,
            name: 'My Workspace',
          })

          // Redirect to creator profile setup (legacy /app/artist still works)
          return NextResponse.redirect(`${origin}/app/profile?setup=true`)
        }

        // Check if creator profile exists (table: artist_profiles)
        const { data: workspace2 } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (workspace2) {
          const { data: profile } = await supabase
            .from('artist_profiles')
            .select('id')
            .eq('workspace_id', workspace2.id)
            .single()

          if (!profile) {
            return NextResponse.redirect(`${origin}/app/profile?setup=true`)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
