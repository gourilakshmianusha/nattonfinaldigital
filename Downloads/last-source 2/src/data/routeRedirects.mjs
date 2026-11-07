// Legacy detail URLs stay usable after the Products / Solutions rename.
const productSlugs = [
  'ai-marketing-saas', 'crm-ai-automation', 'conversational-ai',
  'whatsapp-automation', 'ai-agents', 'ai-calling-agents',
  'cloud-telephony', 'rcs-messaging',
];
const solutionSlugs = [
  'growth-os', 'growthos', 'ai-marketing-platform',
  'business-os', 'businessos', 'agentic-os', 'agenticos',
];
export const routeRedirects = Object.fromEntries([
  ...productSlugs.map(slug => [`solutions/${slug}`, `products/${slug}`]),
  ...solutionSlugs.map(slug => [`products/${slug}`, `solutions/${slug}`]),
  ['solutions/ai-growth-marketing', 'services/ai-growth-marketing'],
  ['products/ai-growth-marketing', 'services/ai-growth-marketing'],
  ['guides', 'resources'],
  ['webinars', 'resources'],
]);
