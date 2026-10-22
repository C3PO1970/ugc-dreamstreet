import OpenAI from 'openai'
import {
  validateGeneratedPosts,
  type RawGeneratedPost,
} from '@/lib/contentPlanValidation'

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export type { RawGeneratedPost }

export interface GenerationInput {
  /** Preferred creator / brand name. */
  creatorName?: string
  /** Legacy alias for creatorName — still supported. */
  artistName: string
  /** Industry / category (legacy column name: genre). */
  genre: string
  vibeKeywords: string[]
  brandVoice: string
  platforms: string[]
  durationDays: number
  contentLibrary: {
    lyrics?: string
    songMeaning?: string
    releaseNotes?: string
    personalStory?: string
    audienceNotes?: string
  }
}

/**
 * Ask the model for post *content* only.
 * Publishing dates are assigned by the application (see contentPlanSchedule.ts).
 */
export async function generateContentPlan(
  input: GenerationInput
): Promise<RawGeneratedPost[]> {
  const creatorLabel =
    (input.creatorName && input.creatorName.trim()) || input.artistName

  const systemPrompt = `You are an expert social media content strategist for creators of all kinds — influencers, UGC creators, video creators, musicians, podcasters, YouTubers, photographers, coaches, educators, entrepreneurs, small businesses, brands, and marketing professionals.

Your job is to create post concepts that help the creator grow their audience and achieve their goals. Adapt tone, topics, and CTAs to their industry/category, audience, platforms, and brand voice. When the category is music-related, it is appropriate to include releases, lyrics, and fan engagement. For other categories, prioritize relevant formats (sponsored content, product promos, episode promos, educational posts, brand deliverables, visual portfolios, etc.).

CRITICAL SCHEDULING RULE:
- Do NOT invent calendar dates, years, or publishing schedules.
- Do NOT include a "date" or "scheduled_date" field.
- The application assigns publishing dates separately.

Return a single JSON object with this exact shape:
{ "posts": [ ... ] }

Each post object must include ONLY these fields:
- platform: "instagram" or "facebook" (must be one of the platforms provided by the user)
- content_type: "reel" | "story" | "feed"
- objective: "promo" | "viral" | "bts" | "education" | "community"
- hook: A compelling first line to grab attention (max 10 words)
- caption: Full caption with emojis and hashtags (100-200 words)
- script: Script for video content if applicable (50-100 words), or empty string
- cta: Call to action (max 20 words)

Mix content types and objectives for variety. Make content feel authentic to the creator's voice.`

  const userPrompt = `Create about ${input.durationDays} social posts (approximately one concept per day of a ${input.durationDays}-day plan) for:

Creator / Brand: ${creatorLabel}
Industry / Category: ${input.genre}
Vibe: ${input.vibeKeywords.join(', ')}
Brand Voice: ${input.brandVoice}
Platforms (use ONLY these): ${input.platforms.join(', ')}

Content Library (use what is provided; ignore empty sections):
${input.contentLibrary.lyrics ? `Key lines / lyrics / quotes: ${input.contentLibrary.lyrics}` : ''}
${input.contentLibrary.songMeaning ? `Core message / story / meaning: ${input.contentLibrary.songMeaning}` : ''}
${input.contentLibrary.releaseNotes ? `Release / launch / offer notes: ${input.contentLibrary.releaseNotes}` : ''}
${input.contentLibrary.personalStory ? `Personal or brand story: ${input.contentLibrary.personalStory}` : ''}
${input.contentLibrary.audienceNotes ? `Audience notes: ${input.contentLibrary.audienceNotes}` : ''}

Return JSON as { "posts": [ ... ] } with roughly ${input.durationDays} posts. Do not include dates.`

  async function tryGenerate(): Promise<RawGeneratedPost[]> {
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error('AI returned invalid JSON')
    }

    return validateGeneratedPosts(parsed, {
      durationDays: input.durationDays,
      allowedPlatforms: input.platforms,
    })
  }

  try {
    return await tryGenerate()
  } catch (error) {
    console.error('First attempt failed, retrying...', error)
    return await tryGenerate()
  }
}
