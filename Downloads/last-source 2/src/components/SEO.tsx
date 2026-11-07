import { useEffect } from 'react';
import { breadcrumbSchema } from './Breadcrumbs';

const CANONICAL_ORIGIN = 'https://nattondigital.com';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  route: string;
  canonicalUrl?: string;
}

export default function SEO({ title, description, image, noIndex = false, route, canonicalUrl }: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // Helper function to find or create meta elements
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Update meta description
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Keep one canonical URL for the current page route.
    const canonicalPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl && /^https?:\/\//.test(canonicalUrl) ? canonicalUrl : `${CANONICAL_ORIGIN}${canonicalPath}`);

    const schemaId = 'natton-seo-schema';
    let schema = document.getElementById(schemaId);
    if (!schema) {
      schema = document.createElement('script');
      schema.id = schemaId;
      schema.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${CANONICAL_ORIGIN}/#organization`,
          name: 'Natton Digital',
          url: `${CANONICAL_ORIGIN}/`,
          logo: `${CANONICAL_ORIGIN}/logo-light.png`,
          email: 'mailto:info@nattondigital.com'
        },
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_ORIGIN}/#website`,
          name: 'Natton Digital',
          url: `${CANONICAL_ORIGIN}/`,
          publisher: { '@id': `${CANONICAL_ORIGIN}/#organization` }
        },
        {
          '@type': 'WebPage',
          '@id': `${CANONICAL_ORIGIN}${canonicalPath}#webpage`,
          url: `${CANONICAL_ORIGIN}${canonicalPath}`,
          name: title,
          description,
          isPartOf: { '@id': `${CANONICAL_ORIGIN}/#website` }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbSchema(route)
        }
      ]
    });

    // 4. Update Open Graph (og:) tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    if (image) {
      const imageUrl = image.startsWith('http') ? image : `${CANONICAL_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`;
      updateMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
      updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', `${title} featured image`);
    }

    // 5. Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (image) {
      const imageUrl = image.startsWith('http') ? image : `${CANONICAL_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`;
      updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
      updateMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', `${title} featured image`);
    }
  }, [title, description, image, noIndex, route, canonicalUrl]);

  return null;
}
