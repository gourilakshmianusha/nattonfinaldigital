/// <reference types="vite/client" />

import serviceContent from '../../assets/services/nattondigital_all_services_content.json';
import servicePageCopy from '../../assets/services/nattondigital_service_page_copy.json';

export interface ServicePageSubsection {
  heading: string;
  paragraphs: string[];
}

export interface ServicePageFAQ {
  question: string;
  answer: string;
}

export type ServicePageSectionKind =
  | 'benefits'
  | 'content'
  | 'features'
  | 'process'
  | 'deliverables'
  | 'industries'
  | 'metrics'
  | 'faqs'
  | 'cta';

export interface ServicePageSection {
  heading: string;
  kind: ServicePageSectionKind;
  paragraphs: string[];
  items: string[];
  children: ServicePageSubsection[];
  faqs?: ServicePageFAQ[];
  button?: string;
}

export interface ServicePageContent {
  title: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  sections: ServicePageSection[];
}

export interface Service {
  id: string;
  name: string;
  short: string;
  target: string;
  intro?: string[];
  features?: string[][];
  benefits?: string[][];
  steps?: string[];
  industries?: string[];
  faqs?: string[][];
  deliverables?: string[];
  kpis?: string[];
  url?: string;
  hero?: string;
  seo?: string;
  meta?: string;
  slug?: string;
  image?: string;
  pageContent?: ServicePageContent;
}

const serviceAssets = serviceContent as Service[];
const servicePageCopyById = Object.fromEntries(
  servicePageCopy.map(page => [page.id, page])
) as Record<string, ServicePageContent>;

const bannerModules = import.meta.glob<string>('/assets/services/**/*_banner.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
});
const sectionImageModules = import.meta.glob<string>('/assets/services/**/*_section-visual.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
});
const servicePhotographModules = import.meta.glob<string>(
  '/assets/services/07_Unsplash_Service_Photographs/nattondigital_*_photo.jpg',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
);

function getServiceImageMap(modules: Record<string, string>, suffix: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).flatMap(([path, url]) => {
      const filename = path.split('/').at(-1) ?? '';
      const suffixIndex = filename.lastIndexOf(`_${suffix}.`);
      if (!filename.startsWith('nattondigital_') || suffixIndex < 0) return [];
      return [[filename.slice('nattondigital_'.length, suffixIndex), url]];
    })
  );
}

export const services = serviceAssets.map(service => ({
  ...service,
  pageContent: servicePageCopyById[service.id]
}));

const excludedServiceMenuIds = new Set([
  'crm-and-automation',
  'whatsapp-automation',
  'cloud-telephony',
  'ai-agents-and-workflows',
  'ai-marketing-saas',
  'conversational-ai',
  'ai-calling-agents',
  'rcs-messaging',
  'ai-growth-marketing',
]);

export const agencyServices = services.filter(service => !excludedServiceMenuIds.has(service.id));
// Named artwork supplied for the service detail heroes.
const namedServiceHeroImages: Record<string, string> = {
  'website-development': '/assets/aistudio/services(hero)/website_design_development.jpeg',
  'seo-services': '/assets/aistudio/services(hero)/seo.jpeg',
  'google-business-profile': '/assets/aistudio/services(hero)/google_busineess_profile.jpeg',
  'social-media-marketing': '/assets/aistudio/services(hero)/social_media_marketing.jpeg',
  'meta-ads': '/assets/aistudio/services(hero)/meta_adds.jpeg',
  'content-marketing-blogging': '/assets/aistudio/services(hero)/content_marketing_blog.jpeg',
  'aeo-ai-search': '/assets/aistudio/services(hero)/aeo_ai_search_optimization.jpeg',
  'graphic-design-branding': '/assets/aistudio/services(hero)/graphic_design.jpeg',
  'email-marketing': '/assets/aistudio/services(hero)/email_marketing_automation.jpeg',
  'ecommerce-development': '/assets/aistudio/services(hero)/ecommerce_website_development.jpeg',
  'analytics-cro': '/assets/aistudio/services(hero)/analytics_conversion_optimiztion.jpeg',
};

export const serviceBanners = getServiceImageMap(bannerModules, 'banner');
export const serviceSectionImages = getServiceImageMap(sectionImageModules, 'section-visual');
export const servicePhotographs = getServiceImageMap(servicePhotographModules, 'photo');

export const serviceHeroImages: Record<string, string> = {
  ...namedServiceHeroImages,
  'ppc-google-ads': serviceBanners['ppc-google-ads'],
};

export function getServiceSlug(service: Service): string {
  return service.url?.split('/').filter(Boolean).at(-1) ?? service.slug ?? service.id;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => getServiceSlug(service) === slug);
}

export const serviceDetailPaths = services.map(service => `services/${getServiceSlug(service)}`);
