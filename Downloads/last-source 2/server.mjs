import './server/runtime-env.mjs';
import express from 'express';
import { installBlogPages } from './server/admin/blog-pages.mjs';
import { createApiApp } from './server/api-app.mjs';
import { routeRedirects } from './src/data/routeRedirects.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = createApiApp();
const port = Number(process.env.PORT || 4173);
const distDirectory = path.join(__dirname, 'dist');
const indexFile = path.join(distDirectory, 'index.html');
const siteOrigin = 'https://nattondigital.com';

const validRoutes = new Set([
  '/',
  '/services',
  '/products',
  '/solutions',
  '/compare',
  '/free-tools',
  '/careers',
  '/webinars',
  '/guides',
  '/case-studies',
  '/blog',
  '/ai-readiness-assessment',
  '/roi-calculator',
  '/about',
  '/why-natton-digital',
  '/our-process',
  '/book-demo',
  '/resources',
  '/integrations',
  '/pricing',
  '/contact',
  '/privacy-policy',
  '/terms-of-platform',
  '/admin',
  '/admin',
  '/products/ai-marketing-saas',
  '/products/crm-ai-automation',
  '/products/conversational-ai',
  '/products/whatsapp-automation',
  '/products/ai-agents',
  '/products/ai-calling-agents',
  '/products/cloud-telephony',
  '/products/rcs-messaging',
  '/solutions/growth-os',
  '/solutions/growthos',
  '/solutions/ai-marketing-platform',
  '/solutions/business-os',
  '/solutions/businessos',
  '/solutions/agentic-os',
  '/solutions/agenticos',
  '/industries',
  '/industries/healthcare',
  '/industries/education',
  '/industries/real-estate',
  '/industries/manufacturing',
  '/industries/retail',
  '/industries/retail-ecommerce',
  '/industries/professional-services'
]);

app.use((request, response, next) => {
  const route = request.path.replace(/^\/+|\/+$/g, '');
  const destination = Object.hasOwn(routeRedirects, route) ? routeRedirects[route] : undefined;
  if (!destination) return next();
  const query = request.originalUrl.slice(request.path.length);
  return response.redirect(301, `/${destination}${query}`);
});



installBlogPages(app,distDirectory);

app.get('/p/*', (_req, response) => response.sendFile(indexFile));

app.get('/admin/*', (_req, response) => response.set('Cache-Control', 'no-store').set('X-Robots-Tag','noindex, nofollow').sendFile(indexFile));

app.use(express.static(distDirectory, { extensions: false }));

app.get('*', (request, response) => {
  const requestPath = request.path.replace(/\/+$/, '') || '/';

  if (validRoutes.has(requestPath)) {
    const routeSlug = requestPath === '/' ? 'home' : requestPath.slice(1).replace(/\//g, '-');
    const imageUrl = `${siteOrigin}/seo/feature-${routeSlug}.png`;
    const html = fs.readFileSync(indexFile, 'utf8')
      .replaceAll(`${siteOrigin}/seo/feature-home.png`, imageUrl);
    return response.status(200).type('html').send(html);
  }

  return response.status(404).sendFile(indexFile);
});

app.listen(port, () => {
  console.log(`Natton Digital server listening on port ${port}`);
});
