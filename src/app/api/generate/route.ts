import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateContentPlan, type GenerationInput } from '@/lib/openai'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      workspaceId,
      artistName,
      genre,
      vibeKeywords,
      brandVoice,
      platforms,
      durationDays,
      contentLibrary,
    } = body

    // Validate required fields
    if (!workspaceId || !artistName || !platforms?.length || !durationDays) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create Supabase client
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

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify workspace belongs to user
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    // Generate content plan using OpenAI
    const generationInput: GenerationInput = {
      artistName,
      genre: genre || 'general',
      vibeKeywords: vibeKeywords || [],
      brandVoice: brandVoice || 'casual and friendly',
      platforms,
      durationDays,
      contentLibrary: {
        lyrics: contentLibrary?.lyrics,
        songMeaning: contentLibrary?.songmeaning,
        releaseNotes: contentLibrary?.releasenotes,
        personalStory: contentLibrary?.personalstory,
        audienceNotes: contentLibrary?.audiencenotes,
      },
    }

    const generatedPosts = await generateContentPlan(generationInput)

    // Create content plan in database
    const { data: contentPlan, error: planError } = await supabase
      .from('content_plans')
      .insert({
        workspace_id: workspaceId,
        name: `${durationDays}-Day Plan - ${new Date().toLocaleDateString()}`,
        duration_days: durationDays,
        platforms,
        status: 'active',
      })
      .select()
      .single()

    if (planError) {
      console.error('Error creating content plan:', planError)
      return NextResponse.json(
        { error: 'Failed to save content plan' },
        { status: 500 }
      )
    }

    // Insert posts
    const postsToInsert = generatedPosts.map((post) => ({
      content_plan_id: contentPlan.id,
      workspace_id: workspaceId,
      scheduled_date: post.date,
      platform: post.platform,
      content_type: post.content_type,
      objective: post.objective,
      hook: post.hook,
      caption: post.caption,
      script: post.script || null,
      cta: post.cta || null,
      status: 'scheduled',
    }))

    const { error: postsError } = await supabase
      .from('posts')
      .insert(postsToInsert)

    if (postsError) {
      console.error('Error creating posts:', postsError)
      // Delete the content plan if posts failed
      await supabase.from('content_plans').delete().eq('id', contentPlan.id)
      return NextResponse.json(
        { error: 'Failed to save posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contentPlanId: contentPlan.id,
      postsGenerated: generatedPosts.length,
    })
  } catch (error: any) {
    console.error('Error in /api/generate:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
