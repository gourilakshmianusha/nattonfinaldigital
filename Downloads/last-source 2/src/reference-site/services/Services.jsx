import FAQPanel from '../review/FAQPanel.jsx';
import React,{useEffect,useState} from 'react';
import {Icon} from '../ui.jsx';
import {MotionProvider,MotionState,MotionToggle,usePageMotion,useMotionRegion,Ambient} from '../motion.jsx';
import {CONTACT,SITE_URL} from '../data/index.js';
import {servicePages} from './data.js';
import ServiceMotion from './ServiceMotion.jsx';
import './services.css';
import './realism.css';
import ServiceVisual from './ServiceVisual.jsx';
import HumanServiceHero from './HumanServiceHero.jsx';
import {ProjectBrief} from '../review/SectionContent.jsx';

const labels={benefits:'Value Proposition',process:'Delivery Approach',deliverables:'Tangible Assets',industries:'Target Use-Cases',faqs:'FAQ',features:'Capabilities'};
const photoAlt={
  'seo-services':'A laptop displaying a website analytics dashboard',
  'website-development':'A laptop with a code editor open on an office desk',
  'google-business-profile':'A local clothing shop with garments on display',
  'ppc-google-ads':'A professional working at a laptop in an office',
  'social-media-marketing':'Two people reviewing information on a laptop',
  'meta-ads':'A team meeting around a table with laptops',
  'content-marketing-blogging':'A fountain pen beside handwritten notes',
  'aeo-ai-search':'A close view of source code on a screen',
  'graphic-design-branding':'A designer using a stylus on a digital drawing tablet',
  'email-marketing':'An email application icon on a mobile screen',
  'ecommerce-development':'A business owner discussing product material with a customer',
  'analytics-cro':'An analytics dashboard displayed on a laptop',
  'ai-growth-marketing':'Two professionals working at computers in an office',
};
function industryImageFor(text){const t=text.toLowerCase();const slug=/clinic|health|hospital|medical/.test(t)?'healthcare':/educat|course|school/.test(t)?'education-edtech':/manufactur|industrial/.test(t)?'manufacturing':/retail|e.commerce|ecommerce|store|shop/.test(t)?'retail-ecommerce':/property|real estate/.test(t)?'real-estate':'professional-services';return `/media/industries/${slug}.webp`;}
function SectionTitle({section,page}) { return <div className="service-section-title"><p className="section-label"><i/>{labels[section.kind]||'Overview'}</p><h2>{section.kind==='faqs'?'Frequently asked questions':section.heading}</h2>{section.paragraphs.map((text,i)=><p key={i}>{text}</p>)}{section.kind==='faqs'&&<ProjectBrief page={page} compact/>}</div>; }
function ServiceProcess({section,page}) {
  const [active,setActive]=useState(0),[playing,setPlaying]=useState(true);
  const {enabled,visible}=usePageMotion();const {ref,inView}=useMotionRegion();
  const running=playing&&enabled&&visible&&inView;
  useEffect(()=>{if(!running)return;const timer=setTimeout(()=>setActive(i=>(i+1)%section.items.length),4400);return()=>clearTimeout(timer);},[active,running,section.items.length]);
  return <div ref={ref} onMouseEnter={()=>setPlaying(false)} onMouseLeave={()=>setPlaying(true)} onFocusCapture={()=>setPlaying(false)} className={`service-process ${running?'service-process-running':''}`}>

    <ol className="service-process-grid">{section.items.map((text,i)=><li key={text} className={active===i?'stage-active':''}><button type="button" aria-pressed={active===i} onClick={()=>{setActive(i);setPlaying(false);}}><span className="service-step-top"><span className="service-step-number">STEP 0{i+1}</span><span className="process-stage-mark"/></span><span className="service-step-copy">{text}</span><ServiceVisual page={page} title={text} kind="process" small/></button>{i<section.items.length-1&&<span key={active} className={`service-process-link ${active===i?'link-active':''}`} aria-hidden="true"><i/></span>}</li>)}</ol>
  </div>;
}
function Section({section,page,index}) {
  const id=`service-${section.kind}-${index+2}`;
  if(section.kind==='cta')return <section id={id} className="service-closing"><ServiceMotion motif={page.motif}/><div className="container"><div className="service-closing-panel"><div><p className="section-label"><i/>Next Steps</p><h2>{section.kind==='faqs'?'Frequently asked questions':section.heading}</h2>{section.paragraphs.map((text,i)=><p key={i}>{text}</p>)}</div><a className="button button-primary" href={CONTACT}>{section.button||page.content.primaryCta}<Icon name="arrow"/></a></div></div></section>;
  if(section.kind==='faqs')return <section id={id} className="service-section service-section-faqs section-space"><FAQPanel page={page} context={page.title} items={section.faqs||[]} intro={section.paragraphs.join(' ')||'Understand the scope, the working process and what happens next.'}/></section>;
  return <section id={id} className={`service-section service-section-${section.kind} section-space`}>
    {['features','process','industries','metrics'].includes(section.kind)&&<ServiceMotion motif={page.motif}/>}
    <div className="container">
      <div className={`service-section-frame ${['features','deliverables','process'].includes(section.kind)?'service-framed':''}`}>
        {section.kind==='benefits'?<><SectionTitle section={section} page={page}/><div className="service-benefits-layout"><div><figure className="service-editorial-photo"><img src={`/media/services/${page.slug}-photo.webp`} alt={photoAlt[page.slug]} loading="lazy" width="1200" height="800"/></figure></div><div className="service-benefit-cards">{section.children.map((child,i)=><article className="service-glass-card" key={child.heading}><span className="service-card-sequence" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><h3>{child.heading}</h3>{child.paragraphs.map((text,j)=><p key={j}>{text}</p>)}</div><ServiceVisual page={page} title={child.heading} kind={section.kind}/></article>)}</div></div></>:<>
          <SectionTitle section={section} page={page}/>
          {section.kind==='faqs'?<div className="service-faq-list">{section.faqs?.map(faq=><details key={faq.question} name={`service-faq-${page.slug}`}><summary>{faq.question}<Icon name="plus"/></summary><p>{faq.answer}</p></details>)}</div>:section.kind==='process'?<ServiceProcess section={section} page={page}/>:<>
            {section.children.length>0&&<div className={`service-card-grid service-card-grid-${section.kind}`}>{section.children.map((child,i)=><article className="service-glass-card" key={child.heading}><span className="service-card-sequence" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3>{child.heading}</h3>{child.paragraphs.map((text,j)=><p key={j}>{text}</p>)}<ServiceVisual page={page} title={child.heading} kind={section.kind}/></article>)}</div>}
            {section.items.length>0&&<ul className={`service-item-grid service-items-${section.kind}`}>{section.items.map((text,i)=><li className="service-glass-card" key={text}><span className="service-item-marker" aria-hidden="true">{section.kind==='industries'?<img src={industryImageFor(text)} alt="" width="140" height="100" loading="lazy"/>:section.kind==='metrics'?String(i+1).padStart(2,'0'):'✓'}</span><span>{text}</span>{section.kind==='metrics'&&<ServiceVisual page={page} title={text} kind="metrics"/>}</li>)}</ul>}
          </>}
        </>}
      </div>
    </div>
  </section>;
}
function ServiceSchema({page}) {
  const url=SITE_URL+page.path;
  const graph={'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':url+'#page',url,name:page.metaTitle,description:page.metaDescription},{'@type':'Service','@id':url+'#service',name:page.title,url,description:page.description,provider:{'@type':'Organization',name:'Natton Digital',url:'https://nattondigital.com/'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Services',item:SITE_URL+'/services/'},{'@type':'ListItem',position:2,name:page.title,item:url}]}]};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,'\\u003c')}}/>;
}
export function ServicePage({page}) {
  const content=page.content;
  return <MotionProvider><MotionState className={`page-shell premium-theme glass-theme industry-theme service-page realism-theme service-${page.motif}`}><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content">
    <HumanServiceHero page={page}/>
    {content.sections.map((section,index)=><Section key={`${index}-${section.kind}`} section={section} page={page} index={index}/>)}
  </main><ServiceSchema page={page}/></MotionState></MotionProvider>;
}
export function ServiceDirectory() {
  return <MotionProvider><MotionState className="page-shell premium-theme glass-theme industry-theme service-page realism-theme service-directory"><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content"><section className="service-directory-hero"><Ambient variant="routes"/><div className="container"><div className="hero-topline"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><Icon name="arrow"/><span aria-current="page">Services</span></nav><MotionToggle/></div><h1>Services</h1><p className="directory-hero-subtitle">Websites, search, campaigns and automation. Choose the work that moves your business forward.</p></div></section><section className="service-section section-space"><div className="container"><div className="service-directory-grid">{servicePages.map(page=><a key={page.slug} className="service-glass-card service-directory-card" href={page.path}><figure><img src={page.sceneImage} alt={page.sceneAlt} width="768" height="432" loading="lazy"/></figure><div><h2>{page.title}</h2><p>{page.description}</p><span className="text-link">View service details<Icon name="arrow"/></span></div></a>)}</div></div></section></main></MotionState></MotionProvider>;
}
