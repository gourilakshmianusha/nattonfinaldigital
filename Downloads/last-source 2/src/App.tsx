import './resources-typography.css';
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { RoutePath } from './types';
import { routeRedirects } from './data/routeRedirects.mjs';
import Header from './components/Header';
import Footer from './components/Footer';
import BrandDetailTheme from './components/theme/BrandDetailTheme';
import FloatingCTA from './components/FloatingCTA';
import SEO from './components/SEO';
import Breadcrumbs from './components/Breadcrumbs';
import { Sparkles, CheckCircle, ShieldCheck, Cpu } from 'lucide-react';
import { serviceDetailPaths, services, getServiceSlug } from './data/services';

const Home = lazy(() => import('./pages/Home'));
const ServicesOverview = lazy(() => import('./pages/ServicesOverview'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Solutions = lazy(() => import('./pages/Solutions'));
const SolutionsOverview = lazy(() => import('./pages/SolutionsOverview'));
const Products = lazy(() => import('./pages/Products'));
const IndustriesOverview = lazy(() => import('./pages/IndustriesOverview'));
const Industries = lazy(() => import('./pages/Industries'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Blog = lazy(() => import('./pages/Blog'));
const Tools = lazy(() => import('./pages/Tools'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const WhyNattonDigital = lazy(() => import('./pages/WhyNattonDigital'));
const OurProcess = lazy(() => import('./pages/OurProcess'));
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Compare = lazy(() => import('./pages/Compare'));
const FreeTools = lazy(() => import('./pages/FreeTools'));
const Careers = lazy(() => import('./pages/Careers'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PublishedContent = lazy(() => import('./pages/PublishedContent'));
const Admin = lazy(() => import('./pages/Admin'));

const SEO_METADATA: Record<string, { title: string; description: string; image: string }> = {
  'home': {
    title: 'Natton Digital | Scale Your Business with AI-Powered Operations',
    description: 'Deploy custom-trained AI Agents, automated CRM pipelines, WhatsApp Business bots, and programmatic SEO models for 10x growth with zero manual overhead.',
    image: '/logo-dark.png'
  },
  'services': {
    title: 'Digital Marketing & AI Growth Services | Natton Digital',
    description: 'Grow your business with website development, SEO, AEO, Google and Meta Ads, social media, content, email marketing, and conversion optimization.',
    image: '/logo-dark.png'
  },
  ...Object.fromEntries(services.map(service => [
    `services/${getServiceSlug(service)}`,
    {
      title: service.seo || `${service.name} | Natton Digital`,
      description: service.meta || service.short,
      image: '/logo-dark.png'
    }
  ])),
  'industries': {
    title: 'Industries We Serve | Natton Digital',
    description: 'Explore marketing, enquiry management and workflow support for healthcare, education, real estate, manufacturing, retail and professional services.',
    image: '/hero-digital-ai.jpg'
  },
  'solutions': {
    title: 'Business Solutions | Natton Digital',
    description: 'Explore GrowthOS, AI Marketing Platform, BusinessOS, and AgenticOS for connected business growth.',
    image: '/logo-dark.png'
  },
  'products': {
    title: 'AI & Business Automation Products | Natton Digital',
    description: 'Explore connected marketing software, CRM automation, customer communication and AI workflow solutions built around your business.',
    image: '/logo-dark.png'
  },
  'products/ai-marketing-saas': {
    title: "AI Marketing Software & SaaS Development | Natton Digital",
    description: "Custom AI marketing software for content, SEO, campaigns, review replies and lead prioritisation. Natton plans, builds and supports your team’s workflow.",
    image: '/logo-dark.png'
  },
  'products/crm-ai-automation': {
    title: "CRM & Marketing Automation Solutions | Natton Digital",
    description: "Connect customer records, sales pipelines, bookings, email and WhatsApp with CRM automation. Natton plans, builds and supports a setup around your business.",
    image: '/logo-dark.png'
  },
  'products/conversational-ai': {
    title: "Conversational AI & Chatbot Solutions | Natton Digital",
    description: "Connect WhatsApp, AI calling, cloud telephony and RCS around one customer journey. Natton designs channel workflows, CRM context and human handover.",
    image: '/logo-dark.png'
  },
  'products/whatsapp-automation': {
    title: "WhatsApp Automation & Chatbot Services | Natton Digital",
    description: "Connect WhatsApp chatbots, campaigns, bookings, catalogues and support with your CRM. Natton designs, integrates and supports your customer journeys.",
    image: '/logo-dark.png'
  },
  'products/ai-calling-agents': {
    title: "AI Calling Agent Development & Integration | Natton Digital",
    description: "Custom AI calling agents for routine enquiries, qualification and appointment workflows. Natton designs voice journeys, system connections and human handover.",
    image: '/logo-dark.png'
  },
  'products/cloud-telephony': {
    title: "Cloud Telephony & IVR Solutions | Natton Digital",
    description: "Organise business calls with cloud telephony, IVR, call routing and CRM integration. Natton plans, configures and supports calling workflows around your team.",
    image: '/logo-dark.png'
  },
  'products/rcs-messaging': {
    title: "RCS Business Messaging Solutions | Natton Digital",
    description: "Create rich business messaging journeys with RCS cards, carousels and useful actions. Natton plans campaigns, integrations and fallback around supported audiences.",
    image: '/logo-dark.png'
  },
  'products/ai-agents': {
    title: "AI Agents & Workflow Automation Services | Natton Digital",
    description: "Connect apps and reduce repetitive work with custom AI agents and workflow automation. Natton maps, builds, tests and supports processes around your business.",
    image: '/logo-dark.png'
  },
  'solutions/growth-os': {
    title: "GrowthOS | Digital Marketing for MSMEs & SMBs | Natton",
    description: "Connect your website, SEO, content and campaigns with GrowthOS. A tailored digital marketing plan for MSMEs and SMBs, with ongoing support from Natton.",
    image: "/media/ten-pages/growth-os/growthos-poster.webp"
  },
  'solutions/growthos': {
    title: "GrowthOS | Digital Marketing for MSMEs & SMBs | Natton",
    description: "Connect your website, SEO, content and campaigns with GrowthOS. A tailored digital marketing plan for MSMEs and SMBs, with ongoing support from Natton.",
    image: "/media/ten-pages/growth-os/growthos-poster.webp"
  },
  'solutions/ai-marketing-platform': {
    title: "AI Marketing Platforms | Content & Creative Tools | Natton",
    description: "Connect AI-assisted copy, visuals and campaign planning with a workflow built around your brand. Tailored tool setup and platform development from Natton.",
    image: "/media/ten-pages/ai-marketing-platform/products/ai-marketing-platform-preview.svg"
  },
  'solutions/business-os': {
    title: "BusinessOS | CRM & Workflow Automation | Natton Digital",
    description: "Connect CRM, conversations, support and team workflows with BusinessOS. HighLevel-led implementations and scoped automation for established MSMEs and SMBs.",
    image: "/media/ten-pages/business-os/products/business-os-preview.svg"
  },
  'solutions/businessos': {
    title: "BusinessOS | CRM & Workflow Automation | Natton Digital",
    description: "Connect CRM, conversations, support and team workflows with BusinessOS. HighLevel-led implementations and scoped automation for established MSMEs and SMBs.",
    image: "/media/ten-pages/business-os/products/business-os-preview.svg"
  },
  'solutions/agentic-os': {
    title: "AgenticOS | Custom AI Agents & Workflows | Natton Digital",
    description: "Build scoped AI-agent workflows with approved tools, human review and evaluation. AgenticOS connects advanced automation to a process your team can manage.",
    image: "/media/ten-pages/agentic-os/products/agentic-os-preview.svg"
  },
  'solutions/agenticos': {
    title: "AgenticOS | Custom AI Agents & Workflows | Natton Digital",
    description: "Build scoped AI-agent workflows with approved tools, human review and evaluation. AgenticOS connects advanced automation to a process your team can manage.",
    image: "/media/ten-pages/agentic-os/products/agentic-os-preview.svg"
  },
  'industries/healthcare': {
    title: "Healthcare Marketing & Patient Enquiries | Natton Digital",
    description: "Healthcare marketing for hospitals, practices and diagnostics. Connect website design, SEO, local visibility and administrative enquiry follow-up with Natton.",
    image: "/media/ten-pages/healthcare/industries/healthcare.webp"
  },
  'industries/education': {
    title: "Education & EdTech Marketing Services | Natton Digital",
    description: "Education marketing for institutions, coaching and EdTech. Connect course pages, SEO, campaigns and admissions follow-up around informed learner decisions.",
    image: "/media/ten-pages/education-edtech/industries/education-edtech.webp"
  },
  'industries/real-estate': {
    title: "Real Estate Digital Marketing & CRM | Natton Digital",
    description: "Connect property websites, SEO, campaigns and CRM follow-up with Natton Digital. Marketing and enquiry workflows for developers, brokers and real estate teams.",
    image: "/media/ten-pages/real-estate/industries/real-estate.webp"
  },
  'industries/manufacturing': {
    title: "Manufacturing & B2B Marketing Services | Natton Digital",
    description: "Make your manufacturing capabilities easier to find with websites, SEO, B2B campaigns and structured RFQ follow-up from Natton Digital.",
    image: "/media/ten-pages/manufacturing/industries/manufacturing.webp"
  },
  'industries/retail-ecommerce': {
    title: "Retail & Ecommerce Marketing | Natton Digital",
    description: "Connect retail discovery, ecommerce websites, SEO, campaigns and customer follow-up. A practical marketing plan for stores and growing brands with Natton Digital.",
    image: "/media/ten-pages/retail-ecommerce/industries/retail-ecommerce.webp"
  },
  'industries/retail': {
    title: "Retail & Ecommerce Marketing | Natton Digital",
    description: "Connect retail discovery, ecommerce websites, SEO, campaigns and customer follow-up. A practical marketing plan for stores and growing brands with Natton Digital.",
    image: "/media/ten-pages/retail-ecommerce/industries/retail-ecommerce.webp"
  },
  'industries/professional-services': {
    title: "Professional Services Marketing | Natton Digital",
    description: "Make expertise easier to understand with professional-services websites, SEO, content and organised enquiry follow-up. Build a practical plan with Natton Digital.",
    image: "/media/ten-pages/professional-services/industries/professional-services.webp"
  },
  'case-studies': {
    title: 'Verifiable AI & Automation Case Studies | Natton Digital',
    description: 'Read verified ROI case studies showcasing cross-industry operational scaling and massive administrative savings.',
    image: '/logo-dark.png'
  },
  'blog': {
    title: 'AI Operations, CRM & Tech Insights Blog | Natton Digital',
    description: 'Expert articles and tutorials detailing n8n workflows, WhatsApp business setups, conversational AI, and SEO strategies.',
    image: '/logo-dark.png'
  },
  'ai-readiness-assessment': {
    title: 'Free AI Readiness Assessment & Diagnostic | Natton Digital',
    description: 'Take our 6-step operational audit to benchmark your business, discover automation gaps, and get a tailored AI roadmap.',
    image: '/logo-dark.png'
  },
  'roi-calculator': {
    title: 'AI & Automation Cash ROI Calculator | Natton Digital',
    description: 'Calculate your exact monthly and annual dollar/time savings of integrating GrowthOS and n8n pipelines.',
    image: '/logo-dark.png'
  },
  'contact': {
    title: 'Contact Our AI Transformation Engineers | Natton Digital',
    description: 'Connect with Natton Digital developers. Inquire about customized CRM setups, WhatsApp pipelines, or book a strategy session.',
    image: '/logo-dark.png'
  },
  'privacy-policy': {
    title: 'Privacy Policy | Natton Digital',
    description: 'Learn how Natton Digital collects, uses, protects, and manages information across its platform and services.',
    image: '/logo-dark.png'
  },
  'terms-of-platform': {
    title: 'Terms of Platform | Natton Digital',
    description: 'Review the terms that govern access to and use of Natton Digital platform services.',
    image: '/logo-dark.png'
  },
  'admin': {
    title: 'Admin Login | Natton Digital',
    description: 'Private administration portal.',
    image: '/logo-dark.png'
  },
  'integrations': {
    title: 'Enterprise Integrations & Workflow Automation | Natton Digital',
    description: 'Explore supported CRM, communication, AI, payment, ERP, marketing, and database integrations.',
    image: '/logo-dark.png'
  },
  'about': {
    title: 'About Natton Digital | Pioneers of AI-Powered Growth',
    description: 'Learn about our mission to democratize enterprise-grade AI automation, CRM pipelines, and digital scale for MSMEs globally.',
    image: '/logo-dark.png'
  },
  'why-natton-digital': {
    title: 'Why Partner With Natton Digital? | Enterprise AI Engineers',
    description: 'We combine standard SDK engineering, rigorous security standards, and direct CRM integrations with no mock data.',
    image: '/logo-dark.png'
  },
  'our-process': {
    title: 'Our 4-Step AI & CRM Integration Process | Natton Digital',
    description: 'From initial audit to workflow blueprints mapping, custom development, and continuous operational scaling.',
    image: '/logo-dark.png'
  },
  'book-demo': {
    title: 'Contact Natton Digital | Digital Marketing & AI',
    description: 'Contact Natton Digital about digital marketing, AI, automation, and business growth.',
    image: '/logo-dark.png'
  },
  'pricing': {
    title: 'Flexible AI Automation Pricing & Packages | Natton Digital',
    description: 'Clear, transparent packages for AI Marketing, Custom CRM integration, and enterprise-grade AgenticOS.',
    image: '/logo-dark.png'
  },
  'compare': {
    title: 'Natton Digital vs. Traditional Agencies | AI Operations',
    description: 'See how automated n8n pipelines and GrowthOS acquisition software stack up against slow human operational models.',
    image: '/logo-dark.png'
  },
  'free-tools': {
    title: 'Free AI Content Studio, Calculators & SOPs | Natton Digital',
    description: 'Unlock our suite of free tools including the ROI calculator, AI copywriter, SEO audit grader, and compliance checklists.',
    image: '/logo-dark.png'
  },
  'careers': {
    title: 'Careers at Natton Digital | Join the AI Revolution',
    description: 'We are hiring AI Solutions Engineers, Automation Specialists, and Growth Strategists. Join our remote team today.',
    image: '/logo-dark.png'
  },
  'resources': {
    title: 'Free Marketing & AI Strategy Resources | Natton Digital',
    description: 'Browse our full resource library, diagnostic tools, pricing plans, and integration guides.',
    image: '/logo-dark.png'
  },
  
};

const getFeatureImage = (route: string): string => {
  return `/seo/feature-${route.replace(/\//g, '-')}.png`;
};

const ROUTES_WITH_PAGE_BREADCRUMBS = new Set<string>([
  'products/ai-marketing-saas', 'products/crm-ai-automation',
  'products/conversational-ai', 'products/whatsapp-automation', 'products/ai-agents',
  'products/ai-calling-agents', 'products/cloud-telephony', 'products/rcs-messaging',
  'solutions/growth-os', 'solutions/growthos', 'solutions/ai-marketing-platform',
  'solutions/business-os', 'solutions/businessos', 'solutions/agentic-os', 'solutions/agenticos',
  'industries/healthcare', 'industries/education', 'industries/real-estate',
  'industries/manufacturing', 'industries/retail', 'industries/retail-ecommerce',
  'industries/professional-services', 'case-studies',
  'contact', 'about', 'why-natton-digital', 'our-process', 'book-demo',
  'resources', 'integrations', 'products', 'solutions', 'industries', 'tools', 'services',
  ...serviceDetailPaths
]);

function resolvePathname(pathname: string): string {
  const route = pathname.replace(/^\/+|\/+$/g, '');
  return Object.hasOwn(routeRedirects, route) ? routeRedirects[route] : route;
}

function getInitialLocation(): { path: RoutePath; notFound: boolean } {
  if (typeof window === 'undefined') return { path: 'home', notFound: false };

  const pathname = resolvePathname(window.location.pathname);
  const hash = window.location.hash;
  if ((pathname === 'admin' || pathname.startsWith('admin/')) || hash === '#/admin' || hash.endsWith('/admin')) {
    return { path: (pathname.startsWith('admin/') ? pathname : 'admin') as RoutePath, notFound: false };
  }
  if (pathname.startsWith('p/')) return { path: pathname as RoutePath, notFound: false };
  if (!pathname) return { path: 'home', notFound: false };
  if (pathname in SEO_METADATA) return { path: pathname as RoutePath, notFound: false };
  return { path: 'home', notFound: true };
}

export default function App() {
  const initialLocation = getInitialLocation();
  const [path, setCurrentPath] = useState<RoutePath>(
    initialLocation.path === 'book-demo' ? 'contact' : initialLocation.path
  );
  const setPath = (requestedPath: RoutePath) => {
    setCurrentPath(requestedPath === 'book-demo' ? 'contact' : requestedPath);
  };
  const [notFound, setNotFound] = useState(initialLocation.notFound);
  const darkMode = false;
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
  const [activeBlogSEO, setActiveBlogSEO] = useState<{ title: string; description: string; image?: string } | null>(null);

  // Clear active blog SEO when leaving the blog page
  useEffect(() => {
    if (path !== 'blog') {
      setActiveBlogSEO(null);
    }
  }, [path]);

  // Keep the site in light mode, including when a previously saved dark theme exists.
  useEffect(() => {
    window.document.documentElement.classList.remove('dark');
  }, []);

  // Sync physical URL typed by the user.
  useEffect(() => {
    const handleLocation = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const potentialPath = resolvePathname(pathname);
      if (pathname.replace(/^\/+|\/+$/g, '') !== potentialPath) {
        window.history.replaceState({}, '', `/${potentialPath}${window.location.search}${hash}`);
      }
      if ((potentialPath === 'admin' || potentialPath.startsWith('admin/')) || hash === '#/admin' || hash.endsWith('/admin')) {
        setNotFound(false);
        setPath((potentialPath.startsWith('admin/') ? potentialPath : 'admin') as RoutePath);
      } else if (potentialPath.startsWith('p/')) {
        setNotFound(false);
        setPath(potentialPath as RoutePath);
      } else if (!potentialPath) {
        setNotFound(false);
        setPath('home');
      } else if (potentialPath in SEO_METADATA) {
        setNotFound(false);
        setPath(potentialPath as RoutePath);
      } else {
        setNotFound(true);
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Update browser location history quietly
  useEffect(() => {
    try {
      if (notFound) return;
      const currentUrl = window.location.pathname;
      const targetUrl = path === 'home' ? '/' : `/${path}`;
      if (currentUrl !== targetUrl && currentUrl !== `/index.html`) {
        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {
      // Gracefully prevent standard iframe origin errors
    }
  }, [path, notFound]);

  // Toast notification state for Google Sheet synchronization
  const [sheetToast, setSheetToast] = useState<{ show: boolean; formName: string; leadName: string; id: string } | null>(null);

  // Capture ALL forms submitted on any page automatically and write to Google Sheets!
  useEffect(() => {
    const handleGlobalFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (window.location.pathname.startsWith('/admin')) return;
      if (form.dataset.skipGlobalLeadSync === 'true') return;
      
      // Security: Do NOT capture admin login or moderation forms
      const isLoginForm = form.querySelector('input[type="password"]') !== null || 
                          form.id?.includes('login') || 
                          form.className?.includes('login') ||
                          form.getAttribute('action')?.includes('login');
      if (isLoginForm) return;

      // Do NOT capture interactive utility forms (chats, searches, SEO analyzers, or message replies)
      const formIdLower = (form.id || '').toLowerCase();
      const formClassLower = (form.className || '').toLowerCase();
      
      const isInteractiveUtility = 
        form.querySelector('input[type="search"]') !== null ||
        formIdLower.includes('search') ||
        formClassLower.includes('search') ||
        formIdLower.includes('chat') ||
        formClassLower.includes('chat') ||
        formIdLower.includes('reply') ||
        formClassLower.includes('reply') ||
        formIdLower.includes('message') ||
        formClassLower.includes('message') ||
        formIdLower.includes('whatsapp') ||
        formIdLower.includes('grader') ||
        formIdLower.includes('seo') ||
        formIdLower.includes('audit');

      if (isInteractiveUtility) return;

      // Check if any input is standard search or chatbot-like message input
      let hasLeadFields = false;
      let hasExcludedKeywords = false;

      const allInputs = Array.from(form.querySelectorAll('input, select, textarea'));
      for (const el of allInputs) {
        const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (input.type === 'submit' || input.type === 'button') continue;

        const placeholder = (('placeholder' in input ? (input as HTMLInputElement).placeholder : '') || '').toLowerCase();
        const nameOrId = ((input.name || '') + ' ' + (input.id || '')).toLowerCase();

        if (
          placeholder.includes('search') ||
          placeholder.includes('type a message') ||
          placeholder.includes('type message') ||
          placeholder.includes('type your message') ||
          placeholder.includes('write a reply') ||
          placeholder.includes('ask a question') ||
          placeholder.includes('ask ai') ||
          placeholder.includes('enter message') ||
          placeholder.includes('send message') ||
          placeholder.includes('whatsapp') ||
          placeholder.includes('chat...') ||
          nameOrId.includes('search') ||
          nameOrId.includes('query') ||
          nameOrId.includes('message_text') ||
          nameOrId.includes('chatmsg')
        ) {
          hasExcludedKeywords = true;
          break;
        }

        const typeLower = (input.type || '').toLowerCase();
        if (
          typeLower === 'email' ||
          typeLower === 'tel' ||
          nameOrId.includes('email') ||
          nameOrId.includes('phone') ||
          nameOrId.includes('tel') ||
          nameOrId.includes('contact') ||
          nameOrId.includes('mobile') ||
          nameOrId.includes('name') ||
          nameOrId.includes('company') ||
          nameOrId.includes('business') ||
          placeholder.includes('email') ||
          placeholder.includes('phone') ||
          placeholder.includes('mobile') ||
          placeholder.includes('contact') ||
          placeholder.includes('name') ||
          placeholder.includes('company') ||
          placeholder.includes('business')
        ) {
          hasLeadFields = true;
        }
      }

      if (hasExcludedKeywords) return;

      // If the form has absolutely zero lead fields and is just a single text/textarea input, ignore it
      const visibleInputs = allInputs.filter(el => {
        const input = el as HTMLInputElement;
        return input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden';
      });

      if (visibleInputs.length === 1 && !hasLeadFields) {
        return;
      }

      // Determine the form name or source
      let formName = form.getAttribute('data-form-name') || '';
      if (!formName) {
        // Try to locate heading or parent text
        const titleEl = form.querySelector('h2, h3, h4');
        if (titleEl) {
          formName = titleEl.textContent?.trim() || '';
        }
      }
      if (!formName) {
        // Fallback to active page path
        const pageTitle = path.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        formName = `${pageTitle || 'Home'} Lead Form`;
      }

      // Serialize form fields dynamically based on labels, placeholders or inputs
      const payload: Record<string, any> = {};
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach((el) => {
        const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (input.type === 'submit' || input.type === 'button') return;
        
        let fieldName = input.name || input.id;
        
        // 1. Resolve fieldName via label element
        if (!fieldName) {
          const closestLabel = input.closest('label');
          if (closestLabel) {
            fieldName = closestLabel.textContent?.replace(input.value || '', '')?.trim() || '';
          }
        }
        
        if (!fieldName) {
          let current: HTMLElement | null = input;
          for (let i = 0; i < 3; i++) {
            if (!current) break;
            
            let sibling = current.previousElementSibling;
            while (sibling) {
              if (sibling.tagName === 'LABEL') {
                fieldName = sibling.textContent?.trim() || '';
                break;
              }
              const nestedLabel = sibling.querySelector('label');
              if (nestedLabel) {
                fieldName = nestedLabel.textContent?.trim() || '';
                break;
              }
              sibling = sibling.previousElementSibling;
            }
            if (fieldName) break;
            
            const parentLabel = current.parentElement?.querySelector('label');
            if (parentLabel) {
              fieldName = parentLabel.textContent?.trim() || '';
              break;
            }
            
            current = current.parentElement;
          }
        }
        
        if (!fieldName) {
          fieldName = ('placeholder' in input ? (input as HTMLInputElement).placeholder : '') || input.type || 'field';
        }

        // Clean initial fieldName
        fieldName = fieldName.replace(/[:*]/g, '').trim();

        // 2. Apply heuristics to classify standard business CRM fields accurately, overriding placeholder fallbacks
        const placeholderLower = (('placeholder' in input ? (input as HTMLInputElement).placeholder : '') || '').toLowerCase();
        const typeLower = (input.type || '').toLowerCase();
        const idLower = (input.id || '').toLowerCase();
        const nameLower = (input.name || '').toLowerCase();
        const fieldNameLower = fieldName.toLowerCase();

        let inferredType = '';
        if (
          typeLower === 'email' || 
          placeholderLower.includes('email') || 
          placeholderLower.includes('@') || 
          idLower.includes('email') || 
          nameLower.includes('email') ||
          fieldNameLower.includes('email')
        ) {
          inferredType = 'Corporate Email';
        } else if (
          typeLower === 'tel' || 
          placeholderLower.includes('phone') || 
          placeholderLower.includes('mobile') || 
          placeholderLower.includes('contact') || 
          placeholderLower.includes('tel') || 
          idLower.includes('phone') || 
          nameLower.includes('phone') || 
          idLower.includes('tel') || 
          nameLower.includes('tel') ||
          fieldNameLower.includes('phone') ||
          fieldNameLower.includes('tel') ||
          fieldNameLower.includes('mobile') ||
          fieldNameLower.includes('contact')
        ) {
          inferredType = 'Mobile Contact Number';
        } else if (
          placeholderLower.includes('full name') || 
          placeholderLower.includes('your name') || 
          idLower.includes('name') || 
          nameLower.includes('name') ||
          fieldNameLower.includes('name')
        ) {
          inferredType = 'Full Name';
        } else if (
          placeholderLower.includes('company') || 
          placeholderLower.includes('business') || 
          placeholderLower.includes('organization') || 
          placeholderLower.includes('firm') || 
          idLower.includes('company') || 
          nameLower.includes('company') || 
          idLower.includes('business') || 
          nameLower.includes('business') ||
          fieldNameLower.includes('company') ||
          fieldNameLower.includes('business') ||
          fieldNameLower.includes('organization') ||
          fieldNameLower.includes('firm')
        ) {
          inferredType = 'Organization';
        } else if (
          placeholderLower.includes('message') || 
          placeholderLower.includes('requirement') || 
          placeholderLower.includes('enquiry') || 
          placeholderLower.includes('tell us') || 
          idLower.includes('message') || 
          nameLower.includes('message') ||
          fieldNameLower.includes('message') ||
          fieldNameLower.includes('enquiry') ||
          fieldNameLower.includes('requirement')
        ) {
          inferredType = 'Message';
        }

        if (inferredType) {
          fieldName = inferredType;
        }
        
        if (input instanceof HTMLInputElement && (input.type === 'checkbox' || input.type === 'radio')) {
          if (input.type === 'checkbox') {
            payload[fieldName] = input.checked ? 'Yes' : 'No';
          } else if (input.checked) {
            payload[fieldName] = input.value;
          }
        } else {
          payload[fieldName] = input.value;
        }
      });

      // Avoid capturing empty payloads
      if (Object.keys(payload).length > 0) {
        // Register the form submission to localStorage and remote webhook
        import('./utils/googleSheets').then(({ registerFormSubmission }) => {
          registerFormSubmission(formName, payload);
        });
      }
    };

    // Listen to our custom sheet sync events to trigger the beautiful toast
    const handleSyncToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const sub = customEvent.detail;
      const name = sub.payload['Full Name'] || sub.payload['Contact Name'] || sub.payload['Name'] || 'A User';
      
      setSheetToast({
        show: true,
        formName: sub.formName,
        leadName: String(name),
        id: sub.id
      });

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setSheetToast(null);
      }, 6000);
    };

    document.addEventListener('submit', handleGlobalFormSubmit);
    window.addEventListener('natton_google_sheet_sync', handleSyncToast);
    
    return () => {
      document.removeEventListener('submit', handleGlobalFormSubmit);
      window.removeEventListener('natton_google_sheet_sync', handleSyncToast);
    };
  }, [path]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  const renderContent = () => {
    if (notFound) {
      return <NotFound setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'home') {
      return <Home setPath={setPath} darkMode={darkMode} />;
    }

    if (path.startsWith('p/')) return <PublishedContent route={path} setPath={setPath} />;

    if (path === 'services') {
      return <ServicesOverview setPath={setPath} darkMode={darkMode} />;
    }

    if (path.startsWith('services/')) {
      return <ServiceDetail serviceSlug={path.slice('services/'.length)} setPath={setPath} darkMode={darkMode} />;
    }
    
    if (path === 'products') {
      return <Solutions setPath={setPath} darkMode={darkMode} />;
    }

    if (path.startsWith('products/')) {
      const sub = path.substring(9) as any;
      return <Solutions subPath={sub} setPath={setPath} darkMode={darkMode} />;
    }
    
    if (path === 'solutions') {
      return <SolutionsOverview setPath={setPath} darkMode={darkMode} />;
    }

    if (path.startsWith('solutions/')) {
      const sub = path.substring(10);
      return <BrandDetailTheme darkMode={darkMode}><Products subPath={sub} setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }
    
    if (path === 'industries') return <IndustriesOverview setPath={setPath} darkMode={darkMode} />;

    if (path.startsWith('industries/')) {
      const sub = path.substring(11);
      return <BrandDetailTheme darkMode={darkMode}><Industries subPath={sub} setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }
    
    if (path === 'case-studies') {
      return <BrandDetailTheme darkMode={darkMode}><CaseStudies setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }
    
    if (path === 'blog') {
      return (
        <Blog 
          setPath={setPath} 
          darkMode={darkMode} 
          selectedBlogPostId={selectedBlogPostId} 
          setSelectedBlogPostId={setSelectedBlogPostId} 
          setActiveBlogSEO={setActiveBlogSEO}
        />
      );
    }
    
    if (path === 'ai-readiness-assessment') {
      return <Tools toolType="assessment" setPath={setPath} darkMode={darkMode} />;
    }
    
    if (path === 'roi-calculator') {
      return <Tools toolType="roi-calculator" setPath={setPath} darkMode={darkMode} />;
    }
    
    if (path === 'contact') {
      return <Contact setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'privacy-policy' || path === 'terms-of-platform') {
      return <Legal document={path} setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'about') {
      return <About setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'why-natton-digital') {
      return <BrandDetailTheme darkMode={darkMode}><WhyNattonDigital setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }

    if (path === 'our-process') {
      return <BrandDetailTheme darkMode={darkMode}><OurProcess setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }

    if (path === 'book-demo') {
      return <Contact setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'resources') {
      return <ResourcesHub setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'integrations') {
      return <BrandDetailTheme darkMode={darkMode}><Integrations setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }

    if (path === 'pricing') {
      return <BrandDetailTheme darkMode={darkMode}><Pricing setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }

    if (path === 'compare') {
      return <BrandDetailTheme darkMode={darkMode}><Compare setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }

    if (path === 'free-tools') {
      return <FreeTools setPath={setPath} darkMode={darkMode} />;
    }

    if (path === 'careers') {
      return <BrandDetailTheme darkMode={darkMode}><Careers setPath={setPath} darkMode={darkMode} /></BrandDetailTheme>;
    }



    if (path === 'admin') {
      return <Admin setPath={setPath} darkMode={darkMode} setSelectedBlogPostId={setSelectedBlogPostId} />;
    }

    return <NotFound setPath={setPath} darkMode={darkMode} />;
  };

  const currentSEO = notFound
    ? {
        title: 'Page Not Found | Natton Digital',
        description: 'The requested Natton Digital page could not be found.',
        image: getFeatureImage('company')
      }
    : path === 'blog' && activeBlogSEO
    ? {
        title: activeBlogSEO.title,
        description: activeBlogSEO.description,
        image: activeBlogSEO.image || getFeatureImage('blog')
      }
    : {
        ...(SEO_METADATA[path] || SEO_METADATA['home']),
        image: getFeatureImage(path)
      };

  if (path === 'admin' || path.startsWith('admin/')) {
    return <><SEO title="Natton Digital Admin" description="Private staff workspace" route={path} noIndex /><Suspense fallback={<div className="min-h-screen bg-[#F4F7FB] p-12 text-center">Opening workspace…</div>}><Admin setPath={setPath} darkMode={darkMode} /></Suspense></>;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${
      darkMode ? 'bg-[#110B33] text-white' : 'bg-[#F5F9FA] text-[#110B33]'
    }`}>
      {/* SEO Metadata Injector */}
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
        image={currentSEO.image}
        noIndex={notFound}
        route={notFound ? window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home' : path}
      />

      {/* Header */}
      <Header currentPath={path} setPath={setPath} darkMode={darkMode} />

      {/* Main Content Area */}
      <main className="site-main flex-grow" data-resource-page={['resources','free-tools','roi-calculator','ai-readiness-assessment','blog','tools'].includes(path)}>
        {!notFound && path !== 'home' && !path.startsWith('p/') && (path === 'products' || path.startsWith('products/') || path === 'solutions' || path.startsWith('solutions/') || !ROUTES_WITH_PAGE_BREADCRUMBS.has(path)) && (
          <Breadcrumbs path={path} setPath={setPath} darkMode={darkMode} />
        )}
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs font-mono text-gray-500">Loading page...</div>}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Reusable floating tools / widgets */}
      <FloatingCTA setPath={setPath} darkMode={darkMode} showStickyCTA={!path.startsWith('services/')} />

      {/* Footer */}
      <Footer setPath={setPath} darkMode={darkMode} />

      {/* Live Google Sheets Synchronization toast overlay */}
      {sheetToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0F0A30] border border-[#00C2FF]/30 p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-fade-in backdrop-blur-md text-white">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1 flex-grow text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Sheets Synced Live</span>
              <span className="text-[9px] font-mono text-gray-500">#{sheetToast.id}</span>
            </div>
            <h5 className="text-xs font-bold text-white font-display">New Lead Appended!</h5>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Captured <strong>{sheetToast.leadName}</strong> via <em>"{sheetToast.formName}"</em> and pushed record to Google Sheet.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSheetToast(null)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-[9px] font-mono border border-white/5 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
