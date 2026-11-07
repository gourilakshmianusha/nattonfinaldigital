import './industry-process-layout.css';
import archivePage from '../content/ten-pages/real-estate.json';
import {ArchiveHeroBackground,ArchiveContentGroup} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Cpu, TrendingUp, Search, CheckCircle, Layers, Workflow, 
  BarChart2, ArrowRight, Play, Zap, Star, MessageSquare, Users, Globe, 
  ChevronRight, Check, HelpCircle, ChevronDown, ChevronUp, Send, 
  Sliders, DollarSign, Plus, RefreshCw, Clock, Phone, Shield, 
  Briefcase, Lock, X, Volume2, Bookmark, Database, Mail, Building, 
  CheckSquare, Activity, Calendar, MapPin, Heart, UserCheck, Smile, 
  Percent, Eye, SlidersHorizontal, Award, Bell, Link2, Compass, 
  LayoutGrid, Home, AlertCircle, FileText, CheckCheck, User, Map
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function IndustryRealEstate({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // SMART CITY SKYLINE CANVAS BACKGROUND
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    const buildings: Array<{ x: number; w: number; h: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 15; i++) {
      buildings.push({
        x: Math.random() * width,
        w: 40 + Math.random() * 80,
        h: 150 + Math.random() * 250,
        speed: 0.1 + Math.random() * 0.2,
        opacity: 0.03 + Math.random() * 0.05
      });
    }

    const stars: Array<{ x: number; y: number; size: number; pulse: number }> = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height - 100),
        size: Math.random() * 1.5 + 0.5,
        pulse: Math.random() * Math.PI
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint luxury grid lines (Electric Blue & Gold vibe)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw smart skyline
      buildings.forEach((b) => {
        ctx.fillStyle = `rgba(212, 175, 55, ${b.opacity})`; // Warm Gold silhouette
        ctx.fillRect(b.x, height - b.h, b.w, b.h);
        
        // Draw little neon window dots (Electric Blue)
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        const cols = Math.floor(b.w / 12);
        const rows = Math.floor(b.h / 18);
        for (let c = 1; c < cols; c++) {
          for (let r = 2; r < rows; r++) {
            if (Math.sin(c + r + b.x) > 0.3) {
              ctx.fillRect(b.x + c * 12, height - b.h + r * 18, 2, 2);
            }
          }
        }
      });

      // Draw stars & neural connect paths
      stars.forEach((s) => {
        s.pulse += 0.015;
        ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + Math.sin(s.pulse) * 0.3})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw golden neural node routes
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i += 4) {
        if (stars[i+1]) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[i+1].x, stars[i+1].y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==========================================
  // SMART REAL ESTATE ECOSYSTEM NODES
  // ==========================================
  const [selectedEcoNode, setSelectedEcoNode] = useState<string>('leads');
  const ecoNodes = [
{ id: 'leads', title: "Property websites & project pages", desc: "Build mobile-friendly pages with clear project information, location context, galleries, available downloads and enquiry routes. Client-approved facts and current availability guide the content.", features: ["An agreed audience, message and campaign plan","Project or service pages and enquiry routes","Relevant SEO and creative content","A scoped CRM and follow-up workflow","A reporting and review cadence"], icon: UserCheck },
{ id: 'whatsapp', title: "Search visibility & local discovery", desc: "Develop useful location, property-type and service content around relevant search intent. Review local business visibility for eligible offices and business locations; individual sale or rental units are not automatically eligible for Google Business Profiles.", features: ["An agreed audience, message and campaign plan","Project or service pages and enquiry routes","Relevant SEO and creative content","A scoped CRM and follow-up workflow","A reporting and review cadence"], icon: MessageSquare },
{ id: 'voip', title: "Campaigns with a clear enquiry route", desc: "Plan Google and social campaigns around a defined project, audience and landing page. Test the message and review enquiry relevance with the sales team rather than promising a fixed number of bookings.", features: ["An agreed audience, message and campaign plan","Project or service pages and enquiry routes","Relevant SEO and creative content","A scoped CRM and follow-up workflow","A reporting and review cadence"], icon: Phone },
{ id: 'crm', title: "Property content & creative production", desc: "Turn approved photographs, walkthrough footage, project details and common buyer questions into useful social and website content. Visuals should accurately represent what is being offered.", features: ["An agreed audience, message and campaign plan","Project or service pages and enquiry routes","Relevant SEO and creative content","A scoped CRM and follow-up workflow","A reporting and review cadence"], icon: Database }
];

  // ==========================================
  // GROW_BLUEPRINT INTERACTIVE FUNNEL
  // ==========================================
  const [activeFunnelStep, setActiveFunnelStep] = useState<number>(0);
  const funnelSteps = [
{ stage: "Understand the offer", val: "Agreed scope", desc: "Review the property business, project stage, location, buyer or tenant audience, existing marketing and the sales team's capacity. Agree the facts and material available for publication." },
{ stage: "Build the enquiry foundation", val: "Agreed scope", desc: "Prepare the key pages, approved visual material, enquiry forms, contact routes and measurement plan. Establish how the team defines a useful enquiry and who receives it." },
{ stage: "Reach relevant people", val: "Agreed scope", desc: "Launch the agreed search, content and campaign work. Match the message and landing page to the property or service being discussed." },
{ stage: "Connect and follow up", val: "Agreed scope", desc: "Route enquiries to the right owner, retain conversation context and support appropriate next steps such as a call, information request or site-visit discussion." },
{ stage: "Review with the sales team", val: "Agreed scope", desc: "Compare campaign and website information with enquiry quality and recorded outcomes. Refine targeting, content and handovers as availability and business priorities change." }
];

  // ==========================================
  // LEAD GENERATION ENGINE (MOCK MARKETING DASHBOARD)
  // ==========================================
  const [activeMktTab, setActiveMktTab] = useState<'seo' | 'meta' | 'google'>('meta');
  const marketingData = {
    meta: {
      stats: [{ l: 'Weekly Meta Ad Leads', v: '1,420' }, { l: 'Cost Per Lead (CPL)', v: '₹145.00' }, { l: 'Ad Relevance Score', v: '9.8 / 10' }],
      campaigns: [
        { name: 'Luxury Villas Launch Campaign (HNIs)', budget: '₹1,50,000', leads: '680', cost: '₹220/lead' },
        { name: 'Premium 3BHK Smart Homes Retargeting', budget: '₹80,000', leads: '520', cost: '₹153/lead' },
        { name: 'Site Visit Booking Boost Sequence', budget: '₹40,000', leads: '220', cost: '₹181/lead' }
      ]
    },
    google: {
      stats: [{ l: 'Weekly Google Ad Clicks', v: '12,840' }, { l: 'Click-Through Rate (CTR)', v: '5.4%' }, { l: 'Avg CPC Rate', v: '₹34.50' }],
      campaigns: [
        { name: 'High-Intent "Luxury Apartments Near Me"', budget: '₹2,00,000', leads: '510', cost: '₹392/lead' },
        { name: 'Commercial Property Office Space Lease', budget: '₹1,20,000', leads: '290', cost: '₹413/lead' },
        { name: 'Urgent Pre-Launch Investment Offers', budget: '₹75,000', leads: '240', cost: '₹312/lead' }
      ]
    },
    seo: {
      stats: [{ l: 'Monthly Organic Traffic', v: '42,100' }, { l: 'Local Maps GMB Views', v: '14,800' }, { l: 'Directions Triggers', v: '1,840' }],
      campaigns: [
        { name: 'best real estate builders in Bangalore', budget: 'Organic SEO', leads: '#1 Position', cost: '8.4% Conv' },
        { name: 'completed residential ready to move in', budget: 'Organic SEO', leads: '#2 Position', cost: '6.2% Conv' },
        { name: 'top pre-launch projects north side', budget: 'Local GMB', leads: '#1 Position', cost: '9.1% Conv' }
      ]
    }
  };

  // ==========================================
  // GROWTHOS™ DRAG-AND-DROP PIPELINE PREVIEW
  // ==========================================
  const [pipelineLeads, setPipelineLeads] = useState([
    { id: '1', name: 'Kabir Singhania', property: 'Royal Estate Villas', budget: '₹4.5 Cr', stage: 'contacted' },
    { id: '2', name: 'Meera Deshmukh', property: 'Smart Premium 3BHK', budget: '₹1.8 Cr', stage: 'qualified' },
    { id: '3', name: 'Rohan Malhotra', property: 'Iconic Commercial Hub', budget: '₹12 Cr', stage: 'site_visit' },
    { id: '4', name: 'Aanya Sen', property: 'Luxury Sky Penthouse', budget: '₹6.2 Cr', stage: 'closed' }
  ]);

  const moveLead = (leadId: string, targetStage: string) => {
    setPipelineLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, stage: targetStage } : lead));
  };

  // ==========================================
  // BUSINESSOS™ INTEGRATED OMNICHAT SIMULATION
  // ==========================================
  const [waMessages, setWaMessages] = useState([
    { sender: 'user', text: 'Interested in the new Premium Villas project. Can I see pricing?', time: '11:20 AM' },
    { sender: 'system', text: 'Welcome to Elite Estates Bot! 🏰\n\nI can instantly dispatch premium catalogs, calculate custom payment schedules, or lock a priority site tour slot for you.\n\nType a number to proceed:\n1️⃣ Download Luxury Villas Brochure PDF\n2️⃣ Get 3D Virtual Tour Link\n3️⃣ Book Site Visit Tomorrow', time: '11:20 AM' }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const userMsg = newMsg.trim();
    setWaMessages(prev => [...prev, { sender: 'user', text: userMsg, time: '11:21 AM' }]);
    setNewMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Our AI Real Estate Concierge is parsing catalog blueprints...';
      if (userMsg.includes('1')) {
        reply = '📚 Here is the official catalog for **Royal Estate Villas**! Including structural layout plans, high-end specifications, and available units.\n\n👉 [Download Luxury Brochure PDF]';
      } else if (userMsg.includes('2')) {
        reply = '🕶️ Experience our immersive **Virtual 3D Walkthrough**. Drag and explore 360° views of our model luxury penthouse.\n\n👉 [Launch Virtual Tour]';
      } else if (userMsg.includes('3') || userMsg.toLowerCase().includes('visit') || userMsg.toLowerCase().includes('book')) {
        reply = '🗓️ Scheduling Site Visit:\n\nOur private luxury shuttle has availability tomorrow! Available slots:\n🌅 Slot A: 11:00 AM\n🌆 Slot B: 04:00 PM\n\nSimply reply with "A" or "B" to instantly reserve your site visit.';
      } else if (userMsg.toUpperCase() === 'A' || userMsg.toUpperCase() === 'B') {
        reply = '🎉 Locked and Confirmed! Your site tour of Royal Estate Villas is reserved. An AI scheduling specialist has dispatched the GPS coordinates & local builder contact info to your phone via SMS. See you tomorrow!';
      } else {
        reply = 'Received! Understood. I have flagged your preference. A senior luxury portfolio consultant will reach out shortly on this thread.';
      }
      setWaMessages(prev => [...prev, { sender: 'system', text: reply, time: '11:22 AM' }]);
      setIsTyping(false);
    }, 1200);
  };

  // ==========================================
  // AGENTICOS™ 3D AI AGENTS SELECTOR
  // ==========================================
  const [selectedAgent, setSelectedAgent] = useState('lead_qual');
  const agentsList = [
    { id: 'lead_qual', name: 'Lead Qualification Agent', role: 'Performs pre-qualification calls under 45s, matching buyers with credit, score, and inventory constraints.', logic: 'IF query_intent IS high AND budget > threshold THEN schedule_site_visit()' },
    { id: 'site_visit', name: 'Site Visit Agent', role: 'Coordinates private shuttle scheduling, locks builder calendars, and triggers automatic GPS mapping alerts.', logic: 'ON_BOOKING_LOCKED -> dispatch_whatsapp_directions() AND sync_broker_google_calendar()' },
    { id: 'support', name: 'Customer Support Agent', role: 'Answers intricate legal and facility queries 24/7 regarding RERA approvals, home loan partners, and maintenance covenants.', logic: 'SCAN handbook_covenants FOR matching_rera_license_no AND print_response()' },
    { id: 'followup', name: 'Follow-Up Agent', role: 'Executes automated friendly nurtures on active leads to ensure prospective buyers progress into formal physical bookings.', logic: 'EVERY 48_hours WHILE stage == "qualified" SEND pricing_nudge_pdf()' },
    { id: 'sales', name: 'Sales Agent', role: 'Assists on-ground brokers with pre-written negotiation talking points, market data comps, and available spot discounts.', logic: 'ON_BROKER_INQUIRY -> retrieve_market_comps_and_discounts(current_property)' },
    { id: 'channel_partner', name: 'Channel Partner Agent', role: 'Manages third-party realtors, tracking deals registry, validating registrations, and processing payout audits.', logic: 'IF deal_closed_by_partner THEN dispatch_commission_invoice() AND record_ledger_payout()' }
  ];

  // ==========================================
  // AUTOMATION WORKFLOWS SELECTOR
  // ==========================================
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);
  const workflowsList = [
{
      title: "Understand the offer",
      desc: "Review the property business, project stage, location, buyer or tenant audience, existing marketing and the sales team's capacity. Agree the facts and material available for publication.",
      nodes: ['1. Lead Ingress', '2. AI Qualification Dial', '3. Catalog Dispatched', '4. Tour Booking', '5. Site Inspection', '6. Payment Gate', '7. Closed Won']
    },
{
      title: "Build the enquiry foundation",
      desc: "Prepare the key pages, approved visual material, enquiry forms, contact routes and measurement plan. Establish how the team defines a useful enquiry and who receives it.",
      nodes: ['1. Inbound Busy Line', '2. Call Registry Log', '3. Instant WhatsApp Hook', '4. Self-Select Menu', '5. Scheduled AI Dialout']
    },
{
      title: "Reach relevant people",
      desc: "Launch the agreed search, content and campaign work. Match the message and landing page to the property or service being discussed.",
      nodes: ['1. Portal Form Fired', '2. Outbound Voice Dial', '3. Budget Confirmed', '4. Custom PDF Bro', '5. Broker Handover']
    },
{
      title: "Connect and follow up",
      desc: "Route enquiries to the right owner, retain conversation context and support appropriate next steps such as a call, information request or site-visit discussion.",
      nodes: ['1. Partner Deal Reg', '2. Audit Match', '3. Direct CRM Link', '4. Financial Clear', '5. Commission Credit']
    },
{
      title: "Review with the sales team",
      desc: "Compare campaign and website information with enquiry quality and recorded outcomes. Refine targeting, content and handovers as availability and business priorities change.",
      nodes: ['1. Lead Ingress', '2. AI Qualification Dial', '3. Catalog Dispatched', '4. Tour Booking', '5. Site Inspection', '6. Payment Gate', '7. Closed Won']
    }
];

  // ==========================================
  // INTERACTIVE 3D PROPERTY SHOWCASE
  // ==========================================
  const [selectedPropertyIdx, setSelectedPropertyIdx] = useState(0);
  const [viewAngle, setViewAngle] = useState(180);
  const propertiesList = [
    { name: 'Royal Estate Villas', loc: 'Prestige Boulevard, North Side', type: 'Residential Villa', price: '₹4.5 Cr - ₹6.8 Cr', area: '4,200 sq ft', amenity: 'Infinity Pool, Private Lift, Smart Home Automation' },
    { name: 'Skyview Penthouse', loc: 'Downtown Luxury District', type: 'Residential Suite', price: '₹6.2 Cr - ₹8.5 Cr', area: '5,500 sq ft', amenity: '360° Glass Dome, Sky Garden, Helipad Access' },
    { name: 'Iconic Commercial Hub', loc: 'Financial Tech Corridor', type: 'Commercial High-Rise', price: '₹12.0 Cr+', area: '18,500 sq ft', amenity: 'Lease Lock, Dual High-Voltage Substations, 500 Car Parks' }
  ];

  // ==========================================
  // SITE VISIT CALENDAR AUTOMATION WIDGET
  // ==========================================
  const [bookingDate, setBookingDate] = useState('2026-06-30');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingSimulated, setBookingSimulated] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const startBookingSim = () => {
    setBookingSimulated(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 1200);
    setTimeout(() => setSimStep(3), 2400);
    setTimeout(() => setSimStep(4), 3600);
  };

  // ==========================================
  // ROI CALCULATOR
  // ==========================================
  const [monthlyLeads, setMonthlyLeads] = useState(500);
  const [avgPropValue, setAvgPropValue] = useState(15000000); // 1.5 Cr
  const [currConvRate, setCurrConvRate] = useState(1.5); // 1.5%
  const [mktBudget, setMktBudget] = useState(120000); // 1.2 Lakh

  // Current Math
  const currClosures = Math.round(monthlyLeads * (currConvRate / 100));
  const currRevenue = currClosures * avgPropValue;

  // Optimized Math (Natton Digital's automation doubles-triples conversion)
  const optConvRate = Math.min(10, parseFloat((currConvRate * 2.8).toFixed(1)));
  const optClosures = Math.round(monthlyLeads * (optConvRate / 100));
  const optRevenue = optClosures * avgPropValue;

  const addClosures = optClosures - currClosures;
  const revIncrease = optRevenue - currRevenue;
  const roiPct = Math.round(((revIncrease - mktBudget) / mktBudget) * 100);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // ==========================================
  // SUCCESS STORIES
  // ==========================================
  const [caseStudyIdx, setCaseStudyIdx] = useState(0);
  const caseStudies = [
{
      title: "Project enquiry received",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Illustrative example. No live customer data or business-system connection is used.",
      solution: "Illustrative example. No live customer data or business-system connection is used.",
      roi: "Illustrative workflow",
      stats: [{"label":"Relevant enquiries","before":"Baseline to agree","after":"Track the enquiries that fit the project, service area and agreed customer profile."},{"label":"Contact and response patterns","before":"Baseline to agree","after":"Review contactability, response intervals and open conversations where reliable data is available."},{"label":"Sales-team next steps","before":"Baseline to agree","after":"Monitor accepted discussions, information requests and site-visit requests recorded by the team."},{"label":"Channel and campaign costs","before":"Baseline to agree","after":"Compare spend with enquiry quality and known outcomes, acknowledging gaps in attribution."}]
    },
{
      title: "Interest and preferences recorded",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Illustrative example. No live customer data or business-system connection is used.",
      solution: "Illustrative example. No live customer data or business-system connection is used.",
      roi: "Illustrative workflow",
      stats: [{"label":"Relevant enquiries","before":"Baseline to agree","after":"Track the enquiries that fit the project, service area and agreed customer profile."},{"label":"Contact and response patterns","before":"Baseline to agree","after":"Review contactability, response intervals and open conversations where reliable data is available."},{"label":"Sales-team next steps","before":"Baseline to agree","after":"Monitor accepted discussions, information requests and site-visit requests recorded by the team."},{"label":"Channel and campaign costs","before":"Baseline to agree","after":"Compare spend with enquiry quality and known outcomes, acknowledging gaps in attribution."}]
    },
{
      title: "Sales owner assigned",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Illustrative example. No live customer data or business-system connection is used.",
      solution: "Illustrative example. No live customer data or business-system connection is used.",
      roi: "Illustrative workflow",
      stats: [{"label":"Relevant enquiries","before":"Baseline to agree","after":"Track the enquiries that fit the project, service area and agreed customer profile."},{"label":"Contact and response patterns","before":"Baseline to agree","after":"Review contactability, response intervals and open conversations where reliable data is available."},{"label":"Sales-team next steps","before":"Baseline to agree","after":"Monitor accepted discussions, information requests and site-visit requests recorded by the team."},{"label":"Channel and campaign costs","before":"Baseline to agree","after":"Compare spend with enquiry quality and known outcomes, acknowledging gaps in attribution."}]
    },
{
      title: "Call or site-visit follow-up organised",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Illustrative example. No live customer data or business-system connection is used.",
      solution: "Illustrative example. No live customer data or business-system connection is used.",
      roi: "Illustrative workflow",
      stats: [{"label":"Relevant enquiries","before":"Baseline to agree","after":"Track the enquiries that fit the project, service area and agreed customer profile."},{"label":"Contact and response patterns","before":"Baseline to agree","after":"Review contactability, response intervals and open conversations where reliable data is available."},{"label":"Sales-team next steps","before":"Baseline to agree","after":"Monitor accepted discussions, information requests and site-visit requests recorded by the team."},{"label":"Channel and campaign costs","before":"Baseline to agree","after":"Compare spend with enquiry quality and known outcomes, acknowledging gaps in attribution."}]
    }
];

  // ==========================================
  // COMPARISON MATRIX
  // ==========================================
  const matrix = [
{ cap: "An agreed audience, message and campaign plan", natton: "An agreed audience, message and campaign plan", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Project or service pages and enquiry routes", natton: "Project or service pages and enquiry routes", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Relevant SEO and creative content", natton: "Relevant SEO and creative content", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "A scoped CRM and follow-up workflow", natton: "A scoped CRM and follow-up workflow", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "A reporting and review cadence", natton: "A reporting and review cadence", trad: "Assessed against your current process", generic: "Assessed against your current process" }
];

  // ==========================================
  // 15 FREQUENTLY ASKED QUESTIONS
  // ==========================================
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqList = [
{ q: "Do you work with developers, brokers and smaller property businesses?", a: "Yes. The starting scope depends on the business model and available resources. An independent agency may need a clear website and local enquiry process, while a developer may need multiple project pages, campaigns and sales-team routing. We agree the priority before choosing tools." },
{ q: "Can you guarantee property leads, site visits or sales?", a: "No. Marketing can improve the way people discover and evaluate an offer, but relevance and outcomes also depend on price, location, project facts, availability, competition and the sales process. We agree measurable activities and review enquiry quality and recorded sales-team outcomes without guaranteeing bookings." },
{ q: "Do we need a Google Business Profile for every property?", a: "Not necessarily. Google distinguishes an eligible business or sales office from individual rental or sale properties. We review the actual business locations and eligibility before proposing local-profile work, and use project pages where appropriate." },
{ q: "What should we provide before you start?", a: "Useful inputs include approved project or service details, current availability, location information, owned photographs or footage, brand assets, access to existing accounts and the sales team's follow-up process. Your authorised team must approve project claims and required disclosures before publication." },
{ q: "Can you connect our existing CRM and WhatsApp follow-up?", a: "We can assess the CRM, agreed messaging channels and available integrations. The scope may include enquiry capture, ownership, reminders and conversation context. Provider capabilities, data access, template requirements and usage costs are checked before promising a particular connection." },
{ q: "How do costs and ongoing support work?", a: "We separate the agreed implementation and management work from media spend, subscriptions and usage charges. After launch, reviews can cover enquiry quality, content accuracy, campaign performance and team handovers. The proposal defines responsibilities, access, review points and the support included." }
];

  // ==========================================
  // LEAD CAPTURE FORM WITH CAPTCHA & INTEGRATION TERMINAL
  // ==========================================
  const [formState, setFormState] = useState({
    fullName: '', companyName: '', bizType: 'Developer', location: '', email: '', phone: '', leadsCount: '100 - 500', challenges: '', message: ''
  });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaSum, setCaptchaSum] = useState({ num1: 0, num2: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setCaptchaSum({
      num1: Math.floor(Math.random() * 9) + 2,
      num2: Math.floor(Math.random() * 9) + 2
    });
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== (captchaSum.num1 + captchaSum.num2)) {
      alert('Verification code is incorrect. Please check again.');
      return;
    }
    setSubmitting(true);
    setLogs([
      'Intercepting luxury real estate lead payload...',
      'Mapping attributes to GoHighLevel (GHL) API schema...',
      'Firing secure n8n integration webhook node...',
      'Triggering administrative Slack notify channel...'
    ]);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        'Sync successful. Registered CRM Contact ID: GHL_RE_8241',
        'Fired welcome campaign sequence via WhatsApp API.'
      ]);
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(true);
      }, 1000);
    }, 1800);
  };

  return (
    <div className={`min-h-screen py-8 overflow-hidden relative selection:bg-amber-500 selection:text-black transition-colors duration-500 ${darkMode ? 'bg-[#030616] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Background Neon Lights */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] left-0 w-[500px] h-[500px] bg-amber-950/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-5 right-10 w-[600px] h-[600px] bg-cyan-950/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-xs font-mono text-gray-500 flex items-center gap-1.5 border-b border-white/5 pb-4">
          <button onClick={() => setPath('home')} className="hover:text-amber-400 transition-colors">Home</button> 
          <span>/</span> 
          <a className="text-gray-400" href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');}}>Industries</a> 
          <span>/</span> 
          <span className="text-amber-400 font-semibold">Real Estate</span>
        </div>

        {/* ==========================================
            HERO SECTION (Luxury Real Estate Tech Vibe)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 relative min-h-[520px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden -z-20 border border-white/5 bg-slate-950/40">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-75" />
          </div>

          <div className="archive-hero-copy lg:col-span-7 space-y-6 z-10 p-6 sm:p-10 text-left">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Give every property"} <br />
<span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 bg-clip-text text-transparent">{"enquiry a clearer next step."}</span>
            </h1>

            <p className="text-sm leading-relaxed text-gray-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#lead_form" 
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-cyan-500 hover:opacity-90 text-black font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="#ecosystem" 
                className="px-6 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-amber-400 transition-all flex items-center gap-2 text-sm font-semibold"
              >
                Explore Property Solutions
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-amber-400">{"Useful information"}</span>
              <span className="flex items-center gap-1.5 text-cyan-400">{"A clearer customer journey"}</span>
              <span className="flex items-center gap-1.5 text-gray-400">{"People before platforms"}</span>
            </div>
          </div>

          {/* Smart Real Estate Ecosystem Dashboard visualizer */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            SOLUTIONS BUILT FOR (SEGMENTS)
           ========================================== */}
        <div id="ecosystem" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Solutions Built For</span>
            <h2 className="text-3xl font-bold font-display">{"Who this can help"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {[
{ label: "Property developers and project sales teams", desc: "Connect property marketing, project information and enquiry follow-up around the way your sales team works. Natton Digital helps real estate businesses build a useful online presence, reach relevant buyers and keep conversations moving toward a genuine sales discussion." },
{ label: "Independent brokers and real estate agencies", desc: "Connect property marketing, project information and enquiry follow-up around the way your sales team works. Natton Digital helps real estate businesses build a useful online presence, reach relevant buyers and keep conversations moving toward a genuine sales discussion." },
{ label: "Residential and commercial property businesses", desc: "Connect property marketing, project information and enquiry follow-up around the way your sales team works. Natton Digital helps real estate businesses build a useful online presence, reach relevant buyers and keep conversations moving toward a genuine sales discussion." },
{ label: "Property-management and leasing teams", desc: "Connect property marketing, project information and enquiry follow-up around the way your sales team works. Natton Digital helps real estate businesses build a useful online presence, reach relevant buyers and keep conversations moving toward a genuine sales discussion." }
].map((seg, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-white/5 bg-slate-950/40 hover:border-amber-500/30 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
                <div>
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                    <Building className="h-4 w-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{seg.label}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{seg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            CHALLENGES WE SOLVE (PAIN POINTS)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Industry Bottlenecks</span>
            <h2 className="text-3xl font-bold font-display">{"Recognise the gaps. Choose the right priority."}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"We begin with the business problem, then agree the work that will help address it."}</p>
          </div><ArchiveContentGroup page={archivePage} group="needs" />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            {[
              { title: 'Low Lead Quality', before: 'Wasting budget on unqualified clicks.', after: 'AI voice screening validates buyer criteria before agent delivery.' },
              { title: 'Lead Leakage', before: 'Disjointed spreadsheets causing loss of contacts.', after: 'Instant sync protocols register every buyer enquiry immediately.' },
              { title: 'Poor Follow-Up', before: 'Realtors delay call-backs, cooling buyer intent.', after: 'Schedules friendly nurtures via automated WhatsApp templates.' },
              { title: 'Manual Sales Process', before: 'Complex legal tasks slowing closures.', after: 'Streamlines contracts & payouts using GrowthOS™ pathways.' },
              { title: 'Missed Calls', before: 'Client calls go unanswered during peak hours.', after: 'Triggers instant text brochure within 15 seconds of a missed call.' },
              { title: 'Low Site Visits', before: 'Prospective buyers drop off before checking site.', after: 'Self-booking shuttle features drive higher physical turnout.' },
              { title: 'Slow Closures', before: 'Delaying due to back-and-forth paper locks.', after: 'Secures instant RERA contract approvals & invoice dispatches.' },
              { title: 'Poor CRM Adoption', before: 'Teams find traditional CRMs overly complex.', after: 'Intuitive team inbox with automated record update flows.' }
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-white/5 bg-slate-950/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white mb-3 border-b border-white/5 pb-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {p.title}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[8px] font-mono text-rose-400 uppercase tracking-wider block">Manual Way</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{p.before}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider block">AI-Optimized</span>
                      <p className="text-[10px] text-gray-300 mt-0.5 font-medium">{p.after}</p>
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
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Blueprint Process</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-2">
              {funnelSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFunnelStep(idx)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    activeFunnelStep === idx 
                      ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white' 
                      : 'border-white/5 bg-slate-950/40 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold font-mono">{step.stage}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeFunnelStep === idx ? 'bg-amber-500 text-black' : 'bg-slate-900 text-gray-400'}`}>
                    {step.val}
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md min-h-[220px] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  Active Pipeline Node {activeFunnelStep + 1} of {funnelSteps.length}
                </span>
                <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-2 mb-3">
                  {funnelSteps[activeFunnelStep].stage}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {funnelSteps[activeFunnelStep].desc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-gray-500">System State: Active</span>
                <button 
                  onClick={() => setActiveFunnelStep((prev) => (prev + 1) % funnelSteps.length)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
                >
                  Next Stage Node <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            AI GROWTH MARKETING (LEAD GENERATION ENGINE)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Marketing Suite</span>
            <h2 className="text-3xl font-bold font-display">Lead Generation Engine</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[2].description}</p>
          </div><ArchiveContentGroup page={archivePage} group="services" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-3">
              {[
                { id: 'meta', title: 'Meta Ads Generation', icon: Globe, desc: 'Engages prospective luxury villa and family home buyers across Meta feeds.' },
                { id: 'google', title: 'Google Keyword Capture', icon: Search, desc: 'Intercepts high-intent search queries like "luxury apartments near me".' },
                { id: 'seo', title: 'Local Maps SEO', icon: Compass, desc: 'Propels builder showrooms to #1 positions on active search maps.' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMktTab(tab.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeMktTab === tab.id 
                      ? 'border-cyan-500 bg-cyan-500/5 text-white' 
                      : 'border-white/5 bg-slate-950/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <h3 className="text-xs font-bold font-display flex items-center gap-1.5 mb-1">
                    <tab.icon className="h-4 w-4 text-cyan-400" />
                    {tab.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{tab.desc}</p>
                </button>
              ))}
            </div>

            {/* Simulated Live Analytics Dashboard */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-400">MARKETING ANALYTICS CONSOLE</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Active Profile: {activeMktTab}</span>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {marketingData[activeMktTab].stats.map((stat, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-black/40 border border-white/5 text-left">
                    <span className="text-[9px] font-mono text-gray-500 block">{stat.l}</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">{stat.v}</span>
                  </div>
                ))}
              </div>

              {/* Campaign Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500">
                      <th className="pb-2">Campaign Identifier</th>
                      <th className="pb-2">Allocated Budget</th>
                      <th className="pb-2">Acquired Leads</th>
                      <th className="pb-2 text-right">Avg cost metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketingData[activeMktTab].campaigns.map((camp, idx) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="py-2.5 text-white font-medium">{camp.name}</td>
                        <td className="py-2.5 text-gray-400">{camp.budget}</td>
                        <td className="py-2.5 text-cyan-400 font-bold">{camp.leads}</td>
                        <td className="py-2.5 text-right text-emerald-400">{camp.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            GROWTHOS™ PIPELINE DASHBOARD (Drag-and-Drop)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">CRM System</span>
            <h2 className="text-3xl font-bold font-display">GrowthOS™ Pipelines</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[0].description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            {[
              { id: 'contacted', name: 'Leads Registered', color: 'border-cyan-500/30' },
              { id: 'qualified', name: 'AI Qualified', color: 'border-yellow-500/30' },
              { id: 'site_visit', name: 'Site Tour Booked', color: 'border-amber-500/30' },
              { id: 'closed', name: 'Contract Closed', color: 'border-emerald-500/30' }
            ].map((column) => (
              <div key={column.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/40 min-h-[220px]">
                <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-white/5">
                  <span className="text-xs font-bold text-white">{column.name}</span>
                  <span className="text-[9px] font-mono text-gray-500">
                    {pipelineLeads.filter(l => l.stage === column.id).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pipelineLeads.filter(l => l.stage === column.id).map((lead) => (
                    <div key={lead.id} className="p-3 rounded-lg bg-black/60 border border-white/10 hover:border-amber-500/40 transition-all">
                      <p className="text-xs font-bold text-white mb-1">{lead.name}</p>
                      <p className="text-[10px] text-gray-400">{lead.property}</p>
                      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-white/5">
                        <span className="text-[10px] text-amber-400 font-mono font-bold">{lead.budget}</span>
                        
                        {/* Interactive Move Action Button */}
                        <select
                          value={lead.stage}
                          onChange={(e) => moveLead(lead.id, e.target.value)}
                          className="bg-slate-900 text-gray-400 text-[8px] font-mono rounded px-1.5 py-0.5 border border-white/10"
                        >
                          <option value="contacted">To Reg</option>
                          <option value="qualified">To Qual</option>
                          <option value="site_visit">To Tour</option>
                          <option value="closed">To Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {pipelineLeads.filter(l => l.stage === column.id).length === 0 && (
                    <div className="text-center py-8 text-[10px] text-gray-600 font-mono">No active deals</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            BUSINESSOS™ COMMUNICATION PLATFORM
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Omnichannel Engine</span>
            <h2 className="text-3xl font-bold font-display">BusinessOS™ Communications</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[4].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold font-display">Omnichannel Features</h3>
              {[
                { title: 'WhatsApp Automation', desc: 'Dispatches custom interactive digital brochures and pricing charts within 10 seconds.' },
                { title: 'Cloud Telephony', desc: 'Captures busy or missed calls, scheduling immediate alerts to team roster boards.' },
                { title: 'AI Calling', desc: 'Screener dials leads within 45 seconds to gather interest details and match brokers.' },
                { title: 'Live Chat', desc: 'Converts organic portal traffic into verified client records instantly.' }
              ].map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/5 bg-slate-950/20">
                  <h4 className="text-xs font-bold text-white mb-1">{feat.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive WhatsApp Device Frame Mockup */}
            <div className="lg:col-span-7 p-1">
              <div className="rounded-2xl border border-white/10 bg-slate-950 shadow-2xl p-4 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Elite Estates Bot</h4>
                      <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online Concierge
                      </p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-gray-500">Verified Profile</span>
                </div>

                {/* Message Screen */}
                <div className="h-64 overflow-y-auto bg-black/60 rounded-lg p-3.5 space-y-3 flex flex-col mb-3">
                  {waMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`max-w-[85%] p-3 rounded-lg text-[10px] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-amber-500/15 border border-amber-500/30 text-white ml-auto text-right' 
                          : 'bg-slate-900 border border-white/5 text-gray-300 mr-auto text-left whitespace-pre-line'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[7px] text-gray-500 mt-1 block font-mono">{msg.time}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <span className="text-[8px] text-amber-400 animate-pulse font-mono mr-auto">AI is calculating catalog maps...</span>
                  )}
                </div>

                {/* Send Message Bar */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type 1, 2, or 3 to test pathways..."
                    className="flex-1 bg-black text-xs text-white rounded px-3 py-2 border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                  <button type="submit" className="px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded flex items-center justify-center">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            AGENTICOS™ 3D AI AGENTS SELECTOR
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Agentic Network</span>
            <h2 className="text-3xl font-bold font-display">AgenticOS™ Systems</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2">
              {agentsList.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all ${
                    selectedAgent === agent.id 
                      ? 'border-amber-500 bg-amber-500/5 text-white' 
                      : 'border-white/5 bg-slate-950/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold font-display">{agent.name}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md min-h-[220px] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  Active Cognitive Agent Persona
                </span>
                <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-2 mb-3">
                  {agentsList.find(a => a.id === selectedAgent)?.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {agentsList.find(a => a.id === selectedAgent)?.role}
                </p>
                
                {/* Simulated Cognitive Logic Block */}
                <div className="p-3 rounded bg-black/60 border border-white/5 font-mono text-[9px] text-cyan-400">
                  <span className="text-gray-500 block mb-1">// Under-the-hood System Decision Pattern</span>
                  {agentsList.find(a => a.id === selectedAgent)?.logic}
                </div>
              </div>

              <div className="mt-4 border-t border-white/5 pt-4 text-right">
                <span className="text-[9px] font-mono text-gray-500">Node Status: Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            REAL ESTATE AUTOMATION WORKFLOWS
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Automation Loops</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2">
              {workflowsList.map((wf, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflowIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeWorkflowIdx === idx 
                      ? 'border-cyan-500 bg-cyan-500/5 text-white' 
                      : 'border-white/5 bg-slate-950/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <h4 className="text-xs font-bold mb-1 font-display">{wf.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{wf.desc}</p>
                </button>
              ))}
            </div>

            {/* Visual Flow diagram container */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
              <span className="text-[9px] font-mono text-gray-500 block mb-4">// System Automation Nodes Blueprint</span>
              
              <div className="flex flex-wrap items-center justify-start gap-3">
                {workflowsList[activeWorkflowIdx].nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className="p-3 rounded-lg bg-black border border-white/10 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-md">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      {node}
                    </div>
                    {i < workflowsList[activeWorkflowIdx].nodes.length - 1 && (
                      <ChevronRight className="h-3.5 w-3.5 text-cyan-500/40" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            INTERACTIVE PROPERTY SHOWCASE (3D Property Gallery)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">3D Gallery</span>
            <h2 className="text-3xl font-bold font-display">Interactive Property Showcase</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.example.note}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-3">
              {propertiesList.map((prop, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPropertyIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedPropertyIdx === idx 
                      ? 'border-amber-500 bg-amber-500/5 text-white' 
                      : 'border-white/5 bg-slate-950/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <h4 className="text-xs font-bold mb-1 font-display">{prop.name}</h4>
                  <p className="text-[10px] text-gray-400">{prop.loc}</p>
                </button>
              ))}
            </div>

            {/* Simulated 3D Angle Rendering Container */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    📐 SIMULATED 3D VIRTUAL ENGINE
                  </span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono font-bold">
                    ANGLE: {viewAngle}°
                  </span>
                </div>

                {/* Mock 3D Blueprint Display */}
                <div className="relative py-12 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05),transparent)]" />
                  
                  {/* Faux 3D Vector Rotating Building representation */}
                  <div className="relative h-20 w-32 border-2 border-[#D4AF37] rounded-lg transition-transform duration-300" style={{ transform: `rotateY(${viewAngle}deg) rotateX(15deg)` }}>
                    <div className="absolute inset-0 border border-[#D4AF37]/50" />
                    <div className="absolute top-1 left-2 text-[8px] font-mono text-cyan-400">3BHK LAYOUT</div>
                    <div className="absolute bottom-1 right-2 text-[8px] font-mono text-amber-500">UNIT ACTIVE</div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-gray-400">
                  <p className="font-bold text-white">{propertiesList[selectedPropertyIdx].name} ({propertiesList[selectedPropertyIdx].type})</p>
                  <p className="text-[11px] leading-relaxed">Amenities: {propertiesList[selectedPropertyIdx].amenity}</p>
                  <p className="text-[11px]">Area: {propertiesList[selectedPropertyIdx].area} | Pricing: <span className="text-amber-400 font-bold font-mono">{propertiesList[selectedPropertyIdx].price}</span></p>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <label className="text-[10px] font-mono text-gray-500 block mb-2">Drag Slider to Rotate Model</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={viewAngle}
                  onChange={(e) => setViewAngle(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 border border-white/10 rounded h-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SITE VISIT AUTOMATION WIDGET
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Visits Desk</span>
            <h2 className="text-3xl font-bold font-display">Site Visit Automation</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.example.note}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-4 font-display">Schedule Private VIP Tour</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">Select Visit Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-black border border-white/10 text-xs text-white rounded p-2.5 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 block mb-1">Select Pickup Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-black border border-white/10 text-xs text-white rounded p-2.5 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="11:00 AM">11:00 AM (Morning Shuttle)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon Shuttle)</option>
                    <option value="05:30 PM">05:30 PM (Sunset VIP Tour)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={startBookingSim}
                  className="w-full py-2.5 bg-cyan-500 text-black font-bold text-xs rounded hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" /> Simulate Reservation Sequence
                </button>
              </div>
            </div>

            {/* Simulated Live Alert sequence log */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md min-h-[260px] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                  Reservation Sequence Trigger Feed
                </span>
                <h4 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">
                  Simulated Real-Time Events Logs:
                </h4>

                <div className="space-y-3">
                  {!bookingSimulated ? (
                    <p className="text-xs text-gray-500 font-mono italic">Click button to run sequence simulation...</p>
                  ) : (
                    <>
                      {simStep >= 1 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-white animate-fade-in">
                          <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span>Slot Reserved successfully for {bookingDate} at {bookingTime}</span>
                        </div>
                      )}
                      {simStep >= 2 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-fade-in">
                          <MessageSquare className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                          <span>WhatsApp dispatch: Catalog, directions & broker name sent to buyer.</span>
                        </div>
                      )}
                      {simStep >= 3 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 animate-fade-in">
                          <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                          <span>AI Call dialed: Checked-in confirmation call scheduled 2 hours before pickup.</span>
                        </div>
                      )}
                      {simStep >= 4 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 animate-fade-in">
                          <CheckCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span>System Complete: Relationship Manager assigned & calendar slot locked.</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 text-[9px] font-mono text-gray-500 border-t border-white/5 pt-3 text-right">
                Atomic Lock Gate Sync Active
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            REAL ESTATE ROI CALCULATOR
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">ROI Calculator</span>
            <h2 className="text-3xl font-bold font-display">Real Estate Revenue Potential</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-6 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md space-y-5">
              
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>Monthly Acquired Leads</span>
                  <span className="text-white font-bold">{monthlyLeads} Leads</span>
                </div>
                <input
                  type="range" min="50" max="2500" step="50" value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 border border-white/10 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>Average Property Value</span>
                  <span className="text-white font-bold">{formatCurrency(avgPropValue)}</span>
                </div>
                <input
                  type="range" min="3000000" max="50000000" step="1000000" value={avgPropValue}
                  onChange={(e) => setAvgPropValue(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 border border-white/10 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>Current Conversion Rate</span>
                  <span className="text-white font-bold">{currConvRate}%</span>
                </div>
                <input
                  type="range" min="0.5" max="8.0" step="0.1" value={currConvRate}
                  onChange={(e) => setCurrConvRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 border border-white/10 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                  <span>Monthly Marketing Budget</span>
                  <span className="text-white font-bold">{formatCurrency(mktBudget)}</span>
                </div>
                <input
                  type="range" min="20000" max="500000" step="10000" value={mktBudget}
                  onChange={(e) => setMktBudget(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 border border-white/10 rounded"
                />
              </div>

            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block">
                  Projected Operational Improvements
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono text-gray-500">Unoptimized Closures</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">{currClosures} units</span>
                  </div>
                  <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] font-mono text-amber-400">AI-Optimized Closures</span>
                    <span className="text-sm font-extrabold text-amber-300 mt-1 block">{optClosures} units</span>
                  </div>
                </div>

                <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-mono text-emerald-400">Net Incremental Revenue</span>
                  <span className="text-xl font-extrabold text-emerald-300 mt-1 block">{formatCurrency(revIncrease)}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-gray-500">Projected Marketing ROI</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{roiPct}% ROI</span>
                </div>
                <a href="#lead_form" className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded transition-all">
                  Claim Your Growth Blueprint
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SUCCESS STORIES (CAROUSEL)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Success Stories</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.example.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.example.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2">
              {caseStudies.map((study, idx) => (
                <button
                  key={idx}
                  onClick={() => setCaseStudyIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    caseStudyIdx === idx 
                      ? 'border-cyan-500 bg-cyan-500/5 text-white animate-pulse' 
                      : 'border-white/5 bg-slate-950/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <h4 className="text-xs font-bold mb-1 font-display">{study.title}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">{study.metric}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
              <span className="text-[9px] font-mono text-gray-500 block mb-2">// Direct Operational Case Log</span>
              <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-2 mb-3">
                {caseStudies[caseStudyIdx].title}
              </h3>
              
              <div className="space-y-3 text-xs text-gray-400 mb-6">
                <p><span className="font-bold text-white block">Market Bottleneck:</span> {caseStudies[caseStudyIdx].challenge}</p>
                <p><span className="font-bold text-white block">Optimized Deployment:</span> {caseStudies[caseStudyIdx].solution}</p>
                <p><span className="font-bold text-white block">Direct ROI Achieved:</span> {caseStudies[caseStudyIdx].roi}</p>
              </div>

              {/* Success Stats Indicators */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                {caseStudies[caseStudyIdx].stats.map((stat, i) => (
                  <div key={i} className="p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-[9px] font-mono text-gray-500 block">{stat.label}</span>
                    <span className="text-xs font-bold text-white mt-1 block">
                      {stat.before} <span className="text-cyan-400">→ {stat.after}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            COMPLETE REAL ESTATE DASHBOARD PANEL
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Main Dashboard</span>
            <h2 className="text-3xl font-bold font-display">Unified Real Estate Console</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Centralized visibility summarizing leads, pipeline progression, site visit completions, and active transactional conversions:
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-md text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-white font-display uppercase tracking-widest">GrowthOS™ Management Console</span>
              </div>
              <span className="text-[9px] font-mono text-[#D4AF37] bg-amber-500/10 px-2 py-0.5 rounded font-bold">SYSTEM ACTIVE</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
              {[
                { label: 'Weekly Ingress Leads', val: '1,492', change: '+34%' },
                { label: 'Leads AI Pre-Scored', val: '1,220', change: '84%' },
                { label: 'Site Visits Reserved', val: '312', change: '+44%' },
                { label: 'Active Pipeline Stage', val: '₹42.8 Cr', change: '+29%' },
                { label: 'Broker Follow-Ups', val: '100%', change: 'Compliant' },
                { label: 'Transaction Closures', val: '14 units', change: 'Weekly' }
              ].map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[9px] font-mono text-gray-500 block leading-tight">{stat.label}</span>
                  <span className="text-sm font-extrabold text-white block mt-1.5">{stat.val}</span>
                  <span className="text-[8px] font-mono text-amber-400 block mt-0.5">{stat.change}</span>
                </div>
              ))}
            </div>

            {/* Live activity log feed */}
            <div>
              <span className="text-[10px] font-mono text-gray-500 block mb-2">// Real-Time System Event Feed</span>
              <div className="p-4 bg-black/80 rounded-lg border border-white/5 space-y-2 text-[10px] font-mono text-cyan-400 max-h-36 overflow-y-auto">
                <p>● [21:44:01] Pre-qualified lead Singhania (Budget: ₹4.5 Cr) routed to broker Mr. Dave.</p>
                <p>● [21:42:30] Sent interactive PDF layout coordinates to WhatsApp profile +91-984XXXX120.</p>
                <p>● [21:40:12] Missed call from client captured. Triggered automated text message under 15s.</p>
                <p>● [21:35:45] Closed contract verified. Direct Razorpay booking deposit settled.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            WHY CHOOSE NATTON DIGITAL (COMPARISON TABLE)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Why Natton Digital</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.definition.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="p-1 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md overflow-x-auto text-left">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[10px]">
                  <th className="p-4">Platform Capabilities</th>
                  <th className="p-4 text-amber-400">Natton Digital (AI Stack)</th>
                  <th className="p-4">Traditional Agencies</th>
                  <th className="p-4">Generic CRM Platforms</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="p-4 font-bold text-white font-display">{row.cap}</td>
                    <td className="p-4 text-gray-200 bg-amber-500/[0.02] font-medium border-l border-r border-amber-500/10">{row.natton}</td>
                    <td className="p-4 text-gray-400">{row.trad}</td>
                    <td className="p-4 text-gray-400">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            FREQUENTLY ASKED QUESTIONS
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">FAQ Desk</span>
            <h2 className="text-3xl font-bold font-display">{"Frequently Asked Questions"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Read comprehensive answers regarding security compliance, CRM integrations, and voice dialer capabilities:
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 text-left">
            {faqList.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-white/5 bg-slate-950/40 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-bold font-display text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp className="h-4 w-4 text-amber-400" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-[11px] text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            HIGH CONVERTING CONSULTATION LEAD FORM
           ========================================== */}
        <div id="lead_form" className="mb-24 max-w-xl mx-auto text-left">
          <div className="p-6 sm:p-10 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Ready to Elevate?</span>
              <h3 className="text-xl font-bold font-display text-white">Book Real Estate Consultation</h3>
              <p className="text-[11px] text-gray-400">
                Configure your tailored property pipeline with our engineers. Set up in under 7 days.
              </p>
            </div>

            {success ? (
              <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Consultation Request Dispatched Successfully!</h4>
                <p className="text-xs text-gray-400">Our senior real estate technicians will message you on WhatsApp shortly.</p>
              </div>
            ) : (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            )}

            {/* Live Webhook Terminal */}
            {logs.length > 0 && (
              <div className="mt-6">
                <span className="text-[9px] font-mono text-gray-500 block mb-2">// Simulated Integration Hub Webhooks</span>
                <div className="p-4 bg-black/80 rounded border border-white/5 space-y-1.5 text-[9px] font-mono text-cyan-400">
                  {logs.map((log, i) => (
                    <p key={i}>● {log}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            FINAL CALL TO ACTION SECTION
           ========================================== */}
        

      </div>
    </div>
  );
}
