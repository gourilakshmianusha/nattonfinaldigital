import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {once} from 'node:events';
import {installAdminApi} from '../../server/admin/api.mjs';
let backend,provider,origin,role='reader',confirmed=true,mutations=0;
const userId='11111111-1111-4111-8111-111111111111',postId='22222222-2222-4222-8222-222222222222';
const token='synthetic.'+Buffer.from(JSON.stringify({sub:userId,aal:'aal1'})).toString('base64url')+'.fixture';
const originalUrl=process.env.SUPABASE_URL;
async function call(path,{method='GET',body,reader=false,admin=false,headers={}}={}){return fetch(origin+path,{method,headers:{'Content-Type':'application/json','X-ND-Request':'admin',...(reader?{Cookie:`nd_blog_access=${token}`} : {}),...(admin?{Cookie:`nd_admin_access=${token}`} : {}),...headers},...(body?{body:JSON.stringify(body)}:{})});}
test.before(async()=>{
 const mock=express();mock.use(express.json());
 mock.get('/auth/v1/user',(_req,res)=>res.json({id:userId,email:'reader@example.invalid',email_confirmed_at:confirmed?'2026-01-01T00:00:00Z':null,user_metadata:{display_name:'Synthetic Reader'},factors:[]}));
 mock.get('/rest/v1/nd_admin_v1_memberships',(_req,res)=>res.json({role_id:role,active:true}));
 mock.post('/rest/v1/rpc/nd_admin_v1_can',(_req,res)=>res.json(role==='super_admin'));
 mock.post('/rest/v1/rpc/nd_admin_v1_blog_posts',(req,res)=>{assert.equal(req.body.p_limit,12);res.json([{id:postId,title:'Synthetic published article',slug:'synthetic',body:{summary:'Synthetic fixture'},total:1}]);});
 mock.post('/rest/v1/rpc/nd_admin_v1_blog_categories',(_req,res)=>res.json([{category:'Synthetic'}]));
 mock.post('/rest/v1/rpc/nd_admin_v1_blog_public_comments',(_req,res)=>res.json([]));
 mock.post('/rest/v1/rpc/nd_admin_v1_blog_submit_comment',(req,res)=>{mutations++;assert.equal(req.body.p_post,postId);assert.equal(req.body.p_content,'A useful synthetic test comment.');res.json(userId);});
 mock.post('/rest/v1/rpc/nd_admin_v1_blog_moderate_comment',(_req,res)=>{mutations++;res.json(null);});
 provider=mock.listen(0,'127.0.0.1');await once(provider,'listening');process.env.SUPABASE_URL=`http://127.0.0.1:${provider.address().port}`;
 const app=express();installAdminApi(app);backend=app.listen(0,'127.0.0.1');await once(backend,'listening');origin=`http://127.0.0.1:${backend.address().port}`;
});
test.after(async()=>{if(originalUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=originalUrl;backend.closeAllConnections();provider.closeAllConnections();await Promise.all([new Promise(r=>backend.close(r)),new Promise(r=>provider.close(r))]);});
test('public blog reads the published RPC and returns no sample fallback',async()=>{
 const response=await call('/api/public/blog/posts');assert.equal(response.status,200);assert.match(response.headers.get('cache-control'),/no-store/);const result=await response.json();assert.equal(result.total,1);assert.equal(result.rows[0].title,'Synthetic published article');assert.equal(result.rows[0].total,undefined);assert.deepEqual(result.categories,['Synthetic']);
});
test('public signed-out session is ordinary and comments do not fabricate an empty-state submission',async()=>{
 const response=await call('/api/public/blog/session');assert.equal(response.status,200);assert.deepEqual(await response.json(),{user:null});
 const comments=await call(`/api/public/blog/posts/${postId}/comments`);assert.deepEqual((await comments.json()).rows,[]);
 const result=await call(`/api/public/blog/posts/${postId}/comments`,{method:'POST',body:{content:'A useful synthetic test comment.',requestKey:userId}});assert.equal(result.status,401);assert.equal(mutations,0);
});
test('comment submission requires verified readers and rejects staff, tampering, and foreign origins',async()=>{
 const path=`/api/public/blog/posts/${postId}/comments`,body={content:'A useful synthetic test comment.',requestKey:userId};
 confirmed=false;assert.equal((await call(path,{method:'POST',body,reader:true})).status,403);confirmed=true;
 role='super_admin';assert.equal((await call(path,{method:'POST',body,reader:true})).status,403);role='reader';
 assert.equal((await call(path,{method:'POST',body:{...body,website:'spam.invalid'},reader:true})).status,400);
 assert.equal((await call(path,{method:'POST',body,reader:true,headers:{Origin:'https://untrusted.invalid'}})).status,403);
 assert.equal(mutations,0);
 const accepted=await call(path,{method:'POST',body,reader:true});assert.equal(accepted.status,202);assert.equal((await accepted.json()).accepted,true);assert.equal(mutations,1);
});
test('moderation requires publishing permission and never accepts rewritten content',async()=>{
 const path=`/api/admin/blog/comments/${userId}`;
 role='content_editor';assert.equal((await call(path,{method:'PATCH',body:{status:'approved',revision:1},admin:true})).status,403);
 role='super_admin';assert.equal((await call(path,{method:'PATCH',body:{status:'approved',revision:1,content:'fabricated'},admin:true})).status,400);
 assert.equal((await call('/api/admin/blog/comments',{method:'POST',body:{content:'fabricated'},admin:true})).status,404);
 assert.equal(mutations,1);
 assert.equal((await call(path,{method:'PATCH',body:{status:'approved',revision:1},admin:true})).status,200);assert.equal(mutations,2);
});
