-- =====================================================================
-- KRONOS TRACKER — USERNAME + NAME + PASSWORD AUTH DATABASE SCHEMA
-- Execute this script inside Supabase SQL Editor to initialize
-- all tables, unique username constraints, triggers, and RLS policies.
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Updated-At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- TABLE 1: PROFILES
-- Stores user profile metadata, unique username, theme preferences.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Aspirant',
  mode TEXT DEFAULT 'Strict IST Mode',
  study_day_cutoff TEXT DEFAULT '00:00',
  success_threshold INT DEFAULT 70,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ---------------------------------------------------------------------
-- TABLE 2: GOALS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Competitive Exam',
  target TEXT NOT NULL,
  deadline_iso TIMESTAMPTZ NOT NULL,
  daily_hours NUMERIC(4,2) DEFAULT 7.5,
  progress INT DEFAULT 0,
  phase TEXT DEFAULT '',
  weak_area TEXT DEFAULT '',
  risk_level TEXT DEFAULT 'Medium',
  prep_strategy TEXT DEFAULT '',
  subjects JSONB DEFAULT '["Physics", "Chemistry", "Mathematics"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 3: MILESTONES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 4: WEEKLY TARGETS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_hours NUMERIC(4,2) DEFAULT 10,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 5: TASKS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  estimate INT DEFAULT 60,
  category TEXT DEFAULT 'Practice',
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Extreme')),
  status VARCHAR(20) DEFAULT 'not-started' CHECK (status IN ('not-started', 'completed', 'missed', 'skipped')),
  completed_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  recovery_status TEXT,
  missed_reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON public.tasks(user_id, date_id);

-- ---------------------------------------------------------------------
-- TABLE 6: STUDY SESSIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  date_id VARCHAR(10) NOT NULL,
  subject TEXT NOT NULL,
  minutes INT NOT NULL,
  label TEXT DEFAULT 'Study Session',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON public.study_sessions(user_id, date_id);

-- ---------------------------------------------------------------------
-- TABLE 7: DAILY SCORES / HISTORY
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id VARCHAR(10) NOT NULL,
  completion_score INT DEFAULT 0,
  time_score INT DEFAULT 0,
  focus_score INT DEFAULT 0,
  study_minutes INT DEFAULT 0,
  completed_tasks INT DEFAULT 0,
  total_tasks INT DEFAULT 0,
  success BOOLEAN DEFAULT FALSE,
  subject_minutes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date_score UNIQUE (user_id, date_id)
);

CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.daily_scores(user_id, date_id);

-- ---------------------------------------------------------------------
-- TABLE 8: STREAKS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_successful_date_id VARCHAR(10),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 9: REVIEWS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id VARCHAR(10) NOT NULL,
  went_well TEXT DEFAULT '',
  went_wrong TEXT DEFAULT '',
  distraction TEXT DEFAULT '',
  learned TEXT DEFAULT '',
  tomorrow_priority TEXT DEFAULT '',
  sleep_target VARCHAR(10) DEFAULT '23:30',
  energy VARCHAR(20) DEFAULT 'Medium',
  mood VARCHAR(20) DEFAULT 'Focused',
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date_review UNIQUE (user_id, date_id)
);

-- ---------------------------------------------------------------------
-- TABLE 10: JEE CHAPTERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jee_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Practice ongoing',
  theory INT DEFAULT 0,
  practice INT DEFAULT 0,
  pyq INT DEFAULT 0,
  revision VARCHAR(20) DEFAULT 'R1',
  strength VARCHAR(20) DEFAULT 'Medium',
  last_revised VARCHAR(10),
  next_revision VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_subject_chapter UNIQUE (user_id, subject, chapter)
);

-- ---------------------------------------------------------------------
-- TABLE 11: MOCK TESTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id VARCHAR(10) NOT NULL,
  total INT NOT NULL,
  physics INT DEFAULT 0,
  chemistry INT DEFAULT 0,
  math INT DEFAULT 0,
  attempted INT DEFAULT 0,
  correct INT DEFAULT 0,
  wrong INT DEFAULT 0,
  accuracy NUMERIC(5,2) DEFAULT 0,
  silly INT DEFAULT 0,
  time_issue TEXT DEFAULT '',
  weak_chapters TEXT DEFAULT '',
  lesson TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 12: MISTAKES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id VARCHAR(10) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- TABLE 13: BACKLOG ITEMS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.backlog_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_date VARCHAR(10) NOT NULL,
  original_task_id UUID,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'high',
  estimate INT DEFAULT 60,
  category TEXT DEFAULT 'Practice',
  difficulty VARCHAR(20) DEFAULT 'Medium',
  notes TEXT DEFAULT '',
  status VARCHAR(30) DEFAULT 'unresolved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER ON USER SIGNUP
-- Extracts `username` and `name` passed during register.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTRING(NEW.id::text, 1, 8))),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Aspirant')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    name = EXCLUDED.name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jee_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlog_items ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS POLICIES FOR SECURE USER ACCESS
-- ---------------------------------------------------------------------

-- Profiles: Allow viewing any username (for lookup & unique check), editing own profile
CREATE POLICY "Public profile username check" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Goal & User Data Tables (strictly private per user)
CREATE POLICY "Users access own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own milestones" ON public.milestones FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own weekly targets" ON public.weekly_targets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own daily scores" ON public.daily_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own streaks" ON public.streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own jee chapters" ON public.jee_chapters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own mock tests" ON public.mock_tests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own mistakes" ON public.mistakes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own backlog items" ON public.backlog_items FOR ALL USING (auth.uid() = user_id);

-- =====================================================================
-- SCHEMA INITIALIZATION COMPLETE
-- Direct Username + Name + Password authentication ready!
-- =====================================================================
