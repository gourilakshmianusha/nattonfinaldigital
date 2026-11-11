import {createHmac,timingSafeEqual} from 'node:crypto';
import {ApiError} from '../admin/security.mjs';

function signingKey() {
 if (!process.env.ND_GROWTH_INGEST_KEY) throw new ApiError(503,'Audit storage is not configured.');
 return process.env.ND_GROWTH_INGEST_KEY;
}
export function signAuditJob(body) {
 return createHmac('sha256',signingKey()).update('natton-audit-job-v1\n'+body).digest('hex');
}
export function readAuditJob(body,signature,now=Date.now()) {
 if (typeof body !== 'string' || Buffer.byteLength(body)>200000 || !/^[a-f0-9]{64}$/.test(signature||'')) throw new ApiError(403,'Invalid audit job.');
 if (!timingSafeEqual(Buffer.from(signature,'hex'),Buffer.from(signAuditJob(body),'hex'))) throw new ApiError(403,'Invalid audit job.');
 const job=JSON.parse(body);
 if (!Number.isFinite(job.issuedAt) || now-job.issuedAt>20*60000 || job.issuedAt>now+60000 || !['seo_aeo_audit','website_grader'].includes(job.id)) throw new ApiError(403,'Expired or unsupported audit job.');
 return job;
}
export async function enqueueAuditJob(job,fetcher=fetch) {
 // URL is a Netlify-provided runtime variable, never a visitor-supplied host.
 const origin=new URL(process.env.URL || 'https://invalid.local');
 if (origin.protocol!=='https:' || origin.hostname==='invalid.local' || origin.username || origin.password) throw new ApiError(503,'The background audit host is not configured.','audit_queue_unavailable');
 const body=JSON.stringify({...job,issuedAt:Date.now()});
 const response=await fetcher(new URL('/.netlify/functions/audit-background',origin),{
  method:'POST',redirect:'error',headers:{'Content-Type':'application/json','X-ND-Audit-Signature':signAuditJob(body)},body,signal:AbortSignal.timeout(8000)
 });
 if (response.status!==202) throw new ApiError(503,'The audit worker could not be started. Please retry.','audit_queue_unavailable');
}
