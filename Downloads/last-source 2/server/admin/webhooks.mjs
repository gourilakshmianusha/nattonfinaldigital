import express from 'express';
import { ApiError, rateLimit, verifySignature } from './security.mjs';
import { client, prefix, dbError } from './db.mjs';
export function installAdminWebhooks(app) {
 app.post('/api/webhooks/nd-admin',express.raw({type:'application/json',limit:'32kb'}),async(req,res)=>{
  try {
   rateLimit('webhook:'+req.ip,120);
   if(!process.env.ND_ADMIN_WEBHOOK_SECRET)throw new ApiError(503,'Webhook receiver is not configured.');
   const timestamp=String(req.headers['x-nd-timestamp']||'');
   if(!/^\d{10}$/.test(timestamp)||Math.abs(Date.now()/1000-Number(timestamp))>300)throw new ApiError(401,'Invalid webhook timestamp.');
   const raw=req.body.toString('utf8');
   if(!verifySignature(timestamp+'.'+raw,String(req.headers['x-nd-signature']||''),process.env.ND_ADMIN_WEBHOOK_SECRET))throw new ApiError(401,'Invalid webhook signature.');
   const parsed=JSON.parse(raw);const event={type:String(parsed.type||'external_event').slice(0,100),reference_id:typeof parsed.reference_id==='string'?parsed.reference_id.slice(0,100):null,occurred_at:typeof parsed.occurred_at==='string'?parsed.occurred_at.slice(0,40):null,payload_redacted:true};const key=String(req.headers['x-nd-event-id']||'');if(!key||key.length>200)throw new ApiError(400,'Event identifier required.');
   // Do not accept tokens or credentials in durable event payloads.
   if(/"(?:password|access_token|refresh_token|api_key|service_role_key|client_secret)"\s*:/i.test(raw))throw new ApiError(400,'Secret payloads are not accepted.');
   const result=await client(null,true).rpc(prefix+'enqueue_webhook',{p_key:key,p_payload:event});dbError(result.error);res.status(202).json({accepted:true});
  }catch(error){res.status(error.status||400).json({error:error.status?error.message:'Webhook could not be accepted.'});}
 });
}
