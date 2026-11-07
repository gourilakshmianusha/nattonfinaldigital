import express from 'express';
import { installBlogApi } from './blog.mjs';
import { installGrowthApi } from '../growth/api.mjs';
import { createHmac, randomUUID } from 'node:crypto';
import { moduleById, adminModules, can, rolePermissions, providers } from '../../src/admin/modules.mjs';
import { ApiError, protectMutation, rateLimit, requirePermission, validateRecord, safeCsv, isUUID } from './security.mjs';
import { client, prefix, session, cookies, setSession, clearSession, dbError } from './db.mjs';
import { providerConfigured, runProvider, supportedSync, secretReference, providerEnvironment } from './providers.mjs';
import { localSeoScan, routeInventory, toolInventory } from './inventory.mjs';
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const moduleSpec=id=>{const spec=moduleById[id];if(!spec?.table)throw new ApiError(404,'Module not found.');return spec;};
const disabled=(message,code='configuration_required')=>{throw new ApiError(503,message,code);};
const unavailable=error=>{if(error)throw new ApiError(503,'The existing Supabase authentication service is unavailable. Verify the configured project connection.','auth_unavailable');};
export function installAdminApi(app){
 app.use('/api/admin',(_req,res,next)=>{res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','same-origin');next();});
 app.use('/api/admin',express.json({limit:'600kb'}),(req,res,next)=>{try{protectMutation(req);next();}catch(error){next(error);}});
 installBlogApi(app);
 installGrowthApi(app);
 app.get('/api/admin/status',(_req,res)=>res.json({mode:process.env.NODE_ENV==='production'?'production':'local',authentication:'Existing Supabase Auth',database:'Existing Supabase project',migrationApplied:'not_verified',providerConnections:'not_verified',storageUploadsConfigured:false,storageState:'reviewed_storage_and_scanner_adapter_required'}));
 app.post('/api/admin/auth/login',wrap(async(req,res)=>{
  rateLimit('login:'+req.ip,8,15*60000);
  const {email,password}=req.body;if(typeof email!=='string'||typeof password!=='string'||password.length>1024||email.length>254)throw new ApiError(400,'Enter an email address and password.');
  const auth=client();const {data,error}=await auth.auth.signInWithPassword({email,password});
  if(error){if(error.status===0||error.name?.includes('Retryable'))unavailable(error);throw new ApiError(401,'Sign-in could not be completed. Check your details or try recovery.','sign_in_failed');}
  if(!data.session)throw new ApiError(401,'Sign-in could not be completed.');
  setSession(res,data.session);
  const factor=data.user.factors?.find(item=>item.status==='verified'&&item.factor_type==='totp');
  res.json({mfaRequired:!!factor,factorId:factor?.id});
 }));
 app.post('/api/admin/auth/mfa',wrap(async(req,res)=>{
  rateLimit('mfa:'+req.ip,10,15*60000);const jar=cookies(req);if(!jar.nd_admin_access||!jar.nd_admin_refresh)throw new ApiError(401,'Sign in again.');
  const auth=client();await auth.auth.setSession({access_token:jar.nd_admin_access,refresh_token:jar.nd_admin_refresh});
  const {data:challenge,error}=await auth.auth.mfa.challenge({factorId:req.body.factorId});if(error)throw new ApiError(401,'Authentication could not be completed.');
  const result=await auth.auth.mfa.verify({factorId:req.body.factorId,challengeId:challenge.id,code:String(req.body.code||'')});if(result.error)throw new ApiError(401,'The verification code was not accepted.');setSession(res,result.data);res.json({ok:true});
 }));
 app.post('/api/admin/auth/recovery',wrap(async(req,res)=>{
  rateLimit('recovery:'+req.ip,4,15*60000);const email=String(req.body.email||'');if(email.length>254)throw new ApiError(400,'Enter a valid email.');
  // Only an explicitly configured, existing recovery URL is used. No auth settings are changed.
  if(!process.env.ADMIN_RECOVERY_REDIRECT)disabled('Password recovery needs the existing project’s approved recovery redirect configured on the server.');
  await client().auth.resetPasswordForEmail(email,{redirectTo:process.env.ADMIN_RECOVERY_REDIRECT});res.json({message:'If recovery is available for this account, instructions will be sent.'});
 }));
 app.post('/api/admin/auth/logout',wrap(async(req,res)=>{
  const jar=cookies(req);if(jar.nd_admin_access&&jar.nd_admin_refresh){const auth=client();await auth.auth.setSession({access_token:jar.nd_admin_access,refresh_token:jar.nd_admin_refresh});await auth.auth.signOut({scope:'local'});}clearSession(res);res.json({ok:true});
 }));
 app.get('/api/admin/session',wrap(async(req,res)=>{const ctx=await session(req,res);const profile=await ctx.db.from(prefix+'profiles').select('display_name,timezone').eq('user_id',ctx.user.id).maybeSingle();const brand=await ctx.db.rpc(prefix+'workspace_brand');dbError(brand.error);let timezone=profile.data?.timezone||'Asia/Kolkata';try{new Intl.DateTimeFormat('en',{timeZone:timezone}).format();}catch{timezone='Asia/Kolkata';}res.json({user:{id:ctx.user.id,email:ctx.user.email,displayName:profile.data?.display_name||ctx.user.email?.split('@')[0],mfaConfigured:!!ctx.user.factors?.some(f=>f.status==='verified')},role:ctx.role,permissions:rolePermissions[ctx.role]||{},timezone,workspaceBrand:brand.data||{}});}));
 app.get('/api/admin/dashboard',wrap(async(req,res)=>{
  const ctx=await session(req,res);requirePermission(ctx.role,'dashboard');
  const since=req.query.from&&Number.isFinite(Date.parse(String(req.query.from)))?new Date(String(req.query.from)).toISOString():new Date(Date.now()-30*86400000).toISOString();
  const until=req.query.to&&Number.isFinite(Date.parse(String(req.query.to)))?new Date(String(req.query.to)).toISOString():new Date().toISOString();
  const metrics=[];
  for(const [module,title,status]of [['leads','New enquiries','new'],['leads','Qualified leads','qualified'],['appointments','Consultations',null],['pages','Published pages','published']]){
   if(!can(ctx.role,module))continue;let query=ctx.db.from(prefix+moduleSpec(module).table).select('id',{count:'exact',head:true}).gte('created_at',since).lte('created_at',until);if(status)query=query.eq('status',status);const result=await query;dbError(result.error);metrics.push({module,title,status,value:result.count});
  }
  const activity=await ctx.db.from(prefix+'audit_events').select('*').order('created_at',{ascending:false}).limit(8);dbError(activity.error);
  let trend=[];let attention=[];
  if(can(ctx.role,'leads')){const result=await ctx.db.from(prefix+'leads').select('id,title,status,created_at,body').gte('created_at',since).lte('created_at',until).order('created_at',{ascending:false}).limit(1000);dbError(result.error);const byDate={};for(const row of result.data||[]){const date=row.created_at.slice(0,10);byDate[date]=(byDate[date]||0)+1;}trend=Object.entries(byDate).sort().map(([date,value])=>({date,value}));attention=(result.data||[]).filter(row=>['new','contacted'].includes(row.status)).slice(0,5);}
  res.json({metrics,trend,attention,activity:activity.data||[],source:'New admin workspace records',observed_at:new Date().toISOString(),timezone:'UTC',from:since,to:until,trendLimit:1000});
 }));
 app.get('/api/admin/integrations/status',wrap(async(req,res)=>{
  const ctx=await session(req,res);requirePermission(ctx.role,'integrations');
  const result=await ctx.db.from(prefix+'integration_connections').select('*').order('updated_at',{ascending:false});dbError(result.error);
  res.json({providers:providers.map(provider=>{const config=result.data?.find(row=>row.body.provider===provider.id&&row.body.environment===providerEnvironment());const configured=providerConfigured(config);const recentlyChecked=config?.body.last_checked_at&&Date.now()-Date.parse(config.body.last_checked_at)<86400000;const status=config?.status==='disconnected'?'disconnected':!configured?'not_connected':config.status==='token_expired'?'token_expired':config.status==='error'?'error':config.status==='connected'&&recentlyChecked?'connected':'not_verified';return {...provider,status,lastSync:config?.body.last_sync_at||null,lastChecked:config?.body.last_checked_at||null,currency:config?.body.currency||null,timezone:config?.body.timezone||null,canSync:supportedSync.has(provider.id),secretReference:secretReference(provider.id),configuration:config||null,reason:status==='connected'?'Read-only provider access was verified. Retest after credential or account changes.':configured?'Test the configured read-only adapter to verify access.':'Configure an approved server credential and its reference. No account is connected automatically.'};})});
 }));
 app.get('/api/admin/inventory',wrap(async(req,res)=>{const ctx=await session(req,res);if(!['pages','services','seo','free-tools'].some(module=>can(ctx.role,module)))throw new ApiError(403,'Permission denied.');res.json({routes:routeInventory(),tools:can(ctx.role,'free-tools')?toolInventory():[],source:'Existing local repository',observed_at:new Date().toISOString()});}));
 app.post('/api/admin/seo/scan',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'seo','write');const scan=localSeoScan();const result=await ctx.db.from(prefix+'seo_scans').insert({title:'Local source metadata scan '+new Date().toISOString().slice(0,10),status:scan.routes.some(route=>route.issues.length)?'open':'resolved',body:scan}).select('id').single();dbError(result.error);res.json({...scan,id:result.data.id});}));
 app.post('/api/admin/tools/calculate',wrap(async(req,res)=>{
  const ctx=await session(req,res);requirePermission(ctx.role,'free-tools');rateLimit('tool:'+ctx.user.id,30);
  const {kind,values}=req.body;let output;
  const n=key=>{const value=Number(values?.[key]);if(!Number.isFinite(value)||value<0||value>1e12)throw new ApiError(400,'Enter valid non-negative inputs.');return value;};
  if(kind==='roi'){const revenue=n('revenue'),cost=n('cost');if(!cost)throw new ApiError(400,'Cost must be greater than zero.');output={value:((revenue-cost)/cost)*100,unit:'%',formula:'(Revenue − cost) ÷ cost × 100'};}
  else if(kind==='cpl'){const spend=n('spend'),leads=n('leads');if(!leads)throw new ApiError(400,'Lead count must be greater than zero.');output={value:spend/leads,unit:'per lead',formula:'Spend ÷ leads'};}
  else if(kind==='time_saved'){const tasks=n('tasks'),minutes=n('minutes'),share=n('share');if(share>100)throw new ApiError(400,'Automation share cannot exceed 100%.');output={value:tasks*minutes*share/6000,unit:'hours',formula:'Tasks × minutes × automation share ÷ 6000'};}
  else throw new ApiError(400,'This tool requires a configured provider.');
  const observed_at=new Date().toISOString();
  if(can(ctx.role,'free-tools','write')){const saved=await ctx.db.from(prefix+'tool_runs').insert({title:'Deterministic '+kind+' test',status:'completed',body:{kind,inputs:values,output,source:'User-input calculation',observed_at}});dbError(saved.error);}
  res.json({...output,source:'Deterministic calculation from your inputs',observed_at});
 }));
 app.post('/api/admin/leads/import',wrap(async(req,res)=>{
  const ctx=await session(req,res);requirePermission(ctx.role,'leads','write');rateLimit('import:'+ctx.user.id,3,60000);
  if(!req.body.approved||!Array.isArray(req.body.rows)||req.body.rows.length>100||!req.body.rows.length)throw new ApiError(400,'Review and approve between 1 and 100 CSV rows.');
  const records=req.body.rows.map(row=>validateRecord('leads',{title:row.name,status:'new',body:{email:String(row.email||'').toLowerCase(),phone:row.phone,company:row.company,service:row.service,source:row.source||'staff_import',consent_at:row.consent_at,marketing_consent:false}}));
  const result=await ctx.db.rpc(prefix+'import_leads',{p_rows:records});dbError(result.error);res.json(result.data);
 }));
 app.get('/api/admin/team/memberships',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'team');const result=await ctx.db.from(prefix+'memberships').select('user_id,role_id,active,created_at');dbError(result.error);res.json({rows:result.data});}));
 app.post('/api/admin/team/membership',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'team','write');if(!isUUID(req.body.userId))throw new ApiError(400,'Enter an existing Auth user UUID.');const result=await ctx.db.rpc(prefix+'assign_membership',{p_user:req.body.userId,p_role:req.body.role,p_active:!!req.body.active});dbError(result.error);res.json({ok:true});}));
 app.get('/api/admin/automations/executions',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'automations');const jobs=await ctx.db.from(prefix+'async_jobs').select('*').order('created_at',{ascending:false}).limit(50);dbError(jobs.error);const runs=await ctx.db.from(prefix+'workflow_runs').select('*').order('created_at',{ascending:false}).limit(50);dbError(runs.error);res.json({jobs:jobs.data,runs:runs.data,source:'New durable queue and execution records'});}));
 app.get('/api/admin/free-tools/runs',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'free-tools');const result=await ctx.db.from(prefix+'tool_runs').select('*').order('created_at',{ascending:false}).limit(50);dbError(result.error);res.json({rows:result.data});}));
 app.post('/api/admin/automations/jobs/:id/retry',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'automations','write');const result=await ctx.db.rpc(prefix+'retry_job',{p_id:req.params.id,p_revision:req.body.revision});dbError(result.error);res.json({ok:true});}));
 app.get('/api/admin/notifications',wrap(async(req,res)=>{const ctx=await session(req,res);const result=await ctx.db.from(prefix+'audit_events').select('id,module,action,details,created_at').order('created_at',{ascending:false}).limit(10);dbError(result.error);res.json({rows:result.data});}));
 app.get('/api/admin/:module/export',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id,'export');
  const result=await filteredQuery(ctx.db,spec,req.query).limit(1000);dbError(result.error);
  const audit=await ctx.db.rpc(prefix+'note_export',{p_module:spec.id,p_count:result.data.length,p_filters:Object.fromEntries(Object.entries(req.query).filter(([key])=>['q','status','source','service','owner_id','from','to','sort','order'].includes(key)))});dbError(audit.error);
  res.type('text/csv').attachment(`${spec.id}-${new Date().toISOString().slice(0,10)}.csv`).send(safeCsv(result.data,['id','title','status','created_at',...spec.fields.map(field=>field.key)]));
 }));
 app.get('/api/admin/:module',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id);
  const page=Math.max(1,Math.min(100000,Number(req.query.page)||1)),size=Math.max(1,Math.min(100,Number(req.query.size)||12));
  const result=await filteredQuery(ctx.db,spec,req.query).range((page-1)*size,page*size-1);dbError(result.error);
  res.json({rows:result.data||[],total:result.count,page,size,source:'New Supabase admin tables',observed_at:new Date().toISOString()});
 }));
 app.post('/api/admin/:module',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id,'write');if(spec.readonly)throw new ApiError(403,'This module is populated by verified sources.');
  const record=validateRecord(spec.id,req.body);if(spec.content&&record.status!=='draft')throw new ApiError(400,'Create the draft before changing its publication status.');
  const result=await ctx.db.from(prefix+spec.table).insert(record).select().single();dbError(result.error);res.status(201).json(result.data);
 }));
 app.get('/api/admin/:module/:id/history',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id);
  const versions=await ctx.db.from(prefix+'versions').select('*').eq('module',spec.id).eq('entity_id',req.params.id).order('revision',{ascending:false}).limit(50);dbError(versions.error);
  const audit=await ctx.db.from(prefix+'audit_events').select('*').eq('module',spec.id).eq('entity_id',req.params.id).order('created_at',{ascending:false}).limit(50);dbError(audit.error);res.json({versions:versions.data,events:audit.data});
 }));
 app.post('/api/admin/:module/:id/restore',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id,'write');
  const prior=await ctx.db.from(prefix+'versions').select('snapshot').eq('module',spec.id).eq('entity_id',req.params.id).eq('revision',req.body.revision).single();dbError(prior.error);
  const {title,slug,body,owner_id}=prior.data.snapshot;const result=await ctx.db.from(prefix+spec.table).update({title,slug,body,owner_id,status:spec.content?'draft':prior.data.snapshot.status}).eq('id',req.params.id).eq('revision',req.body.currentRevision).select().maybeSingle();dbError(result.error);if(!result.data)throw new ApiError(409,'The record changed. Reload before restoring.');res.json(result.data);
 }));
 app.patch('/api/admin/:module/:id',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id,'write');if(spec.readonly)throw new ApiError(403,'This module is read-only.');
  const record=validateRecord(spec.id,req.body);if(spec.id==='appointments'){const prior=await ctx.db.from(prefix+'appointments').select('body').eq('id',req.params.id).single();dbError(prior.error);for(const key of ['request_snapshot','source','consent_at','marketing_consent'])if(prior.data.body[key]!==undefined)record.body[key]=prior.data.body[key];}if(!Number.isInteger(req.body.revision)||req.body.revision<1)throw new ApiError(400,'A current record revision is required.');if(['leads','applicants'].includes(spec.id)){const prior=await ctx.db.from(prefix+spec.table).select('body').eq('id',req.params.id).single();dbError(prior.error);for(const key of spec.id==='leads'?['source','consent_at','marketing_consent','idempotency_key']:['consent_at'])if(prior.data.body[key]!==undefined)record.body[key]=prior.data.body[key];}if(spec.content&&['approved','published','scheduled'].includes(record.status))requirePermission(ctx.role,spec.id,'publish');
  const result=await ctx.db.from(prefix+spec.table).update(record).eq('id',req.params.id).eq('revision',Number(req.body.revision)).select().maybeSingle();dbError(result.error);if(!result.data)throw new ApiError(409,'Another user changed this record. Reload before saving.','revision_conflict');res.json(result.data);
 }));
 app.delete('/api/admin/:module/:id',wrap(async(req,res)=>{
  const spec=moduleSpec(req.params.module),ctx=await session(req,res);requirePermission(ctx.role,spec.id,'delete');
  const current=await ctx.db.from(prefix+spec.table).select('body,status,revision').eq('id',req.params.id).single();dbError(current.error);if(spec.id==='media'&&current.data.body.usage)throw new ApiError(409,'Remove page dependencies before deleting this media record.');
  const result=await ctx.db.from(prefix+spec.table).delete().eq('id',req.params.id).eq('revision',Number(req.query.revision)).select('id');dbError(result.error);if(!result.data?.length)throw new ApiError(409,'Record changed. Reload before deleting.');res.json({ok:true});
 }));
 for(const action of ['connect','test','sync','disconnect'])app.post(`/api/admin/integrations/:id/${action}`,wrap(async(req,res)=>{
  const ctx=await session(req,res);requirePermission(ctx.role,'integrations','write');rateLimit('provider:'+ctx.user.id,10,60000);
  const result=await ctx.db.from(prefix+'integration_connections').select('*').eq('id',req.params.id).single();dbError(result.error);const config=result.data;
  if(action==='disconnect'){const updated=await ctx.db.from(prefix+'integration_connections').update({status:'disconnected',body:{...config.body,secret_ref:'',last_checked_at:null}}).eq('id',config.id).eq('revision',config.revision).select('id').maybeSingle();dbError(updated.error);if(!updated.data)throw new ApiError(409,'Connection changed. Reload before disconnecting.');return res.json({ok:true,message:'This workspace no longer uses the credential reference. Upstream credentials were not altered.'});}
  let outcome;
  try{outcome=await runProvider(config,{mode:action==='sync'?'sync':'test',from:req.body.from,to:req.body.to});}
  catch(error){if(['provider_token_expired','provider_request_failed','provider_unavailable'].includes(error.code))await ctx.db.from(prefix+'integration_connections').update({status:error.code==='provider_token_expired'?'token_expired':'error',body:{...config.body,last_error_code:error.code,last_checked_at:new Date().toISOString()}}).eq('id',config.id).eq('revision',config.revision);throw error;}
  const meta={last_checked_at:outcome.observed_at,currency:outcome.currency,timezone:outcome.timezone,last_error_code:null};
  if(action==='sync'){
   if(outcome.records.length>1000)throw new ApiError(409,'Narrow the date range to sync no more than 1,000 provider observations.');
   const rows=outcome.records.map(row=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(row.date))throw new ApiError(502,'Unsupported provider date.');return{title:`${config.title} · ${row.campaign||row.date}`,slug:`${config.id}/${outcome.provider}/${row.date}/${row.campaign_id||'all'}`,body:{...row,provider:outcome.provider,connection_id:config.id,account_ref:config.body.account_ref,source:outcome.source,observed_at:outcome.observed_at,currency:outcome.currency,timezone:outcome.timezone,attribution:outcome.attribution,range:outcome.range}};});
   const saved=await ctx.db.rpc(prefix+'sync_snapshots',{p_connection:config.id,p_revision:config.revision,p_kind:['google_ads','meta_ads'].includes(outcome.provider)?'campaigns':'analytics',p_rows:rows,p_meta:{...meta,last_sync_at:outcome.observed_at}});dbError(saved.error);
   return res.json({ok:true,observations:rows.length,observed_at:outcome.observed_at});
  }
  const saved=await ctx.db.from(prefix+'integration_connections').update({status:'connected',body:{...config.body,...meta}}).eq('id',config.id).eq('revision',config.revision).select('id').maybeSingle();dbError(saved.error);if(!saved.data)throw new ApiError(409,'The configuration changed. Reload and retest.');
  res.json({ok:true,status:'connected',observed_at:outcome.observed_at,currency:outcome.currency,timezone:outcome.timezone});
 }));
 app.post('/api/admin/media/upload',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'media','write');disabled('Uploads require a reviewed private bucket, restricted upload policies, and a configured malware scanner. Existing buckets were not changed.','storage_setup_required');}));
 app.get('/api/admin/private-file/:id',wrap(async(req,res)=>{const ctx=await session(req,res);requirePermission(ctx.role,'applicants');disabled('Private resume storage is not configured. No public resume URLs are issued.','storage_setup_required');}));
 app.use('/api/admin',(_req,res)=>res.status(404).json({error:'Admin endpoint not found.',code:'not_found'}));
 app.use('/api/admin',(err,req,res,next)=>{if(res.headersSent)return next(err);const status=err.status||500;res.status(status).json({error:err instanceof SyntaxError?'The request contains invalid JSON.':status===500?'The request could not be completed.':err.message,code:err.code||'request_failed'});});
 app.get('/api/public/admin-capabilities',(_req,res)=>res.set('Cache-Control','no-store').json({leadIngestionEnabled:process.env.ND_ADMIN_LEAD_INGESTION_ENABLED==='true'&&!!process.env.SUPABASE_SERVICE_ROLE_KEY}));
 // This new endpoint supplements the existing consultation destination.
 app.post('/api/public/leads',express.json({limit:'24kb'}),wrap(async(req,res)=>{
  protectMutation(req);rateLimit('lead:'+req.ip,5,600000);
  if(process.env.ND_ADMIN_LEAD_INGESTION_ENABLED!=='true')disabled('The supplemental lead destination is not enabled.');
  if(req.body.website)return res.status(202).json({accepted:true});
  const {name,email,phone,service,message,consent,idempotencyKey}=req.body;
  if(!consent||!name||String(name).length>240||!/^\S+@\S+\.\S+$/.test(String(email))||String(message||'').length>5000||!isUUID(idempotencyKey))throw new ApiError(400,'Valid contact details, consent, and a submission ID are required.');
  const body={email:String(email).toLowerCase(),phone:String(phone||'').slice(0,80),service:String(service||'').slice(0,240),notes:String(message||''),source:'contact_page',consent_at:new Date().toISOString(),marketing_consent:false,idempotency_key:idempotencyKey};
  const result=await client(null,true).rpc(prefix+'ingest_lead',{p_title:String(name),p_body:body});dbError(result.error);res.status(202).json({accepted:true});
 }));
 app.get('/api/public/content/:module',wrap(async(req,res)=>{
  if(!['pages','services','blog','careers','case-studies'].includes(req.params.module))throw new ApiError(404,'Content type not found.');
  rateLimit('public-content:'+req.ip,120);
  const result=await client().rpc(prefix+'published',{p_module:req.params.module,p_slug:req.query.slug?String(req.query.slug):null});dbError(result.error);res.set('Cache-Control','no-store').json({rows:result.data||[]});
 }));
 app.use('/api/public',(err,req,res,next)=>{if(res.headersSent)return next(err);res.status(err.status||500).json({error:err.status?err.message:'Request unavailable.',code:err.code||'request_failed'});});
}
function filteredQuery(db,spec,query){
 const sort=['title','status','created_at','updated_at'].includes(query.sort)?query.sort:'updated_at';
 let request=db.from(prefix+spec.table).select('*',{count:'exact'}).order(sort,{ascending:query.order==='asc'}).order('id');
 if(query.q){const q=String(query.q).slice(0,150).replace(/[%_\\]/g,'');request=request.ilike('title',`%${q}%`);}
 if(query.status)request=request.eq('status',String(query.status));
 for(const field of ['source','service','owner_id','account_ref','provider','campaign_id'])if(query[field])request=field==='owner_id'?request.eq('owner_id',String(query[field])):request.eq(`body->>${field}`,String(query[field]));
 for(const [param,op]of [['from','gte'],['to','lte']])if(query[param]&&Number.isFinite(Date.parse(String(query[param]))))request=['campaigns','analytics'].includes(spec.id)?request[op]('body->>date',String(query[param]).slice(0,10)):request[op]('created_at',param==='to'&&/^\d{4}-\d{2}-\d{2}$/.test(String(query[param]))?String(query[param])+'T23:59:59.999Z':new Date(String(query[param])).toISOString());
 return request;
}
