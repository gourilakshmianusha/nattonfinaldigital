import fs from 'node:fs/promises';
import path from 'node:path';
import { render, allPages } from '../.reference-ssr/entry-server.js';

const dist = path.resolve('dist');
const templateFile = path.join(dist, '.vite/reference-template.html');
const template = await fs.readFile(templateFile, 'utf8').catch(() => fs.readFile(path.join(dist, 'index.html'), 'utf8'));
await fs.writeFile(templateFile, template);
const manifest = JSON.parse(await fs.readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const origin = (process.env.SITE_URL || process.env.URL || 'https://nattondigital.com').replace(/\/$/, '');
const escape = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const home = {path:'/', metaTitle:'Natton Digital | Digital Marketing, AI & Automation Consultancy', metaDescription:'Digital marketing, creative campaigns and AI automation built around your business. Natton Digital connects strategy, delivery and ongoing support for MSMEs and SMBs.'};
const routes = [home,
  {path:'/services/', metaTitle:'Services | Natton Digital', metaDescription:'Website development, SEO, social media, content, paid advertising and AI growth marketing services from Natton Digital.'},
  {path:'/products/', metaTitle:'Growth, Operations & AI Products | Natton Digital', metaDescription:'Explore GrowthOS, BusinessOS, AgenticOS and AI Marketing Platforms. Choose a practical scope around your marketing, operations or creative workflow.'},
  {path:'/industries/', metaTitle:'Industry Digital Marketing & Workflows | Natton Digital', metaDescription:'Explore industry-specific websites, digital marketing and enquiry workflows for healthcare, education, property, manufacturing, retail and professional firms.'},
  ...allPages,
];

function stylesFor(route) {
  const styles = new Set(), seen = new Set();
  function collect(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const item = manifest[key];
    if (!item) return;
    for (const css of item.css || []) styles.add(css);
    for (const dependency of item.imports || []) collect(dependency);
  }
  // Rollup can assign the shared public entry a generated manifest key.
  const publicEntry = Object.keys(manifest).find(key => manifest[key].name === 'ReferenceWebsite');
  collect(publicEntry || 'src/ReferenceWebsite.tsx');
  const prefix = 'src/reference-site/';
  collect(prefix + 'homepage/HomePage.jsx');
  if (route.kind === 'resource') collect(prefix + 'resources/ResourcePages.jsx');
  else if (route.kind === 'product-platform' || route.path === '/products/platforms/') {
    collect(prefix + 'product-platforms/ProductPlatforms.jsx');
    if (route.slug) collect(prefix + `product-platforms/pages/${route.slug}.jsx`);
  } else if (route.path !== '/') collect(prefix + 'CollectionPages.jsx');
  return [...styles].map(css => `<link rel="stylesheet" href="/${css}" />`).join('\n');
}

for (const route of routes) {
  const canonical = origin + route.path;
  const image = origin + (route.photo || (route.path === '/' ? '/hero-journey/cinema/000.webp' : '/media/growthos-poster.webp'));
  const meta = `<title>${escape(route.metaTitle)}</title>
<meta name="description" content="${escape(route.metaDescription)}" />
<link rel="canonical" href="${escape(canonical)}" />
<meta name="robots" content="${route.noindex ? 'noindex,follow' : 'index,follow'}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${escape(route.metaTitle)}" />
<meta property="og:description" content="${escape(route.metaDescription)}" />
<meta property="og:url" content="${escape(canonical)}" />
<meta property="og:image" content="${escape(image)}" />`;
  const html = template.replace(/<!--page-meta-->[\s\S]*?<!--\/page-meta-->/, meta)
    .replace('<div id="root">', () => '<div id="root" data-reference-path="'+escape(route.path)+'">')
    .replace('<!--app-html-->', () => render(route.path))
    .replace('</head>', stylesFor(route) + '\n</head>');
  const destination = path.join(dist, route.path, 'index.html');
  await fs.mkdir(path.dirname(destination), {recursive:true});
  await fs.writeFile(destination, html);
}

// Existing server redirects use these aliases. Serve identical ZIP pages on static hosts.
const aliases = {
  'solutions':'products', 'solutions/growth-os':'products/growth-os',
  'solutions/growthos':'products/growth-os', 'solutions/business-os':'products/business-os',
  'solutions/businessos':'products/business-os', 'solutions/agentic-os':'products/agentic-os',
  'solutions/agenticos':'products/agentic-os', 'solutions/ai-marketing-platform':'products/ai-marketing-platform',
  'industries/education':'industries/education-edtech', 'industries/retail':'industries/retail-ecommerce',
  'home':'', 'homepage':'',
};
for (const [alias, target] of Object.entries(aliases)) {
  const destination = path.join(dist, alias, 'index.html');
  await fs.mkdir(path.dirname(destination), {recursive:true});
  await fs.copyFile(path.join(dist, target, 'index.html'), destination);
}
console.log(`Rendered ${routes.length} ZIP pages and ${Object.keys(aliases).length} existing URL aliases.`);
