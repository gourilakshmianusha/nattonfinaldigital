import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const source=await readFile(new URL('../../src/growth/client.ts',import.meta.url),'utf8');
const {code}=await transform(source,{loader:'ts',format:'esm'});
const {growthRequest}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('a queued audit polls until completion using the same browser session',async(t)=>{
 const calls=[];
 const responses=[{status:'processing',submissionId:'test-id'},{status:'processing'},{status:'completed',result:{toolId:'seo_aeo_audit'},report:{status:'ready'}}];
 t.mock.method(globalThis,'fetch',async(path,options)=>{calls.push({path,options});return Response.json(responses.shift());});
 t.mock.method(globalThis,'setTimeout',callback=>{queueMicrotask(callback);return 0;});
 const result=await growthRequest('/api/tools/seo_aeo_audit/run',{method:'POST',body:'{}'});
 assert.equal(result.submissionId,'test-id');assert.equal(result.report.status,'ready');
 assert.equal(calls[0].options.method,'POST');
 assert.equal(calls[1].path,'/api/tools/results/test-id');
 assert.equal(calls[2].options.credentials,'same-origin');
 assert.equal(calls.length,3);
});
test('failed jobs permit a fresh run instead of polling forever',async(t)=>{
 const responses=[{status:'processing',submissionId:'test-id'},{status:'failed'}];
 t.mock.method(globalThis,'fetch',async()=>Response.json(responses.shift()));
 t.mock.method(globalThis,'setTimeout',callback=>{queueMicrotask(callback);return 0;});
 await assert.rejects(growthRequest('/api/tools/seo_aeo_audit/run',{method:'POST'}),{code:'previous_request_failed',status:409});
});
