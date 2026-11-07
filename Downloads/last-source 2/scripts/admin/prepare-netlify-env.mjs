import {readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {parse} from 'dotenv';
import {adminWorkspaceUrl,adminWorkspacePublicKey} from '../../server/admin/workspace.mjs';
// Run locally. Writes an ignored private import file; never prints credentials.
const origin=process.argv[2];if(!origin||new URL(origin).protocol!=='https:'||new URL(origin).origin!==origin)throw new Error('Pass the deployed HTTPS origin without a trailing slash.');
const existing=parse(readFileSync('.env','utf8'));
for(const key of ['ND_GROWTH_INGEST_KEY','GOOGLE_PSI_KEY'])if(!existing[key])throw new Error(key+' is missing from the private local configuration.');
const values={NODE_ENV:'production',SUPABASE_URL:existing.SUPABASE_URL||adminWorkspaceUrl,SUPABASE_PUBLISHABLE_KEY:existing.SUPABASE_PUBLISHABLE_KEY||adminWorkspacePublicKey,ADMIN_ORIGIN:origin,SITE_URL:origin};
for(const [key,value] of Object.entries(existing))if(/^(ND_GROWTH_|ND_ADMIN_|GOOGLE_PSI_KEY$|GOOGLE_CRUX_KEY$|SUPABASE_SERVICE_ROLE_KEY$)/.test(key)&&value)values[key]=value;
const output='.env.netlify-import';writeFileSync(output,Object.entries(values).map(([key,value])=>key+'='+JSON.stringify(value)).join('\n')+'\n',{mode:0o600});chmodSync(output,0o600);
console.log('Created private .env.netlify-import for Netlify environment import. Do not publish, commit or share this file.');
