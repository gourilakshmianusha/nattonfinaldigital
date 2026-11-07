import React, {useState} from 'react';
import {ArrowRight, Check, Search, Map, Layers, Workflow, ChartNoAxesCombined, TrendingUp, MessageSquare, FileCheck2, Handshake} from 'lucide-react';
import {RoutePath} from '../types';
import './OurProcess.css';

const steps = [
  {id:'discover', title:'Understand your business', short:'Discover', icon:Search, description:'We start with a conversation about your business, your customers and what is slowing you down.', activities:['Listen to your goals and challenges','Review your website, marketing and everyday tools','Choose the problem to solve first'], deliverable:'A clear summary of your priorities.', input:'Your goals, current challenges and access to relevant information.'},
  {id:'strategize', title:'Make a practical plan', short:'Plan', icon:Map, description:'Together, we decide what to work on, what success looks like and what fits your budget.', activities:['Agree the work and the tools needed','Set responsibilities and a realistic schedule','Confirm costs and how progress will be measured'], deliverable:'An agreed scope, schedule and cost breakdown.', input:'Feedback on the plan and approval before work begins.'},
  {id:'build', title:'Build what you need', short:'Build', icon:Layers, description:'We create or improve the website, campaigns and customer tools included in your plan.', activities:['Build the agreed pages and campaigns','Set up customer records and enquiry forms','Share work for your review'], deliverable:'Working pages, campaigns or tools ready for testing.', input:'Brand materials, business information and feedback on drafts.'},
  {id:'automate', title:'Connect and test', short:'Connect', icon:Workflow, description:'We connect the agreed tools so information reaches the right people and follow-ups are easier to manage.', activities:['Connect forms, customer records and communication channels','Set up agreed reminders and handovers','Test real situations before launch'], deliverable:'Tested connections and a clear follow-up process.', input:'Approved account access and a team member to test the setup.'},
  {id:'optimize', title:'Launch and improve', short:'Improve', icon:ChartNoAxesCombined, description:'Once the work is live, we review the available results and agree what needs attention.', activities:['Launch after the agreed checks and approval','Review enquiries, customer actions or workflow results','Make improvements within the agreed scope'], deliverable:'A progress review and a prioritised list of improvements.', input:'Feedback from your team and access to agreed reporting.'},
  {id:'scale', title:'Choose the next step', short:'Grow', icon:TrendingUp, description:'We use what we have learned to decide whether to expand, improve the current setup or keep it steady.', activities:['Review what is working and what needs support','Explain the setup and hand over useful documentation','Agree any ongoing support or additional work'], deliverable:'A handover and a clear plan for what comes next.', input:'Your priorities for the next stage.'},
];
const faqs = [
  {question:'Do we have to complete all six steps?', answer:'The process is a guide. We agree the steps your project needs. A small website update and a wider marketing or workflow project will have different scopes.'},
  {question:'How long will the work take?', answer:'That depends on the work, the systems involved and how quickly information and approvals are available. We agree a realistic schedule before starting and keep you informed if it changes.'},
  {question:'Can we keep the tools we already use?', answer:'Yes, where they support the agreed work. We review your current tools first and explain any connection limits, extra subscriptions or usage costs before recommending a change.'},
  {question:'What happens after launch?', answer:'We explain how to use the agreed setup and provide the relevant handover information. Ongoing support, reporting and improvements are included only when they are part of your agreed scope.'},
];

export default function OurProcess({setPath,darkMode}:{setPath:(path:RoutePath)=>void;darkMode:boolean}) {
  const [activeStep,setActiveStep]=useState(0);
  const current=steps[activeStep];
  const CurrentIcon=current.icon;
  const link=(event:React.MouseEvent<HTMLAnchorElement>,path:RoutePath)=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath(path);};
  return <div className="process-page" data-theme={darkMode?'dark':'light'}>
    <header id="hero" className="process-hero">
      <div className="process-container process-hero-grid">
        <div>
          <p className="process-eyebrow">A clear way forward</p>
          <h1>From your first<br/>question to your<br/><em>next step.</em></h1>
          <p className="process-intro">You know your business. We help turn your goals into a practical plan, build what you need and improve it together.</p>
          <div className="process-actions">
            <a className="process-button" href="/contact" onClick={event=>link(event,'contact')}>Tell us what you need <ArrowRight size={18}/></a>
            <a className="process-text-link" href="#overview">See how we work <span aria-hidden="true">↓</span></a>
          </div>
          <p className="process-small-note">Clear scope. Shared decisions. Progress you can follow.</p>
        </div>
        <aside className="process-roadmap" aria-label="Your project at a glance">
          <div className="process-roadmap-heading"><span>Your project, made clearer</span><span className="process-dot" aria-hidden="true"/></div>
          <ol>{steps.map((step,index)=><li key={step.id}><span className="process-roadmap-number">{String(index+1).padStart(2,'0')}</span><div><strong>{step.short}</strong><span>{step.title}</span></div><step.icon size={20} aria-hidden="true"/></li>)}</ol>
          <div className="process-roadmap-note"><Handshake size={20}/><p>We agree the work with you before we begin.</p></div>
        </aside>
      </div>
    </header>

    <section id="overview" className="process-section process-container" aria-labelledby="process-steps-heading">
      <div className="process-section-heading"><div><p className="process-eyebrow">How we work</p><h2 id="process-steps-heading">Six steps. One shared plan.</h2></div><p>Explore each step to see what we do, what you receive and where your input helps.</p></div>
      <div id="journey" className="process-explorer">
        <div className="process-step-list" aria-label="Choose a process step">{steps.map((step,index)=><button key={step.id} type="button" aria-pressed={activeStep===index} aria-controls="process-step-detail" onClick={()=>setActiveStep(index)}><span className="process-step-number">{String(index+1).padStart(2,'0')}</span><span><strong>{step.short}</strong><small>{step.title}</small></span><ArrowRight size={18} aria-hidden="true"/></button>)}</div>
        <article id="process-step-detail" className="process-step-detail" aria-live="polite" aria-atomic="true" aria-labelledby="process-detail-heading">
          <div className="process-detail-top"><span className="process-icon"><CurrentIcon size={27}/></span><span>Step {activeStep+1} of 6</span></div>
          <h3 id="process-detail-heading">{current.title}</h3><p>{current.description}</p>
          <ul className="process-checklist">{current.activities.map(activity=><li key={activity}><Check size={18} aria-hidden="true"/>{activity}</li>)}</ul>
          <div className="process-detail-notes"><div><span>What you receive</span><p>{current.deliverable}</p></div><div><span>What we need from you</span><p>{current.input}</p></div></div>
        </article>
      </div>
    </section>

    <section className="process-delivery-band" id="delivery_model" aria-labelledby="process-delivery-heading"><div className="process-container process-section">
      <div className="process-section-heading"><div><p className="process-eyebrow">No guesswork</p><h2 id="process-delivery-heading">Know what to expect.</h2></div><p>A good working relationship starts with clear expectations and room for honest feedback.</p></div>
      <div className="process-promise-grid">{[
        {icon:FileCheck2,title:'Before we start',copy:'You receive a clear scope, responsibilities and costs. Any third-party subscriptions or usage charges are explained separately.'},
        {icon:MessageSquare,title:'While we work',copy:'We agree how to share updates and collect feedback. You can see what is happening and what needs your approval.'},
        {icon:Handshake,title:'When we hand over',copy:'Your team receives the agreed guidance and documentation. We explain the next steps and any support included in the plan.'},
      ].map(item=><article key={item.title}><span className="process-icon"><item.icon size={24}/></span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
    </div></section>

    <section id="faq" className="process-container process-section process-faq-layout" aria-labelledby="process-faq-heading"><div><p className="process-eyebrow">A few useful answers</p><h2 id="process-faq-heading">Before we<br/>get started.</h2><p>Every project is different. We will help you understand the right starting point.</p></div><div className="process-faq-list">{faqs.map((faq,index)=><details key={faq.question} open={index===0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

    <section id="consultation_form" className="process-container process-closing"><div id="final_cta"><p className="process-eyebrow">Start with a conversation</p><h2>What would make work<br/>easier for your business?</h2><p>Tell us what you want to improve. We will help you choose a practical place to start.</p><a className="process-button" href="/contact" onClick={event=>link(event,'contact')}>Let’s talk about your project <ArrowRight size={18}/></a><a className="process-text-link" href="/ai-readiness-assessment" onClick={event=>link(event,'ai-readiness-assessment')}>Not sure where to start? Take the AI assessment <ArrowRight size={16}/></a></div></section>
  </div>;
}
