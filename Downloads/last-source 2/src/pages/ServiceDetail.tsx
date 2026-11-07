import React from 'react';
import './ServiceDetail.css';
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  getServiceSlug,
  getServiceBySlug,
  services,
  serviceBanners,
  serviceSectionImages,
  servicePhotographs,
  serviceHeroImages,
  type Service,
  type ServicePageContent,
  type ServicePageSection
} from '../data/services';
import { additionalServiceFAQs } from '../data/serviceFAQs';
import { RoutePath } from '../types';

/**
 * Google Material Symbols icon renderer
 * Uses the authentic Google Material Symbols font already imported in index.css
 */
function GoogleIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center shrink-0 leading-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

/**
 * Maps checklist item text or service section to an authentic Google Material Symbol icon
 */
function getGoogleIconForItem(text: string, kind?: string): string {
  const t = text.toLowerCase();
  if (t.includes('sitemap') || t.includes('structure') || t.includes('architecture') || t.includes('navigation')) return 'account_tree';
  if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('mockup') || t.includes('branding') || t.includes('visual')) return 'palette';
  if (t.includes('responsive') || t.includes('mobile') || t.includes('tablet') || t.includes('device') || t.includes('screen')) return 'devices';
  if (t.includes('seo') || t.includes('search') || t.includes('keyword') || t.includes('rank') || t.includes('google search')) return 'search';
  if (t.includes('aeo') || t.includes('ai search') || t.includes('chatgpt') || t.includes('answer engine')) return 'travel_explore';
  if (t.includes('ads') || t.includes('campaign') || t.includes('meta') || t.includes('ppc') || t.includes('budget') || t.includes('advertising')) return 'campaign';
  if (t.includes('click') || t.includes('cpc') || t.includes('cpl') || t.includes('retargeting')) return 'ads_click';
  if (t.includes('form') || t.includes('lead') || t.includes('contact') || t.includes('inquiry') || t.includes('enquir')) return 'contact_mail';
  if (t.includes('speed') || t.includes('fast') || t.includes('performance') || t.includes('core web vitals') || t.includes('load')) return 'speed';
  if (t.includes('security') || t.includes('ssl') || t.includes('backup') || t.includes('compliance') || t.includes('encryption') || t.includes('role')) return 'security';
  if (t.includes('test') || t.includes('qa') || t.includes('quality') || t.includes('checklist') || t.includes('audit')) return 'fact_check';
  if (t.includes('handover') || t.includes('support') || t.includes('maintain') || t.includes('training') || t.includes('plan')) return 'handshake';
  if (t.includes('analytic') || t.includes('cro') || t.includes('conversion') || t.includes('funnel') || t.includes('tracking')) return 'analytics';
  if (t.includes('kpi') || t.includes('metric') || t.includes('measure') || t.includes('report') || t.includes('outcome')) return 'monitoring';
  if (t.includes('cms') || t.includes('wordpress') || t.includes('content') || t.includes('blog') || t.includes('article') || t.includes('copy')) return 'edit_note';
  if (t.includes('ecommerce') || t.includes('e-commerce') || t.includes('checkout') || t.includes('store') || t.includes('shop') || t.includes('payment') || t.includes('cart')) return 'shopping_bag';
  if (t.includes('whatsapp') || t.includes('chat') || t.includes('message') || t.includes('sms') || t.includes('rcs')) return 'forum';
  if (t.includes('call') || t.includes('voice') || t.includes('telephony') || t.includes('ivr') || t.includes('phone')) return 'call';
  if (t.includes('agent') || t.includes('ai') || t.includes('workflow') || t.includes('automation') || t.includes('n8n') || t.includes('crm')) return 'smart_toy';
  if (t.includes('portal') || t.includes('dashboard') || t.includes('app')) return 'dashboard';
  if (t.includes('scale') || t.includes('growth') || t.includes('revenue') || t.includes('profit') || t.includes('impression')) return 'trending_up';
  if (t.includes('launch') || t.includes('deploy') || t.includes('release')) return 'rocket_launch';
  if (kind === 'deliverables') return 'task_alt';
  if (kind === 'process') return 'schema';
  if (kind === 'metrics') return 'query_stats';
  if (kind === 'benefits') return 'verified';
  return 'task_alt';
}

/**
 * Maps industry title to Google Material Symbol icon
 */
function getGoogleIndustryIcon(industry: string): string {
  const norm = industry.toLowerCase();
  if (norm.includes('hospitality') || norm.includes('hotel')) return 'apartment';
  if (norm.includes('health') || norm.includes('clinic') || norm.includes('hospital') || norm.includes('medical') || norm.includes('doctor')) return 'local_hospital';
  if (norm.includes('educat') || norm.includes('school') || norm.includes('college') || norm.includes('course') || norm.includes('university') || norm.includes('student')) return 'school';
  if (norm.includes('retail') || norm.includes('e-commerce') || norm.includes('ecommerce') || norm.includes('fashion') || norm.includes('shop') || norm.includes('goods')) return 'storefront';
  if (norm.includes('food') || norm.includes('restaurant') || norm.includes('dining')) return 'restaurant';
  if (norm.includes('real estate') || norm.includes('property') || norm.includes('home') || norm.includes('housing')) return 'home';
  if (norm.includes('travel') || norm.includes('flight') || norm.includes('tour') || norm.includes('aviation')) return 'flight';
  if (norm.includes('automotive') || norm.includes('car') || norm.includes('vehicle')) return 'directions_car';
  if (norm.includes('finance') || norm.includes('bank') || norm.includes('invest')) return 'account_balance';
  if (norm.includes('support') || norm.includes('call') || norm.includes('center') || norm.includes('service centre')) return 'support_agent';
  if (norm.includes('agency') || norm.includes('marketing') || norm.includes('event')) return 'campaign';
  if (norm.includes('saas') || norm.includes('software') || norm.includes('subscription')) return 'layers';
  if (norm.includes('manufacturing') || norm.includes('factory') || norm.includes('industry')) return 'precision_manufacturing';
  if (norm.includes('professional') || norm.includes('legal') || norm.includes('consult')) return 'work';
  return 'business_center';
}

const additionalIndustryNames = [
  'Automotive',
  'Financial services',
  'Travel & hospitality',
  'Nonprofits',
  'Manufacturing',
  'SaaS',
  'Professional services',
  'Retail',
  'Education',
  'Healthcare',
  'Home services',
  'Real estate'
];

interface DocumentServicePageProps {
  service: Service;
  pageContent: ServicePageContent;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

function DocumentServicePage({ service, pageContent, setPath, darkMode }: DocumentServicePageProps) {
  const customHero = serviceHeroImages[service.id];
  const banner = customHero ?? servicePhotographs[service.id] ?? serviceBanners[service.id] ?? serviceSectionImages[service.id];
  const baseText = darkMode ? 'text-white' : 'text-[#110B33]';
  const mutedText = darkMode ? 'text-[#cbd9eb]' : 'text-[#5b647a]';
  const sectionsByKind = new Map(
    pageContent.sections.map(section => [section.kind, section])
  );
  const sectionId = (section: ServicePageSection) =>
    `service-${section.kind}-${pageContent.sections.indexOf(section) + 2}`;
  const renderSection = (section: ServicePageSection) => {
    const sectionHeading = (
      <div className="mb-8">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E9CAE]">
          {section.kind === 'benefits' ? 'Value Proposition' :
           section.kind === 'process' ? 'Delivery Approach' :
           section.kind === 'deliverables' ? 'Tangible Assets' :
           section.kind === 'industries' ? 'Target Use-Cases' :
           section.kind === 'faqs' ? 'Questions & Answers' :
           section.kind === 'features' ? 'Capabilities' : 'Overview'}
        </p>
        <h2 className={`font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl ${baseText}`}>
          {section.heading}
        </h2>
        {section.paragraphs.map(paragraph => (
          <p key={paragraph} className={`mt-3 max-w-3xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
            {paragraph}
          </p>
        ))}
      </div>
    );

    if (section.kind === 'faqs') {
      return (
        <section
          id={sectionId(section)}
          key={section.heading}
          className={`${darkMode ? 'bg-[#0f1d31]' : 'bg-[#F5F9FA]'} px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-t ${darkMode ? 'border-white/5' : 'border-[#e4eff1]'}`}
        >
          <div className="mx-auto max-w-4xl">
            {sectionHeading}
            <div className="space-y-3">
              {section.faqs?.map(({ question, answer }) => (
                <details
                  key={question}
                  className={`group rounded-2xl border px-6 transition-all duration-200 ${
                    darkMode
                      ? 'border-white/10 bg-[#142640] open:border-[#47C7BF]/50 open:bg-[#162b48]'
                      : 'border-[#dce8eb] bg-white open:border-[#47C7BF]/60 open:shadow-sm'
                  }`}
                >
                  <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm sm:text-base font-bold marker:hidden [&::-webkit-details-marker]:hidden ${baseText}`}>
                    <span>{question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E9CAE]/10 text-[#2E9CAE] transition-transform duration-200 group-open:rotate-45">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className={`max-w-3xl pb-5 pr-6 text-sm leading-relaxed ${mutedText}`}>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (section.kind === 'cta') {
      return (
        <section
          id={sectionId(section)}
          key={section.heading}
          className="relative overflow-hidden bg-gradient-to-r from-[#0d1633] via-[#110B33] to-[#12364c] px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20 border-t border-white/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E9CAE]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto] relative z-10">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#47C7BF]">
                Next Steps
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">{section.heading}</h2>
              {section.paragraphs.map(paragraph => (
                <p key={paragraph} className="mt-3 max-w-2xl text-sm leading-relaxed text-[#cbd9eb] sm:text-base">{paragraph}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPath('contact')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9CAE] to-[#47C7BF] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#2E9CAE]/30 transition-all hover:shadow-[#2E9CAE]/50 hover:scale-[1.02] cursor-pointer"
            >
              {section.button ?? pageContent.primaryCta} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      );
    }

    const isFeatures = section.kind === 'features';
    const isProcess = section.kind === 'process';
    const background = ['features', 'deliverables'].includes(section.kind)
      ? darkMode ? 'bg-[#0e1a2c]' : 'bg-[#edf7f7]'
      : darkMode ? 'bg-[#0a1424]' : 'bg-white';
    const cardBackground = darkMode
      ? 'border-white/10 bg-[#12233b] hover:border-white/20'
      : 'border-[#dce8eb] bg-white hover:border-[#47C7BF]/50 shadow-sm';
    const childrenGrid = section.kind === 'benefits'
      ? 'grid-cols-1'
      : isFeatures
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3';

    return (
      <section
        id={sectionId(section)}
        key={section.heading}
        className={`${background} px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-t ${darkMode ? 'border-white/5' : 'border-[#e4eff1]'}`}
      >
        <div className="mx-auto max-w-7xl">
          {section.kind === 'benefits' ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.85fr)_1.15fr] lg:items-start lg:gap-14">
              {sectionHeading}
              <div className="space-y-4">
                {section.children.map(child => (
                  <article
                    key={child.heading}
                    className={`flex items-start gap-4 p-5 sm:p-6 rounded-2xl border transition-all ${cardBackground}`}
                  >
                    {/* Replaced checkbox with Google Material Symbols icon fetched from Google */}
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/25">
                      <GoogleIcon name={getGoogleIconForItem(child.heading, 'benefits')} className="text-[22px]" />
                    </span>
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold ${baseText}`}>{child.heading}</h3>
                      {child.paragraphs.map(paragraph => (
                        <p key={paragraph} className={`mt-1.5 text-sm leading-relaxed ${mutedText}`}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : section.kind === 'process' ? (
            <div>
              {sectionHeading}
              {section.items.length > 0 && (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
                  {section.items.map((item, idx) => (
                    <li
                      key={item}
                      className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all ${cardBackground}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E9CAE] px-2.5 py-1 rounded-full bg-[#2E9CAE]/10">
                            STEP 0{idx + 1}
                          </span>
                          {/* Google icon for process stage */}
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE]">
                            <GoogleIcon name={getGoogleIconForItem(item, 'process')} className="text-[20px]" />
                          </span>
                        </div>
                        <p className={`text-sm sm:text-base font-semibold leading-relaxed ${baseText}`}>{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : section.kind === 'deliverables' ? (
            <div className={`rounded-3xl border p-6 sm:p-9 ${cardBackground}`}>
              <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.75fr)_1.25fr] lg:items-start">
                {sectionHeading}
                <ul className="grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
                  {section.items.map(item => (
                    <li
                      key={item}
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border ${
                        darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-[#e4eff1] bg-[#F5F9FA]'
                      }`}
                    >
                      {/* Replaced checkbox with Google Material Symbols icon fetched from Google */}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/25 mt-0.5">
                        <GoogleIcon name={getGoogleIconForItem(item, 'deliverables')} className="text-[18px]" />
                      </span>
                      <span className={`text-sm leading-relaxed font-medium ${baseText}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : section.kind === 'metrics' ? (
            <div className={`rounded-3xl border p-6 sm:p-9 ${cardBackground}`}>
              {sectionHeading}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
                {section.items.map(item => (
                  <li
                    key={item}
                    className={`flex items-center gap-3.5 rounded-2xl p-4 border transition-all ${
                      darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-[#e4eff1] bg-[#F5F9FA]'
                    } ${baseText}`}
                  >
                    {/* Google icon for metric */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                      <GoogleIcon name={getGoogleIconForItem(item, 'metrics')} className="text-[20px]" />
                    </span>
                    <span className="text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : section.kind === 'industries' ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.7fr)_1.3fr] lg:items-start">
              {sectionHeading}
              {section.items.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map(item => {
                    const [title, ...descriptionParts] = item.split(' - ');
                    return (
                      <article
                        key={item}
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${cardBackground}`}
                      >
                        {/* Google icon for industry */}
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                          <GoogleIcon name={getGoogleIndustryIcon(title)} className="text-[20px]" />
                        </span>
                        <div>
                          <h3 className={`text-sm font-bold ${baseText}`}>{title}</h3>
                          {descriptionParts.length > 0 && (
                            <p className={`mt-1 text-xs leading-relaxed ${mutedText}`}>{descriptionParts.join(' - ')}</p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {sectionHeading}
              {section.children.length > 0 && (
                <div className={`grid gap-4 ${childrenGrid}`}>
                  {section.children.map(child => (
                    <article
                      key={child.heading}
                      className={`rounded-2xl border p-5 sm:p-6 transition-all ${cardBackground}`}
                    >
                      {/* Replaced checkbox with Google Material Symbols icon fetched from Google */}
                      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                        <GoogleIcon name={getGoogleIconForItem(child.heading, 'features')} className="text-[20px]" />
                      </span>
                      <h3 className={`text-base font-bold ${baseText}`}>{child.heading}</h3>
                      {child.paragraphs.map(paragraph => (
                        <p key={paragraph} className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${mutedText}`}>{paragraph}</p>
                      ))}
                    </article>
                  ))}
                </div>
              )}
              {section.items.length > 0 && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 list-none p-0">
                  {section.items.map(item => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${cardBackground} ${mutedText}`}
                    >
                      <GoogleIcon name="verified" className="text-[#2E9CAE] text-[18px] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderedSections = pageContent.sections.map(renderSection);

  return (
    <article className={`service-detail ${darkMode ? 'service-theme-dark' : ''} bg-white text-[#110B33]`}>
      {/* Hero Section */}
      <section className={`${customHero ? 'service-hero--illustrated' : ''} ${darkMode ? 'bg-[#0a1424]' : 'bg-gradient-to-br from-white via-[#f5fbfb] to-[#e6f6f4]'} px-5 py-12 sm:px-8 lg:px-12 lg:py-16`}>
        <div className={customHero ? 'service-hero-layout mx-auto max-w-7xl' : 'mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14'}>
          <div className={customHero ? 'service-hero-copy' : 'lg:col-span-7'}>
            <nav aria-label="Breadcrumb" className={`mb-6 flex flex-wrap items-center gap-2 text-xs ${mutedText}`}>
              <button onClick={() => setPath('home')} className="hover:text-[#2E9CAE] transition-colors cursor-pointer">Home</button>
              <ChevronRight className="h-3 w-3" />
              <button onClick={() => setPath('services')} className="hover:text-[#2E9CAE] transition-colors cursor-pointer">Services</button>
              <ChevronRight className="h-3 w-3" />
              <span aria-current="page" className="font-semibold text-[#2E9CAE]">{service.name}</span>
            </nav>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2E9CAE]/15 border border-[#2E9CAE]/30 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#2E9CAE] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E9CAE]">
                {service.name}
              </span>
            </div>
            <h1 className={`font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl ${baseText}`}>
              {pageContent.title}
            </h1>
            <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${mutedText}`}>
              {pageContent.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <button
                type="button"
                onClick={() => setPath('contact')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9CAE] to-[#47C7BF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2E9CAE]/25 transition hover:shadow-[#2E9CAE]/40 hover:scale-[1.02] cursor-pointer"
              >
                {pageContent.primaryCta} <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={`#${sectionId(sectionsByKind.get('features') ?? pageContent.sections[0])}`}
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
                  darkMode ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#2E9CAE]/40 text-[#2E9CAE] hover:bg-[#2E9CAE]/10'
                }`}
              >
                {pageContent.secondaryCta} <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className={customHero ? 'service-hero-art' : 'lg:col-span-5 flex justify-center'}>
            {banner && (
              <div className={customHero ? 'service-hero-image-wrap' : 'relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 shadow-2xl'}>
                <img
                  src={banner}
                  alt={`${service.name} service visual`}
                  fetchPriority="high"
                  className={customHero ? 'service-hero-image' : 'aspect-[4/3] w-full h-full object-cover'}
                />
                {customHero && <div className="service-hero-image-tint" aria-hidden="true" />}
              </div>
            )}
          </div>
        </div>
      </section>



      {renderedSections}
    </article>
  );
}

interface ServiceDetailProps {
  serviceSlug: string;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function ServiceDetail({ serviceSlug, setPath, darkMode }: ServiceDetailProps) {
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return (
      <section className={`service-detail ${darkMode ? 'service-theme-dark' : ''} mx-auto max-w-3xl px-5 py-20 text-center`}>
        <h1 className="font-display text-3xl font-bold text-[#110B33]">Service not found</h1>
        <p className="mt-3 text-[#5b647a]">This service page may have moved.</p>
        <button
          type="button"
          onClick={() => setPath('services')}
          className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-[#258b9c]"
        >
          Browse all services
        </button>
      </section>
    );
  }

  if (service.pageContent) {
    return (
      <DocumentServicePage
        service={service}
        pageContent={service.pageContent}
        setPath={setPath}
        darkMode={darkMode}
      />
    );
  }

  const banner = servicePhotographs[service.id] ?? serviceBanners[service.id];
  const sectionImage = servicePhotographs[service.id] ?? serviceSectionImages[service.id] ?? banner;
  const serviceFAQs = [...(service.faqs ?? []), ...(additionalServiceFAQs[service.id] ?? [])];
  const existingIndustries = service.industries ?? [];
  const normalizeIndustryName = (industry: string) => industry
    .split(':', 1)[0]
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ');
  const existingIndustryNames = new Set(existingIndustries.map(normalizeIndustryName));
  const additionalIndustries = additionalIndustryNames
    .filter(industry => !existingIndustryNames.has(normalizeIndustryName(industry)))
    .slice(0, 4)
    .map(industry => `${industry}: Use ${service.name} to make relevant customer journeys and follow-up more consistent.`);
  const industriesWeServe = [...existingIndustries, ...additionalIndustries];

  const baseText = darkMode ? 'text-white' : 'text-[#110B33]';
  const mutedText = darkMode ? 'text-[#cbd9eb]' : 'text-[#5b647a]';

  return (
    <article className={`service-detail ${darkMode ? 'service-theme-dark' : ''} bg-white text-[#110B33]`}>
      {/* Hero Header */}
      <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-gradient-to-br from-[#110B33] via-[#171346] to-[#14505c] px-5 py-16 text-white sm:min-h-[500px] sm:px-8 lg:px-12 lg:py-20">
        <img
          src={banner}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#110B33] via-[#110B33]/92 to-[#110B33]/40" />
        <div className="mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#cbd9eb]">
            <button onClick={() => setPath('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => setPath('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <ChevronRight className="h-3 w-3" />
            <span aria-current="page" className="text-[#99D57C] font-semibold">{service.name}</span>
          </nav>
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#99D57C] animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#99D57C]">
                {service.id.startsWith('ai-') || service.id === 'crm-and-automation' ||
                ['conversational-ai', 'whatsapp-automation', 'cloud-telephony', 'rcs-messaging'].includes(service.id)
                  ? 'Solutions & AI Automation'
                  : 'Digital Marketing Service'}
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              {service.hero ?? `${service.name} for growing teams`}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#cbd9eb] sm:text-lg">
              {service.short}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <button
                type="button"
                onClick={() => setPath('contact')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9CAE] to-[#47C7BF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2E9CAE]/30 transition hover:shadow-[#2E9CAE]/50 hover:scale-[1.02] cursor-pointer"
              >
                Request a Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#service-includes"
                className="inline-flex items-center gap-2 rounded-xl border border-[#47C7BF]/60 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#99D57C] hover:bg-white/10"
              >
                Explore features <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* Service Intro */}
      {service.intro && service.intro.length > 0 && (
        <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-b border-[#e4eff1] dark:border-white/5">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E9CAE]">
                Service Introduction
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#110B33] dark:text-white sm:text-4xl">
                Understand {service.name}
              </h2>
              {service.intro.map(paragraph => (
                <p key={paragraph} className="mt-4 text-sm leading-relaxed text-[#5b647a] dark:text-[#cbd9eb] sm:text-base">
                  {paragraph}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setPath('contact')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#258b9c] cursor-pointer shadow-md"
              >
                Discuss {service.name} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[#dce8eb] dark:border-white/10 shadow-xl">
              <img
                src={sectionImage}
                alt={`${service.name} service overview visual`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Business Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className={`${darkMode ? 'bg-[#0f1d31]' : 'bg-[#F5F9FA]'} px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-b border-[#e4eff1] dark:border-white/5`}>
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#47C7BF]">Strategic Value</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${baseText}`}>
              Why it can help your business
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.benefits.map(([title, description]) => (
                <article
                  key={title}
                  className={`rounded-2xl border p-6 transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#162b48] hover:border-white/20'
                      : 'border-[#dce8eb] bg-white hover:border-[#47C7BF]/50 shadow-sm'
                  }`}
                >
                  {/* Google Material Symbols icon badge */}
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                    <GoogleIcon name={getGoogleIconForItem(title, 'benefits')} className="text-[20px]" />
                  </span>
                  <h3 className={`text-base font-bold ${baseText}`}>{title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${mutedText}`}>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Included */}
      {service.features && service.features.length > 0 && (
        <section id="service-includes" className="scroll-mt-28 px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-b border-[#e4eff1] dark:border-white/5">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E9CAE]">What is included</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${baseText}`}>
              Our {service.name} scope
            </h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
              A practical breakdown of capabilities that can be included in an agreed service scope.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {service.features.map(([title, description]) => (
                <article
                  key={title}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#12233b] hover:border-white/20'
                      : 'border-[#dce8eb] bg-white hover:border-[#47C7BF]/50 shadow-sm'
                  }`}
                >
                  {/* Google Material Symbols icon badge */}
                  <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                    <GoogleIcon name={getGoogleIconForItem(title, 'features')} className="text-[20px]" />
                  </span>
                  <h3 className={`text-sm font-bold leading-snug ${baseText}`}>{title}</h3>
                  <p className={`mt-2 text-xs leading-relaxed ${mutedText}`}>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How we work */}
      {service.steps && service.steps.length > 0 && (
        <section className={`${darkMode ? 'bg-[#0f1d31]' : 'bg-[#F5F9FA]'} px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-b border-[#e4eff1] dark:border-white/5`}>
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E9CAE]">How we work</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${baseText}`}>
              How we deliver {service.name}
            </h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
              We agree the scope, owners and success measures first; review progress at agreed checkpoints; then validate the work, complete handover and confirm what to monitor next.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((step, idx) => (
                <article
                  key={step}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    darkMode ? 'border-white/10 bg-[#162b48]' : 'border-[#dce8eb] bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E9CAE] px-2.5 py-1 rounded-full bg-[#2E9CAE]/10">
                      STEP 0{idx + 1}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE]">
                      <GoogleIcon name={getGoogleIconForItem(step, 'process')} className="text-[18px]" />
                    </span>
                  </div>
                  <p className={`text-sm font-semibold leading-relaxed ${baseText}`}>{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries we serve */}
      {industriesWeServe.length > 0 && (
        <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20 border-b border-[#e4eff1] dark:border-white/5">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#47C7BF]">Selected applications</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${baseText}`}>Industries we serve</h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
              <strong className={baseText}>Best suited to: </strong>{service.target} We work with teams across these industries to adapt the service to their day-to-day needs and customer journeys.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industriesWeServe.map(industry => {
                const title = industry.split(':', 1)[0];
                return (
                  <article
                    key={industry}
                    className={`rounded-2xl border p-5 flex items-start gap-3.5 transition-all ${
                      darkMode
                        ? 'border-white/10 bg-[#12233b] hover:border-white/20'
                        : 'border-[#dce8eb] bg-[#F5F9FA] hover:border-[#47C7BF]/50'
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E9CAE]/15 text-[#2E9CAE] border border-[#2E9CAE]/20">
                      <GoogleIcon name={getGoogleIndustryIcon(title)} className="text-[20px]" />
                    </span>
                    <div>
                      <h3 className={`text-sm font-bold ${baseText}`}>{title}</h3>
                      <p className={`mt-1 text-xs leading-relaxed ${mutedText}`}>
                        {industry.includes(':') ? industry.slice(industry.indexOf(':') + 1).trim() : industry}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {serviceFAQs.length > 0 && (
        <section className={`${darkMode ? 'bg-[#0f1d31]' : 'bg-[#F5F9FA]'} px-5 py-14 sm:px-8 lg:px-12 lg:py-20`}>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E9CAE]">Here to help</p>
              <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${baseText}`}>
                Frequently asked questions
              </h2>
              <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${mutedText}`}>
                Find answers to common questions about {service.name.toLowerCase()}.
              </p>
            </div>
            <div className="space-y-3">
              {serviceFAQs.map(([question, answer]) => (
                <details
                  key={question}
                  className={`group rounded-2xl border px-6 transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#162b48] open:border-[#47C7BF]/50'
                      : 'border-[#dce8eb] bg-white open:border-[#47C7BF]/60 open:shadow-sm'
                  }`}
                >
                  <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm sm:text-base font-bold marker:hidden [&::-webkit-details-marker]:hidden ${baseText}`}>
                    <span>{question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E9CAE]/10 text-[#2E9CAE] transition-transform duration-200 group-open:rotate-45">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className={`max-w-3xl pb-5 pr-6 text-sm leading-relaxed ${mutedText}`}>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0d1633] via-[#110B33] to-[#12364c] px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20 border-t border-white/10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#47C7BF]">Get Started</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Ready to discuss {service.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#cbd9eb] sm:text-base">
            Share your goal and current challenges. We can propose scope, timeline, responsibilities and a suitable starting point.
          </p>
          <button
            type="button"
            onClick={() => setPath('contact')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E9CAE] to-[#47C7BF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2E9CAE]/30 transition hover:shadow-[#2E9CAE]/50 hover:scale-[1.02] cursor-pointer"
          >
            Request a Free Consultation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </article>
  );
}
