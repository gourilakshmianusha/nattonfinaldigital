import React,{useState} from 'react';
import {Heading} from './common.jsx';
import {Icon} from './ui.jsx';
import {ServiceVisual} from './visuals.jsx';
import {Ambient,CardMotion} from './motion.jsx';
import {useTabs} from './hooks.js';

export default function ProductPackage({page}) {
 const [active,setActive]=useState(0);
 const {refs,onKey}=useTabs(2,setActive);
 const details=page.packageContents;
 const tabs=[{name:details.coreLabel,count:page.services.length},{name:'Solution add-ons',count:details.solutions.length}];
 const id=page.slug+'-package';
 return <section className="capabilities-section product-capabilities package-section section-space" id="capabilities">
  <Ambient variant="waves" className="capability-ambient"/>
  <div className="container">
   <Heading label="YOUR PACKAGE, EXPLAINED" title={page.title+': services and solutions.'} description={details.introduction}/>
   <div className="package-selector">
    <div className="package-tabs interactive-controls" role="tablist" aria-label={page.title+' package contents'}>
     {tabs.map((tab,i)=><button type="button" role="tab" id={id+'-tab-'+i} aria-controls={id+'-panel-'+i} aria-selected={active===i} tabIndex={active===i?0:-1} ref={el=>refs.current[i]=el} onKeyDown={e=>onKey(e,i)} onClick={()=>setActive(i)} key={tab.name}>
      <Icon name={i===0?'layers':'spark'}/><span>{tab.name}</span><span className="package-count" aria-label={tab.count+' cards'}>{tab.count}</span>
     </button>)}
    </div>
    <p className="package-scope-note"><Icon name="check"/><span>Your proposal confirms the selected services and deliverables. Add-ons are optional and scoped separately.</span></p>
   </div>
   <div role="tabpanel" id={id+'-panel-0'} aria-labelledby={id+'-tab-0'} hidden={active!==0} tabIndex="0" className="package-panel">
    <div className="package-group-intro"><h3>{details.coreTitle}</h3><p>{details.coreDescription}</p></div>
    <div className="capability-bento">
     {page.services.map((service,i)=><article className={'capability-tile capability-tile-'+i+' reveal'} key={service.title}>
      <div className="package-card-top"><span className="capability-icon"><Icon name={service.packageIcon}/></span><span className="package-badge">Core scope</span></div>
      <h4>{service.title}</h4><p>{service.description}</p>
      {service.packageTags?.length>0&&<ul className="package-tags" aria-label="Examples">{service.packageTags.map(tag=><li key={tag}>{tag}</li>)}</ul>}
      {i===0?<ServiceVisual page={page} index={details.visualIndex}/>:<CardMotion variant={i%4}/>}
     </article>)}
    </div>
   </div>
   <div role="tabpanel" id={id+'-panel-1'} aria-labelledby={id+'-tab-1'} hidden={active!==1} tabIndex="0" className="package-panel">
    <div className="package-group-intro"><h3>Additional solutions for the next connection.</h3><p>{details.solutionDescription}</p></div>
    <div className="package-solutions-grid">
     {details.solutions.map((solution,i)=><article className="capability-tile package-solution-card reveal" key={solution.title}>
      <div className="package-card-top"><span className="capability-icon"><Icon name={solution.icon}/></span><span className="package-badge">Optional add-on</span></div>
      <h4>{solution.title}</h4><p>{solution.description}</p>
      <ul className="package-tags" aria-label="Example uses">{solution.examples.map(example=><li key={example}>{example}</li>)}</ul>
      <CardMotion variant={i%4}/>
     </article>)}
    </div>
   </div>
   <div className="package-footer"><p>{details.costNote}</p><a className="text-link" href="#delivery">See how we agree the scope<Icon name="arrow"/></a></div>
  </div>
 </section>;
}
