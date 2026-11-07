-- New application objects only; no legacy posts or sample records are imported.
BEGIN;
CREATE TABLE public.nd_admin_v1_blog_comments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 post_id uuid NOT NULL REFERENCES public.nd_admin_v1_posts(id) ON DELETE RESTRICT,
 author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
 author_name text NOT NULL CHECK (length(author_name) BETWEEN 1 AND 80),
 content text NOT NULL CHECK (length(content) BETWEEN 10 AND 2000),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','spam')),
 request_key uuid NOT NULL,
 revision integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(),
 moderated_at timestamptz,
 moderated_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
 UNIQUE(author_id,request_key)
);
CREATE INDEX nd_admin_v1_blog_comments_post_idx ON public.nd_admin_v1_blog_comments(post_id,status,created_at,id);
CREATE INDEX nd_admin_v1_blog_comments_queue_idx ON public.nd_admin_v1_blog_comments(status,created_at,id);
CREATE INDEX nd_admin_v1_blog_comments_author_idx ON public.nd_admin_v1_blog_comments(author_id,created_at);
CREATE INDEX nd_admin_v1_blog_comments_moderator_idx ON public.nd_admin_v1_blog_comments(moderated_by);
CREATE UNIQUE INDEX nd_admin_v1_blog_comments_duplicate_idx ON public.nd_admin_v1_blog_comments(post_id,author_id,md5(content));
ALTER TABLE public.nd_admin_v1_blog_comments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_blog_comments FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_blog_comments TO authenticated;
GRANT ALL ON public.nd_admin_v1_blog_comments TO service_role;
CREATE POLICY nd_admin_v1_blog_comments_staff_read ON public.nd_admin_v1_blog_comments FOR SELECT TO authenticated USING(public.nd_admin_v1_can('blog','read'));

CREATE FUNCTION public.nd_admin_v1_blog_posts(p_offset integer DEFAULT 0,p_limit integer DEFAULT 12,p_query text DEFAULT '',p_category text DEFAULT '',p_article text DEFAULT '')
RETURNS TABLE(id uuid,title text,slug text,body jsonb,updated_at timestamptz,total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT p.id,p.title,p.slug,(SELECT coalesce(jsonb_object_agg(k,v),'{}'::jsonb) FROM jsonb_each(p.body) b(k,v) WHERE k=ANY(ARRAY['summary','body','hero_image','alt_text','meta_title','meta_description','canonical','og_image','author','category','tags'])),p.updated_at,count(*) OVER()
 FROM public.nd_admin_v1_posts p WHERE p.status='published'
 AND (coalesce(p_article,'')='' OR p.slug=p_article OR p.id::text=p_article)
 AND (coalesce(p_category,'')='' OR p.body->>'category'=p_category)
 AND (coalesce(p_query,'')='' OR position(lower(left(p_query,150)) in lower(p.title||' '||coalesce(p.body->>'summary','')))>0)
 ORDER BY p.updated_at DESC,p.id LIMIT greatest(1,least(coalesce(p_limit,12),50)) OFFSET greatest(0,least(coalesce(p_offset,0),1000000));
$$;
CREATE FUNCTION public.nd_admin_v1_blog_categories() RETURNS TABLE(category text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT DISTINCT p.body->>'category' FROM public.nd_admin_v1_posts p WHERE p.status='published' AND coalesce(p.body->>'category','')<>'' ORDER BY 1;
$$;
CREATE FUNCTION public.nd_admin_v1_blog_public_comments(p_post uuid,p_offset integer DEFAULT 0,p_limit integer DEFAULT 20)
RETURNS TABLE(id uuid,author_name text,content text,created_at timestamptz,total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT c.id,c.author_name,c.content,c.created_at,count(*) OVER() FROM public.nd_admin_v1_blog_comments c JOIN public.nd_admin_v1_posts p ON p.id=c.post_id
 WHERE c.post_id=p_post AND c.status='approved' AND p.status='published'
 ORDER BY c.created_at,c.id LIMIT greatest(1,least(coalesce(p_limit,20),50)) OFFSET greatest(0,least(coalesce(p_offset,0),1000000));
$$;
CREATE FUNCTION public.nd_admin_v1_blog_submit_comment(p_post uuid,p_content text,p_request_key uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_user uuid:=auth.uid(); v_name text; v_id uuid; v_content text:=btrim(p_content);
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Sign in with a verified reader account before commenting'; END IF;
 SELECT left(btrim(coalesce(nullif(u.raw_user_meta_data->>'display_name',''),'Reader')),80) INTO v_name FROM auth.users u WHERE u.id=v_user AND u.email_confirmed_at IS NOT NULL AND u.is_anonymous IS NOT TRUE;
 IF v_name IS NULL THEN RAISE EXCEPTION 'Confirm your email address before commenting'; END IF;
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_memberships m WHERE m.user_id=v_user AND m.active) THEN RAISE EXCEPTION 'Staff accounts can moderate reader submissions but cannot create reader comments'; END IF;
 IF p_request_key IS NULL OR v_content IS NULL OR length(v_content) NOT BETWEEN 10 AND 2000 THEN RAISE EXCEPTION 'A submission ID and a comment of 10–2000 characters are required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.nd_admin_v1_posts WHERE id=p_post AND status='published') THEN RAISE EXCEPTION 'Article is not published'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(v_user::text,42));
 SELECT id INTO v_id FROM public.nd_admin_v1_blog_comments WHERE author_id=v_user AND request_key=p_request_key AND post_id=p_post AND content=v_content;
 IF v_id IS NOT NULL THEN RETURN v_id; END IF;
 IF (SELECT count(*) FROM public.nd_admin_v1_blog_comments WHERE author_id=v_user AND created_at>now()-interval '10 minutes')>=3 OR (SELECT count(*) FROM public.nd_admin_v1_blog_comments WHERE author_id=v_user AND created_at>now()-interval '1 day')>=20 THEN RAISE EXCEPTION 'Comment limit reached. Please try again later'; END IF;
 INSERT INTO public.nd_admin_v1_blog_comments(post_id,author_id,author_name,content,request_key) VALUES(p_post,v_user,coalesce(nullif(v_name,''),'Reader'),v_content,p_request_key) RETURNING id INTO v_id;
 RETURN v_id;
END $$;
CREATE FUNCTION public.nd_admin_v1_blog_moderate_comment(p_id uuid,p_status text,p_revision integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_post uuid;
BEGIN
 IF NOT public.nd_admin_v1_can('blog','publish') THEN RAISE EXCEPTION 'Blog publishing permission is required to moderate'; END IF;
 IF p_status IS NULL OR p_status NOT IN ('approved','rejected','spam') THEN RAISE EXCEPTION 'Choose approve, reject, or spam'; END IF;
 UPDATE public.nd_admin_v1_blog_comments SET status=p_status,revision=revision+1,moderated_at=now(),moderated_by=auth.uid() WHERE id=p_id AND revision=p_revision RETURNING post_id INTO v_post;
 IF v_post IS NULL THEN RAISE EXCEPTION 'Comment changed. Reload before moderating'; END IF;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),'blog',v_post,'comment_moderation',jsonb_build_object('comment_id',p_id,'status',p_status));
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_blog_posts(integer,integer,text,text,text),public.nd_admin_v1_blog_categories(),public.nd_admin_v1_blog_public_comments(uuid,integer,integer),public.nd_admin_v1_blog_submit_comment(uuid,text,uuid),public.nd_admin_v1_blog_moderate_comment(uuid,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_blog_posts(integer,integer,text,text,text),public.nd_admin_v1_blog_categories(),public.nd_admin_v1_blog_public_comments(uuid,integer,integer) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_blog_submit_comment(uuid,text,uuid),public.nd_admin_v1_blog_moderate_comment(uuid,text,integer) TO authenticated;
COMMIT;
