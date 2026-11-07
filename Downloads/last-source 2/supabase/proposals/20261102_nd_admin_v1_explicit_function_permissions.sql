-- Applied only to new project rrukretdwracijqvkopp after additive schema installation.
-- Supabase default privileges include explicit anon grants beyond PUBLIC.
REVOKE ALL ON FUNCTION public.nd_admin_v1_can(text,text) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_record_change() FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_booking_guard() FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_assign_membership(uuid,text,boolean) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_published(text,text) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_note_export(text,integer,jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_import_leads(jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_retry_job(uuid,integer) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_sync_snapshots(uuid,integer,text,jsonb,jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_workspace_brand() FROM anon;
REVOKE ALL ON FUNCTION public.nd_admin_v1_record_change(),public.nd_admin_v1_booking_guard() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.nd_admin_v1_published(text,text) TO anon;
