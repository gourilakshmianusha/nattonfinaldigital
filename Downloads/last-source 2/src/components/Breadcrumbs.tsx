import { ChevronRight, Home } from 'lucide-react';
import { RoutePath } from '../types';
import { products, solutions } from '../data/navigation';
import { routeRedirects } from '../data/routeRedirects.mjs';

const SITE_ORIGIN = 'https://nattondigital.com';

const labelOverrides: Record<string, string> = {
  'ai-growth-marketing': 'AI Growth Marketing',
  'ai-marketing-saas': 'AI Marketing SaaS',
  'crm-ai-automation': 'CRM & AI Automation',
  'conversational-ai': 'Conversational AI',
  'whatsapp-automation': 'WhatsApp Automation',
  'ai-calling-agents': 'AI Calling Agents',
  'cloud-telephony': 'Cloud Telephony',
  'rcs-messaging': 'RCS Messaging',
  'growthos': 'GrowthOS™',
  'businessos': 'BusinessOS™',
  'agenticos': 'AgenticOS™',
  'growth-os': 'GrowthOS',
  'ai-marketing-platform': 'AI Marketing Platform',
  'business-os': 'BusinessOS',
  'agentic-os': 'AgenticOS',
  'real-estate': 'Real Estate',
  'retail-ecommerce': 'Retail & E-commerce',
  'professional-services': 'Professional Services',
  'ai-readiness-assessment': 'AI Readiness Assessment',
  'roi-calculator': 'ROI Calculator',
  'free-tools': 'Free Tools',
  'case-studies': 'Case Studies',
  'why-natton-digital': 'Why Natton Digital',
  'our-process': 'Our Process',
  'book-demo': 'Book a Demo',
  'privacy-policy': 'Privacy Policy',
  'terms-of-platform': 'Terms of Platform'
};

function labelFor(value: string): string {
  return labelOverrides[value] || value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getBreadcrumbItems(requestedPath: string): { label: string; path?: RoutePath }[] {
  const cleanPath = requestedPath.replace(/^\/+|\/+$/g, '');
  const path = Object.hasOwn(routeRedirects, cleanPath) ? routeRedirects[cleanPath] : cleanPath;
  if (!path || path === 'home') return [{ label: 'Home', path: 'home' }];
  if (['free-tools','roi-calculator','ai-readiness-assessment'].includes(path)) return [
    { label: 'Home', path: 'home' },
    { label: 'Resources', path: 'resources' },
    { label: path === 'free-tools' ? 'Free Growth Tools' : path === 'roi-calculator' ? 'ROI & Automation Calculators' : 'AI Readiness Assessment', path: path as RoutePath },
  ];
  if (path === 'blog') return [
    { label: 'Home', path: 'home' },
    { label: 'Resources', path: 'resources' },
    { label: 'Blogs', path: 'blog' },
  ];
  const segments = path.split('/');
  const items: { label: string; path?: RoutePath }[] = [{ label: 'Home', path: 'home' }];
  if (segments.length > 1) {
    const parent = segments[0];
    items.push({ label: labelFor(parent), path: ['products', 'solutions', 'services', 'industries'].includes(parent) ? parent as RoutePath : undefined });
  }
  const catalogItem = [...products, ...solutions].find(item => item.path === path);
  items.push({ label: catalogItem?.name || labelFor(segments[segments.length - 1]), path: path as RoutePath });
  return items;
}

interface BreadcrumbsProps {
  path: RoutePath;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function Breadcrumbs({ path, setPath, darkMode }: BreadcrumbsProps) {
  if (path === 'home') return null;
  const items = getBreadcrumbItems(path);

  return (
    <nav aria-label="Breadcrumb" className={`border-b ${darkMode ? 'border-white/[0.06] bg-[#110B33] text-gray-400' : 'border-gray-200 bg-[#F5F9FA] text-gray-500'}`}>
      <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.path}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3 w-3 opacity-50" aria-hidden="true" />}
              {isCurrent || !item.path ? (
                <span aria-current={isCurrent ? "page" : undefined} className={darkMode ? 'text-primary' : 'text-[#087f8c]'}>{item.label}</span>
              ) : (
                <a href={item.path === 'home' ? '/' : `/${item.path}`} onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault(); setPath(item.path!);
                }} className="inline-flex items-center gap-1 rounded hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4">
                  {index === 0 && <Home className="h-3 w-3" aria-hidden="true" />}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function breadcrumbSchema(path: string) {
  return getBreadcrumbItems(path).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: `${SITE_ORIGIN}${item.path === 'home' ? '/' : item.path ? `/${item.path}` : `/${path.split('/')[0]}`}`
  }));
}
