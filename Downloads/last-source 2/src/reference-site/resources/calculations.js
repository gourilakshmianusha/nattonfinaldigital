import registry from './tools.json' with {type:'json'};

export const tools=registry.tools;
export const answers=registry.answerLabels;
export const defaults=id=>Object.fromEntries(tools.find(t=>t.id===id).fields.map(f=>[f.key,structuredClone(f.default)]));
const n=(v,k)=>Number.isFinite(Number(v[k]))?Number(v[k]):0;
const p=(v,k)=>n(v,k)/100;
const divide=(a,b)=>b>0?a/b:null;
const metric=(label,value,unit='money')=>({label,value,unit});
const table=(title,columns,rows)=>({title,columns,rows});
const assumptions='These are scenarios based on your inputs, not measured business results. Check the assumptions against a small, reviewed pilot.';

function recurringResult(monthlyNet,cost,setup,methodology,extra=[],showRoi=true){
 const annualNet=monthlyNet*12-setup;
 return {metrics:[...extra,metric('Monthly net benefit',monthlyNet),metric('Year-one net benefit',annualNet),...(showRoi?[metric('Year-one ROI',divide(annualNet,cost*12+setup)===null?null:annualNet/(cost*12+setup)*100,'percent')]:[]),metric('Setup payback',monthlyNet>0?setup/monthlyNet:null,'months')],tables:[table('Cumulative net benefit after setup',['Period','Net benefit'],[1,3,5].map(y=>[`${y} ${y===1?'year':'years'}`,metric('',monthlyNet*12*y-setup)]))],methodology:[...methodology,'Year-one net benefit = 12 × monthly net benefit − one-time setup. Payback is shown only when monthly net benefit is positive.'],notes:[assumptions,'Recovered staff time becomes cash savings only if your actual costs fall.']};
}

export function assessmentResult(id,values){
 const fields=tools.find(t=>t.id===id).fields.filter(f=>f.options?.includes('unanswered'));
 if(fields.some(f=>values[f.key]===undefined||values[f.key]===''||values[f.key]==='unanswered'))throw new Error('Answer every question, or choose Not applicable where appropriate.');
 const domains={};
 for(const f of fields){if(values[f.key]==='na')continue;if(![0,1,2,3,4].includes(Number(values[f.key])))throw new Error('Choose an available answer for every question.');const name=f.domain||f.label;(domains[name]??=[]).push(Number(values[f.key]));}
 const rows=Object.entries(domains).map(([name,a])=>({name,score:a.reduce((s,x)=>s+x,0)/a.length*25}));
 const score=rows.length?rows.reduce((s,x)=>s+x.score,0)/rows.length:null;
 const guidance={Data:'Agree a shared data source, who maintains it and what a complete record looks like.',Process:'Document a trigger, the expected output and the exceptions before connecting tools.',Skills:'Choose a reviewer and practise with examples of acceptable and unacceptable outputs.',Governance:'Agree access limits, approval points and an exception owner before a pilot.','Use Cases':'Choose one bounded task and record its current cost, completion time and quality.'};
 return {score,level:score===null?'No applicable answers':score<25?'Build the foundations':score<50?'Prepare a focused pilot':score<75?'Test with clear review points':'Evaluate a controlled rollout',metrics:[metric('Planning score',score,'score'),metric('Applicable questions',fields.filter(f=>values[f.key]!=='na').length,'number')],domains:rows,methodology:['Each answer is scored from 0 to 4. Not applicable answers are excluded. Domain percentages are averaged with equal weight.','This is a self-reported planning aid, not an audit, certification or approval to automate a process.'],notes:[`${fields.filter(f=>values[f.key]==='na').length} questions marked Not applicable.`],recommendations:rows.slice().sort((a,b)=>a.score-b.score).slice(0,3).map(d=>guidance[d.name]||`Review ${d.name.toLowerCase()} with the people who own the work. Agree a baseline, owner and next action.`)};
}

export function calculateTool(id,v){
 const def=tools.find(t=>t.id===id);
 if(!def)throw new Error('Choose a tool.');
 for(const f of def.fields.filter(f=>f.type==='number')){const val=Number(v[f.key]);if(v[f.key]===undefined||v[f.key]===null||String(v[f.key]).trim()===''||!Number.isFinite(val)||val<f.min||val>f.max)throw new Error(`Enter a valid value for ${f.label}.`);}
 if(id==='ai_readiness'||id==='crm_score')return assessmentResult(id,v);
 const num=k=>n(v,k),pct=k=>p(v,k);
 if(id==='roi_calculator'||id==='revenue_growth'){
  const leads=num('leads'),sale=num('saleValue'),margin=pct('margin'),baseline=leads*pct('conversion')*sale*margin;
  const scenarioLeads=leads*(1+(id==='roi_calculator'?pct('leadChange'):0));
  const gain=scenarioLeads*pct('targetConversion')*sale*margin-baseline+(id==='roi_calculator'?num('laborSavings'):0);
  const cost=id==='roi_calculator'?num('operatingCosts'):num('acquisitionCost');
  const result=recurringResult(gain-cost,cost,num('setupCost'),['Contribution = leads × conversion rate × average sale value × gross margin.','Net benefit compares scenario contribution with the current contribution, then deducts the additional operating or acquisition cost.'],[metric('Current monthly contribution',baseline),metric('Scenario monthly contribution',scenarioLeads*pct('targetConversion')*sale*margin)]);
  if(id==='roi_calculator')result.tables.unshift(table('Conversion sensitivity — your assumptions',['Scenario','Conversion','Monthly net benefit'],[['Lower',num('pessimisticChange')],['Base',0],['Higher',num('optimisticChange')]].map(([name,change])=>{const conv=Math.min(100,Math.max(0,num('targetConversion')+change));return[name,metric('',conv,'percent'),metric('',scenarioLeads*conv/100*sale*margin-baseline+num('laborSavings')-cost)];})));
  return result;
 }
 if(id==='whatsapp_roi'){
  const gain=num('leads')*(pct('targetConversion')-pct('conversion'))*num('saleValue')*pct('margin');
  const cost=num('messages')*num('messageCost')+num('platformCost')+num('oversightCost');
  return recurringResult(gain-cost,cost,num('setupCost'),['Additional contribution = leads × change in conversion × order value × gross margin.','Monthly cost includes message usage, the platform fee and human oversight. Message pricing is your input, not a provider quote.'],[metric('Additional monthly contribution',gain),metric('Monthly messaging and review cost',cost)]);
 }
 if(id==='ai_agent_cost'){
  const tasks=num('tasks')*num('cycles'),manualHours=tasks*num('minutes')/60,automated=tasks*pct('success');
  const hybridHours=((tasks-automated)*num('minutes')+automated*num('reviewMinutes'))/60;
  const manual=manualHours*num('hourlyCost'),hybrid=hybridHours*num('hourlyCost')+tasks*num('modelCost')+num('softwareCost')+num('infrastructureCost')+num('maintenanceCost');
  const result=recurringResult(manual-hybrid,hybrid,num('setupCost'),['Manual hours = tasks per cycle × cycles per month × manual minutes / 60.','The hybrid workflow retains manual work for unsuccessful tasks, review for automated tasks, model costs for all attempts, licences, infrastructure and maintenance.'],[metric('Monthly manual cost',manual),metric('Monthly hybrid cost',hybrid),metric('Hours recovered per month',manualHours-hybridHours,'hours')],false);
  result.tables.unshift(table('Total operating cost including setup',['Period','Manual','Hybrid'],[1,3,5].map(y=>[`${y} years`,metric('',manual*12*y),metric('',hybrid*12*y+num('setupCost'))])));return result;
 }
 if(id==='lead_value'){
  const customers=num('leads')*pct('conversion'),customerContribution=num('saleValue')*pct('margin')*(1-pct('refund'))*(1+num('repeatOrders')*pct('retention'));
  return {metrics:[metric('Expected customers',customers,'number'),metric('Contribution per customer',customerContribution),metric('Contribution per lead',pct('conversion')*customerContribution),metric('Actual cost per lead',divide(num('acquisitionCost'),num('leads'))),metric('Acquisition cost per customer',divide(num('acquisitionCost'),customers)),metric('Acquisition break-even spend',customers*customerContribution)],methodology:['Customers = leads × conversion rate.','Contribution per customer includes your gross margin, refund assumption and expected additional orders weighted by retention.','Break-even acquisition spend uses contribution, not revenue. It excludes overheads not entered here.'],notes:[assumptions,'Repeat orders are your explicit assumption; no lifetime-value multiplier is invented.']};
 }
 if(id==='marketing_budget'){
  const budget=Math.min(num('budget'),num('budgetCap')),channels=v.channels||[];
  if(!channels.length||channels.some(c=>!Number.isFinite(Number(c.weight))||Number(c.weight)<0||(c.cpl!=null&&c.cpl!==''&&(!Number.isFinite(Number(c.cpl))||Number(c.cpl)<0))||(c.conversion!=null&&c.conversion!==''&&(!Number.isFinite(Number(c.conversion))||Number(c.conversion)<0||Number(c.conversion)>100))))throw new Error('Enter valid non-negative channel weights, cost per lead and conversion rates up to 100%.');
  const sum=channels.reduce((s,c)=>s+Number(c.weight||0),0);
  if(sum<=0)throw new Error('Give at least one channel a positive allocation weight.');
  const rows=channels.map(c=>{const spend=budget*Number(c.weight||0)/sum,leads=Number(c.cpl)>0?spend/Number(c.cpl):null,sales=leads!==null&&c.conversion!=null&&c.conversion!==''?leads*Number(c.conversion)/100:null;return[c.name,metric('',spend),metric('',leads,'number'),metric('',sales,'number')];});
  return {metrics:[metric('Monthly allocated budget',budget),...(num('desiredLeads')>0?[metric('Target cost per lead',budget/num('desiredLeads'))]:[]),metric('Budget / monthly revenue',divide(budget,num('revenue'))===null?null:budget/num('revenue')*100,'percent')],tables:[table('Channel plan',['Channel','Budget','Modelled leads','Modelled sales'],rows)],methodology:['Target cost per lead = available budget / desired leads. This is a target, not a forecast.','Allocation = available budget × channel weight / total channel weight. Available budget is capped at your maximum spend.','Lead forecasts require a positive historical cost per lead. Sales forecasts also require a conversion rate. Blank history stays unforecasted.'],notes:[assumptions,'A budget allocation is not evidence that a channel will achieve the entered acquisition cost.']};
 }
 if(id==='marketing_roi'){
  const revenue=num('sales')*num('saleValue'),contribution=revenue*pct('margin'),spend=num('spend');
  return {metrics:[metric('Attributed revenue',revenue),metric('Gross contribution',contribution),metric('Net contribution after marketing',contribution-spend),metric('ROAS',divide(revenue,spend),'multiple'),metric('Margin-based marketing ROI',spend>0?(contribution-spend)/spend*100:null,'percent'),metric('Cost per lead',divide(spend,num('leads'))),metric('Cost per sale',divide(spend,num('sales')))],methodology:['ROAS = attributed revenue / campaign spend.','Margin-based marketing ROI = (gross contribution − spend) / spend.','Only include sales you can reasonably attribute to the campaign. No monthly or annual period is assumed.'],notes:[assumptions]};
 }
 if(id==='automation_savings'||id==='ai_employee_savings'){
  const eligible=num('employees')*num('hoursPerWeek')*52/12*(id==='automation_savings'?pct('repetitive'):1),covered=eligible*pct('automation'),review=covered*pct('review'),recovered=covered-review,cost=num('softwareCost')+num('maintenanceCost');
  return recurringResult(recovered*num('hourlyCost')-cost,cost,num('setupCost'),['Average monthly hours use 52 weeks / 12 months.','Covered hours = eligible task hours × task coverage. Recovered hours deduct human review before applying the loaded labour rate.'],[metric('Eligible hours per month',eligible,'hours'),metric('Review hours per month',review,'hours'),metric('Hours recovered per month',recovered,'hours')],false);
 }
 if(id==='ai_calling_roi'){
  const contacts=num('calls')*pct('contact'),bookings=contacts*pct('booking'),attended=bookings*pct('showup'),sales=attended*pct('close'),contribution=sales*num('contribution'),cost=num('calls')*(num('telephonyCost')+num('aiCost'))+num('oversightCost');
  const result=recurringResult(contribution-cost,cost,num('setupCost'),['The funnel applies your contact, booking, show-up and close assumptions in sequence.','Scenario contribution deducts telephony, AI usage and human oversight. It does not claim incremental sales against an unmeasured manual baseline.'],[metric('Expected bookings',bookings,'number'),metric('Expected sales',sales,'number'),metric('Calling cost per month',cost),metric('Manual cost comparison',num('calls')*num('manualCost'))]);
  result.tables.unshift(table('Your modelled calling funnel',['Stage','Count'],[['Calls',num('calls')],['Contacts',contacts],['Bookings',bookings],['Attended',attended],['Sales',sales]].map(([s,a])=>[s,metric('',a,'number')])));return result;
 }
 if(id==='sales_productivity'){
  const recovered=num('reps')*num('adminHours')*52/12*pct('reduction'),selling=recovered*pct('redeployed'),opportunities=selling*num('activities')*pct('qualified'),sales=opportunities*pct('close'),contribution=sales*num('saleValue')*pct('margin');
  return recurringResult(contribution-num('softwareCost'),num('softwareCost'),num('setupCost'),['Recovered hours = representatives × weekly admin hours × 52 / 12 × reduction.','Only the redeployed share produces modelled selling activity. Opportunities, sales and contribution follow your entered conversion assumptions.','Staff-time value is shown separately and is not added to the projected sales benefit.'],[metric('Selling hours recovered',selling,'hours'),metric('Modelled qualified opportunities',opportunities,'number'),metric('Time value — not added to benefit',recovered*num('hourlyCost'))]);
 }
 if(id==='support_savings'){
  const tickets=num('tickets'),covered=tickets*pct('coverage'),resolved=covered*pct('resolution')*(1-pct('escalation')),manual=tickets*num('minutes')/60*num('hourlyCost'),hybrid=((tickets-resolved)*num('minutes')+covered*num('reviewMinutes'))/60*num('hourlyCost')+num('softwareCost');
  return recurringResult(manual-hybrid,hybrid,num('setupCost'),['Resolved without escalation = covered tickets × resolution rate × (1 − escalation rate).','The hybrid cost retains manual work on unresolved or escalated tickets, review of all covered tickets and the monthly platform/model fee.'],[metric('Tickets resolved without escalation',resolved,'number'),metric('Monthly manual cost',manual),metric('Monthly hybrid cost',hybrid)],false);
 }
 throw new Error('This tool uses the review workflow shown below.');
}
