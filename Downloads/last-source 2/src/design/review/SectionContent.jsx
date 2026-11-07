import React from 'react';
import BusinessOSFlow from './BusinessOSFlow.jsx';

// These are explanatory examples, never evidence of a client's performance.
const examples={
 'growth-os':{title:'From a local search to a useful enquiry.',image:'/media/review/cafe.webp',alt:'Illustrative cafe campaign photograph',business:'Basil House · Café launch',request:'Opening hours & table enquiries',source:'Google → café page',owner:'Front-of-house team',next:'Confirm a table request',steps:['Find the café','Check the details','Contact the team']},
 'business-os':{title:'A conversation with a clear next action.',business:'Acme Retail · Enquiry record',request:'Connect website and WhatsApp enquiries',source:'Website form · 10:24 AM',owner:'Priya · Customer team',next:'Discovery call · 11:00 AM',steps:['Request captured','Owner assigned','Follow-up recorded']},
 'agentic-os':{title:'An agent prepares. Your team decides.',image:'/media/homepage/crm-team-1280.webp',alt:'Illustrative team reviewing customer work',business:'Task DEMO-104 · Customer enquiry',request:'Prepare a product-demo response',source:'Approved product notes + enquiry',owner:'Priya · Review owner',next:'Approve or edit the prepared draft',steps:['Read approved context','Prepare the draft','Wait for approval']},
 'ai-marketing-platform':{title:'A campaign connected to its next enquiry.',image:'/media/review/audio.webp',alt:'Graphite headphones photographed for an illustrative campaign',business:'Northline · Headphone launch',request:'Product content, search answers, campaigns and a sales handover',source:'Approved product brief + customer questions',owner:'Marketing & customer team',next:'Respond to the product-demo enquiry',steps:['Prepare the campaign','Connect the response','Own the follow-up']},
 healthcare:{title:'An appointment enquiry, ready for the right team.',business:'Appointment enquiry · Example',request:'Ask about a service and available timing',source:'Hospital service page',owner:'Appointment desk',next:'Confirm the appropriate contact route',steps:['Service information','Appointment enquiry','Administrative follow-up']},
 'education-edtech':{title:'Keep the course and the question together.',business:'Admissions enquiry · Example',request:'Course format and eligibility information',source:'Programme enquiry form',owner:'Admissions counsellor',next:'Share approved course information',steps:['Find a programme','Ask a question','Speak to a counsellor']},
 'real-estate':{title:'A property enquiry with the useful context.',business:'Project enquiry · Example',request:'Two-bedroom availability and a site visit',source:'Project landing page',owner:'Project sales team',next:'Confirm a suitable site-visit slot',steps:['Project discovery','Enquiry captured','Visit follow-up']},
 manufacturing:{title:'An RFQ that reaches the right specialist.',business:'RFQ-104 · Illustrative request',request:'Component specification and order quantity',source:'Capabilities page → RFQ',owner:'Technical & commercial team',next:'Review feasibility before quoting',steps:['Show the capability','Capture the specification','Prepare a reviewed response']},
 'retail-ecommerce':{title:'Product discovery with a practical next step.',business:'Product enquiry · Example',request:'Check size and product availability',source:'Product page → enquiry',owner:'Store or support team',next:'Confirm stock and the buying route',steps:['Find a product','Check the details','Buy or contact the team']},
 'professional-services':{title:'A useful first conversation starts with context.',business:'Consultation request · Example',request:'Discuss requirements and service fit',source:'Relevant service page',owner:'Practice or client lead',next:'Review the fit and arrange a call',steps:['Understand the service','Share the requirement','Agree the next conversation']},
};
const productInputs={
 'ai-marketing-saas':['A campaign you repeat','Your approved brand material','Who reviews the final output'],
 'crm-ai-automation':['Where enquiries arrive','Your current customer records','Who owns the next response'],
 'conversational-ai':['The questions customers ask','Your approved service answers','When a person should take over'],
 'whatsapp-automation':['The messages you want to support','Your current WhatsApp setup','Who handles a handover'],
 'ai-calling-agents':['One defined call purpose','Your approved call information','The callback or handover owner'],
 'cloud-telephony':['Your teams and call routes','Opening hours and queues','The missed-call follow-up owner'],
 'rcs-messaging':['The message and intended action','Your current messaging provider','An alternate contact route'],
 'ai-agents':['One task with a clear boundary','Approved information and tools','The person who reviews actions'],
 'growth-os':['Your business and priority offer','Current website and channels','The enquiry you want to receive'],
 'business-os':['Where requests currently arrive','The tools your team uses','Who follows up each request'],
 'agentic-os':['A repeatable task to assess','The information it depends on','Who approves the next action'],
 'ai-marketing-platform':['Your marketing goal and priority offer','Current website, channels and approved material','The people who review and follow up'],
};
const serviceInputs={
 'seo-services':['Your website and service locations','Priority service or product pages','Search Console access, if available'],
 'website-development':['The pages your customers need','Your offer and brand material','The main action visitors should take'],
 'google-business-profile':['Your current Business Profile','Accurate hours and service details','The locations you actually serve'],
 'ppc-google-ads':['The offer and campaign objective','Your landing page and ad account','What counts as a useful enquiry'],
 'social-media-marketing':['The channels you currently use','Your audience and brand material','Your content approval owner'],
 'meta-ads':['Your offer and intended audience','The ad account and destination page','The customer action to measure'],
 'content-marketing':['The questions customers ask','Your subject-matter references','The person who checks accuracy'],
 'aeo-ai-search':['Your priority service questions','Your existing content and sources','The pages that need clearer answers'],
 'graphic-design-branding':['Your intended audience and brief','Existing logos and brand references','The formats you need to produce'],
 'email-marketing':['Your audience and message purpose','The email platform you use','Approved content and contact sources'],
 'ecommerce-development':['Your product range and variants','The buying and fulfilment process','Payments and systems to assess'],
 'analytics-cro':['The customer action that matters','Your site and measurement setup','Where visitors currently get stuck'],
 'ai-growth-marketing':['The marketing task taking time','The process and tools behind it','The person who checks the output'],
};
const industryInputs={
 healthcare:['Your services and locations','The appointment enquiry route','Who confirms service information'],
 'education-edtech':['Your courses and learner audience','The admissions enquiry process','Who approves course information'],
 'real-estate':['Your projects and property details','How site visits are arranged','Who owns project follow-ups'],
 manufacturing:['Your capabilities and buyer types','The information needed in an RFQ','Your technical and commercial owners'],
 'retail-ecommerce':['Your products and store channels','The buying or enquiry journey','Who confirms stock and fulfilment'],
 'professional-services':['Your specialisms and ideal clients','Your consultation or enquiry route','The person who reviews service fit'],
};
function keyFor(page){return typeof page==='string'?page:page?.slug||'';}
export function ProjectBrief({page,compact=false}){const slug=keyFor(page);const rows=productInputs[slug]||serviceInputs[slug]||industryInputs[slug]||['Your business goal','The setup you use today','The next step you want to improve'];return <aside className={'project-brief '+(compact?'project-brief-compact':'')} aria-label="What to bring to the first conversation"><span className="content-kicker">A USEFUL STARTING POINT</span><h3>Bring the context.<br/>{' '}We’ll help shape the scope.</h3><ol>{rows.map((text,i)=><li key={text}><span>{String(i+1).padStart(2,'0')}</span>{text}</li>)}</ol><p>No finished brief needed. Start with the work you want to improve.</p></aside>;}

export function OverviewExample({page}){if(page.slug==='business-os')return <BusinessOSFlow compact/>;const d=examples[page.slug];if(!d)return null;return <article className={'context-example '+(page.kind==='industry'?'context-example-industry':'')}><div className="context-example-top"><span className="content-kicker">IN PRACTICE</span><strong>ILLUSTRATIVE EXAMPLE</strong></div>{d.image&&<img className="context-photo" src={d.image} alt={d.alt} width="1000" height="563" loading="lazy"/>}<div className="context-example-body"><h3>{d.title}</h3><div className="context-route">{d.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><p>{d.request}</p></div></article>;}

export function JourneyRecord({page,step=0}){const d=examples[page.slug]||examples['business-os'];return <div className="journey-record"><div className="context-example-top"><span className="content-kicker">{d.business}</span><strong>EXAMPLE DATA</strong></div><div className="journey-record-body"><span className="record-state">{['New request','Context recorded','Assigned to the team','Next action recorded'][Math.min(step,3)]}</span><h4>{d.request}</h4><dl><div><dt>Source</dt><dd>{d.source}</dd></div><div><dt>Owner</dt><dd>{step<2?'Awaiting team review':d.owner}</dd></div><div><dt>Next action</dt><dd>{step<2?'Review the request':d.next}</dd></div></dl></div></div>;}

export function ScopePreview({page}){const rows=productInputs[page.slug]||industryInputs[page.slug]||productInputs['business-os'];return <div className="scope-preview"><span className="content-kicker">BEFORE IMPLEMENTATION</span><h3>A scope your team can review.</h3><ol>{[['Map',rows[0]],['Confirm',rows[1]],['Assign',rows[2]]].map(([label,text],i)=><li key={label}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{label}</strong><p>{text}</p></div></li>)}</ol><div className="scope-preview-foot">Agreed inputs <span>→</span> Reviewable scope <span>→</span> Team handover</div></div>;}

export function MeasurementExample({page}){const d=examples[page.slug]||examples['business-os'];return <div className="measurement-example"><div className="context-example-top"><span className="content-kicker">REVIEW THE NEXT STEP</span><strong>EXAMPLE DATA</strong></div><h3>{d.business}</h3><div className="measurement-sample-counts"><div><strong>8</strong><span>Requests recorded</span></div><div><strong>6</strong><span>Assigned to a person</span></div><div><strong>2</strong><span>Awaiting review</span></div></div><p><b>Review question</b> Does every request have an owner and a recorded next action?</p><small>Illustrative records only. Actual measures follow your agreed setup.</small></div>;}

export function PackageGuide({page}){return <div className="package-reading-guide"><span className="content-kicker">HOW TO READ THIS SCOPE</span><div><strong>Core setup</strong><p>The foundation described below.</p></div><div><strong>Optional connections</strong><p>Add only what solves the next requirement.</p></div><div><strong>Agreed proposal</strong><p>Selected work, owners, costs and handover.</p></div></div>;}

const outcomeRows={
 reputation:[['Input','A customer review and the relevant service context'],['Team action','Prepare a response and check its accuracy and tone'],['Visible result','An approved reply or a recorded follow-up task']],
 journey:[['Input','A customer question from a selected channel'],['Team action','Connect the contact, request and useful history'],['Visible result','One enquiry with an owner and a next step']],
 handover:[['Input','A conversation that needs a person to continue'],['Team action','Pass the question, history and proposed next action'],['Visible result','An assigned conversation with a response owner']],
 conversation:[['Input','A customer calls about a product or service'],['Team action','Capture the request within the agreed call scope'],['Visible result','A call record and an appropriate follow-up task']],
 queues:[['Input','A caller reaches a team that is already busy'],['Team action','Use the agreed queue, alternate route or callback'],['Visible result','An answered call or a visible callback request']],
 media:[['Input','An approved offer and its product information'],['Customer action','Open the details or choose a supported action'],['Visible result','A recorded response for the team to follow up']],
 carousel:[['Input','A small collection of relevant products or services'],['Customer action','Browse the cards and select the useful next step'],['Visible result','A product-specific response or destination visit']],
 approvals:[['Input','A proposed reply or change to a business record'],['Team action','The named reviewer approves, edits or rejects it'],['Visible result','A reviewed action with a clear decision owner']],
 effort:[['Input','A repeatable task and a set of representative cases'],['Review','Compare completed work, exceptions and rework'],['Visible result','A practical decision about what to automate next']],
};
export function WorkflowOutcome({type}){const rows=outcomeRows[type];if(!rows)return null;return <aside className="workflow-outcome"><span className="content-kicker">PROCESS → VISIBLE RESULT</span><dl>{rows.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl><small>Illustrative flow. Available actions follow the agreed implementation.</small></aside>;}
