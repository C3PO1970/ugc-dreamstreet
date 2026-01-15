-- UGC DreamStreet Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Workspace',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user lookup
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);

-- Artist profiles table
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  genre TEXT,
  vibe_keywords TEXT[] DEFAULT '{}',
  brand_voice TEXT,
  platforms TEXT[] DEFAULT '{instagram}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for workspace lookup
CREATE INDEX IF NOT EXISTS idx_artist_profiles_workspace_id ON artist_profiles(workspace_id);

-- Content library items table
CREATE TABLE IF NOT EXISTS content_library_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('lyrics', 'song_meaning', 'release_notes', 'personal_story', 'audience_notes')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for workspace lookup
CREATE INDEX IF NOT EXISTS idx_content_library_items_workspace_id ON content_library_items(workspace_id);

-- Content plans table
CREATE TABLE IF NOT EXISTS content_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  platforms TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for workspace lookup
CREATE INDEX IF NOT EXISTS idx_content_plans_workspace_id ON content_plans(workspace_id);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_plan_id UUID REFERENCES content_plans(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook')),
  content_type TEXT NOT NULL CHECK (content_type IN ('reel', 'story', 'feed')),
  objective TEXT NOT NULL CHECK (objective IN ('promo', 'viral', 'bts', 'education', 'community')),
  hook TEXT NOT NULL,
  caption TEXT NOT NULL,
  script TEXT,
  cta TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'skipped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_workspace_id ON posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_posts_content_plan_id ON posts(content_plan_id);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_date ON posts(scheduled_date);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Workspaces: Users can only access their own workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workspaces" ON workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON workspaces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON workspaces
  FOR DELETE USING (auth.uid() = user_id);

-- Artist profiles: Users can access profiles in their workspaces
CREATE POLICY "Users can view own artist profiles" ON artist_profiles
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create artist profiles in own workspaces" ON artist_profiles
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own artist profiles" ON artist_profiles
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own artist profiles" ON artist_profiles
  FOR DELETE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

-- Content library items: Users can access items in their workspaces
CREATE POLICY "Users can view own content library items" ON content_library_items
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create content library items in own workspaces" ON content_library_items
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own content library items" ON content_library_items
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own content library items" ON content_library_items
  FOR DELETE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

-- Content plans: Users can access plans in their workspaces
CREATE POLICY "Users can view own content plans" ON content_plans
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create content plans in own workspaces" ON content_plans
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own content plans" ON content_plans
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own content plans" ON content_plans
  FOR DELETE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

-- Posts: Users can access posts in their workspaces
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create posts in own workspaces" ON posts
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())
  );
