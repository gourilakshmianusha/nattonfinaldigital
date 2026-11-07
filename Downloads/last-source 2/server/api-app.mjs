import express from 'express';
import { installAdminSitemap } from './admin/sitemap.mjs';
import { installAdminWebhooks } from './admin/webhooks.mjs';
import { installAdminApi } from './admin/api.mjs';

// Shared by the persistent Node server and the Netlify function. Never listen here.
export function createApiApp() {
  const app = express();
  app.disable('x-powered-by');
  // Hosting reverse proxies terminate HTTPS before forwarding to Node.
  app.set('trust proxy', 1);
  // Works without a database request, so a deployment can be diagnosed even when
  // its credentials are absent. Never return key values or filesystem paths.
  app.get('/api/deployment/status', (_req, res) => {
    const storage = Boolean(process.env.ND_GROWTH_INGEST_KEY?.trim());
    const pagespeed = Boolean(process.env.GOOGLE_PSI_KEY?.trim());
    res.set('Cache-Control', 'no-store').json({
      server: 'node',
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'local',
      storageConfigured: storage,
      pagespeedConfigured: pagespeed,
      missing: [!storage && 'ND_GROWTH_INGEST_KEY', !pagespeed && 'GOOGLE_PSI_KEY'].filter(Boolean)
    });
  });
  installAdminSitemap(app);
  installAdminWebhooks(app);
  installAdminApi(app);
  app.use('/api', (_req, res) => res.status(404).json({error:'API endpoint not found.',code:'not_found'}));
  return app;
}
