import test from 'node:test';
import assert from 'node:assert/strict';
import { runProvider, providerConfigured, dateRange } from '../../server/admin/providers.mjs';
const originalNodeEnv=process.env.NODE_ENV;test.before(()=>{process.env.NODE_ENV='test';});test.after(()=>{if(originalNodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=originalNodeEnv;});
const config={status:'not_connected',body:{provider:'ga4',environment:'staging',account_ref:'12345',secret_ref:'ND_ADMIN_GA4_TOKEN'}};
test('unconfigured providers make no outbound request and do not claim connection',async()=>{
 delete process.env.ND_ADMIN_GA4_TOKEN;let called=false;assert.equal(providerConfigured(config),false);
 await assert.rejects(()=>runProvider(config,{},()=>{called=true;}),{code:'provider_configuration_required'});assert.equal(called,false);
});
test('GA4 read-only sync normalises verified response metrics without exposing credentials',async()=>{
 process.env.ND_ADMIN_GA4_TOKEN='synthetic-test-token';
 try {let calls=[];const response=await runProvider(config,{mode:'sync',from:'2026-10-01',to:'2026-10-02'},async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({metadata:{timeZone:'Asia/Kolkata',currencyCode:'INR'},rows:[{dimensionValues:[{value:'20261001'}],metricValues:[{value:'12'},{value:'10'},{value:'2'}]}]}),{status:200,headers:{'Content-Type':'application/json'}});});
 assert.equal(calls[0].url,'https://analyticsdata.googleapis.com/v1beta/properties/12345:runReport');assert.equal(calls[0].options.method,'POST');assert.equal(response.records[0].metrics.sessions,12);assert.equal(response.records[0].date,'2026-10-01');assert.equal(response.timezone,'Asia/Kolkata');assert.ok(!JSON.stringify(response).includes('synthetic-test-token'));
 } finally {delete process.env.ND_ADMIN_GA4_TOKEN;}
});
test('expired provider tokens do not invalidate the administrator session',async()=>{
 process.env.ND_ADMIN_GA4_TOKEN='synthetic-test-token';try{await assert.rejects(()=>runProvider(config,{},async()=>new Response('{}',{status:401})),{status:502,code:'provider_token_expired'});}finally{delete process.env.ND_ADMIN_GA4_TOKEN;}
});
test('environment separation, report bounds, and missing metrics are enforced',async()=>{
 process.env.ND_ADMIN_GA4_TOKEN='synthetic-test-token';try{
 await assert.rejects(()=>runProvider({...config,body:{...config.body,environment:'production'}}),{code:'provider_configuration_required'});
 assert.throws(()=>dateRange('2026-12-01','2026-01-01'),{status:400});assert.throws(()=>dateRange('bad','2026-01-01'),{status:400});
 await assert.rejects(()=>runProvider(config,{mode:'sync',from:'2026-10-01',to:'2026-10-02'},async()=>new Response(JSON.stringify({rows:[{dimensionValues:[{value:'20261001'}],metricValues:[{}]}]}),{status:200})),{code:'provider_format'});
 }finally{delete process.env.ND_ADMIN_GA4_TOKEN;}
});

test('all configured health adapters issue only documented read operations with server-only references',async()=>{
 const entries=[['search_console','ND_ADMIN_GSC_TOKEN','sc-domain:example.invalid'],['google_ads','ND_ADMIN_GOOGLE_ADS_TOKEN','1234567890'],['meta_ads','ND_ADMIN_META_ADS_TOKEN','act_12345'],['gohighlevel','ND_ADMIN_GHL_TOKEN','syntheticLocation'],['n8n','ND_ADMIN_N8N_TOKEN',''],['email','ND_ADMIN_EMAIL_TOKEN',''],['whatsapp','ND_ADMIN_WHATSAPP_TOKEN','123456789']];
 const extras={ND_ADMIN_GOOGLE_ADS_VERSION:'v999',ND_ADMIN_GOOGLE_ADS_DEVELOPER_TOKEN:'synthetic-developer-token',ND_ADMIN_META_GRAPH_VERSION:'v999.0',ND_ADMIN_GHL_VERSION:'synthetic-version',ND_ADMIN_N8N_BASE_URL:'https://n8n.example.invalid'};
 for(const [key,value]of Object.entries(extras))process.env[key]=value;
 try{for(const [provider,reference,account]of entries){process.env[reference]='synthetic-provider-secret';let called=false;const result=await runProvider({status:'not_connected',body:{provider,environment:'staging',secret_ref:reference,account_ref:account}},{mode:'test'},async(url,options)=>{called=true;assert.ok(String(url).startsWith('https://'));assert.ok(['GET','POST'].includes(options.method));if(options.method==='POST')assert.ok(options.body.includes('SELECT'));return new Response('{}',{status:200});});assert.ok(called);assert.equal(result.status,'connected');assert.ok(!JSON.stringify(result).includes('synthetic-provider-secret'));delete process.env[reference];}}
 finally{for(const key of Object.keys(extras))delete process.env[key];for(const [,reference]of entries)delete process.env[reference];}
});
