import {useEffect} from 'react';

// One observer covers both the initial HTML and sections mounted by lazy routes.
export function useViewportEffects(path){
 useEffect(()=>{
  const regions=new Set(),selector='main section,.review-tool-lane,.review-platforms,.sx-marquee,.pf-marquee';
  const observer=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('performance-sleep',!e.isIntersecting);},{rootMargin:'100px 0px'});
  const register=node=>{if(node.nodeType!==1)return;const add=el=>{if(!regions.has(el)){regions.add(el);observer.observe(el);}};if(node.matches(selector))add(node);node.querySelectorAll(selector).forEach(add);};
  register(document.body);
  const mutations=new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes)register(node);for(const node of record.removedNodes){if(node.nodeType!==1||node.isConnected)continue;for(const el of regions)if(el===node||node.contains(el)){observer.unobserve(el);regions.delete(el);}}}});
  mutations.observe(document.body,{childList:true,subtree:true});
  const visibility=()=>document.documentElement.classList.toggle('performance-hidden',document.hidden);
  document.addEventListener('visibilitychange',visibility);visibility();
  return()=>{observer.disconnect();mutations.disconnect();document.removeEventListener('visibilitychange',visibility);document.documentElement.classList.remove('performance-hidden');regions.forEach(el=>el.classList.remove('performance-sleep'));};
 },[path]);
}
