import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, preview } from 'vite';

async function verifyApi(httpServer) {
  const address = httpServer.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const status = await fetch(origin + '/api/admin/status');
  assert.equal(status.status, 200);
  assert.match(status.headers.get('content-type'), /application\/json/);
  assert.equal((await status.json()).authentication, 'Existing Supabase Auth');
  const session = await fetch(origin + '/api/admin/session');
  assert.equal(session.status, 401);
  assert.match(session.headers.get('content-type'), /application\/json/);
  assert.equal((await session.json()).code, 'unauthenticated');
  const missing = await fetch(origin + '/api/admin/not-an-endpoint');
  assert.match(missing.headers.get('content-type'), /application\/json/);
  const csrf = await fetch(origin + '/api/admin/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.invalid', 'X-ND-Request': 'admin' },
    body: JSON.stringify({ email: 'synthetic@example.invalid', password: 'not-sent-to-supabase' }),
  });
  assert.equal(csrf.status, 403);
  const publicPage = await fetch(origin + '/about');
  assert.equal(publicPage.status, 200);
  assert.match(publicPage.headers.get('content-type'), /text\/html/);
}

test('standard Vite development serves the real admin API without a separate backend', async () => {
  const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0, strictPort: true, hmr: false, watch: null } });
  try { await server.listen(); await verifyApi(server.httpServer); }
  finally { server.httpServer?.closeAllConnections(); await server.close(); }
});

test('Vite preview serves the real admin API before the static SPA fallback', async () => {
  const server = await preview({ logLevel: 'silent', preview: { host: '127.0.0.1', port: 0, strictPort: true } });
  try { await verifyApi(server.httpServer); }
  finally { server.httpServer.closeAllConnections(); await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); }
});
