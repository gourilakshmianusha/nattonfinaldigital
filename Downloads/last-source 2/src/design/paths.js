/** Convert v30-style hrefs to the current app RoutePath strings. */
export function hrefToPath(href = '/') {
  if (!href || href === '#') return 'home';
  if (href.startsWith('#')) return href;
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }

  let path = String(href).split('?')[0].split('#')[0];
  path = path.replace(/^\/+/, '').replace(/\/+$/, '');

  const aliases = {
    '': 'home',
    'products/platforms': 'products',
    'products/growth-os': 'solutions/growth-os',
    'products/business-os': 'solutions/business-os',
    'products/agentic-os': 'solutions/agentic-os',
    'products/ai-marketing-platform': 'solutions/ai-marketing-platform',
    'services/content-marketing': 'services/content-marketing-blogging',
    'industries/education-edtech': 'industries/education',
    'privacy-policy': 'privacy-policy',
    'resources': 'resources',
  };

  if (aliases[path] !== undefined) return aliases[path];
  return path || 'home';
}

export function pathToHref(path = 'home') {
  if (!path || path === 'home') return '/';
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('#')) return path;
  return `/${String(path).replace(/^\/+/, '')}`;
}
