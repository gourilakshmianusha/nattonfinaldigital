import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createFrameScheduler} from '../src/performance/frameScheduler.js';

function harness({active=true,draw=()=>false}={}){
 const callbacks=new Map();let id=0,calls=0,visible=active;
 const loop=createFrameScheduler({request:fn=>{callbacks.set(++id,fn);return id;},cancel:id=>callbacks.delete(id),isActive:()=>visible,draw:t=>{calls++;return draw(t,loop);}});
 return{loop,callbacks,get calls(){return calls;},set visible(v){visible=v;},tick(){const [id,fn]=callbacks.entries().next().value;callbacks.delete(id);fn(id*16.67);}};
}
let cases=0;
const test=(name,fn)=>{try{fn();cases++;}catch(e){throw new Error(name+': '+e.message,{cause:e});}};
test('Settled graphics leave no perpetual frame callback',()=>{const h=harness();h.loop.invalidate();h.loop.invalidate();assert.equal(h.callbacks.size,1);h.tick();assert.equal(h.calls,1);assert.equal(h.callbacks.size,0);});
test('Settling runs only as long as drawing requires',()=>{let draws=0;const h=harness({draw:()=>++draws<3});h.loop.invalidate();while(h.callbacks.size)h.tick();assert.equal(h.calls,3);assert.equal(h.callbacks.size,0);});
test('Offscreen work does not schedule or draw',()=>{const h=harness({active:false});h.loop.invalidate();assert.equal(h.callbacks.size,0);h.visible=true;h.loop.invalidate();h.visible=false;h.tick();assert.equal(h.calls,0);assert.equal(h.callbacks.size,0);});
test('Pause cancels pending work and visible updates can resume',()=>{const h=harness();h.loop.invalidate();h.loop.pause();assert.equal(h.callbacks.size,0);h.loop.invalidate();h.tick();assert.equal(h.calls,1);});
test('Unmount cancels work and cannot resurrect it',()=>{const h=harness();h.loop.invalidate();h.loop.destroy();h.loop.invalidate();assert.equal(h.callbacks.size,0);});
test('Image arrival during drawing schedules a single new frame',()=>{let first=true;const h=harness({draw:(_,loop)=>{if(first){first=false;loop.invalidate();}return false;}});h.loop.invalidate();h.tick();assert.equal(h.callbacks.size,1);h.tick();assert.equal(h.calls,2);assert.equal(h.callbacks.size,0);});
const manifest=JSON.parse(fs.readFileSync('dist/.vite/manifest.json'));
const entry=manifest['index.html'],initialBytes=fs.statSync('dist/'+entry.file).size;
test('Large page collections are no longer in the initial route bundle',()=>{assert.ok(initialBytes<300000,`Initial JavaScript ${initialBytes} bytes`);assert.ok(entry.dynamicImports.includes('src/CollectionPages.jsx'));assert.ok(!Object.keys(manifest).includes('src/product-platforms/pages/hub.jsx'));});
test('SSR output does not duplicate public media',()=>{assert.ok(!fs.existsSync('.ssr-build/media'));assert.ok(!fs.existsSync('.ssr-build/hero-journey'));});
test('Performance review surfaces and cache do not ship',()=>{assert.ok(!fs.existsSync('dist/scroll-performance-qa.html'));assert.ok(!fs.existsSync('dist/node_modules'));assert.ok(!fs.existsSync('dist/.npm'));});
console.log(JSON.stringify({passed:true,meaningfulCases:cases,initialJavaScriptBytes:initialBytes,baselineInitialJavaScriptBytes:603346,reductionPercent:Math.round((1-initialBytes/603346)*100),offscreenSchedulerTested:true}));
