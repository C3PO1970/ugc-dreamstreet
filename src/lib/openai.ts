import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratedPost {
  date: string
  platform: 'instagram' | 'facebook'
  content_type: 'reel' | 'story' | 'feed'
  objective: 'promo' | 'viral' | 'bts' | 'education' | 'community'
  hook: string
  caption: string
  script: string
  cta: string
}

export interface GenerationInput {
  artistName: string
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

export async function generateContentPlan(input: GenerationInput): Promise<GeneratedPost[]> {
  const systemPrompt = `You are an expert social media content strategist for music artists.
Your job is to create a content plan that helps artists grow their audience and promote their music.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, just the JSON array.

The JSON must be an array of posts, each with these exact fields:
- date: ISO date string (starting from tomorrow)
- platform: "instagram" or "facebook"
- content_type: "reel" | "story" | "feed"
- objective: "promo" | "viral" | "bts" | "education" | "community"
- hook: A compelling first line to grab attention (max 10 words)
- caption: Full caption with emojis and hashtags (100-200 words)
- script: Script for video content if applicable (50-100 words)
- cta: Call to action (max 20 words)

Mix content types and objectives for variety. Make content feel authentic to the artist's voice.`

  const userPrompt = `Create a ${input.durationDays}-day content plan for:

Artist: ${input.artistName}
Genre: ${input.genre}
Vibe: ${input.vibeKeywords.join(', ')}
Brand Voice: ${input.brandVoice}
Platforms: ${input.platforms.join(', ')}

Content Library:
${input.contentLibrary.lyrics ? `Lyrics: ${input.contentLibrary.lyrics}` : ''}
${input.contentLibrary.songMeaning ? `Song Meaning: ${input.contentLibrary.songMeaning}` : ''}
${input.contentLibrary.releaseNotes ? `Release Notes: ${input.contentLibrary.releaseNotes}` : ''}
${input.contentLibrary.personalStory ? `Personal Story: ${input.contentLibrary.personalStory}` : ''}
${input.contentLibrary.audienceNotes ? `Audience Notes: ${input.contentLibrary.audienceNotes}` : ''}

Generate ${input.durationDays} posts total, distributed across the selected platforms.
Return ONLY the JSON array.`

  async function tryGenerate(): Promise<GeneratedPost[]> {
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

    const parsed = JSON.parse(content)
    
    // Handle both { posts: [...] } and direct array formats
    const posts = Array.isArray(parsed) ? parsed : parsed.posts
    
    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format: expected array of posts')
    }

    return posts as GeneratedPost[]
  }

  // Try once, retry on failure
  try {
    return await tryGenerate()
  } catch (error) {
    console.error('First attempt failed, retrying...', error)
    return await tryGenerate()
  }
}
