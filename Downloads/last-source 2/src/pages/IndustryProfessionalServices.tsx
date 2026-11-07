import './industry-process-layout.css';
import './professional-services-readability.css';
import archivePage from '../content/ten-pages/professional-services.json';
import {ArchiveHeroBackground,ArchiveContentGroup,ArchiveFAQ} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Briefcase, TrendingUp, Search, CheckCircle, ArrowRight, Play, Zap, Star, MessageSquare, Users, Globe, 
  ChevronRight, Check, HelpCircle, ChevronDown, ChevronUp, Send, Sliders, DollarSign, Plus, RefreshCw, Clock, Phone, 
  Shield, Lock, X, Activity, Database, Mail, FileText, CheckCheck, Settings, ArrowUpRight, BarChart3, PieChart, 
  Share2, History, Network, Calendar, Award, Heart, Gift, MessageCircle, FileCheck, Layers, BookOpen, Fingerprint
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function IndustryProfessionalServices({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // PREMIUM BUSINESS NETWORK CANVAS BACKGROUND (Navy, Silver, Violet)
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener('resize', handleResize);

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; label: string; pulse: number; type: 'crm' | 'ai' | 'calendar' | 'proposal' | 'node' }> = [];
    const labels = ['GrowthOS™ CRM', 'Lead Agent', 'Scheduling Engine', 'Proposal Bot', 'Stripe Gateway'];
    const types: ('crm' | 'ai' | 'calendar' | 'proposal' | 'node')[] = ['crm', 'ai', 'calendar', 'proposal', 'node'];

    for (let i = 0; i < 18; i++) {
      const isCore = i < 5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        label: isCore ? labels[i] : `Terminal_Sec_${400 + i}`,
        pulse: Math.random() * Math.PI,
        type: isCore ? types[i] : 'node'
      });
    }

    const packets: Array<{ from: number; to: number; progress: number; speed: number; color: string }> = [];
    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const from = Math.floor(Math.random() * nodes.length);
      let to = (from + 1) % nodes.length;
      let minDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        if (i === from) continue;
        const d = Math.hypot(nodes[from].x - nodes[i].x, nodes[from].y - nodes[i].y);
        if (d < minDist && d < 260) {
          minDist = d;
          to = i;
        }
      }
      packets.push({
        from,
        to,
        progress: 0,
        speed: 0.003 + Math.random() * 0.006,
        color: Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6' // Violet or Navy Blue
      });
    };

    for (let i = 0; i < 8; i++) spawnPacket();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Delicate silver background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 90;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Render links
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 240) {
            const alpha = (1 - d / 240) * 0.1;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Render flowing packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packets.splice(i, 1);
          if (packets.length < 12) spawnPacket();
          continue;
        }
        const start = nodes[p.from];
        const end = nodes[p.to];
        if (start && end) {
          const px = start.x + (end.x - start.x) * p.progress;
          const py = start.y + (end.y - start.y) * p.progress;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Render nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += 0.015;
        const pulseSize = Math.sin(n.pulse) * 3;
        const isCore = labels.includes(n.label);

        ctx.fillStyle = n.type === 'ai' ? '#8b5cf6' : (n.type === 'crm' ? '#3b82f6' : '#64748b');
        ctx.beginPath();
        ctx.arc(n.x, n.y, isCore ? 5.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = n.type === 'ai' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.25)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, (isCore ? 10 : 6) + pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        if (isCore && width > 640) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '500 9px monospace';
          ctx.fillText(n.label, n.x + 14, n.y + 3);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==========================================
  // DATA AND SECTIONS
  // ==========================================
  const segments = [
{ title: "Consultancies, advisory businesses and specialist service firms", desc: "Bring a clear service story, useful content and organised enquiry follow-up together. Natton Digital helps professional-services businesses explain their value and connect prospective clients with the right next conversation." },
{ title: "Agencies and growing B2B service companies", desc: "Bring a clear service story, useful content and organised enquiry follow-up together. Natton Digital helps professional-services businesses explain their value and connect prospective clients with the right next conversation." },
{ title: "Owner-led professional-services MSMEs and SMBs", desc: "Bring a clear service story, useful content and organised enquiry follow-up together. Natton Digital helps professional-services businesses explain their value and connect prospective clients with the right next conversation." },
{ title: "Teams coordinating enquiries, proposals and client onboarding", desc: "Bring a clear service story, useful content and organised enquiry follow-up together. Natton Digital helps professional-services businesses explain their value and connect prospective clients with the right next conversation." }
];

  const painPoints = [
{ title: "The expertise is strong, but the offer is difficult to understand.", desc: "Prospective clients need to know who you help, which problems you address and what an appropriate first engagement looks like.", solution: "Prospective clients need to know who you help, which problems you address and what an appropriate first engagement looks like." },
{ title: "The website says a lot without answering the buyer’s questions.", desc: "Clear service pages, relevant examples and an explanation of your process can help a visitor decide whether to enquire.", solution: "Clear service pages, relevant examples and an explanation of your process can help a visitor decide whether to enquire." },
{ title: "New enquiries depend on one person remembering everything.", desc: "Introduce a practical record of the request, its owner and the next step so an interested prospect receives a coherent response.", solution: "Introduce a practical record of the request, its owner and the next step so an interested prospect receives a coherent response." },
{ title: "Marketing and delivery are disconnected.", desc: "Use the questions, objections and learning from the team to improve the content and the handover into proposals or onboarding.", solution: "Use the questions, objections and learning from the team to improve the content and the handover into proposals or onboarding." }
];

  // BLUEPRINT FUNNEL (10 Steps)
  const [activeBlueprintStep, setActiveBlueprintStep] = useState(0);
  const blueprintSteps = [
{ name: "Understand the firm and its buyers", val: "Agreed scope", desc: "Review the services, ideal client situations, decision makers, enquiry sources and delivery capacity. Identify the approvals and professional restrictions that influence public content and outreach." },
{ name: "Clarify the offer and its evidence", val: "Agreed scope", desc: "Agree how to describe the service, scope and working approach. Prepare relevant credentials, approved examples and answers to recurring questions. Confidential or restricted client information stays out of public material." },
{ name: "Build the right discovery routes", val: "Agreed scope", desc: "Improve the website and selected search or content channels around that offer. Consider campaigns only where the channel, budget and professional rules support the proposed activity." },
{ name: "Connect the enquiry to a useful conversation", val: "Agreed scope", desc: "Agree the information to request, the person responsible and the response path. Test records, appointment requests and handovers before introducing automated follow-up." },
{ name: "Review the quality of the journey", val: "Agreed scope", desc: "Review relevant enquiries, qualified conversations and available proposal-stage information with the team. Improve content, qualification and ownership as patterns emerge; do not optimise only for a larger number of unqualified form fills." }
];

  // AI GROWTH MARKETING
  const [mktTab, setMktTab] = useState<'google' | 'linkedin' | 'seo'>('google');
  const marketingData = {
    google: {
      clicks: '3,840',
      cac: '₹220',
      roas: '5.4x',
      leads: [
        { source: 'Consulting Intent', budget: '₹60,000', conversions: '18%', cpa: '₹340' },
        { source: 'Corporate Law Query', budget: '₹40,000', conversions: '14%', cpa: '₹290' },
        { source: 'D2C Agency Scale', budget: '₹50,000', conversions: '22%', cpa: '₹210' }
      ]
    },
    linkedin: {
      clicks: '1,420',
      cac: '₹410',
      roas: '4.8x',
      leads: [
        { source: 'Enterprise Advisory', budget: '₹80,000', conversions: '11%', cpa: '₹720' },
        { source: 'CA Advisory Mumbai', budget: '₹35,000', conversions: '15%', cpa: '₹460' },
        { source: 'Real Estate Architecture', budget: '₹45,000', conversions: '16%', cpa: '₹510' }
      ]
    },
    seo: {
      clicks: '8,900',
      cac: 'Organic',
      roas: 'Infinite',
      leads: [
        { source: 'AI Consulting India', budget: 'Organic SEO', conversions: '28%', cpa: 'Free' },
        { source: 'CA Onboarding Checklist', budget: 'Organic SEO', conversions: '31%', cpa: 'Free' },
        { source: 'Law Firm Retainer Costs', budget: 'Organic SEO', conversions: '24%', cpa: 'Free' }
      ]
    }
  };

  // AGENTICOS™ Cards
  const [activeAgent, setActiveAgent] = useState('qualification');
  const agenticOsCards = [
{ id: 'qualification', name: "A website built around your expertise", desc: "Organise service pages, audience information, team credentials and contact routes around the questions buyers ask. Explain the scope and working approach in plain language, using only substantiated claims and permitted evidence." },
{ id: 'appointment', name: "SEO for relevant service enquiries", desc: "Research the topics, service terms and locations that fit your actual practice. Develop useful service and insight pages, internal links and technical improvements. Assess local-profile eligibility where the business meets customers in person." },
{ id: 'proposal', name: "Thoughtful content & professional visibility", desc: "Turn approved expertise into articles, explainers, case material and social content that answers buyer questions. Select channels such as LinkedIn where the audience is relevant and the proposed communication is permitted for the profession." },
{ id: 'support', name: "Focused campaigns where appropriate", desc: "Assess paid search or professional-audience campaigns against the offer, buying process, budget and applicable rules. Connect each campaign to a relevant page and enquiry route. Regulated professions require their own review before promotional activity is approved." },
{ id: 'knowledge', name: "Enquiries, appointments & CRM follow-up", desc: "Define how an enquiry is captured, assigned and prepared for a consultation or discovery call. Configure agreed CRM records, reminders and handovers so the team has the context for a useful conversation." },
{ id: 'executive', name: "Proposal & onboarding coordination", desc: "Connect approved templates, task assignments and status updates around your existing process. AI can assist with a draft or a summary where suitable; the firm reviews scope, fees and commitments. Invoice-event notifications can be assessed without presenting the workflow as an accounting system." }
];

  // APPOINTMENT AUTOMATION (Stateful Calendar)
  const [selectedDay, setSelectedDay] = useState(14);
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [bookedState, setBookedState] = useState(false);
  const availableSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  // KNOWLEDGE BASE (Interactive doc search)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const handleDocSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const lower = searchQuery.toLowerCase();
    if (lower.includes('invoice') || lower.includes('billing')) {
      setSearchResult('Found in SOP_Billing_v2.pdf: Standard retainers are billed on the 1st of every month via Stripe Auto-pay, with a grace period of 5 calendar days.');
    } else if (lower.includes('agreement') || lower.includes('contract')) {
      setSearchResult('Found in Law_Agreement_Template.docx: Standard intellectual property clause transfers full ownership to the client upon receipt of the final project milestone payment.');
    } else if (lower.includes('onboard')) {
      setSearchResult('Found in SOP_Onboarding_Agency.pdf: Trigger Slack invite, share Google Drive parent directory, and register contact on GoHighLevel pipeline on Stripe payment confirmed.');
    } else {
      setSearchResult('No local document matched. Querying RAG vector database... Standard professional services parameters retrieved from general onboarding logs.');
    }
  };

  // AUTOMATION WORKFLOWS (React Flow Visual representation)
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);
  const workflowsList = [
{ name: "Understand the firm and its buyers", steps: ["A buyer reads a relevant service page","They send an enquiry with useful context","The appropriate team member reviews and responds","An agreed proposal or onboarding step is recorded"] },
{ name: "Clarify the offer and its evidence", steps: ["A buyer reads a relevant service page","They send an enquiry with useful context","The appropriate team member reviews and responds","An agreed proposal or onboarding step is recorded"] },
{ name: "Build the right discovery routes", steps: ["A buyer reads a relevant service page","They send an enquiry with useful context","The appropriate team member reviews and responds","An agreed proposal or onboarding step is recorded"] },
{ name: "Connect the enquiry to a useful conversation", steps: ["A buyer reads a relevant service page","They send an enquiry with useful context","The appropriate team member reviews and responds","An agreed proposal or onboarding step is recorded"] },
{ name: "Review the quality of the journey", steps: ["A buyer reads a relevant service page","They send an enquiry with useful context","The appropriate team member reviews and responds","An agreed proposal or onboarding step is recorded"] }
];

  // REVENUE INTELLIGENCE DASHBOARD (Active metric switcher)
  const [activeDashboardTab, setActiveDashboardTab] = useState<'leads' | 'appointments' | 'proposals' | 'revenue'>('leads');
  const dashboardStats = {
    leads: { val: '1,482', pct: '+28.4%', desc: 'Inbound high-value professional leads tracked and qualified.', points: [110, 150, 130, 180, 240, 290] },
    appointments: { val: '412', pct: '+34.2%', desc: 'Confirmed expert discovery meetings scheduled automatically.', points: [60, 85, 75, 110, 140, 175] },
    proposals: { val: '184', pct: '+41.8%', desc: 'Customized client proposals generated, sent, and signed.', points: [20, 42, 38, 55, 72, 92] },
    revenue: { val: '₹34,80,000', pct: '+22.6%', desc: 'Monthly recurring contract values managed and tracked.', points: [150, 210, 190, 260, 310, 348] }
  };

  // ROI CALCULATOR
  const [monthlyLeads, setMonthlyLeads] = useState(300);
  const [projectVal, setProjectVal] = useState(150000); // ₹1.5 Lakh avg project
  const [currentConv, setCurrentConv] = useState(4); // 4% conversion
  const [teamSize, setTeamSize] = useState(6);

  // ROI calculations
  const currentDeals = Math.round(monthlyLeads * (currentConv / 100));
  const currentRevenue = currentDeals * projectVal;

  // Natton Digital optimizations boost conversions by ~2.5x (capped at 15%)
  const optimizedConv = Math.min(15, currentConv * 2.2);
  const expectedDeals = Math.round(monthlyLeads * (optimizedConv / 100));
  const expectedRevenue = expectedDeals * projectVal;
  const addedRevenue = expectedRevenue - currentRevenue;

  // Time saved estimation: 15 hours saved per team member per week
  const monthlyHoursSaved = teamSize * 15 * 4;
  const financialProductivityGain = monthlyHoursSaved * 1200; // Valued at ₹1,200/hr

  const totalMonthlyGain = addedRevenue + financialProductivityGain;

  // CASE STUDIES CAROUSEL
  const [caseIdx, setCaseIdx] = useState(0);
  const successCases = [
{
      segment: "Professional Services — illustrative example",
      name: "A buyer reads a relevant service page",
      metric: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      impact: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      results: [
        { title: 'Inbound Qualified Leads', before: '42/mo', after: '118/mo' },
        { title: 'No-Show Rate', before: '32%', after: '4%' },
        { title: 'Monthly Revenue Increase', before: '₹8.5 Lakh', after: '₹24.8 Lakh' }
      ]
    },
{
      segment: "Professional Services — illustrative example",
      name: "They send an enquiry with useful context",
      metric: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      impact: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      results: [
        { title: 'Tax Onboarding speed', before: '14 days', after: '2 days' },
        { title: 'Internal Admin Staff Hours', before: '180h/mo', after: '40h/mo' },
        { title: 'Active Retainers Managed', before: '45 clients', after: '110 clients' }
      ]
    },
{
      segment: "Professional Services — illustrative example",
      name: "The appropriate team member reviews and responds",
      metric: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      impact: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      results: [
        { title: 'Contract Prep Duration', before: '48 hours', after: '3 minutes' },
        { title: 'Client Win Conversions', before: '14%', after: '42%' },
        { title: 'Attributed Revenue Growth', before: '—', after: '₹14.2 Lakh/mo' }
      ]
    },
{
      segment: "Professional Services — illustrative example",
      name: "An agreed proposal or onboarding step is recorded",
      metric: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      impact: "The firm retains responsibility for advice, professional judgement, approvals and client commitments. This is an illustrative coordination flow, not a claim of a live deployment.",
      results: [
        { title: 'Ad Conversion Rate', before: '1.8%', after: '4.8%' },
        { title: 'Time to First Response', before: '6 hours', after: '42 seconds' },
        { title: 'Average Invoice Value', before: '₹1.8 Lakh', after: '₹3.2 Lakh' }
      ]
    }
];

  // FAQ LIST (15 items)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqs = [
{ q: "Which professional-services businesses is this relevant to?", a: "It can be relevant to consultancies, agencies, advisory businesses and specialist service firms whose clients need to understand expertise before making an enquiry. We assess the audience and buying process first. Accountancy, legal and other regulated practices need a profession-specific content and promotion review rather than a generic campaign package." },
{ q: "Can you help us explain a complex service clearly?", a: "Yes. We work with your subject experts to organise the service around the client’s situation, the questions they ask and the scope you can deliver. You approve the technical and professional substance. The aim is a useful explanation and a clear next conversation, with appropriate detail available for buyers who need it." },
{ q: "Will you use our clients, testimonials and case studies in marketing?", a: "Only when the evidence is genuine, the business has permission and the intended use is appropriate for its profession. Some practices have restrictions on these formats. We can also use anonymised process explanations or clearly labelled illustrative examples where suitable, without inventing results, endorsements or client relationships." },
{ q: "Do we need paid advertising or can we start with the website and content?", a: "The starting scope depends on your audience, existing visibility, offer and business priorities. A clearer website and useful content may be the first priority. Paid campaigns are considered separately for relevance, budget and applicable professional restrictions. No channel is mandatory simply because it is available." },
{ q: "Can AI automatically prepare proposals and quote our fees?", a: "AI may support an approved draft or summary within a defined workflow. A responsible person should review the proposed work, fees, exclusions and commitments before anything is shared with a prospective client. We scope the sources, permissions and approval steps; we do not present autonomous quoting as a default capability." },
{ q: "How do you measure success for a long sales cycle?", a: "We agree useful intermediate signals such as relevant enquiries, qualified conversations, response ownership and available proposal progress. Those are reviewed with the firm’s sales context and eventual outcomes where the data is available. Marketing attribution is explained with its limits, and no enquiry count is treated as a guaranteed client engagement." }
];

  // LEAD CONSULTATION FORM STATE
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formType, setFormType] = useState('Consultant');
  const [formCountry, setFormCountry] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLeads, setFormLeads] = useState('10 - 50');
  const [formChallenges, setFormChallenges] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [captchaVal, setCaptchaVal] = useState('');
  const [captchaNums, setCaptchaNums] = useState({ num1: 4, num2: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    setCaptchaNums({
      num1: Math.floor(Math.random() * 8) + 2,
      num2: Math.floor(Math.random() * 8) + 2
    });
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaVal) !== (captchaNums.num1 + captchaNums.num2)) {
      alert('Verification captcha code is incorrect. Please compute again.');
      return;
    }
    setIsSubmitting(true);
    setTerminalLogs([
      '⚡ Intercepting Professional Services lead payload...',
      '📡 Mapping parameters to GoHighLevel API registers...',
      '🔗 Routing n8n webhook node pipeline...',
      '📦 Provisioning GrowthOS target records...'
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '📊 Synchronization verified. Recorded CRM Lead ID: GHL_PROF_7290',
        '💬 Automated welcome case-study packet scheduled.'
      ]);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
    }, 1800);
  };

  return (
    <div className={`industry-professional-services-page min-h-screen py-8 overflow-hidden relative selection:bg-purple-600 selection:text-white transition-colors duration-500 ${darkMode ? 'bg-[#040614] text-slate-200' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Dynamic radial atmosphere blur backgrounds - Navy, Silver, Violet */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] left-0 w-[600px] h-[600px] bg-purple-950/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-5 right-20 w-[650px] h-[650px] bg-slate-900/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 text-xs font-mono text-slate-500 flex items-center gap-1.5 border-b border-slate-900 pb-4">
          <button onClick={() => setPath('home')} className="hover:text-purple-400 transition-colors">Home</button> 
          <span>/</span> 
          <a className="text-slate-400" href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');}}>Industries</a> 
          <span>/</span> 
          <span className="text-[#8b5cf6] font-semibold font-mono">Professional Services</span>
        </div>

        {/* ==========================================
            HERO SECTION
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 relative min-h-[580px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden -z-20 border border-blue-950/40 bg-slate-950/70">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-95" />
          </div>

          <div className="archive-hero-copy lg:col-span-7 space-y-6 z-10 p-6 sm:p-10 text-left">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight text-white">{"Make your"} <br />
<span className="bg-gradient-to-r from-blue-400 via-violet-300 to-slate-400 bg-clip-text text-transparent">{"expertise easier to choose."}</span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#lead_form" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-extrabold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4 text-white" />
              </a>
              <a 
                href="#blueprint" 
                className="px-6 py-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-blue-400 transition-all flex items-center gap-2 text-sm font-semibold text-slate-300"
              >
                Explore Growth Blueprint
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-slate-500 border-t border-slate-900">
              <span className="flex items-center gap-1.5 text-blue-400">{"Useful information"}</span>
              <span className="flex items-center gap-1.5 text-purple-400">{"A clearer customer journey"}</span>
              <span className="flex items-center gap-1.5 text-slate-400">{"People before platforms"}</span>
            </div>
          </div>

          {/* Interactive 3D Business Ecosystem HUD */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            SEGMENTS Section: "Solutions Built For"
           ========================================== */}
        <div id="segments" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Solutions Built For</span>
            <h2 className="text-3xl font-bold font-display text-white">{"Who this can help"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {segments.map((seg, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-blue-950/30 bg-blue-950/5 hover:border-blue-500/30 transition-all hover:translate-y-[-2px] flex flex-col justify-between group">
                <div>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-500/20">
                    <Briefcase className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1.5 font-display">{seg.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{seg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            PAIN POINTS Section: "Challenges We Solve"
           ========================================== */}
        <div id="pain_points" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest font-bold">Friction Points</span>
            <h2 className="text-3xl font-bold font-display text-white">{"Recognise the gaps. Choose the right priority."}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"We begin with the business problem, then agree the work that will help address it."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {painPoints.map((p, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-blue-950/30 bg-slate-950/30 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 h-1 w-0 bg-blue-500 transition-all group-hover:w-full" />
                <div>
                  <h3 className="text-xs font-bold text-slate-200 mb-3 border-b border-blue-950/20 pb-1.5 flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {p.title}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] font-mono text-rose-400 uppercase tracking-wider block">Symptom</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider block">Natton Resolution</span>
                      <p className="text-[10px] text-slate-300 mt-0.5 font-medium leading-relaxed">{p.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            GROWTH BLUEPRINT (INTERACTIVE FUNNEL)
           ========================================== */}
        <div id="blueprint" className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Integrated Funnel</span>
            <h2 className="text-3xl font-bold font-display text-white">{"How we work"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-1.5">
              {blueprintSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBlueprintStep(idx)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    activeBlueprintStep === idx 
                      ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold font-mono">{step.name}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${activeBlueprintStep === idx ? 'bg-blue-500 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}>
                    {step.val}
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[250px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase font-bold">PIPELINE NODE ACTION</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> STEP {activeBlueprintStep + 1} OF {blueprintSteps.length}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-white">
                    {blueprintSteps[activeBlueprintStep].name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {blueprintSteps[activeBlueprintStep].desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-900/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Database Sync Status</span>
                <span className="text-blue-400 font-semibold">Active HubSpot/CRM Pipeline Feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            AI GROWTH MARKETING & REVENUE DASHBOARD
           ========================================== */}
        <div id="ai_growth_marketing" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">01 / Lead Capture Suite</span>
            <h2 className="text-3xl font-bold font-display text-white font-sans">Client Acquisition Engine</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{archivePage.services[2].description}</p>

            <div className="grid grid-cols-2 gap-3">
              {['Professional Websites', 'SEO & AEO Opt', 'Google Search Ads', 'LinkedIn Ads', 'Content Marketing', 'Social Media'].map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-1 bg-gradient-to-r from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-6">
              
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" /> Active Lead Acquisition Monitor
                  </h3>
                  <p className="text-[10px] text-slate-400">Simulating live CPC performance indicators</p>
                </div>
                
                <div className="flex gap-1.5">
                  {(['google', 'linkedin', 'seo'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMktTab(tab)}
                      className={`px-3 py-1 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                        mktTab === tab 
                          ? 'bg-blue-600 text-white font-bold' 
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* metrics bar */}
              <div className="grid grid-cols-3 gap-4 text-left">
                <div className="p-3 rounded-lg bg-blue-950/5 border border-blue-950/25">
                  <span className="text-[9px] font-mono text-slate-400 block">Total Monthly Visits</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{marketingData[mktTab].clicks}</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-950/5 border border-blue-950/25">
                  <span className="text-[9px] font-mono text-slate-400 block">Average CAC cost</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{marketingData[mktTab].cac}</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-950/5 border border-blue-950/25">
                  <span className="text-[9px] font-mono text-slate-400 block">Ad-Spend ROAS</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{marketingData[mktTab].roas}</span>
                </div>
              </div>

              {/* active campaigns logs */}
              <div className="space-y-3 text-left">
                <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Acquisition Channels Performance</h4>
                <div className="space-y-2">
                  {marketingData[mktTab].leads.map((lead, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-900 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">{lead.source}</span>
                      <div className="flex gap-6 text-right">
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase">Budget</span>
                          <span className="text-slate-300">{lead.budget}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase">Conv. %</span>
                          <span className="text-emerald-400 font-semibold">{lead.conversions}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase">CPA Cost</span>
                          <span className="text-blue-400">{lead.cpa}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            GROWTHOS™ FOR PROFESSIONAL SERVICES
           ========================================== */}
        <div id="growthos" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 order-last lg:order-first p-1 bg-gradient-to-l from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                <span className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1.5 font-bold">
                  <Database className="h-4 w-4" /> GrowthOS™ CRM Pipelines
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">SYNC OK</span>
              </div>

              {/* CRM Lead table simulation */}
              <div className="space-y-2 text-xs font-mono">
                <div className="grid grid-cols-4 text-[9px] text-slate-500 pb-1.5 border-b border-slate-900 uppercase">
                  <span>Client Name</span>
                  <span>Business Type</span>
                  <span>Pipeline Status</span>
                  <span className="text-right">Project Value</span>
                </div>
                
                <div className="grid grid-cols-4 py-2 border-b border-slate-900/40 items-center">
                  <span className="text-white font-semibold truncate">Alok K. Sharma</span>
                  <span className="text-slate-400">CA Firm Mumbai</span>
                  <span><span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[9px] font-bold">Discovery Booked</span></span>
                  <span className="text-right text-slate-300">₹1,80,000</span>
                </div>

                <div className="grid grid-cols-4 py-2 border-b border-slate-900/40 items-center">
                  <span className="text-white font-semibold truncate">Nandita Sen</span>
                  <span className="text-slate-400">Architect Delhi</span>
                  <span><span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[9px] font-bold">Proposal Sent</span></span>
                  <span className="text-right text-slate-300">₹3,50,000</span>
                </div>

                <div className="grid grid-cols-4 py-2 border-b border-slate-900/40 items-center">
                  <span className="text-white font-semibold truncate">Rahul Mehta</span>
                  <span className="text-slate-400">Digital Agency</span>
                  <span><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-bold">Contract Signed</span></span>
                  <span className="text-right text-slate-300">₹2,40,000</span>
                </div>

                <div className="grid grid-cols-4 py-2 items-center">
                  <span className="text-white font-semibold truncate">Priya Chawla</span>
                  <span className="text-slate-400">Law Retainer</span>
                  <span><span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[9px] font-bold">Intake Pending</span></span>
                  <span className="text-right text-slate-300">₹1,20,000</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/10 rounded-lg border border-blue-950/20 text-[10px] text-slate-400 flex justify-between items-center">
                <span>Active Scheduling Engine Sync</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">● Synchronized</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest block font-bold">02 / CRM Portal</span>
            <h2 className="text-3xl font-bold font-display text-white">GrowthOS™ For Professional Services</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{archivePage.services[0].description}</p>

            <div className="space-y-3">
              {['Corporate Lead CRM & Contact Profiles', 'Visual Stage Pipeline Dashboards', 'Calendar Blockout Sync Scheduling', 'Draft Contract Stage Tracking Logs', 'Integrated Retainer Analytics Engine'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            BUSINESSOS™ COMMUNICATION PLATFORM
           ========================================== */}
        <div id="businessos" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">03 / Omnichannel Inbox</span>
            <h2 className="text-3xl font-bold font-display text-white">BusinessOS™ Communication Platform</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{archivePage.services[4].description}</p>

            <div className="space-y-3">
              {['WhatsApp API template campaign broadcasts', 'Cloud VoIP integrations with secure recordings', 'AI Calling bots qualifying prospects 24/7', 'Live website chat widgets routing hot queries', 'Unified team dashboard for customer support'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-1 bg-gradient-to-r from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                <span className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1.5 font-bold">
                  <MessageSquare className="h-4 w-4" /> Omnichannel Inbox Hub
                </span>
                <span className="text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono font-bold">LIVE AGENT CONNECT</span>
              </div>

              {/* Chat threads simulation */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-blue-950/10 border border-blue-950/25 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-blue-400 font-bold">Alok K. Sharma (WhatsApp)</span>
                    <span>10:42 AM</span>
                  </div>
                  <p className="text-slate-200">"Hey, is it possible to schedule the consultant call for this Thursday at 11 AM?"</p>
                  <p className="text-emerald-400 font-mono text-[9px] italic">Reply: Autologged to GrowthOS Calendar scheduler node.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-900/50 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-purple-400 font-bold">Nandita Sen (Email Retainer)</span>
                    <span>09:15 AM</span>
                  </div>
                  <p className="text-slate-300">"I have finished signing the custom onboarding checklist document. Looking forward to project launch."</p>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-900/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Integrated VoIP: Active</span>
                <span className="text-emerald-400 font-bold">Cloud Telephony Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            AGENTICOS™ FOR PROFESSIONAL SERVICES
           ========================================== */}
        <div id="agenticos" className="mb-28 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest font-bold">AgenticOS™ Core</span>
            <h2 className="text-3xl font-bold font-display text-white">Autonomous Agentic Operations</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-2">
              {agenticOsCards.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    activeAgent === agent.id 
                      ? 'border-[#8b5cf6] bg-purple-500/5 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <h3 className="text-xs font-bold font-mono uppercase mb-1">{agent.name}</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed truncate">{agent.desc}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-purple-900/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase font-bold">AGENT PROFILE & TASK DIRECTIVE</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> OPERATIONAL
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold font-display text-white">
                    {agenticOsCards.find(a => a.id === activeAgent)?.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {agenticOsCards.find(a => a.id === activeAgent)?.desc}
                  </p>
                  
                  <div className="p-3 bg-purple-950/10 rounded-lg border border-purple-950/20 text-[10px] font-mono">
                    <span className="text-purple-400 block uppercase font-bold mb-1">Standard Node Trigger:</span>
                    <span className="text-slate-400">ON_LEAD_INGESTION -{'>'} qualify_metadata_parameters() AND match_advisor_calendars()</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-900/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>RAG Architecture Link</span>
                <span className="text-[#8b5cf6] font-bold">Autonomous Agent Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            APPOINTMENT AUTOMATION (Stateful Calendar)
           ========================================== */}
        <div id="appointment_automation" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">04 / Scheduling Optimization</span>
            <h2 className="text-3xl font-bold font-display text-white">Appointment Automation</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{archivePage.example.note}</p>

            <div className="space-y-3.5">
              {[
                { title: 'Calendar Syncing', desc: 'Direct Outlook and Google Calendar scheduling blocks.' },
                { title: 'Intelligent Reminder Rails', desc: 'Auto-schedules voice or text alerts 24h & 1h prior to meeting.' },
                { title: '1-Click Rescheduling', desc: 'Instantly lets clients modify sessions with zero manual friction.' }
              ].map((f, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-display">
                    <CheckCircle className="h-4 w-4 text-blue-400" /> {f.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 pl-5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-1 bg-gradient-to-r from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                <span className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1.5 font-bold">
                  <Calendar className="h-4 w-4" /> Live Scheduling Calendar
                </span>
                <span className="text-[9px] text-[#00c2ff] font-mono font-bold">ACTIVE SCHEDULE FEED</span>
              </div>

              {/* Stateful interactive calendar selector */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Select Available Date (June 2026)</span>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i} className="text-slate-600 font-bold py-1">{d}</span>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => {
                      const day = i + 1;
                      const isAvailable = day % 3 === 0 || day % 4 === 0;
                      return (
                        <button
                          key={i}
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedDay(day);
                            setBookedState(false);
                          }}
                          className={`py-1.5 rounded transition-all font-bold ${
                            !isAvailable 
                              ? 'text-slate-800 cursor-not-allowed' 
                              : selectedDay === day 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-5 space-y-3">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Available Slots</span>
                  <div className="space-y-1.5">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setBookedState(false);
                        }}
                        className={`w-full py-2 rounded text-[10px] font-mono font-bold border transition-all ${
                          selectedTime === time 
                            ? 'border-blue-500 bg-blue-500/10 text-white' 
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setBookedState(true)}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

              {bookedState && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold font-mono animate-fade-in">
                  ✓ Consultation Slot Secured for June {selectedDay} at {selectedTime}! Dynamic reminder triggers have been initialized.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            PROPOSAL & CLIENT ONBOARDING AUTOMATION
           ========================================== */}
        <div id="proposal_automation" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 p-1 bg-gradient-to-l from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                <span className="text-[10px] font-mono uppercase text-[#8b5cf6] flex items-center gap-1.5 font-bold">
                  <FileCheck className="h-4 w-4" /> Smart Proposal Engine
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">COMPILED OK</span>
              </div>

              {/* Proposal document preview */}
              <div className="p-4 rounded-lg bg-slate-950 border border-blue-950/20 text-[11px] font-mono space-y-3">
                <div className="flex justify-between text-[9px] text-slate-500 pb-1.5 border-b border-slate-900">
                  <span>DOCUMENT REF: PROPOSAL_NATT_920</span>
                  <span>STATUS: READY FOR SIGNATURE</span>
                </div>
                
                <p className="text-white font-bold text-xs uppercase">SERVICE AGREEMENT & RETAINER TERMS</p>
                <div className="space-y-1.5 text-slate-400 leading-relaxed">
                  <p>1. <strong className="text-slate-300">Scope of Work:</strong> Configuration of GrowthOS™ CRM Pipelines, WhatsApp communication templates, and interactive client calendar schedulers.</p>
                  <p>2. <strong className="text-slate-300">Retainer Terms:</strong> Monthly retainer billing of ₹1,50,000 via automated Stripe registers on the 1st of every month.</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold pt-2 border-t border-slate-900">
                  <Fingerprint className="h-4 w-4" /> Digital Signature verified via TLS 1.3 encryption keys.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest block font-bold">05 / Proposal Automation</span>
            <h2 className="text-3xl font-bold font-display text-white">Proposal & Client Onboarding Automation</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-generate customized service agreements and digital signature links instantly post-discovery call. Confirm contract logs automatically, triggering n8n checklists that configure client workspaces.
            </p>

            <div className="space-y-3.5">
              {[
                { title: 'Dynamic Doc Synthesis', desc: 'Auto-compiles verified templates with your pricing structures.' },
                { title: 'Automated Stripe Invoicing', desc: 'Dispatches recurring billing agreements connected to the proposal.' },
                { title: 'Frictionless Client Onboarding', desc: 'Fires n8n checklist nodes that trigger Slack invites and drive shares.' }
              ].map((f, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-display">
                    <CheckCircle className="h-4 w-4 text-[#8b5cf6]" /> {f.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 pl-5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            KNOWLEDGE BASE AI ASSISTANT
           ========================================== */}
        <div id="knowledge_base" className="mb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">06 / RAG Data Retrieval</span>
            <h2 className="text-3xl font-bold font-display text-white">Knowledge Base AI Assistant</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{archivePage.example.note}</p>

            <div className="grid grid-cols-2 gap-3">
              {['Document Vector Search', 'FAQ Auto-Replies', 'Internal SOP Querying', 'Client Service Portals', 'RAG Security Architecture', 'Safe Data Separation'].map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-1 bg-gradient-to-r from-blue-500/10 via-violet-500/5 to-transparent rounded-2xl">
            <div className="p-6 rounded-2xl border border-blue-950/40 bg-slate-950/90 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                <span className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1.5 font-bold">
                  <BookOpen className="h-4 w-4" /> Knowledge Graph Vector Database
                </span>
                <span className="text-[9px] text-[#00c2ff] font-mono font-bold">VECTOR STORE CONNECTED</span>
              </div>

              {/* Stateful search widget */}
              <form onSubmit={handleDocSearch} className="space-y-3 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase block">Query Vector Store (Try "SOP Onboarding" or "Invoice billing")</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. SOP onboarding guidelines"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:border-blue-500 focus:outline-none pr-10 font-mono"
                    />
                    <button type="submit" className="absolute right-2.5 top-2.5 text-blue-400 hover:text-white">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {searchResult && (
                  <div className="p-3 rounded-lg bg-blue-950/15 border border-blue-950/30 text-xs font-mono text-slate-300 leading-relaxed animate-fade-in">
                    <p className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold mb-1">RAG Search Result Node:</p>
                    {searchResult}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* ==========================================
            AUTOMATION WORKFLOWS (React Flow Visual representation)
           ========================================== */}
        <div id="automation_workflows" className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest font-bold">n8n Node Pipelines</span>
            <h2 className="text-3xl font-bold font-display text-white">{"How we work"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-2">
              {workflowsList.map((wf, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflowIdx(idx)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    activeWorkflowIdx === idx 
                      ? 'border-[#8b5cf6] bg-purple-500/5 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold font-mono">{wf.name}</span>
                  <ChevronRight className="h-4 w-4 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase font-bold">PIPELINE SCHEMATIC PATH</span>
                
                {/* Horizontal flowchart */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                  {workflowsList[activeWorkflowIdx].steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="p-2 rounded bg-slate-900 border border-purple-950/50 text-slate-300 shadow-sm">
                        {step}
                      </span>
                      {idx < workflowsList[activeWorkflowIdx].steps.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-purple-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-900/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Webhook Integration Endpoint: n8n Node Server</span>
                <span className="text-emerald-400 font-bold">STATUS: STREAMING</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            REVENUE INTELLIGENCE DASHBOARD
           ========================================== */}
        <div id="analytics_dashboard" className="mb-28 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Central Intelligence Hub</span>
            <h2 className="text-3xl font-bold font-display text-white">{"Useful signals. Better conversations."}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"We agree the indicators around your objective, the information available and the work in scope. Review the quality of the next step as well as the activity that led to it."}</p>
          </div><ArchiveContentGroup page={archivePage} group="metrics" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 grid grid-cols-1 gap-3">
              {(['leads', 'appointments', 'proposals', 'revenue'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDashboardTab(tab)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    activeDashboardTab === tab 
                      ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider">{tab}</span>
                    <span className="text-emerald-400 text-xs font-bold font-mono">{dashboardStats[tab].pct}</span>
                  </div>
                  <span className="text-xl font-extrabold font-display block text-white">{dashboardStats[tab].val}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[350px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase font-bold">CONVERSION ANALYTICS GRID</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">AUTO-UPDATING METRIC TRACK</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-white uppercase">{activeDashboardTab} Timeline</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {dashboardStats[activeDashboardTab].desc}
                  </p>
                </div>

                {/* SVG Line Chart representing metrics trend */}
                <div className="pt-6">
                  <svg className="w-full h-32 text-blue-500" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid horizontal markers */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Gradient area */}
                    <path
                      d={`M 0 110 
                          L 100 ${110 - (dashboardStats[activeDashboardTab].points[0] / 3)} 
                          L 200 ${110 - (dashboardStats[activeDashboardTab].points[1] / 3)} 
                          L 300 ${110 - (dashboardStats[activeDashboardTab].points[2] / 3)} 
                          L 400 ${110 - (dashboardStats[activeDashboardTab].points[3] / 3)} 
                          L 500 ${110 - (dashboardStats[activeDashboardTab].points[4] / 3)} 
                          L 500 110 Z`}
                      fill="url(#chartGradient)"
                    />

                    {/* Connection line */}
                    <path
                      d={`M 0 110 
                          L 100 ${110 - (dashboardStats[activeDashboardTab].points[0] / 3)} 
                          L 200 ${110 - (dashboardStats[activeDashboardTab].points[1] / 3)} 
                          L 300 ${110 - (dashboardStats[activeDashboardTab].points[2] / 3)} 
                          L 400 ${110 - (dashboardStats[activeDashboardTab].points[3] / 3)} 
                          L 500 ${110 - (dashboardStats[activeDashboardTab].points[4] / 3)}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />

                    {/* Data Points */}
                    {dashboardStats[activeDashboardTab].points.slice(0, 5).map((p, idx) => (
                      <circle
                        key={idx}
                        cx={(idx + 1) * 100}
                        cy={110 - (p / 3)}
                        r="3.5"
                        fill="#3b82f6"
                        stroke="#040614"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                  
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 pt-2 border-t border-slate-900">
                    <span>Q1 BEGIN</span>
                    <span>Q2 START</span>
                    <span>Q3 MID</span>
                    <span>Q4 TRANSIT</span>
                    <span>CURRENT CYCLE</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Database Sync Endpoint</span>
                <span className="text-emerald-400 font-bold">HubSpot Verified Feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            ROI CALCULATOR
           ========================================== */}
        <div id="roi_calculator" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Financial Optimization</span>
            <h2 className="text-3xl font-bold font-display text-white">Professional Services ROI Calculator</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-5">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">Input parameters</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Monthly Inbound Leads</span>
                  <span className="text-white font-bold">{monthlyLeads} leads</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Average Contract Value</span>
                  <span className="text-white font-bold">₹{projectVal.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="500000"
                  step="10000"
                  value={projectVal}
                  onChange={(e) => setProjectVal(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Current Conversion Rate</span>
                  <span className="text-white font-bold">{currentConv}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={currentConv}
                  onChange={(e) => setCurrentConv(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Advisory Team Size</span>
                  <span className="text-white font-bold">{teamSize} members</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="45"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 p-8 rounded-2xl border border-blue-950/40 bg-slate-950/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[350px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">PROJECTED REVENUE MULTIPLIERS</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-950/5 border border-blue-950/25">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Added Monthly Sales</span>
                    <span className="text-xl font-extrabold text-white mt-1 block">
                      ₹{addedRevenue.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">Boosted by instant lead qualification triggers.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/5 border border-blue-950/25">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Weekly Hours Recovered</span>
                    <span className="text-xl font-extrabold text-[#00C2FF] mt-1 block">
                      {teamSize * 15} Hours
                    </span>
                    <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">Admin tasks handled autonomously.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/5 border border-blue-950/25">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Net Monthly Gain</span>
                    <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
                      ₹{totalMonthlyGain.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">Total combined financial gain value.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-900/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Calculations based on 15h weekly savings per employee</span>
                <span className="text-blue-400 font-bold">Real Financial Optimizations</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            CASE STUDIES / SUCCESS STORIES
           ========================================== */}
        <div id="case_studies" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Verifiable Results</span>
            <h2 className="text-3xl font-bold font-display text-white">{archivePage.example.title}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.example.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2">
              {successCases.map((cs, idx) => (
                <button
                  key={idx}
                  onClick={() => setCaseIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    caseIdx === idx 
                      ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-1">{cs.segment}</span>
                  <span className="text-xs font-bold font-display block text-slate-200">{cs.name}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[350px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-900/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">{successCases[caseIdx].metric}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">CASE REF: 00{caseIdx + 1}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-white">{successCases[caseIdx].name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {successCases[caseIdx].impact}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {successCases[caseIdx].results.map((res, i) => (
                    <div key={i} className="p-3 rounded-lg bg-blue-950/5 border border-blue-950/25">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase leading-relaxed">{res.title}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-400 line-through">{res.before}</span>
                        <span className="text-xs font-extrabold text-emerald-400">{res.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-900/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Verified Client Case Study Log</span>
                <span className="text-blue-400 font-bold">100% Operational Transparency</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            COMPARISON TABLE
           ========================================== */}
        <div id="comparison" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest font-bold">Market Analysis</span>
            <h2 className="text-3xl font-bold font-display text-white">{archivePage.definition.title}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-4 font-bold">Capabilities</th>
                  <th className="p-4 font-bold text-blue-400">Natton Digital</th>
                  <th className="p-4 font-bold">Traditional Agencies</th>
                  <th className="p-4 font-bold">Generic CRM Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {[
                  { cap: '24/7 Voice qualification bots', nat: 'Fully integrated', trad: 'Not offered', CRM: 'No API triggers' },
                  { cap: 'n8n Onboarding auto-checklists', nat: 'Fully configured', trad: 'Manual setup', CRM: 'Requires separate subscription' },
                  { cap: 'RAG policy knowledge query', nat: 'Custom configured', trad: 'Not offered', CRM: 'Simple text FAQs only' },
                  { cap: 'Instant dynamic proposals', nat: '3-click PDF creation', trad: '24-48h manual prep', CRM: 'Simple static invoice only' },
                  { cap: 'Consolidated Shared inbox', nat: 'Integrated WhatsApp/Telephony', trad: 'Disjointed channels', CRM: 'Text-only records' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/20 transition-all font-mono">
                    <td className="p-4 font-semibold text-slate-200 font-sans">{row.cap}</td>
                    <td className="p-4 text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="h-4 w-4 shrink-0" /> {row.nat}
                    </td>
                    <td className="p-4 text-slate-500">{row.trad}</td>
                    <td className="p-4 text-slate-500">{row.CRM}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            15 FREQUENTLY ASKED QUESTIONS
           ========================================== */}
        <ArchiveFAQ items={archivePage.faqs} idPrefix="professional-services" />

        {/* ==========================================
            LEAD CONSULTATION FORM (GHL / n8n + Captcha)
           ========================================== */}
        <div id="lead_form" className="mb-24 max-w-xl mx-auto space-y-6 text-left">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Partner Discovery</span>
            <h2 className="text-2xl font-bold font-display text-white">Book A Free Growth Consultation</h2>
            <p className="text-xs text-slate-400">
              Submit your project targets below. Our team compiles custom pipeline blueprints in under 48 hours:
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-2xl border border-blue-950/40 bg-slate-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
            
            {!isSubmitted ? (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            ) : (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-lg">✓</div>
                <h3 className="text-lg font-bold font-display text-white">Discovery Consultation Submitted!</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Your GHL ticket and welcome WhatsApp capability packs have been triggered successfully. Our consulting team will follow up in under 24 hours.
                </p>
                <div className="p-3 bg-black/40 rounded-lg border border-slate-800 text-left font-mono text-[9px] text-emerald-400 space-y-1">
                  {terminalLogs.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            FINAL CTA
           ========================================== */}
        <ArchiveContentGroup page={archivePage} group="scope" />

      </div>
    </div>
  );
}
