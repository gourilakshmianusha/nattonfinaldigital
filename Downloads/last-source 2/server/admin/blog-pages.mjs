import fs from 'node:fs/promises';
import path from 'node:path';
import {client,dbError,prefix} from './db.mjs';
import {rateLimit} from './security.mjs';
const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function installBlogPages(app,distDirectory){
 app.get('/p/blog/*',(req,res)=>res.redirect(301,'/blog/'+req.params[0].replace(/\/+$/,'')+'/'));
 app.get('/blog/*',async(req,res)=>{
  res.set('Cache-Control','no-store');
  try{
   rateLimit('blog-html:'+req.ip,120);
   const slug=req.params[0].replace(/\/+$/,'');
   const html=await fs.readFile(path.join(distDirectory,'blog/index.html'),'utf8');
   if(!/^[a-z0-9][a-z0-9/-]{0,199}$/.test(slug))return res.status(404).type('html').send(html);
   const result=await client().rpc(prefix+'blog_posts',{p_offset:0,p_limit:1,p_query:'',p_category:'',p_article:slug});dbError(result.error);
   const article=result.data?.[0];
   if(!article)return res.status(404).type('html').send(html.replace(/<meta name="robots"[^>]*>/,'<meta name="robots" content="noindex,follow" />'));
   const body=article.body||{},title=body.meta_title||article.title,description=body.meta_description||body.summary||'';
   res.status(200).type('html').send(html.replace(/<title>[\s\S]*?<\/title>/,()=>'<title>'+escape(title)+'</title>').replace(/<meta name="description"[^>]*>/,()=>'<meta name="description" content="'+escape(description)+'" />').replace(/<link rel="canonical"[^>]*>/,()=>'<link rel="canonical" href="'+escape((process.env.SITE_URL||'https://nattondigital.com').replace(/\/$/,'')+'/blog/'+article.slug+'/')+'" />'));
  }catch(error){res.status(error.status||503).type('text').send('Published articles could not be loaded. Please try again shortly.');}
 });
}
