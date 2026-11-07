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
  const navLinks=[...page.querySelectorAll('.crm-page-nav a[href^="#"]')];
  const navTargets=navLinks.map(link=>({link,target:document.querySelector(link.hash)})).filter(item=>item.target&&item.link.hash!=='#top');
  let navFrame=0;
  function updateNav(){navFrame=0;let current=navLinks[0];const cutoff=page.querySelector('.crm-page-nav').getBoundingClientRect().bottom+100;for(const item of navTargets)if(item.target.getBoundingClientRect().top<=cutoff)current=item.link;navLinks.forEach(link=>{const active=link===current;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',()=>{if(!navFrame)navFrame=requestAnimationFrame(updateNav);},{passive:true});
  addEventListener('resize',updateNav);updateNav();
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
