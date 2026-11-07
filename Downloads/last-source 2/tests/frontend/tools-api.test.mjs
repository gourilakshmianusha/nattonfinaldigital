import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {unlinkSync,readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {toolRegistry,defaultsFor} from '../../src/growth/registry.mjs';
import {inputSchema} from '../../src/growth/schemas.mjs';

const output=path.resolve('tests/frontend/.tools-fixture.mjs');
const zipTools=JSON.parse(readFileSync('src/reference-site/resources/tools.json','utf8')).tools;
let tools;
const originalFetch=globalThis.fetch;
const saved={result:{currency:'INR',metrics:[{label:'Server result',value:982,unit:'currency'}],methodology:['Server methodology'],warnings:['Server limitation'],assumptions:[],dataSources:[]},submissionId:'11111111-1111-4111-8111-111111111111',report:{id:'22222222-2222-4222-8222-222222222222',status:'ready'}};
test.before(async()=>{
  await build({stdin:{contents:"export {createToolRunner,toolInputs,toolPresentation} from './src/free-tools-api.ts';export {PlanningTool,Results} from './src/reference-site/resources/ResourceTools.jsx';",resolveDir:process.cwd()},outfile:output,bundle:true,packages:'external',format:'esm',platform:'node',jsx:'automatic'});
  tools=await import(pathToFileURL(output));
});
test.afterEach(()=>{globalThis.fetch=originalFetch;});
test.after(()=>unlinkSync(output));

test('every tool sends schema-compatible inputs to its original API endpoint',async()=>{
  let count=0;
  for(const tool of toolRegistry){
    const values=defaultsFor(tool.id);
    for(const field of tool.fields){
      if(field.type==='number')values[field.key]=String(values[field.key]);
      if(field.options?.includes('unanswered'))values[field.key]='4';
    }
    if(tool.id==='ai_readiness'){values.industry='Retail';values.businessGoals='Reduce repetitive work';}
    globalThis.fetch=async(url,options)=>{
      count++;
      assert.equal(url,`/api/tools/${tool.id}/run`);
      assert.equal(options.credentials,'same-origin');
      assert.equal(options.headers['X-ND-Request'],'admin');
      const {requestId,inputs}=JSON.parse(options.body);
      assert.match(requestId,/^[a-f0-9-]{36}$/);
      assert.equal(inputSchema(tool.id).safeParse(inputs).success,true,tool.id);
      return new Response(JSON.stringify(saved),{headers:{'Content-Type':'application/json'}});
    };
    const result=await tools.createToolRunner()(tool.id,values,'INR');
    assert.equal(result.result.metrics[0].value,982,'use the API result');
  }
  assert.equal(count,16);
});

test('repeated runs share one request, and transport failures retain the retry ID',async()=>{
  const ids=[];
  let fail=true;
  const runner=tools.createToolRunner(async(_,options)=>{
    ids.push(JSON.parse(options.body).requestId);
    if(fail)throw new Error('Connection interrupted');
    return saved;
  });
  const values=defaultsFor('marketing_roi');
  await assert.rejects(runner('marketing_roi',values,'INR'),/Connection interrupted/);
  fail=false;
  await Promise.all([runner('marketing_roi',values,'INR'),runner('marketing_roi',values,'INR')]);
  assert.equal(ids.length,2);assert.equal(ids[0],ids[1]);
  await runner('marketing_roi',{...values,spend:20000},'INR');
  assert.notEqual(ids[1],ids[2]);
});

test('failed persisted runs receive a new ID on retry and errors stay visible',async()=>{
  const ids=[];
  const runner=tools.createToolRunner(async(_,options)=>{
    ids.push(JSON.parse(options.body).requestId);
    if(ids.length===1)throw Object.assign(new Error('Provider unavailable'),{status:503});
    return saved;
  });
  await assert.rejects(runner('website_grader',defaultsFor('website_grader'),'INR'),/Provider unavailable/);
  await runner('website_grader',defaultsFor('website_grader'),'INR');
  assert.notEqual(ids[0],ids[1]);
});

test('API results retain units, warnings, readiness domains, and conditional PDF links',()=>{
  const result=tools.toolPresentation({...saved,result:{...saved.result,readiness:{domains:[{domain:'Data',score:75},{domain:'Skills',score:null}],quickWins:['Review data']}}});
  assert.equal(result.metrics[0].unit,'money');
  assert.deepEqual(result.domains,[{name:'Data',score:75}]);
  const html=renderToStaticMarkup(React.createElement(tools.Results,{result,currency:'INR'}));
  assert.ok(html.includes(`/api/reports/${saved.report.id}/download`));
  assert.ok(html.includes('Server limitation'));assert.ok(html.includes('Server methodology'));
  const failed=renderToStaticMarkup(React.createElement(tools.Results,{result:{...result,report:{...result.report,status:'failed'}},currency:'INR'}));
  assert.ok(!failed.includes('/download'));
});

test('all tool forms retain ZIP classes and enforce admin pause/provider availability',()=>{
  for(const tool of zipTools){
    const apiTool={enabled:true,config:{defaults:{currency:'INR'},currencies:['INR']},availability:{state:'available'}};
    const html=renderToStaticMarkup(React.createElement(tools.PlanningTool,{tool,apiTool}));
    assert.ok(html.includes('resource-tool-layout'));assert.ok(html.includes('resource-tool-form'));
    assert.ok(!html.includes('ng-growth'));
    if(tool.id==='website_grader'||tool.id==='seo_aeo_audit')assert.ok(html.includes('type="url"'));
  }
  const tool=zipTools.find(t=>t.id==='website_grader');
  const html=renderToStaticMarkup(React.createElement(tools.PlanningTool,{tool,apiTool:{enabled:true,config:{},availability:{state:'not_connected',message:'Provider needs configuration'}}}));
  assert.ok(html.includes('Provider needs configuration'));
  assert.match(html,/<button type="submit"[^>]*disabled/);
});

test('SEO unavailable scores stay null and render reasons instead of zero or perfect scores',()=>{
 const response={...saved,result:{...saved.result,toolId:'seo_aeo_audit',auditVersion:'seo-aeo/2.0.0',requestedUrl:'https://example.com/',methodologyUrl:'/api/tools/seo-aeo/methodology',metrics:[{label:'Custom AEO Readiness Score',value:null,unit:'score',status:'unavailable',reason:'Rendering failed'}],scores:{aeo:{value:null,status:'unavailable',reason:'Rendering failed'}},pages:[],coverage:{complete:false,inspected:0,urlRecords:[]},visibility:{ai:{status:'not_measured',reason:'No verified monitoring'}}}};
 const html=renderToStaticMarkup(React.createElement(tools.Results,{result:tools.toolPresentation(response),currency:'INR'}));
 assert.ok(html.includes('Unable to calculate'));assert.ok(html.includes('Rendering failed'));assert.ok(html.includes('Not measured'));assert.ok(html.includes('Download detailed CSV'));
 assert.ok(!html.includes('100 / 100'));assert.ok(!html.includes('0 / 100'));
});
