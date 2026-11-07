import fs from 'node:fs';
import path from 'node:path';
import {journalPostSeed} from '../../src/blog-content.mjs';
const articles=JSON.parse(fs.readFileSync(new URL('../../src/reference-site/resources/articles.json',import.meta.url),'utf8'));
const rows=articles.map(journalPostSeed),payload=JSON.stringify(rows);
let tag='$natton_blog_articles$';while(payload.includes(tag))tag=tag.slice(0,-1)+'x$';
let blockTag='$natton_import$';while(payload.includes(blockTag))blockTag=blockTag.slice(0,-1)+'x$';
const sql=`-- Import existing public website guides; never overwrite an admin-managed slug.
-- Follow the existing draft -> review -> approved -> published workflow and audit triggers.
DO ${blockTag}
DECLARE item jsonb; post_id uuid;
BEGIN
 PERFORM set_config('request.jwt.claims','{"role":"service_role"}',true);
 PERFORM pg_advisory_xact_lock(hashtextextended('natton-existing-website-blog-import',0));
 FOR item IN SELECT value FROM jsonb_array_elements(${tag}${payload}${tag}::jsonb) LOOP
  IF EXISTS(SELECT 1 FROM public.nd_admin_v1_posts WHERE slug=item->>'slug') THEN CONTINUE; END IF;
  BEGIN
   INSERT INTO public.nd_admin_v1_posts(title,slug,status,body)
   VALUES(item->>'title',item->>'slug','draft',item->'body') RETURNING id INTO post_id;
  EXCEPTION WHEN unique_violation THEN CONTINUE;
  END;
  UPDATE public.nd_admin_v1_posts SET status='review' WHERE id=post_id;
  UPDATE public.nd_admin_v1_posts SET status='approved' WHERE id=post_id;
  UPDATE public.nd_admin_v1_posts SET status='published' WHERE id=post_id;
 END LOOP;
END;
${blockTag};
SELECT slug,title,status,revision FROM public.nd_admin_v1_posts ORDER BY slug;
`;
const output=process.argv[2];if(!output)throw new Error('Provide an output SQL path for review and execution.');fs.writeFileSync(path.resolve(output),sql);console.log(`Prepared ${rows.length} guides in ${output}. Existing slugs are left unchanged.`);
