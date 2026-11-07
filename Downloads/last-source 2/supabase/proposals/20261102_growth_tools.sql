BEGIN;
CREATE SCHEMA nd_growth_private;
REVOKE ALL ON SCHEMA nd_growth_private FROM PUBLIC,anon,authenticated;
CREATE TABLE nd_growth_private.ingress_keys (id boolean PRIMARY KEY DEFAULT true CHECK(id),key_hash text NOT NULL CHECK(length(key_hash)=64));
ALTER TABLE nd_growth_private.ingress_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON nd_growth_private.ingress_keys FROM PUBLIC,anon,authenticated;
CREATE TABLE public.nd_growth_tools (
 id text PRIMARY KEY,title text NOT NULL,description text NOT NULL,category text NOT NULL,
 enabled boolean NOT NULL DEFAULT true,visible boolean NOT NULL DEFAULT true,display_order integer NOT NULL,
 config jsonb NOT NULL DEFAULT '{}',revision integer NOT NULL DEFAULT 1,methodology_version text NOT NULL DEFAULT '1.0.0',updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.nd_growth_methods(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),tool_id text NOT NULL REFERENCES public.nd_growth_tools(id) ON DELETE RESTRICT,version text NOT NULL,snapshot jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(tool_id,version));
CREATE TABLE public.nd_growth_submissions (
 id uuid PRIMARY KEY,tool_id text NOT NULL REFERENCES public.nd_growth_tools(id) ON DELETE RESTRICT,
 method_id uuid NOT NULL REFERENCES public.nd_growth_methods(id) ON DELETE RESTRICT,
 visitor_hash text NOT NULL,ip_hash text NOT NULL,device text NOT NULL CHECK(device IN ('mobile','tablet','desktop','unknown')),
 inputs jsonb NOT NULL CHECK(jsonb_typeof(inputs)='object' AND octet_length(inputs::text)<=65536),config_snapshot jsonb NOT NULL,
 status text NOT NULL DEFAULT 'processing' CHECK(status IN ('processing','completed','failed')),result jsonb,error_code text,
 created_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz
);
CREATE INDEX nd_growth_submissions_tool_date_idx ON public.nd_growth_submissions(tool_id,created_at DESC,id);
CREATE INDEX nd_growth_submissions_method_idx ON public.nd_growth_submissions(method_id);
CREATE INDEX nd_growth_submissions_visitor_idx ON public.nd_growth_submissions(visitor_hash,created_at DESC);
CREATE INDEX nd_growth_submissions_ip_idx ON public.nd_growth_submissions(ip_hash,created_at DESC);
CREATE INDEX nd_growth_submissions_date_idx ON public.nd_growth_submissions(created_at DESC,id);
CREATE TABLE public.nd_growth_reports(id uuid PRIMARY KEY,submission_id uuid NOT NULL UNIQUE REFERENCES public.nd_growth_submissions(id) ON DELETE RESTRICT,status text NOT NULL CHECK(status IN ('ready','failed')),pdf_data bytea CHECK(octet_length(pdf_data)<=2000000),attempts integer NOT NULL DEFAULT 1,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.nd_growth_leads(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),submission_id uuid NOT NULL UNIQUE REFERENCES public.nd_growth_submissions(id) ON DELETE RESTRICT,name text NOT NULL,email text NOT NULL,phone text NOT NULL DEFAULT '',company text NOT NULL DEFAULT '',purpose text NOT NULL,delivery_consent boolean NOT NULL CHECK(delivery_consent),marketing_consent boolean NOT NULL DEFAULT false,consented_at timestamptz NOT NULL DEFAULT now(),status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','closed')),internal_note text NOT NULL DEFAULT '',owner_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,revision integer NOT NULL DEFAULT 1,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX nd_growth_leads_owner_idx ON public.nd_growth_leads(owner_id);
CREATE INDEX nd_growth_leads_date_idx ON public.nd_growth_leads(created_at DESC,id);
CREATE TABLE public.nd_growth_integration_checks(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),provider text NOT NULL,status text NOT NULL CHECK(status IN ('connected','error','not_connected','needs_configuration')),message text NOT NULL,actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX nd_growth_checks_provider_idx ON public.nd_growth_integration_checks(provider,created_at DESC);
CREATE INDEX nd_growth_checks_actor_idx ON public.nd_growth_integration_checks(actor_id);
DO $$DECLARE t text;BEGIN FOREACH t IN ARRAY ARRAY['tools','methods','submissions','reports','leads','integration_checks'] LOOP
 EXECUTE format('ALTER TABLE public.nd_growth_%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('REVOKE ALL ON public.nd_growth_%I FROM PUBLIC,anon,authenticated',t);
 EXECUTE format('GRANT SELECT ON public.nd_growth_%I TO authenticated',t);
 EXECUTE format('GRANT ALL ON public.nd_growth_%I TO service_role',t);
 EXECUTE format('CREATE POLICY nd_growth_%I_read ON public.nd_growth_%I FOR SELECT TO authenticated USING (public.nd_admin_v1_can(''free-tools'',''read'') %s)',t,t,CASE WHEN t='leads' THEN 'AND public.nd_admin_v1_can(''leads'',''read'')' ELSE '' END);
 END LOOP;END $$;
CREATE FUNCTION public.nd_growth_catalog() RETURNS SETOF public.nd_growth_tools LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT id,title,description,category,enabled,visible,display_order,config-'emailTemplate',revision,methodology_version,updated_at FROM public.nd_growth_tools WHERE visible ORDER BY display_order,id;
$$;
CREATE FUNCTION nd_growth_private.check_key(p_key text) RETURNS boolean LANGUAGE sql STABLE SET search_path=pg_catalog AS $$
 SELECT EXISTS(SELECT 1 FROM nd_growth_private.ingress_keys WHERE key_hash=encode(sha256(convert_to(p_key,'UTF8')),'hex'));
$$;
CREATE FUNCTION public.nd_growth_ingest(p_key text,p_action text,p_payload jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE t public.nd_growth_tools;s public.nd_growth_submissions;r public.nd_growth_reports;v_id uuid;v_hash text:=p_payload->>'visitor_hash';
BEGIN
 IF NOT nd_growth_private.check_key(p_key) THEN RAISE EXCEPTION 'Growth service is not configured'; END IF;
 IF octet_length(p_payload::text)>3500000 THEN RAISE EXCEPTION 'Payload too large'; END IF;
 IF p_action='reserve' THEN
  IF length(v_hash)<>64 OR length(p_payload->>'ip_hash')<>64 THEN RAISE EXCEPTION 'Invalid request ownership'; END IF;
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid;
  IF FOUND THEN IF s.visitor_hash<>v_hash OR s.tool_id<>p_payload->>'tool_id' THEN RAISE EXCEPTION 'Request identity conflict';END IF;RETURN to_jsonb(s)-'ip_hash'-'visitor_hash'; END IF;
  SELECT * INTO t FROM public.nd_growth_tools WHERE id=p_payload->>'tool_id';
  IF NOT FOUND OR NOT t.enabled OR NOT t.visible THEN RAISE EXCEPTION 'This tool is unavailable'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_payload->>'ip_hash',71));
  IF (SELECT count(*) FROM public.nd_growth_submissions WHERE ip_hash=p_payload->>'ip_hash' AND created_at>now()-interval '1 minute')>=10 OR (SELECT count(*) FROM public.nd_growth_submissions WHERE visitor_hash=v_hash AND created_at>now()-interval '1 hour')>=30 THEN RAISE EXCEPTION 'Tool request quota reached. Please try again later';END IF;
  INSERT INTO public.nd_growth_submissions(id,tool_id,method_id,visitor_hash,ip_hash,device,inputs,config_snapshot) SELECT (p_payload->>'id')::uuid,t.id,m.id,v_hash,p_payload->>'ip_hash',p_payload->>'device',p_payload->'inputs',jsonb_build_object('methodologyVersion',t.methodology_version,'config',t.config) FROM public.nd_growth_methods m WHERE m.tool_id=t.id AND m.version=t.methodology_version RETURNING * INTO s;
  IF s.id IS NULL THEN RAISE EXCEPTION 'Methodology version is unavailable';END IF;
  RETURN to_jsonb(s)-'ip_hash'-'visitor_hash';
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
 ELSIF p_action='lead' THEN
  SELECT * INTO s FROM public.nd_growth_submissions WHERE id=(p_payload->>'id')::uuid AND visitor_hash=v_hash AND status='completed';
  IF NOT FOUND OR (p_payload->>'deliveryConsent')::boolean IS DISTINCT FROM true THEN RAISE EXCEPTION 'Owned completed result and contact consent required';END IF;
  INSERT INTO public.nd_growth_leads(submission_id,name,email,phone,company,purpose,delivery_consent,marketing_consent) VALUES(s.id,left(p_payload->>'name',120),left(p_payload->>'email',254),left(p_payload->>'phone',40),left(p_payload->>'company',160),left(p_payload->>'purpose',500),true,coalesce((p_payload->>'marketingConsent')::boolean,false)) ON CONFLICT(submission_id) DO NOTHING;
  RETURN jsonb_build_object('saved',true);
 END IF;
 RAISE EXCEPTION 'Unsupported growth operation';
END $$;
CREATE FUNCTION public.nd_growth_owned_result(p_key text,p_id uuid,p_visitor_hash text) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE s public.nd_growth_submissions; r public.nd_growth_reports;
BEGIN
 IF NOT nd_growth_private.check_key(p_key) THEN RAISE EXCEPTION 'Growth service is not configured';END IF;
 SELECT * INTO s FROM public.nd_growth_submissions WHERE id=p_id AND visitor_hash=p_visitor_hash;
 IF NOT FOUND THEN RETURN NULL;END IF;
 SELECT * INTO r FROM public.nd_growth_reports WHERE submission_id=s.id;
 RETURN jsonb_build_object('submission',to_jsonb(s)-'ip_hash'-'visitor_hash','report',CASE WHEN r.id IS NULL THEN NULL ELSE jsonb_build_object('id',r.id,'status',r.status,'pdf_base64',encode(r.pdf_data,'base64')) END);
END $$;
CREATE FUNCTION public.nd_growth_update_tool(p_id text,p_revision integer,p_values jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE t public.nd_growth_tools; version text;next_config jsonb;
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','write') THEN RAISE EXCEPTION 'Tool configuration permission required';END IF;
 SELECT * INTO t FROM public.nd_growth_tools WHERE id=p_id AND revision=p_revision FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Tool changed. Reload before saving';END IF;
 IF p_values ? 'id' OR p_values ? 'formula' OR octet_length(p_values::text)>65536 THEN RAISE EXCEPTION 'System implementation cannot be edited';END IF;
 next_config:=p_values->'config';version:=t.methodology_version;
 IF next_config->'weights' IS DISTINCT FROM t.config->'weights' THEN version:='1.0.0-r'||(t.revision+1)::text;END IF;
 IF length(p_values->>'title') NOT BETWEEN 3 AND 120 OR length(p_values->>'description') NOT BETWEEN 10 AND 600 OR jsonb_typeof(next_config)<>'object' THEN RAISE EXCEPTION 'Invalid tool configuration';END IF;
 UPDATE public.nd_growth_tools SET title=p_values->>'title',description=p_values->>'description',category=p_values->>'category',enabled=(p_values->>'enabled')::boolean,visible=(p_values->>'visible')::boolean,display_order=(p_values->>'display_order')::integer,config=next_config,revision=revision+1,methodology_version=version,updated_at=now() WHERE id=t.id;
 INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES(t.id,version,jsonb_build_object('weights',next_config->'weights','implementation','Code-owned deterministic or observed adapter; not executable configuration')) ON CONFLICT(tool_id,version) DO NOTHING;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,action,details) VALUES(auth.uid(),'free-tools','tool_configuration',jsonb_build_object('tool_id',t.id,'revision',t.revision+1,'before',to_jsonb(t)-'config','after',p_values-'config'));
END $$;
CREATE FUNCTION public.nd_growth_update_lead(p_id uuid,p_revision integer,p_status text,p_note text,p_owner uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','read') OR NOT public.nd_admin_v1_can('leads','write') THEN RAISE EXCEPTION 'Lead management permission required';END IF;
 IF p_status NOT IN ('new','contacted','qualified','closed') OR length(p_note)>4000 THEN RAISE EXCEPTION 'Invalid lead update';END IF;
 UPDATE public.nd_growth_leads SET status=p_status,internal_note=p_note,owner_id=p_owner,revision=revision+1 WHERE id=p_id AND revision=p_revision;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lead changed. Reload before saving';END IF;
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,entity_id,action,details) VALUES(auth.uid(),'free-tools',p_id,'lead_update',jsonb_build_object('status',p_status,'owner_id',p_owner));
END $$;
CREATE FUNCTION public.nd_growth_record_check(p_provider text,p_status text,p_message text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','write') THEN RAISE EXCEPTION 'Tool integration permission required';END IF;
 INSERT INTO public.nd_growth_integration_checks(provider,status,message,actor_id) VALUES(p_provider,p_status,left(p_message,600),auth.uid());
 INSERT INTO public.nd_admin_v1_audit_events(actor_id,module,action,details) VALUES(auth.uid(),'free-tools','integration_test',jsonb_build_object('provider',p_provider,'status',p_status));
END $$;
REVOKE ALL ON FUNCTION public.nd_growth_catalog(),public.nd_growth_ingest(text,text,jsonb),public.nd_growth_owned_result(text,uuid,text),public.nd_growth_update_tool(text,integer,jsonb),public.nd_growth_update_lead(uuid,integer,text,text,uuid),public.nd_growth_record_check(text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_growth_catalog(),public.nd_growth_ingest(text,text,jsonb),public.nd_growth_owned_result(text,uuid,text) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_growth_update_tool(text,integer,jsonb),public.nd_growth_update_lead(uuid,integer,text,text,uuid),public.nd_growth_record_check(text,text,text) TO authenticated;

INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('ai_readiness','AI Readiness Assessment','Understand your data, processes, skills, governance and practical AI opportunities.','AI & Automation',1,'{"intro":"Understand your data, processes, skills, governance and practical AI opportunities.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"sparkles","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","industry":"","staff":1,"existingTools":"","businessGoals":"","data_quality":"unanswered","data_access":"unanswered","process_documented":"unanswered","automation_adoption":"unanswered","team_skills":"unanswered","training":"unanswered","privacy":"unanswered","accountability":"unanswered","goals":"unanswered","measurement":"unanswered"},"reportBrand":"Natton Digital","emailTemplate":"","weights":{"Data":20,"Process":20,"Skills":20,"Governance":20,"Use Cases":20}}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('ai_readiness','1.0.0','{"weights":{"Data":20,"Process":20,"Skills":20,"Governance":20,"Use Cases":20},"kind":"self_reported_estimate","implementation":"code-owned ai_readiness"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('website_grader','Website Grader','Measure a public page with Google Lighthouse laboratory diagnostics.','Website & SEO',2,'{"intro":"Measure a public page with Google Lighthouse laboratory diagnostics.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"globe","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","url":"https://example.com","device":"mobile","language":"en"},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('website_grader','1.0.0','{"weights":null,"kind":"api_observed","implementation":"code-owned website_grader"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('seo_aeo_audit','SEO + AEO Audit','Inspect on-page evidence and answer-oriented content structure.','Website & SEO',3,'{"intro":"Inspect on-page evidence and answer-oriented content structure.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"globe","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","url":"https://example.com","phrase":"","locale":"India","crawlLimit":1},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('seo_aeo_audit','1.0.0','{"weights":null,"kind":"site_heuristic","implementation":"code-owned seo_aeo_audit"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('crm_score','CRM Maturity Score','Assess the practices behind a healthier sales pipeline.','CRM & Sales',4,'{"intro":"Assess the practices behind a healthier sales pipeline.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","crmProvider":"","leads":100,"teamSize":1,"assignment":"unanswered","followup":"unanswered","pipeline":"unanswered","completeness":"unanswered","automation":"unanswered","reporting":"unanswered"},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('crm_score','1.0.0','{"weights":null,"kind":"self_reported_estimate","implementation":"code-owned crm_score"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('roi_calculator','Business ROI Calculator','Compare contribution, costs and cash flow across three editable scenarios.','Financial Planning',5,'{"intro":"Compare contribution, costs and cash flow across three editable scenarios.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","leads":100,"conversion":5,"targetConversion":6,"saleValue":10000,"margin":40,"laborSavings":0,"operatingCosts":1000,"setupCost":5000,"leadChange":0,"pessimisticChange":-1,"optimisticChange":1},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('roi_calculator','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned roi_calculator"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('whatsapp_roi','WhatsApp Automation ROI','Model messaging costs and contribution using your own conversion assumptions.','Marketing Growth',6,'{"intro":"Model messaging costs and contribution using your own conversion assumptions.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","leads":500,"conversion":3,"targetConversion":4,"saleValue":2000,"margin":35,"messages":1500,"messageCost":0.5,"platformCost":1000,"oversightCost":500,"setupCost":3000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('whatsapp_roi','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned whatsapp_roi"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('ai_agent_cost','AI Agent Cost Calculator','Compare manual and hybrid task costs over one, three and five years.','AI & Automation',7,'{"intro":"Compare manual and hybrid task costs over one, three and five years.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","tasks":100,"cycles":20,"minutes":5,"hourlyCost":500,"success":80,"reviewMinutes":1,"modelCost":0.5,"softwareCost":2000,"infrastructureCost":1000,"maintenanceCost":1000,"setupCost":15000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('ai_agent_cost','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned ai_agent_cost"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('lead_value','Lead Value Calculator','Find contribution per lead and acquisition break-even without invented LTV multipliers.','CRM & Sales',8,'{"intro":"Find contribution per lead and acquisition break-even without invented LTV multipliers.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","leads":500,"conversion":5,"saleValue":2000,"margin":40,"refund":0,"acquisitionCost":5000,"repeatOrders":0,"retention":0},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('lead_value','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned lead_value"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('marketing_budget','Marketing Budget Calculator','Allocate your budget and forecast only where you have historical channel data.','Marketing Growth',9,'{"intro":"Allocate your budget and forecast only where you have historical channel data.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","revenue":100000,"budget":10000,"budgetCap":10000,"objective":"Generate qualified enquiries","desiredLeads":0,"channels":[{"name":"SEO","weight":25,"cpl":null,"conversion":null,"contribution":null},{"name":"Paid Search","weight":25,"cpl":null,"conversion":null,"contribution":null},{"name":"Social Media","weight":20,"cpl":null,"conversion":null,"contribution":null},{"name":"Email","weight":10,"cpl":null,"conversion":null,"contribution":null},{"name":"CRM/Automation","weight":10,"cpl":null,"conversion":null,"contribution":null},{"name":"Other","weight":10,"cpl":null,"conversion":null,"contribution":null}]},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('marketing_budget','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned marketing_budget"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('revenue_growth','Revenue Growth','Compare deal contribution at current and target close rates.','Financial Planning',10,'{"intro":"Compare deal contribution at current and target close rates.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","leads":100,"conversion":5,"targetConversion":6,"saleValue":10000,"margin":40,"setupCost":5000,"acquisitionCost":5000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('revenue_growth','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned revenue_growth"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('marketing_roi','Marketing ROI','Separate return on ad spend from margin-based marketing return.','Marketing Growth',11,'{"intro":"Separate return on ad spend from margin-based marketing return.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","spend":10000,"leads":200,"sales":10,"saleValue":2000,"margin":40},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('marketing_roi','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned marketing_roi"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('automation_savings','Automation Savings','Estimate recovered task hours after human review and operating costs.','AI & Automation',12,'{"intro":"Estimate recovered task hours after human review and operating costs.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","employees":5,"hoursPerWeek":10,"hourlyCost":500,"automation":50,"review":20,"softwareCost":2000,"maintenanceCost":1000,"setupCost":10000,"repetitive":70},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('automation_savings','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned automation_savings"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('ai_employee_savings','AI Employee Savings','Compare eligible task labour with a reviewed AI-assisted workflow.','AI & Automation',13,'{"intro":"Compare eligible task labour with a reviewed AI-assisted workflow.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","employees":5,"hoursPerWeek":10,"hourlyCost":500,"automation":50,"review":20,"softwareCost":2000,"maintenanceCost":1000,"setupCost":10000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('ai_employee_savings','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned ai_employee_savings"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('ai_calling_roi','AI Calling ROI','Model calling outcomes and costs without claiming calls have occurred.','CRM & Sales',14,'{"intro":"Model calling outcomes and costs without claiming calls have occurred.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","calls":1000,"contact":40,"booking":10,"showup":70,"close":20,"contribution":5000,"manualCost":20,"telephonyCost":2,"aiCost":5,"oversightCost":1000,"setupCost":5000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('ai_calling_roi','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned ai_calling_roi"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('sales_productivity','Sales Rep Productivity','Value recovered selling time using your activity and opportunity assumptions.','CRM & Sales',15,'{"intro":"Value recovered selling time using your activity and opportunity assumptions.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","reps":5,"adminHours":10,"reduction":30,"redeployed":50,"hourlyCost":500,"activities":5,"qualified":10,"close":20,"saleValue":10000,"margin":40,"softwareCost":2000,"setupCost":5000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('sales_productivity','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned sales_productivity"}'::jsonb);
INSERT INTO public.nd_growth_tools(id,title,description,category,display_order,config) VALUES('support_savings','Customer Support Savings','Model ticket containment, escalations and quality review costs.','AI & Automation',16,'{"intro":"Model ticket containment, escalations and quality review costs.","helperText":"Illustrative defaults: replace these values with your own business assumptions. Monthly values unless the field says otherwise.","icon":"calculator","currencies":["INR","USD","EUR","GBP","AUD","CAD","AED","SGD"],"defaults":{"currency":"INR","tickets":1000,"minutes":10,"hourlyCost":500,"coverage":60,"resolution":70,"escalation":10,"reviewMinutes":1,"softwareCost":3000,"setupCost":5000},"reportBrand":"Natton Digital","emailTemplate":""}'::jsonb);
INSERT INTO public.nd_growth_methods(tool_id,version,snapshot) VALUES('support_savings','1.0.0','{"weights":null,"kind":"financial_scenario","implementation":"code-owned support_savings"}'::jsonb);
COMMIT;
