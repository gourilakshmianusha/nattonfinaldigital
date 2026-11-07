BEGIN;
CREATE OR REPLACE FUNCTION public.nd_growth_update_tool(p_id text,p_revision integer,p_values jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE t public.nd_growth_tools; v_version text;next_config jsonb;
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','write') THEN RAISE EXCEPTION 'Tool configuration permission required';END IF;
 SELECT * INTO t FROM public.nd_growth_tools WHERE id=p_id AND revision=p_revision FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Tool changed. Reload before saving';END IF;
 IF p_values ? 'id' OR p_values ? 'formula' OR octet_length(p_values::text)>65536 THEN RAISE EXCEPTION 'System implementation cannot be edited';END IF;
 next_config:=p_values->'config';v_version:=t.methodology_version;
 IF next_config->'weights' IS DISTINCT FROM t.config->'weights' THEN v_version:='1.0.0-r'||(t.revision+1)::text;END IF;
 IF length(p_values->>'title') NOT BETWEEN 3 AND 120 OR length(p_values->>'description') NOT BETWEEN 10 AND 600 OR jsonb_typeof(next_config)<>'object' THEN RAISE EXCEPTION 'Invalid tool configuration';END IF;
 UPDATE public.nd_growth_tools SET title=p_values->>'title',description=p_values->>'description',category=p_values->>'category',enabled=(p_values->>'enabled')::boolean,visible=(p_values->>'visible')::boolean,display_order=(p_values->>'display_order')::integer,config=next_config,revision=revision+1,methodology_version=v_version,updated_at=now() WHERE id=t.id;
 INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES(t.id,v_version,jsonb_build_object('weights',next_config->'weights','implementation','Code-owned deterministic or observed adapter; not executable configuration')) ON CONFLICT(tool_id,version) DO NOTHING;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,action,details) VALUES(auth.uid(),'free-tools','tool_configuration',jsonb_build_object('tool_id',t.id,'revision',t.revision+1,'before',to_jsonb(t)-'config','after',p_values-'config'));
END $$;
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
  INSERT INTO public.nd_growth_submissions(id,tool_id,method_id,visitor_hash,ip_hash,device,inputs,config_snapshot) SELECT (p_payload->>'id')::uuid,t.id,m.id,v_hash,p_payload->>'ip_hash',p_payload->>'device',p_payload->'inputs',jsonb_build_object('methodologyVersion',t.methodology_version,'config',t.config,'toolTitle',t.title) FROM public.nd_growth_methods m WHERE m.tool_id=t.id AND m.version=t.methodology_version RETURNING * INTO s;
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


COMMIT;
