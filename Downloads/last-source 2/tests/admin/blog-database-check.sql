-- Operator regression check: all fixtures and audit events are rolled back.
BEGIN;
DO $$
DECLARE
 v_post uuid:=gen_random_uuid(); v_reader uuid:=gen_random_uuid(); v_unconfirmed uuid:=gen_random_uuid();
 v_comment uuid; v_retry uuid; v_admin uuid; v_result jsonb; v_i integer;
BEGIN
 SELECT u.id INTO v_admin FROM auth.users u JOIN public.nd_admin_v1_memberships m ON m.user_id=u.id WHERE m.role_id='super_admin' AND m.active LIMIT 1;
 IF v_admin IS NULL THEN RAISE EXCEPTION 'An existing authorized admin is required'; END IF;
 INSERT INTO auth.users(id,email,email_confirmed_at,raw_user_meta_data,is_anonymous) VALUES(v_reader,v_reader::text||'@example.invalid',now(),'{"display_name":"Rollback test reader"}',false),(v_unconfirmed,v_unconfirmed::text||'@example.invalid',null,'{}',false);
 PERFORM set_config('request.jwt.claims',jsonb_build_object('role','service_role')::text,true);
 INSERT INTO public.nd_admin_v1_posts(id,title,slug,body) VALUES(v_post,'Rollback database test',v_post::text,jsonb_build_object('summary','Test summary','body','Test content','meta_title','Test title','meta_description','Test description','private_notes','MUST NOT LEAK'));
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_blog_posts(0,12,'','',v_post::text)) THEN RAISE EXCEPTION 'Draft leaked'; END IF;
 UPDATE public.nd_admin_v1_posts SET status='review' WHERE id=v_post;
 UPDATE public.nd_admin_v1_posts SET status='approved' WHERE id=v_post;
 UPDATE public.nd_admin_v1_posts SET status='published' WHERE id=v_post;
 SELECT to_jsonb(p) INTO v_result FROM public.nd_admin_v1_blog_posts(0,12,'','',v_post::text) p;
 IF v_result IS NULL OR v_result->'body' ? 'private_notes' THEN RAISE EXCEPTION 'Published projection failed'; END IF;
 IF has_table_privilege('anon','public.nd_admin_v1_blog_comments','SELECT') OR has_table_privilege('authenticated','public.nd_admin_v1_blog_comments','INSERT') OR has_table_privilege('authenticated','public.nd_admin_v1_blog_comments','UPDATE') OR has_function_privilege('anon','public.nd_admin_v1_blog_submit_comment(uuid,text,uuid)','EXECUTE') THEN RAISE EXCEPTION 'Unexpected direct comment permissions'; END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',v_unconfirmed)::text,true);
 BEGIN
  PERFORM public.nd_admin_v1_blog_submit_comment(v_post,'Unconfirmed reader must fail',gen_random_uuid());
  RAISE EXCEPTION 'TEST FAILED: unconfirmed submission accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'Confirm your email address before commenting' THEN RAISE; END IF;
 END;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',v_reader)::text,true);
 v_retry:=gen_random_uuid();
 v_comment:=public.nd_admin_v1_blog_submit_comment(v_post,'A confirmed reader test comment.',v_retry);
 IF public.nd_admin_v1_blog_submit_comment(v_post,'A confirmed reader test comment.',v_retry)<>v_comment THEN RAISE EXCEPTION 'Idempotency failed'; END IF;
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_blog_public_comments(v_post)) THEN RAISE EXCEPTION 'Pending comment leaked'; END IF;
 BEGIN
  PERFORM public.nd_admin_v1_blog_moderate_comment(v_comment,'approved',1);
  RAISE EXCEPTION 'TEST FAILED: reader moderated own comment';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'Blog publishing permission is required to moderate' THEN RAISE; END IF;
 END;
 BEGIN
  PERFORM public.nd_admin_v1_blog_submit_comment(v_post,'A confirmed reader test comment.',gen_random_uuid());
  RAISE EXCEPTION 'TEST FAILED: duplicate content accepted';
 EXCEPTION WHEN unique_violation THEN NULL;
 END;
 FOR v_i IN 1..2 LOOP PERFORM public.nd_admin_v1_blog_submit_comment(v_post,'Additional rollback test comment '||v_i,gen_random_uuid()); END LOOP;
 BEGIN
  PERFORM public.nd_admin_v1_blog_submit_comment(v_post,'A fourth submission must be throttled',gen_random_uuid());
  RAISE EXCEPTION 'TEST FAILED: database rate limit not enforced';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'Comment limit reached. Please try again later' THEN RAISE; END IF;
 END;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',v_admin)::text,true);
 BEGIN
  PERFORM public.nd_admin_v1_blog_submit_comment(v_post,'Staff cannot invent reader comments',gen_random_uuid());
  RAISE EXCEPTION 'TEST FAILED: staff fabricated a comment';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'Staff accounts can moderate reader submissions but cannot create reader comments' THEN RAISE; END IF;
 END;
 PERFORM public.nd_admin_v1_blog_moderate_comment(v_comment,'approved',1);
 SELECT to_jsonb(c) INTO v_result FROM public.nd_admin_v1_blog_public_comments(v_post) c;
 IF v_result IS NULL OR v_result->>'content'<>'A confirmed reader test comment.' OR v_result ? 'author_id' OR v_result ? 'email' THEN RAISE EXCEPTION 'Approved projection failed or identity leaked'; END IF;
 BEGIN
  PERFORM public.nd_admin_v1_blog_moderate_comment(v_comment,'spam',1);
  RAISE EXCEPTION 'TEST FAILED: stale moderation accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'Comment changed. Reload before moderating' THEN RAISE; END IF;
 END;
 UPDATE public.nd_admin_v1_posts SET status='archived' WHERE id=v_post;
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_blog_public_comments(v_post)) THEN RAISE EXCEPTION 'Unpublished article comments leaked'; END IF;
 PERFORM public.nd_admin_v1_blog_moderate_comment(v_comment,'rejected',2);
 IF (SELECT content FROM public.nd_admin_v1_blog_comments WHERE id=v_comment)<>'A confirmed reader test comment.' THEN RAISE EXCEPTION 'Moderation rewrote reader content'; END IF;
END $$;
ROLLBACK;
