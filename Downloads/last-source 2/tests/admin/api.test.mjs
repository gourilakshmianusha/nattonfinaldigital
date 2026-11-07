import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { once } from 'node:events';
import { installAdminApi } from '../../server/admin/api.mjs';
import { installAdminWebhooks } from '../../server/admin/webhooks.mjs';
let backend,mock,origin,fixtureOrigin,activeRole='analyst_viewer';
const id='11111111-1111-4111-8111-111111111111';
const token='synthetic.'+Buffer.from(JSON.stringify({sub:id,aal:'aal1',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.fixture';
const originalUrl=process.env.SUPABASE_URL;
const originalPublicKey=process.env.SUPABASE_PUBLISHABLE_KEY;
const originalLeadFlag=process.env.ND_ADMIN_LEAD_INGESTION_ENABLED;
async function call(path,{method='GET',body,cookie=false,headers={}}={}){return fetch(origin+'/api/admin'+path,{method,headers:{'Content-Type':'application/json','X-ND-Request':'admin',...(cookie?{Cookie:`nd_admin_access=${token}`}:{}) ,...headers},...(body?{body:JSON.stringify(body)}:{})});}
test.before(async()=>{
 // Synthetic HTTP fixtures exercise backend authorization, not Supabase JWT or RLS enforcement.
 const provider=express();provider.use(express.json());provider.post('/rest/v1/nd_admin_v1_tool_runs',(_req,res)=>res.status(201).json({}));provider.get('/auth/v1/user',(_req,res)=>res.json({id,email:'test@example.invalid',factors:[]}));
 provider.get('/rest/v1/nd_admin_v1_memberships',(_req,res)=>res.json({role_id:activeRole,active:true}));
 provider.get('/rest/v1/nd_admin_v1_leads',(_req,res)=>res.set('Content-Range','0-0/1').json([{id,title:'Synthetic fixture',status:'new',body:{}}]));
 mock=provider.listen(0,'127.0.0.1');await once(mock,'listening');fixtureOrigin=`http://127.0.0.1:${mock.address().port}`;process.env.SUPABASE_URL=fixtureOrigin;process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_test_fixture';process.env.ND_ADMIN_LEAD_INGESTION_ENABLED='true';
 const app=express();installAdminWebhooks(app);installAdminApi(app);backend=app.listen(0,'127.0.0.1');await once(backend,'listening');origin=`http://127.0.0.1:${backend.address().port}`;
});
test.after(async()=>{if(originalPublicKey===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;else process.env.SUPABASE_PUBLISHABLE_KEY=originalPublicKey;if(originalUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=originalUrl;if(originalLeadFlag===undefined)delete process.env.ND_ADMIN_LEAD_INGESTION_ENABLED;else process.env.ND_ADMIN_LEAD_INGESTION_ENABLED=originalLeadFlag;backend?.closeAllConnections();mock?.closeAllConnections();await Promise.all([new Promise(resolve=>backend?.close(resolve)),new Promise(resolve=>mock?.close(resolve))]);});
test('unauthenticated private module requests return 401',async()=>{
 for(const module of ['leads','pages','applicants','settings','team','media'])assert.equal((await call('/'+module)).status,401,module);
});
test('analyst cannot read HR, write pages, grant membership, or export',async()=>{
 activeRole='analyst_viewer';
 assert.equal((await call('/applicants',{cookie:true})).status,403);
 assert.equal((await call('/pages',{method:'POST',cookie:true,body:{title:'Synthetic'}})).status,403);
 assert.equal((await call('/team/membership',{method:'POST',cookie:true,body:{userId:id,role:'super_admin',active:true}})).status,403);
 assert.equal((await call('/analytics/export',{cookie:true})).status,403);
});
test('sales can access CRM while marketing cannot access resumes',async()=>{
 activeRole='sales_crm';const response=await call('/leads',{cookie:true});assert.equal(response.status,200);assert.equal((await response.json()).rows[0].title,'Synthetic fixture');
 activeRole='marketing_manager';assert.equal((await call('/private-file/'+id,{cookie:true})).status,403);
});
test('cross-origin mutation is rejected before authentication',async()=>{
 const result=await call('/auth/login',{method:'POST',body:{email:'test@example.invalid',password:'fixture'},headers:{Origin:'https://evil.invalid'}});assert.equal(result.status,403);
});
test('provider tools reject invalid denominators and report real calculations',async()=>{
 activeRole='super_admin';let response=await call('/tools/calculate',{method:'POST',cookie:true,body:{kind:'roi',values:{revenue:150,cost:100}}});assert.equal(response.status,200);assert.equal((await response.json()).value,50);
 response=await call('/tools/calculate',{method:'POST',cookie:true,body:{kind:'cpl',values:{spend:500,leads:0}}});assert.equal(response.status,400);
});
test('public lead ingestion validates consent before any database call',async()=>{
 const response=await fetch(origin+'/api/public/leads',{method:'POST',headers:{'Content-Type':'application/json','X-ND-Request':'admin'},body:JSON.stringify({name:'Synthetic',email:'test@example.invalid',consent:false,idempotencyKey:id})});assert.equal(response.status,400);
});
test('unconfigured webhook does not accept events or claim success',async()=>{
 const response=await fetch(origin+'/api/webhooks/nd-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"synthetic":true}'});assert.equal(response.status,503);
});
