import 'dotenv/config';
import { client, prefix, dbError } from '../../server/admin/db.mjs';
if(!process.env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in the trusted worker environment.');
const db=client(null,true);const now=new Date().toISOString();
// Published transitions remain atomic with database revisions and audit events.
for(const table of ['pages','services','posts','jobs','case_studies']) {
 const result=await db.from(prefix+table).select('id,revision,body').eq('status','scheduled').lte('body->>scheduled_at',now).limit(50);dbError(result.error);
 for(const record of result.data||[]) { const update=await db.from(prefix+table).update({status:'published'}).eq('id',record.id).eq('revision',record.revision);dbError(update.error); }
}
// No external actions run until a provider-specific adapter is reviewed and installed.
const jobs=await db.from(prefix+'async_jobs').select('id,revision,body').eq('status','queued').limit(50);dbError(jobs.error);
for(const job of jobs.data||[]) {if(job.body.next_attempt_at&&Date.parse(job.body.next_attempt_at)>Date.now())continue;const update=await db.from(prefix+'async_jobs').update({status:'blocked',body:{...job.body,last_error:'Provider adapter is not configured. No external action performed.',next_attempt_at:null}}).eq('id',job.id).eq('revision',job.revision);dbError(update.error);}
console.log('New admin scheduled content reviewed; unconfigured external jobs held.');
