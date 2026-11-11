import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeApiEvent} from '../../server/netlify-event.mjs';

test('rewritten, direct and prefixed API URLs reach the same Express route', () => {
  for (const path of ['/api/tools', '/.netlify/functions/api/tools', '/.netlify/functions/api/api/tools']) {
    const result = normalizeApiEvent({path, rawUrl:'https://example.netlify.app'+path+'?page=2', httpMethod:'POST', body:'{}', headers:{cookie:'session=test'}});
    assert.equal(result.path, '/api/tools');
    assert.equal(new URL(result.rawUrl).pathname, '/api/tools');
    assert.equal(new URL(result.rawUrl).search, '?page=2');
    assert.equal(result.httpMethod, 'POST');
    assert.equal(result.body, '{}');
    assert.equal(result.headers.cookie, 'session=test');
  }
});
test('sitemap and unrelated paths retain their routes', () => {
  assert.equal(normalizeApiEvent({path:'/.netlify/functions/api/sitemap.xml'}).path, '/sitemap.xml');
  assert.equal(normalizeApiEvent({path:'/api/tools/results/id/lead'}).path, '/api/tools/results/id/lead');
  assert.equal(normalizeApiEvent({path:'/.netlify/functions/api-other/tools'}).path, '/.netlify/functions/api-other/tools');
});
