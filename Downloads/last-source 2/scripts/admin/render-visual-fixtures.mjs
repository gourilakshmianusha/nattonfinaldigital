// Isolated server-rendered visual fixtures. No database, API, auth bypass, or live records.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL}from'node:url';
import{build}from'esbuild';
import React from'react';
import{renderToStaticMarkup}from'react-dom/server';
import{adminModules,providers}from'../../src/admin/modules.mjs';
const output=path.resolve('tests/admin/.visual-fixture-bundle.mjs');
await build({stdin:{contents:"export {Login,AppShell} from './src/admin/AdminApplication.tsx'; export { default as ModulePage,Dashboard,AdminDataContext} from './src/admin/Workspace.tsx';",resolveDir:process.cwd()},outfile:output,bundle:true,packages:'external',format:'esm',platform:'node',jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env.PROD':'false'}});
try{
 const{Login,AppShell,ModulePage,Dashboard,AdminDataContext}=await import(pathToFileURL(output));
 const directory='/tmp/natton-admin-visual';fs.mkdirSync(directory,{recursive:true});
 const css=fs.readFileSync('src/admin/admin.css','utf8');
 const user={id:'11111111-1111-4111-8111-111111111111',email:'synthetic@example.invalid',displayName:'QA Fixture'};const session={user,role:'super_admin',timezone:'Asia/Kolkata',environment:'SYNTHETIC VISUAL FIXTURE'};
 const stamp='2026-11-02T04:30:00.000Z';const lead={id:user.id,title:'Synthetic enquiry',status:'new',body:{email:'synthetic@example.invalid',service:'Website development',source:'Synthetic fixture'},created_at:stamp,updated_at:stamp,revision:1};
 const activity={id:user.id,module:'pages',action:'insert',details:{title:'Synthetic draft page'},created_at:stamp,actor_id:user.id};
 const write=(name,content)=>fs.writeFileSync(path.join(directory,name+'.html'),`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Visual fixture ${name}</title><style>body{margin:0}${css}</style></head><body><div class="nd-admin">${content}</div></body></html>`);
 write('login',renderToStaticMarkup(React.createElement(Login,{onSignedIn:()=>{}})));
 for(const spec of adminModules.filter(module=>!module.hidden)){
  globalThis.window={location:{search:'',pathname:'/admin/'+spec.id}};
  const body=Object.fromEntries(spec.fields.map(field=>[field.key,field.type==='checkbox'?false:field.type==='number'?1:field.key==='email'?'synthetic@example.invalid':field.key==='starts_at'?stamp:field.key==='ends_at'?'2026-11-02T05:00:00.000Z':field.key==='timezone'?'Asia/Kolkata':field.key==='url'?'':field.type==='json'?{}:field.default||'Synthetic '+field.label]));
  const row={...lead,id:user.id,title:'Synthetic '+spec.label,status:spec.statuses?.[0]||'draft',slug:'synthetic-'+spec.id,body};
  const data={['/'+spec.id+'?size=12']:{rows:spec.readonly?[]:[row],total:spec.readonly?0:1,page:1,size:12,source:'Synthetic visual fixture',observed_at:stamp},'/integrations/status':{providers:providers.map(p=>({...p,status:'not_connected',reason:'Synthetic disconnected fixture; no provider account is connected.'}))},'/dashboard?':{metrics:[{title:'New enquiries',module:'leads',status:'new',value:1},{title:'Qualified leads',module:'leads',status:'qualified',value:0},{title:'Consultations',module:'appointments',value:0},{title:'Published pages',module:'pages',status:'published',value:0}],trend:[],attention:[lead],activity:[activity],source:'Synthetic visual fixture',observed_at:stamp}};
  const content=spec.id==='dashboard'?React.createElement(Dashboard,{session,refresh:0,notify:()=>{}}):React.createElement(ModulePage,{id:spec.id,session,refresh:0,notify:()=>{}});
  const page=React.createElement(AdminDataContext.Provider,{value:data},React.createElement(AppShell,{session,active:spec.id,onLogout:()=>{},refresh:()=>{}},content));
  write(spec.id,renderToStaticMarkup(page));
 }
 console.log('Rendered 18 isolated visual fixtures in /tmp/natton-admin-visual. These contain synthetic data and no functional login or API.');
}finally{fs.unlinkSync(output);delete globalThis.window;}
