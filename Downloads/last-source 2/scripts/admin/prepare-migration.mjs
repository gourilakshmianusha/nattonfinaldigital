import fs from 'node:fs';
import { adminModules, rolePermissions, roleLabels } from '../../src/admin/modules.mjs';
const quote=value=>`'${String(value).replaceAll("'","''")}'`;
const extra={lead_events:'leads',consents:'leads',followups:'leads',application_events:'applicants',authors:'blog',tags:'blog',post_tags:'blog',categories:'services',menus:'pages',tool_runs:'free-tools',workflow_runs:'automations',webhook_events:'automations',async_jobs:'automations',evidence:'case-studies',approvals:'pages',availability:'appointments',notifications:'dashboard'};
const tables=Object.fromEntries([...adminModules.filter(m=>m.table).map(m=>[m.table,m.id]),...Object.entries(extra)]);
let sql=`-- PROPOSAL ONLY. Live inventory is unavailable; do not apply until preflight is reviewed.
-- Existing tables, policies, records, auth settings, and buckets are not modified.
BEGIN;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname LIKE 'nd_admin_v1_%')
 OR EXISTS (SELECT 1 FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname LIKE 'nd_admin_v1_%') THEN
 RAISE EXCEPTION 'nd_admin_v1 namespace collision. Inspect existing objects; do not alter or recreate them.'; END IF;
END $$;
CREATE TABLE public.nd_admin_v1_roles (id text PRIMARY KEY, label text NOT NULL);
CREATE TABLE public.nd_admin_v1_role_permissions (role_id text REFERENCES public.nd_admin_v1_roles(id) ON DELETE RESTRICT, module text NOT NULL, action text NOT NULL CHECK (action IN ('read','write','publish','export','delete')), PRIMARY KEY(role_id,module,action));
CREATE TABLE public.nd_admin_v1_memberships (user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT, role_id text NOT NULL REFERENCES public.nd_admin_v1_roles(id) ON DELETE RESTRICT, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.nd_admin_v1_profiles (user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT, display_name text NOT NULL DEFAULT '', timezone text NOT NULL DEFAULT 'Asia/Kolkata');
CREATE TABLE public.nd_admin_v1_audit_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, module text NOT NULL, entity_id uuid, action text NOT NULL, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.nd_admin_v1_versions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), module text NOT NULL, entity_id uuid NOT NULL, revision integer NOT NULL, snapshot jsonb NOT NULL, actor_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(module,entity_id,revision));
`;
for(const [id,label] of Object.entries(roleLabels))sql+=`INSERT INTO public.nd_admin_v1_roles VALUES (${quote(id)},${quote(label)});\n`;
for(const [role,modules]of Object.entries(rolePermissions))for(const [module,actions]of Object.entries(modules))for(const action of actions)sql+=`INSERT INTO public.nd_admin_v1_role_permissions VALUES (${quote(role)},${quote(module)},${quote(action)});\n`;
sql+=`
CREATE FUNCTION public.nd_admin_v1_can(p_module text,p_action text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT EXISTS(SELECT 1 FROM public.nd_admin_v1_memberships m JOIN public.nd_admin_v1_role_permissions p ON p.role_id=m.role_id WHERE m.user_id=auth.uid() AND m.active AND p.module=p_module AND p.action=p_action);
$$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_can(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_can(text,text) TO authenticated;
`;
for(const name of ['roles','role_permissions','memberships','profiles','audit_events','versions']){
 sql+=`ALTER TABLE public.nd_admin_v1_${name} ENABLE ROW LEVEL SECURITY;\nREVOKE ALL ON public.nd_admin_v1_${name} FROM anon,authenticated;\nGRANT SELECT ON public.nd_admin_v1_${name} TO authenticated;\nGRANT ALL ON public.nd_admin_v1_${name} TO service_role;\n`;
}
sql+=`
CREATE POLICY nd_admin_v1_roles_read ON public.nd_admin_v1_roles FOR SELECT TO authenticated USING (public.nd_admin_v1_can('team','read'));
CREATE POLICY nd_admin_v1_permissions_read ON public.nd_admin_v1_role_permissions FOR SELECT TO authenticated USING (public.nd_admin_v1_can(module,'read'));
CREATE POLICY nd_admin_v1_membership_read ON public.nd_admin_v1_memberships FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.nd_admin_v1_can('team','read'));
CREATE POLICY nd_admin_v1_profile_read ON public.nd_admin_v1_profiles FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.nd_admin_v1_can('team','read'));
CREATE POLICY nd_admin_v1_audit_read ON public.nd_admin_v1_audit_events FOR SELECT TO authenticated USING (public.nd_admin_v1_can(module,'read'));
CREATE POLICY nd_admin_v1_versions_read ON public.nd_admin_v1_versions FOR SELECT TO authenticated USING (public.nd_admin_v1_can(module,'read'));
CREATE INDEX nd_admin_v1_audit_entity_idx ON public.nd_admin_v1_audit_events(module,entity_id,created_at DESC);
CREATE INDEX nd_admin_v1_versions_entity_idx ON public.nd_admin_v1_versions(module,entity_id,revision DESC);
CREATE FUNCTION public.nd_admin_v1_record_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_module text:=TG_ARGV[0]; v_snapshot jsonb; v_content boolean:=TG_ARGV[1]='content';
BEGIN
 IF TG_OP='DELETE' THEN
  IF OLD.status='published' THEN RAISE EXCEPTION 'Archive published content before deletion'; END IF;
  INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),v_module,OLD.id,'delete',jsonb_build_object('title',OLD.title)); RETURN OLD;
 END IF;
 IF TG_OP='UPDATE' THEN
  NEW.revision:=OLD.revision+1; NEW.updated_at:=now(); NEW.created_at:=OLD.created_at; NEW.created_by:=OLD.created_by;
 END IF;
 IF v_content THEN
  IF TG_OP='UPDATE' AND OLD.status='published' AND NEW.status<>OLD.status AND NOT public.nd_admin_v1_can(v_module,'publish') AND auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Publishing permission required to change live content'; END IF;
  IF NEW.status NOT IN ('draft','review','approved','scheduled','published','archived') THEN RAISE EXCEPTION 'Invalid content status'; END IF;
  IF TG_OP='INSERT' AND NEW.status<>'draft' THEN RAISE EXCEPTION 'New content must start as a draft'; END IF;
  IF TG_OP='UPDATE' AND NEW.status<>OLD.status AND NEW.status IN ('approved','scheduled','published') THEN
   IF NOT public.nd_admin_v1_can(v_module,'publish') AND auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'Publishing permission required'; END IF;
   IF NEW.status='approved' AND OLD.status<>'review' THEN RAISE EXCEPTION 'Submit for review before approval'; END IF;
   IF NEW.status IN ('scheduled','published') AND NOT (OLD.status='approved' OR (NEW.status='published' AND OLD.status='scheduled')) THEN RAISE EXCEPTION 'Approval required before publication'; END IF;
  END IF;
  IF TG_OP='UPDATE' AND OLD.status IN ('approved','scheduled','published') AND (NEW.body IS DISTINCT FROM OLD.body OR NEW.title IS DISTINCT FROM OLD.title OR NEW.slug IS DISTINCT FROM OLD.slug) THEN
   IF NEW.status<>'draft' THEN RAISE EXCEPTION 'Return content to draft before editing'; END IF;
  END IF;
  IF NEW.status='scheduled' AND (coalesce(NEW.body->>'scheduled_at','')='' OR (NEW.body->>'scheduled_at')::timestamptz<=now()) THEN RAISE EXCEPTION 'Future publication time required'; END IF;
 IF NEW.status IN ('scheduled','published') THEN
   IF length(coalesce(NEW.body->>'meta_title',''))=0 OR length(coalesce(NEW.body->>'meta_description',''))=0 THEN RAISE EXCEPTION 'SEO title and description required'; END IF;
   IF v_module='case-studies' AND (coalesce(NEW.body->>'client_approval_at','')='' OR coalesce(NEW.body->>'evidence_id','')='' OR coalesce(NEW.body->>'method','')='') THEN RAISE EXCEPTION 'Client approval and measurement evidence required'; END IF;
  END IF;
 END IF;
 v_snapshot:=to_jsonb(NEW);
 INSERT INTO public.nd_admin_v1_versions(module,entity_id,revision,snapshot,actor_id) VALUES(v_module,NEW.id,NEW.revision,v_snapshot,auth.uid());
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),v_module,NEW.id,lower(TG_OP),jsonb_build_object('title',NEW.title,'status',NEW.status,'revision',NEW.revision));
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_record_change() FROM PUBLIC;
`;
for(const [name,module]of Object.entries(tables)){
 const content=adminModules.some(m=>m.table===name&&m.content);
 sql+=`
CREATE TABLE public.nd_admin_v1_${name} (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_${name} ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_${name} FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_${name} TO authenticated;
GRANT ALL ON public.nd_admin_v1_${name} TO service_role;
CREATE POLICY nd_admin_v1_${name}_read ON public.nd_admin_v1_${name} FOR SELECT TO authenticated USING(public.nd_admin_v1_can(${quote(module)},'read'));
CREATE POLICY nd_admin_v1_${name}_insert ON public.nd_admin_v1_${name} FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can(${quote(module)},'write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_${name}_update ON public.nd_admin_v1_${name} FOR UPDATE TO authenticated USING(public.nd_admin_v1_can(${quote(module)},'write')) WITH CHECK(public.nd_admin_v1_can(${quote(module)},'write'));
CREATE POLICY nd_admin_v1_${name}_delete ON public.nd_admin_v1_${name} FOR DELETE TO authenticated USING(public.nd_admin_v1_can(${quote(module)},'delete'));
CREATE INDEX nd_admin_v1_${name}_status_created_idx ON public.nd_admin_v1_${name}(status,created_at DESC);
CREATE INDEX nd_admin_v1_${name}_owner_idx ON public.nd_admin_v1_${name}(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_${name}_slug_idx ON public.nd_admin_v1_${name}(slug);
CREATE TRIGGER nd_admin_v1_${name}_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_${name} FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change(${quote(module)},${quote(content?'content':'record')});
`;
}
sql+=`
-- Appointment overlap is checked under one transaction-scoped lock per owner.
CREATE FUNCTION public.nd_admin_v1_booking_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog AS $$
DECLARE v_start timestamptz; v_end timestamptz; v_buffer interval;
BEGIN
 IF NEW.status IN ('cancelled','no_show') THEN RETURN NEW; END IF;
 IF NEW.owner_id IS NULL THEN RAISE EXCEPTION 'Appointment owner required'; END IF;
 v_start:=(NEW.body->>'starts_at')::timestamptz; v_end:=(NEW.body->>'ends_at')::timestamptz;
 IF v_start IS NULL OR v_end IS NULL OR v_end<=v_start THEN RAISE EXCEPTION 'Valid appointment interval required'; END IF;
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_availability a WHERE a.owner_id=NEW.owner_id AND a.status='active') AND NOT EXISTS(SELECT 1 FROM public.nd_admin_v1_availability a WHERE a.owner_id=NEW.owner_id AND a.status='active' AND extract(dow FROM v_start AT TIME ZONE (a.body->>'timezone'))::integer=(a.body->>'weekday')::integer AND (v_start AT TIME ZONE (a.body->>'timezone'))::date=(v_end AT TIME ZONE (a.body->>'timezone'))::date AND (v_start AT TIME ZONE (a.body->>'timezone'))::time >= (a.body->>'starts_local')::time AND (v_end AT TIME ZONE (a.body->>'timezone'))::time <= (a.body->>'ends_local')::time) THEN RAISE EXCEPTION 'Appointment is outside the owner availability windows'; END IF;
 v_buffer:=make_interval(mins=>greatest(0,least(240,coalesce((NEW.body->>'buffer_minutes')::integer,0))));
 PERFORM pg_advisory_xact_lock(hashtextextended(NEW.owner_id::text,0));
 IF EXISTS(SELECT 1 FROM public.nd_admin_v1_appointments a WHERE a.id<>NEW.id AND a.owner_id=NEW.owner_id AND a.status NOT IN ('cancelled','no_show') AND (a.body->>'starts_at')::timestamptz < v_end+v_buffer AND (a.body->>'ends_at')::timestamptz + make_interval(mins=>greatest(0,least(240,coalesce((a.body->>'buffer_minutes')::integer,0)))) > v_start-v_buffer) THEN RAISE EXCEPTION 'This owner already has a booking or buffer at that time'; END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_booking_guard() FROM PUBLIC;
CREATE TRIGGER nd_admin_v1_appointment_overlap BEFORE INSERT OR UPDATE ON public.nd_admin_v1_appointments FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_booking_guard();
-- Only a privileged application administrator can grant another user access.
CREATE FUNCTION public.nd_admin_v1_assign_membership(p_user uuid,p_role text,p_active boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT public.nd_admin_v1_can('team','write') OR p_user=auth.uid() THEN RAISE EXCEPTION 'Not permitted'; END IF;
 INSERT INTO public.nd_admin_v1_memberships(user_id,role_id,active) VALUES(p_user,p_role,p_active) ON CONFLICT(user_id) DO UPDATE SET role_id=EXCLUDED.role_id,active=EXCLUDED.active;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),'team',p_user,'membership',jsonb_build_object('role',p_role,'active',p_active));
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_assign_membership(uuid,text,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_assign_membership(uuid,text,boolean) TO authenticated;
-- Public content is a deliberately restricted projection, never a raw table read.
CREATE FUNCTION public.nd_admin_v1_published(p_module text,p_slug text DEFAULT NULL) RETURNS TABLE(id uuid,title text,slug text,body jsonb,updated_at timestamptz) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_table text;
BEGIN
 v_table:=CASE p_module WHEN 'pages' THEN 'nd_admin_v1_pages' WHEN 'services' THEN 'nd_admin_v1_services' WHEN 'blog' THEN 'nd_admin_v1_posts' WHEN 'careers' THEN 'nd_admin_v1_jobs' WHEN 'case-studies' THEN 'nd_admin_v1_case_studies' ELSE NULL END;
 IF v_table IS NULL THEN RAISE EXCEPTION 'Unsupported public content type'; END IF;
 RETURN QUERY EXECUTE format('SELECT id,title,slug,(SELECT coalesce(jsonb_object_agg(k,v),''{}''::jsonb) FROM jsonb_each(body) b(k,v) WHERE k=ANY($2) OR (k=''salary'' AND body->>''salary_visible''=''true'')),updated_at FROM public.%I WHERE status=''published'' AND ($1 IS NULL OR slug=$1) ORDER BY updated_at DESC LIMIT 100',v_table)
 USING p_slug,ARRAY['summary','body','hero_image','alt_text','meta_title','meta_description','canonical','og_image','cta_label','cta_url','template','sections','schema','category','problems','benefits','process','deliverables','faqs','related','position','author','tags','industry','client','challenge','approach','results','team','employment_type','location','salary_visible','requirements','deadline'];
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_published(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_published(text,text) TO anon,authenticated;
-- Ingestion is callable only from the validated, rate-limited backend.
CREATE UNIQUE INDEX nd_admin_v1_lead_email_idx ON public.nd_admin_v1_leads(lower(body->>'email')) WHERE body ? 'email';
CREATE UNIQUE INDEX nd_admin_v1_lead_idempotency_idx ON public.nd_admin_v1_leads((body->>'idempotency_key')) WHERE body ? 'idempotency_key';
CREATE FUNCTION public.nd_admin_v1_ingest_lead(p_title text,p_body jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_id uuid;
BEGIN
 IF coalesce(p_body->>'idempotency_key','')='' OR coalesce(p_body->>'consent_at','')='' THEN RAISE EXCEPTION 'Idempotency and consent required'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(lower(p_body->>'email'),1));
 SELECT (body->>'lead_id')::uuid INTO v_id FROM public.nd_admin_v1_consents WHERE slug=p_body->>'idempotency_key';
 IF v_id IS NOT NULL THEN RETURN v_id; END IF;
 SELECT id INTO v_id FROM public.nd_admin_v1_leads WHERE lower(body->>'email')=lower(p_body->>'email') ORDER BY created_at LIMIT 1;
 IF v_id IS NULL THEN
  INSERT INTO public.nd_admin_v1_leads(title,status,body) VALUES(p_title,'new',p_body) RETURNING id INTO v_id;
 ELSE
  INSERT INTO public.nd_admin_v1_lead_events(title,status,body) VALUES('Repeat enquiry','received',jsonb_build_object('lead_id',v_id,'source',p_body->>'source','message',p_body->>'notes','received_at',now()));
 END IF;
 INSERT INTO public.nd_admin_v1_consents(title,slug,status,body) VALUES('Enquiry contact consent',p_body->>'idempotency_key','received',jsonb_build_object('lead_id',v_id,'consent_at',p_body->>'consent_at','marketing_consent',false,'source',p_body->>'source'));
 RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_ingest_lead(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_ingest_lead(text,jsonb) TO service_role;
CREATE FUNCTION public.nd_admin_v1_note_export(p_module text,p_count integer,p_filters jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT public.nd_admin_v1_can(p_module,'export') THEN RAISE EXCEPTION 'Export permission required'; END IF;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,action,details) VALUES(auth.uid(),p_module,'export',jsonb_build_object('count',p_count,'filters',p_filters));
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_note_export(text,integer,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_note_export(text,integer,jsonb) TO authenticated;
CREATE FUNCTION public.nd_admin_v1_enqueue_webhook(p_key text,p_payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_id uuid;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(p_key,2));
 SELECT id INTO v_id FROM public.nd_admin_v1_webhook_events WHERE body->>'event_key'=p_key;
 IF v_id IS NOT NULL THEN RETURN v_id; END IF;
 INSERT INTO public.nd_admin_v1_webhook_events(title,status,body) VALUES('Verified incoming event','received',jsonb_build_object('event_key',p_key,'payload',p_payload)) RETURNING id INTO v_id;
 INSERT INTO public.nd_admin_v1_async_jobs(title,status,body) VALUES('Process verified webhook','queued',jsonb_build_object('event_id',v_id,'attempts',0,'max_attempts',3));
 RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_enqueue_webhook(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_enqueue_webhook(text,jsonb) TO service_role;
CREATE FUNCTION public.nd_admin_v1_import_leads(p_rows jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
DECLARE item jsonb; v_created integer:=0; v_skipped integer:=0;
BEGIN
 IF NOT public.nd_admin_v1_can('leads','write') OR jsonb_array_length(p_rows)>100 THEN RAISE EXCEPTION 'Not permitted'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_rows) ORDER BY value->'body'->>'email' LOOP
  PERFORM pg_advisory_xact_lock(hashtextextended(lower(item->'body'->>'email'),1));
  IF EXISTS(SELECT 1 FROM public.nd_admin_v1_leads WHERE lower(body->>'email')=lower(item->'body'->>'email')) THEN v_skipped:=v_skipped+1;
  ELSE INSERT INTO public.nd_admin_v1_leads(title,status,body) VALUES(item->>'title','new',item->'body');v_created:=v_created+1; END IF;
 END LOOP;
 RETURN jsonb_build_object('created',v_created,'skipped',v_skipped);
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_import_leads(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_import_leads(jsonb) TO authenticated;
CREATE FUNCTION public.nd_admin_v1_retry_job(p_id uuid,p_revision integer) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
DECLARE v_job public.nd_admin_v1_async_jobs; v_attempts integer;
BEGIN
 IF NOT public.nd_admin_v1_can('automations','write') THEN RAISE EXCEPTION 'Not permitted'; END IF;
 SELECT * INTO v_job FROM public.nd_admin_v1_async_jobs WHERE id=p_id FOR UPDATE;
 IF v_job.id IS NULL OR v_job.revision<>p_revision THEN RAISE EXCEPTION 'Reload the changed job before retrying'; END IF;
 IF v_job.status NOT IN ('failed','blocked') THEN RAISE EXCEPTION 'Only failed or blocked jobs can be retried'; END IF;
 v_attempts:=coalesce((v_job.body->>'attempts')::integer,0);
 IF v_attempts>=least(10,coalesce((v_job.body->>'max_attempts')::integer,3)) THEN RAISE EXCEPTION 'Retry limit reached; review the job before further action'; END IF;
 UPDATE public.nd_admin_v1_async_jobs SET status='queued',body=body||jsonb_build_object('attempts',v_attempts+1,'next_attempt_at',now()+make_interval(secs=>power(2,v_attempts)::integer*30)) WHERE id=p_id;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_retry_job(uuid,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_retry_job(uuid,integer) TO authenticated;
CREATE FUNCTION public.nd_admin_v1_sync_snapshots(p_connection uuid,p_revision integer,p_kind text,p_rows jsonb,p_meta jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $$
DECLARE v_connection public.nd_admin_v1_integration_connections; v_table text; item jsonb; v_existing uuid;
BEGIN
 IF NOT public.nd_admin_v1_can('integrations','write') OR NOT public.nd_admin_v1_can(p_kind,'write') OR jsonb_array_length(p_rows)>1000 THEN RAISE EXCEPTION 'Not permitted'; END IF;
 SELECT * INTO v_connection FROM public.nd_admin_v1_integration_connections WHERE id=p_connection FOR UPDATE;
 IF v_connection.id IS NULL OR v_connection.revision<>p_revision OR v_connection.status='disconnected' THEN RAISE EXCEPTION 'Connection changed; reload before sync'; END IF;
 v_table:=CASE p_kind WHEN 'campaigns' THEN 'nd_admin_v1_campaign_snapshots' WHEN 'analytics' THEN 'nd_admin_v1_analytics_snapshots' ELSE NULL END;
 IF v_table IS NULL THEN RAISE EXCEPTION 'Invalid reporting destination'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_rows) LOOP
  EXECUTE format('SELECT id FROM public.%I WHERE slug=$1',v_table) INTO v_existing USING item->>'slug';
  IF v_existing IS NULL THEN
   EXECUTE format('INSERT INTO public.%I(title,slug,status,body) VALUES($1,$2,''synced'',$3)',v_table) USING item->>'title',item->>'slug',item->'body';
  ELSE
   EXECUTE format('UPDATE public.%I SET title=$1,status=''synced'',body=$2 WHERE id=$3',v_table) USING item->>'title',item->'body',v_existing;
  END IF;
 END LOOP;
 UPDATE public.nd_admin_v1_integration_connections SET status='connected',body=body||p_meta WHERE id=p_connection;
END $$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_sync_snapshots(uuid,integer,text,jsonb,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_sync_snapshots(uuid,integer,text,jsonb,jsonb) TO authenticated;
CREATE FUNCTION public.nd_admin_v1_workspace_brand() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT CASE WHEN EXISTS(SELECT 1 FROM public.nd_admin_v1_memberships WHERE user_id=auth.uid() AND active) THEN coalesce((SELECT jsonb_build_object('organization',body->>'organization','brand_color',body->>'brand_color') FROM public.nd_admin_v1_settings_versions WHERE status='approved' ORDER BY updated_at DESC LIMIT 1),'{}'::jsonb) ELSE '{}'::jsonb END;
$$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_workspace_brand() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_workspace_brand() TO authenticated;
COMMIT;
`;
fs.writeFileSync('supabase/proposals/20261102_nd_admin_v1_additive.sql',sql);
