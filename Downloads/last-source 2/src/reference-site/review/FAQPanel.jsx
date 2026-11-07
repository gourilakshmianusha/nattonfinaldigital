import React from 'react';
import {ProjectBrief} from './SectionContent.jsx';

/** One accessible answer index for every page family. Content stays page-specific. */
export default function FAQPanel({items,page,context='your project',intro='Questions about the approach, the scope and what happens next.',contact='/contact/'}){
 const id=typeof page==='string'?page:page?.slug||'home';
 return <div className="faq-editorial container">
  <header className="faq-editorial-heading">
   <p className="faq-editorial-kicker"><span/>CLEAR BEFORE WE BEGIN</p>
   <h2>Frequently asked questions</h2>
   <p>{intro}</p>
  </header>
  <div className="faq-editorial-index"><span>YOUR QUESTIONS, ANSWERED</span><span>{String(items.length).padStart(2,'0')} / {context}</span></div>
  <div className="faq-editorial-list">{items.map((item,i)=>{
   const question=Array.isArray(item)?item[0]:item.question,answer=Array.isArray(item)?item[1]:item.answer;
   return <details key={question} name={id+'-answers'} open={i===0}>
    <summary><span className="faq-editorial-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span className="faq-editorial-question">{question}</span><span className="faq-editorial-toggle" aria-hidden="true"/></summary>
    <div className="faq-editorial-answer"><p>{answer}</p></div>
   </details>;
  })}</div>
  <div className="faq-editorial-support"><div><span className="faq-editorial-kicker">YOUR SETUP HAS ITS OWN DETAILS.</span><h3>Let’s work through them.</h3><p>Tell us what is in place and where the work gets stuck.</p><a href={contact}>Discuss your requirements <span aria-hidden="true">↗</span></a></div><ProjectBrief page={page} compact/></div>
 </div>;
}
