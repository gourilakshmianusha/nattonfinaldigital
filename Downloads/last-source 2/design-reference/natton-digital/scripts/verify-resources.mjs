import assert from 'node:assert/strict';
import fs from 'node:fs';
import {tools,defaults,calculateTool,assessmentResult} from '../src/resources/calculations.js';

const close=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<1e-6,`${label}: ${actual} instead of ${expected}`);
const value=(r,label)=>{const m=r.metrics.find(x=>x.label===label);assert.ok(m,label+' missing');return m.value;};
const run=(id,inputs={})=>calculateTool(id,{...defaults(id),...inputs});
let cases=0;
const test=(name,fn)=>{try{fn();cases++;}catch(e){throw new Error(name+': '+e.message,{cause:e});}};

test('ROI compares incremental contribution and deducts setup',()=>{
 const r=run('roi_calculator');
 close(value(r,'Monthly net benefit'),3000,'Monthly benefit');
 close(value(r,'Year-one net benefit'),31000,'Year one');
 close(value(r,'Year-one ROI'),31000/17000*100,'ROI');
 close(value(r,'Setup payback'),5/3,'Payback');
 close(r.tables[0].rows[0][2].value,-1000,'Lower conversion scenario');
});
test('Negative return has no payback',()=>{
 const r=run('revenue_growth');close(value(r,'Monthly net benefit'),-1000,'Negative benefit');
 assert.equal(value(r,'Setup payback'),null);
});
test('WhatsApp includes usage and review cost',()=>{
 const r=run('whatsapp_roi');close(value(r,'Monthly net benefit'),1250,'Net benefit');
});
test('Agents retain unsuccessful manual work and human review',()=>{
 const r=run('ai_agent_cost');close(value(r,'Monthly manual cost'),10000/60*500,'Manual');
 close(value(r,'Monthly hybrid cost'),3600/60*500+5000,'Hybrid');
});
test('Lead value uses contribution and explicit retention',()=>{
 const r=run('lead_value',{refund:10,repeatOrders:2,retention:50});
 close(value(r,'Contribution per lead'),72,'Lead contribution');
 close(value(r,'Acquisition break-even spend'),36000,'Break-even');
});
test('Budget normalises weights, caps spend and leaves missing history blank',()=>{
 const r=run('marketing_budget',{budget:15000,budgetCap:10000,desiredLeads:50});
 close(r.tables[0].rows.reduce((a,row)=>a+row[1].value,0),10000,'Allocation sum');
 assert.equal(r.tables[0].rows[0][2].value,null);
 close(value(r,'Target cost per lead'),200,'Target CPL');
 const history=run('marketing_budget',{channels:[{name:'Search',weight:2,cpl:100,conversion:10},{name:'Email',weight:1,cpl:null,conversion:null}]});
 close(history.tables[0].rows[0][3].value,20/3,'Known channel sales');
});
test('ROAS differs from margin-based ROI',()=>{
 const r=run('marketing_roi');close(value(r,'ROAS'),2,'ROAS');
 close(value(r,'Margin-based marketing ROI'),-20,'Margin-based ROI');
 const zero=run('marketing_roi',{spend:0,leads:0,sales:0});
 for(const label of ['ROAS','Margin-based marketing ROI','Cost per lead','Cost per sale'])assert.equal(value(zero,label),null);
});
test('Automation deducts review and uses 52 weeks / 12 months',()=>{
 const r=run('automation_savings');close(value(r,'Hours recovered per month'),5*10*52/12*.7*.5*.8,'Hours');
 close(value(r,'Monthly net benefit'),5*10*52/12*.7*.5*.8*500-3000,'Benefit');
 const employees=run('ai_employee_savings');close(value(employees,'Hours recovered per month'),5*10*52/12*.5*.8,'Employee hours');
});
test('Calling applies each funnel stage and all costs',()=>{
 const r=run('ai_calling_roi');close(value(r,'Expected bookings'),40,'Bookings');
 close(value(r,'Expected sales'),5.6,'Sales');close(value(r,'Monthly net benefit'),20000,'Benefit');
});
test('Sales time value is not double counted',()=>{
 const r=run('sales_productivity');close(value(r,'Monthly net benefit'),11000,'Selling contribution less licence');
 close(value(r,'Time value — not added to benefit'),32500,'Separate staff-time value');
});
test('Support retains escalations and review',()=>{
 const r=run('support_savings');close(value(r,'Tickets resolved without escalation'),378,'Resolved');
 close(value(r,'Monthly net benefit'),23500,'Benefit after review and platform');
});
test('Zero scores, NA and unequal domain sizes are handled explicitly',()=>{
 const v=defaults('ai_readiness'),qs=tools.find(t=>t.id==='ai_readiness').fields.filter(f=>f.stage);
 for(const q of qs)v[q.key]=0;
 close(assessmentResult('ai_readiness',v).score,0,'Zero answers are valid');
 for(const q of qs)v[q.key]='na';
 assert.equal(assessmentResult('ai_readiness',v).score,null);
 v.data_quality='4';v.data_access='0';v.process_documented='4';
 close(assessmentResult('ai_readiness',v).score,75,'Equal domain weighting');
 assert.throws(()=>assessmentResult('crm_score',defaults('crm_score')),/Answer every question/);
});
test('Invalid inputs never produce misleading calculated outputs',()=>{
 assert.throws(()=>run('roi_calculator',{margin:101}),/valid value/);
 assert.throws(()=>run('roi_calculator',{leads:''}),/valid value/);
 assert.throws(()=>run('marketing_budget',{channels:[{weight:0}]}),/positive allocation/);
 assert.throws(()=>run('marketing_budget',{channels:[{weight:-1}]}),/valid non-negative/);
 assert.throws(()=>run('marketing_budget',{channels:[{weight:1,cpl:1,conversion:110}]}),/valid non-negative/);
});
const pages=['about','contact','book-demo','resources','free-tools','ai-readiness-assessment','roi-calculator','blog','compare','our-process','privacy-policy'];
test('Restored routes render substantive content and local navigation',()=>{
 for(const path of pages){
  const html=fs.readFileSync('dist/'+path+'/index.html','utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path+' H1');
  assert.ok(html.includes('nh-nav-resources'),path+' Resources menu');
  assert.ok(html.includes('href="/about/"'),path+' About link');
  assert.ok(!html.includes('href="https://nattondigital.com/contact'),path+' stale contact route');
 }
 for(const path of ['about','contact','book-demo']){
  const html=fs.readFileSync('dist/'+path+'/index.html','utf8');
  assert.ok(html.includes('Business enquiry form'),path+' form');
  assert.ok(html.includes('Review your enquiry'),path+' honest review action');
  assert.ok(html.includes('mailto:info@nattondigital.com'),path+' email contact');
 }
});
const articles=JSON.parse(fs.readFileSync('src/resources/articles.json'));
test('Journal has four complete guides and no test post',()=>{
 assert.equal(articles.length,4);
 for(const a of articles){assert.ok(fs.existsSync('dist/blog/'+a.slug+'/index.html'));assert.ok(a.sections.length>=3);}
 assert.ok(!fs.readFileSync('dist/blog/index.html','utf8').includes('asmxlaksja'));
});
console.log(JSON.stringify({passed:true,meaningfulCases:cases,restoredTools:tools.length,restoredCoreRoutes:pages.length,substantiveGuides:articles.length}));
