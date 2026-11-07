CREATE TABLE public.blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  read_time text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  featured_image text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.blog_posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO anon;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are publicly readable"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Blog posts can be managed by the app"
  ON public.blog_posts FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id text NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  comment_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX blog_comments_post_id_idx ON public.blog_comments (post_id);

GRANT SELECT, INSERT ON public.blog_comments TO anon;
GRANT SELECT, INSERT ON public.blog_comments TO authenticated;
GRANT ALL ON public.blog_comments TO service_role;

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable"
  ON public.blog_comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add a comment"
  ON public.blog_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(author_name) BETWEEN 1 AND 120
    AND length(author_email) BETWEEN 3 AND 200
    AND length(comment_text) BETWEEN 1 AND 5000
  );

CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_blog_posts_updated_at();