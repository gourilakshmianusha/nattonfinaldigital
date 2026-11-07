import products from './reference-site/data/products.json';
import industries from './reference-site/data/industries.json';
import services from './reference-site/services/definitions.json';
import platforms from './reference-site/product-platforms/definitions.json';
import articles from './reference-site/resources/articles.json';

export const referenceRoutes = new Set([
  '/', '/homepage/', '/page-collection/', '/services/', '/products/',
  '/products/platforms/', '/industries/', '/about/', '/contact/', '/book-demo/',
  '/resources/', '/free-tools/', '/ai-readiness-assessment/', '/roi-calculator/',
  '/blog/', '/compare/', '/our-process/', '/privacy-policy/',
  ...products.map(page => page.path), ...industries.map(page => page.path),
  ...services.map(page => page.url), ...platforms.map(page => page.path),
  ...articles.map(page => `/blog/${page.slug}/`),
]);

// Old links and existing server redirects continue to reach the corresponding ZIP page.
const aliases: Record<string, string> = {
  '/home/': '/', '/index.html/': '/', '/solutions/': '/products/',
  '/solutions/growth-os/': '/products/growth-os/',
  '/solutions/growthos/': '/products/growth-os/',
  '/solutions/business-os/': '/products/business-os/',
  '/solutions/businessos/': '/products/business-os/',
  '/solutions/agentic-os/': '/products/agentic-os/',
  '/solutions/agenticos/': '/products/agentic-os/',
  '/solutions/ai-marketing-platform/': '/products/ai-marketing-platform/',
  '/industries/education/': '/industries/education-edtech/',
  '/industries/retail/': '/industries/retail-ecommerce/',
  '/services/content-marketing/': '/services/content-marketing-blogging/',
  '/products/ai-growth-marketing/': '/services/ai-growth-marketing/',
  '/solutions/ai-growth-marketing/': '/services/ai-growth-marketing/',
};

export function referencePath(pathname: string): string | null {
  const normalized = '/' + pathname.split('/').filter(Boolean).join('/') + '/';
  const path = normalized === '//' ? '/' : normalized;
  const resolved = aliases[path] || (path.startsWith('/p/blog/') ? path.slice(2) : path);
  if (referenceRoutes.has(resolved) || /^\/blog\/[a-z0-9][a-z0-9/-]{0,199}\/$/.test(resolved)) return resolved;
  if (resolved.startsWith('/solutions/')) {
    const product = resolved.replace('/solutions/', '/products/');
    if (referenceRoutes.has(product)) return product;
  }
  return null;
}
