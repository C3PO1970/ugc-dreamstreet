import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateContentPlan, type GenerationInput } from '@/lib/openai'
import { assignScheduleDates } from '@/lib/contentPlanSchedule'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      workspaceId,
      creatorName,
      artistName,
      genre,
      industry,
      category,
      vibeKeywords,
      brandVoice,
      platforms,
      durationDays,
      contentLibrary,
      startDate,
    } = body

    const resolvedCreatorName =
      (typeof creatorName === 'string' && creatorName.trim()) ||
      (typeof artistName === 'string' && artistName.trim()) ||
      ''

    const resolvedGenre =
      (typeof genre === 'string' && genre.trim()) ||
      (typeof industry === 'string' && industry.trim()) ||
      (typeof category === 'string' && category.trim()) ||
      'general'

    const resolvedDuration =
      typeof durationDays === 'number'
        ? durationDays
        : Number.parseInt(String(durationDays), 10)

    if (
      !workspaceId ||
      !resolvedCreatorName ||
      !platforms?.length ||
      !Number.isFinite(resolvedDuration) ||
      resolvedDuration < 1
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (![7, 14, 30].includes(resolvedDuration)) {
      return NextResponse.json(
        { error: 'durationDays must be 7, 14, or 30' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

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

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const lib = contentLibrary || {}
    const generationInput: GenerationInput = {
      creatorName: resolvedCreatorName,
      artistName: resolvedCreatorName,
      genre: resolvedGenre,
      vibeKeywords: vibeKeywords || [],
      brandVoice: brandVoice || 'casual and friendly',
      platforms,
      durationDays: resolvedDuration,
      contentLibrary: {
        lyrics: lib.keyLines ?? lib.key_lines ?? lib.lyrics,
        songMeaning:
          lib.coreMessage ??
          lib.core_message ??
          lib.songMeaning ??
          lib.songmeaning,
        releaseNotes:
          lib.launchNotes ??
          lib.launch_notes ??
          lib.releaseNotes ??
          lib.releasenotes,
        personalStory:
          lib.brandStory ??
          lib.brand_story ??
          lib.personalStory ??
          lib.personalstory,
        audienceNotes:
          lib.audienceNotes ?? lib.audience_notes ?? lib.audiencenotes,
      },
    }

    const generatedPosts = await generateContentPlan(generationInput)

    if (!generatedPosts.length) {
      return NextResponse.json(
        { error: 'Generation produced no posts' },
        { status: 502 }
      )
    }

    // Application owns calendar dates (UTC) — ignore any AI-invented dates
    const scheduledPosts = assignScheduleDates(
      generatedPosts,
      resolvedDuration,
      typeof startDate === 'string' ? startDate : null
    )

    const { data: contentPlan, error: planError } = await supabase
      .from('content_plans')
      .insert({
        workspace_id: workspaceId,
        name: `${resolvedDuration}-Day Plan - ${new Date().toLocaleDateString()}`,
        duration_days: resolvedDuration,
        platforms,
        status: 'active',
      })
      .select()
      .single()

    if (planError || !contentPlan) {
      console.error('Error creating content plan:', planError)
      return NextResponse.json(
        { error: 'Failed to save content plan' },
        { status: 500 }
      )
    }

    const postsToInsert = scheduledPosts.map((post) => ({
      content_plan_id: contentPlan.id,
      workspace_id: workspaceId,
      scheduled_date: post.scheduled_date,
      platform: post.platform,
      content_type: post.content_type,
      objective: post.objective,
      hook: post.hook,
      caption: post.caption,
      script: post.script || null,
      cta: post.cta || null,
      status: 'scheduled' as const,
    }))

    const { data: insertedPosts, error: postsError } = await supabase
      .from('posts')
      .insert(postsToInsert)
      .select('id')

    if (postsError) {
      console.error('Error creating posts:', postsError)
      await supabase.from('content_plans').delete().eq('id', contentPlan.id)
      return NextResponse.json(
        { error: 'Failed to save posts' },
        { status: 500 }
      )
    }

    const savedCount = insertedPosts?.length ?? 0
    if (savedCount === 0) {
      await supabase.from('content_plans').delete().eq('id', contentPlan.id)
      return NextResponse.json(
        { error: 'No posts were saved' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contentPlanId: contentPlan.id,
      postsGenerated: savedCount,
      scheduleStart: scheduledPosts[0]?.scheduled_date ?? null,
      scheduleEnd: scheduledPosts[scheduledPosts.length - 1]?.scheduled_date ?? null,
    })
  } catch (error: unknown) {
    console.error('Error in /api/generate:', error)
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
