-- ============================================================
-- RAITA MITRA SOCIAL TRUST - SUPABASE DATABASE SCHEMA SETUP
-- Paste and run this SQL script in Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author JSONB,
  date TEXT,
  read_time TEXT,
  image TEXT,
  tags TEXT[],
  key_takeaways TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  district TEXT,
  date TEXT,
  caption TEXT,
  photographer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Anon / Public Access
DROP POLICY IF EXISTS "Allow public read access on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public insert access on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public update access on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public delete access on blogs" ON public.blogs;

CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on blogs" ON public.blogs FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public insert access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public update access on gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public delete access on gallery" ON public.gallery;

CREATE POLICY "Allow public read access on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on gallery" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on gallery" ON public.gallery FOR DELETE USING (true);
