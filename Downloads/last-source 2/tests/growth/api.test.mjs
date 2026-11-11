import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {once} from 'node:events';
import {randomUUID} from 'node:crypto';
import {installAdminApi} from '../../server/admin/api.mjs';
import {toolRegistry,defaultsFor,currencies,readinessQuestions,freeToolIds} from '../../src/growth/registry.mjs';
let testIp='203.0.113.1',testNumber=0;
let backend,provider,origin,role='super_admin',submissions=new Map(),reports=new Map(),leads=[];
const old={publicKey:process.env.SUPABASE_PUBLISHABLE_KEY,url:process.env.SUPABASE_URL,key:process.env.ND_GROWTH_INGEST_KEY,psi:process.env.GOOGLE_PSI_KEY};
const testKey='synthetic-ingress-secret-not-a-real-key';
const userId='11111111-1111-4111-8111-111111111111',token='synthetic.'+Buffer.from(JSON.stringify({sub:userId,aal:'aal1'})).toString('base64url')+'.fixture';
const tools=toolRegistry.map((t,index)=>({...t,enabled:true,visible:true,display_order:index+1,revision:1,methodology_version:'1.0.0',config:{intro:t.description,helperText:'Illustrative defaults',icon:'calculator',currencies,defaults:{currency:'INR',...defaultsFor(t.id)},reportBrand:'Natton Digital',emailTemplate:''}}));
async function call(path,{method='GET',body,cookie='',admin=false,headers={}}={}){return fetch(origin+path,{method,headers:{'Content-Type':'application/json','X-ND-Request':'admin',Origin:origin,'X-Forwarded-For':testIp,...(cookie?{Cookie:cookie}:{}),...(admin?{Cookie:`nd_admin_access=${token}`} : {}),...headers},...(body?{body:JSON.stringify(body)}:{})});}
const cookieFrom=response=>response.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
const toolInputs=id=>({currency:'INR',...defaultsFor(id),...(id==='ai_readiness'?{industry:'Retail',businessGoals:'Improve response time',...Object.fromEntries(readinessQuestions.map(q=>[q.key,'4']))}:{}),...(id==='crm_score'?Object.fromEntries(['assignment','followup','pipeline','completeness','automation','reporting'].map(key=>[key,'4'])):{})});
test.before(async()=>{
 const mock=express();mock.use(express.json({limit:'4mb'}));mock.get('/auth/v1/user',(_req,res)=>res.json({id:userId,email:'test@example.invalid',factors:[]}));mock.get('/rest/v1/nd_admin_v1_memberships',(_req,res)=>res.json({role_id:role,active:true}));
 mock.get('/rest/v1/nd_growth_tools',(_req,res)=>res.json(tools));
 mock.post('/rest/v1/rpc/nd_growth_contact_request',(req,res)=>{assert.equal(req.body.p_key,testKey);assert.equal(req.body.p_payload.details.preferredDate,'2030-01-01');assert.equal(req.body.p_ip_hash.length,64);res.json({id:randomUUID(),status:'requested'});});
 mock.post('/rest/v1/rpc/nd_growth_catalog',(_req,res)=>res.json(tools.filter(t=>t.visible)));
 mock.post('/rest/v1/rpc/nd_growth_tool_counts',(_req,res)=>res.json([]));
 mock.post('/rest/v1/rpc/nd_growth_update_tool',(req,res)=>{const row=tools.find(t=>t.id===req.body.p_id);Object.assign(row,req.body.p_values,{revision:row.revision+1});res.json(null);});
 mock.post('/rest/v1/rpc/nd_growth_ingest',(req,res)=>{
  assert.equal(req.body.p_key,testKey);const {p_action:action,p_payload:p}=req.body;
  if(action==='reserve'){
   const existing=submissions.get(p.id);if(existing){if(existing.visitor_hash!==p.visitor_hash)return res.status(400).json({message:'Request identity conflict',code:'P0001'});return res.json({...existing,already_exists:true});}
   const tool=tools.find(t=>t.id===p.tool_id);if(!tool.enabled||!tool.visible)return res.status(400).json({message:'This tool is unavailable',code:'P0001'});
   const row={...p,status:'processing',config_snapshot:{methodologyVersion:'1.0.0',config:tool.config}};submissions.set(p.id,row);return res.json({...row,already_exists:false});
  }
  if(action==='complete'){Object.assign(submissions.get(p.id),{status:'completed',result:p.result});reports.set(p.id,{id:p.id,status:p.pdf_base64?'ready':'failed',pdf_base64:p.pdf_base64});return res.json({saved:true});}
  if(action==='fail'){Object.assign(submissions.get(p.id),{status:'failed',error_code:p.error_code});return res.json({saved:true});}
  if(action==='lead'){leads.push(p);return res.json({saved:true,id:randomUUID()});}
  res.status(400).json({message:'Unsupported synthetic action',code:'P0001'});
 });
 mock.post('/rest/v1/rpc/nd_growth_owned_result',(req,res)=>{const row=submissions.get(req.body.p_id);res.json(row?.visitor_hash===req.body.p_visitor_hash?{submission:row,report:reports.get(row.id)||null}:null);});
 provider=mock.listen(0,'127.0.0.1');await once(provider,'listening');process.env.SUPABASE_URL=`http://127.0.0.1:${provider.address().port}`;process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_test_fixture';process.env.ND_GROWTH_INGEST_KEY=testKey;delete process.env.GOOGLE_PSI_KEY;
 const app=express();app.set('trust proxy',true);installAdminApi(app);backend=app.listen(0,'127.0.0.1');await once(backend,'listening');origin=`http://127.0.0.1:${backend.address().port}`;
});
test.beforeEach(()=>{testIp='203.0.113.'+(++testNumber);});
test.after(async()=>{for(const [name,value]of Object.entries({SUPABASE_PUBLISHABLE_KEY:old.publicKey,SUPABASE_URL:old.url,ND_GROWTH_INGEST_KEY:old.key,GOOGLE_PSI_KEY:old.psi})){if(value===undefined)delete process.env[name];else process.env[name]=value;}backend.closeAllConnections();provider.closeAllConnections();await Promise.all([new Promise(r=>backend.close(r)),new Promise(r=>provider.close(r))]);});
test('catalogue has nine public tools and eight calculator experiences without secrets',async()=>{const response=await call('/api/tools');assert.equal(response.status,200);const data=await response.json();assert.equal(data.freeToolIds.length,9);assert.equal(data.roiToolIds.length,8);assert.equal(data.tools.find(t=>t.id==='website_grader').availability.state,'not_connected');assert.ok(!JSON.stringify(data).includes(testKey));assert.match(response.headers.get('set-cookie'),/HttpOnly/);});
test('all nine tool detail routes open, deterministic runs save real PDF bytes, and unsupported diagnostics fail honestly',async()=>{
 const catalog=await call('/api/tools'),cookie=cookieFrom(catalog);
 for(const id of freeToolIds){assert.equal((await call('/api/tools/'+id,{cookie})).status,200,id);const run=await call('/api/tools/'+id+'/run',{method:'POST',cookie,body:{requestId:randomUUID(),inputs:id==='website_grader'?{...toolInputs(id),url:'https://1.1.1.1'}:id==='seo_aeo_audit'?{...toolInputs(id),url:'http://127.0.0.1'}:toolInputs(id)}});const data=await run.json();if(id==='website_grader'){assert.equal(run.status,503);assert.equal(data.code,'provider_not_configured');}else if(id==='seo_aeo_audit'){assert.equal(run.status,400);assert.equal(data.code,'unsafe_url');}else{assert.equal(run.status,201,id+JSON.stringify(data));assert.equal(submissions.get(data.submissionId).status,'completed');assert.equal(data.report.status,'ready');const pdf=await call('/api/reports/'+data.report.id+'/download',{cookie});assert.equal(pdf.status,200);assert.match(pdf.headers.get('content-type'),/application\/pdf/);assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,5).toString(),'%PDF-');}}
});
test('report ownership, consent separation, idempotent requests and CSRF are enforced',async()=>{
 const catalog=await call('/api/tools'),cookie=cookieFrom(catalog),id=randomUUID();const inputs=toolInputs('lead_value');
 const first=await call('/api/tools/lead_value/run',{method:'POST',cookie,body:{requestId:id,inputs}});const data=await first.json();assert.equal(first.status,201);
 const count=submissions.size,again=await call('/api/tools/lead_value/run',{method:'POST',cookie,body:{requestId:id,inputs}});assert.equal(again.status,200);assert.equal(submissions.size,count);
 assert.equal((await call('/api/reports/'+id+'/download')).status,404);
 const view=await call('/api/tools/results/'+id,{cookie});assert.equal(view.status,200);assert.equal('pdf_base64'in(await view.json()).report,false);
 const route='/api/tools/results/'+id+'/lead';const lead={name:'Synthetic QA',email:'qa@example.invalid',phone:'',company:'Synthetic',purpose:'Test a consented request',marketingConsent:false};
 assert.equal((await call(route,{method:'POST',cookie,body:lead})).status,400);assert.equal(leads.length,0);
 const leadResponse=await call(route,{method:'POST',cookie,body:{...lead,deliveryConsent:true}});assert.equal(leadResponse.status,201);assert.match((await leadResponse.json()).leadId,/^[a-f0-9-]{36}$/);assert.equal(leads.length,1);assert.equal(leads[0].marketingConsent,false);
 const blocked=await call('/api/tools/lead_value/run',{method:'POST',cookie,body:{requestId:randomUUID(),inputs},headers:{Origin:'https://foreign.invalid'}});assert.equal(blocked.status,403);
});
test('admin configuration changes shared public availability without deleting history',async()=>{
 assert.equal((await call('/api/admin/growth-tools')).status,401);role='analyst_viewer';assert.equal((await call('/api/admin/growth-tools',{admin:true})).status,403);role='super_admin';
 const row=tools.find(t=>t.id==='lead_value');const values={title:row.title,description:row.description,category:row.category,enabled:false,visible:true,display_order:row.display_order,revision:row.revision,config:row.config};
 const changed=await call('/api/admin/growth-tools/lead_value',{method:'PATCH',admin:true,body:values});assert.equal(changed.status,200);
 const catalog=await call('/api/tools'),cookie=cookieFrom(catalog);const current=(await catalog.json()).tools.find(t=>t.id==='lead_value');assert.equal(current.availability.state,'paused');
 const prior=submissions.size;const run=await call('/api/tools/lead_value/run',{method:'POST',cookie,body:{requestId:randomUUID(),inputs:toolInputs('lead_value')}});assert.equal(run.status,503);assert.equal(submissions.size,prior);
 const injection=await call('/api/admin/growth-tools/lead_value',{method:'PATCH',admin:true,body:{...values,formula:'return 999'}});assert.equal(injection.status,400);
});

test('appointment requests preserve all fields and require explicit consent',async()=>{
 const body={requestId:randomUUID(),name:'Synthetic QA',email:'qa@example.invalid',source:'contact_page',page:'/contact',details:{preferredDate:'2030-01-01'}};
 assert.equal((await call('/api/public/appointment-requests',{method:'POST',body})).status,400);
 const response=await call('/api/public/appointment-requests',{method:'POST',body:{...body,consent:true}});assert.equal(response.status,201);const data=await response.json();assert.equal(data.saved,true);assert.equal(data.status,'requested');assert.match(data.appointmentId,/^[a-f0-9-]{36}$/);
 assert.equal((await call('/api/public/appointment-requests',{method:'POST',body:{...body,consent:true},headers:{Origin:'https://foreign.invalid'}})).status,403);
});

test('SEO publishes versioned rules and Search Console uses explicit visitor OAuth with encrypted cookies',async()=>{
 const rules=await call('/api/tools/seo-aeo/methodology');assert.equal(rules.status,200);const data=await rules.json();assert.equal(data.version,'seo-aeo/2.0.0');assert.equal(Object.values(data.technicalWeights).reduce((a,b)=>a+b,0),100);
 const names=['SEO_GSC_CLIENT_ID','SEO_GSC_CLIENT_SECRET','SEO_GSC_REDIRECT_URI'];const before=Object.fromEntries(names.map(name=>[name,process.env[name]]));const originalFetch=globalThis.fetch;
 try{
  for(const name of names)delete process.env[name];
  const disconnected=await call('/api/tools/seo-aeo/search-console/status');assert.deepEqual(await disconnected.json(),{configured:false,authorized:false});
  assert.equal((await call('/api/tools/seo-aeo/search-console/connect')).status,503);
  process.env.SEO_GSC_CLIENT_ID='synthetic-client';process.env.SEO_GSC_CLIENT_SECRET='synthetic-secret';process.env.SEO_GSC_REDIRECT_URI=origin+'/api/tools/seo-aeo/search-console/callback';
  const connect=await originalFetch(origin+'/api/tools/seo-aeo/search-console/connect',{redirect:'manual'});assert.equal(connect.status,302);const consent=new URL(connect.headers.get('location'));assert.equal(consent.origin,'https://accounts.google.com');assert.equal(consent.searchParams.get('scope'),'https://www.googleapis.com/auth/webmasters.readonly');assert.ok(!consent.href.includes('synthetic-secret'));
  const stateCookie=cookieFrom(connect),state=consent.searchParams.get('state');
  assert.equal((await call('/api/tools/seo-aeo/search-console/callback?code=fixture&state=wrong',{cookie:stateCookie})).status,400);
  globalThis.fetch=async(url,options)=>String(url)==='https://oauth2.googleapis.com/token'?new Response(JSON.stringify({access_token:'synthetic-visitor-token',expires_in:3600,scope:'https://www.googleapis.com/auth/webmasters.readonly'}),{headers:{'Content-Type':'application/json'}}):originalFetch(url,options);
  const callback=await originalFetch(origin+'/api/tools/seo-aeo/search-console/callback?code=fixture&state='+state,{headers:{Cookie:stateCookie},redirect:'manual'});assert.equal(callback.status,302);const tokenCookie=cookieFrom(callback);assert.ok(!tokenCookie.includes('synthetic-visitor-token'));assert.match(callback.headers.get('set-cookie'),/HttpOnly/);
  const status=await call('/api/tools/seo-aeo/search-console/status',{cookie:tokenCookie});assert.equal((await status.json()).authorized,true);
  assert.equal((await call('/api/tools/seo-aeo/search-console/disconnect',{method:'POST',cookie:tokenCookie})).status,200);
 }finally{globalThis.fetch=originalFetch;for(const name of names){if(before[name]===undefined)delete process.env[name];else process.env[name]=before[name];}}
});

test('detailed SEO CSV is available only to the owning visitor',async()=>{
 const catalog=await call('/api/tools'),cookie=cookieFrom(catalog),id=randomUUID();
 const created=await call('/api/tools/roi_calculator/run',{method:'POST',cookie,body:{requestId:id,inputs:toolInputs('roi_calculator')}});assert.equal(created.status,201);
 submissions.get(id).result={toolId:'seo_aeo_audit',auditVersion:'seo-aeo/2.0.0',requestedUrl:'https://example.com/exact',observedAt:'2026-11-07',scores:{aeo:{value:null,status:'unavailable',reason:'No readable content'}},coverage:{urlRecords:[{url:'https://example.com/blocked',status:'blocked',reason:'robots_disallowed'}]},pages:[]};
 const csv=await call('/api/reports/'+id+'/audit.csv',{cookie});assert.equal(csv.status,200);assert.match(csv.headers.get('content-type'),/text\/csv/);assert.match(await csv.text(),/https:\/\/example.com\/blocked/);
 assert.equal((await call('/api/reports/'+id+'/audit.csv')).status,404);
});


test('Netlify audits enqueue quickly, preserve one submission on retry, and worker failures are saved',async()=>{
 const {readAuditJob}=await import('../../server/growth/audit-jobs.mjs');
 const {handler}=await import('../../netlify/functions/audit-background.mjs');
 const oldNetlify=process.env.NETLIFY,oldUrl=process.env.URL,originalFetch=globalThis.fetch;
 const queued=[];
 try {
  process.env.NETLIFY='true';process.env.URL='https://jobs.example.invalid';
  globalThis.fetch=(url,options)=>{
   if(String(url)==='https://jobs.example.invalid/.netlify/functions/audit-background'){queued.push(options);return Promise.resolve(new Response(null,{status:202}));}
   return originalFetch(url,options);
  };
  const catalog=await call('/api/tools'),cookie=cookieFrom(catalog),id=randomUUID();
  const body={requestId:id,inputs:{currency:'INR',url:'http://127.0.0.1',phrase:'',locale:'India'}};
  const response=await call('/api/tools/seo_aeo_audit/run',{method:'POST',cookie,body});
  assert.equal(response.status,202);assert.equal((await response.json()).submissionId,id);assert.equal(queued.length,1);
  assert.equal(submissions.get(id).status,'processing');
  const again=await call('/api/tools/seo_aeo_audit/run',{method:'POST',cookie,body});assert.equal(again.status,202);assert.equal(queued.length,1);
  const job=readAuditJob(queued[0].body,queued[0].headers['X-ND-Audit-Signature']);assert.equal(job.requestId,id);
  const status=await call('/api/tools/results/'+id,{cookie});assert.equal((await status.json()).status,'processing');
  assert.equal((await call('/api/tools/results/'+id)).status,404);
  const event={httpMethod:'POST',body:queued[0].body,headers:queued[0].headers};
  await assert.rejects(handler(event),{code:'unsafe_url'});assert.equal(submissions.get(id).status,'failed');
  // Delivery retries leave a terminal job alone.
  assert.equal((await handler(event)).statusCode,200);
  assert.equal((await handler({...event,headers:{}})).statusCode,403);
 } finally {
  globalThis.fetch=originalFetch;
  if(oldNetlify===undefined)delete process.env.NETLIFY;else process.env.NETLIFY=oldNetlify;
  if(oldUrl===undefined)delete process.env.URL;else process.env.URL=oldUrl;
 }
});
