# UGC DreamStreet

AI-powered content planning for music creators. Generate social media posts, plan your content calendar, and grow your audience.

## Features

- **Magic Link Auth** - Passwordless email login via Supabase
- **Artist Profile** - Define your brand voice, genre, and vibe
- **Content Library** - Store lyrics, stories, and notes for AI to use
- **AI Content Generation** - Generate 7/14/30 days of posts via OpenAI
- **One-Tap Posting** - Copy caption + open Instagram/Facebook

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Supabase (Auth + Postgres)
- OpenAI API (GPT-4o-mini)

## Setup

### 1. Install Dependencies

```bash
cd ugc-dreamstreet
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Set Up Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Enable Email Auth in Authentication > Providers

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/route.ts    # AI content generation endpoint
│   ├── app/
│   │   ├── dashboard/page.tsx   # Main dashboard with posts
│   │   ├── plan/page.tsx        # Generate content plans
│   │   ├── library/page.tsx     # Content library management
│   │   ├── artist/page.tsx      # Artist profile settings
│   │   └── layout.tsx           # App layout with navigation
│   ├── auth/
│   │   └── callback/route.ts    # Auth callback handler
│   ├── login/page.tsx           # Login page
│   └── page.tsx                 # Landing page
├── lib/
│   ├── supabase.ts              # Browser Supabase client
│   ├── supabase-server.ts       # Server Supabase client
│   ├── openai.ts                # OpenAI content generation
│   └── deeplink.ts              # Platform linking utilities
└── middleware.ts                # Auth middleware
```

## TODO (Future Features)

### Stripe Billing
```typescript
// TODO: Add in /app/app/settings/billing/page.tsx
// - Subscription plans (Free, Pro, Team)
// - Usage limits per plan
// - Stripe Checkout integration
```

### Email Reminders
```typescript
// TODO: Add email reminder system
// - Daily digest of scheduled posts
// - Reminder before post time
// - Use Resend or SendGrid
```

### Cron Jobs
```typescript
// TODO: Add scheduled jobs
// - Daily reminder emails
// - Post status cleanup
// - Analytics collection
// Use Vercel Cron or external service
```

### Analytics
```typescript
// TODO: Add post analytics
// - Track when posts are actually posted
// - Engagement metrics (manual input)
// - Content performance insights
```

## Important Notes

- **No Auto-Posting**: This app does NOT auto-post to Instagram or Facebook.
- **Notify + One-Tap Model**: Copy caption → Open platform in browser
- **No Meta APIs**: Avoids Meta API permission requirements

## License

MIT
