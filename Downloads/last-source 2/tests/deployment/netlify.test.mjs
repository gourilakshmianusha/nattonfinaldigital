import test from 'node:test';
import assert from 'node:assert/strict';
import {handler} from '../../netlify/functions/api.mjs';
const event=(path,method='GET',body)=>({httpMethod:method,path,rawUrl:'https://example.netlify.app'+path,headers:{host:'example.netlify.app','x-forwarded-proto':'https',origin:'https://example.netlify.app','content-type':'application/json','x-nd-request':'admin'},queryStringParameters:{},body:body?JSON.stringify(body):null,isBase64Encoded:false,requestContext:{identity:{sourceIp:'203.0.113.44'}}});
test('Netlify adapter serves JSON API routes and rejects unauthenticated access',async()=>{
 const deployment=await handler(event('/api/deployment/status'),{});assert.equal(deployment.statusCode,200);const diagnostics=JSON.parse(deployment.body);assert.equal(diagnostics.server,'node');assert.equal(typeof diagnostics.storageConfigured,'boolean');assert.ok(!('key' in diagnostics));
 const status=await handler(event('/api/admin/status'),{});assert.equal(status.statusCode,200);assert.match(status.headers['content-type'],/application\/json/);
 const session=await handler(event('/api/admin/session'),{});assert.equal(session.statusCode,401);assert.equal(JSON.parse(session.body).code,'unauthenticated');
 const missing=await handler(event('/api/missing'),{});assert.equal(missing.statusCode,404);assert.equal(JSON.parse(missing.body).code,'not_found');
});
test('Netlify adapter preserves origin checks behind HTTPS proxy and returns sitemap',async()=>{
 const old=process.env.ADMIN_ORIGIN;delete process.env.ADMIN_ORIGIN;
 try{
 const invalid=await handler(event('/api/admin/auth/login','POST',{email:'x'}),{});assert.equal(invalid.statusCode,400);
 const cross=event('/api/admin/auth/login','POST',{});cross.headers.origin='https://untrusted.example';assert.equal((await handler(cross,{})).statusCode,403);
 const xml=await handler(event('/sitemap.xml'),{});assert.equal(xml.statusCode,200);assert.match(xml.body,/<urlset/);
 }finally{if(old===undefined)delete process.env.ADMIN_ORIGIN;else process.env.ADMIN_ORIGIN=old;}
});
