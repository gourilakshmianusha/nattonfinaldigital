-- PROPOSAL ONLY. Live inventory is unavailable; do not apply until preflight is reviewed.
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
INSERT INTO public.nd_admin_v1_roles VALUES ('super_admin','Super Admin');
INSERT INTO public.nd_admin_v1_roles VALUES ('content_editor','Content Editor');
INSERT INTO public.nd_admin_v1_roles VALUES ('marketing_manager','Marketing Manager');
INSERT INTO public.nd_admin_v1_roles VALUES ('sales_crm','Sales / CRM');
INSERT INTO public.nd_admin_v1_roles VALUES ('hr_recruiter','HR Recruiter');
INSERT INTO public.nd_admin_v1_roles VALUES ('analyst_viewer','Analyst / Viewer');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','dashboard','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','dashboard','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','dashboard','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','dashboard','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','leads','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','leads','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','leads','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','leads','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','leads','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','appointments','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','appointments','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','appointments','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','appointments','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','appointments','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','availability','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','availability','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','availability','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','availability','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','availability','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','pages','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','pages','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','pages','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','pages','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','pages','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','services','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','services','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','services','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','services','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','services','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','blog','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','blog','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','blog','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','blog','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','blog','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','case-studies','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','case-studies','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','case-studies','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','case-studies','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','case-studies','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','media','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','media','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','media','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','media','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','media','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','free-tools','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','free-tools','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','free-tools','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','free-tools','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','free-tools','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','campaigns','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','campaigns','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','campaigns','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','campaigns','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','campaigns','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','seo','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','seo','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','seo','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','seo','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','seo','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','analytics','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','analytics','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','analytics','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','analytics','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','analytics','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','automations','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','automations','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','automations','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','automations','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','automations','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','careers','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','careers','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','careers','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','careers','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','careers','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','applicants','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','applicants','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','applicants','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','applicants','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','applicants','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','team','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','team','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','team','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','team','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','team','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','integrations','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','integrations','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','integrations','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','integrations','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','integrations','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','settings','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','settings','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','settings','publish');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','settings','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('super_admin','settings','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','pages','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','pages','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','services','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','services','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','blog','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','blog','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','case-studies','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','case-studies','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','media','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('content_editor','media','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','campaigns','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','seo','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','seo','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','analytics','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','free-tools','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','free-tools','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','automations','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','automations','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('marketing_manager','integrations','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','leads','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','leads','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','leads','export');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','appointments','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('sales_crm','appointments','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','careers','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','careers','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','applicants','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','applicants','write');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('hr_recruiter','applicants','delete');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('analyst_viewer','dashboard','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('analyst_viewer','campaigns','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('analyst_viewer','analytics','read');
INSERT INTO public.nd_admin_v1_role_permissions VALUES ('analyst_viewer','seo','read');

CREATE FUNCTION public.nd_admin_v1_can(p_module text,p_action text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT EXISTS(SELECT 1 FROM public.nd_admin_v1_memberships m JOIN public.nd_admin_v1_role_permissions p ON p.role_id=m.role_id WHERE m.user_id=auth.uid() AND m.active AND p.module=p_module AND p.action=p_action);
$$;
REVOKE ALL ON FUNCTION public.nd_admin_v1_can(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_can(text,text) TO authenticated;
ALTER TABLE public.nd_admin_v1_roles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_roles FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_roles TO authenticated;
GRANT ALL ON public.nd_admin_v1_roles TO service_role;
ALTER TABLE public.nd_admin_v1_role_permissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_role_permissions FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_role_permissions TO authenticated;
GRANT ALL ON public.nd_admin_v1_role_permissions TO service_role;
ALTER TABLE public.nd_admin_v1_memberships ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_memberships FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_memberships TO authenticated;
GRANT ALL ON public.nd_admin_v1_memberships TO service_role;
ALTER TABLE public.nd_admin_v1_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_profiles FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_profiles TO authenticated;
GRANT ALL ON public.nd_admin_v1_profiles TO service_role;
ALTER TABLE public.nd_admin_v1_audit_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_audit_events FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_audit_events TO authenticated;
GRANT ALL ON public.nd_admin_v1_audit_events TO service_role;
ALTER TABLE public.nd_admin_v1_versions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_versions FROM anon,authenticated;
GRANT SELECT ON public.nd_admin_v1_versions TO authenticated;
GRANT ALL ON public.nd_admin_v1_versions TO service_role;

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

CREATE TABLE public.nd_admin_v1_leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_leads FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_leads TO authenticated;
GRANT ALL ON public.nd_admin_v1_leads TO service_role;
CREATE POLICY nd_admin_v1_leads_read ON public.nd_admin_v1_leads FOR SELECT TO authenticated USING(public.nd_admin_v1_can('leads','read'));
CREATE POLICY nd_admin_v1_leads_insert ON public.nd_admin_v1_leads FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('leads','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_leads_update ON public.nd_admin_v1_leads FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('leads','write')) WITH CHECK(public.nd_admin_v1_can('leads','write'));
CREATE POLICY nd_admin_v1_leads_delete ON public.nd_admin_v1_leads FOR DELETE TO authenticated USING(public.nd_admin_v1_can('leads','delete'));
CREATE INDEX nd_admin_v1_leads_status_created_idx ON public.nd_admin_v1_leads(status,created_at DESC);
CREATE INDEX nd_admin_v1_leads_owner_idx ON public.nd_admin_v1_leads(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_leads_slug_idx ON public.nd_admin_v1_leads(slug);
CREATE TRIGGER nd_admin_v1_leads_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_leads FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('leads','record');

CREATE TABLE public.nd_admin_v1_appointments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_appointments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_appointments FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_appointments TO authenticated;
GRANT ALL ON public.nd_admin_v1_appointments TO service_role;
CREATE POLICY nd_admin_v1_appointments_read ON public.nd_admin_v1_appointments FOR SELECT TO authenticated USING(public.nd_admin_v1_can('appointments','read'));
CREATE POLICY nd_admin_v1_appointments_insert ON public.nd_admin_v1_appointments FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('appointments','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_appointments_update ON public.nd_admin_v1_appointments FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('appointments','write')) WITH CHECK(public.nd_admin_v1_can('appointments','write'));
CREATE POLICY nd_admin_v1_appointments_delete ON public.nd_admin_v1_appointments FOR DELETE TO authenticated USING(public.nd_admin_v1_can('appointments','delete'));
CREATE INDEX nd_admin_v1_appointments_status_created_idx ON public.nd_admin_v1_appointments(status,created_at DESC);
CREATE INDEX nd_admin_v1_appointments_owner_idx ON public.nd_admin_v1_appointments(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_appointments_slug_idx ON public.nd_admin_v1_appointments(slug);
CREATE TRIGGER nd_admin_v1_appointments_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_appointments FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('appointments','record');

CREATE TABLE public.nd_admin_v1_availability (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_availability ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_availability FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_availability TO authenticated;
GRANT ALL ON public.nd_admin_v1_availability TO service_role;
CREATE POLICY nd_admin_v1_availability_read ON public.nd_admin_v1_availability FOR SELECT TO authenticated USING(public.nd_admin_v1_can('appointments','read'));
CREATE POLICY nd_admin_v1_availability_insert ON public.nd_admin_v1_availability FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('appointments','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_availability_update ON public.nd_admin_v1_availability FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('appointments','write')) WITH CHECK(public.nd_admin_v1_can('appointments','write'));
CREATE POLICY nd_admin_v1_availability_delete ON public.nd_admin_v1_availability FOR DELETE TO authenticated USING(public.nd_admin_v1_can('appointments','delete'));
CREATE INDEX nd_admin_v1_availability_status_created_idx ON public.nd_admin_v1_availability(status,created_at DESC);
CREATE INDEX nd_admin_v1_availability_owner_idx ON public.nd_admin_v1_availability(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_availability_slug_idx ON public.nd_admin_v1_availability(slug);
CREATE TRIGGER nd_admin_v1_availability_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_availability FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('appointments','record');

CREATE TABLE public.nd_admin_v1_pages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_pages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_pages FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_pages TO authenticated;
GRANT ALL ON public.nd_admin_v1_pages TO service_role;
CREATE POLICY nd_admin_v1_pages_read ON public.nd_admin_v1_pages FOR SELECT TO authenticated USING(public.nd_admin_v1_can('pages','read'));
CREATE POLICY nd_admin_v1_pages_insert ON public.nd_admin_v1_pages FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('pages','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_pages_update ON public.nd_admin_v1_pages FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('pages','write')) WITH CHECK(public.nd_admin_v1_can('pages','write'));
CREATE POLICY nd_admin_v1_pages_delete ON public.nd_admin_v1_pages FOR DELETE TO authenticated USING(public.nd_admin_v1_can('pages','delete'));
CREATE INDEX nd_admin_v1_pages_status_created_idx ON public.nd_admin_v1_pages(status,created_at DESC);
CREATE INDEX nd_admin_v1_pages_owner_idx ON public.nd_admin_v1_pages(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_pages_slug_idx ON public.nd_admin_v1_pages(slug);
CREATE TRIGGER nd_admin_v1_pages_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_pages FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('pages','content');

CREATE TABLE public.nd_admin_v1_services (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_services ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_services FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_services TO authenticated;
GRANT ALL ON public.nd_admin_v1_services TO service_role;
CREATE POLICY nd_admin_v1_services_read ON public.nd_admin_v1_services FOR SELECT TO authenticated USING(public.nd_admin_v1_can('services','read'));
CREATE POLICY nd_admin_v1_services_insert ON public.nd_admin_v1_services FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('services','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_services_update ON public.nd_admin_v1_services FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('services','write')) WITH CHECK(public.nd_admin_v1_can('services','write'));
CREATE POLICY nd_admin_v1_services_delete ON public.nd_admin_v1_services FOR DELETE TO authenticated USING(public.nd_admin_v1_can('services','delete'));
CREATE INDEX nd_admin_v1_services_status_created_idx ON public.nd_admin_v1_services(status,created_at DESC);
CREATE INDEX nd_admin_v1_services_owner_idx ON public.nd_admin_v1_services(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_services_slug_idx ON public.nd_admin_v1_services(slug);
CREATE TRIGGER nd_admin_v1_services_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_services FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('services','content');

CREATE TABLE public.nd_admin_v1_posts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_posts FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_posts TO authenticated;
GRANT ALL ON public.nd_admin_v1_posts TO service_role;
CREATE POLICY nd_admin_v1_posts_read ON public.nd_admin_v1_posts FOR SELECT TO authenticated USING(public.nd_admin_v1_can('blog','read'));
CREATE POLICY nd_admin_v1_posts_insert ON public.nd_admin_v1_posts FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('blog','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_posts_update ON public.nd_admin_v1_posts FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('blog','write')) WITH CHECK(public.nd_admin_v1_can('blog','write'));
CREATE POLICY nd_admin_v1_posts_delete ON public.nd_admin_v1_posts FOR DELETE TO authenticated USING(public.nd_admin_v1_can('blog','delete'));
CREATE INDEX nd_admin_v1_posts_status_created_idx ON public.nd_admin_v1_posts(status,created_at DESC);
CREATE INDEX nd_admin_v1_posts_owner_idx ON public.nd_admin_v1_posts(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_posts_slug_idx ON public.nd_admin_v1_posts(slug);
CREATE TRIGGER nd_admin_v1_posts_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_posts FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('blog','content');

CREATE TABLE public.nd_admin_v1_case_studies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_case_studies ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_case_studies FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_case_studies TO authenticated;
GRANT ALL ON public.nd_admin_v1_case_studies TO service_role;
CREATE POLICY nd_admin_v1_case_studies_read ON public.nd_admin_v1_case_studies FOR SELECT TO authenticated USING(public.nd_admin_v1_can('case-studies','read'));
CREATE POLICY nd_admin_v1_case_studies_insert ON public.nd_admin_v1_case_studies FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('case-studies','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_case_studies_update ON public.nd_admin_v1_case_studies FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('case-studies','write')) WITH CHECK(public.nd_admin_v1_can('case-studies','write'));
CREATE POLICY nd_admin_v1_case_studies_delete ON public.nd_admin_v1_case_studies FOR DELETE TO authenticated USING(public.nd_admin_v1_can('case-studies','delete'));
CREATE INDEX nd_admin_v1_case_studies_status_created_idx ON public.nd_admin_v1_case_studies(status,created_at DESC);
CREATE INDEX nd_admin_v1_case_studies_owner_idx ON public.nd_admin_v1_case_studies(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_case_studies_slug_idx ON public.nd_admin_v1_case_studies(slug);
CREATE TRIGGER nd_admin_v1_case_studies_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_case_studies FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('case-studies','content');

CREATE TABLE public.nd_admin_v1_media (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_media ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_media FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_media TO authenticated;
GRANT ALL ON public.nd_admin_v1_media TO service_role;
CREATE POLICY nd_admin_v1_media_read ON public.nd_admin_v1_media FOR SELECT TO authenticated USING(public.nd_admin_v1_can('media','read'));
CREATE POLICY nd_admin_v1_media_insert ON public.nd_admin_v1_media FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('media','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_media_update ON public.nd_admin_v1_media FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('media','write')) WITH CHECK(public.nd_admin_v1_can('media','write'));
CREATE POLICY nd_admin_v1_media_delete ON public.nd_admin_v1_media FOR DELETE TO authenticated USING(public.nd_admin_v1_can('media','delete'));
CREATE INDEX nd_admin_v1_media_status_created_idx ON public.nd_admin_v1_media(status,created_at DESC);
CREATE INDEX nd_admin_v1_media_owner_idx ON public.nd_admin_v1_media(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_media_slug_idx ON public.nd_admin_v1_media(slug);
CREATE TRIGGER nd_admin_v1_media_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_media FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('media','record');

CREATE TABLE public.nd_admin_v1_tools (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_tools ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_tools FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_tools TO authenticated;
GRANT ALL ON public.nd_admin_v1_tools TO service_role;
CREATE POLICY nd_admin_v1_tools_read ON public.nd_admin_v1_tools FOR SELECT TO authenticated USING(public.nd_admin_v1_can('free-tools','read'));
CREATE POLICY nd_admin_v1_tools_insert ON public.nd_admin_v1_tools FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('free-tools','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_tools_update ON public.nd_admin_v1_tools FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('free-tools','write')) WITH CHECK(public.nd_admin_v1_can('free-tools','write'));
CREATE POLICY nd_admin_v1_tools_delete ON public.nd_admin_v1_tools FOR DELETE TO authenticated USING(public.nd_admin_v1_can('free-tools','delete'));
CREATE INDEX nd_admin_v1_tools_status_created_idx ON public.nd_admin_v1_tools(status,created_at DESC);
CREATE INDEX nd_admin_v1_tools_owner_idx ON public.nd_admin_v1_tools(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_tools_slug_idx ON public.nd_admin_v1_tools(slug);
CREATE TRIGGER nd_admin_v1_tools_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_tools FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('free-tools','record');

CREATE TABLE public.nd_admin_v1_campaign_snapshots (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_campaign_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_campaign_snapshots FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_campaign_snapshots TO authenticated;
GRANT ALL ON public.nd_admin_v1_campaign_snapshots TO service_role;
CREATE POLICY nd_admin_v1_campaign_snapshots_read ON public.nd_admin_v1_campaign_snapshots FOR SELECT TO authenticated USING(public.nd_admin_v1_can('campaigns','read'));
CREATE POLICY nd_admin_v1_campaign_snapshots_insert ON public.nd_admin_v1_campaign_snapshots FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('campaigns','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_campaign_snapshots_update ON public.nd_admin_v1_campaign_snapshots FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('campaigns','write')) WITH CHECK(public.nd_admin_v1_can('campaigns','write'));
CREATE POLICY nd_admin_v1_campaign_snapshots_delete ON public.nd_admin_v1_campaign_snapshots FOR DELETE TO authenticated USING(public.nd_admin_v1_can('campaigns','delete'));
CREATE INDEX nd_admin_v1_campaign_snapshots_status_created_idx ON public.nd_admin_v1_campaign_snapshots(status,created_at DESC);
CREATE INDEX nd_admin_v1_campaign_snapshots_owner_idx ON public.nd_admin_v1_campaign_snapshots(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_campaign_snapshots_slug_idx ON public.nd_admin_v1_campaign_snapshots(slug);
CREATE TRIGGER nd_admin_v1_campaign_snapshots_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_campaign_snapshots FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('campaigns','record');

CREATE TABLE public.nd_admin_v1_seo_scans (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_seo_scans ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_seo_scans FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_seo_scans TO authenticated;
GRANT ALL ON public.nd_admin_v1_seo_scans TO service_role;
CREATE POLICY nd_admin_v1_seo_scans_read ON public.nd_admin_v1_seo_scans FOR SELECT TO authenticated USING(public.nd_admin_v1_can('seo','read'));
CREATE POLICY nd_admin_v1_seo_scans_insert ON public.nd_admin_v1_seo_scans FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('seo','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_seo_scans_update ON public.nd_admin_v1_seo_scans FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('seo','write')) WITH CHECK(public.nd_admin_v1_can('seo','write'));
CREATE POLICY nd_admin_v1_seo_scans_delete ON public.nd_admin_v1_seo_scans FOR DELETE TO authenticated USING(public.nd_admin_v1_can('seo','delete'));
CREATE INDEX nd_admin_v1_seo_scans_status_created_idx ON public.nd_admin_v1_seo_scans(status,created_at DESC);
CREATE INDEX nd_admin_v1_seo_scans_owner_idx ON public.nd_admin_v1_seo_scans(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_seo_scans_slug_idx ON public.nd_admin_v1_seo_scans(slug);
CREATE TRIGGER nd_admin_v1_seo_scans_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_seo_scans FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('seo','record');

CREATE TABLE public.nd_admin_v1_analytics_snapshots (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_analytics_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_analytics_snapshots FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_analytics_snapshots TO authenticated;
GRANT ALL ON public.nd_admin_v1_analytics_snapshots TO service_role;
CREATE POLICY nd_admin_v1_analytics_snapshots_read ON public.nd_admin_v1_analytics_snapshots FOR SELECT TO authenticated USING(public.nd_admin_v1_can('analytics','read'));
CREATE POLICY nd_admin_v1_analytics_snapshots_insert ON public.nd_admin_v1_analytics_snapshots FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('analytics','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_analytics_snapshots_update ON public.nd_admin_v1_analytics_snapshots FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('analytics','write')) WITH CHECK(public.nd_admin_v1_can('analytics','write'));
CREATE POLICY nd_admin_v1_analytics_snapshots_delete ON public.nd_admin_v1_analytics_snapshots FOR DELETE TO authenticated USING(public.nd_admin_v1_can('analytics','delete'));
CREATE INDEX nd_admin_v1_analytics_snapshots_status_created_idx ON public.nd_admin_v1_analytics_snapshots(status,created_at DESC);
CREATE INDEX nd_admin_v1_analytics_snapshots_owner_idx ON public.nd_admin_v1_analytics_snapshots(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_analytics_snapshots_slug_idx ON public.nd_admin_v1_analytics_snapshots(slug);
CREATE TRIGGER nd_admin_v1_analytics_snapshots_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_analytics_snapshots FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('analytics','record');

CREATE TABLE public.nd_admin_v1_workflows (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_workflows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_workflows FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_workflows TO authenticated;
GRANT ALL ON public.nd_admin_v1_workflows TO service_role;
CREATE POLICY nd_admin_v1_workflows_read ON public.nd_admin_v1_workflows FOR SELECT TO authenticated USING(public.nd_admin_v1_can('automations','read'));
CREATE POLICY nd_admin_v1_workflows_insert ON public.nd_admin_v1_workflows FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('automations','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_workflows_update ON public.nd_admin_v1_workflows FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('automations','write')) WITH CHECK(public.nd_admin_v1_can('automations','write'));
CREATE POLICY nd_admin_v1_workflows_delete ON public.nd_admin_v1_workflows FOR DELETE TO authenticated USING(public.nd_admin_v1_can('automations','delete'));
CREATE INDEX nd_admin_v1_workflows_status_created_idx ON public.nd_admin_v1_workflows(status,created_at DESC);
CREATE INDEX nd_admin_v1_workflows_owner_idx ON public.nd_admin_v1_workflows(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_workflows_slug_idx ON public.nd_admin_v1_workflows(slug);
CREATE TRIGGER nd_admin_v1_workflows_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_workflows FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('automations','record');

CREATE TABLE public.nd_admin_v1_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_jobs FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_jobs TO authenticated;
GRANT ALL ON public.nd_admin_v1_jobs TO service_role;
CREATE POLICY nd_admin_v1_jobs_read ON public.nd_admin_v1_jobs FOR SELECT TO authenticated USING(public.nd_admin_v1_can('careers','read'));
CREATE POLICY nd_admin_v1_jobs_insert ON public.nd_admin_v1_jobs FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('careers','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_jobs_update ON public.nd_admin_v1_jobs FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('careers','write')) WITH CHECK(public.nd_admin_v1_can('careers','write'));
CREATE POLICY nd_admin_v1_jobs_delete ON public.nd_admin_v1_jobs FOR DELETE TO authenticated USING(public.nd_admin_v1_can('careers','delete'));
CREATE INDEX nd_admin_v1_jobs_status_created_idx ON public.nd_admin_v1_jobs(status,created_at DESC);
CREATE INDEX nd_admin_v1_jobs_owner_idx ON public.nd_admin_v1_jobs(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_jobs_slug_idx ON public.nd_admin_v1_jobs(slug);
CREATE TRIGGER nd_admin_v1_jobs_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_jobs FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('careers','content');

CREATE TABLE public.nd_admin_v1_applicants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_applicants ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_applicants FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_applicants TO authenticated;
GRANT ALL ON public.nd_admin_v1_applicants TO service_role;
CREATE POLICY nd_admin_v1_applicants_read ON public.nd_admin_v1_applicants FOR SELECT TO authenticated USING(public.nd_admin_v1_can('applicants','read'));
CREATE POLICY nd_admin_v1_applicants_insert ON public.nd_admin_v1_applicants FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('applicants','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_applicants_update ON public.nd_admin_v1_applicants FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('applicants','write')) WITH CHECK(public.nd_admin_v1_can('applicants','write'));
CREATE POLICY nd_admin_v1_applicants_delete ON public.nd_admin_v1_applicants FOR DELETE TO authenticated USING(public.nd_admin_v1_can('applicants','delete'));
CREATE INDEX nd_admin_v1_applicants_status_created_idx ON public.nd_admin_v1_applicants(status,created_at DESC);
CREATE INDEX nd_admin_v1_applicants_owner_idx ON public.nd_admin_v1_applicants(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_applicants_slug_idx ON public.nd_admin_v1_applicants(slug);
CREATE TRIGGER nd_admin_v1_applicants_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_applicants FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('applicants','record');

CREATE TABLE public.nd_admin_v1_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_invitations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_invitations FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_invitations TO authenticated;
GRANT ALL ON public.nd_admin_v1_invitations TO service_role;
CREATE POLICY nd_admin_v1_invitations_read ON public.nd_admin_v1_invitations FOR SELECT TO authenticated USING(public.nd_admin_v1_can('team','read'));
CREATE POLICY nd_admin_v1_invitations_insert ON public.nd_admin_v1_invitations FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('team','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_invitations_update ON public.nd_admin_v1_invitations FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('team','write')) WITH CHECK(public.nd_admin_v1_can('team','write'));
CREATE POLICY nd_admin_v1_invitations_delete ON public.nd_admin_v1_invitations FOR DELETE TO authenticated USING(public.nd_admin_v1_can('team','delete'));
CREATE INDEX nd_admin_v1_invitations_status_created_idx ON public.nd_admin_v1_invitations(status,created_at DESC);
CREATE INDEX nd_admin_v1_invitations_owner_idx ON public.nd_admin_v1_invitations(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_invitations_slug_idx ON public.nd_admin_v1_invitations(slug);
CREATE TRIGGER nd_admin_v1_invitations_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_invitations FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('team','record');

CREATE TABLE public.nd_admin_v1_integration_connections (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_integration_connections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_integration_connections FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_integration_connections TO authenticated;
GRANT ALL ON public.nd_admin_v1_integration_connections TO service_role;
CREATE POLICY nd_admin_v1_integration_connections_read ON public.nd_admin_v1_integration_connections FOR SELECT TO authenticated USING(public.nd_admin_v1_can('integrations','read'));
CREATE POLICY nd_admin_v1_integration_connections_insert ON public.nd_admin_v1_integration_connections FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('integrations','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_integration_connections_update ON public.nd_admin_v1_integration_connections FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('integrations','write')) WITH CHECK(public.nd_admin_v1_can('integrations','write'));
CREATE POLICY nd_admin_v1_integration_connections_delete ON public.nd_admin_v1_integration_connections FOR DELETE TO authenticated USING(public.nd_admin_v1_can('integrations','delete'));
CREATE INDEX nd_admin_v1_integration_connections_status_created_idx ON public.nd_admin_v1_integration_connections(status,created_at DESC);
CREATE INDEX nd_admin_v1_integration_connections_owner_idx ON public.nd_admin_v1_integration_connections(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_integration_connections_slug_idx ON public.nd_admin_v1_integration_connections(slug);
CREATE TRIGGER nd_admin_v1_integration_connections_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_integration_connections FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('integrations','record');

CREATE TABLE public.nd_admin_v1_settings_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_settings_versions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_settings_versions FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_settings_versions TO authenticated;
GRANT ALL ON public.nd_admin_v1_settings_versions TO service_role;
CREATE POLICY nd_admin_v1_settings_versions_read ON public.nd_admin_v1_settings_versions FOR SELECT TO authenticated USING(public.nd_admin_v1_can('settings','read'));
CREATE POLICY nd_admin_v1_settings_versions_insert ON public.nd_admin_v1_settings_versions FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('settings','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_settings_versions_update ON public.nd_admin_v1_settings_versions FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('settings','write')) WITH CHECK(public.nd_admin_v1_can('settings','write'));
CREATE POLICY nd_admin_v1_settings_versions_delete ON public.nd_admin_v1_settings_versions FOR DELETE TO authenticated USING(public.nd_admin_v1_can('settings','delete'));
CREATE INDEX nd_admin_v1_settings_versions_status_created_idx ON public.nd_admin_v1_settings_versions(status,created_at DESC);
CREATE INDEX nd_admin_v1_settings_versions_owner_idx ON public.nd_admin_v1_settings_versions(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_settings_versions_slug_idx ON public.nd_admin_v1_settings_versions(slug);
CREATE TRIGGER nd_admin_v1_settings_versions_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_settings_versions FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('settings','record');

CREATE TABLE public.nd_admin_v1_lead_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_lead_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_lead_events FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_lead_events TO authenticated;
GRANT ALL ON public.nd_admin_v1_lead_events TO service_role;
CREATE POLICY nd_admin_v1_lead_events_read ON public.nd_admin_v1_lead_events FOR SELECT TO authenticated USING(public.nd_admin_v1_can('leads','read'));
CREATE POLICY nd_admin_v1_lead_events_insert ON public.nd_admin_v1_lead_events FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('leads','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_lead_events_update ON public.nd_admin_v1_lead_events FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('leads','write')) WITH CHECK(public.nd_admin_v1_can('leads','write'));
CREATE POLICY nd_admin_v1_lead_events_delete ON public.nd_admin_v1_lead_events FOR DELETE TO authenticated USING(public.nd_admin_v1_can('leads','delete'));
CREATE INDEX nd_admin_v1_lead_events_status_created_idx ON public.nd_admin_v1_lead_events(status,created_at DESC);
CREATE INDEX nd_admin_v1_lead_events_owner_idx ON public.nd_admin_v1_lead_events(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_lead_events_slug_idx ON public.nd_admin_v1_lead_events(slug);
CREATE TRIGGER nd_admin_v1_lead_events_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_lead_events FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('leads','record');

CREATE TABLE public.nd_admin_v1_consents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_consents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_consents FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_consents TO authenticated;
GRANT ALL ON public.nd_admin_v1_consents TO service_role;
CREATE POLICY nd_admin_v1_consents_read ON public.nd_admin_v1_consents FOR SELECT TO authenticated USING(public.nd_admin_v1_can('leads','read'));
CREATE POLICY nd_admin_v1_consents_insert ON public.nd_admin_v1_consents FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('leads','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_consents_update ON public.nd_admin_v1_consents FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('leads','write')) WITH CHECK(public.nd_admin_v1_can('leads','write'));
CREATE POLICY nd_admin_v1_consents_delete ON public.nd_admin_v1_consents FOR DELETE TO authenticated USING(public.nd_admin_v1_can('leads','delete'));
CREATE INDEX nd_admin_v1_consents_status_created_idx ON public.nd_admin_v1_consents(status,created_at DESC);
CREATE INDEX nd_admin_v1_consents_owner_idx ON public.nd_admin_v1_consents(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_consents_slug_idx ON public.nd_admin_v1_consents(slug);
CREATE TRIGGER nd_admin_v1_consents_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_consents FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('leads','record');

CREATE TABLE public.nd_admin_v1_followups (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_followups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_followups FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_followups TO authenticated;
GRANT ALL ON public.nd_admin_v1_followups TO service_role;
CREATE POLICY nd_admin_v1_followups_read ON public.nd_admin_v1_followups FOR SELECT TO authenticated USING(public.nd_admin_v1_can('leads','read'));
CREATE POLICY nd_admin_v1_followups_insert ON public.nd_admin_v1_followups FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('leads','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_followups_update ON public.nd_admin_v1_followups FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('leads','write')) WITH CHECK(public.nd_admin_v1_can('leads','write'));
CREATE POLICY nd_admin_v1_followups_delete ON public.nd_admin_v1_followups FOR DELETE TO authenticated USING(public.nd_admin_v1_can('leads','delete'));
CREATE INDEX nd_admin_v1_followups_status_created_idx ON public.nd_admin_v1_followups(status,created_at DESC);
CREATE INDEX nd_admin_v1_followups_owner_idx ON public.nd_admin_v1_followups(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_followups_slug_idx ON public.nd_admin_v1_followups(slug);
CREATE TRIGGER nd_admin_v1_followups_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_followups FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('leads','record');

CREATE TABLE public.nd_admin_v1_application_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_application_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_application_events FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_application_events TO authenticated;
GRANT ALL ON public.nd_admin_v1_application_events TO service_role;
CREATE POLICY nd_admin_v1_application_events_read ON public.nd_admin_v1_application_events FOR SELECT TO authenticated USING(public.nd_admin_v1_can('applicants','read'));
CREATE POLICY nd_admin_v1_application_events_insert ON public.nd_admin_v1_application_events FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('applicants','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_application_events_update ON public.nd_admin_v1_application_events FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('applicants','write')) WITH CHECK(public.nd_admin_v1_can('applicants','write'));
CREATE POLICY nd_admin_v1_application_events_delete ON public.nd_admin_v1_application_events FOR DELETE TO authenticated USING(public.nd_admin_v1_can('applicants','delete'));
CREATE INDEX nd_admin_v1_application_events_status_created_idx ON public.nd_admin_v1_application_events(status,created_at DESC);
CREATE INDEX nd_admin_v1_application_events_owner_idx ON public.nd_admin_v1_application_events(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_application_events_slug_idx ON public.nd_admin_v1_application_events(slug);
CREATE TRIGGER nd_admin_v1_application_events_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_application_events FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('applicants','record');

CREATE TABLE public.nd_admin_v1_authors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_authors ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_authors FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_authors TO authenticated;
GRANT ALL ON public.nd_admin_v1_authors TO service_role;
CREATE POLICY nd_admin_v1_authors_read ON public.nd_admin_v1_authors FOR SELECT TO authenticated USING(public.nd_admin_v1_can('blog','read'));
CREATE POLICY nd_admin_v1_authors_insert ON public.nd_admin_v1_authors FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('blog','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_authors_update ON public.nd_admin_v1_authors FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('blog','write')) WITH CHECK(public.nd_admin_v1_can('blog','write'));
CREATE POLICY nd_admin_v1_authors_delete ON public.nd_admin_v1_authors FOR DELETE TO authenticated USING(public.nd_admin_v1_can('blog','delete'));
CREATE INDEX nd_admin_v1_authors_status_created_idx ON public.nd_admin_v1_authors(status,created_at DESC);
CREATE INDEX nd_admin_v1_authors_owner_idx ON public.nd_admin_v1_authors(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_authors_slug_idx ON public.nd_admin_v1_authors(slug);
CREATE TRIGGER nd_admin_v1_authors_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_authors FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('blog','record');

CREATE TABLE public.nd_admin_v1_tags (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_tags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_tags FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_tags TO authenticated;
GRANT ALL ON public.nd_admin_v1_tags TO service_role;
CREATE POLICY nd_admin_v1_tags_read ON public.nd_admin_v1_tags FOR SELECT TO authenticated USING(public.nd_admin_v1_can('blog','read'));
CREATE POLICY nd_admin_v1_tags_insert ON public.nd_admin_v1_tags FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('blog','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_tags_update ON public.nd_admin_v1_tags FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('blog','write')) WITH CHECK(public.nd_admin_v1_can('blog','write'));
CREATE POLICY nd_admin_v1_tags_delete ON public.nd_admin_v1_tags FOR DELETE TO authenticated USING(public.nd_admin_v1_can('blog','delete'));
CREATE INDEX nd_admin_v1_tags_status_created_idx ON public.nd_admin_v1_tags(status,created_at DESC);
CREATE INDEX nd_admin_v1_tags_owner_idx ON public.nd_admin_v1_tags(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_tags_slug_idx ON public.nd_admin_v1_tags(slug);
CREATE TRIGGER nd_admin_v1_tags_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_tags FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('blog','record');

CREATE TABLE public.nd_admin_v1_post_tags (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_post_tags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_post_tags FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_post_tags TO authenticated;
GRANT ALL ON public.nd_admin_v1_post_tags TO service_role;
CREATE POLICY nd_admin_v1_post_tags_read ON public.nd_admin_v1_post_tags FOR SELECT TO authenticated USING(public.nd_admin_v1_can('blog','read'));
CREATE POLICY nd_admin_v1_post_tags_insert ON public.nd_admin_v1_post_tags FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('blog','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_post_tags_update ON public.nd_admin_v1_post_tags FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('blog','write')) WITH CHECK(public.nd_admin_v1_can('blog','write'));
CREATE POLICY nd_admin_v1_post_tags_delete ON public.nd_admin_v1_post_tags FOR DELETE TO authenticated USING(public.nd_admin_v1_can('blog','delete'));
CREATE INDEX nd_admin_v1_post_tags_status_created_idx ON public.nd_admin_v1_post_tags(status,created_at DESC);
CREATE INDEX nd_admin_v1_post_tags_owner_idx ON public.nd_admin_v1_post_tags(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_post_tags_slug_idx ON public.nd_admin_v1_post_tags(slug);
CREATE TRIGGER nd_admin_v1_post_tags_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_post_tags FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('blog','record');

CREATE TABLE public.nd_admin_v1_categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_categories ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_categories FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_categories TO authenticated;
GRANT ALL ON public.nd_admin_v1_categories TO service_role;
CREATE POLICY nd_admin_v1_categories_read ON public.nd_admin_v1_categories FOR SELECT TO authenticated USING(public.nd_admin_v1_can('services','read'));
CREATE POLICY nd_admin_v1_categories_insert ON public.nd_admin_v1_categories FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('services','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_categories_update ON public.nd_admin_v1_categories FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('services','write')) WITH CHECK(public.nd_admin_v1_can('services','write'));
CREATE POLICY nd_admin_v1_categories_delete ON public.nd_admin_v1_categories FOR DELETE TO authenticated USING(public.nd_admin_v1_can('services','delete'));
CREATE INDEX nd_admin_v1_categories_status_created_idx ON public.nd_admin_v1_categories(status,created_at DESC);
CREATE INDEX nd_admin_v1_categories_owner_idx ON public.nd_admin_v1_categories(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_categories_slug_idx ON public.nd_admin_v1_categories(slug);
CREATE TRIGGER nd_admin_v1_categories_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_categories FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('services','record');

CREATE TABLE public.nd_admin_v1_menus (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_menus ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_menus FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_menus TO authenticated;
GRANT ALL ON public.nd_admin_v1_menus TO service_role;
CREATE POLICY nd_admin_v1_menus_read ON public.nd_admin_v1_menus FOR SELECT TO authenticated USING(public.nd_admin_v1_can('pages','read'));
CREATE POLICY nd_admin_v1_menus_insert ON public.nd_admin_v1_menus FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('pages','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_menus_update ON public.nd_admin_v1_menus FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('pages','write')) WITH CHECK(public.nd_admin_v1_can('pages','write'));
CREATE POLICY nd_admin_v1_menus_delete ON public.nd_admin_v1_menus FOR DELETE TO authenticated USING(public.nd_admin_v1_can('pages','delete'));
CREATE INDEX nd_admin_v1_menus_status_created_idx ON public.nd_admin_v1_menus(status,created_at DESC);
CREATE INDEX nd_admin_v1_menus_owner_idx ON public.nd_admin_v1_menus(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_menus_slug_idx ON public.nd_admin_v1_menus(slug);
CREATE TRIGGER nd_admin_v1_menus_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_menus FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('pages','record');

CREATE TABLE public.nd_admin_v1_tool_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_tool_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_tool_runs FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_tool_runs TO authenticated;
GRANT ALL ON public.nd_admin_v1_tool_runs TO service_role;
CREATE POLICY nd_admin_v1_tool_runs_read ON public.nd_admin_v1_tool_runs FOR SELECT TO authenticated USING(public.nd_admin_v1_can('free-tools','read'));
CREATE POLICY nd_admin_v1_tool_runs_insert ON public.nd_admin_v1_tool_runs FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('free-tools','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_tool_runs_update ON public.nd_admin_v1_tool_runs FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('free-tools','write')) WITH CHECK(public.nd_admin_v1_can('free-tools','write'));
CREATE POLICY nd_admin_v1_tool_runs_delete ON public.nd_admin_v1_tool_runs FOR DELETE TO authenticated USING(public.nd_admin_v1_can('free-tools','delete'));
CREATE INDEX nd_admin_v1_tool_runs_status_created_idx ON public.nd_admin_v1_tool_runs(status,created_at DESC);
CREATE INDEX nd_admin_v1_tool_runs_owner_idx ON public.nd_admin_v1_tool_runs(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_tool_runs_slug_idx ON public.nd_admin_v1_tool_runs(slug);
CREATE TRIGGER nd_admin_v1_tool_runs_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_tool_runs FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('free-tools','record');

CREATE TABLE public.nd_admin_v1_workflow_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_workflow_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_workflow_runs FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_workflow_runs TO authenticated;
GRANT ALL ON public.nd_admin_v1_workflow_runs TO service_role;
CREATE POLICY nd_admin_v1_workflow_runs_read ON public.nd_admin_v1_workflow_runs FOR SELECT TO authenticated USING(public.nd_admin_v1_can('automations','read'));
CREATE POLICY nd_admin_v1_workflow_runs_insert ON public.nd_admin_v1_workflow_runs FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('automations','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_workflow_runs_update ON public.nd_admin_v1_workflow_runs FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('automations','write')) WITH CHECK(public.nd_admin_v1_can('automations','write'));
CREATE POLICY nd_admin_v1_workflow_runs_delete ON public.nd_admin_v1_workflow_runs FOR DELETE TO authenticated USING(public.nd_admin_v1_can('automations','delete'));
CREATE INDEX nd_admin_v1_workflow_runs_status_created_idx ON public.nd_admin_v1_workflow_runs(status,created_at DESC);
CREATE INDEX nd_admin_v1_workflow_runs_owner_idx ON public.nd_admin_v1_workflow_runs(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_workflow_runs_slug_idx ON public.nd_admin_v1_workflow_runs(slug);
CREATE TRIGGER nd_admin_v1_workflow_runs_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_workflow_runs FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('automations','record');

CREATE TABLE public.nd_admin_v1_webhook_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_webhook_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_webhook_events FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_webhook_events TO authenticated;
GRANT ALL ON public.nd_admin_v1_webhook_events TO service_role;
CREATE POLICY nd_admin_v1_webhook_events_read ON public.nd_admin_v1_webhook_events FOR SELECT TO authenticated USING(public.nd_admin_v1_can('automations','read'));
CREATE POLICY nd_admin_v1_webhook_events_insert ON public.nd_admin_v1_webhook_events FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('automations','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_webhook_events_update ON public.nd_admin_v1_webhook_events FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('automations','write')) WITH CHECK(public.nd_admin_v1_can('automations','write'));
CREATE POLICY nd_admin_v1_webhook_events_delete ON public.nd_admin_v1_webhook_events FOR DELETE TO authenticated USING(public.nd_admin_v1_can('automations','delete'));
CREATE INDEX nd_admin_v1_webhook_events_status_created_idx ON public.nd_admin_v1_webhook_events(status,created_at DESC);
CREATE INDEX nd_admin_v1_webhook_events_owner_idx ON public.nd_admin_v1_webhook_events(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_webhook_events_slug_idx ON public.nd_admin_v1_webhook_events(slug);
CREATE TRIGGER nd_admin_v1_webhook_events_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_webhook_events FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('automations','record');

CREATE TABLE public.nd_admin_v1_async_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_async_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_async_jobs FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_async_jobs TO authenticated;
GRANT ALL ON public.nd_admin_v1_async_jobs TO service_role;
CREATE POLICY nd_admin_v1_async_jobs_read ON public.nd_admin_v1_async_jobs FOR SELECT TO authenticated USING(public.nd_admin_v1_can('automations','read'));
CREATE POLICY nd_admin_v1_async_jobs_insert ON public.nd_admin_v1_async_jobs FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('automations','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_async_jobs_update ON public.nd_admin_v1_async_jobs FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('automations','write')) WITH CHECK(public.nd_admin_v1_can('automations','write'));
CREATE POLICY nd_admin_v1_async_jobs_delete ON public.nd_admin_v1_async_jobs FOR DELETE TO authenticated USING(public.nd_admin_v1_can('automations','delete'));
CREATE INDEX nd_admin_v1_async_jobs_status_created_idx ON public.nd_admin_v1_async_jobs(status,created_at DESC);
CREATE INDEX nd_admin_v1_async_jobs_owner_idx ON public.nd_admin_v1_async_jobs(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_async_jobs_slug_idx ON public.nd_admin_v1_async_jobs(slug);
CREATE TRIGGER nd_admin_v1_async_jobs_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_async_jobs FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('automations','record');

CREATE TABLE public.nd_admin_v1_evidence (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_evidence ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_evidence FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_evidence TO authenticated;
GRANT ALL ON public.nd_admin_v1_evidence TO service_role;
CREATE POLICY nd_admin_v1_evidence_read ON public.nd_admin_v1_evidence FOR SELECT TO authenticated USING(public.nd_admin_v1_can('case-studies','read'));
CREATE POLICY nd_admin_v1_evidence_insert ON public.nd_admin_v1_evidence FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('case-studies','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_evidence_update ON public.nd_admin_v1_evidence FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('case-studies','write')) WITH CHECK(public.nd_admin_v1_can('case-studies','write'));
CREATE POLICY nd_admin_v1_evidence_delete ON public.nd_admin_v1_evidence FOR DELETE TO authenticated USING(public.nd_admin_v1_can('case-studies','delete'));
CREATE INDEX nd_admin_v1_evidence_status_created_idx ON public.nd_admin_v1_evidence(status,created_at DESC);
CREATE INDEX nd_admin_v1_evidence_owner_idx ON public.nd_admin_v1_evidence(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_evidence_slug_idx ON public.nd_admin_v1_evidence(slug);
CREATE TRIGGER nd_admin_v1_evidence_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_evidence FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('case-studies','record');

CREATE TABLE public.nd_admin_v1_approvals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_approvals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_approvals FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_approvals TO authenticated;
GRANT ALL ON public.nd_admin_v1_approvals TO service_role;
CREATE POLICY nd_admin_v1_approvals_read ON public.nd_admin_v1_approvals FOR SELECT TO authenticated USING(public.nd_admin_v1_can('pages','read'));
CREATE POLICY nd_admin_v1_approvals_insert ON public.nd_admin_v1_approvals FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('pages','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_approvals_update ON public.nd_admin_v1_approvals FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('pages','write')) WITH CHECK(public.nd_admin_v1_can('pages','write'));
CREATE POLICY nd_admin_v1_approvals_delete ON public.nd_admin_v1_approvals FOR DELETE TO authenticated USING(public.nd_admin_v1_can('pages','delete'));
CREATE INDEX nd_admin_v1_approvals_status_created_idx ON public.nd_admin_v1_approvals(status,created_at DESC);
CREATE INDEX nd_admin_v1_approvals_owner_idx ON public.nd_admin_v1_approvals(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_approvals_slug_idx ON public.nd_admin_v1_approvals(slug);
CREATE TRIGGER nd_admin_v1_approvals_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_approvals FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('pages','record');

CREATE TABLE public.nd_admin_v1_notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK(length(title) BETWEEN 1 AND 240), slug text, status text NOT NULL DEFAULT 'draft',
 body jsonb NOT NULL DEFAULT '{}' CHECK(jsonb_typeof(body)='object' AND octet_length(body::text)<=524288),
 owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT, created_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(slug IS NULL OR slug ~ '^[a-z0-9][a-z0-9/-]{0,199}$'), CHECK(slug IS NULL OR slug !~ '^(admin|api|assets)(/|$)')
);
ALTER TABLE public.nd_admin_v1_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nd_admin_v1_notifications FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.nd_admin_v1_notifications TO authenticated;
GRANT ALL ON public.nd_admin_v1_notifications TO service_role;
CREATE POLICY nd_admin_v1_notifications_read ON public.nd_admin_v1_notifications FOR SELECT TO authenticated USING(public.nd_admin_v1_can('dashboard','read'));
CREATE POLICY nd_admin_v1_notifications_insert ON public.nd_admin_v1_notifications FOR INSERT TO authenticated WITH CHECK(public.nd_admin_v1_can('dashboard','write') AND created_by=auth.uid());
CREATE POLICY nd_admin_v1_notifications_update ON public.nd_admin_v1_notifications FOR UPDATE TO authenticated USING(public.nd_admin_v1_can('dashboard','write')) WITH CHECK(public.nd_admin_v1_can('dashboard','write'));
CREATE POLICY nd_admin_v1_notifications_delete ON public.nd_admin_v1_notifications FOR DELETE TO authenticated USING(public.nd_admin_v1_can('dashboard','delete'));
CREATE INDEX nd_admin_v1_notifications_status_created_idx ON public.nd_admin_v1_notifications(status,created_at DESC);
CREATE INDEX nd_admin_v1_notifications_owner_idx ON public.nd_admin_v1_notifications(owner_id);
CREATE UNIQUE INDEX nd_admin_v1_notifications_slug_idx ON public.nd_admin_v1_notifications(slug);
CREATE TRIGGER nd_admin_v1_notifications_changes BEFORE INSERT OR UPDATE OR DELETE ON public.nd_admin_v1_notifications FOR EACH ROW EXECUTE FUNCTION public.nd_admin_v1_record_change('dashboard','record');

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
