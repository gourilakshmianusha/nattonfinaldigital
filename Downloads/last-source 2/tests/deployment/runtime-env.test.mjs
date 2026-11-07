import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {loadServerEnvironment} from '../../server/runtime-env.mjs';

test('host variables override production file, and production overrides local defaults',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'natton-runtime-'));
 try{
  writeFileSync(path.join(root,'.env.production'),'NODE_ENV=production\nND_GROWTH_INGEST_KEY=production-fixture\nGOOGLE_PSI_KEY=production-provider\n');
  writeFileSync(path.join(root,'.env'),'NODE_ENV=development\nND_GROWTH_INGEST_KEY=local-fixture\nLOCAL_DEFAULT=available\n');
  const env={GOOGLE_PSI_KEY:'host-provider'};loadServerEnvironment(root,env);
  assert.equal(env.NODE_ENV,'production');assert.equal(env.ND_GROWTH_INGEST_KEY,'production-fixture');assert.equal(env.GOOGLE_PSI_KEY,'host-provider');assert.equal(env.LOCAL_DEFAULT,'available');
 }finally{rmSync(root,{recursive:true,force:true});}
});
