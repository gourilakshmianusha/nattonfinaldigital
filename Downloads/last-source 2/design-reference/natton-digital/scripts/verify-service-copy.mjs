import fs from 'node:fs';
import assert from 'node:assert/strict';
const pages=JSON.parse(fs.readFileSync('src/services/page-copy.json'));
const definitions=JSON.parse(fs.readFileSync('src/services/definitions.json'));
const decode=s=>s.replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.entries(value).filter(([k])=>!['id','kind'].includes(k)).flatMap(([,v])=>strings(v)):[];
let checked=0;
for(const page of pages){const definition=definitions.find(d=>d.id===page.id);const route=definition.url||`/services/${page.id}/`;const html=fs.readFileSync(`dist${route}index.html`,'utf8');const text=decode(html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' '));assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);for(const value of strings(page)){assert.ok(text.includes(decode(value)),`${route} missing original text: ${value}`);checked++;}const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,route+' duplicate IDs');for(const m of html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)){const url=m[1];if(url.startsWith('/media/')||url.startsWith('/assets/'))assert.ok(fs.existsSync('dist'+url),route+' missing asset '+url);} }
const result={servicePages:pages.length,originalStringsVerified:checked,oneH1PerPage:true,uniqueIds:true,localAssetsPresent:true};fs.writeFileSync('SERVICES-CONTENT-VERIFICATION.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
