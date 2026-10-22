import type { CreatorKindOption, IndustryOption } from './types'

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
