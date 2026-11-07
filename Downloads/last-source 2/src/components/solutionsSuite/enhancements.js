// Adapted from the supplied Natton Solutions suite; lifecycle owned by React.
export function initSite(scope) {
const {document,window,addEventListener,matchMedia,IntersectionObserver,setTimeout,clearTimeout,requestAnimationFrame,cancelAnimationFrame}=scope;
// Progressive enhancement only: page content and navigation work without JS.
const toggle=document.querySelector('.mobile-menu-toggle');
const mobile=document.querySelector('.mobile-navigation');
function closeMenu(){if(!toggle||!mobile)return;mobile.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';mobile.hidden=open;toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');});
mobile?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();document.querySelector('.mega-nav')?.removeAttribute('open');}});
document.addEventListener('click',event=>{const mega=document.querySelector('.mega-nav');if(mega&&!mega.contains(event.target))mega.removeAttribute('open');});
matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;let shown=0;
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('.solutions-grid [data-category]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)shown++;});
  const status=document.querySelector('[data-filter-status]');if(status)status.textContent=`Showing ${shown} ${shown===1?'solution':'products'}`;
}));

document.querySelectorAll('[data-workflow]').forEach(demo=>{
  const steps=[...demo.querySelectorAll('[data-step]')],play=demo.querySelector('.play-example');let timer=null,current=0,playing=false;
  function select(i){current=i;steps.forEach((step,j)=>{step.classList.toggle('is-active',j===i);step.setAttribute('aria-pressed',String(j===i));});demo.querySelector('[data-step-count]').textContent=`EXAMPLE STEP ${String(i+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;demo.querySelector('[data-step-title]').textContent=steps[i].dataset.title;demo.querySelector('[data-step-detail]').textContent=steps[i].dataset.detail;}
  function stop(){clearTimeout(timer);playing=false;play.querySelector('span').textContent='Play example';play.setAttribute('aria-label','Play the workflow example');}
  function advance(){if(current===steps.length-1){stop();return;}select(current+1);timer=setTimeout(advance,1800);}
  steps.forEach((step,i)=>step.addEventListener('click',()=>{stop();select(i);}));
  play.addEventListener('click',()=>{if(playing){stop();return;}playing=true;select(0);play.querySelector('span').textContent='Pause example';play.setAttribute('aria-label','Pause the workflow example');timer=setTimeout(advance,1800);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
});

if('IntersectionObserver' in window){
  const anchors=[...document.querySelectorAll('.page-nav a[href^="#"]')];
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){anchors.forEach(a=>a.classList.toggle('is-active',a.hash===`#${entry.target.id}`));}});},{rootMargin:'-20% 0px -55% 0px',threshold:0});
  anchors.forEach(a=>{const section=document.querySelector(a.hash);if(section)observer.observe(section);});
}

const form=document.querySelector('[data-enquiry]');
if(form){
  const slug=new URLSearchParams(location.search).get('solution');
  const option=[...form.elements.solution.options].find(o=>o.dataset.slug===slug);if(option)form.elements.solution.value=option.value;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form).entries());if(data.website_check)return;
    const status=form.querySelector('.form-status'),submit=form.querySelector('[type="submit"]');
    const body=`Hi Natton team,\n\nI would like to discuss: ${data.solution}\n\nName: ${data.name}\nEmail: ${data.email}\nBusiness: ${data.business||'Not provided'}\n\nMy requirement:\n${data.message}\n`;
    if(form.dataset.endpoint){
      submit.disabled=true;status.textContent='Sending your enquiry…';
      try{const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name,email:data.email,business:data.business,solution:data.solution,message:data.message})});if(!response.ok)throw new Error('The enquiry could not be sent.');status.textContent='Your enquiry was sent to Natton.';form.reset();}
      catch{status.textContent=`The enquiry could not be sent. Please email ${form.dataset.email} directly.`;}
      finally{submit.disabled=false;}
    }else{
      const mailto=`mailto:${form.dataset.email}?subject=${encodeURIComponent(`Enquiry: ${data.solution}`)}&body=${encodeURIComponent(body)}`;
      location.href=mailto;status.textContent='Your email app should open a draft. Please review it and send it. If it does not open, email us directly using the address alongside this form.';
    }
  });
}

}
export function initExperience(scope) {
const {document,window,addEventListener,matchMedia,IntersectionObserver,setTimeout,clearTimeout,requestAnimationFrame,cancelAnimationFrame}=scope;
// Progressive enhancements for the expanded solutions suite.
// Every demonstration stays in the browser; no messaging, calling, AI or payment API is used.
(()=>{
 const page=document.querySelector('.experience-page');if(!page)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let preference='on';
 try{preference=sessionStorage.getItem('natton-solution-motion')||'on';}catch{}
 let motionOff=reduced.matches||preference==='off';const stoppers=[];
 const motionButton=page.querySelector('[data-ex-motion]');
 function setMotion(){page.classList.toggle('ex-motion-off',motionOff);if(motionButton){motionButton.disabled=reduced.matches;motionButton.setAttribute('aria-pressed',String(motionOff));motionButton.setAttribute('aria-label',reduced.matches?'Page motion follows your system preference':motionOff?'Enable page motion':'Pause page motion');motionButton.querySelector('span').textContent=reduced.matches?'Reduced motion':motionOff?'Enable page motion':'Pause page motion';}if(motionOff)stoppers.forEach(stop=>stop());}
 motionButton?.addEventListener('click',()=>{preference=motionOff?'on':'off';motionOff=preference==='off';try{sessionStorage.setItem('natton-solution-motion',preference);}catch{}setMotion();});
 reduced.addEventListener('change',()=>{motionOff=reduced.matches||preference==='off';setMotion();});setMotion();
 const select=(buttons,current)=>buttons.forEach(b=>{const active=b===current;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
 page.querySelectorAll('[data-options]').forEach(group=>{const buttons=[...group.querySelector('.ex-option-buttons').querySelectorAll('[data-option]')],panels=[...group.querySelector('.ex-option-panels').children];buttons.forEach(button=>button.addEventListener('click',()=>{select(buttons,button);panels.forEach(panel=>panel.hidden=panel.dataset.panel!==button.dataset.option);group.dispatchEvent(new Event('examplechange'));}));});
 page.querySelectorAll('[data-checklist]').forEach(group=>{const boxes=[...group.querySelectorAll('input[type="checkbox"]')];boxes.forEach(box=>box.addEventListener('change',()=>group.querySelector('[data-checklist-result]').textContent=`${boxes.filter(b=>b.checked).length} of ${boxes.length} example review steps complete.`));});
 page.querySelectorAll('[data-reviewed]').forEach(button=>button.addEventListener('click',()=>{button.closest('.ex-demo').querySelector('[data-reviewed-status]').textContent='Reviewed in this example. Nothing has been posted.';}));
 page.querySelectorAll('[data-booking-example]').forEach(group=>{let day='Tuesday',time='10:30 AM';const days=[...group.querySelectorAll('[data-day]')],times=[...group.querySelectorAll('[data-time]')];const update=()=>group.querySelector('[data-booking-selection]').textContent=`Example request: ${day} at ${time}.`;days.forEach(b=>b.addEventListener('click',()=>{day=b.dataset.day;select(days,b);update();}));times.forEach(b=>b.addEventListener('click',()=>{time=b.dataset.time;select(times,b);update();}));});
 page.querySelectorAll('[data-catalogue]').forEach(group=>{const buttons=[...group.querySelectorAll('[data-catalogue-item]')];buttons.forEach(button=>button.addEventListener('click',()=>{const chosen=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(chosen));button.classList.toggle('selected',chosen);button.childNodes[0].textContent=chosen?'Remove from example list ':'Add to example list ';const count=buttons.filter(b=>b.getAttribute('aria-pressed')==='true').length;group.querySelector('[data-catalogue-result]').textContent=`${count} example ${count===1?'item':'items'} selected.`;}));group.querySelector('[data-payment-preview]').addEventListener('click',()=>{const panel=group.querySelector('[data-payment-panel]');panel.hidden=!panel.hidden;});});
 page.querySelectorAll('[data-transcript]').forEach(group=>{const lines=[...group.querySelectorAll('[data-transcript-line]')],button=group.querySelector('[data-transcript-play]'),status=group.querySelector('[data-transcript-status]');let timers=[],running=false;
 const stop=()=>{timers.forEach(clearTimeout);timers=[];running=false;group.classList.remove('playing');button.querySelector('span').textContent='Play the transcript example';};stoppers.push(stop);
 const phase=i=>{lines.forEach((line,n)=>line.classList.toggle('current',n===i));status.textContent=`Example turn ${i+1} of ${lines.length}: ${lines[i].querySelector('p').textContent}`;};
 button.addEventListener('click',()=>{if(running){stop();status.textContent='Example paused. Play it again when you are ready.';return;}stop();if(motionOff){phase(lines.length-1);status.textContent='Example complete. The request and confirmed details reach the assigned employee.';return;}running=true;group.classList.add('playing');button.querySelector('span').textContent='Pause the example';phase(0);lines.slice(1).forEach((_,i)=>timers.push(setTimeout(()=>phase(i+1),(i+1)*1400)));timers.push(setTimeout(()=>{stop();status.textContent='Example complete. The request and confirmed details reach the assigned employee.';},lines.length*1400));});
 });
 page.querySelectorAll('[data-ivr]').forEach(group=>{const input=group.querySelector('[data-ivr-greeting]');input.addEventListener('input',()=>{group.querySelector('[data-ivr-preview]').textContent=input.value.trim()||'Add an example greeting to preview it here.';});const buttons=[...group.querySelectorAll('[data-ivr-route]')];buttons.forEach(button=>button.addEventListener('click',()=>{select(buttons,button);group.querySelector('[data-ivr-result]').textContent=`Example route: ${button.dataset.ivrRoute} team.`;}));});
 page.querySelectorAll('[data-queue]').forEach(group=>{let next=0;const people=[...group.querySelectorAll('[data-queue-person]')],status=group.querySelector('[data-queue-status]');group.querySelector('[data-queue-route]').addEventListener('click',()=>{if(next<2){const person=people[next++];person.textContent='On an example call';person.classList.remove('available');status.textContent=`Example call assigned to Sales team ${next===1?'A':'B'}.`;}else status.textContent='Both example sales employees are busy. Use the agreed queue or callback fallback.';});group.querySelector('[data-queue-reset]').addEventListener('click',()=>{next=0;people.slice(0,2).forEach(p=>{p.textContent='Available';p.classList.add('available');});status.textContent='Example reset. Two sales employees are available.';});});
 page.querySelectorAll('[data-carousel]').forEach(group=>{const track=group.querySelector('[data-carousel-track]');const move=direction=>track.scrollBy({left:direction*(track.querySelector('article').getBoundingClientRect().width+16),behavior:motionOff?'auto':'smooth'});group.querySelector('[data-carousel-prev]').addEventListener('click',()=>move(-1));group.querySelector('[data-carousel-next]').addEventListener('click',()=>move(1));group.querySelectorAll('[data-carousel-choice]').forEach(button=>button.addEventListener('click',()=>group.querySelector('[data-carousel-result]').textContent=`Example choice: ${button.dataset.carouselChoice}. The next step would collect the relevant enquiry details.`));});
 page.querySelectorAll('[data-knowledge]').forEach(group=>{const input=group.querySelector('[data-knowledge-search]'),docs=[...group.querySelectorAll('[data-knowledge-document]')],status=group.querySelector('[data-knowledge-status]');input.addEventListener('input',()=>{const words=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;docs.forEach(doc=>{const hay=(doc.dataset.knowledgeDocument+' '+doc.textContent).toLowerCase();doc.hidden=!words.every(word=>hay.includes(word));if(!doc.hidden)count++;});status.textContent=count?`${count} prepared example ${count===1?'source':'sources'} match${count===1?'es':''}.`:'No example source matches. A live assistant should ask for clarification or hand over.';});});
 page.querySelectorAll('[data-approval]').forEach(group=>group.querySelectorAll('[data-approval-choice]').forEach(button=>button.addEventListener('click',()=>{group.querySelector('[data-approval-status]').textContent=button.dataset.approvalChoice==='approve'?'Approved in this example. The prepared follow-up task can move to the next step. No record has been created.':'Held in this example. Ask the reviewer for the missing detail before continuing.';select([...group.querySelectorAll('[data-approval-choice]')],button);})));
 page.querySelectorAll('[data-effort]').forEach(group=>{const tasks=group.querySelector('[data-effort-tasks]'),minutes=group.querySelector('[data-effort-minutes]'),share=group.querySelector('[data-effort-share]');function calculate(){const t=tasks.valueAsNumber,m=minutes.valueAsNumber,p=share.valueAsNumber;group.querySelector('[data-effort-share-label]').textContent=p+'%';if(!Number.isFinite(t)||!Number.isFinite(m)||!tasks.checkValidity()||!minutes.checkValidity()){group.querySelector('[data-effort-hours]').textContent='—';group.querySelector('[data-effort-formula]').textContent='Enter valid non-negative values within the input limits.';return;}group.querySelector('[data-effort-hours]').textContent=(t*m*p/6000).toLocaleString('en-IN',{maximumFractionDigits:1});group.querySelector('[data-effort-formula]').textContent=`${t.toLocaleString('en-IN')} tasks × ${m} minutes × ${p}% ÷ 60.`;}[tasks,minutes,share].forEach(input=>input.addEventListener('input',calculate));calculate();});
 page.querySelectorAll('[data-sequence]').forEach(group=>{const steps=[...group.querySelectorAll('[data-sequence-step]')],button=group.querySelector('[data-sequence-play]'),output=group.querySelector('[data-sequence-result]');let timers=[],running=false;
 const stop=()=>{timers.forEach(clearTimeout);timers=[];running=false;button.querySelector('span').textContent='Play the example';};stoppers.push(stop);
 const phase=i=>{select(steps,steps[i]);output.textContent=steps[i].querySelector('p').textContent;};steps.forEach((step,i)=>step.addEventListener('click',()=>{stop();phase(i);}));
 button.addEventListener('click',()=>{if(running){stop();return;}stop();if(motionOff){phase(steps.length-1);return;}running=true;button.querySelector('span').textContent='Pause example';phase(0);steps.slice(1).forEach((_,i)=>timers.push(setTimeout(()=>phase(i+1),(i+1)*1300)));timers.push(setTimeout(stop,steps.length*1300));});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stoppers.forEach(stop=>stop());});
 if('IntersectionObserver' in window){page.classList.add('ex-enhanced');const sections=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('ex-in-view',entry.isIntersecting)),{rootMargin:'80px 0px'});page.querySelectorAll('section').forEach(section=>sections.observe(section));if(!motionOff){const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ex-revealed');reveals.unobserve(entry.target);}}),{rootMargin:'40px 0px',threshold:.05});page.querySelectorAll('[data-ex-reveal]').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight)el.classList.add('ex-reveal-wait');reveals.observe(el);});}}
 const nav=page.querySelector('.ex-page-nav');if(nav){const links=[...nav.querySelectorAll('a[href^="#"]')],targets=links.map(link=>({link,target:document.querySelector(link.hash)})).filter(x=>x.target&&x.link.hash!=='#top');let frame=0;const update=()=>{frame=0;let active=links[0];for(const item of targets)if(item.target.getBoundingClientRect().top<nav.getBoundingClientRect().bottom+100)active=item.link;links.forEach(link=>{link.classList.toggle('selected',link===active);if(link===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});};addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});addEventListener('resize',update);update();}
})();

}
export function initCrm(scope) {
const {document,window,addEventListener,matchMedia,IntersectionObserver,setTimeout,clearTimeout,requestAnimationFrame,cancelAnimationFrame}=scope;
// CRM page enhancements. All business copy is in the initial HTML.
// Every demo is local and illustrative; no CRM, calendar, messaging or AI API is called.
(()=>{
 const page=document.querySelector('.crm-page');if(!page)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let stored='';try{stored=sessionStorage.getItem('natton-crm-motion')||'';}catch{}
 let motionOff=reduced.matches||stored==='off';
 const motionButton=page.querySelector('[data-crm-motion]');
 let stopAutomation=()=>{};
 function updateMotion(){
  page.classList.toggle('crm-motion-off',motionOff);
  motionButton.disabled=reduced.matches;
  motionButton.setAttribute('aria-pressed',String(motionOff));
  motionButton.setAttribute('aria-label',reduced.matches?'Motion follows your reduced-motion preference':motionOff?'Enable page motion':'Pause page motion');
  motionButton.querySelector('span').textContent=reduced.matches?'Reduced motion':motionOff?'Enable motion':'Pause motion';
  if(motionOff)stopAutomation('Motion is paused. Choose Run the example to see the completed workflow without animation.');
 }
 motionButton.addEventListener('click',()=>{motionOff=!motionOff;stored=motionOff?'off':'on';try{sessionStorage.setItem('natton-crm-motion',stored);}catch{}updateMotion();});
 reduced.addEventListener('change',()=>{motionOff=reduced.matches||stored==='off';updateMotion();});
 updateMotion();
 if('IntersectionObserver' in window){
  page.classList.add('crm-enhanced');
  const sections=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('crm-in-view',entry.isIntersecting);},{rootMargin:'80px 0px',threshold:0});
  page.querySelectorAll('section').forEach(section=>sections.observe(section));
  if(!motionOff){
   const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('crm-revealed');reveal.unobserve(entry.target);}},{rootMargin:'35px 0px',threshold:.06});
   page.querySelectorAll('[data-reveal]').forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('crm-revealed');else el.classList.add('crm-reveal-wait');reveal.observe(el);});
  }

 }
 const activate=(buttons,selected)=>buttons.forEach(b=>{const yes=b===selected;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
 const recordDemo=page.querySelector('[data-record-demo]');
 const records={
  new:{title:'New service enquiry',tags:['Website enquiry','Assigned to sales'],next:'Contact the customer to understand the requirement.',timeline:[['Enquiry received','Customer details captured'],['Owner assigned','Your sales team has the context'],['Follow-up task created','A useful next step is visible']]},
  returning:{title:'Returning customer',tags:['Previous enquiry connected','Customer history available'],next:'Review the earlier conversation before replying.',timeline:[['Earlier enquiry linked','The customer’s previous context stays available'],['A new question received','The latest request is attached to the record'],['Team member notified','Someone can continue the conversation']]},
  followup:{title:'Follow-up due',tags:['Callback requested','Task assigned'],next:'Confirm a suitable callback time with the customer.',timeline:[['Callback requested','Customer preference captured'],['Employee assigned','The follow-up has a clear owner'],['Task ready for review','The team can record what happens next']]},
 };
 const recordButtons=[...recordDemo.querySelectorAll('[data-record]')];
 recordButtons.forEach(button=>button.addEventListener('click',()=>{
  const data=records[button.dataset.record];if(!data)return;activate(recordButtons,button);
  recordDemo.querySelector('[data-record-title]').textContent=data.title;
  recordDemo.querySelector('[data-record-tags]').replaceChildren(...data.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));
  recordDemo.querySelector('[data-record-next]').textContent=data.next;
  recordDemo.querySelector('[data-record-timeline]').replaceChildren(...data.timeline.map(([title,detail])=>{const li=document.createElement('li'),dot=document.createElement('i'),span=document.createElement('span'),small=document.createElement('small');span.textContent=title;small.textContent=detail;span.append(small);li.append(dot,span);return li;}));
  const detail=recordDemo.querySelector('.crm-record-detail');detail.classList.remove('is-updating');requestAnimationFrame(()=>detail.classList.add('is-updating'));
 }));
 const pipeline=page.querySelector('[data-pipeline-demo]');const columns=[...pipeline.querySelectorAll('[data-pipeline-stage]')];const deals=[...pipeline.querySelectorAll('[data-deal]')];
 const initial=deals.map(d=>({el:d,stage:Number(d.dataset.stage)}));
 function updateBoard(){columns.forEach((column,i)=>column.querySelector('[data-stage-count]').textContent=column.querySelectorAll('[data-deal]').length);deals.forEach(card=>{const stage=Number(card.dataset.stage);card.querySelector('[data-deal-back]').disabled=stage===0;card.querySelector('[data-deal-forward]').disabled=stage===columns.length-1;});}
 function moveDeal(card,next,announce=true){
  next=Math.max(0,Math.min(columns.length-1,next));card.dataset.stage=String(next);columns[next].querySelector('.crm-sales-board-dropzone').append(card);card.classList.remove('just-moved');requestAnimationFrame(()=>card.classList.add('just-moved'));updateBoard();
  if(announce){const title=card.querySelector('h3').textContent;const stage=columns[next].querySelector('.crm-sales-board-column-title>span').textContent.trim();pipeline.querySelector('[data-pipeline-status]').textContent=`${title} moved to ${stage}. The example board has been updated.`;}
 }
 pipeline.addEventListener('click',event=>{const button=event.target.closest('[data-deal-back],[data-deal-forward]');if(!button)return;const card=button.closest('[data-deal]');moveDeal(card,Number(card.dataset.stage)+(button.hasAttribute('data-deal-forward')?1:-1));const next=card.querySelector('[data-deal-forward]:not(:disabled)')||card.querySelector('[data-deal-back]:not(:disabled)');next?.focus({preventScroll:true});});
 deals.forEach(card=>{card.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',card.dataset.deal);event.dataTransfer.effectAllowed='move';});card.addEventListener('dragend',()=>columns.forEach(c=>c.classList.remove('drag-over')));});
 columns.forEach((column,index)=>{column.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='move';column.classList.add('drag-over');});column.addEventListener('dragleave',event=>{if(!column.contains(event.relatedTarget))column.classList.remove('drag-over');});column.addEventListener('drop',event=>{event.preventDefault();columns.forEach(c=>c.classList.remove('drag-over'));const id=event.dataTransfer.getData('text/plain');const card=deals.find(d=>d.dataset.deal===id);if(card)moveDeal(card,index);});});
 pipeline.querySelector('[data-pipeline-reset]').addEventListener('click',()=>{initial.forEach(({el,stage})=>moveDeal(el,stage,false));pipeline.querySelector('[data-pipeline-status]').textContent='Example reset. Try moving an enquiry to its next stage.';});
 const booking=page.querySelector('[data-booking-demo]');let day='Tuesday',time='10:30 AM';
 const days=[...booking.querySelectorAll('[data-booking-day]')],times=[...booking.querySelectorAll('[data-booking-time]')];
 function bookingResult(){booking.querySelector('[data-booking-result]').textContent=`Example selection: ${day} at ${time}`;}
 days.forEach(b=>b.addEventListener('click',()=>{day=b.dataset.bookingDay;activate(days,b);bookingResult();}));times.forEach(b=>b.addEventListener('click',()=>{time=b.dataset.bookingTime;activate(times,b);bookingResult();}));
 const formDemo=page.querySelector('[data-form-demo]');formDemo.querySelectorAll('[data-form-toggle]').forEach(input=>input.addEventListener('change',()=>{const field=[...formDemo.querySelectorAll('[data-form-field]')].find(f=>f.dataset.formField===input.dataset.formToggle);if(field)field.hidden=!input.checked;}));
 const messaging=page.querySelector('[data-message-demo]');const channelButtons=[...messaging.querySelectorAll('[data-message-channel]')];let replyShown=false;
 const messages={email:{type:'Email follow-up example',body:'Thanks for getting in touch. We’ve received your service enquiry, and our team will help you find the right next step.',reply:'Thanks. I’d like to discuss availability.'},whatsapp:{type:'WhatsApp journey example',body:'Hello! Thanks for your enquiry. Would you like service information, help with a booking, or a conversation with our team?',reply:'A conversation with the team, please.'},sms:{type:'SMS reminder example',body:'Hello from your service team. You requested a callback. Please let us know a suitable time so we can follow up.',reply:'Tuesday afternoon would work for me.'}};
 let channel='email';
 channelButtons.forEach(b=>b.addEventListener('click',()=>{channel=b.dataset.messageChannel;activate(channelButtons,b);messaging.querySelector('[data-message-icon]').replaceChildren(b.querySelector('.icon').cloneNode(true));const data=messages[channel];messaging.querySelector('[data-message-type]').textContent=data.type;const bubble=messaging.querySelector('[data-message-content]');bubble.textContent=data.body;bubble.style.animation='none';requestAnimationFrame(()=>bubble.style.animation='');messaging.querySelector('[data-message-reply]').textContent=data.reply;replyShown=false;messaging.querySelector('[data-message-reply]').hidden=true;messaging.querySelector('[data-message-next]').childNodes[0].textContent='Show customer reply ';}));
 messaging.querySelector('[data-message-next]').addEventListener('click',()=>{replyShown=!replyShown;messaging.querySelector('[data-message-reply]').hidden=!replyShown;messaging.querySelector('[data-message-next]').childNodes[0].textContent=replyShown?'Hide customer reply ':'Show customer reply ';});
 const automation=page.querySelector('[data-crm-automation]'),runButton=automation.querySelector('[data-automation-run]'),nodes=[...automation.querySelectorAll('[data-automation-node]')],line=automation.querySelector('.crm-automation-line>i');
 let running=false,timers=[];
 const statusMessages=['An enquiry starts the example workflow.','The enquiry is connected to a customer record.','An employee is assigned and receives the context.','The next task is prepared. Your team can review the result.'];
 stopAutomation=message=>{timers.forEach(clearTimeout);timers=[];running=false;runButton.querySelector('span').textContent='Run the example';if(message)automation.querySelector('[data-automation-status]').textContent=message;};
 function phase(index){nodes.forEach((node,i)=>{node.classList.toggle('is-active',i===index);node.classList.toggle('is-complete',i<index);});line.style.width=`${index/(nodes.length-1)*100}%`;automation.querySelector('[data-automation-status]').textContent=statusMessages[index];}
 runButton.addEventListener('click',()=>{
  if(running){stopAutomation('Example stopped. Run it again when you’re ready.');return;}
  stopAutomation();phase(0);
  if(motionOff){phase(nodes.length-1);nodes.forEach(n=>n.classList.add('is-complete'));automation.querySelector('[data-automation-status]').textContent='Example complete: the enquiry is recorded, an employee is assigned and the next task is ready.';return;}
  running=true;runButton.querySelector('span').textContent='Stop example';
  for(let i=1;i<nodes.length;i++)timers.push(setTimeout(()=>phase(i),i*1200));
  timers.push(setTimeout(()=>{nodes.forEach(n=>n.classList.add('is-complete'));stopAutomation('Example complete: the enquiry is recorded, an employee is assigned and the next task is ready.');},nodes.length*1200));
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stopAutomation('Example stopped while the page was in the background.');});
 const aiDemo=page.querySelector('[data-ai-demo]'),aiButtons=[...aiDemo.querySelectorAll('[data-ai-action]')];
 const ai={summary:['A useful summary for the team','The customer wants to understand the service options and has requested a callback on Tuesday. A team member should confirm a suitable time.'],reply:['A reply your employee can review','Thanks for your interest. We’d be happy to explain the service options. Would Tuesday morning or afternoon suit you for a callback?'],next:['A clear task to review','Assign the enquiry to the service team. Confirm the customer’s preferred callback time and add a reminder to the customer record.']};
 aiButtons.forEach(b=>b.addEventListener('click',()=>{activate(aiButtons,b);const [title,body]=ai[b.dataset.aiAction];aiDemo.querySelector('[data-ai-title]').textContent=title;aiDemo.querySelector('[data-ai-output]').textContent=body;const reviewed=aiDemo.querySelector('[data-ai-review-status]');reviewed.textContent='Ready for review';reviewed.classList.remove('reviewed');const panel=aiDemo.querySelector('.crm-ai-output');panel.classList.remove('just-updated');requestAnimationFrame(()=>panel.classList.add('just-updated'));}));
 aiDemo.querySelector('[data-ai-review]').addEventListener('click',()=>{const reviewed=aiDemo.querySelector('[data-ai-review-status]');reviewed.textContent='Reviewed in this example';reviewed.classList.add('reviewed');});
 const analytics=page.querySelector('[data-analytics-demo]'),reportButtons=[...analytics.querySelectorAll('[data-report]')];
 const reports={sources:{title:'Enquiries by source',subtitle:'A simple view of how example enquiries reached the team.',labels:['Website','WhatsApp','Referrals'],values:[12,8,5]},activity:{title:'Follow-up activity',subtitle:'See the example tasks that need a person’s attention.',labels:['Completed','In progress','Needs a reply'],values:[15,7,3]},pipeline:{title:'Opportunities by stage',subtitle:'Understand where the example customer journey stands.',labels:['New enquiry','Follow-up','Appointment'],values:[10,8,5]}};
 reportButtons.forEach(b=>b.addEventListener('click',()=>{activate(reportButtons,b);const data=reports[b.dataset.report],maximum=Math.max(...data.values);analytics.querySelector('[data-chart-title]').textContent=data.title;analytics.querySelector('[data-chart-subtitle]').textContent=data.subtitle;const rows=[...analytics.querySelectorAll('.crm-chart-row')];rows.forEach((row,i)=>{row.querySelector('span').textContent=data.labels[i];row.querySelector('b').textContent=data.values[i];row.querySelector('i').style.setProperty('--bar',`${data.values[i]/maximum*100}%`);});analytics.querySelector('[data-chart-summary]').textContent='Sample counts: '+data.labels.map((label,i)=>`${label} ${data.values[i]}`).join(', ')+'.';}));
})();

}
