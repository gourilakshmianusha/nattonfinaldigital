import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const script = fileURLToPath(new URL('../../scripts/admin/check-growth-deployment.mjs', import.meta.url));
test('Netlify preflight cannot silently use private local files when host settings are absent', () => {
  const env = {...process.env, NETLIFY: 'true'};
  delete env.ND_GROWTH_INGEST_KEY;
  delete env.GOOGLE_PSI_KEY;
  const result = spawnSync(process.execPath, [script], {env, encoding: 'utf8'});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ND_GROWTH_INGEST_KEY, GOOGLE_PSI_KEY/);
});
test('preflight succeeds with injected settings without exposing credentials', () => {
  const result = spawnSync(process.execPath, [script], {env: {...process.env, NETLIFY: 'true', ND_GROWTH_INGEST_KEY: 'private-storage-fixture', GOOGLE_PSI_KEY: 'private-provider-fixture'}, encoding: 'utf8'});
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout + result.stderr, /private-storage-fixture|private-provider-fixture/);
});
