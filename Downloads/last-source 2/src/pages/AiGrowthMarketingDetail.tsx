import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import workflowImage from '../../assets/services/06_Previous_AI_Service_Images_and_Previews/03_Workflow_Diagrams/nattondigital_ai-growth-marketing_workflow.png';
import { getServiceBySlug, serviceBanners, servicePhotographs, serviceSectionImages } from '../data/services';
import { additionalServiceFAQs } from '../data/serviceFAQs';
import { RoutePath } from '../types';

interface AiGrowthMarketingDetailProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

const trustPoints = [
  'Clear implementation plan',
  'Appropriate integrations',
  'Human oversight',
  'Support after launch'
];

export default function AiGrowthMarketingDetail({ setPath, darkMode }: AiGrowthMarketingDetailProps) {
  const service = getServiceBySlug('ai-growth-marketing');

  if (!service) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-[#102d4c]">Service not found</h1>
        <p className="mt-3 text-[#60738a]">This service page may have moved.</p>
        <button
          type="button"
          onClick={() => setPath('services')}
          className="mt-6 rounded-lg bg-[#247ddd] px-5 py-3 text-sm font-bold text-white"
        >
          Browse all services
        </button>
      </section>
    );
  }

  const faqs = [...(service.faqs ?? []), ...(additionalServiceFAQs[service.id] ?? [])];
  const sectionClass = darkMode ? 'bg-[#0d1d32] text-white' : 'bg-white text-[#12304d]';
  const alternateSectionClass = darkMode ? 'bg-[#10243c] text-white' : 'bg-[#f4f8fd] text-[#12304d]';
  const leadClass = darkMode ? 'text-[#cbd9eb]' : 'text-[#5b6e85]';
  const bodyClass = darkMode ? 'text-[#cbd9eb]' : 'text-[#647991]';
  const serviceImage = servicePhotographs[service.id] ?? serviceBanners[service.id];
  const sectionImage = servicePhotographs[service.id] ?? serviceSectionImages[service.id] ?? serviceImage;

  return (
    <article className={`ai-growth-detail ${darkMode ? 'ai-growth-detail-dark' : ''}`}>
      <section className="relative isolate flex min-h-[510px] items-center overflow-hidden bg-gradient-to-br from-[#061629] to-[#072b50] px-5 py-16 text-white sm:min-h-[560px] sm:px-8 lg:px-[5.5rem]">
        <img
          src={serviceImage}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-75 [mask-image:linear-gradient(to_right,transparent_0%,black_40%)]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061629] via-[#072b50]/95 to-transparent" />
        <div className="mx-auto w-full max-w-[1400px]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-bold tracking-[0.16em] text-[#f6a65c] uppercase sm:text-sm">
            <button onClick={() => setPath('home')} className="hover:text-white">Home</button>
            <span className="px-2">/</span>
            <button onClick={() => setPath('services')} className="hover:text-white">Services</button>
            <span className="px-2">/</span>
            <span aria-current="page">AI Growth Marketing</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              AI Growth Marketing
              <span className="mt-1 block text-[#82c6ff]">for growing teams</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#cbd9eb] sm:text-xl">
              {service.short}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => setPath('contact')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#247ddd] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#1769be] sm:px-7"
              >
                Book a Free Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-[#67839f] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 sm:px-6"
              >
                See How It Works <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className={`grid grid-cols-2 gap-4 border-b px-5 py-6 sm:grid-cols-4 sm:px-8 lg:px-[5.5rem] ${darkMode ? 'border-white/10 bg-[#0d1d32]' : 'border-[#e9eef5] bg-white'}`}>
        <div className="col-span-2 mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-4 sm:col-span-4 sm:grid-cols-4 sm:gap-6">
          {trustPoints.map(point => (
            <p key={point} className={`m-0 text-sm font-bold ${darkMode ? 'text-[#cbd9eb]' : 'text-[#4f6985]'}`}>
              <span className="mr-2 text-[#247ddd]" aria-hidden="true">✓</span>{point}
            </p>
          ))}
        </div>
      </div>

      <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${sectionClass}`}>
        <div className="mx-auto grid max-w-[1400px] items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Service introduction</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
              What is AI Growth Marketing?
            </h2>
            {(service.intro ?? []).map((paragraph, index) => (
              <p key={paragraph} className={`mt-4 leading-relaxed ${index === 0 ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} ${index === 0 ? leadClass : bodyClass}`}>
                {paragraph}
              </p>
            ))}
          </div>
          <img
            src={sectionImage}
            alt="AI Growth Marketing campaign planning and analytics"
            loading="lazy"
            className="w-full rounded-2xl shadow-[0_18px_60px_rgba(9,44,74,0.2)]"
          />
        </div>
      </section>

      {service.benefits && (
        <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${alternateSectionClass}`}>
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Why choose this solution</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
              Practical benefits for your business
            </h2>
            <p className={`mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${leadClass}`}>
              This service is designed for businesses that need consistent, measurable lead generation.
            </p>
            <ul className="mt-6 space-y-4">
              {service.benefits.map(([title, description]) => (
                <li key={title} className={`flex gap-3 leading-relaxed ${bodyClass}`}>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e3f1ff] font-black text-[#1389cf]" aria-hidden="true">✓</span>
                  <span><strong className={darkMode ? 'text-white' : 'text-[#12304d]'}>{title}:</strong> {description}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {service.features && (
        <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${sectionClass}`}>
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">What&apos;s included</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
              Our AI Growth Marketing capabilities
            </h2>
            <p className={`mt-4 max-w-4xl text-base leading-relaxed sm:text-lg ${leadClass}`}>
              Features are configured to match the agreed scope; not every integration is available on every provider or plan.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map(([title, description], index) => (
                <article key={title} className={`rounded-2xl border p-6 ${darkMode ? 'border-white/10 bg-[#10243c]' : 'border-[#e5edf5] bg-white shadow-[0_10px_25px_rgba(21,63,91,0.05)]'}`}>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f3ff] text-lg font-black text-[#1769be]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`mt-4 text-lg font-bold leading-snug ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>{title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed sm:text-base ${bodyClass}`}>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.steps && (
        <section id="how-it-works" className={`scroll-mt-24 px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${alternateSectionClass}`}>
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Our approach</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
              How the service works
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((step, index) => (
                <article key={step} className={`rounded-2xl border p-6 ${darkMode ? 'border-white/10 bg-[#0d1d32]' : 'border-[#e0eaf3] bg-white'}`}>
                  <span className="font-display text-3xl font-black text-[#d38646]">{String(index + 1).padStart(2, '0')}</span>
                  <p className={`mt-4 text-base font-bold leading-relaxed ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${sectionClass}`}>
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Example implementation</p>
          <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
            From your current process to a connected workflow
          </h2>
          <p className={`mt-4 max-w-4xl text-base leading-relaxed sm:text-lg ${leadClass}`}>
            This example shows a recommended path. Actual delivery depends on your tools, processes, permissions and agreement.
          </p>
          <img
            src={workflowImage}
            alt="Example AI Growth Marketing workflow from campaign discovery to reporting"
            loading="lazy"
            className="mt-7 w-full rounded-2xl"
          />
        </div>
      </section>

      {service.industries && (
        <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${alternateSectionClass}`}>
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Who it&apos;s for</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>Business applications</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.industries.map(industry => (
                <article key={industry} className="rounded-2xl bg-[#09203c] p-6 text-white">
                  <p className="text-base leading-relaxed text-[#d0deeb] sm:text-lg">{industry}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-[5.5rem] lg:py-20 ${sectionClass}`}>
          <div className="mx-auto max-w-[1100px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#e77b24]">Frequently asked questions</p>
            <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${darkMode ? 'text-white' : 'text-[#102d4c]'}`}>
              Questions about AI Growth Marketing
            </h2>
            <div className="mt-6">
              {faqs.map(([question, answer]) => (
                <details key={question} className={`border-b py-5 ${darkMode ? 'border-white/10' : 'border-[#dbe6f1]'}`}>
                  <summary className={`cursor-pointer text-base font-bold sm:text-lg ${darkMode ? 'text-white' : 'text-[#12304d]'}`}>
                    {question}
                  </summary>
                  <p className={`mt-3 text-sm leading-relaxed sm:text-base ${bodyClass}`}>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-[#0a2d53] to-[#092039] px-5 py-16 text-center text-white sm:px-8 sm:py-20 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f6a65c]">Let&apos;s plan your next step</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See whether AI Growth Marketing fits your business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#bad4ed]">
            Tell us about your current tools and challenge. We can outline a proposed solution, integrations and next steps.
          </p>
          <button
            type="button"
            onClick={() => setPath('contact')}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#247ddd] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#1769be]"
          >
            Book a Free Strategy Consultation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </article>
  );
}
