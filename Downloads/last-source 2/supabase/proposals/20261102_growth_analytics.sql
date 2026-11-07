BEGIN;
CREATE FUNCTION public.nd_growth_stats(p_from timestamptz,p_to timestamptz,p_tool text DEFAULT '') RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE result jsonb;
BEGIN
 IF NOT public.nd_admin_v1_can('free-tools','read') THEN RAISE EXCEPTION 'Tool read permission required';END IF;
 IF p_from>p_to OR p_to-p_from>interval '367 days' THEN RAISE EXCEPTION 'Invalid date range';END IF;
 WITH selected AS(SELECT s.* FROM public.nd_growth_submissions s WHERE s.created_at BETWEEN p_from AND p_to AND (coalesce(p_tool,'')='' OR s.tool_id=p_tool)),
 usage AS(SELECT tool_id,count(*) AS total,count(*) FILTER(WHERE status='completed') AS completed,count(*) FILTER(WHERE status='failed') AS failed FROM selected GROUP BY tool_id),
 trend AS(SELECT (created_at AT TIME ZONE 'UTC')::date AS date,count(*) AS runs,count(*) FILTER(WHERE status='completed') AS completed FROM selected GROUP BY 1 ORDER BY 1),
 devices AS(SELECT device,count(*) AS total FROM selected GROUP BY device)
 SELECT jsonb_build_object(
 'totalTools',(SELECT count(*) FROM public.nd_growth_tools),'activeTools',(SELECT count(*) FROM public.nd_growth_tools WHERE enabled),'inactiveTools',(SELECT count(*) FROM public.nd_growth_tools WHERE NOT enabled),
 'submissions',(SELECT count(*) FROM selected),'successful',(SELECT count(*) FROM selected WHERE status='completed'),'failed',(SELECT count(*) FROM selected WHERE status='failed'),'processing',(SELECT count(*) FROM selected WHERE status='processing'),
 'leads',CASE WHEN public.nd_admin_v1_can('leads','read') THEN (SELECT count(*) FROM public.nd_growth_leads l JOIN selected s ON s.id=l.submission_id) ELSE NULL END,
 'reports',(SELECT count(*) FROM public.nd_growth_reports r JOIN selected s ON s.id=r.submission_id WHERE r.status='ready'),
 'usage',coalesce((SELECT jsonb_agg(u ORDER BY total DESC) FROM usage u),'[]'),
 'trend',coalesce((SELECT jsonb_agg(t ORDER BY date) FROM trend t),'[]'),
 'devices',coalesce((SELECT jsonb_agg(d) FROM devices d),'[]'),
 'recent',coalesce((SELECT jsonb_agg(r) FROM(SELECT id,tool_id,status,created_at FROM selected ORDER BY created_at DESC LIMIT 10) r),'[]'),
 'errors',coalesce((SELECT jsonb_agg(e) FROM(SELECT id,tool_id,error_code,created_at FROM selected WHERE status='failed' ORDER BY created_at DESC LIMIT 10) e),'[]'),
 'from',p_from,'to',p_to,'timezone','UTC','observedAt',now()) INTO result;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.nd_growth_stats(timestamptz,timestamptz,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.nd_growth_stats(timestamptz,timestamptz,text) TO authenticated;
COMMIT;
