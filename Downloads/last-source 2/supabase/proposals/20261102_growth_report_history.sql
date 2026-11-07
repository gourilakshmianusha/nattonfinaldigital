BEGIN;
CREATE OR REPLACE FUNCTION public.nd_growth_ingest(p_key text,p_action text,p_payload jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE t public.nd_growth_tools;s public.nd_growth_submissions;r public.nd_growth_reports;v_id uuid;v_hash text:=p_payload->>'visitor_hash';
BEGIN
 IF NOT nd_growth_private.check_key(p_key) THEN RAISE EXCEPTION 'Growth service is not configured'; END IF;
 IF octet_length(p_payload::text)>3500000 THEN RAISE EXCEPTION 'Payload too large'; END IF;
 IF p_action='reserve' THEN
  IF length(v_hash)<>64 OR length(p_payload->>'ip_hash')<>64 THEN RAISE EXCEPTION 'Invalid request ownership'; END IF;
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid;
  IF FOUND THEN IF s.visitor_hash<>v_hash OR s.tool_id<>p_payload->>'tool_id' OR s.inputs IS DISTINCT FROM p_payload->'inputs' THEN RAISE EXCEPTION 'Request identity conflict';END IF;RETURN (to_jsonb(s)-'ip_hash'-'visitor_hash')||jsonb_build_object('already_exists',true); END IF;
  SELECT * INTO t FROM public.nd_growth_tools WHERE id=p_payload->>'tool_id';
  IF NOT FOUND OR NOT t.enabled OR NOT t.visible THEN RAISE EXCEPTION 'This tool is unavailable'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_payload->>'ip_hash',71));
  IF (SELECT count(*) FROM public.nd_growth_submissions WHERE ip_hash=p_payload->>'ip_hash' AND created_at>now()-interval '1 minute')>=10 OR (SELECT count(*) FROM public.nd_growth_submissions WHERE visitor_hash=v_hash AND created_at>now()-interval '1 hour')>=30 THEN RAISE EXCEPTION 'Tool request quota reached. Please try again later';END IF;
  INSERT INTO public.nd_growth_submissions(id,tool_id,method_id,visitor_hash,ip_hash,device,inputs,config_snapshot) SELECT (p_payload->>'id')::uuid,t.id,m.id,v_hash,p_payload->>'ip_hash',p_payload->>'device',p_payload->'inputs',jsonb_build_object('methodologyVersion',t.methodology_version,'config',t.config) FROM public.nd_growth_methods m WHERE m.tool_id=t.id AND m.version=t.methodology_version RETURNING * INTO s;
  IF s.id IS NULL THEN RAISE EXCEPTION 'Methodology version is unavailable';END IF;
  RETURN (to_jsonb(s)-'ip_hash'-'visitor_hash')||jsonb_build_object('already_exists',false);
 ELSIF p_action='complete' OR p_action='fail' THEN
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid FOR UPDATE;
  IF NOT FOUND OR s.visitor_hash<>v_hash OR s.status<>'processing' THEN RAISE EXCEPTION 'Submission cannot be completed';END IF;
  IF p_action='complete' THEN
   UPDATE public.nd_growth_submissions SET status='completed',result=p_payload->'result',completed_at=now() WHERE id=s.id;
   INSERT INTO public.nd_growth_reports(id,submission_id,status,pdf_data) VALUES((p_payload->>'report_id')::uuid,s.id,CASE WHEN p_payload->>'pdf_base64' IS NULL THEN 'failed' ELSE 'ready' END,decode(p_payload->>'pdf_base64','base64'));
  ELSE UPDATE public.nd_growth_submissions SET status='failed',error_code=left(p_payload->>'error_code',100),completed_at=now() WHERE id=s.id;END IF;
  RETURN jsonb_build_object('saved',true);
 ELSIF p_action='report' THEN
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid AND status='completed';
  IF NOT FOUND THEN RAISE EXCEPTION 'Completed submission required';END IF;
  SELECT * INTO r FROM public.nd_growth_reports WHERE submission_id=s.id FOR UPDATE;
  IF NOT FOUND OR r.attempts>=5 THEN RAISE EXCEPTION 'Report retry limit reached';END IF;
  UPDATE public.nd_growth_reports SET status='ready',pdf_data=decode(p_payload->>'pdf_base64','base64'),attempts=attempts+1,updated_at=now() WHERE id=r.id;
  RETURN jsonb_build_object('saved',true);
 ELSIF p_action='report_fail' THEN
  UPDATE public.nd_growth_reports SET attempts=attempts+1,status='failed',updated_at=now() WHERE submission_id=(p_payload->>'id')::uuid AND attempts<5 AND status='failed';
  IF NOT FOUND THEN RAISE EXCEPTION 'Report retry limit reached';END IF;
  RETURN jsonb_build_object('saved',true);
 ELSIF p_action='lead' THEN
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid AND visitor_hash=v_hash AND status='completed';
  IF NOT FOUND OR (p_payload->>'deliveryConsent')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Owned completed result and contact consent required';END IF;
  INSERT INTO public.nd_growth_leads(submission_id,name,email,phone,company,purpose,delivery_consent,marketing_consent) VALUES(s.id,left(p_payload->>'name',120),left(p_payload->>'email',254),left(p_payload->>'phone',40),left(p_payload->>'company',160),left(p_payload->>'purpose',500),true,coalesce((p_payload->>'marketingConsent')::boolean,false)) ON CONFLICT(submission_id) DO NOTHING;
  RETURN jsonb_build_object('saved',true);
 END IF;
 RAISE EXCEPTION 'Unsupported growth operation';
END $$;

CREATE FUNCTION public.nd_growth_report_audit(p_id uuid,p_status text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','write') THEN RAISE EXCEPTION 'Report management permission required';END IF;
 IF p_status NOT IN ('ready','failed') OR NOT EXISTS(SELECT 1 FROM public.nd_growth_reports WHERE id=p_id) THEN RAISE EXCEPTION 'Valid report required';END IF;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),'free-tools',p_id,'report_regeneration',jsonb_build_object('status',p_status));
END $$;
REVOKE ALL ON FUNCTION public.nd_growth_report_audit(uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_growth_report_audit(uuid,text) TO authenticated;

COMMIT;
