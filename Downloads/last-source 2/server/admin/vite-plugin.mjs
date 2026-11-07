import express from 'express';
import { installAdminApi } from './api.mjs';
import { installAdminWebhooks } from './webhooks.mjs';
import { installAdminSitemap } from './sitemap.mjs';

// Use the same API implementation in development, preview, and Express hosting.
// Mount before Vite's SPA fallback so API failures never become HTML responses.
export function createAdminMiddleware() {
  const app = express();
  app.disable('x-powered-by');
  installAdminSitemap(app);
  installAdminWebhooks(app);
  installAdminApi(app);
  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API endpoint not found.', code: 'not_found' });
  });
  return (request, response, next) => {
    const pathname = (request.url || '').split('?')[0];
    if (pathname.startsWith('/api/') || pathname === '/api' || pathname === '/sitemap.xml') {
      return app(request, response, next);
    }
    return next();
  };
}

export function adminApiPlugin() {
  return {
    name: 'natton-admin-api',
    configureServer(server) {
      server.middlewares.use(createAdminMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createAdminMiddleware());
    },
  };
}
