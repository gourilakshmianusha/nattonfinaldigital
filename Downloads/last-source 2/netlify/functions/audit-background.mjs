import {readAuditJob} from '../../server/growth/audit-jobs.mjs';
import {executeBackgroundAudit} from '../../server/growth/api.mjs';

// The -background filename gives this worker Netlify's longer execution window.
export async function handler(event) {
 if (event.httpMethod!=='POST') return {statusCode:405};
 let job;
 try {
  const headers=Object.fromEntries(Object.entries(event.headers||{}).map(([key,value])=>[key.toLowerCase(),value]));
  const body=event.isBase64Encoded?Buffer.from(event.body||'','base64').toString('utf8'):event.body;
  job=readAuditJob(body,headers['x-nd-audit-signature']);
 } catch { return {statusCode:403}; }
 await executeBackgroundAudit(job);
 return {statusCode:200};
}
