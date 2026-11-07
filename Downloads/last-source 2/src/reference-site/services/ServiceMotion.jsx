import React from 'react';
import {useMotionRegion} from '../motion.jsx';

const nodes = [[155,250],[300,100],[455,160],[600,75],[730,230],[565,340],[330,365]];
export default function ServiceMotion({motif, compact=false}) {
  const {ref,inView} = useMotionRegion();
  const search = ['search','knowledge'].includes(motif);
  return <div ref={ref} className={`service-motif motif-${motif} ${compact?'motif-compact':''} ${inView?'motif-visible':''}`} aria-hidden="true">
    <svg viewBox="0 0 900 460" fill="none" preserveAspectRatio="xMidYMid meet">
      <g className="motif-fine-lines">{[0,1,2,3,4,5].map(i=><path key={i} d={`M -80 ${180+i*30} C 160 ${-90+i*40}, 410 ${530-i*20}, 980 ${100+i*40}`}/>)}</g>
      {(search||motif==='ai'||motif==='social')&&<>
        <g className="motif-network">{nodes.map(([x,y],i)=><g key={i}><path className="motif-route" d={`M450 230 Q ${x} 230 ${x} ${y}`}/><path className="motif-dash" style={{animationDelay:`${-i*1.2}s`}} pathLength="1" d={`M450 230 Q ${x} 230 ${x} ${y}`}/><rect className="motif-tile" x={x-24} y={y-22} width="48" height="44" rx={motif==='social'?20:9}/><path d={`M${x-12} ${y-6}h24m-24 10h15`}/></g>)}</g>
        {search?<g className="motif-focus"><circle cx="450" cy="230" r="65"/><circle cx="450" cy="230" r="49"/><path d="m498 279 58 58"/></g>:<g className="motif-center"><circle cx="450" cy="230" r="55"/><circle cx="450" cy="230" r="36"/><path d="M430 230h40m-20-20v40"/></g>}
      </>}
      {['web','shop'].includes(motif)&&<g className="motif-browser"><rect x="210" y="85" width="480" height="300" rx="20"/><path d="M210 130h480"/><circle cx="235" cy="108" r="4"/><circle cx="251" cy="108" r="4"/><circle cx="267" cy="108" r="4"/><rect className="motif-pane" x="245" y="160" width="185" height="170" rx="10"/><path d="M465 175h170m-170 25h135m-135 25h155m-155 65h95"/><rect className="motif-phone" x="630" y="195" width="100" height="200" rx="17"/><path d="M660 215h40M650 360h60"/>{motif==='shop'&&<path className="motif-dash" d="M260 250h140m-120-35 20 85h70l18-60h-99"/>}</g>}
      {motif==='local'&&<g className="motif-map"><path d="m180 140 170-55 195 55 180-55v260l-180 55-195-55-170 55V140Zm170-55v260m195-205v260M180 220l170-45 195 55 180-55M180 300l170-45 195 55 180-55"/><g className="motif-radar">{[60,100,145].map(r=><ellipse key={r} cx="450" cy="270" rx={r} ry={r*.42}/>)}</g><path className="motif-pin" d="M450 80c-82 0-82 90 0 174 82-84 82-174 0-174Zm0 35a27 27 0 1 1 0 54 27 27 0 0 1 0-54Z"/></g>}
      {motif==='ads'&&<g><g className="motif-target">{[40,75,110,145].map(r=><circle key={r} cx="520" cy="235" r={r}/>)}<path d="m520 235 145-145m-36 3h33v33"/></g><path className="motif-route" d="M120 350h130q45 0 45-45V185q0-40 40-40h115"/><path className="motif-dash" pathLength="1" d="M120 350h130q45 0 45-45V185q0-40 40-40h115"/><rect x="90" y="285" width="100" height="65" rx="12"/></g>}
      {['content','email','creative'].includes(motif)&&<g className="motif-editorial"><rect className="motif-sheet sheet-back" x="280" y="75" width="290" height="300" rx="18"/><rect className="motif-sheet" x="330" y="105" width="290" height="300" rx="18"/>{[0,1,2,3,4,5].map(i=><path key={i} className="motif-writing" style={{animationDelay:`${-i*.65}s`}} d={`M370 ${155+i*35}h${i%2?150:210}`}/>)}{motif==='email'?<g className="motif-envelope"><rect x="555" y="245" width="155" height="110" rx="14"/><path d="m555 255 78 55 77-55"/></g>:<g className="motif-pen"><path d="m280 295 165-160 35 35-160 165-55 15 15-55Zm-15 55 40-40m-10-30 40 40"/></g>}</g>}
      {motif==='analytics'&&<g className="motif-analytics"><path d="M170 80v290h590"/>{[0,1,2,3,4,5,6].map(i=><rect key={i} className="motif-bar" style={{animationDelay:`${-i*.4}s`}} x={230+i*65} y={290-i*25} width="26" height={80+i*25} rx="8"/>)}<path className="motif-dash" pathLength="1" d="M200 285 300 235 385 255 480 155 565 175 700 90"/></g>}
    </svg>
  </div>;
}
