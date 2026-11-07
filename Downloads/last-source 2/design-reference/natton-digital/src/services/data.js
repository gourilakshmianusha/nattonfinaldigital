import copy from './page-copy.json';
import definitions from './definitions.json';
import scenes from './human-scenes.json';

const presentation = {
  'seo-services': ['search', 'search', 'search'],
  'website-development': ['web', 'web', 'globe'],
  'google-business-profile': ['local', 'local', 'building'],
  'ppc-google-ads': ['ads', 'ads', 'target'],
  'social-media-marketing': ['social', 'social', 'people'],
  'meta-ads': ['ads', 'ads', 'target'],
  'content-marketing-blogging': ['content', 'content', 'content'],
  'aeo-ai-search': ['knowledge', 'search', 'search'],
  'graphic-design-branding': ['creative', 'content', 'image'],
  'email-marketing': ['email', 'email', 'mail'],
  'ecommerce-development': ['shop', 'shop', 'shop'],
  'analytics-cro': ['analytics', 'analytics', 'chart'],
  'ai-growth-marketing': ['ai', 'ai', 'workflow'],
};

export const servicePages = copy.map(content => {
  const definition = definitions.find(item => item.id === content.id);
  const [motif, artwork, icon] = presentation[content.id];
  return {
    ...definition, content, kind: 'service', slug: content.id, motif, artwork, icon,
    path: definition.url || `/services/${content.id}/`,
    title: definition.name,
    description: content.heroDescription,
    metaTitle: definition.seo || `${definition.name} | Natton Digital`,
    metaDescription: definition.meta || content.heroDescription,
    heroImage: `/media/services/people/${content.id}.webp`,
    sceneImage: `/media/services/people/${content.id}.webp`,
    sceneAlt: scenes.find(scene=>scene.slug===content.id)?.alt || definition.name,
  };
});
export function serviceForPath(path) {
  const normalized = path.replace(/\/$/, '') + '/';
  return servicePages.find(page => page.path === normalized);
}
