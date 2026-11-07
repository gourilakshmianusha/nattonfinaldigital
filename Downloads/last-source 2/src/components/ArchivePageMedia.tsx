import React,{useEffect,useRef} from 'react';
import ArchiveHeroMotion from './ArchiveHeroMotion';
import './archive-hero.css';
/** Archive media only: no ZIP navigation, labels, styles or application scripts. */
export function ArchivePageMedia({page}:{page:{slug:string;title:string;photo?:string;heroImage?:string}}){
 const classes='w-full h-auto max-h-[520px] object-contain rounded-2xl border border-white/10 shadow-2xl';
 return page.slug==='growth-os'
  ? <video className={classes} controls playsInline preload="metadata" poster={page.heroImage} aria-label="GrowthOS overview"><source src="/media/ten-pages/growth-os/growthos-hero-original.mp4" type="video/mp4"/>Your browser does not support video playback.</video>
  : <img className={classes} src={page.photo||page.heroImage} alt={page.title+' — illustrative '+(page.photo?'industry scene':'workflow overview')} width={page.photo?1440:1200} height={page.photo?960:820} fetchPriority="high"/>;
}

interface ArchiveCopy {needs:{title:string;description:string}[];services:{title:string;description:string}[];metrics:{title:string;description:string}[];deliverables:string[];timing:string;scopeNote:string;audience:string|string[];example:{title:string;description:string;steps:string[];note:string}}
/** Reuses the current detail-page card vocabulary; contains copy only. */
export function ArchiveContentGroup({page,group}:{page:ArchiveCopy;group:'needs'|'services'|'metrics'|'scope'|'audience'|'example'}){
 if(group==='scope')return <div className="space-y-4 text-sm leading-relaxed"><p>{page.timing}</p><ul className="space-y-2">{page.deliverables.map(item=><li key={item}>• {item}</li>)}</ul><p>{page.scopeNote}</p></div>;
 if(group==='audience')return <p className="text-sm leading-relaxed text-gray-400">{Array.isArray(page.audience)?page.audience.join(' · '):page.audience}</p>;
 if(group==='example')return <div className="space-y-4 text-sm leading-relaxed"><p>{page.example.description}</p><ol className="space-y-2">{page.example.steps.map((step,i)=><li key={step}>{i+1}. {step}</li>)}</ol><p>{page.example.note}</p></div>;
 return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{page[group].map(item=><article key={item.title} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3"><h3 className="text-sm font-bold font-display">{item.title}</h3><p className="text-xs leading-relaxed text-gray-400">{item.description}</p></article>)}</div>;
}

export function ArchiveHeroBackground({page}:{page:{slug:string;title:string;photo?:string;heroImage?:string}}){
 const videoRef=useRef<HTMLVideoElement>(null);
 const processVideo=['growth-os','business-os','agentic-os','ai-marketing-platform'].includes(page.slug);
 const videoSrc=processVideo?`/media/ten-pages/${page.slug}/process-background.mp4`:null;
 const poster=processVideo?`/media/ten-pages/${page.slug}/process-poster.webp`:page.heroImage;
 useEffect(()=>{
  const video=videoRef.current;if(!video)return;
  // Set properties as well as attributes for muted inline playback across browsers.
  video.defaultMuted=true;video.muted=true;video.autoplay=true;video.loop=true;video.controls=false;
  video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
  let inView=true;
  const sync=()=>{if(document.hidden||!inView)video.pause();else void video.play().catch(()=>{});};
  const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:0});
  const hero=video.closest('.archive-hero');if(hero)observer?.observe(hero);
  video.addEventListener('loadeddata',sync);video.addEventListener('canplay',sync);
  document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
  document.addEventListener('pointerdown',sync,{once:true});document.addEventListener('keydown',sync,{once:true});sync();
  return()=>{observer?.disconnect();video.removeEventListener('loadeddata',sync);video.removeEventListener('canplay',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('pageshow',sync);document.removeEventListener('pointerdown',sync);document.removeEventListener('keydown',sync);video.pause();};
 },[videoSrc]);
 const image=page.photo||(videoSrc?poster:undefined);
 return <><div className={'archive-hero-backdrop'+(image?' archive-hero-has-media':'')} aria-hidden="true" style={image?{'--archive-hero-image':`url("${image}")`} as React.CSSProperties:undefined}>{videoSrc&&<video key={videoSrc} ref={videoRef} className="archive-hero-video" autoPlay loop muted playsInline preload="auto" poster={poster} tabIndex={-1}><source src={videoSrc} type="video/mp4"/></video>}</div>{!videoSrc&&<ArchiveHeroMotion slug={page.slug}/>}</>;
}

export function ArchiveFAQ({items,idPrefix}:{items:{question:string;answer:string}[];idPrefix:string}){
 return <section id="faq" className="archive-faq mb-24 space-y-8" aria-labelledby={idPrefix+'-faq-heading'}><div className="text-center space-y-3"><h2 id={idPrefix+'-faq-heading'} className="text-3xl font-bold font-display">Frequently Asked Questions</h2><p>Answers about the approach, the scope and what happens next.</p></div><div className="max-w-3xl mx-auto space-y-3">{items.map((faq,index)=><details key={faq.question} open={index===0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>;
}
