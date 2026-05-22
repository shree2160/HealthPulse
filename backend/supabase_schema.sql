-- =============================================
-- HealthPulse — Supabase Database Schema
-- =============================================
-- Run this in the Supabase SQL Editor to set up all tables

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users Table ────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── Chat History Table ─────────────────────

CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast session lookups
CREATE INDEX idx_chat_history_session ON chat_history(session_id, created_at);
CREATE INDEX idx_chat_history_user ON chat_history(user_id);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own chat history
CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── Health Logs Table ──────────────────────

CREATE TABLE IF NOT EXISTS health_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_health_logs_user ON health_logs(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own health logs
CREATE POLICY "Users can view own health logs"
  ON health_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health logs"
  ON health_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── Auto-create user profile on signup ─────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
