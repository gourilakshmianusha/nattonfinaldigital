import React,{lazy,Suspense,useEffect,useRef} from 'react';
import definitions from './definitions.json';
import {enhancementScope} from './enhancementScope.js';
import {initSite,initExperience,initCrm} from './enhancements.js';
import ProductSignal from './ProductSignal.jsx';
import './site.css';
import './experience.css';
import './crm.css';
import './crm-design.css';
import './integration.css';
import './product-scenes.css';
import './professional.css';

let serverPages={};
export function setServerProductPages(pages){serverPages=pages;}
const loaders=import.meta.env.SSR?{}:import.meta.glob(['./pages/*.jsx','!./pages/hub.jsx']);
const clientPages=Object.fromEntries(Object.entries(loaders).map(([path,loader])=>[path,lazy(loader)]));
export const productPlatformPages=definitions;
export const productPlatformDirectory={path:'/products/platforms/',metaTitle:'Marketing & Automation Products | Natton Digital',metaDescription:'AI marketing, CRM, conversational AI, WhatsApp, voice agents, cloud telephony, RCS and agent workflow products.'};
export function platformForPath(path){return definitions.find(page=>page.path===path);}
function MountedPage({page,Page}){const root=useRef(null);useEffect(()=>{if(!root.current)return;const scope=enhancementScope(root.current);initSite(scope);if(page.slug==='crm-ai-automation')initCrm(scope);else initExperience(scope);const update=()=>root.current?.classList.toggle('pb-document-hidden',document.hidden);document.addEventListener('visibilitychange',update);update();return()=>{document.removeEventListener('visibilitychange',update);scope.dispose();};},[page.slug]);return <div ref={root} className={`page-shell natton-solutions product-backend-page product-refresh product-${page.slug} ${page.slug==='crm-ai-automation'?'crm-route':'experience-route'}`}><a className="skip-link" href="#platform-main">Skip to content</a><main id="platform-main"><Page/></main></div>;}
export function ProductPlatformPage({page}){const key=`./pages/${page.slug}.jsx`;const Page=import.meta.env.SSR?serverPages[key].default:clientPages[key];return <Suspense fallback={<div className="page-shell platform-loading">Loading product workspace…</div>}><MountedPage key={page.slug} page={page} Page={Page}/></Suspense>;}
export function ProductPlatformDirectory(){return <div className="page-shell natton-solutions product-backend-page"><main className="experience-page theme-ocean pb-product-directory"><div className="container"><a href="/" className="pb-directory-back">← Page collection</a><span className="ex-eyebrow">NATTON DIGITAL / PRODUCTS</span><h1>Products built around<br/>the way your business works.</h1><p className="pb-directory-intro">Marketing, customer conversations and connected workflows. Choose a product to see its workspace and capabilities.</p><div className="pb-product-list">{definitions.map(page=><a key={page.slug} href={page.path}><img className="pf-directory-image" src={'/media/product-heroes/'+page.slug+'-960'+(page.slug==='ai-marketing-saas'?'-campaign':'')+'.webp'} alt={page.title+' working view'} width="960" height="540" loading="lazy"/><h2>{page.title}</h2><p>{page.description}</p><span>View product <b>↗</b></span></a>)}</div></div></main></div>;}
