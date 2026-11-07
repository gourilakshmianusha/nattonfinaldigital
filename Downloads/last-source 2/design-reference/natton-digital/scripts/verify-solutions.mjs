import fs from 'node:fs';
import assert from 'node:assert/strict';

const pages=JSON.parse(fs.readFileSync('src/data/products.json'));
const decode=value=>value.replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.entries(value).filter(([key])=>!['icon','packageIcon','linkLabel','visualIndex'].includes(key)).flatMap(([,v])=>strings(v)):[];
let checked=0;
for(const page of pages){
 const html=fs.readFileSync(`dist${page.path}index.html`,'utf8');
 const text=decode(html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' '));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page.path+' main heading');
 for(const field of ['title','eyebrow','headline','description','audience','process','faqs','needs','services','metrics','definition','example','deliverables','timing','scopeNote','audienceContext','packageContents']){
  for(const value of strings(page[field])){assert.ok(text.includes(decode(value)),page.path+' missing approved copy: '+value);checked++;}
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,page.path+' duplicate IDs');
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)){
  const url=m[1];
  if(url.startsWith('/media/')||url.startsWith('/assets/'))assert.ok(fs.existsSync('dist'+url),page.path+' missing asset '+url);
 }
 for(const m of html.matchAll(/href="#([^" ]+)"/g))assert.ok(ids.includes(m[1]),page.path+' broken anchor '+m[1]);
 assert.ok(!/class="(?:card-motion|product-glyph|service-visual)/.test(html),page.path+' old decorative card art');
 assert.ok(html.includes('Example data')&&html.includes('not client results'),page.path+' illustrative results disclosure');
 if(page.slug==='growth-os')assert.ok(html.includes('growthos-hero-original.mp4'),page.path+' original hero film');
}
console.log(JSON.stringify({solutionPages:pages.length,approvedStringsVerified:checked,oneH1PerPage:true,uniqueIds:true,localAssetsPresent:true,sectionLinksValid:true,illustrativeResultsLabelled:true}));
