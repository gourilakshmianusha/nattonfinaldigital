import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePublic,isPublicAddress,robotsAllows,inspectHtml,seoAudit,websiteGrader} from '../../server/growth/audits.mjs';
const publicLookup=async()=>[{address:'93.184.216.34',family:4}];
test('oversized optional sitemap preserves valid main-page findings',async()=>{
 const fetcher=async url=>{if(url.endsWith('/robots.txt'))return {url,status:404,headers:{},text:''};if(url.endsWith('/sitemap.xml'))throw Object.assign(new Error('Too large'),{code:'response_too_large'});return {url,status:200,headers:{'content-type':'text/html'},text:'<title>Observed page</title><h1>Observed page</h1>'};};
 const result=await seoAudit({url:'https://example.com',crawlLimit:1},fetcher);assert.equal(result.pages.length,1);assert.equal(result.sitemap.xmlObserved,null);assert.equal(result.sitemap.unavailable,true);assert.ok(result.warnings.some(w=>w.includes('optional sitemap')));
});
test('SSRF rejects local, private, mapped, reserved, credentialled and unsafe-protocol URLs',async()=>{
 for(const address of ['127.0.0.1','10.1.2.3','169.254.169.254','172.16.0.1','192.168.1.1','0.0.0.0','::1','fc00::1','fe80::1','::ffff:127.0.0.1','2001:db8::1'])assert.equal(isPublicAddress(address),false,address);
 for(const url of ['http://127.0.0.1','http://2130706433','http://0177.0.0.1','http://[::1]','http://localhost','http://x.local','file:///etc/passwd','https://user:password@example.com','https://example.com:8080','https://example.com/?api_key=secret'])await assert.rejects(resolvePublic(url,publicLookup),undefined,url);
 await assert.rejects(resolvePublic('https://example.com',async()=>[{address:'93.184.216.34',family:4},{address:'127.0.0.1',family:4}]));
 const allowed=await resolvePublic('https://example.com/a#fragment',publicLookup);assert.equal(allowed.url.toString(),'https://example.com/a');
});
test('robots honours explicit agent groups, longest matches, allow ties and wildcard endings',()=>{
 const rules='User-agent: *\nDisallow: /private/\nAllow: /private/public\nDisallow: /*.pdf$\n';assert.equal(robotsAllows(rules,'/private/no'),false);assert.equal(robotsAllows(rules,'/private/public/file'),true);assert.equal(robotsAllows(rules,'/report.pdf'),false);assert.equal(robotsAllows(rules,'/report.pdf?view=1'),true);assert.equal(robotsAllows('User-agent: *\nDisallow: /\nUser-agent: NattonGrowthAudit\nAllow: /','/page'),true);
});
test('HTML findings carry actual evidence and do not claim ranking observations',()=>{
 const result=inspectHtml({url:'https://example.com',status:200,headers:{},text:'<html><head><title>Actual title</title><script type="application/ld+json">{bad}</script></head><body><h1>Title</h1><h2>How does it work?</h2><img src="a.jpg"><a href="/about">About</a></body></html>'});
 assert.equal(result.title,'Actual title');assert.equal(result.missingAlt,1);assert.equal(result.malformedSchema,1);assert.ok(result.findings.some(f=>f.rule==='description'&&f.observed===''));assert.ok(result.findings.every(f=>f.url==='https://example.com'));assert.equal(result.internalLinks[0],'https://example.com/about');assert.equal('rank'in result,false);
});
test('crawler checks robots for each requested path and reports failed sitemap honestly',async()=>{
 const calls=[];const fetcher=async(url,options={})=>{calls.push(url);if(options.beforeRequest)await options.beforeRequest(new URL(url));if(url.endsWith('/robots.txt'))return{url,status:200,headers:{'content-type':'text/plain'},text:'User-agent: *\nAllow: /'};if(url.endsWith('/sitemap.xml'))return{url,status:404,headers:{'content-type':'text/html'},text:'Not found'};return{url,status:200,headers:{'content-type':'text/html'},text:'<title>Test</title><h1>Test page</h1><h2>What is this?</h2><a href="/second">Second</a>'};};
 const result=await seoAudit({url:'https://example.com',crawlLimit:2},fetcher);assert.equal(result.pages.length,2);assert.equal(result.sitemap.status,404);assert.equal(result.sitemap.xmlObserved,false);assert.equal(result.dataSources.length,2);assert.ok(calls.includes('https://example.com/robots.txt'));assert.ok(result.warnings.some(w=>w.includes('not measured')));
 const denied=async(url,options={})=>{if(url.endsWith('/robots.txt'))return{url,status:200,headers:{},text:'User-agent: *\nDisallow: /'};if(options.beforeRequest)await options.beforeRequest(new URL(url));throw new Error('Crawler should not reach a blocked page');};const blocked=await seoAudit({url:'https://example.com',crawlLimit:1},denied);assert.equal(blocked.scores.aeo.value,null);assert.equal(blocked.coverage.blocked,1);assert.match(blocked.coverage.urlRecords[0].evidence,/robots.txt does not permit/);
});
test('missing PageSpeed key never produces a fallback score or external request',async()=>{const old=process.env.GOOGLE_PSI_KEY;delete process.env.GOOGLE_PSI_KEY;let called=false;try{await assert.rejects(websiteGrader({url:'https://1.1.1.1',device:'mobile',language:'en'},async()=>{called=true;}),/GOOGLE_PSI_KEY/);assert.equal(called,false);}finally{if(old!==undefined)process.env.GOOGLE_PSI_KEY=old;}});
test('automatic audit follows deeper links and sitemap-only pages, without a user page limit',async()=>{
 const fetcher=async(url,options={})=>{if(url.endsWith('/robots.txt'))return{url,status:200,headers:{},text:'User-agent: *\nAllow: /'};if(options.beforeRequest)await options.beforeRequest(new URL(url));if(url.endsWith('/sitemap.xml'))return{url,status:200,headers:{},text:'<urlset><url><loc>https://example.com/unlinked</loc></url></urlset>'};const path=new URL(url).pathname;return{url,status:200,headers:{'content-type':'text/html'},text:'<title>Page</title><h1>Page</h1>'+({'/':'<a href="/about">About</a>','/about':'<a href="/team">Team</a>','/team':'<a href="https://elsewhere.com/">External</a>'}[path]||'')};};
 const result=await seoAudit({url:'https://example.com/'},fetcher);assert.equal(result.pages.length,4);assert.equal(result.coverage.complete,true);assert.ok(result.pages.some(p=>p.url.endsWith('/team')));assert.ok(result.pages.some(p=>p.url.endsWith('/unlinked')));assert.ok(result.pages.every(p=>new URL(p.url).origin==='https://example.com'));
});
test('automatic audit preserves good pages and reports unavailable pages as partial coverage',async()=>{
 const fetcher=async(url,options={})=>{if(url.endsWith('/robots.txt'))return{url,status:404,headers:{},text:''};if(options.beforeRequest)await options.beforeRequest(new URL(url));if(url.endsWith('/sitemap.xml'))return{url,status:404,headers:{},text:''};if(url.endsWith('/broken'))throw new Error('Unavailable');return{url,status:200,headers:{'content-type':'text/html'},text:'<h1>Page</h1><a href="/broken">Broken</a>'};};
 const result=await seoAudit({url:'https://example.com/'},fetcher);assert.equal(result.pages.length,1);assert.equal(result.coverage.complete,false);assert.equal(result.coverage.failed,1);assert.ok(result.warnings.some(w=>w.toLowerCase().includes('partial audit')));
});
test('configured Website Grader returns real provider metrics and caches successful results',async()=>{
 const old=process.env.GOOGLE_PSI_KEY;process.env.GOOGLE_PSI_KEY='synthetic-test-key';let calls=0;
 try{const fetcher=async()=>{calls++;return new Response(JSON.stringify({lighthouseResult:{categories:{performance:{title:'Performance',score:.81}},audits:{},fetchTime:'2026-11-03T00:00:00Z',finalUrl:'https://1.1.1.1/',requestedUrl:'https://1.1.1.1/'}}),{status:200});};
 const inputs={url:'https://1.1.1.1/',device:'desktop',language:'en'};const result=await websiteGrader(inputs,fetcher);assert.equal(result.metrics[0].value,81);assert.equal((await websiteGrader(inputs,fetcher)).cached,true);assert.equal(calls,1);
 }finally{if(old===undefined)delete process.env.GOOGLE_PSI_KEY;else process.env.GOOGLE_PSI_KEY=old;}
});
