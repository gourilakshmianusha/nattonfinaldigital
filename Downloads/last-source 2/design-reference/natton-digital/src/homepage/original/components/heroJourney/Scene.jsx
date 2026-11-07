import React,{useEffect,useRef} from 'react';
import {frameAt,FRAME_COUNT} from './cinema';
import {createFrameScheduler} from '../../../../performance/frameScheduler.js';

// Original Blender renders retain the complete lighting and materials without
// WebGL. Native scrolling, rather than video playback, controls the camera.
export default function Scene({driver,onReady,fullBleed=false}){
  const canvas=useRef();
  useEffect(()=>{
    const el=canvas.current,ctx=el.getContext('2d',{alpha:false});
    if(!ctx)return;
    const cache=new Map(),pending=new Map(),queued=new Set(),retryAfter=new Map();
    let width=0,height=0,disposed=false,current=driver.current.progress;
    const active=()=>driver.current.active!==false&&!document.hidden;
    const loop=createFrameScheduler({draw,isActive:active});
    const invalidate=()=>{if(active())loop.invalidate();else loop.pause();};
    driver.current.invalidate=invalidate;
    let last=performance.now(),displayed=null,ready=false,lastTarget=0,destination=0,paintKey='';
    const url=i=>`/hero-journey/cinema/${String(i).padStart(3,'0')}.webp`;
    const bounded=i=>Math.max(0,Math.min(FRAME_COUNT-1,i));

    function request(i){
      i=bounded(i);
      if(!cache.has(i)&&!pending.has(i)&&(retryAfter.get(i)||0)<=Date.now())queued.add(i);
    }
    function pump(){
      if(disposed||!active())return;
      for(const i of queued)if(Math.abs(i-lastTarget)>9&&i!==destination&&i!==0)queued.delete(i);
      const priority=i=>i===lastTarget?-3:i===lastTarget+1?-2:i===destination?-1:Math.abs(i-lastTarget);
      while(pending.size<4&&queued.size){
        const i=[...queued].sort((a,b)=>priority(a)-priority(b))[0];
        queued.delete(i);
        const image=new Image();pending.set(i,image);image.decoding='async';
        image.onload=()=>{
          pending.delete(i);
          if(disposed)return;
          cache.set(i,image);retryAfter.delete(i);paintKey='';
          const limit=driver.current.mobile?10:18;
          const keys=[...cache.keys()].sort((a,b)=>Math.abs(b-lastTarget)-Math.abs(a-lastTarget));
          for(const key of keys.slice(0,Math.max(0,cache.size-limit)))if(key!==i)cache.delete(key);
          pump();invalidate();
        };
        image.onerror=()=>{pending.delete(i);retryAfter.set(i,Date.now()+10000);pump();};
        image.src=url(i);
      }
    }
    function paint(image,alpha=1){
      if(!image)return;
      const areaHeight=driver.current.mobile&&!fullBleed?height*.74:height;
      const scale=Math.max(width/image.width,areaHeight/image.height),w=image.width*scale,h=image.height*scale;
      ctx.globalAlpha=alpha;ctx.drawImage(image,(width-w)/2,(areaHeight-h)/2,w,h);ctx.globalAlpha=1;
    }
    function resize(){
      width=el.clientWidth;height=el.clientHeight;
      const dpr=Math.min(devicePixelRatio||1,1.5);
      el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.fillStyle='#061021';ctx.fillRect(0,0,width,height);paint(displayed);paintKey='';invalidate();
    }
    function draw(now){
      if(!active()){last=now;return false;}
      const dt=Math.min((now-last)/1000,.1);last=now;
      const target=driver.current.progress;
      current=driver.current.reduced?target:current+(target-current)*(1-Math.exp(-8*dt));
      if(Math.abs(target-current)<.0001)current=target;
      const exact=frameAt(current),a=Math.floor(exact),b=Math.min(FRAME_COUNT-1,a+1),mix=exact-a;
      lastTarget=a;destination=Math.round(frameAt(target));
      request(a);request(b);request(destination);
      const direction=target>=current?1:-1;
      if(!driver.current.reduced){for(const offset of [2,3,4])request(a+offset*direction);request(a-direction);}pump();

      const first=cache.get(a),second=cache.get(b);
      let image=first||second;
      if(!image){
        const nearest=[...cache.keys()].sort((x,y)=>Math.abs(x-exact)-Math.abs(y-exact))[0];
        if(nearest!==undefined&&Math.abs(nearest-exact)<5)image=cache.get(nearest);
      }
      const key=`${a}:${first?'a':''}:${second?'b':''}:${Math.round(mix*50)}`;
      if(image&&key!==paintKey){
        displayed=image;ctx.fillStyle='#061021';ctx.fillRect(0,0,width,height);paint(image);
        if(first&&second&&mix>.01)paint(second,mix);
        paintKey=key;
        if(!ready){ready=true;onReady('cinematic-3d-sequence');}
      }
      return current!==target;
    }
    const observer=new ResizeObserver(resize);observer.observe(el);resize();request(0);pump();
    document.addEventListener('visibilitychange',invalidate);invalidate();
    return()=>{disposed=true;loop.destroy();if(driver.current.invalidate===invalidate)delete driver.current.invalidate;document.removeEventListener('visibilitychange',invalidate);observer.disconnect();queued.clear();cache.clear();for(const image of pending.values()){image.onload=null;image.onerror=null;}pending.clear();};
  },[driver,onReady,fullBleed]);
  return <canvas className="cinema-canvas" ref={canvas} aria-hidden="true"/>;
}
