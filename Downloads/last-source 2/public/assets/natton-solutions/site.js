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
  const status=document.querySelector('[data-filter-status]');if(status)status.textContent=`Showing ${shown} ${shown===1?'solution':'solutions'}`;
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
