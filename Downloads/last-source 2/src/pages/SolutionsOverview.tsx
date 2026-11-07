import React from 'react';
import { ArrowRight, ChartNoAxesCombined, Sparkles, Layers, Bot } from 'lucide-react';
import { products } from '../data/navigation';
import { RoutePath } from '../types';
import './SolutionsOverview.css';

export default function SolutionsOverview({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  const icons = [ChartNoAxesCombined, Sparkles, Layers, Bot];
  const descriptions = [
    'Bring your marketing, sales pipeline, and customer follow-ups together to support business growth.',
    'Use AI to help create content, plan campaigns, and manage your marketing more efficiently.',
    'Connect everyday operations and reduce repetitive work across your business tools.',
    'Coordinate AI agents and automated workflows to help your team handle complex tasks.',
  ];
  return <div className={`min-h-screen ${darkMode ? 'bg-[#110B33] text-white' : 'bg-gray-50 text-gray-900'}`}>
    <section className="solutions-overview-hero relative isolate overflow-hidden bg-[#110B33] px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
      <img src="/hero-digital-ai.jpg" alt="" aria-hidden="true" width={1400} height={787} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,11,51,0.94)_0%,rgba(17,11,51,0.82)_45%,rgba(17,11,51,0.32)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#110B33]/70 via-transparent to-transparent" />
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#8ce3da]">Our Solutions</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">Connected solutions for the way your business works.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200">Explore our platforms for marketing, customer management, daily operations, and AI automation.</p>
        <a href="#solutions-catalogue" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#8ce3da]/40 bg-[#237786] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#238b82]">Explore Our Solutions <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
    </section>
    <div id="solutions-catalogue" className="mx-auto max-w-6xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <h2 className="mb-8 font-display text-2xl font-bold sm:text-3xl">Find the right solution for your business.</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product, index) => {
          const Icon = icons[index];
          return <article key={product.path} className={`flex flex-col rounded-2xl border p-7 sm:p-9 ${darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-white'}`}>
            <Icon aria-hidden="true" className="h-8 w-8 text-primary" />
            <h2 className="mt-5 font-display text-2xl font-bold">{product.name}</h2>
            <p className={`mb-6 mt-3 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{descriptions[index]}</p>
            <a href={`/${product.path}`} onClick={event => { event.preventDefault(); setPath(product.path); }} className="mt-auto inline-flex items-center gap-2 font-semibold text-primary hover:underline">Explore {product.name}<ArrowRight aria-hidden="true" size={18} /></a>
          </article>;
        })}
      </div>
    </div>
  </div>;
}
