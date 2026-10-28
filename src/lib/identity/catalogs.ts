import type {
  AgeRangeId,
  AudienceFamiliarityId,
  AudienceInterestId,
  AudienceNeedId,
  AudienceTypeId,
  CallToActionId,
  CatalogOption,
  ColorPaletteOption,
  CommunicationToneId,
  ContentPriorityId,
  CreatorKindOption,
  GeographyId,
  IndustryOption,
  MarketingGoalId,
  OfferingTypeId,
  PersonalityTraitId,
  VisualAestheticId,
  VisualContentStyleId,
  VisualMoodId,
  VoiceAttributeId,
} from './types'

export const CREATOR_KIND_OPTIONS: CreatorKindOption[] = [
  {
    id: 'musician_artist',
    label: 'Musician / Artist',
    description: 'Performers, songwriters, and recording artists',
  },
  {
    id: 'music_producer',
    label: 'Music Producer',
    description: 'Beatmakers, mixers, and studio producers',
  },
  {
    id: 'influencer',
    label: 'Influencer',
    description: 'Audience-led creators and lifestyle voices',
  },
  {
    id: 'content_creator',
    label: 'Content Creator',
    description: 'Short-form, long-form, and multi-platform creators',
  },
  {
    id: 'business_brand',
    label: 'Business / Brand',
    description: 'Companies, product brands, and organizations',
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur',
    description: 'Founders and operators building in public',
  },
  {
    id: 'educator',
    label: 'Educator',
    description: 'Teachers, coaches, and course creators',
  },
  {
    id: 'podcaster',
    label: 'Podcaster',
    description: 'Audio shows, interviews, and series hosts',
  },
  {
    id: 'designer',
    label: 'Designer',
    description: 'Visual, product, fashion, and brand design',
  },
  {
    id: 'photographer',
    label: 'Photographer',
    description: 'Photo, editorial, and visual storytelling',
  },
  {
    id: 'writer',
    label: 'Writer',
    description: 'Authors, journalists, and newsletter creators',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else — tell us in a few words',
  },
]

/**
 * Hierarchical industry → niche catalog.
 * Extend in code without database migrations.
 */
export const INDUSTRY_CATALOG: IndustryOption[] = [
  {
    id: 'music',
    label: 'Music',
    niches: [
      {
        id: 'electronic',
        label: 'Electronic',
        children: [
          { id: 'tech-house', label: 'Tech House' },
          { id: 'deep-house', label: 'Deep House' },
          { id: 'melodic-techno', label: 'Melodic Techno' },
          { id: 'indie-dance', label: 'Indie Dance' },
          { id: 'ambient', label: 'Ambient' },
        ],
      },
      {
        id: 'hip-hop',
        label: 'Hip-Hop',
        children: [
          { id: 'trap', label: 'Trap' },
          { id: 'rnb', label: 'R&B' },
          { id: 'drill', label: 'Drill' },
        ],
      },
      {
        id: 'pop',
        label: 'Pop',
        children: [
          { id: 'indie-pop', label: 'Indie Pop' },
          { id: 'dance-pop', label: 'Dance Pop' },
        ],
      },
      {
        id: 'rock',
        label: 'Rock',
        children: [
          { id: 'indie-rock', label: 'Indie Rock' },
          { id: 'alternative', label: 'Alternative' },
        ],
      },
      { id: 'latin', label: 'Latin' },
      { id: 'jazz', label: 'Jazz' },
      { id: 'classical', label: 'Classical' },
      { id: 'country', label: 'Country' },
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion',
    niches: [
      { id: 'streetwear', label: 'Streetwear' },
      { id: 'luxury', label: 'Luxury' },
      { id: 'contemporary', label: 'Contemporary' },
      { id: 'sustainable', label: 'Sustainable' },
      { id: 'accessories', label: 'Accessories' },
    ],
  },
  {
    id: 'beauty',
    label: 'Beauty',
    niches: [
      { id: 'skincare', label: 'Skincare' },
      { id: 'cosmetics', label: 'Cosmetics' },
      { id: 'haircare', label: 'Haircare' },
      { id: 'fragrance', label: 'Fragrance' },
      { id: 'wellness-beauty', label: 'Wellness Beauty' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    niches: [
      { id: 'software', label: 'Software' },
      { id: 'artificial-intelligence', label: 'Artificial Intelligence' },
      { id: 'consumer-electronics', label: 'Consumer Electronics' },
      { id: 'saas', label: 'SaaS' },
      { id: 'crypto-web3', label: 'Crypto / Web3' },
    ],
  },
  {
    id: 'food',
    label: 'Food',
    niches: [
      { id: 'restaurants', label: 'Restaurants' },
      { id: 'food-products', label: 'Food Products' },
      { id: 'cooking', label: 'Cooking' },
      { id: 'beverage', label: 'Beverage' },
      { id: 'delivery', label: 'Delivery & QSR' },
    ],
  },
  {
    id: 'fitness',
    label: 'Fitness & Wellness',
    niches: [
      { id: 'gym-training', label: 'Gym & Training' },
      { id: 'yoga', label: 'Yoga' },
      { id: 'nutrition', label: 'Nutrition' },
      { id: 'mental-wellness', label: 'Mental Wellness' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    niches: [
      { id: 'online-courses', label: 'Online Courses' },
      { id: 'coaching', label: 'Coaching' },
      { id: 'k12', label: 'K–12' },
      { id: 'higher-ed', label: 'Higher Education' },
    ],
  },
  {
    id: 'media',
    label: 'Media & Entertainment',
    niches: [
      { id: 'film-tv', label: 'Film & TV' },
      { id: 'gaming', label: 'Gaming' },
      { id: 'publishing', label: 'Publishing' },
      { id: 'live-events', label: 'Live Events' },
    ],
  },
  {
    id: 'professional-services',
    label: 'Professional Services',
    niches: [
      { id: 'marketing', label: 'Marketing' },
      { id: 'consulting', label: 'Consulting' },
      { id: 'legal', label: 'Legal' },
      { id: 'finance', label: 'Finance' },
      { id: 'real-estate', label: 'Real Estate' },
    ],
  },
  {
    id: 'other-industry',
    label: 'Other',
    niches: [{ id: 'custom', label: 'Custom / Cross-industry' }],
  },
]

export const MAX_NICHE_SELECTIONS = 5
export const MAX_SECONDARY_KINDS = 3
export const MAX_SECONDARY_PERSONALITIES = 4
export const MAX_VOICE_ATTRIBUTES = 5
export const MAX_VISUAL_AESTHETICS = 3
export const MAX_COLOR_PALETTES = 2
export const MAX_CONTENT_STYLES = 4
export const MAX_VISUAL_MOODS = 3
export const MAX_AUDIENCE_TYPES = 5
export const MAX_AUDIENCE_INTERESTS = 6
export const MAX_AUDIENCE_NEEDS = 5
export const MAX_OFFERINGS = 6
export const MAX_SECONDARY_GOALS = 4
export const MAX_CALLS_TO_ACTION = 4
export const MAX_CONTENT_PRIORITIES = 4

export const PERSONALITY_TRAITS: CatalogOption<PersonalityTraitId>[] = [
  {
    id: 'sophisticated',
    label: 'Sophisticated',
    description: 'Refined, cultured, and carefully composed.',
    aiHints: {
      vocabulary: ['refined', 'curated', 'considered'],
      tone: ['polished', 'measured'],
      messaging: ['quality over quantity', 'elevated positioning'],
    },
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Graceful simplicity with understated polish.',
    aiHints: {
      vocabulary: ['graceful', 'timeless', 'refined'],
      tone: ['soft-premium', 'composed'],
      messaging: ['effortless quality'],
    },
  },
  {
    id: 'luxurious',
    label: 'Luxurious',
    description: 'Exclusive, high-end, and intentionally sparse.',
    aiHints: {
      vocabulary: ['exclusive', 'premium', 'bespoke'],
      tone: ['confident', 'restrained'],
      messaging: ['aspirational access', 'craft and detail'],
    },
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Light, fun, and approachable energy.',
    aiHints: {
      vocabulary: ['fun', 'bright', 'curious'],
      tone: ['witty', 'upbeat'],
      messaging: ['invite participation', 'delight'],
    },
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Confident statements and strong presence.',
    aiHints: {
      vocabulary: ['unapologetic', 'powerful', 'clear'],
      tone: ['assertive', 'high-impact'],
      messaging: ['stand out', 'lead the conversation'],
    },
  },
  {
    id: 'rebellious',
    label: 'Rebellious',
    description: 'Challenges norms; independent and raw.',
    aiHints: {
      vocabulary: ['disrupt', 'raw', 'independent'],
      tone: ['edgy', 'provocative'],
      messaging: ['against the grain'],
    },
  },
  {
    id: 'mysterious',
    label: 'Mysterious',
    description: 'Intrigue, restraint, and selective reveal.',
    aiHints: {
      vocabulary: ['hidden', 'layered', 'intriguing'],
      tone: ['suggestive', 'sparse'],
      messaging: ['leave room to wonder'],
    },
  },
  {
    id: 'warm',
    label: 'Warm',
    description: 'Human, caring, and emotionally open.',
    aiHints: {
      vocabulary: ['together', 'care', 'genuine'],
      tone: ['empathetic', 'soft'],
      messaging: ['belonging and support'],
    },
  },
  {
    id: 'welcoming',
    label: 'Welcoming',
    description: 'Inclusive and easy to join.',
    aiHints: {
      vocabulary: ['welcome', 'join', 'community'],
      tone: ['friendly', 'open'],
      messaging: ['you belong here'],
    },
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Clear, sparse, and focused on essentials.',
    aiHints: {
      vocabulary: ['simple', 'essential', 'clear'],
      tone: ['concise', 'quiet'],
      messaging: ['less noise, more signal'],
    },
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Imaginative and idea-forward.',
    aiHints: {
      vocabulary: ['imagine', 'craft', 'original'],
      tone: ['expressive', 'curious'],
      messaging: ['new ways of seeing'],
    },
  },
  {
    id: 'futuristic',
    label: 'Futuristic',
    description: 'Forward-looking tech and innovation energy.',
    aiHints: {
      vocabulary: ['next', 'intelligent', 'evolving'],
      tone: ['modern', 'precise'],
      messaging: ['what comes next'],
    },
  },
  {
    id: 'authentic',
    label: 'Authentic',
    description: 'Honest, transparent, and real.',
    aiHints: {
      vocabulary: ['real', 'honest', 'behind-the-scenes'],
      tone: ['candid', 'grounded'],
      messaging: ['no filter, clear intent'],
    },
  },
  {
    id: 'adventurous',
    label: 'Adventurous',
    description: 'Exploration, risk, and discovery.',
    aiHints: {
      vocabulary: ['explore', 'discover', 'go further'],
      tone: ['energized', 'open'],
      messaging: ['try the unfamiliar'],
    },
  },
  {
    id: 'romantic',
    label: 'Romantic',
    description: 'Emotion, beauty, and intimate storytelling.',
    aiHints: {
      vocabulary: ['beauty', 'heart', 'moment'],
      tone: ['lyrical', 'soft'],
      messaging: ['connection and feeling'],
    },
  },
  {
    id: 'energetic',
    label: 'Energetic',
    description: 'High tempo and momentum.',
    aiHints: {
      vocabulary: ['go', 'now', 'momentum'],
      tone: ['fast', 'excited'],
      messaging: ['move with urgency'],
    },
  },
  {
    id: 'calm',
    label: 'Calm',
    description: 'Steady, peaceful, and grounding.',
    aiHints: {
      vocabulary: ['ease', 'balance', 'breathe'],
      tone: ['slow', 'reassuring'],
      messaging: ['reduce overwhelm'],
    },
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Credible, clear, and business-ready.',
    aiHints: {
      vocabulary: ['results', 'clarity', 'expertise'],
      tone: ['formal-leaning', 'precise'],
      messaging: ['trust and competence'],
    },
  },
  {
    id: 'edgy',
    label: 'Edgy',
    description: 'Sharp, contemporary, and a little risky.',
    aiHints: {
      vocabulary: ['sharp', 'current', 'unexpected'],
      tone: ['irreverent', 'tight'],
      messaging: ['cut through sameness'],
    },
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    description: 'Uplifting vision and motivation.',
    aiHints: {
      vocabulary: ['possible', 'grow', 'become'],
      tone: ['uplifting', 'visionary'],
      messaging: ['encourage action and hope'],
    },
  },
]

export const VOICE_ATTRIBUTES: CatalogOption<VoiceAttributeId>[] = [
  {
    id: 'conversational',
    label: 'Conversational',
    description: 'Sounds like a smart friend talking.',
    aiHints: { tone: ['casual', 'dialogue-like'], vocabulary: ['you', 'we'] },
  },
  {
    id: 'authoritative',
    label: 'Authoritative',
    description: 'Expert, decisive, and credible.',
    aiHints: { tone: ['expert', 'definitive'], messaging: ['clear recommendations'] },
  },
  {
    id: 'educational',
    label: 'Educational',
    description: 'Teaches with structure and clarity.',
    aiHints: { tone: ['instructive'], messaging: ['step-by-step value'] },
  },
  {
    id: 'witty',
    label: 'Witty',
    description: 'Clever turns of phrase without clutter.',
    aiHints: { tone: ['clever', 'light irony'], vocabulary: ['punchy'] },
  },
  {
    id: 'emotional',
    label: 'Emotional',
    description: 'Leads with feeling and empathy.',
    aiHints: { tone: ['emotive'], messaging: ['human stakes'] },
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    description: 'Motivates toward a better future.',
    aiHints: { tone: ['uplifting'], messaging: ['aspiration'] },
  },
  {
    id: 'direct',
    label: 'Direct',
    description: 'Short, clear, no fluff.',
    aiHints: { tone: ['blunt-positive'], vocabulary: ['short sentences'] },
  },
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Warm and easy to approach.',
    aiHints: { tone: ['warm', 'inclusive'] },
  },
  {
    id: 'confident',
    label: 'Confident',
    description: 'Assured without arrogance.',
    aiHints: { tone: ['assured'], messaging: ['own the POV'] },
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    description: 'Narrative arcs and scenes.',
    aiHints: { tone: ['narrative'], messaging: ['scene → insight → ask'] },
  },
  {
    id: 'informative',
    label: 'Informative',
    description: 'Facts, context, and useful detail.',
    aiHints: { tone: ['explanatory'], messaging: ['clarity first'] },
  },
  {
    id: 'humorous',
    label: 'Humorous',
    description: 'Light humor that fits the brand.',
    aiHints: { tone: ['playful humor'], vocabulary: ['light punchlines'] },
  },
]

export const COMMUNICATION_TONES: CatalogOption<CommunicationToneId>[] = [
  {
    id: 'warm_approachable',
    label: 'Warm & approachable',
    description: 'Friendly openness without losing clarity.',
    aiHints: { tone: ['warm', 'inviting'] },
  },
  {
    id: 'polished_premium',
    label: 'Polished & premium',
    description: 'Elevated language with restraint.',
    aiHints: { tone: ['premium', 'measured'] },
  },
  {
    id: 'bold_direct',
    label: 'Bold & direct',
    description: 'Strong POV and clear calls to action.',
    aiHints: { tone: ['direct', 'high contrast'] },
  },
  {
    id: 'calm_reassuring',
    label: 'Calm & reassuring',
    description: 'Steady guidance that reduces anxiety.',
    aiHints: { tone: ['calm', 'supportive'] },
  },
  {
    id: 'playful_light',
    label: 'Playful & light',
    description: 'Fun energy that still respects the reader.',
    aiHints: { tone: ['playful', 'light'] },
  },
  {
    id: 'serious_expert',
    label: 'Serious & expert',
    description: 'Professional depth and credibility.',
    aiHints: { tone: ['expert', 'formal-leaning'] },
  },
]

export const VISUAL_AESTHETICS: CatalogOption<VisualAestheticId>[] = [
  {
    id: 'modern_luxury',
    label: 'Modern Luxury',
    description: 'Clean premium surfaces, sparse composition.',
    aiHints: { visual: ['luxury negative space', 'premium materials'] },
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Magazine-like framing and typography focus.',
    aiHints: { visual: ['editorial crop', 'strong headlines'] },
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Few elements, lots of breathing room.',
    aiHints: { visual: ['minimal layout', 'limited palette'] },
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Widescreen drama, lighting, and depth.',
    aiHints: { visual: ['cinematic lighting', 'shallow depth'] },
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    description: 'Urban culture, bold graphics, motion.',
    aiHints: { visual: ['street casting', 'graphic overlays'] },
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Nostalgic textures and period cues.',
    aiHints: { visual: ['film grain', 'retro type'] },
  },
  {
    id: 'futuristic',
    label: 'Futuristic',
    description: 'Tech-forward shapes and glow.',
    aiHints: { visual: ['tech UI cues', 'cool metallics'] },
  },
  {
    id: 'organic',
    label: 'Organic',
    description: 'Natural forms, soft textures, earthiness.',
    aiHints: { visual: ['natural textures', 'soft edges'] },
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Rounded shapes, bright accents, fun layout.',
    aiHints: { visual: ['rounded UI', 'bright accents'] },
  },
  {
    id: 'dark_moody',
    label: 'Dark & Moody',
    description: 'Low-key lighting and deep contrast.',
    aiHints: { visual: ['low-key lighting', 'deep shadows'] },
  },
  {
    id: 'bright_airy',
    label: 'Bright & Airy',
    description: 'High key light and open space.',
    aiHints: { visual: ['high-key light', 'airy whitespace'] },
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Refined type and balanced composition.',
    aiHints: { visual: ['serif accents', 'balanced grids'] },
  },
  {
    id: 'artistic',
    label: 'Artistic',
    description: 'Expressive, gallery-inspired visuals.',
    aiHints: { visual: ['artful composition', 'creative crops'] },
  },
  {
    id: 'industrial',
    label: 'Industrial',
    description: 'Raw materials, metal, concrete energy.',
    aiHints: { visual: ['raw materials', 'utilitarian type'] },
  },
  {
    id: 'retro',
    label: 'Retro',
    description: 'Throwback palettes and period graphics.',
    aiHints: { visual: ['retro graphics', 'period color'] },
  },
]

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: 'black_gold',
    label: 'Black / Gold',
    description: 'High-contrast luxury pairing.',
    swatches: ['#0a0a0a', '#c9a227', '#f5e6a8'],
    aiHints: { visual: ['black and gold luxury'] },
  },
  {
    id: 'cream_charcoal',
    label: 'Cream / Charcoal',
    description: 'Soft neutral with grounded contrast.',
    swatches: ['#f5f0e8', '#d9cfc0', '#2f2f2f'],
    aiHints: { visual: ['cream and charcoal neutrals'] },
  },
  {
    id: 'white_neutral',
    label: 'White / Neutral',
    description: 'Clean whites and soft greys.',
    swatches: ['#ffffff', '#f3f4f6', '#9ca3af'],
    aiHints: { visual: ['white neutral clean'] },
  },
  {
    id: 'earth_tones',
    label: 'Earth Tones',
    description: 'Terracotta, olive, sand, and clay.',
    swatches: ['#8b5e3c', '#a3a567', '#e2c9a0'],
    aiHints: { visual: ['earth tone palette'] },
  },
  {
    id: 'pastel',
    label: 'Pastel',
    description: 'Soft, airy pastel accents.',
    swatches: ['#f8c8dc', '#cde7f0', '#e8d5f2'],
    aiHints: { visual: ['pastel soft palette'] },
  },
  {
    id: 'bold_primary',
    label: 'Bold Primary Colors',
    description: 'Strong reds, blues, and yellows.',
    swatches: ['#e11d48', '#2563eb', '#facc15'],
    aiHints: { visual: ['bold primary colors'] },
  },
  {
    id: 'neon',
    label: 'Neon',
    description: 'Electric accents on dark bases.',
    swatches: ['#111827', '#22d3ee', '#a3e635'],
    aiHints: { visual: ['neon on dark'] },
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    description: 'Single-hue greyscale discipline.',
    swatches: ['#111111', '#6b7280', '#e5e7eb'],
    aiHints: { visual: ['monochrome greyscale'] },
  },
  {
    id: 'jewel_tones',
    label: 'Jewel Tones',
    description: 'Emerald, sapphire, ruby depth.',
    swatches: ['#064e3b', '#1e3a8a', '#9f1239'],
    aiHints: { visual: ['jewel tone richness'] },
  },
]

export const VISUAL_CONTENT_STYLES: CatalogOption<VisualContentStyleId>[] = [
  {
    id: 'photography',
    label: 'Photography',
    description: 'Photo-led storytelling.',
    aiHints: { visual: ['photographic realism'] },
  },
  {
    id: 'illustration',
    label: 'Illustration',
    description: 'Drawn or graphic illustration.',
    aiHints: { visual: ['illustration-led'] },
  },
  {
    id: 'typography',
    label: 'Typography',
    description: 'Type as the hero visual.',
    aiHints: { visual: ['type-led layouts'] },
  },
  {
    id: 'product_focused',
    label: 'Product-Focused',
    description: 'Product hero shots and detail.',
    aiHints: { visual: ['product hero focus'] },
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    description: 'People and context in real life.',
    aiHints: { visual: ['lifestyle context'] },
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Film still energy and motion cues.',
    aiHints: { visual: ['cinematic stills'] },
  },
  {
    id: 'abstract',
    label: 'Abstract',
    description: 'Shapes, texture, and concept art.',
    aiHints: { visual: ['abstract forms'] },
  },
  {
    id: 'mixed_media',
    label: 'Mixed Media',
    description: 'Blend photo, type, and graphic layers.',
    aiHints: { visual: ['mixed media collage'] },
  },
]

export const VISUAL_MOODS: CatalogOption<VisualMoodId>[] = [
  {
    id: 'warm',
    label: 'Warm',
    description: 'Golden, inviting light feel.',
    aiHints: { visual: ['warm color temperature'] },
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Blue-leaning and crisp.',
    aiHints: { visual: ['cool color temperature'] },
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    description: 'Strong light/shadow storytelling.',
    aiHints: { visual: ['dramatic contrast'] },
  },
  {
    id: 'soft',
    label: 'Soft',
    description: 'Gentle gradients and diffusion.',
    aiHints: { visual: ['soft diffusion'] },
  },
  {
    id: 'vibrant',
    label: 'Vibrant',
    description: 'Saturated, lively color.',
    aiHints: { visual: ['high saturation'] },
  },
  {
    id: 'muted',
    label: 'Muted',
    description: 'Desaturated, quiet tones.',
    aiHints: { visual: ['muted palette'] },
  },
  {
    id: 'high_contrast',
    label: 'High Contrast',
    description: 'Sharp separation of light and dark.',
    aiHints: { visual: ['high contrast'] },
  },
  {
    id: 'natural',
    label: 'Natural',
    description: 'True-to-life, unforced look.',
    aiHints: { visual: ['naturalistic finish'] },
  },
]

export const AUDIENCE_TYPES: CatalogOption<AudienceTypeId>[] = [
  {
    id: 'consumers',
    label: 'Consumers',
    description: 'Everyday buyers and product users.',
    aiHints: { audience: ['consumer audience'] },
  },
  {
    id: 'businesses',
    label: 'Businesses',
    description: 'Companies and B2B decision-makers.',
    aiHints: { audience: ['B2B business audience'] },
  },
  {
    id: 'fans',
    label: 'Fans',
    description: 'Supporters who follow and engage.',
    aiHints: { audience: ['fan community'] },
  },
  {
    id: 'professionals',
    label: 'Professionals',
    description: 'Working experts and career-focused people.',
    aiHints: { audience: ['professional audience'] },
  },
  {
    id: 'students',
    label: 'Students',
    description: 'Learners in school or early career.',
    aiHints: { audience: ['student audience'] },
  },
  {
    id: 'homeowners',
    label: 'Homeowners',
    description: 'People investing in home and property.',
    aiHints: { audience: ['homeowner audience'] },
  },
  {
    id: 'creators',
    label: 'Creators',
    description: 'Makers, artists, and content producers.',
    aiHints: { audience: ['creator audience'] },
  },
  {
    id: 'entrepreneurs',
    label: 'Entrepreneurs',
    description: 'Founders and builders growing ventures.',
    aiHints: { audience: ['entrepreneur audience'] },
  },
  {
    id: 'parents',
    label: 'Parents',
    description: 'Caregivers making family decisions.',
    aiHints: { audience: ['parent audience'] },
  },
  {
    id: 'travelers',
    label: 'Travelers',
    description: 'People exploring destinations and experiences.',
    aiHints: { audience: ['traveler audience'] },
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Describe your audience in a few words below.',
    aiHints: { audience: ['custom audience segment'] },
  },
]

export const AGE_RANGES: CatalogOption<AgeRangeId>[] = [
  {
    id: '18_24',
    label: '18–24',
    description: 'Gen Z adults early in discovery.',
    aiHints: { audience: ['ages 18-24'] },
  },
  {
    id: '25_34',
    label: '25–34',
    description: 'Young professionals and builders.',
    aiHints: { audience: ['ages 25-34'] },
  },
  {
    id: '35_44',
    label: '35–44',
    description: 'Established careers and households.',
    aiHints: { audience: ['ages 35-44'] },
  },
  {
    id: '45_54',
    label: '45–54',
    description: 'Mid-career and family decision-makers.',
    aiHints: { audience: ['ages 45-54'] },
  },
  {
    id: '55_plus',
    label: '55+',
    description: 'Experienced buyers and lifelong fans.',
    aiHints: { audience: ['ages 55+'] },
  },
  {
    id: 'all_ages',
    label: 'All Ages',
    description: 'Broad appeal across age groups.',
    aiHints: { audience: ['all-ages audience'] },
  },
]

export const GEOGRAPHY_OPTIONS: CatalogOption<GeographyId>[] = [
  {
    id: 'local',
    label: 'Local',
    description: 'City or neighborhood focus.',
    aiHints: { audience: ['local geography'] },
  },
  {
    id: 'regional',
    label: 'Regional',
    description: 'State, metro, or multi-city area.',
    aiHints: { audience: ['regional geography'] },
  },
  {
    id: 'national',
    label: 'National',
    description: 'Country-wide reach.',
    aiHints: { audience: ['national geography'] },
  },
  {
    id: 'international',
    label: 'International',
    description: 'Multi-country presence.',
    aiHints: { audience: ['international geography'] },
  },
  {
    id: 'online_global',
    label: 'Online / Global',
    description: 'Internet-first, location-agnostic.',
    aiHints: { audience: ['online global audience'] },
  },
]

export const AUDIENCE_INTERESTS: CatalogOption<AudienceInterestId>[] = [
  {
    id: 'music',
    label: 'Music',
    description: 'Artists, genres, and listening culture.',
    aiHints: { audience: ['interested in music'] },
  },
  {
    id: 'fashion',
    label: 'Fashion',
    description: 'Style, apparel, and trends.',
    aiHints: { audience: ['interested in fashion'] },
  },
  {
    id: 'beauty',
    label: 'Beauty',
    description: 'Skincare, makeup, and self-care looks.',
    aiHints: { audience: ['interested in beauty'] },
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Tools, gadgets, and digital products.',
    aiHints: { audience: ['interested in technology'] },
  },
  {
    id: 'design',
    label: 'Design',
    description: 'Visual craft, interiors, and product design.',
    aiHints: { audience: ['interested in design'] },
  },
  {
    id: 'wellness',
    label: 'Wellness',
    description: 'Mindfulness, recovery, and balance.',
    aiHints: { audience: ['interested in wellness'] },
  },
  {
    id: 'fitness',
    label: 'Fitness',
    description: 'Training, sports, and movement.',
    aiHints: { audience: ['interested in fitness'] },
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Shows, culture, and pop moments.',
    aiHints: { audience: ['interested in entertainment'] },
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Learning and skill-building.',
    aiHints: { audience: ['interested in education'] },
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Growth, careers, and markets.',
    aiHints: { audience: ['interested in business'] },
  },
  {
    id: 'food',
    label: 'Food',
    description: 'Cooking, dining, and culinary culture.',
    aiHints: { audience: ['interested in food'] },
  },
  {
    id: 'travel',
    label: 'Travel',
    description: 'Destinations and experiences.',
    aiHints: { audience: ['interested in travel'] },
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    description: 'Everyday living and personal taste.',
    aiHints: { audience: ['interested in lifestyle'] },
  },
]

export const AUDIENCE_NEEDS: CatalogOption<AudienceNeedId>[] = [
  {
    id: 'education',
    label: 'Education',
    description: 'They want to learn and improve.',
    aiHints: { messaging: ['educate the audience'], audience: ['needs education'] },
  },
  {
    id: 'inspiration',
    label: 'Inspiration',
    description: 'They want ideas and motivation.',
    aiHints: { messaging: ['inspire action'], audience: ['needs inspiration'] },
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'They want enjoyment and escape.',
    aiHints: { messaging: ['entertain first'], audience: ['needs entertainment'] },
  },
  {
    id: 'convenience',
    label: 'Convenience',
    description: 'They want simpler, faster solutions.',
    aiHints: { messaging: ['emphasize convenience'], audience: ['needs convenience'] },
  },
  {
    id: 'affordability',
    label: 'Affordability',
    description: 'They prioritize value and price.',
    aiHints: { messaging: ['value-conscious messaging'], audience: ['needs affordability'] },
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'They seek premium experiences.',
    aiHints: { messaging: ['premium luxury positioning'], audience: ['needs luxury'] },
  },
  {
    id: 'community',
    label: 'Community',
    description: 'They want belonging and connection.',
    aiHints: { messaging: ['community belonging'], audience: ['needs community'] },
  },
  {
    id: 'professional_expertise',
    label: 'Professional Expertise',
    description: 'They trust specialists and credentials.',
    aiHints: {
      messaging: ['demonstrate expertise'],
      audience: ['needs professional expertise'],
    },
  },
  {
    id: 'problem_solving',
    label: 'Problem Solving',
    description: 'They need clear answers to pain points.',
    aiHints: {
      messaging: ['solve a concrete problem'],
      audience: ['needs problem solving'],
    },
  },
]

export const AUDIENCE_FAMILIARITY: CatalogOption<AudienceFamiliarityId>[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'New to your topic or category.',
    aiHints: { audience: ['beginner familiarity'], messaging: ['explain basics clearly'] },
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience, still growing.',
    aiHints: { audience: ['intermediate familiarity'] },
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Deep knowledge and high standards.',
    aiHints: { audience: ['advanced familiarity'], messaging: ['speak to experts'] },
  },
  {
    id: 'mixed',
    label: 'Mixed',
    description: 'Wide range of experience levels.',
    aiHints: { audience: ['mixed familiarity levels'] },
  },
]

export const OFFERING_TYPES: CatalogOption<OfferingTypeId>[] = [
  {
    id: 'physical_products',
    label: 'Physical Products',
    description: 'Tangible goods you sell or ship.',
    aiHints: { offerings: ['physical products'] },
  },
  {
    id: 'digital_products',
    label: 'Digital Products',
    description: 'Downloads, templates, and digital goods.',
    aiHints: { offerings: ['digital products'] },
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Done-for-you or done-with-you work.',
    aiHints: { offerings: ['services'] },
  },
  {
    id: 'consultations',
    label: 'Consultations',
    description: '1:1 advice and strategy sessions.',
    aiHints: { offerings: ['consultations'] },
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    description: 'Recurring paid access or delivery.',
    aiHints: { offerings: ['subscriptions'] },
  },
  {
    id: 'memberships',
    label: 'Memberships',
    description: 'Community or club-style access.',
    aiHints: { offerings: ['memberships'] },
  },
  {
    id: 'courses',
    label: 'Courses',
    description: 'Structured learning programs.',
    aiHints: { offerings: ['courses'] },
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Live, virtual, or hybrid gatherings.',
    aiHints: { offerings: ['events'] },
  },
  {
    id: 'music',
    label: 'Music',
    description: 'Releases, streams, and catalogs.',
    aiHints: { offerings: ['music releases'] },
  },
  {
    id: 'merchandise',
    label: 'Merchandise',
    description: 'Branded apparel and collectibles.',
    aiHints: { offerings: ['merchandise'] },
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Media, posts, and editorial series.',
    aiHints: { offerings: ['content offerings'] },
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else — note it briefly below.',
    aiHints: { offerings: ['custom offering'] },
  },
]

export const MARKETING_GOALS: CatalogOption<MarketingGoalId>[] = [
  {
    id: 'brand_awareness',
    label: 'Brand Awareness',
    description: 'Get recognized by more of the right people.',
    aiHints: { goals: ['brand awareness'] },
  },
  {
    id: 'generate_leads',
    label: 'Generate Leads',
    description: 'Capture interest and contact info.',
    aiHints: { goals: ['lead generation'] },
  },
  {
    id: 'increase_sales',
    label: 'Increase Sales',
    description: 'Drive purchases and revenue.',
    aiHints: { goals: ['increase sales'] },
  },
  {
    id: 'grow_social_audience',
    label: 'Grow Social Audience',
    description: 'Expand followers and reach.',
    aiHints: { goals: ['grow social audience'] },
  },
  {
    id: 'build_community',
    label: 'Build Community',
    description: 'Deepen belonging and engagement.',
    aiHints: { goals: ['build community'] },
  },
  {
    id: 'promote_releases',
    label: 'Promote Releases',
    description: 'Launch drops, albums, or campaigns.',
    aiHints: { goals: ['promote releases'] },
  },
  {
    id: 'drive_website_traffic',
    label: 'Drive Website Traffic',
    description: 'Send people to your site or store.',
    aiHints: { goals: ['drive website traffic'] },
  },
  {
    id: 'establish_authority',
    label: 'Establish Authority',
    description: 'Be seen as the trusted expert.',
    aiHints: { goals: ['establish authority'] },
  },
  {
    id: 'educate_audience',
    label: 'Educate Audience',
    description: 'Teach and inform your market.',
    aiHints: { goals: ['educate audience'] },
  },
]

export const CALLS_TO_ACTION: CatalogOption<CallToActionId>[] = [
  {
    id: 'book_now',
    label: 'Book Now',
    description: 'Schedule a call or appointment.',
    aiHints: { cta: ['Book Now'] },
  },
  {
    id: 'shop_now',
    label: 'Shop Now',
    description: 'Buy a product or browse the store.',
    aiHints: { cta: ['Shop Now'] },
  },
  {
    id: 'learn_more',
    label: 'Learn More',
    description: 'Explore details and next steps.',
    aiHints: { cta: ['Learn More'] },
  },
  {
    id: 'subscribe',
    label: 'Subscribe',
    description: 'Join a list, channel, or feed.',
    aiHints: { cta: ['Subscribe'] },
  },
  {
    id: 'join_community',
    label: 'Join Community',
    description: 'Become part of the group.',
    aiHints: { cta: ['Join Community'] },
  },
  {
    id: 'listen_now',
    label: 'Listen Now',
    description: 'Play music or audio content.',
    aiHints: { cta: ['Listen Now'] },
  },
  {
    id: 'download',
    label: 'Download',
    description: 'Get a file, app, or resource.',
    aiHints: { cta: ['Download'] },
  },
  {
    id: 'visit_website',
    label: 'Visit Website',
    description: 'Send traffic to your site.',
    aiHints: { cta: ['Visit Website'] },
  },
  {
    id: 'send_message',
    label: 'Send Message',
    description: 'Start a direct conversation.',
    aiHints: { cta: ['Send Message'] },
  },
  {
    id: 'register',
    label: 'Register',
    description: 'Sign up for an event or program.',
    aiHints: { cta: ['Register'] },
  },
]

export const CONTENT_PRIORITIES: CatalogOption<ContentPriorityId>[] = [
  {
    id: 'educational',
    label: 'Educational',
    description: 'Teach skills, tips, and frameworks.',
    aiHints: { content: ['educational content'] },
  },
  {
    id: 'promotional',
    label: 'Promotional',
    description: 'Highlight offers and conversions.',
    aiHints: { content: ['promotional content'] },
  },
  {
    id: 'behind_the_scenes',
    label: 'Behind the Scenes',
    description: 'Show process and real moments.',
    aiHints: { content: ['behind the scenes content'] },
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    description: 'Narrative arcs and brand stories.',
    aiHints: { content: ['storytelling content'] },
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Fun, humor, and shareable moments.',
    aiHints: { content: ['entertainment content'] },
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Features fans, members, and peers.',
    aiHints: { content: ['community content'] },
  },
  {
    id: 'product_showcase',
    label: 'Product Showcase',
    description: 'Feature products and demos.',
    aiHints: { content: ['product showcase content'] },
  },
  {
    id: 'thought_leadership',
    label: 'Thought Leadership',
    description: 'Opinions, insights, and POV.',
    aiHints: { content: ['thought leadership content'] },
  },
]
