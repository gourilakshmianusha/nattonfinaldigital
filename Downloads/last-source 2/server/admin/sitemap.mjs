import fs from 'node:fs';
import { client,prefix,dbError } from './db.mjs';
export function installAdminSitemap(app){
 app.get('/sitemap.xml',async(_req,res)=>{
  const base=fs.readFileSync('public/sitemap.xml','utf8');
  if(process.env.ND_ADMIN_PUBLIC_SITEMAP_ENABLED!=='true')return res.type('application/xml').send(base);
  try{
   const origin=(process.env.SITE_URL||'https://nattondigital.com').replace(/\/$/,'');const additions=[];
   for(const module of ['pages','services','blog','careers','case-studies']){const result=await client().rpc(prefix+'published',{p_module:module,p_slug:null});dbError(result.error);for(const row of result.data||[])additions.push(`<url><loc>${origin}/${module==='blog'?'blog':'p/'+module}/${row.slug.split('/').map(encodeURIComponent).join('/')}</loc><lastmod>${new Date(row.updated_at).toISOString()}</lastmod></url>`);}
   res.type('application/xml').set('Cache-Control','no-store').send(base.replace('</urlset>',additions.join('\n')+'\n</urlset>'));
  }catch{res.type('application/xml').send(base);}
 });
}
