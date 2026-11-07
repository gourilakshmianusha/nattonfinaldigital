import {readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {parse} from 'dotenv';
import {adminWorkspaceUrl,adminWorkspacePublicKey} from '../../server/admin/workspace.mjs';

const existing=parse(readFileSync('.env','utf8'));
for(const name of ['ND_GROWTH_INGEST_KEY','GOOGLE_PSI_KEY'])if(!existing[name])throw new Error(name+' is missing from the private local configuration.');
const values={NODE_ENV:'production',SUPABASE_URL:existing.SUPABASE_URL||adminWorkspaceUrl,SUPABASE_PUBLISHABLE_KEY:existing.SUPABASE_PUBLISHABLE_KEY||adminWorkspacePublicKey};
for(const [name,value]of Object.entries(existing))if(/^(ND_GROWTH_|ND_ADMIN_|GOOGLE_PSI_KEY$|GOOGLE_CRUX_KEY$|SUPABASE_SERVICE_ROLE_KEY$)/.test(name)&&value)values[name]=value;
// Do not copy localhost/Netlify origins. Same-origin checks derive the HTTPS request
// origin behind the configured proxy unless the host explicitly supplies ADMIN_ORIGIN.
writeFileSync('.env.production',Object.entries(values).map(([name,value])=>name+'='+JSON.stringify(value)).join('\n')+'\n',{mode:0o600});
chmodSync('.env.production',0o600);
console.log('Prepared private .env.production. Keep it in the Node application root, outside public_html/dist. npm start loads it automatically.');
