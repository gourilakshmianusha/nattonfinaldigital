import {SolutionPage,SolutionDirectory} from './solutions/SolutionPage.jsx';
import React from 'react';
import {serviceForPath} from './services/data.js';
import {ServicePage,ServiceDirectory} from './services/Services.jsx';
import {products,industries,pageForPath} from './data/index.js';
import {Icon} from './ui.jsx';
import {useReveals} from './hooks.js';
import {MotionProvider,MotionState,MotionToggle,Ambient} from './motion.jsx';
import {Label,Action,Breadcrumb,Overview,Needs,Measurement,Scope,FAQ,Related,Contact,LocalContents,Schema} from './common.jsx';
import {ProductGlyph,ProductFigure,GrowthVideo} from './visuals.jsx';
import {Capabilities,Process,JourneyDemo,AgentDemo,CreativeDemo,ClarityCompare,GoalPicker,Tools} from './interactions.jsx';


const productCues={
 'growth-os':['A credible presence','Relevant discovery','Connected enquiries'],
 'business-os':['Shared customer context','Clear ownership','Visible next actions'],
 'agentic-os':['Approved tools','Reviewable actions','Human ownership'],
 'ai-marketing-platform':['Clear briefs','Useful drafts','A shared creative direction']
};
const photoAlt={healthcare:'An administrative professional and a doctor reviewing information at a healthcare reception desk','education-edtech':'Adult learners discussing course information with an education counsellor','real-estate':'A property advisor and a couple reviewing an architectural model',manufacturing:'Two manufacturing professionals reviewing a tablet in a clean industrial facility','retail-ecommerce':'Retail business owners preparing an online order and reviewing their store operations','professional-services':'An advisory team discussing approved client-facing material at a table'};
const industryIcons={healthcare:'health','education-edtech':'education','real-estate':'building',manufacturing:'factory','retail-ecommerce':'shop','professional-services':'briefcase'};

function ProductHero({page}){const growth=page.slug==='growth-os';return <section className={'product-hero '+(growth?'growth-hero':'')}><div className="hero-material"aria-hidden="true"/><Ambient variant={page.slug==='business-os'?'routes':page.slug==='agentic-os'?'orbits':'waves'}className="hero-ambient"/><div className="container"><div className="hero-topline"><Breadcrumb page={page}/><MotionToggle/></div><div className="product-hero-grid"><div className="hero-copy"><h1><span className="hero-h1-label"><i/>{page.title} / {page.eyebrow}</span>{' '}{page.headline}</h1><p className="hero-description">{page.description}</p><div className="hero-actions"><Action>{growth?'Build my growth plan':page.slug==='business-os'?'Build my BusinessOS plan':page.slug==='agentic-os'?'Explore my agent workflow':'Plan my creative workflow'}</Action><Action href="#capabilities"quiet>See package contents</Action></div><ul className="hero-cues">{productCues[page.slug].map(x=><li key={x}><Icon name="check"/>{x}</li>)}</ul></div>{!growth&&<ProductFigure page={page}/>}</div>{growth&&<GrowthVideo/>}<div className="hero-caption"><span>{growth?'From first impression to the next enquiry.':'Designed around the work. Connected with care.'}</span><a href="#overview">Explore the approach<Icon name="down"/></a></div></div></section>;}

function IndustryHero({page}){return <section className={'industry-hero industry-'+page.slug}><Ambient variant={page.slug==='manufacturing'?'routes':page.slug==='real-estate'||page.slug==='professional-services'?'orbits':'waves'}className="hero-ambient"/><div className="container"><div className="hero-topline"><Breadcrumb page={page}/><MotionToggle/></div><div className="industry-hero-grid"><div className="hero-copy"><h1><span className="hero-h1-label"><i/>{page.eyebrow}</span>{' '}{page.headline}</h1><p className="hero-description">{page.description}</p><div className="hero-actions"><Action>Discuss your {page.slug==='education-edtech'?'education':page.slug==='professional-services'?'firm’s':page.slug==='retail-ecommerce'?'retail':page.title.toLowerCase()} priorities</Action><Action href="#capabilities"quiet>Explore the approach</Action></div><div className="industry-hero-note"><Icon name={industryIcons[page.slug]}/><span>Useful information.<br/><strong>A clearer customer journey.</strong></span></div></div><figure className="industry-photo"><img src={page.photo}alt={photoAlt[page.slug]}width="1440"height="960"fetchPriority="high"/><div className="photo-corner"aria-hidden="true"><Icon name={industryIcons[page.slug]}/></div><figcaption>Illustrative industry scene</figcaption><div className="photo-caption"><span>PEOPLE BEFORE PLATFORMS</span><strong>{page.slug==='healthcare'?'Make the next step easier to understand.':page.slug==='education-edtech'?'Better information for the next decision.':page.slug==='real-estate'?'Bring the right context to each conversation.':page.slug==='manufacturing'?'Show the capability. Connect the requirement.':page.slug==='retail-ecommerce'?'An easier journey from interest to action.':'Let the expertise speak clearly.'}</strong></div></figure></div><div className="industry-hero-rule"><span>UNDERSTAND</span><i/><span>CONNECT</span><i/><span>REVIEW</span></div></div></section>;}

function DetailPage({page}){if(page.kind==='product')return <SolutionPage page={page}/>;return <MotionProvider><MotionState className={'page-shell premium-theme glass-theme '+(page.kind==='product'?'product-theme':'industry-theme')}><a className="skip-link"href="#main-content">Skip to content</a><main id="main-content">{page.kind==='product'?<ProductHero page={page}/>:<IndustryHero page={page}/>}<LocalContents page={page}/><Overview page={page}/>{page.slug==='growth-os'&&<GoalPicker/>}<Needs page={page}/><Capabilities page={page}/>{page.slug==='growth-os'&&<ClarityCompare/>}<Process page={page}/>{page.slug==='agentic-os'?<AgentDemo/>:page.slug==='ai-marketing-platform'?<CreativeDemo/>:<JourneyDemo page={page}/>}<Measurement page={page}/>{page.slug==='business-os'&&<Tools/>}<Scope page={page}/><FAQ page={page}/><Related page={page}/><Contact page={page}/></main><Schema page={page}/></MotionState></MotionProvider>;}

function Directory({family}) {
 if(family==='products')return <SolutionDirectory/>;
 const isProduct=family==='products';
 const groups=family?[{kind:family,pages:isProduct?products:industries}]:[{kind:'products',pages:products},{kind:'industries',pages:industries}];
 const description=family?isProduct
  ?'Customised bundles for MSMEs, growing SMBs, mid-market businesses and enterprise teams. Connect marketing, customer operations or supervised AI around the priority that matters now.'
  :'Industry-specific websites, marketing and enquiry workflows for independent businesses, established firms and multi-location organisations. Start with the people you serve and the process behind their next step.'
  :'Choose a product around the work you need to improve, or an industry page around the people you serve. Marketing, customer operations and supervised AI are shaped around your business.';
 const fits=family==='industries'?
  [['From independent to multi-location','A provider-led business and a large industry group have different teams, locations and approval needs. The scope follows that operating context.'],['B2B, B2C and direct-to-consumer','A business buyer, patient, learner or shopper needs different information. We connect the relevant discovery, enquiry and follow-up journey.'],['Marketing through to operations','Begin with the website or campaign, then consider CRM, workflow automation or AI agents where there is a clear task and a responsible owner.']]:
  [['A fit at more than one business size','Startups, SMEs, MSMEs and SMBs can begin with a focused requirement. Large enterprises and multinational companies (MNCs) can scope a department, business unit or brand workflow.'],['Product-based and service-based businesses','B2B sales, B2C enquiries and direct-to-consumer (D2C) journeys need different content and handovers. Marketplace support can also be scoped where buyers and sellers interact.'],['The work decides the starting point','Choose a marketing foundation, connected customer operations, a supervised AI-agent workflow or a creative workspace. The next step follows your systems and team readiness.']];
 return <MotionProvider><MotionState className={'page-shell premium-theme glass-theme directory-shell '+(isProduct||!family?'product-theme':'industry-theme')}>
  <a className="skip-link"href="#main-content">Skip to content</a>
  <Ambient variant="waves"className="directory-ambient"/>
  <main id="main-content"className="directory-main container">
   <div className="directory-motion-control"><MotionToggle/></div>
   <div className="directory-intro"><Label>{family?'NATTON DIGITAL / '+family.toUpperCase():'NATTON DIGITAL / PAGE COLLECTION'}</Label>
    <h1>{family?isProduct?'Four products. A clearer starting point.':'Your industry. A considered approach.':'Built around the way your business moves.'}</h1>
    <p>{description}</p>
    {!family&&<div className="directory-switch"><a href="#product-pages">Find a product<Icon name="down"/></a><a href="#industry-pages">Find your industry<Icon name="down"/></a></div>}
   </div>
   {groups.map(group=><section key={group.kind}id={group.kind==='products'?'product-pages':'industry-pages'}className={'directory-family '+(group.kind==='products'?'product-theme':'industry-theme')}aria-labelledby={group.kind+'-heading'}>
    <Ambient variant={group.kind==='products'?'routes':'orbits'}className="quiet-ambient"/>
    <div className="directory-family-heading"><Label>{group.kind==='products'?'PRODUCTS / CONNECTED CAPABILITIES':'INDUSTRIES / A SHARED UNDERSTANDING'}</Label>
     <h2 id={group.kind+'-heading'}>{group.kind==='products'?'Start with the work. Build the connections.':'A different industry. A considered journey.'}</h2>
     <p>{group.kind==='products'?'Four customised starting points, from market presence to customer workflows and AI-assisted work.':'Six industry perspectives, with relevant examples, practical priorities and clear next steps.'}</p>
    </div>
    <div className="directory-grid">{group.pages.map(p=><a className={'directory-card '+(p.kind==='industry'?'industry-directory-card':'')}href={p.path}key={p.slug}>
     <div className="directory-card-art">{p.kind==='product'?<><ProductGlyph slug={p.slug}/><span className="directory-orbit"/></>:<img src={p.photo}alt={photoAlt[p.slug]}width="720"height="480"loading="lazy"/>}</div>
     <div className="directory-card-copy"><span className="tiny-label">{p.title}</span><h3>{p.headline}</h3><p>{p.description}</p><span className="text-link">See {p.title}<Icon name="arrow"/></span></div>
    </a>)}</div>
   </section>)}
   <section className="directory-fit"aria-labelledby="directory-fit-title"><Label>BUSINESS FIT / NOT A FIXED CHECKLIST</Label><h2 id="directory-fit-title">The business model shapes the scope.</h2><div className="directory-fit-grid">{fits.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>
   {family&&<a className="directory-back text-link"href={isProduct?'/industries/':'/products/'}>See the {isProduct?'industry':'product'} pages<Icon name="arrow"/></a>}
  </main>
 </MotionState></MotionProvider>;
}
function NotFound(){return <div className="page-shell product-theme"><main className="container not-found"><Label>PAGE NOT FOUND</Label><h1>Let’s find a useful starting point.</h1><p>This address is not part of the page collection.</p><Action href="/products/">Explore products</Action><Action href="/industries/"quiet>Explore industries</Action></main></div>;}
export default function PageForPath({path='/'}){useReveals(path);const normalized=path==='/'?'/':path.replace(/\/$/,'')+'/';if(normalized==='/page-collection/')return <Directory/>;const service=serviceForPath(normalized);if(service)return <ServicePage key={service.slug}page={service}/>;if(normalized==='/services/')return <ServiceDirectory/>;const page=pageForPath(normalized);if(page)return <DetailPage key={page.slug}page={page}/>;if(normalized==='/products/')return <Directory family="products"/>;if(normalized==='/industries/')return <Directory family="industries"/>;if(normalized==='/')return <Directory/>;return <NotFound/>;}

