import React,{useState} from 'react';
import {Ambient} from '../motion.jsx';

const routes=[
 {key:'sales',label:'Sales enquiry',owner:'Priya · Sales',action:'Discovery call · 11:00 AM',result:'Qualified · Follow-up scheduled'},
 {key:'booking',label:'Appointment request',owner:'Ankit · Scheduling',action:'Confirm a suitable appointment slot',result:'Availability checked · Confirmation pending'},
 {key:'support',label:'Support request',owner:'Neha · Customer support',action:'Review the question and reply with context',result:'Assigned · Response due'},
];
export default function BusinessOSFlow({compact=false}){const[selected,setSelected]=useState('sales'),[channel,setChannel]=useState('Website form');const active=routes.find(x=>x.key===selected);return <div className={'business-flow '+(compact?'business-flow-compact':'')} aria-label="How BusinessOS moves an enquiry to a recorded outcome">
  <div className="business-flow-top"><span>BUSINESSOS / HOW THE WORK MOVES</span><b>ILLUSTRATIVE WORKFLOW</b></div>
  <div className="business-flow-body">
   <div className="business-flow-channels" role="group" aria-label="Choose an example enquiry source">{['Website form','WhatsApp','Phone call'].map(x=><button type="button" key={x} aria-pressed={channel===x} onClick={()=>setChannel(x)}>{x}</button>)}</div>
   <div className="business-flow-join" aria-hidden="true"><i/><i/><i/></div>
   <div className="business-flow-node business-flow-record"><span className="business-flow-number">01</span><div><h3>Capture the request.<br className="business-flow-wide"/> Match the customer record.</h3><p>Contact, conversation and source stay together.</p><span className="business-flow-sample">Meera Shah <i>·</i> {channel}</span></div></div>
   <div className="business-flow-arrow" aria-hidden="true">↓</div>
   <div className="business-flow-decision"><span>02 / ROUTE THE REQUIREMENT</span><strong>What does the customer need?</strong></div>
   <div className="business-flow-split" aria-hidden="true"><i/><i/><i/></div>
   <div className="business-flow-routes" role="group" aria-label="Choose an example request type">{routes.map(x=><button type="button" key={x.key} aria-pressed={selected===x.key} onClick={()=>setSelected(x.key)}><strong>{x.label}</strong><span>{x.owner}</span></button>)}</div>
   <div className="business-flow-join" aria-hidden="true"><i/><i/><i/></div>
   <div className="business-flow-node business-flow-followup"><span className="business-flow-number">03</span><div><h3>A named person owns the next step.</h3><p>Follow up with the customer. Keep the action visible.</p><span className="business-flow-review">AI-assisted replies or sensitive actions follow the agreed review rules.</span></div></div>
   <div className="business-flow-arrow" aria-hidden="true">↓</div>
   <div className="business-flow-result" aria-live="polite"><div><span>04 / RECORDED OUTCOME</span><strong>{active.result}</strong></div><dl><div><dt>Owner</dt><dd>{active.owner}</dd></div><div><dt>Next action</dt><dd>{active.action}</dd></div></dl></div>
  </div>
  <div className="business-flow-foot">A shared record. A responsible person. A visible next action.</div>
 </div>;}

export function BusinessOSFlowSection({page}){return <section id="process" className="process-section section-space business-flow-section"><Ambient variant="routes"/><div className="container"><div className="section-heading"><div><p className="section-label"><i/>HOW BUSINESSOS WORKS</p><h2>From the first request.<br/>To a recorded next step.</h2></div><p>See how an enquiry moves through the customer workspace. Choose a source and request type to follow an example route.</p></div><BusinessOSFlow/><details className="business-implementation"><summary>How we configure this with your team <span aria-hidden="true">+</span></summary><ol>{page.process.map((x,i)=><li key={x.title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{x.title}</h3><p>{x.description}</p></div></li>)}</ol></details></div></section>;}
