import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('HOMEPAGE-HERO-PRESERVATION.json'));
const sha=path=>crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
for(const[path,hash]of Object.entries(manifest.sourceFiles)){const file='src/homepage/original/'+path;if(path==='components/HeroSection.tsx'){const content=fs.readFileSync(file,'utf8');assert.ok(content.includes('href="/contact/"'),'Homepage CTA resolves without JavaScript');const original=content.replace('href="/contact/"','href="/contact"');assert.equal(crypto.createHash('sha256').update(original).digest('hex'),hash,'Hero changed beyond the contact href');}else if(['components/heroJourney/HeroCinema.jsx','components/heroJourney/Scene.jsx'].includes(path)){assert.ok(fs.readFileSync(file,'utf8').includes('invalidate'),'Optimized hero renderer must wake on changes');}else assert.equal(sha(file),hash,'Hero source changed: '+path);}
for(const[path,hash]of Object.entries(manifest.assetFiles))assert.equal(sha('public/'+path),hash,'Hero asset changed: '+path);
const html=fs.readFileSync('dist/index.html','utf8');
assert.equal((html.match(/<h1[ >]/g)||[]).length,1,'Homepage H1');
assert.equal((html.match(/class="nh-outcome-lane /g)||[]).length,2,'Stacked outcome marquees');
assert.ok(!html.includes('nh-ribbon-art'),'Old ribbons removed');
assert.ok(html.indexOf('id="our-process"')<html.indexOf('id="working-toward"')&&html.indexOf('id="working-toward"')<html.indexOf('id="industries"'),'Marquee follows process and precedes industries');
const data=JSON.parse(fs.readFileSync('src/homepage/home-data.json'));const names=['marketing','automation','bundles'];
for(const [i,key]of ['services','products','solutions'].entries()){const block=html.split('nh-way-'+names[i])[1].split('</article>')[0];for(const item of data[key])assert.ok(block.includes('href="'+item.path+'"'),'Missing homepage offering '+item.name);}
const tools=html.split('id="tools-and-software"')[1].split('</section>')[0];assert.ok(!tools.includes('<a '),'Tools have no links');assert.equal((tools.match(/<li>/g)||[]).length,44,'22 tools in seamless marquee copies');assert.equal((tools.match(/class="review-tool-lane"/g)||[]).length,2,'Service and solution tool lanes');assert.ok(html.includes('href="https://natchat.natton.ai"')&&html.includes('href="https://nativox.natton.ai"'),'In-house platforms linked');assert.ok(!html.includes('nh-motion-button'),'Manual marquee controls removed');
assert.ok(html.includes('class="nh-home-link" href="/"'),'Header Home link');
assert.equal((html.match(/class="nh-way-card /g)||[]).length,4,'Four categories');
assert.ok(html.includes('HomePage-'),'Homepage styles available before hydration');
assert.ok(!html.includes('&lt;br/&gt;'),'No escaped line-break markup');
assert.ok(html.includes('id="why-choose-us"'),'Why choose us restored');
assert.ok(html.includes('home-body home-refresh'),'Redesigned body scoped to homepage');
assert.ok(html.includes('nx-pipeline')&&html.includes('Move Meera to follow-up'),'Interactive CRM pipeline present');
assert.ok(html.includes('nx-process-workspace'),'Concrete process workspace present');
assert.ok(!html.includes('nh-reason-plan')&&!html.includes('nh-mini-node'),'Decorative icon diagrams removed');
assert.equal((html.match(/class="nh-reason-card /g)||[]).length,6,'Six approved reasons');
assert.ok(html.includes('<h2>Our Clientele</h2>'),'Exact clientele heading');
assert.ok(!html.includes('OUR CLIENTS')&&!html.includes('Businesses with a vision of their own.'),'Old client heading removed');
assert.equal((html.match(/class="nh-client-group"/g)||[]).length,2,'Seamless clientele copies');
assert.ok(html.includes('alt="Shri Vaishnavi Shikshan Samsthe"'),'Correct visible client identity');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,'Homepage IDs');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)){const url=m[1];if(url.startsWith('/media/')||url.startsWith('/assets/')||url.startsWith('/hero-journey/'))assert.ok(fs.existsSync('dist'+url),'Missing asset: '+url);}
const pages=JSON.parse(fs.readFileSync('SEO-MAP.json'));
for(const page of pages){const html=fs.readFileSync('dist'+page.path+'index.html','utf8');assert.equal((html.match(/class="site-header nh-header"/g)||[]).length,1,page.path+' shared header');assert.equal((html.match(/class="nh-footer"/g)||[]).length,1,page.path+' shared footer');}
console.log(JSON.stringify({heroSourceFilesPreserved:Object.keys(manifest.sourceFiles).length-3,heroRenderersOptimized:2,heroContactHrefFixed:true,heroAssetsPreserved:Object.keys(manifest.assetFiles).length,homepageServerRendered:true,uniqueIds:true,localAssetsPresent:true,sharedNavigationPages:pages.length+1}));
