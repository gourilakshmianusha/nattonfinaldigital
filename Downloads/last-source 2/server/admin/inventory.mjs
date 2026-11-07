import fs from 'node:fs';
export function routeInventory(){
 const source=fs.readFileSync('src/App.tsx','utf8');
 const entries=[...source.matchAll(/^  '([^']+)':\s*\{\s*title:\s*(['"])(.*?)\2,\s*description:\s*(['"])(.*?)\4,/gm)].map(match=>({title:match[3],slug:match[1],description:match[5]}));
 const services=JSON.parse(fs.readFileSync('assets/services/nattondigital_all_services_content.json','utf8')).map(service=>({title:service.seo||service.name,slug:'services/'+(service.url?.split('/').filter(Boolean).at(-1)||service.slug||service.id),description:service.meta||service.short||''}));
 return [...entries,...services].filter(row=>!row.slug.startsWith('admin'));
}
export function localSeoScan(){const routes=routeInventory();return {source:'Local repository metadata scan',observed_at:new Date().toISOString(),limitations:'Source checks only. H1 rendering, live HTTP links, mobile performance, and Search Console metrics require separate browser/provider verification.',routes:routes.map(route=>({...route,issues:[...(!route.title?[{code:'title_missing',severity:'high',message:'Missing title'}]:[]),...(route.title?.length>65?[{code:'title_length',severity:'medium',message:'Review title length'}]:[]),...(!route.description?[{code:'description_missing',severity:'high',message:'Missing description'}]:[]),...(route.description?.length>170?[{code:'description_length',severity:'medium',message:'Review description length'}]:[]),...(!fs.existsSync(`public/seo/feature-${route.slug.replaceAll('/','-')}.png`)?[{code:'social_image_missing',severity:'medium',message:'Social image file not found'}]:[])]}))};}

export function toolInventory(){
 const source=fs.readFileSync('src/pages/FreeTools.tsx','utf8');
 const deterministic=new Set(['roi_calculator','whatsapp_roi','ai_agent_cost','lead_value','marketing_budget']);
 return [...source.matchAll(/\{ id: '([^']+)', name: '([^']+)', category: '([^']+)', desc:/g)].map(match=>({slug:match[1],title:match[2],category:match[3],implementation:deterministic.has(match[1])?'Existing input-based calculation':'Existing assessment or simulation',verification:'Not verified by this admin implementation',path:'/free-tools'}));
}
