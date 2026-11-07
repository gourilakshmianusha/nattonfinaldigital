import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {load} from 'cheerio';
const pages={ProductGrowthOs:'growth-os',ProductBusinessOs:'business-os',ProductAgenticOs:'agentic-os',ProductAiMarketingPlatform:'ai-marketing-platform',IndustryHealthcare:'healthcare',IndustryEducation:'education-edtech',IndustryRealEstate:'real-estate',IndustryManufacturing:'manufacturing',IndustryRetailEcommerce:'retail-ecommerce',IndustryProfessionalServices:'professional-services'};
const output=path.resolve('tests/content/.ten-pages-fixture.mjs');let ui;
test.before(async()=>{await build({stdin:{contents:Object.keys(pages).map(name=>`export {default as ${name}} from './src/pages/${name}.tsx';`).join('\n'),resolveDir:process.cwd()},outfile:output,bundle:true,packages:'external',format:'esm',platform:'node',jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env.PROD':'false'}});ui=await import(pathToFileURL(output));});
test.after(()=>{if(fs.existsSync(output))fs.unlinkSync(output);});
test('all ten existing pages render archive headlines, copy and local media in both themes',()=>{
 for(const [name,slug]of Object.entries(pages))for(const darkMode of [false,true]){
  const page=JSON.parse(fs.readFileSync(`src/content/ten-pages/${slug}.json`,'utf8'));
  const html=renderToStaticMarkup(React.createElement(ui[name],{setPath:()=>{},darkMode})), $=load(html);
  if(slug==='ai-marketing-platform')assert.ok(!html.includes('Scale Your Marketing With AI'));
  if(slug==='growth-os'){assert.equal($('#growth-audiences h3').length,3);for(const title of ['Startups building their presence','Local service businesses','Growing MSMEs and SMBs'])assert.ok($('#growth-audiences').text().includes(title));}
  assert.equal($('h1').length,1,name);assert.equal($('h1').text().replace(/\s+/g,' ').trim(),page.headline,name);
  assert.ok($.text().includes(page.description),name+' description');assert.ok(!html.includes(page.eyebrow),name+' removed ZIP heading label');
  assert.ok(!html.includes('local-contents'),name+' no ZIP navbar');
  assert.ok(!html.includes('premium-theme'),name+' no ZIP theme');
  for(const item of page.services)assert.ok($.text().includes(item.description),name+' service '+item.title);
  for(const item of page.needs)assert.ok($.text().includes(item.description),name+' need '+item.title);
  for(const item of page.metrics)assert.ok($.text().includes(item.description),name+' measurement '+item.title);
  if(name.startsWith('Industry'))assert.ok($('#hero .archive-hero-backdrop').attr('style').includes(page.photo),name+' restored industry background');
  else if(slug!=='growth-os')assert.ok(!$('#hero').html().includes(page.heroImage),name+' keeps animation background');
  assert.equal($('#hero .archive-video-link').length,0,name+' has no separate video button');
  assert.ok(!/Watch Product Tour|Watch AgenticOS Demo|Watch the GrowthOS/.test($('#hero').text()),name+' has no watch-video line');
  if(slug==='growth-os')assert.ok($('#hero video source').attr('src').endsWith('growth-os/process-background.mp4')); 
  if(name.startsWith('Product')){const video=$('#hero video');assert.equal(video.length,1);for(const attr of ['autoplay','loop','muted','playsinline'])assert.ok(video.is('['+attr+']'));assert.ok(!video.is('[controls]'));assert.ok(fs.statSync('public'+video.find('source').attr('src')).size>0);assert.ok(fs.statSync('public'+video.attr('poster')).size>0);}

  assert.equal($('#hero img').length,0,name+' has no right-side hero image');
  assert.equal($('#hero .archive-hero-backdrop').length,1,name+' has one decorative background');
  const variant=['business-os','manufacturing'].includes(slug)?'routes':['agentic-os','real-estate','professional-services'].includes(slug)?'orbits':'waves';
  assert.equal($('#hero .archive-ambient-'+variant+'[aria-hidden=true]').length,name.startsWith('Industry')?1:0,name+' motion does not obscure solution video');
  assert.equal($('#hero .archive-motion-toggle').length,0,name+' has no background playback button');
  const ids=new Set($('[id]').toArray().map(el=>$(el).attr('id')));
  for(const el of $('a[href^="#"]').toArray()){const href=$(el).attr('href');if(href.length>1)assert.ok(ids.has(href.slice(1)),name+' anchor '+href);}
  if(name.startsWith('Industry')){assert.ok(!html.includes('Automated Clinical Mastery'));assert.equal($('a[href="/industries"]').filter((_,el)=>$(el).text().trim()==='Industries').length,1,name+' overview breadcrumb');}
  if(['retail-ecommerce','manufacturing','professional-services','agentic-os','business-os'].includes(slug)){assert.equal($('#faq details').length,page.faqs.length);assert.equal($('#faq details[open]').length,1);for(const faq of page.faqs)assert.ok($('#faq').text().includes(faq.answer));}

 }
});
test('every imported media URL resolves to a real file and GrowthOS keeps the supplied video',()=>{
 for(const slug of Object.values(pages)){const page=JSON.parse(fs.readFileSync(`src/content/ten-pages/${slug}.json`,'utf8'));assert.ok(fs.statSync('public'+(page.photo||page.heroImage)).size>0);}
 assert.ok(fs.statSync('public/media/ten-pages/growth-os/growthos-hero-original.mp4').size>1_000_000);
});
