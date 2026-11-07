// Run locally or in a secure provisioning environment. Output is a one-way hash SQL statement, never the key.
import {randomBytes,createHash} from 'node:crypto';
import {readFileSync,writeFileSync,existsSync,chmodSync} from 'node:fs';
let key=process.env.ND_GROWTH_INGEST_KEY;
if(!key){let env=existsSync('.env')?readFileSync('.env','utf8'):'';key=env.match(/^ND_GROWTH_INGEST_KEY=(.+)$/m)?.[1]?.trim();if(!key){key=randomBytes(32).toString('hex');env+='\nND_GROWTH_INGEST_KEY='+key+'\n';writeFileSync('.env',env,{mode:0o600});}chmodSync('.env',0o600);}
if(!/^[a-f0-9]{64}$/.test(key))throw new Error('Use a securely generated 32-byte hexadecimal ingestion key.');
const digest=createHash('sha256').update(key).digest('hex');
console.log(`-- Apply only to the intended new application database. Keep the matching key in server secrets.\nINSERT INTO nd_growth_private.ingress_keys(id,key_hash) VALUES(true,'${digest}') ON CONFLICT(id) DO UPDATE SET key_hash=EXCLUDED.key_hash;`);
