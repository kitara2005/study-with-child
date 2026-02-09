-- Row Level Security (RLS) Policies for Supabase
-- Run these manually in Supabase SQL Editor after database setup

-- ============================================
-- Enable RLS on tables
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Users table policies
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id);

-- Allow insert for new signups (via trigger)
CREATE POLICY "Allow user creation"
ON users FOR INSERT
WITH CHECK (auth.uid()::text = id);

-- Parents can read their children's profiles
CREATE POLICY "Parents can read children profiles"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users parent
    WHERE parent.id = auth.uid()::text
    AND parent.role = 'PARENT'
    AND users.parent_id = parent.id
  )
);

-- ============================================
-- Results table policies
-- ============================================

-- Users can read their own results
CREATE POLICY "Users can read own results"
ON results FOR SELECT
USING (auth.uid()::text = user_id);

-- Users can insert their own results
CREATE POLICY "Users can insert own results"
ON results FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Parents can read their children's results
CREATE POLICY "Parents can read children results"
ON results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users child
    JOIN users parent ON child.parent_id = parent.id
    WHERE parent.id = auth.uid()::text
    AND parent.role = 'PARENT'
    AND results.user_id = child.id
  )
);

-- ============================================
-- Public read access for content tables
-- ============================================

-- No RLS needed for subjects, chapters, lessons, exercises
-- They are public content, accessible to all authenticated users
-- Supabase API will use service role key for these tables

-- ============================================
-- Trigger to create user profile on signup
-- ============================================

-- This trigger creates a user record in public.users
-- when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Notes
-- ============================================

-- 1. Run this SQL in Supabase SQL Editor after prisma migrate
-- 2. Make sure auth.users table exists (it's a Supabase system table)
-- 3. Test policies with different user roles
-- 4. For admin access, use service role key in backend API routes
