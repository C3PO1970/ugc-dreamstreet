# DreamStreet

AI-powered content creation and planning for all creators — influencers, UGC creators, musicians, podcasters, YouTubers, educators, brands, and businesses.

Generate captions, plan your content calendar, and grow your audience in one workspace.

## Features

- **Magic Link Auth** — Passwordless email login via Supabase
- **Creator Profile** — Define your industry, brand voice, platforms, and vibe
- **Content Library** — Store key lines, stories, launch notes, and audience context for AI
- **AI Content Generation** — Generate 7/14/30 days of posts via OpenAI
- **One-Tap Posting** — Copy caption + open Instagram/Facebook
- **ClipSlot Lite** — Video library UI (upload and AI video features coming next)

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

Copy the example env file and fill in values from your existing Supabase and OpenAI accounts:

```bash
cp .env.example .env.local
```

Required variables (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

From Supabase **Project Settings → API**, use:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not the service role key)

Restart `npm run dev` after changing `.env.local`.

### 3. Set Up Database

1. Use your existing Supabase project (do not create a new one unless needed)
2. If tables are not applied yet, run `supabase-schema.sql` in the SQL Editor
3. Enable Email Auth in Authentication → Providers

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
│   │   ├── clips/               # ClipSlot Lite (video library UI)
│   │   ├── artist/page.tsx      # Creator profile (legacy path)
│   │   ├── profile/page.tsx     # Creator profile (preferred path)
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

## API notes

`POST /api/generate` accepts creator-neutral aliases while keeping legacy fields:

- `creatorName` (preferred) or `artistName` (legacy)
- `industry` / `category` (preferred) or `genre` (legacy)
- Content library keys (preferred): `keyLines`, `coreMessage`, `launchNotes`, `brandStory`, `audienceNotes`
- Legacy library keys still work: `lyrics`, `songMeaning` / `songmeaning`, `releaseNotes`, etc.

## Important Notes

- **No Auto-Posting**: This app does NOT auto-post to Instagram or Facebook.
- **Notify + One-Tap Model**: Copy caption → Open platform in browser
- **No Meta APIs**: Avoids Meta API permission requirements
- **Database**: Profile data remains in `artist_profiles` for backward compatibility; the product UI refers to Creator Profile

## License

MIT
