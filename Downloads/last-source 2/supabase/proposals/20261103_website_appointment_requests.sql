BEGIN;
CREATE TABLE nd_growth_private.appointment_requests (
 request_id uuid PRIMARY KEY,appointment_id uuid NOT NULL UNIQUE REFERENCES public.nd_admin_v1_appointments(id) ON DELETE RESTRICT,
 ip_hash text,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX nd_growth_requests_ip_date_idx ON nd_growth_private.appointment_requests(ip_hash,created_at);
ALTER TABLE nd_growth_private.appointment_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON nd_growth_private.appointment_requests FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.nd_admin_v1_booking_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog AS $$
DECLARE v_start timestamptz; v_end timestamptz; v_buffer interval;
BEGIN
 IF NEW.status='requested' THEN
  IF coalesce(NEW.body->>'starts_at','')<>'' OR coalesce(NEW.body->>'ends_at','')<>'' THEN RAISE EXCEPTION 'Unscheduled requests cannot reserve a time. Choose a scheduled status with an owner and valid interval';END IF;
  RETURN NEW;
 END IF;
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

CREATE FUNCTION nd_growth_private.save_appointment_request(p_request uuid,p_payload jsonb,p_ip_hash text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_id uuid;v_original jsonb;v_body jsonb;
BEGIN
 IF p_request IS NULL OR jsonb_typeof(p_payload)<>'object' OR octet_length(p_payload::text)>150000 OR length(btrim(p_payload->>'name')) NOT BETWEEN 1 AND 120 OR coalesce(p_payload->>'email','')!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR (p_payload->>'consent')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Valid contact details and explicit contact consent are required';END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_request::text,82));
 SELECT a.id,a.body->'request_snapshot' INTO v_id,v_original FROM nd_growth_private.appointment_requests r JOIN public.nd_admin_v1_appointments a ON a.id=r.appointment_id WHERE r.request_id=p_request;
 IF v_id IS NOT NULL THEN IF v_original IS DISTINCT FROM p_payload THEN RAISE EXCEPTION 'This request ID was already saved with different details';END IF;RETURN v_id;END IF;
 IF p_ip_hash IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_ip_hash,83));
  IF (SELECT count(*) FROM nd_growth_private.appointment_requests WHERE ip_hash=p_ip_hash AND created_at>now()-interval '1 hour')>=10 THEN RAISE EXCEPTION 'Contact request limit reached. Please try again later';END IF;
 END IF;
 v_body:=jsonb_build_object('email',p_payload->>'email','phone',coalesce(p_payload->>'phone',''),'company',coalesce(p_payload->>'company',''),'service',coalesce(p_payload->>'service',''),'solution',coalesce(p_payload->>'solution',''),'industry',coalesce(p_payload->>'industry',''),'notes',coalesce(p_payload->>'message',''),'source',p_payload->>'source','consent_at',now(),'marketing_consent',coalesce((p_payload->>'marketingConsent')::boolean,false),'timezone','Asia/Kolkata','request_snapshot',p_payload);
 INSERT INTO public.nd_admin_v1_appointments(title,slug,status,body) VALUES(btrim(p_payload->>'name'),'request/'||p_request::text,'requested',v_body) RETURNING id INTO v_id;
 INSERT INTO nd_growth_private.appointment_requests(request_id,appointment_id,ip_hash) VALUES(p_request,v_id,p_ip_hash);
 RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION nd_growth_private.save_appointment_request(uuid,jsonb,text) FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.nd_growth_contact_request(p_key text,p_request uuid,p_payload jsonb,p_ip_hash text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE v_id uuid;
BEGIN
 IF NOT nd_growth_private.check_key(p_key) THEN RAISE EXCEPTION 'Growth service is not configured';END IF;
 IF p_payload->>'source' NOT IN ('contact_page','book_demo','website_enquiry') OR length(p_ip_hash)<>64 THEN RAISE EXCEPTION 'Invalid form source';END IF;
 v_id:=nd_growth_private.save_appointment_request(p_request,p_payload,p_ip_hash);
 RETURN jsonb_build_object('id',v_id,'status','requested');
END $$;
REVOKE ALL ON FUNCTION public.nd_growth_contact_request(text,uuid,jsonb,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_growth_contact_request(text,uuid,jsonb,text) TO anon,authenticated;
CREATE OR REPLACE FUNCTION public.nd_growth_ingest(p_key text,p_action text,p_payload jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE t public.nd_growth_tools;s public.nd_growth_submissions;r public.nd_growth_reports;v_id uuid;v_hash text:=p_payload->>'visitor_hash';
BEGIN
 IF NOT nd_growth_private.check_key(p_key) THEN RAISE EXCEPTION 'Growth service is not configured'; END IF;
 IF octet_length(p_payload::text)>3500000 THEN RAISE EXCEPTION 'Payload too large'; END IF;
 IF p_action='reserve' THEN
  IF length(v_hash)<>64 OR length(p_payload->>'ip_hash')<>64 THEN RAISE EXCEPTION 'Invalid request ownership'; END IF;
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid;
  IF FOUND THEN IF s.status='processing' AND s.created_at<now()-interval '5 minutes' THEN UPDATE public.nd_growth_submissions SET status='failed',error_code='interrupted_request',completed_at=now() WHERE id=s.id RETURNING * INTO s;END IF; IF s.visitor_hash<>v_hash OR s.tool_id<>p_payload->>'tool_id' OR s.inputs IS DISTINCT FROM p_payload->'inputs' THEN RAISE EXCEPTION 'Request identity conflict';END IF;RETURN (to_jsonb(s)-'ip_hash'-'visitor_hash')||jsonb_build_object('already_exists',true); END IF;
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
  SELECT id INTO v_id FROM public.nd_growth_leads WHERE submission_id=s.id;
  PERFORM nd_growth_private.save_appointment_request(s.id,jsonb_build_object('name',p_payload->>'name','email',p_payload->>'email','phone',coalesce(p_payload->>'phone',''),'company',coalesce(p_payload->>'company',''),'message',p_payload->>'purpose','service',coalesce(s.config_snapshot->>'toolTitle',s.tool_id),'source',CASE WHEN s.tool_id='ai_readiness' THEN 'ai_readiness' ELSE 'growth_tool' END,'consent',true,'marketingConsent',coalesce((p_payload->>'marketingConsent')::boolean,false),'tool_submission_id',s.id,'tool_id',s.tool_id,'tool_inputs',s.inputs,'tool_result_metrics',s.result->'metrics','methodology_version',s.config_snapshot->>'methodologyVersion'),NULL);
  RETURN jsonb_build_object('saved',true,'id',v_id);
 END IF;
 RAISE EXCEPTION 'Unsupported growth operation';
END $$;




COMMIT;
