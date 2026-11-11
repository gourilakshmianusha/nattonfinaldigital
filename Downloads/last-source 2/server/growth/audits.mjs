import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import {createGunzip,createInflate,createBrotliDecompress} from 'node:zlib';
import ipaddr from 'ipaddr.js';
import {load} from 'cheerio';
import {createHash} from 'node:crypto';
import {pageEvidence,AUDIT_VERSION,methodology} from './seo/evidence.mjs';
import {needsRendering,renderPage} from './seo/render.mjs';
import {measureSearchVisibility} from './seo/search-console.mjs';
import {ApiError} from '../admin/security.mjs';
const error=(status,message,code='audit_failed')=>{throw new ApiError(status,message,code);};
export function isPublicAddress(address){try{return ipaddr.process(address).range()==='unicast';}catch{return false;}}
export async function resolvePublic(raw,lookup=dns.lookup){let url;try{url=new URL(raw);}catch{error(400,'Enter a valid public website URL.','unsafe_url');}const host=url.hostname.replace(/^\[|\]$/g,'').replace(/\.$/,'');
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||(url.port&&!['80','443'].includes(url.port))||/^(localhost|0|metadata\.google\.internal)$/i.test(host)||/\.(localhost|local|internal|lan|home|test|invalid)$/i.test(host)||[...url.searchParams.keys()].some(k=>/password|secret|token|api.?key|authorization/i.test(k)))error(400,'Use a public HTTP(S) website without credentials, secret query parameters, or custom ports.','unsafe_url');
 let addresses;try{addresses=ipaddr.isValid(host)?[{address:host,family:ipaddr.parse(host).kind()==='ipv6'?6:4}]:await lookup(host,{all:true,verbatim:true});}catch{error(400,'The website hostname could not be resolved.','unsafe_url');}
 if(!addresses.length||addresses.some(a=>!isPublicAddress(a.address)))error(400,'Private, reserved, local, and mixed public/private network targets are not permitted.','unsafe_url');
 url.hash='';return{url,addresses};
}
export async function fetchPublic(raw,{maxBytes=4*1024*1024,timeout=15000,maxRedirects=3,beforeRequest,lookup=dns.lookup}={}){
 const redirectChain=[];let next=raw;for(let redirect=0;redirect<=maxRedirects;redirect++){
  let resolved;try{resolved=await resolvePublic(next,lookup);}catch(e){e.redirectChain=redirectChain;throw e;}const {url,addresses}=resolved;if(beforeRequest){try{await beforeRequest(url);}catch(e){e.redirectChain=redirectChain;throw e;}}
  const response=await new Promise((resolve,reject)=>{
   const pinned=addresses[0],transport=url.protocol==='https:'?https:http;
   const request=transport.request(url,{method:'GET',agent:false,headers:{'User-Agent':'NattonGrowthAudit/1.0','Accept':'text/html,application/xhtml+xml,text/plain,application/xml;q=0.9','Accept-Encoding':'identity'},lookup:(_host,options,callback)=>options?.all?callback(null,[pinned]):callback(null,pinned.address,pinned.family)},res=>{
    let size=0,wireSize=0,failed=false;const chunks=[];
    const encoding=String(res.headers['content-encoding']||'').toLowerCase();
    const decoder=encoding==='gzip'?createGunzip():encoding==='deflate'?createInflate():encoding==='br'?createBrotliDecompress():null;
    const stream=decoder?res.pipe(decoder):res;
    const abort=message=>{if(failed)return;failed=true;reject(new ApiError(413,message,'response_too_large'));res.destroy();decoder?.destroy();request.destroy();};
    res.on('data',chunk=>{wireSize+=chunk.length;if(wireSize>Math.max(maxBytes,1024*1024))abort('The website response exceeds the safe download limit. Try a smaller page.');});
    stream.on('data',chunk=>{if(failed)return;size+=chunk.length;if(size>maxBytes){abort(`This response is larger than the ${Math.round(maxBytes/1024)} KB audit limit. Try auditing a smaller page.`);return;}chunks.push(chunk);});
    stream.on('end',()=>{if(!failed)resolve({status:res.statusCode,headers:res.headers,text:Buffer.concat(chunks).toString('utf8'),url:url.toString(),bytes:size});});
    stream.on('error',()=>{if(!failed){failed=true;reject(new ApiError(502,'The website returned an unreadable compressed response.','website_encoding_error'));}});res.on('error',()=>{if(!failed){failed=true;reject(new ApiError(502,'The website connection ended before the response was complete.','website_unavailable'));}});
   });const timer=setTimeout(()=>request.destroy(new ApiError(504,'The website audit timed out.','audit_timeout')),timeout);request.on('close',()=>clearTimeout(timer));request.on('error',e=>reject(e instanceof ApiError?e:new ApiError(502,'The public website could not be fetched securely.','website_unavailable')));request.end();
  }).catch(e=>{e.redirectChain=redirectChain;throw e;});
  if([301,302,303,307,308].includes(response.status)){if(redirect===maxRedirects||!response.headers.location){const e=new ApiError(400,'The website redirected too many times or returned an invalid redirect.','unsafe_redirect');e.redirectChain=[...redirectChain,{url:url.href,status:response.status,location:response.headers.location||null}];throw e;}const target=new URL(response.headers.location,url).toString();redirectChain.push({url:url.toString(),status:response.status,location:response.headers.location,target});next=target;continue;}return {...response,requestedUrl:raw,redirectChain,fetchedAt:new Date().toISOString()};
 }
}
export function robotsAllows(text,target,agent='nattongrowthaudit'){
 const groups=[];let group=null,rulesStarted=false;for(const raw of text.split(/\r?\n/)){const line=raw.split('#')[0].trim();const match=line.match(/^([^:]+):\s*(.*)$/);if(!match)continue;const key=match[1].toLowerCase(),value=match[2].trim();if(key==='user-agent'){if(!group||rulesStarted){group={agents:[],rules:[]};groups.push(group);rulesStarted=false;}group.agents.push(value.toLowerCase());}else if(group&&['allow','disallow'].includes(key)){rulesStarted=true;if(value)group.rules.push({allow:key==='allow',path:value});}}
 const named=groups.filter(g=>g.agents.some(a=>a!=='*'&&agent.includes(a))),chosen=named.length?named:groups.filter(g=>g.agents.includes('*'));let best=null;
 for(const rule of chosen.flatMap(g=>g.rules)){const pattern=rule.path.split('*').map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$');if(new RegExp('^'+pattern).test(target)){const specificity=rule.path.replace(/\*/g,'').length;if(!best||specificity>best.specificity||(specificity===best.specificity&&rule.allow))best={...rule,specificity};}}
 return !best||best.allow;
}
export const inspectHtml=pageEvidence;
export async function seoAudit(inputs,fetcher=fetchPublic,options={}){
 const started=Date.now(),deadline=started+(options.timeBudgetMs||35000),observedAt=new Date().toISOString();
 let measurements;
 const measure = () => measurements ||= Promise.all([
  Promise.resolve().then(() => (options.measureLighthouse || ((url) => fetcher === fetchPublic ? measureSeoLighthouse(url) : Promise.resolve({status:'unavailable',value:null,reason:'Live provider not invoked by fixture fetcher.'})))(inputs.url)).catch(e => ({status:'failed',value:null,reason:e.message,source:methodology.sources.psi})),
  Promise.resolve().then(() => (options.measureVisibility || measureSearchVisibility)(inputs.url,options.gscToken)).catch(e => ({searchConsole:{status:'failed',reason:e.message},ai:{status:'not_measured',reason:'No AI citation monitoring is connected.'}}))
 ]);
 const pages=[],urlRecords=[],resources=[],robotsCache=new Map(),sitemapSeen=new Set(),sitemapQueue=[],queue=[inputs.url],seen=new Set([inputs.url]),discovered=new Set([inputs.url]);
 const pageLimit=inputs.crawlLimit||100;let origin=null,truncated=false;
 const remaining=()=>Math.max(1,Math.min(6000,deadline-Date.now()));
 const recordError=(url,e,kind='page')=>({url,kind,status:/robots|offsite/.test(e.code||'')?'blocked':'failed',httpStatus:null,apiErrorStatus:e.status||null,reason:e.code||'fetch_failed',evidence:e.message,redirectChain:e.redirectChain||[],observedAt:new Date().toISOString()});
 const robotsFor=async url=>{
  if(Date.now()>=deadline)error(504,'Crawl time budget reached.','audit_timeout');
  if(!robotsCache.has(url.origin))robotsCache.set(url.origin,(async()=>{try{const r=await fetcher(new URL('/robots.txt',url).href,{maxBytes:512*1024,timeout:remaining()});resources.push({kind:'robots',url:r.url,httpStatus:r.status,status:r.status===404?'absent':r.status===200?'inspected':'failed',text:r.status===200?r.text:null,redirectChain:r.redirectChain||[]});return r;}catch(e){resources.push(recordError(new URL('/robots.txt',url).href,e,'robots'));throw e;}})());
  const r=await robotsCache.get(url.origin);
  if(r.status>=500||r.status===429)error(503,'robots.txt is unavailable; crawling is paused.','robots_unavailable');
  if([401,403].includes(r.status)||r.status===200&&!robotsAllows(r.text,url.pathname+url.search))error(403,'The website robots.txt does not permit this audit path.','robots_disallowed');
 };
 const sameSite=async url=>{if(origin&&url.origin!==origin)error(403,'Redirect leaves the audited website.','offsite_redirect');await robotsFor(url);};
 const enqueue=raw=>{let url;try{url=new URL(raw,pages[0]?.url||inputs.url);url.hash='';}catch{return;}if(url.origin!==origin||!/^https?:$/.test(url.protocol)||url.username||url.password)return;
  if(discovered.has(url.href))return;if(discovered.size>=1000){truncated=true;urlRecords.push({url:url.href,status:'skipped',reason:'discovery_limit'});return;}discovered.add(url.href);
  if(/\.(?:pdf|jpe?g|png|gif|webp|svg|mp[34]|zip|css|js|xml|woff2?)$/i.test(url.pathname)){urlRecords.push({url:url.href,status:'skipped',reason:'non_html_resource'});return;}queue.push(url.href);
 };
 while(((queue.length&&pages.length<pageLimit)||sitemapQueue.length)&&Date.now()<deadline){
  if(queue.length&&pages.length<pageLimit&&(!pages.length||!sitemapQueue.length)){const requested=queue.shift();if(seen.has('visited:'+requested))continue;seen.add('visited:'+requested);
   try{
    let response=await fetcher(requested,{beforeRequest:origin?sameSite:robotsFor,timeout:remaining()});
    // Start independent provider checks after the URL passed public-network safety checks.
    // They run alongside crawling rather than adding up to 47 seconds afterward.
    if(!measurements) measure();
    if(!origin){origin=new URL(response.url).origin;sitemapQueue.push(new URL('/sitemap.xml',origin).href);for(const [site,promise]of robotsCache){const r=await promise;for(const line of String(r.text).split(/\r?\n/))if(/^\s*sitemap:/i.test(line))sitemapQueue.push(line.replace(/^\s*sitemap:\s*/i,''));}}
    if(!/text\/html|application\/xhtml\+xml/i.test(String(response.headers['content-type']||''))){urlRecords.push({url:requested,finalUrl:response.url,httpStatus:response.status,status:'skipped',reason:'non_html',redirectChain:response.redirectChain||[]});continue;}
    const rawHash=createHash('sha256').update(response.text).digest('hex');
    if(needsRendering(response.text))response=await (options.render||renderPage)(response,{fetcher,beforeRequest:robotsFor,timeout:Math.min(10000,remaining())});
    const page=pageEvidence({...response,requestedUrl:requested,rawContentHash:rawHash},inputs.phrase);
    for(const failed of page.rendering.failedResources||[])resources.push({...failed,kind:'render_resource'});
    urlRecords.push({url:requested,finalUrl:response.url,httpStatus:response.status,status:response.status>=200&&response.status<300?'inspected':'failed',reason:response.status>=400?'http_error':null,redirectChain:response.redirectChain||[],contentHash:page.contentHash,rendering:page.rendering});
    if(!pages.some(p=>p.url===page.url))pages.push(page);
    discovered.add(page.url);page.internalLinks.forEach(enqueue);
   }catch(e){if(e.code==='unsafe_url'||e.code==='unsafe_redirect')throw e;urlRecords.push(recordError(requested,e));}
  }else{
   const url=sitemapQueue.shift();if(sitemapSeen.has(url))continue;if(sitemapSeen.size>=5){resources.push({url,kind:'sitemap',status:'skipped',reason:'sitemap_limit'});truncated=true;continue;}sitemapSeen.add(url);
   try{if(new URL(url).origin!==origin){resources.push({url,kind:'sitemap',status:'skipped',reason:'outside_scope'});continue;}
    const r=await fetcher(url,{maxBytes:512*1024,beforeRequest:sameSite,timeout:remaining()});const xml=load(r.text,{xmlMode:true}),valid=r.status===200&&xml('urlset,sitemapindex').length>0;
    resources.push({url,kind:'sitemap',httpStatus:r.status,status:r.status===404?'absent':valid?'inspected':'failed',xmlObserved:valid,redirectChain:r.redirectChain||[]});
    if(valid){const locations=xml('loc').map((_,el)=>xml(el).text().trim()).get();if(xml('sitemapindex').length)sitemapQueue.push(...locations);else locations.forEach(enqueue);}
   }catch(e){resources.push(recordError(url,e,'sitemap'));}
  }
 }
 const pending=[...new Set(queue)];urlRecords.push(...pending.map(url=>({url,status:'skipped',reason:Date.now()>=deadline?'time_limit':'page_limit'})));resources.push(...sitemapQueue.map(url=>({url,kind:'sitemap',status:'skipped',reason:'crawl_limit'})));
 const incomplete=urlRecords.some(r=>r.status!=='inspected')||resources.some(r=>r.reason!=='non_document_asset'&&['failed','skipped','blocked'].includes(r.status))||pages.some(p=>p.rendering.needed&&p.rendering.status!=='rendered')||truncated;
 const coverage={mode:'automatic_same_site',complete:!incomplete&&pages.length>0,scope:'Submitted URL and discovered same-origin public HTML pages; not unlinked or authenticated pages.',inspected:pages.length,discovered:discovered.size,skipped:urlRecords.filter(r=>r.status==='skipped').length,failed:urlRecords.filter(r=>r.status==='failed').length,blocked:urlRecords.filter(r=>r.status==='blocked').length,remaining:pending.length,remainingUrls:pending,skippedPages:urlRecords.filter(r=>r.status!=='inspected'),urlRecords,resources,pageLimit,timeBudgetSeconds:(deadline-started)/1000,discoveryTruncated:truncated};
 const aggregate=key=>{const valid=pages.length>0&&pages.every(p=>p.scores[key].value!==null)&&urlRecords.some(r=>r.url===inputs.url&&r.status==='inspected');return{value:valid?Math.round(pages.reduce((sum,p)=>sum+p.scores[key].value,0)/pages.length*100)/100:null,status:valid?'calculated':'unavailable',reason:valid?null:'Unable to calculate: submitted page or inspected-page evidence is insufficient. See URL records and page checks.',scope:'Inspected HTML pages only',version:AUDIT_VERSION};};
 const technical=aggregate('technical'),aeo=aggregate('aeo');
 const [lighthouse,visibility]=measurements ? await measurements : [
  {status:'unavailable',value:null,reason:'No public page was fetched; provider checks were not started.',source:methodology.sources.psi},
  {searchConsole:{status:'not_measured',reason:'No public page was fetched.'},ai:{status:'not_measured',reason:'No AI citation monitoring is connected.'}}
 ];
 const scores={technical,aeo,lighthouse};
 return{auditVersion:AUDIT_VERSION,requestedUrl:inputs.url,finalUrl:pages[0]?.url||null,observedAt,methodologyUrl:'/api/tools/seo-aeo/methodology',scores,metrics:[{label:'Technical SEO score (inspected pages)',...technical,unit:'score'},{label:'Custom AEO Readiness Score',...aeo,unit:'score'},{label:'Google Lighthouse SEO (submitted URL)',value:lighthouse.value??null,status:lighthouse.status,reason:lighthouse.reason||null,unit:'score',source:methodology.sources.psi},{label:'Pages inspected',value:pages.length,unit:'number',status:'measured'},{label:'Pages discovered',value:discovered.size,unit:'number',status:'measured'}],coverage,pages,findings:pages.flatMap(p=>p.findings),robots:resources.filter(r=>r.kind==='robots'),sitemaps:resources.filter(r=>r.kind==='sitemap'),sitemap:(()=>{const s=resources.find(r=>r.kind==='sitemap');return{url:s?.url||new URL('/sitemap.xml',inputs.url).href,status:s?.httpStatus??null,xmlObserved:s?.status==='failed'?null:s?.xmlObserved??false,unavailable:s?.status==='failed',reason:s?.reason};})(),visibility,methodology:[methodology.formula,methodology.aeoDisclaimer,methodology.reproducibility,'Technical SEO and Custom AEO scores are calculated; Lighthouse is a separate Google measurement for the submitted URL. '+methodology.validationScope],warnings:[...(!coverage.complete?['Partial audit: inspect URL records, rendering failures and crawl limits.']:[]),...resources.filter(r=>r.kind==='sitemap'&&r.status==='failed').map(r=>'The optional sitemap could not be fully inspected: '+r.url),...(!pages.length?['Unable to calculate: no readable pages inspected.']:[]),'AI engine mentions and citations were not measured. No rankings are inferred.'],recommendations:[...new Set(pages.flatMap(p=>p.findings.map(f=>f.recommendation)))].slice(0,20),dataSources:pages.map(p=>p.url)};
}
export async function measureSeoLighthouse(url,fetcher=fetch){
 if(!process.env.GOOGLE_PSI_KEY)return{value:null,status:'unavailable',reason:'GOOGLE_PSI_KEY is not configured.',source:methodology.sources.psi};
 const endpoint=new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');endpoint.searchParams.set('url',url);endpoint.searchParams.set('key',process.env.GOOGLE_PSI_KEY);endpoint.searchParams.set('category','seo');endpoint.searchParams.set('strategy','mobile');
 const response=await fetcher(endpoint,{signal:AbortSignal.timeout(25000),redirect:'error'});if(!response.ok)return{value:null,status:'failed',reason:'PageSpeed Insights HTTP '+response.status,source:methodology.sources.psi};
 const data=await response.json(),l=data.lighthouseResult,score=l?.categories?.seo?.score;
 if(l?.runtimeError||typeof score!=='number'||!Number.isFinite(score)||score<0||score>1)return{value:null,status:'failed',reason:l?.runtimeError?.message||'Google returned no valid Lighthouse SEO score.',source:methodology.sources.psi};
 return{value:score*100,status:'measured',strategy:'mobile',source:methodology.sources.psi,requestedUrl:l.requestedUrl,finalUrl:l.finalUrl,observedAt:l.fetchTime,lighthouseVersion:l.lighthouseVersion,audits:(l.categories.seo.auditRefs||[]).map(ref=>({id:ref.id,weight:ref.weight,...l.audits?.[ref.id]})),comparisonUrl:'https://pagespeed.web.dev/analysis?url='+encodeURIComponent(url)};
}

const psiCache=new Map();
export async function websiteGrader(inputs,fetcher=fetch){
 await resolvePublic(inputs.url);if(!process.env.GOOGLE_PSI_KEY)error(503,'Website Grader needs GOOGLE_PSI_KEY configured securely on the server. No sample score is substituted.','provider_not_configured');
 const cacheKey=JSON.stringify([inputs.url,inputs.device,inputs.language]);const cached=psiCache.get(cacheKey);if(cached&&cached.expires>Date.now())return{...cached.result,cached:true};
 const url=new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');url.searchParams.set('url',inputs.url);url.searchParams.set('strategy',inputs.device);url.searchParams.set('locale',inputs.language);url.searchParams.set('key',process.env.GOOGLE_PSI_KEY);for(const category of ['performance','accessibility','best-practices','seo'])url.searchParams.append('category',category);
 let response;try{response=await fetcher(url,{signal:AbortSignal.timeout(45000),redirect:'error'});}catch{error(504,'Google PageSpeed Insights timed out or could not be reached.','provider_timeout');}if(!response.ok)error(response.status===429?429:502,`Google PageSpeed Insights returned HTTP ${response.status}. Check authorised key access and quota.`,'provider_request_failed');
 const text=await response.text();if(text.length>8000000)error(502,'PageSpeed response exceeded the processing limit.','provider_format');let data;try{data=JSON.parse(text);}catch{error(502,'PageSpeed returned invalid JSON.','provider_format');}const l=data.lighthouseResult;if(!l?.categories||l.runtimeError)error(502,'Google could not produce a valid Lighthouse result for that page.','provider_format');
 await resolvePublic(l.finalUrl||inputs.url);
 const metrics=Object.entries(l.categories).map(([id,c])=>({label:c.title||id,value:typeof c.score==='number'?c.score*100:null,unit:'score'}));
 const labIds=['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive'];const labMetrics=labIds.filter(id=>l.audits?.[id]).map(id=>({id,label:l.audits[id].title,value:l.audits[id].numericValue,unit:l.audits[id].numericUnit,display:l.audits[id].displayValue}));const findings=Object.values(l.audits||{}).filter(a=>typeof a.score==='number'&&a.score<0.9&&['binary','numeric'].includes(a.scoreDisplayMode)).slice(0,20).map(a=>({id:a.id,severity:a.score<0.5?'high':'medium',issue:a.title,evidence:a.displayValue||`Lighthouse audit score ${a.score}`,recommendation:a.description,url:l.finalUrl}));
 let crux={state:'not_configured',message:'CrUX real-user data is not configured.'};if(process.env.GOOGLE_CRUX_KEY){try{const response=await fetcher('https://chromeuxreport.googleapis.com/v1/records:queryRecord?key='+encodeURIComponent(process.env.GOOGLE_CRUX_KEY),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:inputs.url,formFactor:inputs.device==='mobile'?'PHONE':'DESKTOP'}),signal:AbortSignal.timeout(12000),redirect:'error'});crux=response.ok?{state:'observed',record:(await response.json()).record}:response.status===404?{state:'insufficient_data',message:'CrUX has insufficient field data for this page.'}:{state:'error',message:`CrUX returned HTTP ${response.status}.`};}catch{crux={state:'error',message:'CrUX could not be reached.'};}}
 const result={metrics,labMetrics,findings,crux,observedAt:l.fetchTime,requestedUrl:l.requestedUrl,finalUrl:l.finalUrl,lighthouseVersion:l.lighthouseVersion,methodology:['Google PageSpeed Insights v5, with the four requested Lighthouse categories; category score × 100.','Lighthouse values are laboratory measurements for one page and device, not a site-wide audit or real-user guarantee. CrUX field observations are reported separately when available.'],recommendations:findings.slice(0,8).map(f=>f.issue),warnings:l.runWarnings||[],dataSources:['https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed','Google PageSpeed Insights response'],cached:false};if(psiCache.size>=100)psiCache.delete(psiCache.keys().next().value);psiCache.set(cacheKey,{expires:Date.now()+300000,result});return result;
}
