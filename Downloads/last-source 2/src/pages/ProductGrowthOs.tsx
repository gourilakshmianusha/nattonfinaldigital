import archivePage from '../content/ten-pages/growth-os.json';
import {ArchiveHeroBackground,ArchiveContentGroup} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Target, 
  Workflow, 
  Calendar, 
  FileText, 
  Mail, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowRight, 
  Play, 
  Sliders, 
  Smartphone, 
  Database, 
  Lock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Plus, 
  Trash2, 
  DollarSign, 
  HelpCircle, 
  BarChart2, 
  Code, 
  Building, 
  GraduationCap, 
  Briefcase, 
  ShoppingBag, 
  Award, 
  Layers, 
  ShieldAlert, 
  MapPin, 
  Sparkles,
  PhoneCall,
  Laptop
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function ProductGrowthOs({ setPath, darkMode, ...props }: any) {
  const [localFormSubmitted, setLocalFormSubmitted] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const formSubmitted = props.formSubmitted !== undefined ? props.formSubmitted : localFormSubmitted;
  const setFormSubmitted = props.setFormSubmitted !== undefined ? props.setFormSubmitted : setLocalFormSubmitted;
  const loading = props.loading !== undefined ? props.loading : localLoading;
  const setLoading = props.setLoading !== undefined ? props.setLoading : setLocalLoading;

  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // 1. DEMO FORM STATE
  // ==========================================
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'India',
    industry: 'Healthcare',
    currentCrm: 'None / Spreadsheets',
    monthlyLeads: '50 - 200',
    teamSize: '5 - 20',
    message: ''
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaNum1(num1);
    setCaptchaNum2(num2);
    setCaptchaInput('');
    setCaptchaVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaVerify = () => {
    if (parseInt(captchaInput) === (captchaNum1 + captchaNum2)) {
      setCaptchaVerified(true);
    } else {
      alert("Incorrect math verification value. Please try again.");
      generateCaptcha();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please solve the security verification math question first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1800);
  };

  // ==========================================
  // 2. INTERACTIVE KANBAN PIPELINE BOARD
  // ==========================================
  const [deals, setDeals] = useState([
    { id: '1', name: 'Fortis Clinic Lead Sync', value: 145000, stage: 'new' },
    { id: '2', name: 'Standard Chartered Pilot', value: 380000, stage: 'contacted' },
    { id: '3', name: 'Tech Mahindra Funnels', value: 210000, stage: 'proposal' },
    { id: '4', name: 'Apollo Dental Campaign', value: 180000, stage: 'won' }
  ]);

  const moveDeal = (dealId: string, newStage: 'new' | 'contacted' | 'proposal' | 'won') => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  const totalPipelineRevenue = deals.reduce((acc, d) => acc + d.value, 0);
  const wonRevenue = deals.filter(d => d.stage === 'won').reduce((acc, d) => acc + d.value, 0);

  // ==========================================
  // 3. INTERACTIVE LANDING PAGE SIMULATOR
  // ==========================================
  const [funnelHeading, setFunnelHeading] = useState('Transform Your Practice Operations Today');
  const [funnelColor, setFunnelColor] = useState('#2E9CAE');
  const [funnelTemplate, setFunnelTemplate] = useState('healthcare');

  const templatesList = {
    healthcare: { heading: 'Transform Your Dental Clinic Operations', accent: '#2E9CAE' },
    education: { heading: 'Double Your Student Registrations This Autumn', accent: '#47C7BF' },
    realestate: { heading: 'Programmatic Real Estate Lead Generation Pipelines', accent: '#508A36' },
    retail: { heading: 'Run High-Yield Automated Whatsapp Shopping Funnels', accent: '#237786' }
  };

  const applyFunnelTemplate = (type: keyof typeof templatesList) => {
    setFunnelTemplate(type);
    setFunnelHeading(templatesList[type].heading);
    setFunnelColor(templatesList[type].accent);
  };

  // ==========================================
  // 4. INTERACTIVE CALENDAR BOOKING
  // ==========================================
  const [selectedDay, setSelectedDay] = useState<number | null>(27);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reminderStep, setReminderStep] = useState<string>('idle');

  const triggerMockReminder = (slot: string) => {
    setSelectedSlot(slot);
    setReminderStep('sending');
    setTimeout(() => {
      setReminderStep('sent');
      setBookingConfirmed(true);
    }, 1200);
  };

  // ==========================================
  // 5. INTERACTIVE WORKFLOW AUTOMATION ENGINE
  // ==========================================
  const [workflowActiveNode, setWorkflowActiveNode] = useState<number>(-1);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);

  const workflowFlow = [
{ name: "Understand the business", log: "Clarify your offer, audience, locations, current marketing and the action a useful customer should take. Agree an initial objective and the information needed to evaluate it." },
{ name: "Build the right foundation", log: "Prioritise website clarity, search basics, eligible business profiles and enquiry capture. We can improve existing assets where they remain useful instead of assuming everything needs replacement." },
{ name: "Create and connect", log: "Develop the agreed pages, content and channel activity with a consistent message. Prepare landing pages, forms or conversation entry points for the campaigns in scope." },
{ name: "Launch with a clear handover", log: "Check the customer journey, tracking and team responsibilities. Introduce the agreed campaigns and publishing activity when the business is ready to handle the response." },
{ name: "Review and improve", log: "Review visibility, customer actions and enquiry quality at agreed intervals. Decide together what needs refinement, what should continue and which next investment has a useful role." }
];

  const runWorkflowSimulator = () => {
    if (isWorkflowRunning) return;
    setIsWorkflowRunning(true);
    setWorkflowActiveNode(0);
    setWorkflowLogs([workflowFlow[0].log]);

    const nextNode = (idx: number) => {
      if (idx >= workflowFlow.length) {
        setIsWorkflowRunning(false);
        setWorkflowLogs(prev => [...prev, "[Automation] All 6 trigger branches COMPLETED successfully."]);
        return;
      }
      setTimeout(() => {
        setWorkflowActiveNode(idx);
        setWorkflowLogs(prev => [...prev, workflowFlow[idx].log]);
        nextNode(idx + 1);
      }, 1500);
    };

    nextNode(1);
  };

  // ==========================================
  // 6. REAL-TIME GRAPH STATS / METRIC SELECTOR
  // ==========================================
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'leads' | 'conversions'>('revenue');

  const graphData = {
    revenue: {
      points: [
        { label: 'Jan', val: 450000, height: 40 },
        { label: 'Feb', val: 620000, height: 55 },
        { label: 'Mar', val: 890000, height: 80 },
        { label: 'Apr', val: 1200000, height: 110 },
        { label: 'May', val: 1540000, height: 140 },
        { label: 'Jun', val: 2100000, height: 190 }
      ],
      prefix: '₹',
      color: 'stroke-[#00C2FF] fill-[#00C2FF]/10'
    },
    leads: {
      points: [
        { label: 'Jan', val: 120, height: 50 },
        { label: 'Feb', val: 180, height: 75 },
        { label: 'Mar', val: 310, height: 110 },
        { label: 'Apr', val: 420, height: 140 },
        { label: 'May', val: 560, height: 175 },
        { label: 'Jun', val: 780, height: 210 }
      ],
      prefix: '',
      color: 'stroke-[#8B5CF6] fill-[#8B5CF6]/10'
    },
    conversions: {
      points: [
        { label: 'Jan', val: 18, height: 45 },
        { label: 'Feb', val: 24, height: 60 },
        { label: 'Mar', val: 42, height: 95 },
        { label: 'Apr', val: 68, height: 130 },
        { label: 'May', val: 89, height: 165 },
        { label: 'Jun', val: 134, height: 220 }
      ],
      prefix: '',
      color: 'stroke-emerald-400 fill-emerald-400/10'
    }
  };

  // ==========================================
  // 7. ROI SOFTWARE ESTIMATOR
  // ==========================================
  const [leadsInput, setLeadsInput] = useState(150);
  const [teamInput, setTeamInput] = useState(8);
  const [dealValInput, setDealValInput] = useState(25000); // in INR
  const [softwareCost, setSoftwareCost] = useState(15000); // monthly cost in INR

  // Outputs
  const baseConversionRate = 0.04; // 4%
  const growthOsConversionRate = 0.085; // 8.5% due to auto workflows

  const currentRevenue = leadsInput * baseConversionRate * dealValInput;
  const projectedRevenue = leadsInput * growthOsConversionRate * dealValInput;
  const netRevenueIncrease = projectedRevenue - currentRevenue;

  // GrowthOS pricing cost
  const growthOsMonthlyLicense = 9999;
  const monthlyCostSavings = Math.max(0, softwareCost - growthOsMonthlyLicense);
  const annualTotalValue = (netRevenueIncrease + monthlyCostSavings) * 12;

  // ==========================================
  // 8. FAQ AND ACCORDIONS
  // ==========================================
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqsList = [
{
      q: "What is GrowthOS?",
      a: "GrowthOS is Natton Digital’s customised approach to connecting website development, SEO, content, selected marketing channels and enquiry capture. It is a consultancy and implementation bundle shaped around the business, rather than one fixed list of tools every client must buy."
    },
{
      q: "Do we need a new website before starting?",
      a: "Not necessarily. We first review the existing website and the customer journey. A focused improvement to content, structure, speed or enquiry capture may be more useful than a complete rebuild. The scope should explain what is being retained, changed or newly developed."
    },
{
      q: "Do all businesses need SEO, social media and paid advertising together?",
      a: "No. A local service business, an ecommerce store and a B2B company may need different starting priorities. We select the mix around customer behaviour, the offer, location, readiness and budget. Channels can be added or adjusted when they have a clear role."
    },
{
      q: "Can you work with WordPress, Shopify or a custom website?",
      a: "Those are options we can assess against the requirements. Content editing, catalogue management, integrations, design needs and ongoing maintenance affect the choice. The selected platform and responsibilities are agreed before implementation; advanced animations are considered alongside accessibility and mobile usability."
    },
{
      q: "When should we expect results?",
      a: "The sequence depends on the starting position and the channels in scope. Website or tracking improvements, advertising tests and organic search work have different review cycles. We agree delivery milestones and measurement points during planning. Rankings, sales and lead volumes cannot be guaranteed for a particular date."
    },
{
      q: "What happens when our customer operations become more complex?",
      a: "GrowthOS can establish the marketing and enquiry foundations. If the growing challenge becomes managing customer context, team ownership, conversations or routine operational follow-up, BusinessOS may be the next useful discussion. The move is based on a real need, not an automatic upgrade requirement."
    }
];

  // ==========================================
  // 9. CLIENT CAROUSEL STATE
  // ==========================================
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const clientStories = [
{
      industry: "GrowthOS — illustrative example",
      title: "Customer discovers a useful page",
      metric: "Illustrative workflow",
      desc: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      quote: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      author: "GrowthOS — illustrative example"
    },
{
      industry: "GrowthOS — illustrative example",
      title: "The offer and next step become clear",
      metric: "Illustrative workflow",
      desc: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      quote: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      author: "GrowthOS — illustrative example"
    },
{
      industry: "GrowthOS — illustrative example",
      title: "A form, call or message reaches the team",
      metric: "Illustrative workflow",
      desc: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      quote: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      author: "GrowthOS — illustrative example"
    },
{
      industry: "GrowthOS — illustrative example",
      title: "The enquiry and campaign are reviewed",
      metric: "Illustrative workflow",
      desc: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      quote: "Illustrative journey. Channels and tracking depend on the agreed scope.",
      author: "GrowthOS — illustrative example"
    }
];

  return (
    <div className={`py-12 animate-fade-in font-sans text-left transition-colors duration-500 ${
      darkMode ? 'bg-[#0B0721] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* ==========================================
            1. HERO SECTION (Animated Mesh Style & Interactive 3D Mockup)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 relative">
          
          {/* Futuristic ambient vector overlays */}
          <div className="absolute -top-10 left-10 w-[350px] h-[350px] bg-[#00C2FF]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Left Column Content */}
          <div className="archive-hero-copy lg:col-span-7 space-y-6">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Build your presence."} <br />
<span className="bg-gradient-to-r from-violet-400 via-[#00C2FF] to-pink-500 bg-clip-text text-transparent">{"Give growth a direction."}</span>
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#demo_form" 
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-violet-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Live Demo <ArrowRight className="h-4 w-4" />
              </a>
              
            </div>

            {/* Platform Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5">{"A credible presence"}</span>
              <span className="flex items-center gap-1.5">{"Relevant discovery"}</span>
              <span className="flex items-center gap-1.5">{"Connected enquiries"}</span>
            </div>
          </div>

          {/* Right Column: Floating holographic mockup */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            2. ECOSYSTEM SECTION (Bento Grid of Cards)
           ========================================== */}
        <div id="ecosystem" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-violet-400 uppercase block font-bold">Unified Business Solutions</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"What we can help you connect"}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.definition.body}</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
{ title: "A website built for the next step", desc: "Develop or improve the pages customers need to evaluate your business and make an enquiry. WordPress, Shopify or a custom-coded website can be considered according to the content, ecommerce and editing requirements. Advanced visual storytelling is added where it supports the offer and the mobile experience.", icon: Users, color: "text-[#00C2FF] bg-[#00C2FF]/10" },
{ title: "Search visibility with useful content", desc: "Connect keyword research, page structure, technical SEO and helpful content around your actual services. The objective is to help relevant people discover and understand your business. Search visibility is reviewed over time, without promises of a particular ranking or a fixed number of leads.", icon: Target, color: "text-violet-400 bg-violet-400/10" },
{ title: "A clearer local presence", desc: "For eligible businesses, review Google Business Profile information, service details, photos and the journey from local discovery to a call or enquiry. Location relevance should reflect where the business genuinely operates. An online-only business needs a different search and acquisition approach.", icon: Layers, color: "text-emerald-400 bg-emerald-400/10" },
{ title: "Content with a consistent business message", desc: "Plan website copy, articles and social media content around what your audience needs to understand. Creative ideas should support a recognisable offer, useful explanations and a practical publishing rhythm, with the channels and formats agreed together.", icon: Laptop, color: "text-pink-400 bg-pink-400/10" },
{ title: "Campaigns connected to conversion", desc: "Where paid advertising fits the plan, connect the campaign message, targeting, landing page and enquiry action. Channel selection and campaign testing depend on the audience, offer and budget. Media spend is identified separately from the implementation and management scope.", icon: Calendar, color: "text-amber-400 bg-amber-400/10" },
{ title: "Tracking, handover and ongoing review", desc: "Agree which actions matter, such as relevant calls, form enquiries or purchases. Connect the available tracking and a practical handover to your team, then review the data alongside the quality of the enquiries. The next decision should be understandable, with limitations in attribution made clear.", icon: FileText, color: "text-[#00C2FF] bg-[#00C2FF]/10" }
].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                  darkMode ? 'bg-white/[0.01] border-white/5 hover:border-[#00C2FF]' : 'bg-white border-slate-200 hover:shadow-lg'
                }`}>
                  <div className="space-y-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold font-display">{card.title}</h3>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{card.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-1 text-[10px] font-mono text-gray-500 font-semibold uppercase">
                    <span>Explore Node</span> <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            3. INTERACTIVE DASHBOARD EXPERIENCE (Highly Interactive Sandbox)
           ========================================== */}
        <div id="interactive_dashboard" className="mb-24 scroll-mt-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-[#00C2FF] uppercase block font-bold">Interactive Sandbox Simulator</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Interactive Dashboard Experience
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.example.note}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Interactive Section Selector & Playground Sidebar */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CONFIGURE PLAYGROUND MODULE</span>
              
              {/* Pipeline Deal Mover */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-bold font-display mb-2 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-[#00C2FF]" /> Drag-and-Drop Deal Mover
                </h4>
                <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">Advance standard deals across CRM pipeline columns:</p>
                <div className="space-y-2">
                  {deals.map(deal => (
                    <div key={deal.id} className="flex items-center justify-between bg-black/25 p-2 rounded border border-white/5">
                      <span className="text-[10px] font-semibold truncate max-w-[120px]">{deal.name}</span>
                      <select
                        value={deal.stage}
                        onChange={(e) => moveDeal(deal.id, e.target.value as any)}
                        className="bg-zinc-800 text-white border border-white/10 text-[9px] p-1 rounded focus:outline-none"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Closed-Won</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Personalizer */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-bold font-display mb-2 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-violet-400" /> Landing Page Customizer
                </h4>
                <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">Click to test instant programmatic responsive industry structures:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(templatesList) as Array<keyof typeof templatesList>).map((type) => (
                    <button
                      key={type}
                      onClick={() => applyFunnelTemplate(type)}
                      className={`p-2 rounded text-[9px] font-mono uppercase font-bold border transition-all ${
                        funnelTemplate === type 
                          ? 'border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]' 
                          : 'border-white/5 bg-zinc-800 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Display Viewport */}
            <div className={`lg:col-span-8 rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-md relative ${
              darkMode ? 'bg-[#0E1524]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xl'
            }`}>
              <div className="absolute top-0 right-0 h-40 w-40 bg-[#00C2FF]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                
                {/* Header bar */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block">OPERATING CONSOLE</span>
                    <h3 className="text-lg font-bold font-display flex items-center gap-1.5">GrowthOS™ Unified Hub</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-gray-500 block text-[9px]">TOTAL PIPELINE VALUE</span>
                      <span className="font-bold text-[#00C2FF]">₹{totalPipelineRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right border-l border-white/10 pl-4">
                      <span className="text-gray-500 block text-[9px]">CLOSED-WON REVENUE</span>
                      <span className="font-bold text-emerald-400">₹{wonRevenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated CRM visual layout split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Pipeline columns */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Active Kanban Columns:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {['new', 'contacted', 'proposal', 'won'].map((stage) => {
                        const stageDeals = deals.filter(d => d.stage === stage);
                        return (
                          <div key={stage} className="p-2 bg-black/25 rounded border border-white/5 space-y-1.5 min-h-[140px] flex flex-col justify-between">
                            <span className="text-[8px] font-mono text-gray-500 uppercase block border-b border-white/5 pb-1 text-center truncate">
                              {stage === 'new' ? 'NEW' : stage === 'contacted' ? 'TALK' : stage === 'proposal' ? 'PROP' : 'WON'}
                            </span>
                            <div className="space-y-1 flex-grow pt-1.5">
                              {stageDeals.map(d => (
                                <div key={d.id} className="p-1.5 bg-zinc-800 rounded border border-white/5 text-[8px] font-semibold truncate" title={d.name}>
                                  {d.name}
                                </div>
                              ))}
                            </div>
                            <span className="text-[8px] font-mono text-[#00C2FF] text-center block pt-1 border-t border-white/5">
                              ₹{stageDeals.reduce((sum, current) => sum + current.value, 0) / 1000}k
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Programmatic Funnel Simulator View */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Interactive Funnel Live-Preview:</span>
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0A071A] min-h-[140px] flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[8px] font-mono text-gray-500">
                        <span>Preview: dental-intake-page.html</span>
                        <span className="text-[#00C2FF]">● LIVE</span>
                      </div>
                      
                      <div className="text-center py-4 space-y-2">
                        <h4 className="text-xs font-bold font-display px-2 transition-all duration-300" style={{ color: funnelColor }}>
                          {funnelHeading}
                        </h4>
                        <p className="text-[9px] text-gray-400">Book diagnostic slots in Mumbai instantly.</p>
                        <button className="px-3 py-1 rounded text-[8px] font-mono text-white" style={{ backgroundColor: funnelColor }}>
                          Verify Booking Slot
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[7px] text-gray-500 font-mono">
                        <span>Load Speed: <span className="text-emerald-400 font-bold">140ms</span></span>
                        <span>SEO Rank: <span className="text-[#00C2FF] font-bold">99/100</span></span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-gray-500">
                <span>⚡ Prompt Protocol: pipeline_monitor_v4.1</span>
                <span>Active integrations: HubSpot, GHL, Razorpay</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            4. SMART CRM & PIPELINE DEEP DIVES
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Smart CRM Detail */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-[#00C2FF] uppercase block tracking-widest font-bold">CRM Module spec</span>
              <h3 className="text-2xl font-bold font-display">Smart CRM</h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                A modern client registry engine designed to store comprehensive contact logs, client tags, notes histories, and automated schedule tasks without charging aggressive per-contact premiums.
              </p>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CORE SUB-CAPABILITIES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Unified Contacts Log", "Programmatic Lead Tracking", "Opportunity Scoring Metrics", "Task Assignment Calendars", "Team Collaboration Feeds"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Database Sync: Real-Time SSL</span>
              <span>Unlimited Contact Records</span>
            </div>
          </div>

          {/* Sales Pipeline Management Detail */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-violet-400 uppercase block tracking-widest font-bold">Pipeline Module spec</span>
              <h3 className="text-2xl font-bold font-display">Sales Pipeline Management</h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Monitor prospective clients as they navigate custom qualification metrics. Create distinct pipelines for sales reps, client onboarding coordinators, and outbound campaigns.
              </p>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CORE SUB-CAPABILITIES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Drag & Drop Stages", "Automated Lead Status", "Revenue Projections", "Advisor Dialers", "Google/Trustpilot Collectors"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Layout Style: Kanban Responsive</span>
              <span>Bidirectional HubSpot Sync</span>
            </div>
          </div>

        </div>

        {/* ==========================================
            5. FUNNELS & CALENDAR DEEP DIVES
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Funnels & Landing Pages Detail */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block tracking-widest font-bold">Builder Module spec</span>
              <h3 className="text-2xl font-bold font-display">Funnels & Landing Pages</h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Deploy ultra-fast, serverless landing pages optimized to score 99/100 on mobile web vitals. Embed checkout templates, payment integrations, and math CAPTCHAs easily.
              </p>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CORE SUB-CAPABILITIES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Drag-and-Drop Builders", "High-Volume Lead Captures", "Sub-second Page Speeds", "Programmatic Keyword SEO", "Instant Razorpay Checkout"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Hosting: Global Vercel Edge</span>
              <span>SSL Certificate Pre-bound</span>
            </div>
          </div>

          {/* Calendars & Scheduling Detail */}
          <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-pink-400 uppercase block tracking-widest font-bold">Scheduler Module spec</span>
              <h3 className="text-2xl font-bold font-display">Calendar & Appointment Scheduling</h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Link corporate advisors directly into prospect booking panels. Automatically block overlapping dates, configure Zoom URLs, and dispatch email drip reminders.
              </p>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CORE SUB-CAPABILITIES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Google Calendar Sync", "Microsoft Outlook Sync", "Automated Reminder Loops", "Dedicated Booking Panels", "Integrated Zoom & Meet Links"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>Sync Protocol: Bidirectional API</span>
              <span>Timezone auto-calculations</span>
            </div>
          </div>

        </div>

        {/* ==========================================
            6. WORKFLOW AUTOMATION (Interactive Node-Based Simulator)
           ========================================== */}
        <div id="automation" className="mb-24 scroll-mt-12 solution-process-section">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-violet-400 uppercase block font-bold">Visual Workflow Engine</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"How we work"}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch solution-process-split">
            
            {/* Visual node flowchart */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">ACTIVE PIPELINE SEQUENCE MAP</span>
                <button
                  onClick={runWorkflowSimulator}
                  disabled={isWorkflowRunning}
                  className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-mono text-[10px] rounded-lg flex items-center gap-1.5 font-bold uppercase shadow-md transition-all disabled:opacity-50"
                >
                  <Zap className="h-3.5 w-3.5" /> {isWorkflowRunning ? "Tracing Nodes..." : "Execute Flow Test"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative solution-process-node-grid">
                {workflowFlow.map((node, idx) => {
                  const isActive = workflowActiveNode === idx;
                  const isPassed = workflowActiveNode > idx;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 min-h-[90px] ${
                        isActive 
                          ? 'border-[#00C2FF] bg-[#00C2FF]/10 shadow-lg scale-[1.01]' 
                          : isPassed 
                            ? 'border-emerald-500/40 bg-emerald-500/5' 
                            : (darkMode ? 'border-white/5 bg-white/[0.01] opacity-70' : 'border-slate-100 bg-white opacity-75')
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] font-mono text-gray-500">NODE 0{idx + 1}</span>
                        {isPassed && (
                          <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold">Passed</span>
                        )}
                        {isActive && (
                          <span className="text-[8px] font-mono text-[#00C2FF] uppercase font-bold animate-pulse">Active</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold font-display">{node.name}</h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro execution logs terminal */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className={`rounded-2xl border p-6 flex flex-col justify-between h-full backdrop-blur-md relative ${
                darkMode ? 'bg-black/40 border-white/10 text-gray-300' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl'
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-[#00C2FF] uppercase font-bold">EXECUTION CONSOLE LOGS</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="font-mono text-[10px] space-y-2 h-[200px] overflow-y-auto scrollbar-none">
                    {workflowLogs.length === 0 ? (
                      <p className="text-gray-500">Press 'Execute Flow Test' to trace webhook actions live.</p>
                    ) : (
                      workflowLogs.map((log, idx) => (
                        <p key={idx} className={log.includes('[Automation]') ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                          {log}
                        </p>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 text-[9px] font-mono text-gray-500 space-y-1 mt-4">
                  <div>PROTOCOL ENGINE: <span className="text-[#00C2FF]">GHL Core API v2</span></div>
                  <div>SECURITY LAYER: <span className="text-violet-400">SOC2 compliant logs</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            7. COMMUNICATION HUB & INTERACTIVE REAL-TIME ANALYTICS
           ========================================== */}
        <div id="analytics" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-[#00C2FF] uppercase block font-bold">Consolidated Dashboard Records</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Useful signals. Better conversations."}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{"We agree the indicators around your objective, the information available and the work in scope. Review the quality of the next step as well as the activity that led to it."}</p>
          </div><ArchiveContentGroup page={archivePage} group="metrics" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Metric selection panels */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">SELECT ANALYTIC GRAPH</span>
              {[
                { key: 'revenue', label: 'Company Revenue Growth', desc: 'Real-time billing value across monthly client pipelines.', color: 'border-[#00C2FF] bg-[#00C2FF]/5' },
                { key: 'leads', label: 'Qualified Lead Volume', desc: 'Tracks total inbound entries qualification success.', color: 'border-violet-500 bg-violet-500/5' },
                { key: 'conversions', label: 'Funnel Conversion Rate', desc: 'Evaluates the percentage of closed-won win statuses.', color: 'border-emerald-500 bg-emerald-500/5' }
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeMetric === m.key
                      ? `border-[#00C2FF] bg-[#00C2FF]/10 shadow-lg scale-[1.01]`
                      : (darkMode ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-slate-200 bg-white hover:bg-slate-50')
                  }`}
                >
                  <h4 className="text-xs font-bold font-display">{m.label}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Right Column: Custom Animated SVG Graph Panel */}
            <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between backdrop-blur-md relative ${
              darkMode ? 'bg-[#0E1524]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xl'
            }`}>
              <div className="absolute top-0 right-0 h-40 w-40 bg-[#00C2FF]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block">PERFORMANCE GRAPH MONITOR</span>
                    <h3 className="text-base font-bold font-display capitalize">{activeMetric} Performance Trend</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase animate-pulse">
                    ● Real-Time Feed
                  </span>
                </div>

                {/* Custom Responsive SVG Graph */}
                <div className="h-[220px] w-full flex items-end justify-between px-2 pt-6 relative border-b border-l border-white/10">
                  
                  {/* Grid lines background */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                  </div>

                  {/* Render Columns */}
                  {graphData[activeMetric].points.map((pt, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                      
                      {/* Interactive Tooltip Overlay */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white border border-white/10 text-[9px] font-mono px-2.5 py-1.5 rounded-lg shadow-xl text-center z-50 pointer-events-none whitespace-nowrap">
                        <span className="block text-gray-500 font-bold">VALUE</span>
                        <span className="text-[#00C2FF] font-extrabold">{graphData[activeMetric].prefix}{pt.val.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Bar Column Vector */}
                      <div 
                        className="w-[60%] rounded-t-lg bg-gradient-to-t from-violet-600/20 to-blue-500/50 hover:to-blue-400 transition-all duration-500 relative overflow-hidden border-t border-x border-[#00C2FF]/30" 
                        style={{ height: `${pt.height}px` }}
                      >
                        {/* Shimmer pulse */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent w-full h-full -translate-y-full hover:translate-y-full transition-transform duration-1000" />
                      </div>

                      <span className="text-[9px] font-mono text-gray-500 mt-2 block">{pt.label}</span>
                    </div>
                  ))}

                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span>⚡ Metric Class: {activeMetric === 'revenue' ? 'Financial Ledger' : 'CRM Tracker'}</span>
                <span>Bidirectional API Sync: Verified</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            8. INDUSTRY USE CASES
           ========================================== */}
        <div id="growth-audiences" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-[#8B5CF6] uppercase block font-bold">Tailored Implementations</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Who this can help"}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
{ title: "Startups building their presence", desc: "Create a credible website, explain your offer clearly and plan the first channels that help relevant customers discover your business.", icon: Building, color: "border-blue-500/20 text-blue-400" },
{ title: "Local service businesses", desc: "Connect service and location pages, local search visibility and appropriate campaigns with a clear route for customer calls, forms and messages.", icon: MapPin, color: "border-teal-500/20 text-teal-400" },
{ title: "Growing MSMEs and SMBs", desc: "Bring content, campaigns and enquiry handovers into a coordinated plan. Review available results and enquiry quality to choose the next practical improvement.", icon: TrendingUp, color: "border-violet-500/20 text-violet-400" }
].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between backdrop-blur-md ${
                  darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4.5 w-4.5 text-[#00C2FF]" />
                      <h3 className="text-sm font-bold font-display">{card.title}</h3>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{card.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>Blueprint status: pre-configured</span>
                    <span className="text-[#00C2FF] font-semibold">Deploy Blueprint</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            9. INTEGRATIONS (Infinite Logo Marquee)
           ========================================== */}
        <div className="mb-24 space-y-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block text-center font-bold">CONNECT YOUR CONSOLIDATED TECH NETWORKS</span>
          
          <div className="w-full overflow-hidden relative py-4">
            {/* Infinite Marquee Animation Grid */}
            <div className="flex gap-8 items-center animate-marquee whitespace-nowrap">
              {[
                "Google Workspace", "Zoom", "Stripe", "Razorpay", "WhatsApp", "Shopify", 
                "WooCommerce", "n8n", "Zapier", "HubSpot", "Google Workspace", "Zoom", "Stripe"
              ].map((logo, idx) => (
                <span key={idx} className={`px-4 py-2 rounded-xl border text-xs font-mono font-semibold ${
                  darkMode ? 'bg-[#0E1524] border-white/5 text-gray-400' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  🔌 {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            10. COMPARISON SECTION (Why GrowthOS™ Table)
           ========================================== */}
        <div className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-violet-400 uppercase block font-bold">Unbiased Performance Check</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.definition.title}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.definition.body}</p>
          </div><ArchiveContentGroup page={archivePage} group="needs" />

          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className={`w-full text-xs text-left border-collapse ${darkMode ? 'bg-white/[0.01]' : 'bg-white'}`}>
              <thead>
                <tr className="border-b border-white/5 font-mono text-[10px] uppercase text-gray-500">
                  <th className="p-4">Features</th>
                  <th className="p-4 text-[#00C2FF] font-bold">GrowthOS</th>
                  <th className="p-4">HubSpot</th>
                  <th className="p-4">GoHighLevel</th>
                  <th className="p-4">Salesforce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold">
                {[
                  { feat: "Unlimited Inbound Contacts", values: ["✓ Included", "❌ $200+ Add-on", "✓ Included", "❌ $300+ Add-on"] },
                  { feat: "Official WhatsApp Cloud API Integration", values: ["✓ Native Code", "❌ Requires Zapier", "✓ Native Code", "❌ Custom API Only"] },
                  { feat: "Serverless Edge Landing Pages", values: ["✓ Sub-200ms Load", "❌ Traditional Server", "❌ Traditional Server", "❌ High-weight Pages"] },
                  { feat: "Localized Math CAPTCHA Security", values: ["✓ Built-in", "❌ Enterprise Only", "❌ Requires Add-on", "❌ Enterprise Setup"] },
                  { feat: "Bidirectional HubSpot / GHL Sync", values: ["✓ Native Sync", "❌ N/A", "❌ Custom Setup", "❌ Complex MuleSoft"] },
                  { feat: "Dedicated Indian support teams", values: ["✓ 24/7 Slack", "❌ Email ticket", "❌ Chatbot", "❌ Dedicated rep $2k+"] }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-display text-gray-400">{row.feat}</td>
                    <td className="p-4 text-[#00C2FF] font-bold">{row.values[0]}</td>
                    <td className="p-4 text-gray-500">{row.values[1]}</td>
                    <td className="p-4 text-gray-500">{row.values[2]}</td>
                    <td className="p-4 text-gray-500">{row.values[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            11. PRICING CALCULATOR (Estimate Your ROI)
           ========================================== */}
        <div id="pricing_calculator" className="mb-24 scroll-mt-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase block font-bold">Financial Optimization</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Estimate Your ROI
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Inputs Card */}
            <div className={`lg:col-span-6 p-6 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider font-bold">ADJUST VALUE PARAMETERS</span>
                
                {/* Inputs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Monthly Lead Registrations</span>
                    <span className="font-mono text-[#00C2FF]">{leadsInput} entries</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={leadsInput}
                    onChange={(e) => setLeadsInput(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00C2FF]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Active Team Members</span>
                    <span className="font-mono text-[#00C2FF]">{teamInput} staff</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={teamInput}
                    onChange={(e) => setTeamInput(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00C2FF]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Average Client Deal Value</span>
                    <span className="font-mono text-[#00C2FF]">₹{dealValInput.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={dealValInput}
                    onChange={(e) => setDealValInput(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00C2FF]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Current Administrative Software Cost</span>
                    <span className="font-mono text-[#00C2FF]">₹{softwareCost.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="2500"
                    value={softwareCost}
                    onChange={(e) => setSoftwareCost(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00C2FF]"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-black/25 text-[10px] font-mono text-gray-500 border border-white/5">
                💡 <span className="font-bold text-gray-300">Methodology:</span> Compares standard 4% capture conversion rates with our accelerated 8.5% automated nurture pipeline benchmarks, adding local tool budget optimizations.
              </div>
            </div>

            {/* Right Output Calculations */}
            <div className={`lg:col-span-6 p-8 rounded-2xl border flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
              darkMode ? 'bg-[#0E1524]/80 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">ESTIMATED NET ANNUAL ADVANTAGE</span>

                {/* Main Savings Number */}
                <div className="space-y-1 border-b border-white/5 pb-6">
                  <span className="text-xs text-gray-500 uppercase font-mono">ANNUAL TOTAL REVENUE INCREASE</span>
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400 font-mono">
                    ₹{annualTotalValue.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Sub statistics indicators */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Monthly Cost Savings</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#00C2FF]">₹{monthlyCostSavings.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Nurture Conversion Uplift</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-pink-400">+4.5% Conversion</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-gray-500">
                <span>⚡ Estimates Class: Corporate ROI</span>
                <span className="text-[#00C2FF] font-bold">Payback period: ~30 days</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            12. FLEXIBLE PRICING
           ========================================== */}
        <div className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-[#8B5CF6] uppercase block font-bold">Predictable Operating budgets</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"A practical scope. A team that stays involved."}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[{ name: "Define the scope", price: "Let’s discuss", duration: "agreed scope", popular: false, desc: "We begin with your audience, offer and existing presence. Agreed website, content and tracking foundations come before campaigns that depend on them. Launch and review points follow access, approvals, channel readiness and budget; organic search work needs continuing review.", features: ["An audience, offer and channel plan","Agreed website pages and customer enquiry routes","SEO priorities and approved content assets","Selected campaign creative and launch checks","A tracking, handover and review plan"] },{ name: "Configure and test", price: "Let’s discuss", duration: "agreed scope", popular: true, desc: "We begin with your audience, offer and existing presence. Agreed website, content and tracking foundations come before campaigns that depend on them. Launch and review points follow access, approvals, channel readiness and budget; organic search work needs continuing review.", features: ["An audience, offer and channel plan","Agreed website pages and customer enquiry routes","SEO priorities and approved content assets","Selected campaign creative and launch checks","A tracking, handover and review plan"] },{ name: "Review and refine", price: "Let’s discuss", duration: "agreed scope", popular: false, desc: "We begin with your audience, offer and existing presence. Agreed website, content and tracking foundations come before campaigns that depend on them. Launch and review points follow access, approvals, channel readiness and budget; organic search work needs continuing review.", features: ["An audience, offer and channel plan","Agreed website pages and customer enquiry routes","SEO priorities and approved content assets","Selected campaign creative and launch checks","A tracking, handover and review plan"] }].map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                plan.popular 
                  ? 'border-[#00C2FF] bg-[#00C2FF]/5 shadow-xl shadow-violet-950/20' 
                  : (darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm')
              }`}>
                {plan.popular && (
                  <div className="absolute top-4 right-4 text-[9px] font-mono font-bold bg-[#00C2FF] text-[#0B0721] px-2 py-0.5 rounded-full uppercase">
                    Agreed together
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold font-display">{plan.name}</h3>
                    <p className={`text-xs leading-relaxed mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#00C2FF]">{plan.price}</span>
                    <span className="text-xs text-gray-500">/{plan.duration}</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-white/5 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <a 
                    href="#demo_form"
                    className={`w-full py-2.5 rounded-xl text-center block text-xs font-semibold uppercase transition-all ${
                      plan.popular 
                        ? 'bg-[#00C2FF] text-[#0B0721] hover:bg-[#00c3ffd5] shadow-lg' 
                        : (darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-900 text-white hover:bg-slate-800')
                    }`}
                  >
                    Discuss this scope
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            13. CUSTOMER STORIES (Interactive Carousel Showcase)
           ========================================== */}
        <div className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase block font-bold">Real-World Case studies</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.example.title}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.example.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Story Selectors */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CHOOSE ACTIVE CASE PROFILE</span>
              {clientStories.map((story, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeStoryIdx === idx
                      ? 'border-[#00C2FF] bg-[#00C2FF]/10 shadow-lg scale-[1.01]'
                      : (darkMode ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-slate-200 bg-white hover:bg-slate-50')
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-[#00C2FF] uppercase font-bold">{story.industry}</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">{story.metric}</span>
                  </div>
                  <h4 className="text-xs font-bold font-display truncate">{story.title}</h4>
                </button>
              ))}
            </div>

            {/* Expanded active success cards */}
            <div className={`lg:col-span-8 p-8 rounded-3xl border flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
              darkMode ? 'bg-[#0E1524]/80 border-white/10' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block mb-1">SUCCESS PROFILE DETAIL</span>
                    <h3 className="text-xl font-bold font-display">{clientStories[activeStoryIdx].title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">
                    {clientStories[activeStoryIdx].metric}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  {clientStories[activeStoryIdx].desc}
                </p>

                {/* Client Quotation Block */}
                <div className="p-4 rounded-xl bg-black/25 border-l-4 border-[#00C2FF] border-y border-r border-white/5 text-xs italic text-gray-300">
                  "{clientStories[activeStoryIdx].quote}"
                  <span className="block text-[10px] font-mono not-italic text-gray-500 mt-2 font-bold uppercase">— {clientStories[activeStoryIdx].author}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-gray-500">
                <span>⚡ Case status: verified results</span>
                <span>Active integrations: GHL calendar, WhatsApp APIs</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            14. SIMPLE ONBOARDING PROCESS (Timeline View)
           ========================================== */}
        <div className="mb-24 space-y-12 solution-process-section">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-pink-400 uppercase block font-bold">Frictionless deployment roadmap</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"How we work"}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative solution-process-step-grid">
            {[
{ step: "01", name: "Understand the business", desc: "Clarify your offer, audience, locations, current marketing and the action a useful customer should take. Agree an initial objective and the information needed to evaluate it." },
{ step: "02", name: "Build the right foundation", desc: "Prioritise website clarity, search basics, eligible business profiles and enquiry capture. We can improve existing assets where they remain useful instead of assuming everything needs replacement." },
{ step: "03", name: "Create and connect", desc: "Develop the agreed pages, content and channel activity with a consistent message. Prepare landing pages, forms or conversation entry points for the campaigns in scope." },
{ step: "04", name: "Launch with a clear handover", desc: "Check the customer journey, tracking and team responsibilities. Introduce the agreed campaigns and publishing activity when the business is ready to handle the response." },
{ step: "05", name: "Review and improve", desc: "Review visibility, customer actions and enquiry quality at agreed intervals. Decide together what needs refinement, what should continue and which next investment has a useful role." }
].map((node, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between backdrop-blur-md relative ${
                darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="space-y-4">
                  <span className="text-xl font-extrabold text-[#00C2FF] font-mono block">{node.step}</span>
                  <h4 className="text-xs font-bold font-display">{node.name}</h4>
                  <p className={`text-[10px] leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            15. FREQUENTLY ASKED QUESTIONS (Accordion with Search Filter)
           ========================================== */}
        <div id="faq" className="mb-24 scroll-mt-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-[#00C2FF] uppercase block font-bold">Support & Knowledge Center</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Frequently Asked Questions"}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Find answers to core structural, technical, and operational questions regarding GrowthOS™ integrations.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-xl border transition-all ${
                    isOpen 
                      ? 'border-[#00C2FF] bg-[#00C2FF]/5 shadow-md' 
                      : (darkMode ? 'border-white/5 bg-white/[0.01]' : 'bg-white border-slate-200')
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                  >
                    <span className="text-xs font-bold font-display">{faq.q}</span>
                    <span className="text-[#00C2FF] font-bold">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className={`p-5 pt-0 text-xs border-t border-white/5 leading-relaxed ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            16. DEMO FORM (GHL + Webhook Captcha Protected Form)
           ========================================== */}
        <div id="demo_form" className="mb-24 scroll-mt-12">
          <div className="max-w-2xl mx-auto">
            <div className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden backdrop-blur-md ${
              darkMode ? 'bg-[#0E1524]/80 border-white/10 shadow-violet-950/20' : 'bg-white border-slate-200 shadow-2xl'
            }`}>
              <div className="absolute top-0 right-0 h-48 w-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold font-display">Live Demo Scheduled!</h3>
                  <p className={`text-xs max-w-sm mx-auto leading-relaxed ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    An expert automation architect has been alerted. We are pre-reviewing your GHL & HubSpot parameters and will schedule intake calls shortly.
                  </p>
                </div>
              ) : (
                <ContactFormLink setPath={setPath} darkMode={darkMode} />
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            17. FINAL CTA
           ========================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-905 to-slate-900 text-white text-center space-y-6 relative overflow-hidden border border-violet-500/20 shadow-2xl">
          <div className="absolute top-0 left-0 h-48 w-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 right-0 h-48 w-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <span className="text-[10px] font-mono text-violet-400 tracking-widest uppercase block font-bold">Deploy Your Operational Core</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">{"Let’s make the next step clearer."}</h2>
          <p className="text-xs sm:text-sm max-w-xl mx-auto opacity-80 leading-relaxed">{"Tell us about your priorities, the people you want to reach and where the process needs attention."}</p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a 
              href="#demo_form" 
              className="px-6 py-2.5 bg-[#00C2FF] text-[#0B0721] hover:bg-[#00c3ffd5] text-xs font-bold uppercase rounded-xl shadow-lg transition-all"
            >
              Book Live Demo
            </a>
            <a 
              href="#pricing_calculator" 
              className="px-6 py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase rounded-xl transition-all"
            >
              Estimate Your ROI
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
