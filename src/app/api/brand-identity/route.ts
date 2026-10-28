import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getUser } from '@/lib/supabase-server'
import { validateBlueprintForPersistence } from '@/lib/identity/stepValidation'
import {
  accountDraftFromProfile,
  buildProfileUpdateFromBlueprint,
} from '@/lib/identity/brandIdentityPersistence'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET — load saved brand identity for the authenticated user's workspace.
 * Never accepts a client workspace id.
 */
export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (wsError) {
      return NextResponse.json(
        { error: 'Failed to resolve workspace' },
        { status: 500 }
      )
    }
    if (!workspace) {
      return NextResponse.json({
        profile: null,
        draft: null,
        wizardCompletedAt: null,
      })
    }

    // Ownership already constrained by user_id filter + RLS
    const { data: profile, error: profileError } = await supabase
      .from('artist_profiles')
      .select(
        'id, workspace_id, name, genre, brand_voice, vibe_keywords, platforms, brand_identity, wizard_step, wizard_completed_at, updated_at'
      )
      .eq('workspace_id', workspace.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (profileError) {
      // Column may not exist until migration is applied
      const msg = profileError.message || 'Failed to load profile'
      if (/brand_identity|wizard_step|wizard_completed/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              'Brand identity columns are not available yet. Apply the pending Supabase migration.',
            code: 'MIGRATION_REQUIRED',
          },
          { status: 503 }
        )
      }
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({
        profile: null,
        draft: null,
        wizardCompletedAt: null,
      })
    }

    const draft = accountDraftFromProfile({
      brand_identity: profile.brand_identity,
      wizard_step: profile.wizard_step,
      wizard_completed_at: profile.wizard_completed_at,
    })

    return NextResponse.json({
      profile: {
        id: profile.id,
        workspaceId: profile.workspace_id,
        name: profile.name,
        wizardStep: profile.wizard_step,
        wizardCompletedAt: profile.wizard_completed_at,
        updatedAt: profile.updated_at,
      },
      draft,
      wizardCompletedAt: profile.wizard_completed_at,
    })
  } catch (e) {
    console.error('[brand-identity GET]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT — validate blueprint and upsert onto the user's artist_profiles row.
 * Workspace is resolved server-side from auth — client workspace ids are ignored.
 */
export async function PUT(request: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const payload =
      body && typeof body === 'object'
        ? (body as { blueprint?: unknown; wizardStep?: unknown })
        : {}

    // Explicitly ignore any client-supplied workspaceId
    const validated = validateBlueprintForPersistence(payload.blueprint)
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error, issues: validated.issues ?? [] },
        { status: 400 }
      )
    }

    const wizardStep =
      typeof payload.wizardStep === 'number' &&
      payload.wizardStep >= 1 &&
      payload.wizardStep <= 7
        ? payload.wizardStep
        : 7

    const supabase = createServerSupabaseClient()

    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found for this account' },
        { status: 404 }
      )
    }

    const columns = buildProfileUpdateFromBlueprint(
      validated.blueprint,
      wizardStep as 1 | 2 | 3 | 4 | 5 | 6 | 7
    )

    const { data: existing, error: existingError } = await supabase
      .from('artist_profiles')
      .select('id, name, genre, brand_voice, vibe_keywords, platforms')
      .eq('workspace_id', workspace.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingError) {
      const msg = existingError.message || 'Failed to load profile'
      if (/brand_identity|wizard_step|wizard_completed/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              'Brand identity columns are not available yet. Apply the pending Supabase migration.',
            code: 'MIGRATION_REQUIRED',
          },
          { status: 503 }
        )
      }
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    if (existing?.id) {
      // Update only — never create a second profile for the same workspace
      const { data: updated, error: updateError } = await supabase
        .from('artist_profiles')
        .update({
          brand_identity: columns.brand_identity,
          wizard_step: columns.wizard_step,
          wizard_completed_at: columns.wizard_completed_at,
          // Prefer wizard display name; keep prior name if somehow empty
          name: columns.name || existing.name,
          genre: columns.genre ?? existing.genre,
          brand_voice: columns.brand_voice ?? existing.brand_voice,
          vibe_keywords: columns.vibe_keywords ?? existing.vibe_keywords,
          updated_at: columns.updated_at,
        })
        .eq('id', existing.id)
        .eq('workspace_id', workspace.id)
        .select('id, wizard_completed_at, updated_at')
        .single()

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message || 'Failed to update brand identity' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        ok: true,
        profileId: updated.id,
        wizardCompletedAt: updated.wizard_completed_at,
        updatedAt: updated.updated_at,
        created: false,
      })
    }

    // No profile yet — insert one (auth callback usually creates earlier)
    const { data: inserted, error: insertError } = await supabase
      .from('artist_profiles')
      .insert({
        workspace_id: workspace.id,
        name: columns.name,
        genre: columns.genre,
        brand_voice: columns.brand_voice,
        vibe_keywords: columns.vibe_keywords,
        platforms: ['instagram'],
        brand_identity: columns.brand_identity,
        wizard_step: columns.wizard_step,
        wizard_completed_at: columns.wizard_completed_at,
        updated_at: columns.updated_at,
      })
      .select('id, wizard_completed_at, updated_at')
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message || 'Failed to create brand identity profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      profileId: inserted.id,
      wizardCompletedAt: inserted.wizard_completed_at,
      updatedAt: inserted.updated_at,
      created: true,
    })
  } catch (e) {
    console.error('[brand-identity PUT]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
