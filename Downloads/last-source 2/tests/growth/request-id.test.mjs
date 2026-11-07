import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createRequestId} from '../../src/utils/requestId.mjs';
test('uses native UUID where available',()=>assert.equal(createRequestId({randomUUID:()=>'native-fixture'}),'native-fixture'));
test('getRandomValues fallback produces unique standards-compliant UUID v4 IDs',()=>{
 const provider={getRandomValues:array=>webcrypto.getRandomValues(array)};
 const ids=Array.from({length:100},()=>createRequestId(provider));
 for(const id of ids)assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
 assert.equal(new Set(ids).size,100);
});
test('missing crypto gives an actionable message rather than a TypeError',()=>assert.throws(()=>createRequestId({}),/HTTPS/));
