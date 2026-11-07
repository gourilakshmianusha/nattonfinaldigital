-- Rollback-only regression check. No fixture submission, lead, report or configuration survives.
BEGIN;
DO $$
DECLARE
 v_key text:='rollback-only-not-a-live-secret';v_request uuid:=gen_random_uuid();v_visitor text:=repeat('a',64);v_payload jsonb;v_reserved jsonb;v_duplicate jsonb;v_owned jsonb;v_tool public.nd_growth_tools;v_admin uuid;v_stats jsonb;v_n integer;
BEGIN
 SELECT user_id INTO v_admin FROM public.nd_admin_v1_memberships WHERE role_id='super_admin' AND active LIMIT 1;
 IF v_admin IS NULL THEN RAISE EXCEPTION 'Existing authorised admin required';END IF;
 UPDATE nd_growth_private.ingress_keys SET key_hash=encode(sha256(convert_to(v_key,'UTF8')),'hex');
 IF has_table_privilege('anon','public.nd_growth_submissions','SELECT') OR has_table_privilege('authenticated','public.nd_growth_submissions','INSERT') OR has_table_privilege('anon','public.nd_growth_reports','SELECT') OR has_table_privilege('authenticated','public.nd_growth_tools','UPDATE') THEN RAISE EXCEPTION 'Unexpected direct access';END IF;
 IF has_function_privilege('anon','public.nd_growth_update_tool(text,integer,jsonb)','EXECUTE') OR has_schema_privilege('anon','nd_growth_private','USAGE') THEN RAISE EXCEPTION 'Unexpected secret/configuration privileges';END IF;
 IF (SELECT count(*) FROM public.nd_growth_catalog())<>16 THEN RAISE EXCEPTION 'Incomplete registry';END IF;
 IF EXISTS(SELECT 1 FROM public.nd_growth_catalog() WHERE config ? 'emailTemplate') THEN RAISE EXCEPTION 'Internal template leaked';END IF;
 BEGIN PERFORM public.nd_growth_ingest('wrong-key','reserve','{}');RAISE EXCEPTION 'TEST FAILED: invalid key accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Growth service is not configured' THEN RAISE;END IF;END;
 v_payload:=jsonb_build_object('id',v_request,'tool_id','lead_value','visitor_hash',v_visitor,'ip_hash',repeat('b',64),'device','unknown','inputs',jsonb_build_object('currency','INR','leads',100));
 v_reserved:=public.nd_growth_ingest(v_key,'reserve',v_payload);
 IF v_reserved->>'status'<>'processing' OR (v_reserved->>'already_exists')::boolean THEN RAISE EXCEPTION 'New reservation failed';END IF;
 v_duplicate:=public.nd_growth_ingest(v_key,'reserve',v_payload);
 IF NOT (v_duplicate->>'already_exists')::boolean THEN RAISE EXCEPTION 'Idempotency failed';END IF;
 BEGIN PERFORM public.nd_growth_ingest(v_key,'reserve',jsonb_set(v_payload,'{visitor_hash}',to_jsonb(repeat('c',64))));RAISE EXCEPTION 'TEST FAILED: ownership conflict accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Request identity conflict' THEN RAISE;END IF;END;
 BEGIN PERFORM public.nd_growth_ingest(v_key,'reserve',jsonb_set(v_payload,'{inputs}',jsonb_build_object('currency','USD','leads',500)));RAISE EXCEPTION 'TEST FAILED: changed input accepted for same request';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Request identity conflict' THEN RAISE;END IF;END;
 PERFORM public.nd_growth_ingest(v_key,'complete',jsonb_build_object('id',v_request,'visitor_hash',v_visitor,'result',jsonb_build_object('method','financial_scenario','methodologyVersion','1.0.0','metrics','[]'::jsonb),'report_id',v_request,'pdf_base64',encode(convert_to('%PDF-1.4 rollback fixture','UTF8'),'base64')));
 v_owned:=public.nd_growth_owned_result(v_key,v_request,v_visitor);
 IF v_owned->'submission'->>'status'<>'completed' OR v_owned->'report'->>'status'<>'ready' THEN RAISE EXCEPTION 'Persistence failed';END IF;
 IF public.nd_growth_owned_result(v_key,v_request,repeat('c',64)) IS NOT NULL THEN RAISE EXCEPTION 'Private report leaked';END IF;
 BEGIN PERFORM public.nd_growth_ingest(v_key,'lead',jsonb_build_object('id',v_request,'visitor_hash',v_visitor,'deliveryConsent',false));RAISE EXCEPTION 'TEST FAILED: contact without consent accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Owned completed result and contact consent required' THEN RAISE;END IF;END;
 PERFORM public.nd_growth_ingest(v_key,'lead',jsonb_build_object('id',v_request,'visitor_hash',v_visitor,'deliveryConsent',true,'marketingConsent',false,'name','Rollback test only','email','rollback@example.invalid','phone','','company','Rollback fixture','purpose','Rollback-only consent test'));
 IF NOT EXISTS(SELECT 1 FROM public.nd_growth_leads WHERE submission_id=v_request AND delivery_consent AND NOT marketing_consent) THEN RAISE EXCEPTION 'Consent separation lost';END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_admin,'role','authenticated')::text,true);
 SELECT * INTO v_tool FROM public.nd_growth_tools WHERE id='ai_readiness';
 PERFORM public.nd_growth_update_tool(v_tool.id,v_tool.revision,jsonb_build_object('title',v_tool.title,'description',v_tool.description,'category',v_tool.category,'enabled',false,'visible',true,'display_order',v_tool.display_order,'config',jsonb_set(v_tool.config,'{weights}',jsonb_build_object('Data',30,'Process',20,'Skills',20,'Governance',20,'Use Cases',10))));
 IF (SELECT enabled FROM public.nd_growth_catalog() WHERE id='ai_readiness') THEN RAISE EXCEPTION 'Disable did not reach public catalogue';END IF;
 IF (SELECT methodology_version FROM public.nd_growth_tools WHERE id='ai_readiness')=v_tool.methodology_version THEN RAISE EXCEPTION 'Rubric version not changed';END IF;
 IF NOT EXISTS(SELECT 1 FROM public.nd_growth_methods WHERE tool_id='ai_readiness' AND version=v_tool.methodology_version) THEN RAISE EXCEPTION 'Prior methodology lost';END IF;
 IF (SELECT count(*) FROM public.nd_growth_submissions WHERE id=v_request)<>1 THEN RAISE EXCEPTION 'Disable changed submission history';END IF;
 v_stats:=public.nd_growth_stats(now()-interval '1 day',now()+interval '1 second','lead_value');
 IF (v_stats->>'successful')::integer<1 OR (v_stats->>'reports')::integer<1 THEN RAISE EXCEPTION 'Stored analytics failed';END IF;
 FOR v_n IN 1..9 LOOP PERFORM public.nd_growth_ingest(v_key,'reserve',jsonb_set(v_payload,'{id}',to_jsonb(gen_random_uuid())));END LOOP;
 BEGIN PERFORM public.nd_growth_ingest(v_key,'reserve',jsonb_set(v_payload,'{id}',to_jsonb(gen_random_uuid())));RAISE EXCEPTION 'TEST FAILED: persistent quota not enforced';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Tool request quota reached. Please try again later' THEN RAISE;END IF;END;
 PERFORM set_config('request.jwt.claims','{}',true);
 BEGIN PERFORM public.nd_growth_update_tool(v_tool.id,v_tool.revision,'{}');RAISE EXCEPTION 'TEST FAILED: unauthenticated config write accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'Tool configuration permission required' THEN RAISE;END IF;END;
END $$;
ROLLBACK;
