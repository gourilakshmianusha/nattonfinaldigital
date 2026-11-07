import React,{useEffect,useRef,useState} from 'react';
import {tools,answers,defaults,calculateTool} from './calculations.js';

const stages=['Business Profile','Technology & Data','Processes & Automation','People & AI Skills','Governance & Readiness','Results & Recommendations'];
const currencies=['INR','USD','EUR','GBP','AUD','CAD','AED','SGD'];
const money=(value,currency)=>new Intl.NumberFormat(currency==='INR'?'en-IN':'en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(value);
export function formatResult(item,currency='INR'){
 if(!item||item.value===null||!Number.isFinite(item.value))return item?.unit==='months'?'Not reached':'Not defined';
 const value=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(item.value);
 return item.unit==='money'?money(item.value,currency):item.unit==='percent'?value+'%':item.unit==='score'?value+' / 100':item.unit==='months'?value+' months':item.unit==='hours'?value+' hours':item.unit==='multiple'?value+'×':value;
}

function Results({result,currency}){
 const ref=useRef(null);
 useEffect(()=>{ref.current?.focus({preventScroll:true});ref.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});},[result]);
 return <section className="resource-results" ref={ref} tabIndex="-1" aria-label="Your calculated result">
  <span className="resource-kicker">YOUR SCENARIO / YOUR INPUTS</span><h3>{result.level||'What your numbers show.'}</h3>
  <div className="resource-result-metrics">{result.metrics.map(m=><div key={m.label}><span>{m.label}</span><strong>{formatResult(m,currency)}</strong></div>)}</div>
  {result.domains&&<div className="resource-score-bars">{result.domains.map(d=><div key={d.name}><div><span>{d.name}</span><strong>{Math.round(d.score)} / 100</strong></div><span className="resource-score-track"><i style={{width:d.score+'%'}}/></span></div>)}</div>}
  {result.tables?.map(t=><div className="resource-result-table" key={t.title}><h4>{t.title}</h4><div className="resource-table-scroll"><table><thead><tr>{t.columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{t.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell&&typeof cell==='object'?formatResult(cell,currency):cell}</td>)}</tr>)}</tbody></table></div></div>)}
  {result.recommendations&&<div className="resource-next-steps"><h4>Your next practical steps</h4><ol>{result.recommendations.map(x=><li key={x}>{x}</li>)}</ol></div>}
  <details open className="resource-method"><summary>How this was calculated</summary>{result.methodology.map(x=><p key={x}>{x}</p>)}</details>
  <div className="resource-result-notes">{result.notes.map(x=><p key={x}>{x}</p>)}</div>
  <a className="resource-text-link" href="/contact/">Discuss this scenario with our team <span aria-hidden="true">↗</span></a>
 </section>;
}

function Field({field,value,onChange,prefix}){
 const id=prefix+'-'+field.key;
 if(field.type==='channels')return <fieldset className="resource-channel-fields"><legend>{field.label}</legend><p>Use allocation weights. Add historical cost per lead and conversion only where you have evidence.</p>{value.map((c,i)=><div className="resource-channel-row" key={c.name}><strong>{c.name}</strong>{[['weight','Weight'],['cpl','Historical CPL'],['conversion','Conversion %']].map(([key,label])=><label key={key}>{label}<input type="number" min="0" max={key==='conversion'?100:1e9} step="any" value={c[key]??''} aria-label={c.name+' '+label} onChange={e=>onChange(value.map((x,j)=>j===i?{...x,[key]:e.target.value===''?null:Number(e.target.value)}:x))}/></label>)}</div>)}</fieldset>;
 return <label className="resource-field" htmlFor={id}><span>{field.label}</span>{field.type==='select'?<select id={id} value={value} onChange={e=>onChange(e.target.value)}>{field.options.map(o=><option key={o} value={o}>{answers[o]||o}</option>)}</select>:<input id={id} type={field.type==='number'?'number':'text'} min={field.min} max={field.max} step={field.step||'any'} value={value} maxLength={field.type==='text'?1000:undefined} onChange={e=>onChange(e.target.value)} required={field.type==='number'||['industry','businessGoals'].includes(field.key)}/>}</label>;
}

function PlanningTool({tool}){
 const[values,setValues]=useState(()=>defaults(tool.id)),[step,setStep]=useState(0),[result,setResult]=useState(null),[error,setError]=useState(''),[currency,setCurrency]=useState('INR'),[draftStatus,setDraftStatus]=useState('');
 const assessment=tool.id==='ai_readiness',fields=assessment?tool.fields.filter(f=>step===0?!f.stage:f.stage===step):tool.fields;
 const update=(key,value)=>{setValues(v=>({...v,[key]:value}));setResult(null);setError('');};
 const submit=e=>{e.preventDefault();setError('');if(assessment&&step<4){if(fields.some(f=>(f.options&&values[f.key]==='unanswered')||(['industry','businessGoals'].includes(f.key)&&!String(values[f.key]).trim()))){setError('Complete this step, or choose Not applicable where appropriate.');return;}setStep(s=>s+1);return;}try{setResult(calculateTool(tool.id,values));if(assessment)setStep(5);}catch(e){setError(e.message);}};
 const reset=()=>{setValues(defaults(tool.id));setResult(null);setStep(0);setError('');setDraftStatus('');};
 const saveDraft=()=>{try{localStorage.setItem('natton-ai-readiness-draft',JSON.stringify({inputs:values,stage:Math.min(step,4)}));setDraftStatus('Draft saved on this device only.');}catch{setDraftStatus('Your browser could not save this draft.');}};
 const restoreDraft=()=>{try{const d=JSON.parse(localStorage.getItem('natton-ai-readiness-draft'));if(!d?.inputs)throw Error();setValues({...defaults(tool.id),...d.inputs});setStep(Math.max(0,Math.min(4,Number(d.stage)||0)));setResult(null);setDraftStatus('Your device draft has been restored.');}catch{setDraftStatus('No saved draft was found on this device.');}};
 return <>
  {assessment&&<ol className="resource-assessment-stages" aria-label="Assessment stages">{stages.map((name,i)=><li key={name} aria-current={step===i?'step':undefined} className={step>=i?'is-current':''}><span>{String(i+1).padStart(2,'0')}</span>{name}</li>)}</ol>}
  <div className={'resource-tool-layout '+(assessment&&step===5?'resource-tool-results-only':'')}>
   {!(assessment&&step===5)&&<form className="resource-tool-form" onSubmit={submit}><div className="resource-form-heading"><span className="resource-kicker">{assessment?`STEP ${step+1} OF 6`:'EDIT THE INPUTS'}</span><h3>{assessment?stages[step]:'Build your scenario.'}</h3><p>{assessment?'Choose the answer that reflects how your team works today.':'Example inputs are editable. Use your own baseline, costs and assumptions.'}</p></div>
    {!['ai_readiness','crm_score'].includes(tool.id)&&<label className="resource-field resource-currency"><span>Currency for your inputs</span><select value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>}
    <div className="resource-field-grid">{fields.map(f=><Field key={f.key} prefix={tool.id} field={f} value={values[f.key]} onChange={value=>update(f.key,value)}/>)}</div>
    {error&&<p className="resource-form-error" role="alert">{error}</p>}
    <div className="resource-form-actions">{assessment&&step>0&&<button type="button" className="resource-secondary" onClick={()=>setStep(s=>s-1)}>Previous</button>}<button type="submit" className="resource-primary">{assessment&&step<4?'Next step':'Calculate result'} <span aria-hidden="true">→</span></button><button type="button" className="resource-text-button" onClick={reset}>Reset inputs</button></div>
    {assessment&&<div className="resource-draft-actions"><button type="button" onClick={saveDraft}>Save draft on this device</button><button type="button" onClick={restoreDraft}>Restore draft</button><p role="status">{draftStatus}</p></div>}
   </form>}
   {result?<div><Results result={result} currency={currency}/>{assessment&&<button type="button" className="resource-secondary resource-edit-answers" onClick={()=>{setStep(0);setResult(null);}}>Edit your answers</button>}</div>:<aside className="resource-tool-guide"><span className="resource-kicker">A USEFUL STARTING POINT</span><h3>{assessment?'Understand the foundations. Choose one useful pilot.':'A clear model. A better conversation.'}</h3><p>{tool.description}</p><ol><li>Begin with a baseline you can explain.</li><li>Include the people and review work involved.</li><li>Compare the result with a small, measured test.</li></ol><p>Results stay in your browser. Nothing here submits an enquiry or creates a business forecast on your behalf.</p></aside>}
  </div>
 </>;
}

export function pageSpeedLink(value,device='mobile'){
 value=value.trim();if(/^[a-z][a-z0-9+.-]*:/i.test(value)&&!/^https?:\/\//i.test(value))throw new Error('Enter a public http or https page URL.');
 const url=new URL(/^https?:\/\//i.test(value)?value:'https://'+value);
 if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error('Enter a public http or https page URL.');
 return 'https://pagespeed.web.dev/analysis?url='+encodeURIComponent(url.href)+'&form_factor='+encodeURIComponent(device);
}
function WebsiteGrader(){
 const[url,setUrl]=useState(''),[device,setDevice]=useState('mobile'),[href,setHref]=useState(''),[error,setError]=useState('');
 return <div className="resource-tool-layout"><form className="resource-tool-form" onSubmit={e=>{e.preventDefault();try{setHref(pageSpeedLink(url,device));setError('');}catch(e){setError(e.message);}}}><h3>Run a Google PageSpeed test.</h3><p>Use Google’s own Lighthouse diagnostics for performance, accessibility, best practices and SEO.</p><label className="resource-field"><span>Public page URL</span><input value={url} onChange={e=>{setUrl(e.target.value);setHref('');}} placeholder="https://yourbusiness.com/service" required/></label><label className="resource-field"><span>Device</span><select value={device} onChange={e=>{setDevice(e.target.value);setHref('');}}><option value="mobile">Mobile</option><option value="desktop">Desktop</option></select></label>{error&&<p role="alert" className="resource-form-error">{error}</p>}<button type="submit" className="resource-primary">Prepare the test link →</button>{href&&<div className="resource-ready-link"><p>Your test link is ready. Google will analyse the page when you open it.</p><a className="resource-primary" href={href} target="_blank" rel="noopener noreferrer">Open Google PageSpeed ↗</a></div>}</form><aside className="resource-tool-guide"><span className="resource-kicker">READ THE EVIDENCE</span><h3>One score is a starting point.</h3><p>PageSpeed separates simulated lab diagnostics from real-user data where enough samples are available. Compare relevant pages and inspect the individual findings.</p><p>This tool opens Google’s report. It does not fabricate a website score or claim to run a test before you start one.</p><a className="resource-text-link" href="https://developers.google.com/speed/docs/insights/v5/about" target="_blank" rel="noopener noreferrer">How Google PageSpeed works ↗</a></aside></div>;
}

export function reviewPageHtml(html,Parser=DOMParser){
 if(!html.trim())throw new Error('Paste the page HTML to review.');
 // Keep a detached document inert, including its external resource references.
 const safe=html.replace(/\b(src|srcset|href)\s*=/gi,'data-review-$1=');
 const doc=new Parser().parseFromString(safe,'text/html'),title=doc.querySelector('title')?.textContent.trim()||'',description=doc.querySelector('meta[name="description"]')?.getAttribute('content')||'',h1=doc.querySelectorAll('h1').length,imgs=[...doc.querySelectorAll('img')],missingAlt=imgs.filter(i=>!i.hasAttribute('alt')).length;
 const checks=[{title:'Page title',ok:!!title,detail:title||'Add a descriptive title for this page.'},{title:'Meta description',ok:!!description,detail:description||'Add an accurate page summary.'},{title:'Primary heading hierarchy',ok:h1===1,detail:`${h1} H1 headings found. Review whether the page has one clear main topic.`},{title:'Document language',ok:!!doc.documentElement.lang,detail:doc.documentElement.lang||'No document language found.'},{title:'Canonical link',ok:!!doc.querySelector('link[rel="canonical"][data-review-href]'),detail:doc.querySelector('link[rel="canonical"]')?.getAttribute('data-review-href')||'Check the preferred URL for this page.'},{title:'Image alternatives',ok:missingAlt===0,detail:`${imgs.length} images; ${missingAlt} without an alt attribute. Empty alt text can be appropriate for decorative images.`}];
 const blocks=[...doc.querySelectorAll('script[type="application/ld+json"]')];let invalid=0;for(const b of blocks)try{JSON.parse(b.textContent);}catch{invalid++;}
 checks.push({title:'Structured data syntax',ok:invalid===0,detail:blocks.length?`${blocks.length} JSON-LD blocks; ${invalid} could not be parsed.`:'No JSON-LD found. Structured data is not a special requirement for AI search.'});
 const robots=doc.querySelector('meta[name="robots"]')?.getAttribute('content')||'';checks.push({title:'Indexing instruction',ok:!robots.toLowerCase().includes('noindex'),detail:robots||'No robots meta instruction found. A live crawl must also check response headers and robots.txt.'});
 return checks;
}
function HtmlReview(){
 const[html,setHtml]=useState(''),[checks,setChecks]=useState(null),[error,setError]=useState('');
 return <div className="resource-tool-layout"><form className="resource-tool-form" onSubmit={e=>{e.preventDefault();try{setChecks(reviewPageHtml(html));setError('');}catch(e){setError(e.message);}}}><h3>Review the evidence on one page.</h3><p>Paste rendered page HTML to inspect headings, metadata and answer-oriented foundations. This is an on-page review, not a live website crawl or ranking prediction.</p><label className="resource-field"><span>Rendered page HTML</span><textarea value={html} onChange={e=>{setHtml(e.target.value);setChecks(null);}} rows="12" maxLength="2000000" placeholder="<!doctype html>..." required/></label>{error&&<p role="alert" className="resource-form-error">{error}</p>}<button type="submit" className="resource-primary">Review this HTML →</button></form><section className="resource-tool-guide" aria-label="Page review results"><span className="resource-kicker">ON-PAGE EVIDENCE</span><h3>{checks?'What the HTML tells us.':'Useful answers start with a clear page.'}</h3>{checks?<ul className="resource-evidence-list">{checks.map(c=><li key={c.title}><span className={c.ok?'is-pass':'needs-review'}>{c.ok?'Found / review':'Needs attention'}</span><strong>{c.title}</strong><p>{c.detail}</p></li>)}</ul>:<p>Review a specific service or product page. Add the questions customers actually ask, accurate business details and a clear next step. Technical markers alone cannot show whether content is useful.</p>}<p>Only the pasted HTML is inspected. This does not test server responses, crawling, page speed or visibility in any AI answer.</p><a className="resource-text-link" href="/blog/seo-aeo-geo-first-steps/">Read the SEO, AEO and GEO guide →</a></section></div>;
}

export default function ResourceTools({mode='free'}){
 const[selected,setSelected]=useState(mode==='assessment'?'ai_readiness':''),[search,setSearch]=useState(''),[category,setCategory]=useState('All');
 useEffect(()=>{const query=new URLSearchParams(location.search).get('tool');if(query&&tools.some(t=>t.id===query))setSelected(query);},[]);
 const list=mode==='assessment'?tools.filter(t=>t.id==='ai_readiness'):tools.filter(t=>mode==='roi'?(t.hub==='roi'||t.id==='whatsapp_roi'):t.hub!=='roi');
 const tool=tools.find(t=>t.id===selected),matches=list.filter(t=>(category==='All'||t.category===category)&&[t.title,t.description,t.category].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <div className="resource-tool-suite" id="growth-tools"><nav className="resource-collections" aria-label="Growth tool collections"><a href="/free-tools/" aria-current={mode==='free'?'page':undefined}>Free Growth Tools</a><a href="/roi-calculator/" aria-current={mode==='roi'?'page':undefined}>ROI & Automation</a><a href="/ai-readiness-assessment/" aria-current={mode==='assessment'?'page':undefined}>AI Readiness</a></nav>
  {tool?<><div className="resource-selected-heading"><a href={mode==='roi'?'/roi-calculator/':'/free-tools/'}>← All tools</a><span className="resource-kicker">{tool.category}</span><h2>{tool.title}</h2><p>{tool.id==='seo_aeo_audit'?'Inspect the SEO and answer-oriented evidence in your page HTML.':tool.description}</p></div>{tool.id==='website_grader'?<WebsiteGrader/>:tool.id==='seo_aeo_audit'?<HtmlReview/>:<PlanningTool tool={tool} key={tool.id}/>}</>:<><div className="resource-tool-filters"><label className="resource-field"><span>Search tools</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try ROI, CRM or automation"/></label><div className="resource-filter-buttons" role="group" aria-label="Tool categories">{['All',...new Set(list.map(t=>t.category))].map(c=><button key={c} type="button" aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div></div><div className="resource-card-grid">{matches.map((t,i)=><a className="resource-tool-card" key={t.id} href={t.id==='ai_readiness'?'/ai-readiness-assessment/':`${mode==='roi'?'/roi-calculator/':'/free-tools/'}?tool=${t.id}`}><span className="resource-card-top"><b>{String(i+1).padStart(2,'0')}</b><small>{t.category}</small></span><h3>{t.title}</h3><p>{t.id==='seo_aeo_audit'?'Review page HTML for SEO and answer-oriented content foundations.':t.description}</p><span className="resource-tool-type">{t.id==='website_grader'?'Google PageSpeed report':t.id==='seo_aeo_audit'?'On-page HTML review':t.kind==='self_reported_estimate'?'Self-reported assessment':'Editable scenario calculator'}</span><span className="resource-card-link">{t.id==='ai_readiness'?'Take the assessment':'Open tool'} ↗</span></a>)}</div>{!matches.length&&<p role="status" className="resource-no-results">No matching tools. Try another category or search term.</p>}</>}
 </div>;
}
