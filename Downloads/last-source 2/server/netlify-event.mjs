// Rewrites preserve /api/* on some Netlify events; direct function invocations
// carry the function prefix instead. Express must receive the same API path.
export function normalizeApiEvent(event) {
  const prefix = '/.netlify/functions/api';
  const incoming = event.path || '/';
  if (incoming !== prefix && !incoming.startsWith(prefix + '/')) return event;
  const suffix = incoming.slice(prefix.length) || '/';
  const path = suffix === '/sitemap.xml' || suffix === '/api' || suffix.startsWith('/api/')
    ? suffix
    : '/api' + (suffix === '/' ? '' : suffix);
  let rawUrl = event.rawUrl;
  if (rawUrl) {
    const url = new URL(rawUrl);
    url.pathname = path;
    rawUrl = url.href;
  }
  return {...event, path, rawUrl};
}
