import React from 'react';
import './industries-overview.css';
import {ArrowRight} from 'lucide-react';
import {RoutePath} from '../types';
import healthcare from '../content/ten-pages/healthcare.json';
import education from '../content/ten-pages/education-edtech.json';
import realEstate from '../content/ten-pages/real-estate.json';
import manufacturing from '../content/ten-pages/manufacturing.json';
import retail from '../content/ten-pages/retail-ecommerce.json';
import professional from '../content/ten-pages/professional-services.json';
const industries=[{page:healthcare,path:'industries/healthcare'},{page:education,path:'industries/education'},{page:realEstate,path:'industries/real-estate'},{page:manufacturing,path:'industries/manufacturing'},{page:retail,path:'industries/retail-ecommerce'},{page:professional,path:'industries/professional-services'}];
export default function IndustriesOverview({setPath,darkMode}:{setPath:(path:RoutePath)=>void;darkMode:boolean}){
 return <div className={`min-h-screen ${darkMode?'bg-[#110B33] text-white':'bg-[#F5F9FA] text-[#110B33]'}`}><header className="industries-overview-hero px-4 py-16 sm:px-6 sm:py-24" data-theme={darkMode?'dark':'light'}><div className="max-w-6xl mx-auto"><p className="text-sm font-semibold tracking-widest uppercase text-primary">Our industries</p><h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl font-bold leading-tight">Solutions shaped around your industry.</h1><p className={`mt-6 max-w-2xl text-lg leading-relaxed ${darkMode?'text-gray-300':'text-slate-600'}`}>Explore practical marketing, customer enquiry and workflow support for your sector. Start with the priorities that matter to your team.</p></div></header><section className="max-w-6xl mx-auto px-4 pb-20 sm:px-6" aria-label="Explore industries"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{industries.map(({page,path})=><article key={path} className={`overflow-hidden flex flex-col rounded-2xl border ${darkMode?'bg-white/5 border-white/10':'bg-white border-slate-200'}`}><img src={page.photo} alt={page.title+' — illustrative industry scene'} width={1440} height={960} loading="lazy" className="aspect-[3/2] w-full object-cover"/><div className="p-6 flex flex-col flex-1"><h2 className="font-display text-2xl font-bold">{page.title}</h2><p className={`my-4 leading-relaxed ${darkMode?'text-gray-300':'text-slate-600'}`}>{page.description}</p><a className="mt-auto inline-flex items-center gap-2 text-primary font-semibold" href={'/'+path} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath(path as RoutePath);}}>Explore {page.title}<ArrowRight size={18}/></a></div></article>)}</div></section></div>;
}
