import React, { useEffect, useRef } from 'react';
import { ArrowRight, Target, Users, MessageSquare, Workflow, TrendingUp, ShieldCheck, Sparkles, Bot, Eye, Compass, Check } from 'lucide-react';
import { RoutePath } from '../types';
import HeroCinema from '../components/heroJourney/HeroCinema';
import '../components/HeroSection.css';
import './About.css';

interface AboutProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

const services = [
  { icon: TrendingUp, title: 'Digital Marketing', text: 'Reach the right customers through search, social media, advertising, and useful content. Bring your campaigns together to build awareness and generate relevant enquiries.' },
  { icon: Sparkles, title: 'AI Marketing SaaS', text: 'Plan campaigns, create content, and review performance with AI-powered marketing software. Help your team save time, stay organised, and improve everyday marketing decisions.' },
  { icon: Bot, title: 'Agentic AI and Automation', text: 'Use AI agents to handle enquiries, coordinate tasks, and connect business tools. Reduce repetitive work with clear workflows that keep your team in control.' },
  { icon: MessageSquare, title: 'Customer Management & Communication', text: 'Manage customer details, enquiries, and follow-ups in one connected workspace. Use WhatsApp, chat, and calling tools to organise conversations, share updates, and support customers.' },
];

const partnership = [
  { icon: Target, title: 'Understand your goals', text: 'We listen to your challenges, review your current setup, and identify what matters most. Your priorities and budget guide our recommendations.' },
  { icon: Compass, title: 'Agree on a clear plan', text: 'We explain your options in plain language and agree on scope, responsibilities, and next steps. You know what to expect before we build.' },
  { icon: Workflow, title: 'Build and test together', text: 'We connect the right tools and test everyday scenarios with your team. Your feedback helps shape a practical solution that fits your work.' },
  { icon: ShieldCheck, title: 'Launch with lasting support', text: 'We help your team learn the setup, document ownership, and agree on support. Together, we review results and improve as your needs change.' },
];

export default function About({ setPath, darkMode }: AboutProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, []);

  const muted = darkMode ? 'text-gray-300' : 'text-gray-600';
  const card = darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-white';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#110B33] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <section ref={heroRef} className="about-hero hero-container">
        <HeroCinema heroRef={heroRef} fallbackSrc="/about-background.jpg" />
        <div className="hero-content">
          <div className="hero-text-section">
            <p className="hero-title-hook">ABOUT NATTON DIGITAL</p>
            <h1 className="hero-subtitle">People, ideas, and technology.<br /><span className="hero-highlight">Working for your growth.</span></h1>
            <p className="hero-description">We help businesses attract customers, manage enquiries, and save time with digital marketing, customer management tools, and AI automation.</p>
            <div className="hero-cta-group">
              <button type="button" onClick={() => setPath('contact')} className="btn-primary">Talk to Our Team <ArrowRight aria-hidden="true" size={18} /></button>
              <a href="#story" className="btn-secondary">Get to Know Us <ArrowRight aria-hidden="true" size={18} /></a>
            </div>
            <div className="about-hero-tags" aria-label="Our focus">
              {[['Marketing', TrendingUp], ['Technology', Workflow], ['Partnership', Users]].map(([label, Icon]) => {
                const TagIcon = Icon as typeof Users;
                return <span key={String(label)}><TagIcon aria-hidden="true" size={15} />{String(label)}</span>;
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:space-y-24 sm:px-6 sm:py-24 lg:px-8">
        <section id="story" className="grid scroll-mt-36 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="about-story-visual">
            <div className="about-story-image-wrap">
              <img src="/team-collaboration.png" alt="Illustration of a team planning connected marketing and business workflows" width={330} height={330} loading="lazy" className="aspect-square w-full object-cover" />
            </div>
            <div className={`about-story-caption border ${card}`}><Users aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" /><div><p className="font-semibold">Built around your business</p><p className={`mt-1 text-sm ${muted}`}>A collaborative approach, from idea to delivery.</p></div></div>
          </div>
          <div>
            <p className="about-eyebrow">WHO WE ARE</p>
            <h2 className="about-section-title">Your partner in making digital work better.</h2>
            <p className={`mt-5 leading-relaxed ${muted}`}>Natton Digital brings together technology and marketing to help businesses work better. Our roots are in Natton Technologies, with a focus on software and business systems. Today, we also help clients connect their marketing, sales, and customer support.</p>
            <p className={`mt-4 leading-relaxed ${muted}`}>Whether you need more enquiries, better follow-ups, or less manual work, we help you choose and use the tools that make sense for your business.</p>
            <ul className="mt-6 space-y-3">
              {['Practical advice in plain language', 'Tools that fit the way your team works', 'Support through setup, launch, and improvement'].map(item => <li key={item} className="flex items-start gap-3 text-sm font-medium"><Check aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="mission-vision" aria-label="Our mission and vision" className="grid scroll-mt-36 gap-6 md:grid-cols-2">
          {[{ icon: Target, title: 'Our mission', text: 'Make digital tools and AI easier to understand and use, so businesses can focus on their customers and growth.' }, { icon: Eye, title: 'Our vision', text: 'A future where businesses of every size can use technology confidently to improve their everyday work.' }].map(({ icon: Icon, title, text }, index) => <article key={title} className={`about-purpose-card rounded-3xl border p-7 sm:p-9 ${card}`}>
            <span className={`about-icon ${index ? 'about-icon-violet' : ''}`}><Icon aria-hidden="true" size={26} /></span>
            <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2><p className={`mt-3 max-w-md leading-relaxed ${muted}`}>{text}</p>
          </article>)}
        </section>

        <section aria-labelledby="services-heading">
          <div className="about-section-heading"><div><p className="about-eyebrow">WHAT WE DO</p><h2 id="services-heading" className="about-section-title">The right tools. A clearer way forward.</h2></div><p className={muted}>From finding new customers to making everyday work easier, we connect the pieces that help your business grow.</p></div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }) => (
              <article key={title} className={`about-service-card rounded-2xl border p-6 ${card}`}>
                <span className="about-icon mb-6"><Icon aria-hidden="true" size={24} /></span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className={`mt-3 leading-relaxed ${muted}`}>{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: 'Explore Our Services', path: 'services' },
              { label: 'Explore Our Products', path: 'products' },
              { label: 'Explore Our Solutions', path: 'solutions' },
            ].map(({ label, path }) => <a key={path} href={`/${path}`} onClick={event => { event.preventDefault(); setPath(path as RoutePath); }} className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">{label}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></a>)}
          </div>
        </section>

        <section id="why-choose-us" aria-labelledby="partnership-heading" className={`relative scroll-mt-36 rounded-3xl border p-6 sm:p-10 lg:p-12 ${card}`}>
          <span id="process" className="absolute top-0 scroll-mt-36" aria-hidden="true" />
          <div className="max-w-2xl">
            <p className="about-eyebrow">A PARTNERSHIP THAT WORKS</p>
            <h2 id="partnership-heading" className="about-section-title">Clear steps. A team beside you.</h2>
            <p className={`mt-4 leading-relaxed ${muted}`}>We bring practical advice, connected tools, and ongoing support into every stage of your project.</p>
          </div>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2">
            {partnership.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex items-start gap-4">
                <span className="about-icon shrink-0"><Icon aria-hidden="true" size={22} /></span>
                <div><p className="mb-2 text-xs font-bold tracking-widest text-primary">0{index + 1}</p><h3 className="text-lg font-semibold">{title}</h3><p className={`mt-2 leading-relaxed ${muted}`}>{text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact-form" className="about-contact scroll-mt-36 rounded-3xl p-8 text-center text-white sm:p-14">
          <span className="about-icon mx-auto mb-6"><MessageSquare aria-hidden="true" size={26} /></span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Let’s talk about your business.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-200">Tell us what you want to improve. We’ll help you understand your options and decide on a practical next step.</p>
          <button type="button" onClick={() => setPath('contact')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">Book a Free Consultation <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
        </section>
      </div>
    </div>
  );
}
