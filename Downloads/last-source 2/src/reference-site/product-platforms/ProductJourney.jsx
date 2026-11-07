import React,{useState} from 'react';
import ProductSignal from './ProductSignal.jsx';
const flows={
 'ai-marketing-saas':['A clear campaign brief','Brand references connected','Drafts ready for review','Approved assets recorded'],
 'crm-ai-automation':['Customer enquiry captured','Useful context connected','A response owner assigned','Follow-up made visible'],
 'conversational-ai':['Customer message received','CRM context retrieved','A relevant reply prepared','A person reviews the response'],
 'whatsapp-automation':['An approved entry point','Customer intent understood','Availability checked','A booking request recorded'],
 'ai-calling-agents':['A call connects','The request is understood','A CRM task is prepared','The next action is reviewed'],
 'cloud-telephony':['A customer calls','The IVR routes the request','An available team responds','The outcome reaches the CRM'],
 'rcs-messaging':['A campaign is prepared','Rich product details appear','A customer chooses an action','The response is recorded'],
 'ai-agents':['A bounded task is defined','Approved tools retrieve context','A draft action is prepared','A person reviews the outcome']
};
const topics={
'ai-marketing-saas':['Campaign brief','Brand knowledge sources','Draft review','Campaign reporting'],
'crm-ai-automation':['Enquiry capture','Customer record','Sales pipeline','Follow-up report'],
'conversational-ai':['Incoming message','CRM record','Reply draft review','Conversation report'],
'whatsapp-automation':['Customer message','Booking requirement','Appointment calendar','Booking report'],
'ai-calling-agents':['Voice call','Knowledge sources','CRM record','Human review'],
'cloud-telephony':['Incoming call','IVR routing','Sales queue','Call report'],
'rcs-messaging':['Campaign content','Rich product card','Suggested action button','Campaign report'],
'ai-agents':['Agent task brief','Tool workflow','Draft approval','Evaluation report']};
const details=['The starting requirement is recorded with the information the team needs.','Relevant information stays connected to the request and its source.','A named person owns the next step. Exceptions have a clear handover route.','The team can review completed work, open items and what should happen next.'];
export function ProductMarquee({slug}){const[paused,setPaused]=useState(false);return <section tabIndex="0" className={'pf-marquee '+(paused?'is-paused':'')} aria-label="Connected workflow"><div className="container pf-marquee-label"><span>THE WORK, CONNECTED</span><button type="button" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play marquee':'Pause marquee'}</button></div><div className="pf-marquee-window" aria-hidden="true"><div className="pf-marquee-track">{[0,1].map(copy=><div key={copy}>{flows[slug].map((x,i)=><span key={x}><small>0{i+1}</small>{x}<b>→</b></span>)}</div>)}</div></div><ol className="pf-visually-hidden">{flows[slug].map(x=><li key={x}>{x}</li>)}</ol></section>;}
export function ProductJourney({slug}){return <section className="pf-journey" aria-labelledby="pf-journey-title"><div className="container"><span className="pf-eyebrow">A PRACTICAL WORKING EXAMPLE</span><h2 id="pf-journey-title">Follow the work.<br/>See the next step.</h2><p className="pf-journey-intro">From the first request to a reviewable outcome. Each stage keeps useful context and human responsibility visible.</p><div className="pf-stack">{flows[slug].map((title,i)=><article className="pf-stack-card" style={{'--step':i}} key={title}><div><span className="pf-eyebrow">0{i+1} / 04</span><h3>{title}</h3><p>{details[i]}</p><span className="pf-step-line">{flows[slug].map((_,j)=><i key={j} className={j<=i?'done':''}/>)}</span></div><ProductSignal title={topics[slug][i]} slug={slug}/></article>)}</div><p className="pf-disclaimer">Illustrative process and sample records. These are not client results or promised performance.</p></div></section>;}
