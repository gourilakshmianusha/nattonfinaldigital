import {load} from 'cheerio';
export function needsRendering(html){const $=load(html);return $('script').toArray().some(el=>{const type=String($(el).attr('type')||'').toLowerCase().trim();return !type||type==='module'||/^(?:text|application)\/(?:x-)?(?:java|ecma)script$/.test(type);});}
function sufficientContent(html){const $=load(html);$('script,style,noscript,template').remove();return $('body').text().trim().length>=40;}

/** All browser requests are fulfilled by the existing DNS-pinned HTTP client.
 * No browser-controlled request reaches the network directly. */
export async function renderPage(response,{fetcher,beforeRequest,timeout=10000}={}){
 let browser;
 try{
  const {chromium}=await import('playwright');
  browser=await chromium.launch({headless:true,timeout,args:['--disable-quic','--dns-prefetch-disable','--force-webrtc-ip-handling-policy=disable_non_proxied_udp']});
  const timer=setTimeout(()=>void browser.close(),timeout);timer.unref?.();
  try{
   const context=await browser.newContext({serviceWorkers:'block',acceptDownloads:false,userAgent:'NattonGrowthAudit/2.0'});
   await context.addInitScript(()=>{Object.defineProperty(globalThis,'RTCPeerConnection',{value:undefined,configurable:false});Object.defineProperty(globalThis,'webkitRTCPeerConnection',{value:undefined,configurable:false});});
   await context.routeWebSocket('**/*',route=>route.close());
   let requests=0;const failures=[];
   await context.route('**/*',async route=>{
    const request=route.request();
    if(++requests>60||!['GET','HEAD'].includes(request.method())||['image','media','font'].includes(request.resourceType())){failures.push({url:request.url(),resourceType:request.resourceType(),status:'skipped',reason:requests>60?'request_budget':!['GET','HEAD'].includes(request.method())?'unsafe_method':'non_document_asset'});return route.abort();}
    try{
     if(['xhr','fetch','document'].includes(request.resourceType())&&new URL(request.url()).origin!==new URL(response.url).origin)throw new Error('Cross-origin document/data request blocked');
     const result=request.url()===response.url?response:await fetcher(request.url(),{timeout:4000,maxBytes:2*1024*1024,beforeRequest});
     if(result.status<200||result.status>=300)throw new Error('Resource HTTP '+result.status);
     await route.fulfill({status:result.status,headers:Object.fromEntries(Object.entries(result.headers).filter(([name])=>['content-type','content-security-policy','x-content-type-options','cross-origin-resource-policy','cross-origin-embedder-policy','cross-origin-opener-policy','access-control-allow-origin','access-control-allow-credentials','referrer-policy','permissions-policy'].includes(name)).map(([name,value])=>[name,String(value)])),body:result.text});
    }catch(error){failures.push({url:request.url(),resourceType:request.resourceType(),status:'failed',reason:error.code||error.message});await route.abort().catch(()=>{});}
   });
   const page=await context.newPage(),scriptErrors=[];page.on('pageerror',error=>scriptErrors.push(error.message));
   await page.goto(response.url,{waitUntil:'domcontentloaded',timeout});
   const networkIdleReached=await page.waitForLoadState('networkidle',{timeout:Math.min(timeout,4000)}).then(()=>true).catch(()=>false);
   const text=await page.content();const critical=failures.filter(f=>f.status==='failed'&&(f.resourceType==='script'||['document','xhr','fetch'].includes(f.resourceType)&&new URL(f.url).origin===new URL(response.url).origin));const required=!sufficientContent(text)||scriptErrors.length>0||critical.length>0||!networkIdleReached;
   return{...response,text,rendering:{needed:true,status:required?'failed':'rendered',engine:'Playwright Chromium',reason:required?(scriptErrors.length?'JavaScript execution errors prevent a reliable rendered snapshot.':critical.length?'Required script/data resources failed.':!networkIdleReached?'Page did not reach bounded network-idle before the snapshot.':'No sufficient rendered content was observed.'):null,renderedAt:new Date().toISOString(),networkIdleReached,scriptErrors,failedResources:failures,requests}};
  }finally{clearTimeout(timer);}
 }catch(error){return{...response,rendering:{needed:true,status:'unavailable',reason:'Headless rendering failed or Chromium is unavailable: '+String(error.message).split('\n')[0]}};}
 finally{await browser?.close().catch(()=>{});}
}
