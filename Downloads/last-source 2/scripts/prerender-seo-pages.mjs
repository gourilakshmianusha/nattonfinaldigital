import fs from 'node:fs';
import { adminModules } from '../src/admin/modules.mjs';
import { routeRedirects } from '../src/data/routeRedirects.mjs';
import path from 'node:path';

const serviceContent = JSON.parse(fs.readFileSync(path.resolve('assets/services/nattondigital_all_services_content.json'), 'utf8'));
const serviceRoutes = ['services', ...serviceContent.map(service => `services/${service.url?.split('/').filter(Boolean).at(-1) || service.slug || service.id}`)];
const routes = [...adminModules.map(module => `admin/${module.id}`), 'admin/login', ...serviceRoutes, 'products', 'solutions', 'industries', 'home','compare','free-tools','careers','case-studies','blog','ai-readiness-assessment','roi-calculator','about','why-natton-digital','our-process','book-demo','resources','integrations','pricing','contact','privacy-policy','terms-of-platform','admin','products/ai-growth-marketing','products/ai-marketing-saas','products/crm-ai-automation','products/conversational-ai','products/whatsapp-automation','products/ai-agents','products/ai-calling-agents','products/cloud-telephony','products/rcs-messaging','solutions/growth-os','solutions/growthos','solutions/ai-marketing-platform','solutions/business-os','solutions/businessos','solutions/agentic-os','solutions/agenticos','industries/healthcare','industries/education','industries/real-estate','industries/manufacturing','industries/retail','industries/retail-ecommerce','industries/professional-services'];
const dist = path.resolve('dist');
const homeHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// SITE_URL is the canonical public domain on any host. Netlify supplies URL and
// Vercel supplies VERCEL_URL automatically when SITE_URL is not configured.
const origin = (process.env.SITE_URL || process.env.URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || 'https://nattondigital.com').replace(/\/$/, '');

for (const route of routes) {
  const image = `${origin}/seo/feature-${route.replaceAll('/', '-')}.png`;
  const html = route === 'products/ai-growth-marketing'
    ? `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/services/ai-growth-marketing"><link rel="canonical" href="${origin}/services/ai-growth-marketing"><title>AI Growth Marketing | Natton Digital</title></head><body><a href="/services/ai-growth-marketing">Explore AI Growth Marketing</a></body></html>`
    : homeHtml.replace(/https?:\/\/[^/]+\/seo\/feature-home\.png/g, image);
  const file = route === 'home' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// Static hosting receives the same legacy redirects as the Express server.
for (const [legacy, destination] of Object.entries(routeRedirects)) {
  const file = path.join(dist, legacy, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/${destination}"><link rel="canonical" href="${origin}/${destination}"><title>Page moved | Natton Digital</title><script>location.replace('/${destination}'+location.search+location.hash)</script></head><body><a href="/${destination}">Continue to the updated page</a></body></html>`);
}
