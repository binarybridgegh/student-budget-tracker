-- SQL TO FIX "permission denied for table profiles"
-- Run this in your Supabase SQL Editor:

-- 1. Ensure the schema is accessible
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant explicit table permissions (needed for upsert and select)
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

-- 3. Re-apply robust RLS policies
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;
CREATE POLICY "Users can view any profile" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
