import React,{lazy,Suspense} from 'react';
import articles from './articles.json';
const ClientPage=lazy(()=>import('./ResourcePages.jsx'));
let ServerPage;
export const resourceMenu=[
 {name:'Free Growth Tools',path:'/free-tools/',description:'Practical tools for marketing, CRM and business planning.'},
 {name:'AI Readiness Assessment',path:'/ai-readiness-assessment/',description:'A six-step review of your data, process, people and AI opportunities.'},
 {name:'ROI & Automation Calculator',path:'/roi-calculator/',description:'Model costs, time recovered and potential returns using your numbers.'},
 {name:'Blogs',path:'/blog/',description:'Useful guides on AI, search, customer operations and automation.'}
];
const page=(slug,title,description,extra={})=>({kind:'resource',slug,path:'/'+slug+'/',title,metaTitle:title+' | Natton Digital',metaDescription:description,...extra});
export const resourcePages=[
 page('about','About Natton Digital','People, ideas and technology, working for your growth. Learn how Natton connects marketing, customer operations and AI automation.'),
 page('contact','Contact Natton Digital','Share your business goals, review your enquiry and contact Natton Digital by email, phone or WhatsApp.'),
 page('book-demo','Book a Strategy Consultation','Tell Natton about your goals, current tools and preferred availability. Our team will help shape a practical next step.'),
 page('resources','Resources','Explore Natton’s growth tools, AI readiness assessment, calculators, practical prompts and business guides.'),
 page('free-tools','Free Growth Tools','Practical tools to review your website, assess CRM foundations and model marketing and automation scenarios.'),
 page('ai-readiness-assessment','AI Readiness Assessment','A six-stage, self-reported assessment of your business profile, technology, processes, people, governance and practical next steps.'),
 page('roi-calculator','ROI & Automation Calculators','Eight editable calculators for revenue, marketing, automation, WhatsApp, calling, sales productivity and support.'),
 page('blog','The Natton Journal','Practical perspectives on AI, marketing and building a more connected business.'),
 page('compare','Compare Natton Solutions','Compare GrowthOS, BusinessOS, AgenticOS and AI Marketing Platforms around your current business priority.'),
 page('our-process','Our Six-Step Process','Understand, plan, build, connect, launch and improve. Clear outputs and shared responsibilities at each step.'),
 page('privacy-policy','Privacy Information','How the restored enquiry form, email and WhatsApp handoff, and browser-based planning tools handle the information you choose to provide.'),
 ...articles.map(a=>page('blog/'+a.slug,a.title,a.summary,{article:a.slug}))
];
export function resourceForPath(path){return resourcePages.find(p=>p.path===path);}
export function configureResourceRenderer(Page){ServerPage=Page;}
export function ResourceRoute({page}){const Page=import.meta.env.SSR?ServerPage:ClientPage;return <Suspense fallback={<div className="page-shell resource-loading">Loading page…</div>}><Page page={page}/></Suspense>;}
