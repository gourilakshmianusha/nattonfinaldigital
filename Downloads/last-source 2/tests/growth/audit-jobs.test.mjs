import test from 'node:test';
import assert from 'node:assert/strict';
import {signAuditJob,readAuditJob,enqueueAuditJob} from '../../server/growth/audit-jobs.mjs';
test('audit jobs reject forged, modified and expired payloads',()=>{
 const old=process.env.ND_GROWTH_INGEST_KEY;
 process.env.ND_GROWTH_INGEST_KEY='test-only-synthetic-secret';
 try {
  const body=JSON.stringify({id:'seo_aeo_audit',issuedAt:1000000});
  const signature=signAuditJob(body);
  assert.equal(readAuditJob(body,signature,1000001).id,'seo_aeo_audit');
  assert.throws(()=>readAuditJob(body+' ',signature,1000001));
  assert.throws(()=>readAuditJob(body,'0'.repeat(64),1000001));
  assert.throws(()=>readAuditJob(body,signature,1000000+21*60000));
 } finally {if(old===undefined)delete process.env.ND_GROWTH_INGEST_KEY;else process.env.ND_GROWTH_INGEST_KEY=old;}
});
test('background queue requires an accepted invocation and never follows redirects',async()=>{
 const oldKey=process.env.ND_GROWTH_INGEST_KEY,oldUrl=process.env.URL;
 process.env.ND_GROWTH_INGEST_KEY='test-only-synthetic-secret';process.env.URL='https://jobs.example.invalid';
 try {
  await enqueueAuditJob({id:'seo_aeo_audit'},async(url,options)=>{
   assert.equal(String(url),'https://jobs.example.invalid/.netlify/functions/audit-background');
   assert.equal(options.redirect,'error');
   assert.equal(readAuditJob(options.body,options.headers['X-ND-Audit-Signature']).id,'seo_aeo_audit');
   return new Response(null,{status:202});
  });
  await assert.rejects(enqueueAuditJob({},async()=>new Response('<html/>',{status:200})),{code:'audit_queue_unavailable'});
 } finally {
  if(oldKey===undefined)delete process.env.ND_GROWTH_INGEST_KEY;else process.env.ND_GROWTH_INGEST_KEY=oldKey;
  if(oldUrl===undefined)delete process.env.URL;else process.env.URL=oldUrl;
 }
});
