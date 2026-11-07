import test from 'node:test';
import assert from 'node:assert/strict';
import {connection,dbError} from '../../server/admin/db.mjs';
import {adminWorkspaceUrl,adminWorkspacePublicKey} from '../../server/admin/workspace.mjs';
const names=['SUPABASE_URL','VITE_SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','SUPABASE_ANON_KEY','VITE_SUPABASE_PUBLISHABLE_KEY','VITE_SUPABASE_ANON_KEY'];
function env(values,fn){const old=Object.fromEntries(names.map(k=>[k,process.env[k]]));try{for(const k of names)delete process.env[k];Object.assign(process.env,values);fn();}finally{for(const k of names)if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}}
const jwt=claims=>'eyJ.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.fixture';
test('unconfigured deployments use the approved new admin workspace, never the legacy website project',()=>env({},()=>assert.deepEqual(connection(),{url:adminWorkspaceUrl,key:adminWorkspacePublicKey})));
test('explicit URL overrides must have a paired key',()=>env({SUPABASE_URL:'https://another.supabase.co'},()=>assert.throws(connection,e=>e.code==='database_configuration')));
test('matching configured credentials work and public key has precedence over stale anon',()=>env({SUPABASE_URL:adminWorkspaceUrl+'/',SUPABASE_PUBLISHABLE_KEY:adminWorkspacePublicKey,SUPABASE_ANON_KEY:jwt({role:'anon',ref:'old'})},()=>assert.equal(connection().key,adminWorkspacePublicKey)));
test('mixed legacy projects and privileged keys are rejected',()=>{for(const key of [jwt({role:'anon',ref:'old'}),jwt({role:'service_role',ref:'rrukretdwracijqvkopp'}),'sb_secret_fixture'])env({SUPABASE_ANON_KEY:key},()=>assert.throws(connection,e=>e.code==='database_configuration'));});
test('invalid credentials produce actionable errors without leaking provider details',()=>assert.throws(()=>dbError({message:'Invalid API key: synthetic-secret'}),e=>e.code==='database_configuration'&&!e.message.includes('synthetic-secret')));
