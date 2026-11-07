export const SERVICES = [
  { name:'Search Engine Optimization', description:'Technical fixes, keyword research and useful page content that help the right customers find your business.' },
  { name:'Website Design & Development', description:'A website built around your business goals, with the right design, platform and customer journey.' },
  { name:'Google Business Profile', description:'Set up and improve your business profile so nearby customers can understand, contact and visit you.' },
  { name:'PPC & Google Ads', description:'Reach people searching for your services through focused campaigns, budget management and ongoing refinement.' },
  { name:'Social Media Marketing', description:'Build a relevant social presence with audience research, content planning and community-focused communication.' },
  { name:'Meta Ads', description:'Facebook and Instagram campaigns shaped around your audience, creative message and enquiry or sales goals.' },
  { name:'Content Marketing & Blogging', description:'Plan and create articles, service content and campaigns that answer customer questions and support buying decisions.' },
  { name:'AEO & AI Search Optimization', description:'Make your expertise easier to understand through clear answers, useful content and sound technical foundations.' },
  { name:'Graphic Design', description:'Bring your message to life through consistent brand visuals, campaign creatives and business communication.' },
  { name:'Email Marketing & Automation', description:'Create relevant email journeys for new enquiries, existing customers and timely follow-up.' },
  { name:'E-commerce Website Development', description:'Build a practical online store with product discovery, checkout and the integrations your business needs.' },
  { name:'Analytics & Conversion Optimization', description:'Understand customer behaviour, improve key journeys and connect marketing activity with meaningful enquiry actions.' },
  { name:'AI Growth Marketing', description:'Combine market insight, creative testing and AI-supported analysis to refine your growth strategy as conditions change.' },
];

export const SOLUTIONS = [
  { name:'AI Marketing SaaS', description:'Configure or build AI-assisted tools for content, SEO support and campaign analysis around your marketing workflow.' },
  { name:'CRM & AI Automation', description:'Connect customer records, sales stages and follow-up tasks so your team can act on the right information.' },
  { name:'Conversational AI Hub', description:'Bring chat and voice conversations into a connected customer journey, with clear handover to your team.' },
  { name:'WhatsApp Automation', description:'Build WhatsApp enquiries, customer updates and chatbot workflows around the way your business communicates.' },
  { name:'AI Calling Agents', description:'Create voice agents for appropriate inbound and outbound tasks, with defined boundaries and human escalation.' },
  { name:'Cloud Telephony', description:'Connect business calling, routing, recordings and CRM activity so conversations stay organised.' },
  { name:'RCS Messaging', description:'Design rich messaging journeys using interactive content and actions where the channel is supported.' },
  { name:'AI Agents & Workflow Automation', description:'Connect your applications and automate repeatable tasks with agents and workflows tailored to your operations.' },
];

export const PRODUCTS = [
  { name:'GrowthOS', glyph:'growth', promise:'Build the foundations. Connect the growth.',
    description:'Bring organic visibility and paid acquisition into one plan built around your business.',
    audience:'New businesses and businesses ready to build a stronger online presence.',
    delivery:'We connect your website, SEO, local presence, content and relevant campaigns, adding starter automation where it helps.',
    work:['Research your customers, competition and business goals.','Build or improve your website, SEO and Google Business Profile.','Bring relevant social content and paid campaigns into one acquisition strategy.','Add useful starter automation and review the next priorities with you.'],
    scope:'A customised service bundle. The business goals and agreed scope determine which capabilities are included.' },
  { name:'AI Marketing Platform', glyph:'studio', promise:'From a clear idea to a connected campaign.',
    description:'A connected workspace for generative copywriting, automated graphics and dynamic campaigns.',
    audience:'Marketing teams and businesses producing recurring content, creatives and campaigns.',
    delivery:'We shape AI-assisted copy, creative production and campaign workflows around your brand, with your team reviewing the output.',
    work:['Map your recurring content, creative and campaign requirements.','Configure generative copywriting and automated graphic workflows around your brand.','Connect campaign content and the relevant tools your team uses.','Build review steps and refine the workflow with your team.'],
    scope:'A tailored platform and workflow engagement. Integrations and features are scoped to your requirements; this concept does not imply a self-service subscription is available today.' },
  { name:'BusinessOS', glyph:'gears', promise:'Connect the work. Keep the business moving.',
    description:'An operational automation engine connecting your existing tools, customer journeys and everyday processes.',
    audience:'Established businesses with growing demand and repetitive work across their teams.',
    delivery:'We connect CRM records, existing pipelines, chatbots, calling agents and operational workflows around the bottlenecks that matter.',
    work:['Map enquiry handling, customer communication and internal operations.','Connect CRM records and the existing tools and legacy pipelines your team relies on.','Build relevant chatbots, calling agents and automated follow-up workflows.','Support adoption, maintenance and refinement with your team.'],
    scope:'A customised operational engagement. The process is assessed before choosing what to automate.' },
  { name:'AgenticOS', glyph:'agents', promise:'Many agents. One coordinated direction.',
    description:'An orchestration framework for multiple AI agents working across connected enterprise workflows.',
    audience:'Large businesses and organisations managing complex work across teams and systems.',
    delivery:'We build and coordinate custom AI agents around multi-step workflows, with defined permissions, handovers and human oversight.',
    work:['Assess enterprise workflows and define suitable responsibilities for each agent.','Build custom agents and connect relevant business systems.','Coordinate concurrent and multi-step tasks with defined permissions and human oversight.','Monitor the agreed workflows and refine the orchestration with your team.'],
    scope:'The architecture follows your workflow complexity, integration requirements and organisational controls.' },
];

const serviceGlyphs=['search','website','pin','target','social','megaphone','document','aiSearch','pen','mail','cart','analytics','aiGrowth'];
const solutionGlyphs=['studio','crm','chat','whatsapp','phone','cloud','rcs','workflow'];
export const STEPS=[
  {name:'Natton Digital',type:'intro',group:0,glyph:'natton',description:'Digital marketing, creative campaigns and tailored automation. Connected around your business, your vision and your next stage of growth.'},
  ...SERVICES.map((s,i)=>({...s,type:'service',group:1,glyph:serviceGlyphs[i],localIndex:i,count:SERVICES.length})),
  ...SOLUTIONS.map((s,i)=>({...s,type:'solution',group:2,glyph:solutionGlyphs[i],localIndex:i,count:SOLUTIONS.length})),
  ...PRODUCTS.map((s,i)=>({...s,type:'product',group:3,localIndex:i,count:PRODUCTS.length})),
];
export const NAVIGATION=[{label:'Overview',step:0},{label:'Services',step:1},{label:'Solutions',step:1+SERVICES.length},{label:'Products',step:1+SERVICES.length+SOLUTIONS.length}];
export const LAST_STEP=STEPS.length-1;
const weights=STEPS.map(s=>s.type==='intro'?1:s.type==='product'?1.15:s.type==='service'?.62:.72);
const distances=[0];for(let i=1;i<STEPS.length;i++)distances.push(distances[i-1]+(weights[i-1]+weights[i])/2);
const total=distances[LAST_STEP];
export const STOP_PROGRESS=distances.map(d=>d/total);
export const SCROLL_SCREENS=Math.ceil(total+1.5);
export function positionAt(progress){
  const p=Math.max(0,Math.min(1,progress));
  for(let i=0;i<LAST_STEP;i++)if(p<=STOP_PROGRESS[i+1])return i+(p-STOP_PROGRESS[i])/(STOP_PROGRESS[i+1]-STOP_PROGRESS[i]);
  return LAST_STEP;
}
export function stageAt(progress){return Math.min(LAST_STEP,Math.round(positionAt(progress)));}

