if (!process.env.NETLIFY) await import('../../server/runtime-env.mjs');

// Never log credentials. A successful presence check is not a provider/quota test.
const origin = process.argv[2];
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== origin) throw new Error('Use an HTTPS origin without a trailing slash.');
  try {
    for (const endpoint of ['/api/deployment/status', '/api/tools/health']) {
      const response = await fetch(origin + endpoint, {signal: AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`${endpoint}: HTTP ${response.status}`);
      const data = await response.json();
      const ready = endpoint.endsWith('/status')
        ? data.storageConfigured === true && data.pagespeedConfigured === true
        : data.database === 'reachable' && data.storage === 'configured' && data.pagespeed === true;
      if (!ready) throw new Error(`${endpoint}: server configuration is incomplete. Set ND_GROWTH_INGEST_KEY and GOOGLE_PSI_KEY in the production runtime, then redeploy/restart.`);
    }
    console.log('Live database and growth runtime configuration checks passed. Run Website Grader and download a calculator PDF to verify provider and storage credentials.');
  } catch (error) {
    console.error('Growth deployment check failed:', error.message);
    process.exitCode = 1;
  }
} else {
  // Netlify must validate its injected build environment, never private local files.
  const env = process.env;
  const missing = ['ND_GROWTH_INGEST_KEY', 'GOOGLE_PSI_KEY'].filter(name => !env[name]?.trim());
  if (missing.length) {
    console.error(`Growth deployment blocked: missing ${missing.join(', ')}. Configure Production environment variables for Builds and Functions on Netlify, or private .env.production beside server.mjs on a Node host. Redeploy/restart afterward.`);
    process.exitCode = 1;
  } else {
    console.log('Required growth server settings are present. Verify the deployed runtime with npm run check:growth -- https://your-domain.example');
  }
}
