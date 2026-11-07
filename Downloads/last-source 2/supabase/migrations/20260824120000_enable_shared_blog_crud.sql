ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS comments jsonb NOT NULL DEFAULT '[]'::jsonb;

GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO anon;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;

DROP POLICY IF EXISTS "Blog posts can be managed by the app" ON public.blog_posts;

CREATE POLICY "Blog posts can be managed by the app"
  ON public.blog_posts FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);