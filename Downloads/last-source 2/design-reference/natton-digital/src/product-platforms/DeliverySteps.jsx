import React, { useId, useState } from 'react';
import { Check, ArrowRight, ChartNoAxesCombined } from 'lucide-react';
import './delivery-steps.css';

const stageDetails = [
  ['Review the current setup and identify the main gaps.', 'Agree the business outcome and a useful starting point.'],
  ['Confirm responsibilities, priorities, and the implementation scope.', 'Agree the tools, dependencies, and how success will be reviewed.'],
  ['Test real examples with your team before handover.', 'Provide guidance so employees know how to use the setup.'],
  ['Document ownership, maintenance, and support arrangements.', 'Review results and refine the setup as your needs change.'],
];

export default function DeliverySteps({ steps, deliverables, measures = [], solution, crm = false }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const step = steps[active];
  return <div className={`delivery-selector ${crm ? 'delivery-selector-crm' : ''}`}>
    <div role="tablist" aria-label="Implementation stages" aria-orientation="vertical" className="delivery-stage-list">
      {steps.map((item, index) => <button key={item.title} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={index === active} aria-controls={`${id}-panel`} tabIndex={index === active ? 0 : -1} className={`delivery-stage ${index === active ? 'is-selected' : ''}`} onClick={() => setActive(index)} onKeyDown={event => {
        let next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % steps.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + steps.length - 1) % steps.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = steps.length - 1;
        if (next === undefined) return;
        event.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus();
      }}>
        <span className="delivery-checkbox" aria-hidden="true">{index === active && <Check size={17} />}</span>
        <span><strong>{item.title}</strong><span className="delivery-stage-description">{item.text}</span></span>
      </button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="delivery-detail">
      <div aria-live="polite" aria-atomic="true">
        <span className="delivery-label">STEP {active + 1} · WHAT WE WORK ON TOGETHER</span>
        <h3>{step.title}</h3><p>{step.text}</p>
        <ul className="delivery-detail-list">
          {[deliverables[active], ...stageDetails[active]].filter(Boolean).map(text => <li key={text}><Check size={18} aria-hidden="true" /><span>{text}</span></li>)}
        </ul>
      </div>
      {measures.length > 0 && <div className="delivery-measures"><span className="delivery-label">MEASURES TO REVIEW TOGETHER</span>{measures.map(text => <p key={text}><ChartNoAxesCombined size={17} aria-hidden="true" />{text}</p>)}<small>Targets and measurement methods are agreed after discovery.</small></div>}
      <a className="delivery-contact" href={`/contact/?solution=${solution}`}>Discuss this step <ArrowRight size={18} aria-hidden="true" /></a>
    </div>
  </div>;
}
