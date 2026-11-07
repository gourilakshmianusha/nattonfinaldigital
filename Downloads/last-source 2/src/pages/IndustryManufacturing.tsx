import './industry-process-layout.css';
import archivePage from '../content/ten-pages/manufacturing.json';
import {ArchiveHeroBackground,ArchiveContentGroup,ArchiveFAQ} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Cpu, TrendingUp, Search, CheckCircle, Layers, Workflow, 
  BarChart2, ArrowRight, Play, Zap, Star, MessageSquare, Users, Globe, 
  ChevronRight, Check, HelpCircle, ChevronDown, ChevronUp, Send, 
  Sliders, DollarSign, Plus, RefreshCw, Clock, Phone, Shield, 
  Briefcase, Lock, X, Activity, Building, Database, Mail, FileText, 
  CheckCheck, Settings, Factory, Truck, Boxes, ArrowUpRight, 
  PieChart, Share2, History, Network
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function IndustryManufacturing({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // SMART FACTORY NETWORK CANVAS BACKGROUND
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

    // Grid nodes and connecting lines
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; type: 'core' | 'agent' | 'terminal'; label: string; pulse: number }> = [];
    const coreLabels = ['ERP SAP', 'MES Gateway', 'GrowthOS Hub', 'CRM Core', 'Agentic Engine'];
    
    // Create random background nodes representing factory IoT
    for (let i = 0; i < 20; i++) {
      const isCore = i < 5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: isCore ? 'core' : (Math.random() > 0.5 ? 'agent' : 'terminal'),
        label: isCore ? coreLabels[i] : `IoT_Sensor_${100 + i}`,
        pulse: Math.random() * Math.PI
      });
    }

    // Active data packets flowing through connections
    const packets: Array<{ from: number; to: number; progress: number; speed: number; color: string }> = [];
    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const from = Math.floor(Math.random() * nodes.length);
      // Find a close node
      let to = (from + 1) % nodes.length;
      let minDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        if (i === from) continue;
        const d = Math.hypot(nodes[from].x - nodes[i].x, nodes[from].y - nodes[i].y);
        if (d < minDist && d < 250) {
          minDist = d;
          to = i;
        }
      }
      
      packets.push({
        from,
        to,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        color: Math.random() > 0.5 ? '#00f5ff' : '#f97316' // Electric Blue or Orange
      });
    };

    // Pre-spawn some packets
    for (let i = 0; i < 8; i++) {
      spawnPacket();
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw engineering schematic grid lines (Steel Gray)
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Update and draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.15;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw packets
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
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();

          // Add subtle trail/glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Update and draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        // Bounce off bounds
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const isCore = n.type === 'core';
        const pulseSize = Math.sin(n.pulse) * (isCore ? 3 : 1.5);
        
        // Glow effect for cores
        if (isCore) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00f5ff';
        }

        // Draw node center
        ctx.fillStyle = isCore ? '#00f5ff' : '#f97316';
        ctx.beginPath();
        ctx.arc(n.x, n.y, isCore ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw outer pulse ring
        ctx.strokeStyle = isCore ? 'rgba(0, 245, 255, 0.25)' : 'rgba(249, 115, 22, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, (isCore ? 12 : 8) + pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Draw label text for Core components
        if (isCore && width > 640) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '9px monospace';
          ctx.fillText(n.label, n.x + 12, n.y + 3);
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
  // BLUEPRINT INTERACTIVE WORKFLOW
  // ==========================================
  const [activeBlueprintStep, setActiveBlueprintStep] = useState<number>(0);
  const blueprintSteps = [
{ title: "Understand the capability and buyer", val: "Agreed scope", desc: "Review the products, applications, target accounts, regions and minimum commercial or technical fit. Identify who evaluates the supplier and which questions the current website leaves unanswered." },
{ title: "Build a credible information foundation", val: "Agreed scope", desc: "Prepare capability pages, product details, approved imagery and useful enquiry forms. Agree ownership, required RFQ fields, measurement and the material that can be shared publicly." },
{ title: "Create relevant market visibility", val: "Agreed scope", desc: "Develop the agreed SEO, content and campaign work around real applications and buyer needs. Select channels according to the market rather than assuming every manufacturer needs the same platform." },
{ title: "Route enquiries to the right people", val: "Agreed scope", desc: "Connect the incoming requirement to an owner and the appropriate technical or commercial review. Use reminders and status updates for agreed routine steps, with people responsible for quotations and commitments." },
{ title: "Review fit, follow-up and market response", val: "Agreed scope", desc: "Review enquiry relevance, RFQ acceptance and recorded opportunity movement with the team. Improve the message, pages and handovers, and expand the scope when a clear business need emerges." }
];

  // ==========================================
  // SEGMENTS & PAIN POINTS DATA
  // ==========================================
  const segments = [
{ name: "MSME manufacturers and component suppliers", desc: "Help buyers understand what you make, where your capabilities fit and how to start a useful conversation. Natton Digital connects industrial websites, B2B marketing and enquiry workflows for manufacturers, suppliers and growing production businesses." },
{ name: "Industrial equipment and engineering businesses", desc: "Help buyers understand what you make, where your capabilities fit and how to start a useful conversation. Natton Digital connects industrial websites, B2B marketing and enquiry workflows for manufacturers, suppliers and growing production businesses." },
{ name: "B2B suppliers, distributors and exporters", desc: "Help buyers understand what you make, where your capabilities fit and how to start a useful conversation. Natton Digital connects industrial websites, B2B marketing and enquiry workflows for manufacturers, suppliers and growing production businesses." },
{ name: "Focused sales or business-development teams within larger enterprises", desc: "Help buyers understand what you make, where your capabilities fit and how to start a useful conversation. Natton Digital connects industrial websites, B2B marketing and enquiry workflows for manufacturers, suppliers and growing production businesses." }
];

  const painPoints = [
{ title: "Strong capabilities, a weak online explanation", symptom: "Buyers need clear products, applications, capabilities and contact routes. A general company brochure may not answer the questions behind a specific sourcing requirement.", cure: "Buyers need clear products, applications, capabilities and contact routes. A general company brochure may not answer the questions behind a specific sourcing requirement." },
{ title: "Enquiries lack the information to assess fit", symptom: "A useful RFQ route can capture the product or application, specifications, quantities, destination and timing that your sales team needs, with an appropriate way to submit documents.", cure: "A useful RFQ route can capture the product or application, specifications, quantities, destination and timing that your sales team needs, with an appropriate way to submit documents." },
{ title: "Technical and commercial follow-up lose context", symptom: "Define ownership and handovers between business development, technical teams and commercial teams so the next action remains visible.", cure: "Define ownership and handovers between business development, technical teams and commercial teams so the next action remains visible." },
{ title: "Marketing reports stop before business relevance", symptom: "Review relevant enquiries, accepted RFQs, follow-up and opportunity progress alongside visibility and campaign activity. Volume alone can hide requests your business cannot serve.", cure: "Review relevant enquiries, accepted RFQs, follow-up and opportunity progress alongside visibility and campaign activity. Volume alone can hide requests your business cannot serve." }
];

  // ==========================================
  // MARKETING ENGINE TABS & SIMULATED ANALYTICS
  // ==========================================
  const [activeMktTab, setActiveMktTab] = useState<'google' | 'linkedin' | 'export'>('linkedin');
  const marketingSuite = {
    linkedin: {
      metrics: [{ l: 'Weekly HNI/B2B Leads', v: '312' }, { l: 'Avg Cost Per RFQ', v: '₹840.00' }, { l: 'LinkedIn Match Quality', v: '96%' }],
      campaigns: [
        { name: 'OEM Procurement Officers (India & MENA)', budget: '₹1,20,000', leads: '144', cost: '₹833/lead' },
        { name: 'Automotive Component OEM Stakeholders', budget: '₹75,000', leads: '98', cost: '₹765/lead' },
        { name: 'Heavy Machinery Replacement Parts Buyers', budget: '₹45,000', leads: '70', cost: '₹642/lead' }
      ]
    },
    google: {
      metrics: [{ l: 'Search Ad Impressions', v: '48,200' }, { l: 'RFQ Click Conversion', v: '4.8%' }, { l: 'Avg CPC (High Intent)', v: '₹62.00' }],
      campaigns: [
        { name: 'High-Intent "B2B metal forging exporter"', budget: '₹1,50,000', leads: '185', cost: '₹810/lead' },
        { name: 'Industrial Boiler Manufacturer Bangalore', budget: '₹90,000', leads: '105', cost: '₹857/lead' },
        { name: 'Custom Plastic Injection Molding Supplier', budget: '₹60,000', leads: '84', cost: '₹714/lead' }
      ]
    },
    export: {
      metrics: [{ l: 'Global Trade Enquiries', v: '184' }, { l: 'Target Regions', v: 'Europe / USA / GCC' }, { l: 'Inbound RFQ Pipeline', v: '₹1.8 Cr' }],
      campaigns: [
        { name: 'US Distributor Partnership Drive', budget: 'Organic SEO/AEO', leads: '64 Global', cost: 'High-Yield' },
        { name: 'Europe ISO-9001 Forged Metals Target', budget: 'Organic SEO/AEO', leads: '72 Global', cost: 'High-Yield' },
        { name: 'GCC Industrial Construction Supplies', budget: 'Organic SEO/AEO', leads: '48 Global', cost: 'High-Yield' }
      ]
    }
  };

  // ==========================================
  // GROWTHOS™ CRM SIMULATOR
  // ==========================================
  const [crmLeads, setCrmLeads] = useState([
    { id: '1', company: 'Tata Motors OEM', rfqType: 'Cast Suspension Arms', val: '₹42,00,000', stage: 'new' },
    { id: '2', company: 'Godrej Aerospace', rfqType: 'Precision Titanium Rings', val: '₹1,85,00,000', stage: 'qualified' },
    { id: '3', company: 'Middle East Tech Machinery', rfqType: 'Hydraulic Piston Assembly', val: '₹64,00,000', stage: 'rfq_sent' },
    { id: '4', company: 'Bharat Electronics', rfqType: 'Heatsink Thermal Blocks', val: '₹28,00,000', stage: 'ordered' }
  ]);

  const advanceStage = (leadId: string) => {
    setCrmLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;
      let nextStage = lead.stage;
      if (lead.stage === 'new') nextStage = 'qualified';
      else if (lead.stage === 'qualified') nextStage = 'rfq_sent';
      else if (lead.stage === 'rfq_sent') nextStage = 'ordered';
      else if (lead.stage === 'ordered') nextStage = 'new';
      return { ...lead, stage: nextStage };
    }));
  };

  // ==========================================
  // BUSINESSOS™ CHAT SIMULATION
  // ==========================================
  const [chatLog, setChatLog] = useState([
    { sender: 'user', text: 'Hi, we saw your ISO certificates. Need custom pricing for 5,000 units of part OEM-942.', time: '14:30' },
    { sender: 'system', text: 'Greetings from Steel Industrial Bot! 🏭⚙️\n\nI can instantly dispatch product catalog specifications, check live delivery times, or connect you to our lead engineering architect.\n\nChoose an action:\n1️⃣ Get Technical Datasheet & Pricing Guide PDF\n2️⃣ Check Factory Delivery Lead Times\n3️⃣ Initiate Custom RFQ Blueprint Upload', time: '14:30' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: userText, time: '14:31' }]);
    setChatInput('');
    setBotTyping(true);

    setTimeout(() => {
      let reply = 'Our AI Industry Specialist is compiling inventory logs...';
      if (userText.includes('1')) {
        reply = '📄 *Datasheet Dispatched!*\n\nHere is the official catalog for **Industrial Parts OEM-940 Series** including full material tolerances, ISO-9001 compliance sheets, and bulk cost guidelines.\n\n👉 [Download Technical Sheet PDF]';
      } else if (userText.includes('2')) {
        reply = '⏳ *Factory Production Load:* ACTIVE\n\n- Standard fabrication: 12-14 business days.\n- Surface processing / coating: +3 days.\n- Logistic dispatch to Port: 48 hours.\n\nWould you like me to reserve a spot in the July production queue? Reply "YES" to schedule.';
      } else if (userText.includes('3') || userText.toLowerCase().includes('rfq') || userText.toLowerCase().includes('blueprint')) {
        reply = '📤 *Custom Blueprint Upload Initialized:*\n\nPlease drag and drop your CAD .dwg or .pdf blueprint here. Our AI AgenticOS™ parser will immediately extract tolerances, dimensions, and alloy classes for engineer verification.';
      } else if (userText.toLowerCase() === 'yes') {
        reply = '✅ *Reservation Logged!*\n\nI have locked a preliminary production line slot for Tata/OEM parameters. A regional supply partner will coordinate formal contract terms via your verified phone. Thank you!';
      } else {
        reply = 'Understood. I have recorded your requirements in the GrowthOS™ registry. An industrial consulting engineer will review this thread and dial you shortly.';
      }
      setChatLog(prev => [...prev, { sender: 'system', text: reply, time: '14:32' }]);
      setBotTyping(false);
    }, 1100);
  };

  // ==========================================
  // AGENTICOS™ 3D FACTORY NETWORK AGENTS
  // ==========================================
  const [activeAgent, setActiveAgent] = useState('sales');
  const agents = [
{ id: 'sales', name: "Industrial websites & capability pages", role: "Organise products, applications, manufacturing capabilities and enquiry routes so potential buyers can evaluate fit. Publish specifications, facilities and certifications only when accurate and approved.", trigger: 'ON_RFQ_FORM_FIRED -> parse_cad_pdf() AND calculate_cost_model()' },
{ id: 'operations', name: "SEO for products, capabilities & applications", role: "Build useful pages around what buyers are researching: the product, manufacturing process, application or sourcing requirement. Use clear technical language supplied and reviewed by your subject experts.", trigger: 'ON_ORDER_CONFIRMED -> update_mes_schedule() AND dispatch_plant_notifications()' },
{ id: 'procurement', name: "Focused B2B campaigns", role: "Choose search, LinkedIn or other relevant channels around the buyers and markets you can serve. Match campaigns to an appropriate capability page, enquiry route and follow-up owner.", trigger: 'IF low_alloy_stock < safety_limit THEN email_supplier_bids()' },
{ id: 'support', name: "Technical content & sales-support material", role: "Turn approved engineering knowledge into application explainers, capability profiles, case material and practical sales assets. Help both technical evaluators and commercial stakeholders understand the offer.", trigger: 'ON_DISTRIBUTOR_QUERY -> query_logistics_api() AND output_tracking_coordinates()' },
{ id: 'distributor', name: "RFQ capture & sales coordination", role: "Create a structured enquiry process with agreed fields, routing and CRM stages. Keep the request, relevant documents, owner and next follow-up connected, with technical requirements reviewed by your team.", trigger: 'ON_BULK_ORDER -> verify_credit_limit() AND generate_proforma_invoice()' },
{ id: 'reporting', name: "Scoped business-system connections", role: "Assess notifications and information updates between the CRM, approved forms and existing business systems. ERP, stock control, production planning and dispatch automation require their own discovery and implementation scope.", trigger: 'ON_FRIDAY_1700 -> compile_weekly_kpis() AND email_board_summary()' }
];

  // ==========================================
  // AUTOMATION WORKFLOWS SELECTOR
  // ==========================================
  const [activeFlowIdx, setActiveFlowIdx] = useState(0);
  const workflows = [
{
      title: "Understand the capability and buyer",
      desc: "Review the products, applications, target accounts, regions and minimum commercial or technical fit. Identify who evaluates the supplier and which questions the current website leaves unanswered.",
      nodes: ['1. B2B Lead Captured', '2. Voice Pre-Qual Call', '3. CAD Blueprint Uploaded', '4. AI Margin Calculation', '5. Automated RFQ Drafted', '6. Custom ERP Order Created']
    },
{
      title: "Build a credible information foundation",
      desc: "Prepare capability pages, product details, approved imagery and useful enquiry forms. Agree ownership, required RFQ fields, measurement and the material that can be shared publicly.",
      nodes: ['1. Distributor Chat Ping', '2. stock Check API Node', '3. Proforma Bill Sent', '4. Ledger Verification', '5. Dispatch Logistics Sync', '6. Automated Resolution Ticket']
    },
{
      title: "Create relevant market visibility",
      desc: "Develop the agreed SEO, content and campaign work around real applications and buyer needs. Select channels according to the market rather than assuming every manufacturer needs the same platform.",
      nodes: ['1. Support Portal Ticket', '2. Text Intent Parsing', '3. KB Search Trigger', '4. Proposed Solution Generated', '5. Escalation Flag If Blocked', '6. CRM Update Resolved']
    },
{
      title: "Route enquiries to the right people",
      desc: "Connect the incoming requirement to an owner and the appropriate technical or commercial review. Use reminders and status updates for agreed routine steps, with people responsible for quotations and commitments.",
      nodes: ['1. ERP Shipment Logged', '2. CRM Deal Closed', '3. Finance Reconciliation', '4. Commission Triggered', '5. Executive Dashboard Refresh', '6. Performance Report Sent']
    },
{
      title: "Review fit, follow-up and market response",
      desc: "Review enquiry relevance, RFQ acceptance and recorded opportunity movement with the team. Improve the message, pages and handovers, and expand the scope when a clear business need emerges.",
      nodes: ['1. B2B Lead Captured', '2. Voice Pre-Qual Call', '3. CAD Blueprint Uploaded', '4. AI Margin Calculation', '5. Automated RFQ Drafted', '6. Custom ERP Order Created']
    }
];

  // ==========================================
  // ERP INTEGRATION DIAGRAM NODES
  // ==========================================
  const erpIntegrations = [
    { name: 'SAP Integration', status: 'SAP RFC Connector Connected', latency: '0.4s', icon: Settings, tech: 'Bi-directional RFC interface syncing raw catalog logs & credit records.' },
    { name: 'Tally Prime Hook', status: 'Tally XML Port Syncing', latency: '1.2s', icon: Database, tech: 'Automated ledger posting and direct tax voucher reconciliation on deal close.' },
    { name: 'Zoho Books / CRM', status: 'API v2 Webhook Live', latency: '0.2s', icon: Layers, tech: 'Seamless contact sync, payment reminders, and digital pipeline routing.' },
    { name: 'ERPNext Bridge', status: 'REST API Connection', latency: '0.5s', icon: Workflow, tech: 'Synchronizes item blueprints, Bill of Materials (BOM), and material requests.' },
    { name: 'MS Dynamics 365', status: 'OData Service Syncing', latency: '0.8s', icon: Cpu, tech: 'Direct ERP sales pipeline updates and customized production schedule checks.' },
    { name: 'Custom Proprietary ERP', status: 'Sovereign Database Link', latency: 'Custom', icon: Network, tech: 'Tailored Postgres/MySQL queries mapping proprietary database structures.' }
  ];

  // ==========================================
  // POPULAR USE CASES
  // ==========================================
  const useCases = [
{ title: "Industrial websites & capability pages", detail: "Organise products, applications, manufacturing capabilities and enquiry routes so potential buyers can evaluate fit. Publish specifications, facilities and certifications only when accurate and approved." },
{ title: "SEO for products, capabilities & applications", detail: "Build useful pages around what buyers are researching: the product, manufacturing process, application or sourcing requirement. Use clear technical language supplied and reviewed by your subject experts." },
{ title: "Focused B2B campaigns", detail: "Choose search, LinkedIn or other relevant channels around the buyers and markets you can serve. Match campaigns to an appropriate capability page, enquiry route and follow-up owner." },
{ title: "Technical content & sales-support material", detail: "Turn approved engineering knowledge into application explainers, capability profiles, case material and practical sales assets. Help both technical evaluators and commercial stakeholders understand the offer." },
{ title: "RFQ capture & sales coordination", detail: "Create a structured enquiry process with agreed fields, routing and CRM stages. Keep the request, relevant documents, owner and next follow-up connected, with technical requirements reviewed by your team." },
{ title: "Scoped business-system connections", detail: "Assess notifications and information updates between the CRM, approved forms and existing business systems. ERP, stock control, production planning and dispatch automation require their own discovery and implementation scope." }
];

  // ==========================================
  // MANUFACTURING ROI CALCULATOR
  // ==========================================
  const [monthlyLeads, setMonthlyLeads] = useState<number>(300);
  const [dealValue, setDealValue] = useState<number>(800000); // ₹8 Lakh avg
  const [salesTeam, setSalesTeam] = useState<number>(8);
  const [softwareCost, setSoftwareCost] = useState<number>(45000); // ₹45k current monthly spend

  // Current Math
  const curConvRate = 2.0; // 2% current conversion rate standard
  const curClosures = Math.round(monthlyLeads * (curConvRate / 100));
  const curRevenue = curClosures * dealValue;

  // Optimized Math (Natton Digital's automation and instant AI follow-up increases close rate)
  const optConvRate = 4.8; // Boost to 4.8% through faster qualification and prompt WhatsApp catalog dispatch
  const optClosures = Math.round(monthlyLeads * (optConvRate / 100));
  const optRevenue = optClosures * dealValue;

  // Results
  const addedRevenue = optRevenue - curRevenue;
  const adminSavings = salesTeam * 15 * 500 * 4; // 15 hours saved per agent per week * hourly rate equivalents
  const softwareOptimized = Math.max(10000, softwareCost * 0.4); // Redundant stack reduction saves ~40%
  const totalFinancialGain = addedRevenue + adminSavings + (softwareCost - softwareOptimized);
  const autoROI = Math.round((totalFinancialGain / 60000) * 100); // Estimate based on standard Natton integration package

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // ==========================================
  // SUCCESS STORIES (CAROUSEL)
  // ==========================================
  const [carouselIdx, setCarouselIdx] = useState(0);
  const caseStudies = [
{
      type: "Manufacturing — illustrative example",
      company: "Manufacturing — illustrative example",
      metric: "Illustrative workflow",
      impact: "Illustrative example. No live customer data or business-system connection is used.",
      results: [
        { label: 'Avg RFQ Drafting Time', before: '48 hours', after: '12 minutes' },
        { label: 'Outbound Response Speed', before: '14 hours', after: '< 45 seconds' },
        { label: 'Pipeline Closed Value', before: '₹12 Lakh', after: '₹84 Lakh' }
      ]
    },
{
      type: "Manufacturing — illustrative example",
      company: "Manufacturing — illustrative example",
      metric: "Illustrative workflow",
      impact: "Illustrative example. No live customer data or business-system connection is used.",
      results: [
        { label: 'Supplier Response Time', before: '5 days', after: '4 hours' },
        { label: 'Production Line Downtimes', before: '12%', after: '< 1%' },
        { label: 'Material Costs Optimised', before: '0%', after: '14.2% Saved' }
      ]
    },
{
      type: "Manufacturing — illustrative example",
      company: "Manufacturing — illustrative example",
      metric: "Illustrative workflow",
      impact: "Illustrative example. No live customer data or business-system connection is used.",
      results: [
        { label: 'Monthly Global RFQs', before: '8 leads', after: '42 leads' },
        { label: 'Customer Trust Rating', before: '64%', after: '98%' },
        { label: 'Annual Export Contracts', before: '₹2.8 Cr', after: '₹14.5 Cr' }
      ]
    },
{
      type: "Manufacturing — illustrative example",
      company: "Manufacturing — illustrative example",
      metric: "Illustrative workflow",
      impact: "Illustrative example. No live customer data or business-system connection is used.",
      results: [
        { label: 'Sales Rep Data-Entry Hours', before: '14 hrs/wk', after: '0 hrs/wk' },
        { label: 'Billing Dispute Frequency', before: '18%', after: '0%' },
        { label: 'Cashflow Collection Speed', before: '32 days', after: '9 days' }
      ]
    }
];

  // ==========================================
  // COMPARISON MATRIX
  // ==========================================
  const matrix = [
{ cap: "An agreed buyer, capability and market plan", natton: "An agreed buyer, capability and market plan", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Industrial website or capability-page improvements", natton: "Industrial website or capability-page improvements", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "SEO and technical content priorities", natton: "SEO and technical content priorities", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Relevant B2B campaign assets and enquiry routes", natton: "Relevant B2B campaign assets and enquiry routes", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "A scoped RFQ/CRM workflow and review framework", natton: "A scoped RFQ/CRM workflow and review framework", trad: "Assessed against your current process", generic: "Assessed against your current process" }
];

  // ==========================================
  // 15 FREQUENTLY ASKED QUESTIONS
  // ==========================================
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqList = [
{ q: "Is this suitable for an MSME manufacturer or an industrial supplier?", a: "Yes. A smaller manufacturer may begin with clear capability pages, search visibility and an organised enquiry process. An established supplier or enterprise team may need more detailed content, campaign segmentation and CRM coordination. The scope follows your market, capacity and sales process." },
{ q: "How is manufacturing marketing different from ordinary consumer marketing?", a: "A business requirement may involve technical evaluators, procurement and commercial stakeholders. We therefore build information around specifications, applications, capabilities and the questions needed to assess a supplier. Channels and content are chosen for your buyers; we do not assume that a broad consumer-style campaign is the right starting point." },
{ q: "Will the website manage our inventory, production and ERP?", a: "Those are separate operational requirements. This marketing scope can connect enquiry information, notifications and agreed updates where suitable access and integrations exist. Full ERP implementation, stock control, production planning or automated ordering needs dedicated discovery, responsibilities and validation before it is promised." },
{ q: "What technical information do we need to provide?", a: "Typical inputs include product categories, specifications, applications, manufacturing capabilities, service regions, approved facility imagery and the questions needed for an RFQ. Your team reviews technical claims, certificates and downloadable documents. Confidential customer drawings or sensitive production information should not be published as marketing content." },
{ q: "Can you help with export enquiries or specific B2B markets?", a: "We can assess a defined market, buyer profile and offer, then plan appropriate pages, content and campaigns. That assessment includes language, logistics and commercial information your team can support. Marketing activity cannot guarantee export orders or remove the need for your own commercial and technical evaluation." },
{ q: "How do you judge success and plan ongoing work?", a: "We agree what makes an enquiry useful, which RFQs are accepted and which stages the team will record. Reviews connect website and campaign activity with that business context. Media budgets, implementation work, subscriptions and ongoing management are identified separately in the proposal, and the scope can expand when the evidence supports it." }
];

  // ==========================================
  // LEAD FORM Webhook simulation & state
  // ==========================================
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSegment, setFormSegment] = useState('Manufacturing Companies');
  const [formLocation, setFormLocation] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTeamSize, setFormTeamSize] = useState('10 - 50');
  const [formChallenges, setFormChallenges] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValues, setCaptchaValues] = useState({ num1: 0, num2: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    setCaptchaValues({
      num1: Math.floor(Math.random() * 8) + 2,
      num2: Math.floor(Math.random() * 8) + 2
    });
  }, []);

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaInput) !== (captchaValues.num1 + captchaValues.num2)) {
      alert('Verification captcha code is incorrect. Please compute again.');
      return;
    }
    setIsSubmitting(true);
    setTerminalLogs([
      '⚡ Intercepting industrial procurement lead payload...',
      '📡 Parsing variables to GoHighLevel (GHL) contact schema...',
      '🔗 Firing secure n8n integration webhook node...',
      '🛠️ Validating duplicate company registries in CRM...'
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '📊 Synced! Recorded CRM Contact ID: GHL_MFG_9041',
        '🏭 ERP synchronization node: STATUS_GREEN',
        '💬 Dispatched ISO certifications catalog via WhatsApp API.'
      ]);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
    }, 1800);
  };

  return (
    <div className={`min-h-screen py-8 overflow-hidden relative selection:bg-orange-500 selection:text-black transition-colors duration-500 ${darkMode ? 'bg-[#0b1329] text-slate-100' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Visual background atmospheric elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[550px] h-[550px] bg-orange-950/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-5 right-20 w-[600px] h-[600px] bg-cyan-950/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="mb-8 text-xs font-mono text-slate-500 flex items-center gap-1.5 border-b border-slate-800 pb-4">
          <button onClick={() => setPath('home')} className="hover:text-orange-400 transition-colors">Home</button> 
          <span>/</span> 
          <a className="text-slate-400" href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');}}>Industries</a> 
          <span>/</span> 
          <span className="text-orange-400 font-semibold font-mono">Manufacturing</span>
        </div>

        {/* ==========================================
            HERO SECTION (Industrial Smart Factory theme)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 relative min-h-[550px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden -z-20 border border-slate-800 bg-slate-950/60">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-85" />
          </div>

          <div className="archive-hero-copy lg:col-span-7 space-y-6 z-10 p-6 sm:p-10 text-left">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Make your capabilities easier to"} <br />
<span className="bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-400 bg-clip-text text-transparent">{"find. Your enquiries easier to act on."}</span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#lead_form" 
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-black font-extrabold rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4 text-black" />
              </a>
              <a 
                href="#blueprint" 
                className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-950/40 hover:bg-slate-900 hover:border-cyan-400 transition-all flex items-center gap-2 text-sm font-semibold"
              >
                Explore Smart Blueprint
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-slate-500 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-orange-400">{"Useful information"}</span>
              <span className="flex items-center gap-1.5 text-cyan-400">{"A clearer customer journey"}</span>
              <span className="flex items-center gap-1.5 text-slate-400">{"People before platforms"}</span>
            </div>
          </div>

          {/* Smart Factory Ecosystem HUD visualization */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            SOLUTIONS BUILT FOR (SEGMENTS)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Solutions Built For</span>
            <h2 className="text-3xl font-bold font-display">{"Who this can help"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {segments.map((seg, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-orange-500/30 transition-all hover:translate-y-[-2px] flex flex-col justify-between group">
                <div>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-orange-500/20">
                    <Building className="h-4 w-4 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1.5 font-display">{seg.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{seg.desc}</p>
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
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Operational Bottlenecks</span>
            <h2 className="text-3xl font-bold font-display">{"Recognise the gaps. Choose the right priority."}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"We begin with the business problem, then agree the work that will help address it."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {painPoints.map((p, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-1 w-0 bg-orange-500 transition-all group-hover:w-full" />
                <div>
                  <h3 className="text-xs font-bold text-slate-200 mb-3 border-b border-slate-800/60 pb-1 flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {p.title}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] font-mono text-rose-400 uppercase tracking-wider block">Symptom</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.symptom}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider block">Natton Optimisation</span>
                      <p className="text-[10px] text-slate-300 mt-0.5 font-medium">{p.cure}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            GROWTH BLUEPRINT (INTERACTIVE WORKFLOW)
           ========================================== */}
        <div id="blueprint" className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Blueprint Process</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-2">
              {blueprintSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBlueprintStep(idx)}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    activeBlueprintStep === idx 
                      ? 'border-orange-500 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold font-mono">{step.title}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${activeBlueprintStep === idx ? 'bg-orange-500 text-black font-bold' : 'bg-slate-900 text-slate-400'}`}>
                    {step.val}
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[250px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
              <div>
                <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block mb-1">
                  Active Pipeline Node {activeBlueprintStep + 1} of {blueprintSteps.length}
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-display border-b border-slate-800 pb-2 mb-3">
                  {blueprintSteps[activeBlueprintStep].title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {blueprintSteps[activeBlueprintStep].desc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-[10px] font-mono text-slate-500">Node Status: Operational</span>
                <button 
                  onClick={() => setActiveBlueprintStep((prev) => (prev + 1) % blueprintSteps.length)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 font-mono"
                >
                  Next Step <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
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
            <h2 className="text-3xl font-bold font-display">B2B Lead Generation Engine</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.services[2].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-3">
              {[
                { id: 'linkedin', title: 'LinkedIn Ads Segmenting', icon: Globe, desc: 'Targets procurement managers and machinery distributors directly.' },
                { id: 'google', title: 'Google Keyword Capture', icon: Search, desc: 'Intercepts high-intent searches like "precision alloy OEM supplier".' },
                { id: 'export', title: 'Global Export Funnels', icon: Network, desc: 'Custom international SEO campaigns optimized for US & European buyers.' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMktTab(tab.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeMktTab === tab.id 
                      ? 'border-cyan-500 bg-cyan-500/5 text-white' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <h3 className="text-xs font-bold font-display flex items-center gap-1.5 mb-1 font-mono">
                    <tab.icon className="h-4 w-4 text-cyan-400" />
                    {tab.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{tab.desc}</p>
                </button>
              ))}
            </div>

            {/* Simulated Live Analytics Dashboard */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400">MARKETING ANALYTICS CONSOLE</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Channel: {activeMktTab}</span>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {marketingSuite[activeMktTab].metrics.map((stat, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 text-left">
                    <span className="text-[9px] font-mono text-slate-500 block">{stat.l}</span>
                    <span className="text-sm font-extrabold text-slate-100 mt-1 block font-mono">{stat.v}</span>
                  </div>
                ))}
              </div>

              {/* Campaign Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-2">Campaign Identifier</th>
                      <th className="pb-2">Allocated Budget</th>
                      <th className="pb-2">Acquired Leads</th>
                      <th className="pb-2 text-right">Avg Cost Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketingSuite[activeMktTab].campaigns.map((camp, idx) => (
                      <tr key={idx} className="border-b border-slate-800/40">
                        <td className="py-2.5 text-slate-200 font-medium">{camp.name}</td>
                        <td className="py-2.5 text-slate-400">{camp.budget}</td>
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
            GROWTHOS™ FOR MANUFACTURING (CRM PIPELINE)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">CRM Suite</span>
            <h2 className="text-3xl font-bold font-display">GrowthOS™ For Manufacturing</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.services[0].description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {['new', 'qualified', 'rfq_sent', 'ordered'].map((stage) => {
              const stageLeads = crmLeads.filter(lead => lead.stage === stage);
              const stageLabels: Record<string, { title: string; color: string; border: string }> = {
                new: { title: '1. New Inquiries', color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-800' },
                qualified: { title: '2. Qualified RFQs', color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/20' },
                rfq_sent: { title: '3. Quote Dispatched', color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/20' },
                ordered: { title: '4. Closed & Won', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' }
              };
              
              return (
                <div key={stage} className={`p-4 rounded-xl border ${stageLabels[stage].border} bg-slate-950/60 flex flex-col justify-between min-h-[220px]`}>
                  <div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${stageLabels[stage].color} inline-block mb-3`}>
                      {stageLabels[stage].title}
                    </span>
                    
                    <div className="space-y-2">
                      {stageLeads.length === 0 ? (
                        <p className="text-[9px] text-slate-600 font-mono italic py-4">No active inquiries</p>
                      ) : (
                        stageLeads.map((lead) => (
                          <div 
                            key={lead.id} 
                            onClick={() => advanceStage(lead.id)}
                            className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all cursor-pointer relative group"
                          >
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">{lead.rfqType}</span>
                            <span className="text-[11px] font-bold text-slate-200 block mt-0.5 group-hover:text-orange-400 transition-colors">{lead.company}</span>
                            <span className="text-[10px] font-mono text-cyan-400 block mt-1 font-semibold">{lead.val}</span>
                            <span className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-600 group-hover:text-orange-400">Advance →</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-slate-600 mt-4 block">Click card to move pipeline</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            BUSINESSOS™ COMMUNICATION PLATFORM
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Communication Platform</span>
            <h2 className="text-3xl font-bold font-display">BusinessOS™ Communication Portal</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.services[4].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-800 bg-[#090d1c] shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Factory className="h-3 w-3 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Industrial Chat Bot</h3>
                    <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">● Online</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-slate-500">WHATSAPP sandbox</span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-[10px] leading-relaxed font-mono ${
                      msg.sender === 'user' 
                        ? 'bg-orange-500 text-black rounded-tr-none font-bold' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`text-[7px] block mt-1.5 text-right ${msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                {botTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl rounded-tl-none text-[9px] text-slate-500 font-mono italic animate-pulse">
                      Alloy Expert is typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={sendChatMessage} className="flex gap-2 border-t border-slate-800 pt-3">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type '1', '2', '3' or custom message..."
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-orange-500 text-slate-100"
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black px-4 rounded-lg flex items-center justify-center">
                  <Send className="h-3.5 w-3.5 text-black" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xl font-bold text-slate-100 font-display">Engineered B2B Telephony & Messaging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our channels coordinate multiple on-ground managers under one central company profile, keeping records safely archived in your dashboard and eliminating dealer communication leaks.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'Instant WhatsApp Sheets', desc: 'Dispatches custom PDFs, specifications, and catalogs automatically in response to queries.' },
                  { label: 'AI Voice Callback', desc: 'Missed calls automatically log CRM tasks and schedule outbound dialers under 45 seconds.' },
                  { label: 'Central Team Inbox', desc: 'Saves multi-channel communications (SMS/WhatsApp) inside one central timeline.' },
                  { label: 'Secure ERP Cloud Sync', desc: 'Automatically writes credit limit checks and distributor ledgers on order confirmation.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            AGENTICOS™ FOR MANUFACTURING (3D AGENTS)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Agentic Suite</span>
            <h2 className="text-3xl font-bold font-display">AgenticOS™ Multi-Agent Network</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5 space-y-2">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setActiveAgent(ag.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeAgent === ag.id 
                      ? 'border-orange-500 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.15)] text-white' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <h3 className="text-xs font-bold font-display flex items-center gap-1.5 font-mono mb-1">
                    <Cpu className={`h-4 w-4 ${activeAgent === ag.id ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
                    {ag.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate leading-relaxed">{ag.role}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
              
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                  <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest">Logic Code Registry</span>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">STATUS_SECURE</span>
                </div>
                
                <h3 className="text-sm font-bold text-slate-200 font-display">
                  {agents.find(ag => ag.id === activeAgent)?.name} Code
                </h3>
                
                <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-cyan-400 leading-relaxed overflow-x-auto">
                  <code>{agents.find(ag => ag.id === activeAgent)?.trigger}</code>
                </div>
                
                <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                  {agents.find(ag => ag.id === activeAgent)?.role}
                </p>
              </div>

              <span className="text-[8px] font-mono text-slate-600 block mt-4 pt-2 border-t border-slate-800/40">Secure multi-agent integration layer</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            ERP & BUSINESS INTEGRATIONS
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Integrations Architecture</span>
            <h2 className="text-3xl font-bold font-display">ERP & Business System Mappings</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {erpIntegrations.map((erp, idx) => {
              const IconComp = erp.icon;
              return (
                <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <IconComp className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {erp.latency} latency
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mb-1.5 font-display">{erp.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mb-2">{erp.status}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{erp.tech}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            MANUFACTURING AUTOMATION WORKFLOWS
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Automation Workflows</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2.5">
              {workflows.map((flow, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFlowIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeFlowIdx === idx 
                      ? 'border-orange-500 bg-orange-500/5 text-white' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <h3 className="text-xs font-bold font-display flex items-center gap-1.5 mb-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {flow.title.split(' → ')[0]} Route
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{flow.desc}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md">
              <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block mb-2">ACTIVE WORKFLOW SCHEMATIC</span>
              <h3 className="text-sm font-bold text-slate-200 font-display mb-6 border-b border-slate-800 pb-2">
                {workflows[activeFlowIdx].title}
              </h3>

              {/* Workflow Nodes Grid with Arrow Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative">
                {workflows[activeFlowIdx].nodes.map((node, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 relative group hover:border-cyan-500/35 transition-all text-left">
                    <span className="text-[8px] font-mono text-slate-500 block">NODE_0{i + 1}</span>
                    <p className="text-[11px] font-bold text-slate-200 mt-1 font-mono leading-tight">{node}</p>
                    <span className="absolute bottom-1 right-2 text-[8px] text-cyan-400/80 opacity-0 group-hover:opacity-100 transition-opacity">● ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            POPULAR USE CASES
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Use Cases</span>
            <h2 className="text-3xl font-bold font-display">{"What we can help you connect"}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {useCases.map((uc, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 flex flex-col justify-between hover:border-cyan-500/30 transition-all relative overflow-hidden group">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 mb-2 border-b border-slate-800/40 pb-1.5 flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {uc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{uc.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            MANUFACTURING INTELLIGENCE DASHBOARD
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Intelligence Console</span>
            <h2 className="text-3xl font-bold font-display">{"Useful signals. Better conversations."}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"We agree the indicators around your objective, the information available and the work in scope. Review the quality of the next step as well as the activity that led to it."}</p>
          </div><ArchiveContentGroup page={archivePage} group="metrics" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            {/* Visual Charts section */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
                  <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-orange-400 animate-pulse" /> PRODUCTION COMPLIANCE CHART
                  </span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono font-bold">MONTHLY STATS</span>
                </div>

                {/* Custom SVG line chart representing output trend */}
                <div className="relative h-44 bg-slate-900/30 rounded-xl border border-slate-800/60 p-4 flex items-end justify-between overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
                  
                  {/* Background gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="h-px bg-slate-800/30 w-full" />
                    <div className="h-px bg-slate-800/30 w-full" />
                    <div className="h-px bg-slate-800/30 w-full" />
                  </div>

                  {/* Chart bars simulating monthly sales volume */}
                  {[
                    { m: 'Jan', val: 42 }, { m: 'Feb', val: 58 }, { m: 'Mar', val: 64 }, 
                    { m: 'Apr', val: 78 }, { m: 'May', val: 92 }, { m: 'Jun', val: 110 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 z-10 w-12 group">
                      <span className="text-[8px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.val}k
                      </span>
                      <div 
                        style={{ height: `${item.val * 0.8 + 20}px` }}
                        className="w-4 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-sm group-hover:from-cyan-400 group-hover:to-cyan-300 transition-all duration-300 relative"
                      />
                      <span className="text-[8px] font-mono text-slate-400">{item.m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/40 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5 text-cyan-400" /> Standard deviation: ±1.8%</span>
                <span className="text-right text-orange-400">Target output: 120k units</span>
              </div>
            </div>

            {/* Dashboard Modules */}
            <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between text-left">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block border-b border-slate-800 pb-2">ACTIVE MODULES</span>
                
                {[
                  { title: 'Inbound Leads Module', value: '412 registered', status: 'Optimal' },
                  { title: 'Quotation Pipeline Engine', value: '₹1.4 Cr Pending', status: 'High Volume' },
                  { title: 'Supplier Bidding Ledger', value: '6 Contracts active', status: 'Audit Ready' },
                  { title: 'Logistics Tracker Interface', value: '18 Shipments logged', status: 'Real-time' }
                ].map((mod, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block">{mod.title}</span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{mod.value}</span>
                    </div>
                    <span className="text-[8px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>

              <span className="text-[8px] font-mono text-slate-600 mt-6 block">Unified Business Intelligence console</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            MANUFACTURING ROI CALCULATOR
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">ROI Calculator</span>
            <h2 className="text-3xl font-bold font-display">Manufacturing ROI Calculator</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md space-y-5">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4 uppercase font-mono tracking-wider">
                Simulation Variables
              </h3>

              <div className="space-y-4">
                {/* Leads Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Monthly Inbound Leads</span>
                    <span className="text-orange-400 font-bold">{monthlyLeads} leads</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1500" 
                    step="50"
                    value={monthlyLeads}
                    onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Deal Value Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Average B2B Deal Value</span>
                    <span className="text-orange-400 font-bold">{formatCurrency(dealValue)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="5000000" 
                    step="100000"
                    value={dealValue}
                    onChange={(e) => setDealValue(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Team Size Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Sales Representatives</span>
                    <span className="text-orange-400 font-bold">{salesTeam} reps</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="40" 
                    step="1"
                    value={salesTeam}
                    onChange={(e) => setSalesTeam(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Software Cost Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Current Stack Monthly Costs</span>
                    <span className="text-orange-400 font-bold">{formatCurrency(softwareCost)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="200000" 
                    step="5000"
                    value={softwareCost}
                    onChange={(e) => setSoftwareCost(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Financial Outputs Display */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between min-h-[340px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest block border-b border-slate-800 pb-2">SIMULATED GAIN MATRIX</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Manual Revenue</span>
                    <span className="text-sm font-bold text-slate-300 block mt-1 font-mono">{formatCurrency(curRevenue)}</span>
                    <span className="text-[8px] font-mono text-slate-600 block mt-1">Based on 2.0% Conv</span>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <span className="text-[9px] font-mono text-orange-400 block uppercase font-bold">Natton Revenue</span>
                    <span className="text-sm font-extrabold text-orange-400 block mt-1 font-mono">{formatCurrency(optRevenue)}</span>
                    <span className="text-[8px] font-mono text-orange-500/70 block mt-1">Based on 4.8% Conv</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Operational Hours saved</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">~ {salesTeam * 15} hours / week</span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    +{adminSavings ? '₹' + (adminSavings / 1000).toFixed(0) + 'k' : '0'} Value
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 block uppercase font-bold">Net Integration Gain</span>
                    <span className="text-base font-extrabold text-cyan-400 mt-1 block font-mono">{formatCurrency(totalFinancialGain)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {autoROI}% Est ROI
                  </span>
                </div>
              </div>

              <span className="text-[8px] font-mono text-slate-600 block mt-6 pt-2 border-t border-slate-800/40">Financial estimates based on average sector benchmarks</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            SUCCESS STORIES (CAROUSEL)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Success Stories</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.example.title}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.example.description}</p>
          </div><ArchiveContentGroup page={archivePage} group="example" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-4 space-y-2.5">
              {caseStudies.map((cs, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    carouselIdx === idx 
                      ? 'border-orange-500 bg-orange-500/5 text-white' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-mono text-orange-400 block mb-0.5 uppercase tracking-wider">{cs.type}</span>
                  <h3 className="text-xs font-bold font-display block">{cs.company}</h3>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md min-h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/5 rounded-full blur-3xl" />
              
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Case Profile {carouselIdx + 1} of 4</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{caseStudies[carouselIdx].metric}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 font-display mb-2">{caseStudies[carouselIdx].company}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{caseStudies[carouselIdx].impact}</p>

                {/* Results columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {caseStudies[carouselIdx].results.map((r, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase">{r.label}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-rose-500 font-mono strike line-through">{r.before}</span>
                        <span className="text-xs text-emerald-400 font-bold font-mono">{r.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <span className="text-[8px] font-mono text-slate-600 block mt-6 pt-2 border-t border-slate-800/40">Verified client audit summary</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            COMPARISON MATRIX
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Capability Matchup</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.definition.title}</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider">Capabilities</th>
                  <th className="p-4 sm:p-5 font-extrabold text-orange-400 uppercase tracking-wider">Natton Digital</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider">Traditional Agencies</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider">Generic CRM Platforms</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-800/40 hover:bg-slate-900/10">
                    <td className="p-4 sm:p-5 font-bold text-slate-200 font-display">{row.cap}</td>
                    <td className="p-4 sm:p-5 font-medium text-orange-300 bg-orange-500/[0.02] border-x border-slate-800/60">{row.natton}</td>
                    <td className="p-4 sm:p-5 text-slate-400">{row.trad}</td>
                    <td className="p-4 sm:p-5 text-slate-400">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            15 FREQUENTLY ASKED QUESTIONS
           ========================================== */}
        <ArchiveFAQ items={archivePage.faqs} idPrefix="manufacturing" />

        {/* ==========================================
            LEAD FORM WITH CAPTCHA & SIMULATOR LOGS
           ========================================== */}
        <div id="lead_form" className="mb-24 max-w-4xl mx-auto">
          <div className="p-1 rounded-3xl border border-slate-800 bg-[#090d1c] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              
              {/* Form Input Side */}
              <div className="md:col-span-7 p-6 sm:p-8 text-left border-r border-slate-800/80">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[9px] font-mono uppercase text-orange-400">GHL Webhook Interface</span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 font-display mb-2">Book A Manufacturing Growth Consultation</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                  Fill in details below to test our n8n payload mapper. Captcha verification ensures secure, spam-free lead processing.
                </p>

                {isSubmitted ? (
                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-3">
                    <CheckCheck className="h-8 w-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-200">Consultation Scheduled!</h4>
                    <p className="text-[10px] text-slate-400">
                      Our system has logged Tata/OEM parameters. A regional supply partner has dispatched technical catalogs directly to your email.
                    </p>
                    <button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setCaptchaInput('');
                        setCaptchaValues({
                          num1: Math.floor(Math.random() * 8) + 2,
                          num2: Math.floor(Math.random() * 8) + 2
                        });
                      }}
                      className="px-4 py-2 text-[10px] font-mono text-orange-400 hover:text-orange-300 font-bold border border-slate-800 rounded-lg"
                    >
                      Reset Form Submit
                    </button>
                  </div>
                ) : (
                  <ContactFormLink setPath={setPath} darkMode={darkMode} />
                )}
              </div>

              {/* Developer Live Webhook Terminal Logs Side */}
              <div className="md:col-span-5 p-6 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between text-left">
                <div>
                  <span className="text-[8px] font-mono text-slate-500 block mb-4 border-b border-slate-800/60 pb-1 uppercase">Live Integration Logs</span>
                  
                  {terminalLogs.length === 0 ? (
                    <div className="text-[9px] font-mono text-slate-600 leading-relaxed italic">
                      Waiting for B2B form submission...
                    </div>
                  ) : (
                    <div className="space-y-2.5 font-mono text-[9px] text-cyan-400 leading-relaxed">
                      {terminalLogs.map((log, index) => (
                        <div key={index} className="flex gap-1.5 items-start">
                          <span className="text-orange-500">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[8px] font-mono text-slate-600 border-t border-slate-800/40 pt-4 mt-6 leading-relaxed">
                  Payload delivers secure, sanitised webhook signals to GHL backend core endpoints.
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            FINAL CALL TO ACTION (CTA)
           ========================================== */}
        

      </div>
    </div>
  );
}
