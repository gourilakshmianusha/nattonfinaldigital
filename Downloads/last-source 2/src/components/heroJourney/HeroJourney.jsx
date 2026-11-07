import React,{useCallback,useEffect,useRef,useState} from 'react';
import Scene from './Scene';
import {STEPS,NAVIGATION,LAST_STEP,STOP_PROGRESS,SCROLL_SCREENS,stageAt} from './journey';
import './Journey.css';

const pad=n=>String(n).padStart(2,'0');
const names=['Overview','Services','Solutions','Products'];

export default function HeroJourney({setPath}){
  const reduced=useRef(matchMedia('(prefers-reduced-motion:reduce)').matches);
  const driver=useRef({progress:0,stage:0,motion:!reduced.current,reduced:reduced.current,mobile:matchMedia('(max-width:760px)').matches});
  const story=useRef(),indexDialog=useRef(),scopeDialog=useRef();
  const [stage,setStage]=useState(0),[motion,setMotion]=useState(!reduced.current),[renderer,setRenderer]=useState('loading'),[scope,setScope]=useState(null);
  const ready=useCallback(mode=>setRenderer(mode),[]);
  const current=STEPS[stage];
  useEffect(()=>{
    let frame;
    function update(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const range=Math.max(1,story.current.offsetHeight-innerHeight),p=Math.max(0,Math.min(1,(scrollY-(story.current.getBoundingClientRect().top+scrollY))/range));const next=stageAt(p);driver.current.progress=p;driver.current.stage=next;driver.current.mobile=matchMedia('(max-width:760px)').matches;story.current.style.setProperty('--progress',p);setStage(next);});}
    addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
    const media=matchMedia('(prefers-reduced-motion:reduce)');function updateMotion(){reduced.current=media.matches;driver.current.reduced=media.matches;driver.current.motion=!media.matches;setMotion(!media.matches);}media.addEventListener('change',updateMotion);
    return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',update);removeEventListener('resize',update);media.removeEventListener('change',updateMotion);};
  },[]);
  useEffect(()=>{if(scope)scopeDialog.current.showModal();},[scope]);
  function go(n){const i=Math.max(0,Math.min(LAST_STEP,n));const range=story.current.offsetHeight-innerHeight;scrollTo({top:(story.current.getBoundingClientRect().top+scrollY)+range*STOP_PROGRESS[i],behavior:reduced.current?'instant':'smooth'});}
  function contact(){setPath('contact');}
  function toggleMotion(){driver.current.motion=!motion;setMotion(!motion);}
  function outsideClose(e){if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}}
  return <div className="natton-hero-journey">
      <section className="journey" id="growth-journey" ref={story} style={{height:`${SCROLL_SCREENS*100}svh`}} aria-label="Natton Digital: one connected growth journey">
        <div className={`journey-frame frame-${current.type} ${motion?'':'motion-paused'}`} data-renderer={renderer} data-stage={stage}>
          <button className="journey-index journey-local-index" onClick={()=>indexDialog.current.showModal()}>Jump to an offering <span aria-hidden="true">↗</span></button>
          <div className="environment" aria-hidden="true"><Scene driver={driver} onReady={ready}/></div><div className="atmosphere" aria-hidden="true"/><div className="bottom-shade" aria-hidden="true"/>
          <div className="orientation"><span className="status-dot"/>{current.type==='intro'?'YOUR NEXT CHAPTER STARTS HERE':`${names[current.group].toUpperCase()} / ${pad(current.localIndex+1)} OF ${pad(current.count)}`}</div>
          {STEPS.map((step,i)=><article key={step.name} className={`flow-copy copy-${step.type} ${stage===i?'current':''}`} aria-hidden={stage!==i} inert={stage!==i?true:undefined}>
            {step.type==='intro'?<><h1>Marketing that <em>evolves.</em></h1><p className="intro-promise">A team that stays involved.</p><p className="flow-description intro-description">{step.description}</p><button className="primary-cta" onClick={()=>contact()}>Let’s build your next chapter <span>↗</span></button><p className="brand-scope">DIGITAL MARKETING <i/> CREATIVE CAMPAIGNS <i/> AI & AUTOMATION</p></>:<>
              <h2>{step.name}</h2>
              {step.type==='product'?<><p className="product-promise">{step.promise}</p><div className="product-explanation"><p><span>WHO IT’S FOR</span>{step.audience}</p><p><span>WHAT WE DO</span>{step.delivery}</p></div><div className="copy-actions"><button className="primary-cta" onClick={()=>contact(step)}>Discuss {step.name==='AI Marketing Platform'?'the platform':step.name}<span>↗</span></button><button className="scope-link" onClick={()=>setScope(step)}>View delivery scope <span>+</span></button></div></>:<><p className="flow-description">{step.description}</p><button className="text-cta" onClick={()=>contact(step)}>Discuss your project <span>↗</span></button></>}
            </>}
          </article>)}

          <div className="film-hud"><span className="scroll-prompt">SCROLL TO UNFOLD <i>↓</i></span><div className="film-chapters" role="group" aria-label="Journey categories">{NAVIGATION.slice(1).map((n,i)=><button key={n.label} onClick={()=>go(n.step)} aria-pressed={current.group===i+1} aria-label={`Go to ${n.label}`}>{n.label}<small>{i===0?'13':i===1?'08':'04'}</small></button>)}</div><span className="film-counter">{pad(stage+1)} <i>/ {pad(STEPS.length)}</i></span></div>
          <div className="frame-utilities"><button onClick={toggleMotion} aria-label={motion?'Pause ambient animation':'Enable ambient animation'} aria-pressed={!motion}>{motion?'Ⅱ':'▷'}<span>{motion?'Motion on':'Motion off'}</span></button><a href="#after-growth-journey">Skip the tour ↘</a></div>
          {renderer==='loading'&&<div className="loading-scene" role="status"><i/><span>CONNECTING YOUR NEXT CHAPTER</span></div>}
          <div className="progress-track" aria-hidden="true"><i/></div>
        </div>
      </section>
      <div id="after-growth-journey" tabIndex={-1}/>
    <dialog className="index-dialog" ref={indexDialog} aria-labelledby="index-title" onClick={outsideClose}><button className="dialog-close" aria-label="Close journey index" onClick={()=>indexDialog.current.close()}>×</button><p className="dialog-kicker">FIND YOUR NEXT STEP</p><h2 id="index-title">Where would you like to go?</h2><p className="dialog-intro">Follow the full journey, or jump straight to what your business needs.</p><div className="index-groups">{NAVIGATION.slice(1).map((group,g)=><section key={group.label}><h3>{group.label}<span>{g===0?'13':g===1?'08':'04'}</span></h3>{STEPS.map((step,i)=>step.group===g+1?<button key={i} aria-current={i===stage?'step':undefined} onClick={()=>{indexDialog.current.close();go(i);}}><span>{step.name}</span><b>↗</b></button>:null)}</section>)}</div></dialog>
    <dialog className="scope-dialog" ref={scopeDialog} aria-labelledby="scope-title" onClick={outsideClose} onClose={()=>setScope(null)}><button className="dialog-close" aria-label="Close delivery scope" onClick={()=>scopeDialog.current.close()}>×</button>{scope&&<><p className="dialog-kicker">TAILORED TO YOUR BUSINESS</p><h2 id="scope-title">{scope.name}</h2><p className="dialog-intro">{scope.description}</p><h3>What we do</h3><ul>{scope.work.map(w=><li key={w}>{w}</li>)}</ul><p className="scope-note">{scope.scope}</p><button className="primary-cta" onClick={()=>{scopeDialog.current.close();contact(scope);}}>Discuss your requirements <span>↗</span></button></>}</dialog>
    <span className="sr-only" role="status" aria-live="polite">{current.type==='intro'?'Natton Digital overview':`${names[current.group]} ${current.localIndex+1} of ${current.count}: ${current.name}`}</span>
  </div>;
}
