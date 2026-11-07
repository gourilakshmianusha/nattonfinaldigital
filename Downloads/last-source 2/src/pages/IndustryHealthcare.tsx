import './industry-process-layout.css';
import archivePage from '../content/ten-pages/healthcare.json';
import {ArchiveHeroBackground,ArchiveContentGroup} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Search, 
  CheckCircle, 
  Layers, 
  Workflow, 
  BarChart2, 
  ArrowRight, 
  Play, 
  Zap, 
  Star, 
  MessageSquare, 
  Users, 
  Globe, 
  ChevronRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Sliders,
  DollarSign,
  Plus,
  RefreshCw,
  Clock,
  Phone,
  Shield,
  Briefcase,
  Lock,
  X,
  Volume2,
  Bookmark,
  Database,
  Mail,
  Building,
  CheckSquare,
  Activity,
  Calendar,
  Stethoscope,
  MapPin,
  Heart,
  UserCheck,
  Smile,
  Percent,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function IndustryHealthcare({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // HERO PARTICLE MESH BACKGROUND (Canvas)
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

    const particleCount = 60;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = [
      'rgba(45, 212, 191, 0.45)', // Teal
      'rgba(14, 165, 233, 0.45)', // Sky Blue
      'rgba(139, 92, 246, 0.35)', // Purple
      'rgba(255, 255, 255, 0.25)' // Pure White
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Interconnect particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.pulse += 0.015;
        const radius = p.radius + Math.sin(p.pulse) * 0.6;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Keep inside bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
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
  // SECTION 1: 3D SMART HOSPITAL ECOSYSTEM (Interactive Canvas/Nodes)
  // ==========================================
  const [selectedEcoNode, setSelectedEcoNode] = useState<string>('hospital');
  const ecoNodes = [
{
      id: 'hospital',
      title: "Healthcare website design",
      desc: "Build clear service, practitioner and location pages with usable mobile layouts, accurate contact details and an appropriate appointment enquiry route.",
      features: ["Clear service and location information","Approved patient-facing website and content priorities","Appropriate appointment-enquiry routes","An administrative routing and follow-up plan","Agreed privacy-aware measurement and review points"],
      color: 'text-teal-400 bg-teal-500/10 border-teal-400/30'
    },
{
      id: 'ai_agents',
      title: "Healthcare SEO & local visibility",
      desc: "Research service and location intent, improve relevant page content and review eligible Google Business Profiles. Give each location useful information instead of repeating city names.",
      features: ["Clear service and location information","Approved patient-facing website and content priorities","Appropriate appointment-enquiry routes","An administrative routing and follow-up plan","Agreed privacy-aware measurement and review points"],
      color: 'text-sky-400 bg-sky-500/10 border-sky-400/30'
    },
{
      id: 'whatsapp',
      title: "Approved patient information",
      desc: "Turn provider-approved information into understandable service explainers, articles and social content. The organisation reviews medical accuracy and promotional statements before publication.",
      features: ["Clear service and location information","Approved patient-facing website and content priorities","Appropriate appointment-enquiry routes","An administrative routing and follow-up plan","Agreed privacy-aware measurement and review points"],
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/30'
    },
{
      id: 'telephony',
      title: "Relevant paid campaigns",
      desc: "Plan suitable search or social campaigns after reviewing the service, location, claims and platform requirements. Campaign eligibility and the appropriate enquiry destination are assessed before launch.",
      features: ["Clear service and location information","Approved patient-facing website and content priorities","Appropriate appointment-enquiry routes","An administrative routing and follow-up plan","Agreed privacy-aware measurement and review points"],
      color: 'text-purple-400 bg-purple-500/10 border-purple-400/30'
    },
{
      id: 'crm',
      title: "Administrative enquiry workflows",
      desc: "Connect agreed forms, appointment requests and team reminders. Use approved administrative responses and human handover; clinical assessment and treatment decisions stay with qualified care teams.",
      features: ["Clear service and location information","Approved patient-facing website and content priorities","Appropriate appointment-enquiry routes","An administrative routing and follow-up plan","Agreed privacy-aware measurement and review points"],
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-400/30'
    }
];

  // ==========================================
  // SECTION 4: SOLUTION BLUEPRINT DIAGRAM
  // ==========================================
  const blueprintSteps = [
{ id: 'web', name: "Understand the service and care setting", status: "Agreed scope", detail: "Confirm the services, locations, audience, appointment process and people responsible for reviewing content. Establish the agreed marketing scope and handling of enquiries." },
{ id: 'seo', name: "Make the foundations clear", status: "Agreed scope", detail: "Review the website, contact routes, eligible local profiles and existing measurement. Prioritise accurate service information and useful navigation before expanding promotion." },
{ id: 'ads', name: "Connect visibility to the right information", status: "Agreed scope", detail: "Develop service and location content around researched questions. Add suitable campaigns only where the offering, platform rules, available capacity and budget support them." },
{ id: 'crm', name: "Give administrative enquiries an owner", status: "Agreed scope", detail: "Agree how staff receive, review and follow up appointment requests. Test acknowledgements, reminders and handovers before putting automation into use." },
{ id: 'whatsapp', name: "Review and improve together", status: "Agreed scope", detail: "Use available enquiry and response information to identify friction. Refine content, routing and campaigns with the provider as services and priorities change." }
];
  const [hoveredBlueprintStep, setHoveredBlueprintStep] = useState<number | null>(null);

  // ==========================================
  // SECTION 5: AI GROWTH MARKETING (Interactive Dashboard)
  // ==========================================
  const [marketingPeriod, setMarketingPeriod] = useState<'30d' | '90d'>('30d');
  const [activeMktTab, setActiveMktTab] = useState<'seo' | 'ads' | 'local'>('seo');

  const mktData = {
    seo: {
      metrics: [
        { label: 'Organic Monthly Searches', value: '42,912', change: '+24.1%', status: 'up' },
        { label: 'AEO (AI Search Engine Matches)', value: '8,410', change: '+114%', status: 'up' },
        { label: 'Keywords in Top 3 Positions', value: '118', change: '+18%', status: 'up' }
      ],
      keywords: [
        { term: 'best diagnostic center nearby', rank: '#1', volume: '2,400/mo', trend: 'Growing' },
        { term: 'emergency orthopedic hospital', rank: '#2', volume: '1,800/mo', trend: 'Surging' },
        { term: 'advanced dental implants clinic', rank: '#1', volume: '1,200/mo', trend: 'Stable' },
        { term: 'painless root canal cost', rank: '#3', volume: '950/mo', trend: 'Growing' }
      ]
    },
    ads: {
      metrics: [
        { label: 'Google Ads CPC (Average)', value: '₹34.20', change: '-18.4%', status: 'down' },
        { label: 'Cost Per Qualified Lead (CPL)', value: '₹145.00', change: '-32%', status: 'down' },
        { label: 'Ad Conversion Rate', value: '11.8%', change: '+4.2%', status: 'up' }
      ],
      campaigns: [
        { name: 'Intake Search - General Practice', budget: '₹1,500/day', leads: '324', cpl: '₹132' },
        { name: 'Dental Implants High-Intent CPC', budget: '₹2,500/day', leads: '142', cpl: '₹210' },
        { name: 'Diagnostic Health Package Leads', budget: '₹1,200/day', leads: '411', cpl: '₹94' }
      ]
    },
    local: {
      metrics: [
        { label: 'Google Maps Monthly Views', value: '184,200', change: '+38%', status: 'up' },
        { label: 'GBP Driving Directions Fired', value: '4,110', change: '+29%', status: 'up' },
        { label: 'Phone Call Actions Clicked', value: '2,942', change: '+44%', status: 'up' }
      ],
      locations: [
        { branch: 'Downtown Multispecialty Hub', mapsRank: '#1', phoneCalls: '1,240', directions: '1,890' },
        { branch: 'West Diagnostic Annex', mapsRank: '#2', phoneCalls: '890', directions: '1,120' },
        { branch: 'East IVF Center of Excellence', mapsRank: '#1', phoneCalls: '812', directions: '1,100' }
      ]
    }
  };

  // ==========================================
  // SECTION 6: GROWTHOS™ CLINIC CRM PREVIEW
  // ==========================================
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_1');
  const patientsList = [
    { id: 'pat_1', name: 'Aarav Sharma', age: 41, speciality: 'Orthopedics', date: 'Today, 10:30 AM', status: 'Confirmed', phone: '+91 98765 43210', statusColor: 'text-teal-400 bg-teal-500/10' },
    { id: 'pat_2', name: 'Priya Iyer', age: 29, speciality: 'Dental', date: 'Today, 11:45 AM', status: 'Checked In', phone: '+91 99112 23344', statusColor: 'text-sky-400 bg-sky-500/10' },
    { id: 'pat_3', name: 'Dr. Vivek Mehra (Consultant)', age: 52, speciality: 'Cardiology', date: 'Today, 2:15 PM', status: 'On Call', phone: '+91 98123 45678', statusColor: 'text-purple-400 bg-purple-500/10' },
    { id: 'pat_4', name: 'Meera Deshmukh', age: 35, speciality: 'IVF Consultation', date: 'Tomorrow, 9:00 AM', status: 'Reminder Sent', phone: '+91 97765 88990', statusColor: 'text-amber-400 bg-amber-500/10' }
  ];
  const patientDetails: Record<string, { notes: string; timeline: Array<{ time: string; event: string; tag: string }> }> = {
    pat_1: {
      notes: 'Patient Aarav Sharma complains of acute right knee strain. First-time visitor. Lead captured via Facebook Ortho Ad, auto-opted into WhatsApp reminder loop.',
      timeline: [
        { time: '09:12 AM', event: 'WhatsApp intake confirmation dispatched', tag: 'Automation' },
        { time: '09:05 AM', event: 'Assigned to Dr. Rajesh Verma (Orthopedics)', tag: 'Intake CRM' },
        { time: '09:00 AM', event: 'Lead captured via Google Ad Form', tag: 'Sourcing' }
      ]
    },
    pat_2: {
      notes: 'Priya Iyer scheduled for premium aesthetic dental veneers consultation. Verified pre-consultation scans uploaded via chat channel.',
      timeline: [
        { time: '11:10 AM', event: 'Patient checked in at front desk console', tag: 'Reception' },
        { time: 'Yesterday', event: 'Pre-consultation scan PDF uploaded', tag: 'WhatsApp' },
        { time: '2 days ago', event: 'Appointment confirmed with Dr. Gupta', tag: 'AI Call' }
      ]
    },
    pat_3: {
      notes: 'Dr. Vivek Mehra visiting as senior cardiologist consultant. Automated check-in sync completed across clinic panels.',
      timeline: [
        { time: '08:00 AM', event: 'Consultant roster verified and published', tag: 'System' },
        { time: '3 days ago', event: 'Roster exceptions adjusted by supervisor', tag: 'Manual' }
      ]
    },
    pat_4: {
      notes: 'Meera Deshmukh scheduled for preliminary IVF counseling. Standard questionnaire PDF sent.',
      timeline: [
        { time: '10:00 AM', event: 'WhatsApp IVR questions answered', tag: 'AI Agent' },
        { time: 'Yesterday', event: 'Intake scheduled automatically', tag: 'Booking' }
      ]
    }
  };

  // ==========================================
  // SECTION 7: BUSINESSOS™ SIMULATED WHATSAPP INBOX & AI CALLING
  // ==========================================
  const [waMessages, setWaMessages] = useState([
    { sender: 'user', text: 'Hi, I missed a call from your clinic. Can I book an appointment with Dr. Roy?', time: '04:12 PM' },
    { sender: 'system', text: 'Hello! This is Dr. Roy’s Assistant at Radiant Clinic. Yes, absolutely! I can help you book right here on WhatsApp.', time: '04:12 PM' },
    { sender: 'system', text: 'Dr. Roy is available tomorrow (Monday) at: \n1️⃣ 10:00 AM\n2️⃣ 02:30 PM\n3️⃣ 05:00 PM\n\nPlease select an option by typing 1, 2, or 3.', time: '04:13 PM' }
  ]);
  const [newWaMessage, setNewWaMessage] = useState('');
  const [isWaTyping, setIsWaTyping] = useState(false);

  const sendWaMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaMessage.trim()) return;

    const userMsg = { sender: 'user', text: newWaMessage, time: '04:14 PM' };
    setWaMessages(prev => [...prev, userMsg]);
    const input = newWaMessage;
    setNewWaMessage('');
    setIsWaTyping(true);

    setTimeout(() => {
      let replyText = 'Thanks! I am checking our clinic database...';
      if (input.includes('1') || input.toLowerCase().includes('ten') || input.toLowerCase().includes('morning')) {
        replyText = '🎉 Confirmed! Appointment scheduled with Dr. Roy tomorrow at 10:00 AM.\n\nYour Booking ID is #RAD-9410. A WhatsApp QR Code has been synchronized to your profile for easy check-in at the counter.';
      } else if (input.includes('2') || input.includes('3')) {
        replyText = '🎉 Perfect! Booking finalized for your selected slot. Your booking confirmation has been uploaded to the front-desk CRM. See you tomorrow!';
      } else {
        replyText = 'No problem! I have notified Dr. Roy’s coordinator. They will call you shortly on this number to coordinate. Have a healthy day!';
      }

      setWaMessages(prev => [...prev, { sender: 'system', text: replyText, time: '04:15 PM' }]);
      setIsWaTyping(false);
    }, 1500);
  };

  // ==========================================
  // SECTION 8: AGENTICOS™ FOR HEALTHCARE (3D AI AGENT NETWORK)
  // ==========================================
  const [activeHealthcareAgent, setActiveHealthcareAgent] = useState<string>('support');
  const healthcareAgents = [
{
      id: 'support',
      name: "Healthcare website design",
      icon: MessageSquare,
      role: "Build clear service, practitioner and location pages with usable mobile layouts, accurate contact details and an appropriate appointment enquiry route.",
      prompt: 'SYSTEM: Access clinical guidelines database. If patient asks about fasting rules for blood tests, retrieve fasting duration parameters (e.g. 10-12 hours). Answer warmly.',
      metrics: '94% deflection rate, under 5s response SLA'
    },
{
      id: 'appointment',
      name: "Healthcare SEO & local visibility",
      icon: Calendar,
      role: "Research service and location intent, improve relevant page content and review eligible Google Business Profiles. Give each location useful information instead of repeating city names.",
      prompt: 'SYSTEM: Match client input against Dr. Verma’s active calendar nodes. Lock requested slot, dispatch Stripe payment link if required, and push booking ID to EHR.',
      metrics: 'Zero overlap errors, 3.2x faster scheduling'
    },
{
      id: 'feedback',
      name: "Approved patient information",
      icon: Smile,
      role: "Turn provider-approved information into understandable service explainers, articles and social content. The organisation reviews medical accuracy and promotional statements before publication.",
      prompt: 'SYSTEM: Send patient rating prompts 2 hours post-checkout. If rating is 4 or 5 stars, dispatch Google Maps link. If 1-3 stars, alert clinic head immediately.',
      metrics: '340% increase in 5-star Google Reviews'
    },
{
      id: 'billing',
      name: "Relevant paid campaigns",
      icon: DollarSign,
      role: "Plan suitable search or social campaigns after reviewing the service, location, claims and platform requirements. Campaign eligibility and the appropriate enquiry destination are assessed before launch.",
      prompt: 'SYSTEM: Intercept payment receipt records from Razorpay webhooks. Generate GST tax invoice PDFs and upload directly to QuickBooks / Tally.',
      metrics: '100% financial discrepancy elimination'
    },
{
      id: 'reception',
      name: "Administrative enquiry workflows",
      icon: Users,
      role: "Connect agreed forms, appointment requests and team reminders. Use approved administrative responses and human handover; clinical assessment and treatment decisions stay with qualified care teams.",
      prompt: 'SYSTEM: Read QR codes from patient WhatsApp screens, update lobby display monitors, and alert respective doctor cabins.',
      metrics: 'Reduces front-desk lobby queue times by 75%'
    }
];

  // ==========================================
  // SECTION 9: AUTOMATION WORKFLOWS (React Flow style)
  // ==========================================
  const [activeFlowPreset, setActiveFlowPreset] = useState<number>(0);
  const flowPresets = [
{
      title: "Understand the service and care setting",
      desc: "Confirm the services, locations, audience, appointment process and people responsible for reviewing content. Establish the agreed marketing scope and handling of enquiries.",
      nodes: [
        { label: 'Google Ad click', desc: 'Patient searches and clicks Orthopedic Clinic Ad' },
        { label: 'Instant CRM Capture', desc: 'Name & Phone saved in GrowthOS™' },
        { label: 'WhatsApp Intake Bot', desc: 'Offers appointment slots under 10 seconds' },
        { label: 'Roster Synced', desc: 'Doctor calendar blocked' },
        { label: 'Voice AI Reminder', desc: 'Fires automated call 2 hours prior' },
        { label: 'Lobby Check-in', desc: 'QR code scanned at front-desk counter' },
        { label: 'Review Request', desc: 'Feedback Agent logs a 5-star review' }
      ]
    },
{
      title: "Make the foundations clear",
      desc: "Review the website, contact routes, eligible local profiles and existing measurement. Prioritise accurate service information and useful navigation before expanding promotion.",
      nodes: [
        { label: 'Missed Inbound Call', desc: 'All front desk reception lines are busy' },
        { label: 'Telephony Webhook', desc: 'Fires within 200ms of disconnect' },
        { label: 'WhatsApp Message Send', desc: '"Sorry we missed you! Click here to book"' },
        { label: 'AI Interactive Dialogue', desc: 'Matches patient to open neurology slots' },
        { label: 'Instant Confirmation', desc: 'Appointment locked on Google Calendar' }
      ]
    },
{
      title: "Connect visibility to the right information",
      desc: "Develop service and location content around researched questions. Add suitable campaigns only where the offering, platform rules, available capacity and budget support them.",
      nodes: [
        { label: 'Outpatient Checked Out', desc: 'Marked "Completed" on GrowthOS™ EHR' },
        { label: 'Delay Node (3 Days)', desc: 'System waits for recovery stabilization' },
        { label: 'WhatsApp Health Survey', desc: 'Asks: "How is your healing progress?"' },
        { label: 'Prescription Alerts', desc: 'Dispatches custom medication alarms daily' },
        { label: 'Diagnostic Recall', desc: 'Schedules 30-day followup blood panel' }
      ]
    },
{
      title: "Give administrative enquiries an owner",
      desc: "Agree how staff receive, review and follow up appointment requests. Test acknowledgements, reminders and handovers before putting automation into use.",
      nodes: [
        { label: 'Google Ad click', desc: 'Patient searches and clicks Orthopedic Clinic Ad' },
        { label: 'Instant CRM Capture', desc: 'Name & Phone saved in GrowthOS™' },
        { label: 'WhatsApp Intake Bot', desc: 'Offers appointment slots under 10 seconds' },
        { label: 'Roster Synced', desc: 'Doctor calendar blocked' },
        { label: 'Voice AI Reminder', desc: 'Fires automated call 2 hours prior' },
        { label: 'Lobby Check-in', desc: 'QR code scanned at front-desk counter' },
        { label: 'Review Request', desc: 'Feedback Agent logs a 5-star review' }
      ]
    },
{
      title: "Review and improve together",
      desc: "Use available enquiry and response information to identify friction. Refine content, routing and campaigns with the provider as services and priorities change.",
      nodes: [
        { label: 'Missed Inbound Call', desc: 'All front desk reception lines are busy' },
        { label: 'Telephony Webhook', desc: 'Fires within 200ms of disconnect' },
        { label: 'WhatsApp Message Send', desc: '"Sorry we missed you! Click here to book"' },
        { label: 'AI Interactive Dialogue', desc: 'Matches patient to open neurology slots' },
        { label: 'Instant Confirmation', desc: 'Appointment locked on Google Calendar' }
      ]
    }
];

  // ==========================================
  // SECTION 11: HEALTHCARE ROI CALCULATOR
  // ==========================================
  const [monthlyPatients, setMonthlyPatients] = useState<number>(250);
  const [avgRevenuePerPatient, setAvgRevenuePerPatient] = useState<number>(3500); // INR
  const [missedAppointmentsPercent, setMissedAppointmentsPercent] = useState<number>(20);
  const [mktBudget, setMktBudget] = useState<number>(45000); // INR

  // Formulas
  // 1. Current lost revenue from missed appointments:
  // (monthlyPatients * (missedAppointmentsPercent / 100)) * avgRevenuePerPatient
  const lostRevenue = Math.round((monthlyPatients * (missedAppointmentsPercent / 100)) * avgRevenuePerPatient);
  
  // 2. Additional revenue generated by saving 75% of missed appointments + 15% patient acquisition boost:
  const appointmentsSaved = Math.round(monthlyPatients * (missedAppointmentsPercent / 100) * 0.75);
  const savedAppointmentsRev = appointmentsSaved * avgRevenuePerPatient;
  const acquisitionBoostRev = Math.round(monthlyPatients * 0.15 * avgRevenuePerPatient);
  const additionalRevenueTotal = savedAppointmentsRev + acquisitionBoostRev;
  
  // 3. ROI Percentage: ((Additional Revenue - Marketing Budget) / Marketing Budget) * 100
  const roiPercentage = Math.round(((additionalRevenueTotal - mktBudget) / mktBudget) * 100);

  // Helper currency formatting
  const formatCur = (num: number) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // ==========================================
  // SECTION 12: CASE STUDIES (Carousel)
  // ==========================================
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const caseStudies = [
{
      title: "Find a service page",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      solution: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Activity,
      stats: [{"label":"Relevant search visibility","before":"Baseline to agree","after":"Queries and pages connected with the actual services and locations."},{"label":"Contact and booking actions","before":"Baseline to agree","after":"Appropriately measured calls, enquiry submissions and appointment-link actions."},{"label":"Administrative response patterns","before":"Baseline to agree","after":"Pending enquiries, ownership and response intervals where reliable records exist."},{"label":"Enquiry quality","before":"Baseline to agree","after":"Whether enquiries match the services, location and appointment process the organisation offers."}]
    },
{
      title: "Request an appointment",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      solution: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Stethoscope,
      stats: [{"label":"Relevant search visibility","before":"Baseline to agree","after":"Queries and pages connected with the actual services and locations."},{"label":"Contact and booking actions","before":"Baseline to agree","after":"Appropriately measured calls, enquiry submissions and appointment-link actions."},{"label":"Administrative response patterns","before":"Baseline to agree","after":"Pending enquiries, ownership and response intervals where reliable records exist."},{"label":"Enquiry quality","before":"Baseline to agree","after":"Whether enquiries match the services, location and appointment process the organisation offers."}]
    },
{
      title: "Administrative team reviews",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      solution: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Database,
      stats: [{"label":"Relevant search visibility","before":"Baseline to agree","after":"Queries and pages connected with the actual services and locations."},{"label":"Contact and booking actions","before":"Baseline to agree","after":"Appropriately measured calls, enquiry submissions and appointment-link actions."},{"label":"Administrative response patterns","before":"Baseline to agree","after":"Pending enquiries, ownership and response intervals where reliable records exist."},{"label":"Enquiry quality","before":"Baseline to agree","after":"Whether enquiries match the services, location and appointment process the organisation offers."}]
    },
{
      title: "Team confirms the next step",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      solution: "Example only. No live patient data, booking connection or medical decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Eye,
      stats: [{"label":"Relevant search visibility","before":"Baseline to agree","after":"Queries and pages connected with the actual services and locations."},{"label":"Contact and booking actions","before":"Baseline to agree","after":"Appropriately measured calls, enquiry submissions and appointment-link actions."},{"label":"Administrative response patterns","before":"Baseline to agree","after":"Pending enquiries, ownership and response intervals where reliable records exist."},{"label":"Enquiry quality","before":"Baseline to agree","after":"Whether enquiries match the services, location and appointment process the organisation offers."}]
    }
];

  // ==========================================
  // SECTION 13: COMPARISON TABLE
  // ==========================================
  const comparisonRows = [
{ cap: "Clear service and location information", natton: "Clear service and location information", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Approved patient-facing website and content priorities", natton: "Approved patient-facing website and content priorities", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Appropriate appointment-enquiry routes", natton: "Appropriate appointment-enquiry routes", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "An administrative routing and follow-up plan", natton: "An administrative routing and follow-up plan", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Agreed privacy-aware measurement and review points", natton: "Agreed privacy-aware measurement and review points", trad: "Assessed against your current process", generic: "Assessed against your current process" }
];

  // ==========================================
  // SECTION 14: FAQS (15 customized questions)
  // ==========================================
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqsList = [
{ q: "Who is this healthcare marketing service for?", a: "It can suit hospitals, independent practices, dental providers, diagnostic organisations and allied-health teams that need clearer visibility and enquiry handling. Single-location providers and larger groups need different scopes, so we review the services, geography, capacity and existing team before recommending the work." },
{ q: "Can you improve our existing website and Google Business Profile?", a: "Yes. We can review the current website and eligible profiles, identify gaps and prioritise changes. Google profile eligibility and how locations or practitioners should be represented need checking first. Existing systems and useful content can remain where they serve the organisation well." },
{ q: "Will you write medical content or use AI to answer patients?", a: "We can help structure and draft understandable service information, but the provider must review medical accuracy before publishing. An assistant, if included, is limited to an agreed administrative purpose and approved information. Diagnosis, treatment advice, emergencies and clinical decisions require the appropriate qualified team." },
{ q: "Can every healthcare service run paid ads?", a: "Campaign suitability depends on the service, claims, target market and platform requirements. Some healthcare-related advertising is restricted or requires specific approvals. We assess the proposed campaign before recommending it, and do not treat paid promotion as suitable for every service." },
{ q: "How do you handle patient information and tracking?", a: "We first define what an administrative enquiry needs, where it will be stored and who should receive it. Analytics should not receive names, contact details, patient narratives or other sensitive information. Your organisation's privacy and compliance requirements are reviewed with the relevant owners; this page does not certify a system as compliant." },
{ q: "When can we expect progress, and what does it cost?", a: "The starting point, content approvals, number of locations, campaign scope and integrations affect delivery. We agree milestones and costs in a proposal, including third-party or advertising charges where relevant. Initial setup can be reviewed separately from longer-term search visibility and optimisation; no fixed ranking or appointment promise is made." }
];

  // ==========================================
  // SECTION 15: HIGH CONVERTING LEAD FORM
  // ==========================================
  const [formState, setFormState] = useState({
    fullName: '',
    clinicName: '',
    speciality: 'Hospitals',
    location: '',
    email: '',
    phone: '',
    monthlyPatients: '100 - 300',
    challenges: '',
    message: ''
  });
  const [captchaSum1, setCaptchaSum1] = useState(0);
  const [captchaSum2, setCaptchaSum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [integrationLogs, setIntegrationLogs] = useState<string[]>([]);

  useEffect(() => {
    setCaptchaSum1(Math.floor(Math.random() * 8) + 1);
    setCaptchaSum2(Math.floor(Math.random() * 8) + 1);
  }, []);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== (captchaSum1 + captchaSum2)) {
      alert('Verification sum is incorrect. Please calculate again.');
      return;
    }

    setFormSubmitting(true);
    setIntegrationLogs([
      'Intercepting clinical contact lead payload...',
      'Mapping attributes to GoHighLevel API schema...',
      'Firing secure n8n integration webhook node...',
      'Triggering administrative Slack notify channel...'
    ]);

    setTimeout(() => {
      setIntegrationLogs(prev => [
        ...prev,
        'Sync successful. Created Contact ID: GHL_HLTH_9410',
        'Fired welcoming confirmation sequence via Email/WhatsApp API.'
      ]);
      setTimeout(() => {
        setFormSubmitting(false);
        setFormSuccess(true);
      }, 1000);
    }, 1800);
  };

  return (
    <div className={`min-h-screen py-8 overflow-hidden relative selection:bg-teal-500 selection:text-black transition-colors duration-500 ${darkMode ? 'bg-[#020514] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-teal-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] left-0 w-[600px] h-[600px] bg-blue-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-5 right-1/4 w-[750px] h-[750px] bg-purple-950/15 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-xs font-mono text-gray-500 flex items-center gap-1.5 border-b border-white/5 pb-4">
          <button onClick={() => setPath('home')} className="hover:text-teal-400 transition-colors">Home</button> 
          <span>/</span> 
          <a className="text-gray-400" href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');}}>Industries</a> 
          <span>/</span> 
          <span className="text-teal-400 font-semibold">Healthcare</span>
        </div>

        {/* ==========================================
            HERO SECTION (Particle Canvas Background)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 relative min-h-[520px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden -z-20 border border-white/5 bg-slate-950/30">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          </div>

          <div className="archive-hero-copy lg:col-span-7 space-y-6 z-10 p-6 sm:p-10">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Healthcare marketing that"} <br />
<span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">{"makes the next step clear."}</span>
            </h1>

            <p className="text-sm leading-relaxed text-gray-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#lead_form" 
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="#ecosystem" 
                className="px-6 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-teal-400 transition-all flex items-center gap-2 text-sm font-semibold"
              >
                View Healthcare Solutions
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-teal-400">{"Useful information"}</span>
              <span className="flex items-center gap-1.5 text-cyan-400">{"A clearer customer journey"}</span>
              <span className="flex items-center gap-1.5 text-indigo-400">{"People before platforms"}</span>
            </div>
          </div>

          {/* 3D Smart Hospital Ecosystem Visualizer */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            TRUSTED (Solutions Built For)
           ========================================== */}
        <div id="ecosystem" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Tailored Care Models</span>
            <h2 className="text-3xl font-bold font-display">{"Who this can help"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
{ label: "Hospitals and multispeciality centres", icon: Building, desc: "Help people find accurate service information, understand how to contact your organisation and request an appointment. Connect local visibility, your website and administrative follow-up around a considered patient enquiry journey." },
{ label: "Independent medical and dental practices", icon: Activity, desc: "Help people find accurate service information, understand how to contact your organisation and request an appointment. Connect local visibility, your website and administrative follow-up around a considered patient enquiry journey." },
{ label: "Diagnostic and imaging providers", icon: Stethoscope, desc: "Help people find accurate service information, understand how to contact your organisation and request an appointment. Connect local visibility, your website and administrative follow-up around a considered patient enquiry journey." },
{ label: "Allied-health and multi-location organisations", icon: Eye, desc: "Help people find accurate service information, understand how to contact your organisation and request an appointment. Connect local visibility, your website and administrative follow-up around a considered patient enquiry journey." }
].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#070b21]/50 backdrop-blur-sm hover:border-teal-400/40 transition-all duration-300 group text-left">
                  <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/20 w-fit mb-4 group-hover:bg-teal-500/10 transition-colors">
                    <Icon className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-xs font-bold font-display text-white mb-1">{card.label}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            PAIN POINTS (Challenges We Solve)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest font-bold">Operational Vulnerabilities</span>
            <h2 className="text-3xl font-bold font-display">{"Recognise the gaps. Choose the right priority."}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"We begin with the business problem, then agree the work that will help address it."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
{ label: "Patients cannot find the right service", pain: "Service pages, location details or practitioner information may be incomplete, difficult to navigate or disconnected from search.", fix: "Service pages, location details or practitioner information may be incomplete, difficult to navigate or disconnected from search." },
{ label: "Enquiries arrive without a clear next step", pain: "Calls, forms and messages need a defined administrative owner and an appropriate appointment route.", fix: "Calls, forms and messages need a defined administrative owner and an appropriate appointment route." },
{ label: "Information changes across channels", pain: "Timings, available services and contact details should reflect what the organisation can currently provide.", fix: "Timings, available services and contact details should reflect what the organisation can currently provide." },
{ label: "Teams cannot see enquiry follow-up", pain: "A shared administrative process helps staff review pending requests and contact attempts without relying on personal inboxes.", fix: "A shared administrative process helps staff review pending requests and contact attempts without relying on personal inboxes." }
].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#030717] hover:bg-slate-900/40 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded font-bold uppercase">PROBLEM</span>
                    <span className="text-[9px] text-gray-600 font-mono">#0{i+1}</span>
                  </div>
                  <h3 className="text-xs font-bold font-display text-white">{item.label}</h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    <span className="text-rose-400 font-semibold font-mono">Risk:</span> {item.pain}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-teal-400 leading-relaxed">
                  <span className="font-semibold font-mono text-teal-300">Solution:</span> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            SOLUTION BLUEPRINT (Interactive Flow Diagram)
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Intake Architecture</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl border border-white/5 bg-[#050920]/80 backdrop-blur-md">
            
            {/* Interactive Timeline Connector */}
            <div className="industry-process-step-grid grid grid-cols-1 md:grid-cols-9 gap-3 relative">
              <div className="hidden md:block absolute top-[25%] left-[5%] right-[5%] h-0.5 border-t border-dashed border-teal-500/20 -z-10" />
              
              {blueprintSteps.map((step, idx) => (
                <div 
                  key={step.id}
                  onMouseEnter={() => setHoveredBlueprintStep(idx)}
                  onMouseLeave={() => setHoveredBlueprintStep(null)}
                  className={`p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer relative ${
                    hoveredBlueprintStep === idx 
                      ? 'border-teal-400 bg-teal-500/10 scale-105 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                      : 'border-white/5 bg-slate-950/40'
                  }`}
                >
                  <span className="text-[8px] font-mono text-gray-500 block mb-1">STAGE 0{idx + 1}</span>
                  <p className="text-[10px] font-bold font-display text-white line-clamp-2 min-h-[30px] flex items-center justify-center">{step.name}</p>
                  <span className="text-[8px] font-mono text-teal-400 mt-1 block">{step.status}</span>
                </div>
              ))}
            </div>

            {/* Dynamic Step Detail Box */}
            <div className="mt-8 p-4 rounded-xl bg-black/40 border border-white/5 min-h-[80px] flex flex-col justify-center text-left">
              {hoveredBlueprintStep !== null ? (
                <div className="space-y-1 animate-fade-in">
                  <h4 className="text-xs font-bold text-teal-400 font-display">
                    {blueprintSteps[hoveredBlueprintStep].name} — {blueprintSteps[hoveredBlueprintStep].status}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {blueprintSteps[hoveredBlueprintStep].detail}
                  </p>
                </div>
              ) : (
                <div className="text-center text-xs text-gray-500 font-mono py-2">
                  💡 Hover over any stage above to inspect precise clinic CRM operations and target metrics.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ==========================================
            AI GROWTH MARKETING & CLINIC CRM PREVIEWS
           ========================================== */}
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* AI Growth Marketing Block */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#05081e] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">Patient Acquisition Sourcing</span>
              <h3 className="text-2xl font-bold font-display">Patient Acquisition Solutions</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rank higher on searches, target local medical keywords on Google Ads, and optimized map directory configurations to drive high-intent patient inquiries.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Healthcare Websites', 'SEO', 'Google Ads', 'Meta Ads', 'Local SEO', 'Google Business Profile'].map((f, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-white/[0.03] border border-white/10 px-2 py-1 rounded-lg text-gray-300 flex items-center gap-1">
                    <Check className="h-3 w-3 text-teal-400" /> {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Marketing Dashboard */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] font-mono text-gray-400 uppercase">Live Marketing Dashboard Preview</span>
                <div className="flex gap-2 text-[8px] font-mono">
                  <button onClick={() => setMarketingPeriod('30d')} className={`px-2 py-0.5 rounded ${marketingPeriod === '30d' ? 'bg-teal-500 text-black' : 'text-gray-400'}`}>30D</button>
                  <button onClick={() => setMarketingPeriod('90d')} className={`px-2 py-0.5 rounded ${marketingPeriod === '90d' ? 'bg-teal-500 text-black' : 'text-gray-400'}`}>90D</button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 border-b border-white/5 pb-2">
                {['seo', 'ads', 'local'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMktTab(tab as any)}
                    className={`text-[9px] font-mono uppercase px-2 py-1 rounded transition-colors ${
                      activeMktTab === tab ? 'bg-white/5 text-teal-400 font-bold border-b border-teal-400' : 'text-gray-500'
                    }`}
                  >
                    {tab === 'local' ? 'Maps SEO' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Data Metrics */}
              <div className="grid grid-cols-3 gap-2">
                {mktData[activeMktTab].metrics.map((m, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/[0.01] border border-white/5 text-center">
                    <span className="text-[8px] text-gray-500 block truncate">{m.label}</span>
                    <span className="text-xs font-bold text-white block mt-0.5">{m.value}</span>
                    <span className={`text-[8px] font-mono ${m.status === 'up' ? 'text-teal-400' : 'text-rose-400'}`}>{m.change}</span>
                  </div>
                ))}
              </div>

              {/* Tab Details */}
              <div className="pt-2">
                {activeMktTab === 'seo' && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">High-Intent Keyword Ranks (Delhi NCR)</span>
                    <div className="space-y-1 max-h-[100px] overflow-y-auto">
                      {mktData.seo.keywords.map((k, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[9px] font-mono p-1 bg-white/[0.01] rounded">
                          <span className="text-gray-300">{k.term}</span>
                          <div className="flex gap-4">
                            <span className="text-teal-400 font-bold">{k.rank}</span>
                            <span className="text-gray-500">{k.volume}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeMktTab === 'ads' && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Active Ad-Sets (CPC Optimized)</span>
                    <div className="space-y-1 max-h-[100px] overflow-y-auto">
                      {mktData.ads.campaigns.map((c, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[9px] font-mono p-1 bg-white/[0.01] rounded">
                          <span className="text-gray-300">{c.name}</span>
                          <div className="flex gap-4">
                            <span className="text-gray-500">{c.leads} leads</span>
                            <span className="text-teal-300">CPL: {c.cpl}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeMktTab === 'local' && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Branch Locations Map Insights</span>
                    <div className="space-y-1 max-h-[100px] overflow-y-auto">
                      {mktData.local.locations.map((l, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[9px] font-mono p-1 bg-white/[0.01] rounded">
                          <span className="text-gray-300">{l.branch}</span>
                          <div className="flex gap-3">
                            <span className="text-teal-400">{l.mapsRank}</span>
                            <span className="text-gray-500">📞 {l.phoneCalls}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GrowthOS Clinic CRM Block */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#05081e] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">Centralized Clinic Pipeline</span>
              <h3 className="text-2xl font-bold font-display">GrowthOS™ For Clinics</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Connect patient registrations, consult rosters, and surgical queues into a visual CRM workspace. Track patient stages and eliminate lead leakage entirely.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['CRM Database', 'Lead Tracking', 'Roster Scheduling', 'Dynamic Pipelines', 'Patient Recalls'].map((f, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-white/[0.03] border border-white/10 px-2 py-1 rounded-lg text-gray-300 flex items-center gap-1">
                    <Check className="h-3 w-3 text-teal-400" /> {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Healthcare CRM Panel */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] font-mono text-gray-400 uppercase">Interactive GrowthOS™ Lobby Terminal</span>
                <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                {/* Patient List */}
                <div className="sm:col-span-6 space-y-1.5 max-h-[140px] overflow-y-auto">
                  <span className="text-[8px] font-mono text-gray-500 uppercase block">Intake Queue (Today)</span>
                  {patientsList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`w-full text-left p-1.5 rounded transition-colors text-[9px] font-mono flex justify-between items-center ${
                        selectedPatientId === p.id ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="font-bold text-white truncate max-w-[80px]">{p.name}</span>
                      <span className={`text-[8px] px-1.5 rounded truncate ${p.statusColor}`}>{p.status}</span>
                    </button>
                  ))}
                </div>

                {/* Patient Detail Panel */}
                <div className="sm:col-span-6 p-2 rounded bg-white/[0.01] border border-white/5 text-[9px] flex flex-col justify-between min-h-[140px]">
                  <div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Patient Notes</span>
                    <p className="text-gray-300 leading-relaxed mt-1">
                      {patientDetails[selectedPatientId]?.notes || 'Select a patient node to view details.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Pipeline Logs</span>
                    <div className="space-y-1 max-h-[50px] overflow-y-auto mt-1">
                      {patientDetails[selectedPatientId]?.timeline.map((t, idx) => (
                        <div key={idx} className="flex justify-between text-[8px] text-gray-400 font-mono">
                          <span>{t.event}</span>
                          <span className="text-teal-400">{t.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            BUSINESSOS™ COMMUNICATION PLATFORM
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Omnichannel Messaging Hub</span>
            <h2 className="text-3xl font-bold font-display">BusinessOS™ Communication Platform</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[4].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <div className="lg:col-span-5 p-6 rounded-3xl border border-white/5 bg-[#05081e] flex flex-col justify-between text-left">
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-teal-400 uppercase font-bold block">Omnichannel Delivery</span>
                <h3 className="text-2xl font-bold font-display">Simulate Patient WhatsApp Interaction</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Try typing a message to Dr. Roy’s virtual scheduling node (e.g. "Hi, I want to book slot 1") to test real-time booking, calendar locks, and ledger confirmation.
                </p>

                <div className="space-y-2">
                  {['WhatsApp Official API', 'Cloud Telephony Nodes', 'AI Automated Callers', 'Lobby Live Chat Inbox'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro call out on CRM speed */}
              <div className="mt-8 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-gray-400 leading-relaxed">
                <span className="text-teal-300 font-bold">Telemetry:</span> Automated missed-call WhatsApp webhook routes within &lt;200ms of disconnect logs.
              </div>
            </div>

            {/* Simulated Interactive WhatsApp Client Screen */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[380px] text-left">
              
              {/* Client Top Header */}
              <div className="p-4 bg-slate-900 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500/10 border border-teal-400/40 flex items-center justify-center font-bold text-teal-400 text-xs">
                    RC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Radiant Clinic Scheduler</h4>
                    <span className="text-[8px] text-teal-400 flex items-center gap-1 font-mono">● Automated Doctor Assistant</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-gray-500">Meta API Verified</span>
              </div>

              {/* Chat Message Window */}
              <div className="p-4 flex-grow space-y-3 max-h-[220px] overflow-y-auto">
                {waMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-xl text-[10px] max-w-[85%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-teal-500 text-black rounded-tr-none font-medium' 
                        : 'bg-white/5 border border-white/10 text-white rounded-tl-none whitespace-pre-line'
                    }`}>
                      {msg.text}
                      <span className="block text-[7px] text-right text-gray-400 mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isWaTyping && (
                  <div className="flex justify-start">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[8px] font-mono text-gray-400 animate-pulse">
                      Assistant is checking rosters...
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={sendWaMessage} className="p-3 bg-slate-900 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newWaMessage}
                  onChange={(e) => setNewWaMessage(e.target.value)}
                  placeholder="Type '1' to confirm morning slot, or ask a question..."
                  className="flex-grow p-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
                />
                <button type="submit" className="p-2 rounded-lg bg-teal-500 text-black hover:bg-teal-400 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>

          </div>
        </div>

        {/* ==========================================
            AGENTICOS™ FOR HEALTHCARE (3D AI AGENT NETWORK)
           ========================================== */}
        <div id="agenticos" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Autonomous Cognitive Swarm</span>
            <h2 className="text-3xl font-bold font-display">AgenticOS™ For Healthcare</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left selector col */}
            <div className="lg:col-span-5 space-y-2">
              {healthcareAgents.map((ag) => {
                const Icon = ag.icon;
                return (
                  <button
                    key={ag.id}
                    onClick={() => setActiveHealthcareAgent(ag.id)}
                    className={`w-full p-4 rounded-xl border text-left flex gap-3 transition-all duration-300 ${
                      activeHealthcareAgent === ag.id 
                        ? 'bg-teal-500/10 border-teal-400/40 shadow-lg' 
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="p-2 rounded bg-white/5 border border-white/10 h-fit">
                      <Icon className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                        {ag.name}
                        {activeHealthcareAgent === ag.id && <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-ping" />}
                      </h4>
                      <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">{ag.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right details sandbox */}
            <div className="lg:col-span-7 p-6 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-md space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-teal-400 uppercase flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 animate-spin" /> ACTIVE COGNITIVE AGENT PARAMETERS
                </span>
                <span className="text-[8px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">CONCURRENT THREAD</span>
              </div>

              {healthcareAgents.map((ag) => {
                if (ag.id !== activeHealthcareAgent) return null;
                const Icon = ag.icon;
                return (
                  <div key={ag.id} className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">{ag.name}</h4>
                        <span className="text-[9px] text-gray-500 font-mono">Telemetry: {ag.metrics}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {ag.role}
                    </p>

                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono text-teal-400 uppercase font-bold block">Model System Prompt Instruction:</span>
                      <div className="p-3.5 rounded bg-black/40 border border-white/5 text-[9px] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {ag.prompt}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        </div>

        {/* ==========================================
            AUTOMATION WORKFLOWS (React Flow style)
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">SOP Visualizer</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl border border-white/5 bg-[#050920]/80 backdrop-blur-md text-left">
            
            {/* Presets */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
              {flowPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFlowPreset(idx)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase transition-colors ${
                    activeFlowPreset === idx 
                      ? 'bg-teal-500 text-black font-bold' 
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Preset {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected Preset Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {flowPresets[activeFlowPreset].title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1">
                  {flowPresets[activeFlowPreset].desc}
                </p>
              </div>

              {/* Connected node blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {flowPresets[activeFlowPreset].nodes.map((node, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/40 relative flex flex-col justify-between min-h-[90px]">
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-600">NODE 0{i+1}</div>
                    <div>
                      <h5 className="text-[10px] font-bold text-teal-300 font-display uppercase">{node.label}</h5>
                      <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">{node.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            USE CASES (Popular Healthcare Use Cases)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Standard Blueprints</span>
            <h2 className="text-3xl font-bold font-display">{"What we can help you connect"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
{ title: "Healthcare website design", desc: "Build clear service, practitioner and location pages with usable mobile layouts, accurate contact details and an appropriate appointment enquiry route." },
{ title: "Healthcare SEO & local visibility", desc: "Research service and location intent, improve relevant page content and review eligible Google Business Profiles. Give each location useful information instead of repeating city names." },
{ title: "Approved patient information", desc: "Turn provider-approved information into understandable service explainers, articles and social content. The organisation reviews medical accuracy and promotional statements before publication." },
{ title: "Relevant paid campaigns", desc: "Plan suitable search or social campaigns after reviewing the service, location, claims and platform requirements. Campaign eligibility and the appropriate enquiry destination are assessed before launch." },
{ title: "Administrative enquiry workflows", desc: "Connect agreed forms, appointment requests and team reminders. Use approved administrative responses and human handover; clinical assessment and treatment decisions stay with qualified care teams." },
{ title: "Meaningful enquiry reporting", desc: "Review relevant search visibility, contact actions and administrative response patterns. Configure measurement carefully so patient narratives and identifiable details are not sent into analytics events." }
].map((useCase, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-white/5 bg-[#030717]/40 text-left hover:border-teal-400/20 transition-colors">
                <span className="text-[8px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-bold uppercase">USE CASE</span>
                <h4 className="text-xs font-bold text-white font-display mt-3 mb-1">{useCase.title}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            ROI CALCULATOR
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Value Modeling</span>
            <h2 className="text-3xl font-bold font-display">Healthcare ROI Calculator</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl border border-white/5 bg-[#04081c]/90 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Monthly Patients */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Monthly Patients Volume</span>
                    <span className="text-teal-400 font-bold">{monthlyPatients} patients</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={monthlyPatients}
                    onChange={(e) => setMonthlyPatients(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* Avg Revenue Per Patient */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Average Revenue Per Patient (INR)</span>
                    <span className="text-teal-400 font-bold">₹{avgRevenuePerPatient.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={avgRevenuePerPatient}
                    onChange={(e) => setAvgRevenuePerPatient(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* Missed Appointments */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Missed Appointments Percentage</span>
                    <span className="text-teal-400 font-bold">{missedAppointmentsPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={missedAppointmentsPercent}
                    onChange={(e) => setMissedAppointmentsPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* Marketing Budget */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Estimated Automation Budget (INR)</span>
                    <span className="text-teal-400 font-bold">₹{mktBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="150000"
                    step="5000"
                    value={mktBudget}
                    onChange={(e) => setMktBudget(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

              </div>

              {/* Outputs display */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[8px] font-mono text-gray-500 uppercase block">Monthly Financial Impact</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">Lost Monthly Revenue (unoptimized):</span>
                    <span className="text-xs font-bold text-rose-400">{formatCur(lostRevenue)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-teal-500/5 border border-teal-500/20">
                    <span className="text-[10px] text-teal-300 font-bold">Appointments Auto-Saved:</span>
                    <span className="text-xs font-extrabold text-teal-400">{appointmentsSaved} /mo</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">Additional Revenue (75% recovery):</span>
                    <span className="text-xs font-bold text-white">{formatCur(additionalRevenueTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <span className="text-xs font-bold text-gray-300">Net Growth ROI:</span>
                    <span className="text-lg font-black text-teal-400 font-mono">+{roiPercentage}%</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[8px] text-gray-500 font-mono">
                    Calculations assume standard 75% deflection rate and 15% patient acquisition boost.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            CASE STUDIES (Carousel)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Proof of Concept</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.example.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.example.description}</p>
          </div><ArchiveContentGroup page={archivePage} group="example" />

          <div className="p-6 sm:p-10 rounded-3xl border border-white/5 bg-[#05081e] text-left">
            
            {/* Case selector tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
              {caseStudies.map((cs, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCaseIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase transition-colors ${
                    activeCaseIdx === idx 
                      ? 'bg-teal-500 text-black font-bold' 
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {cs.title.split(' ')[1] || cs.title}
                </button>
              ))}
            </div>

            {/* Case detail body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[8px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded font-bold uppercase">
                  {caseStudies[activeCaseIdx].metric}
                </span>
                <h3 className="text-2xl font-bold font-display text-white">{caseStudies[activeCaseIdx].title}</h3>
                <p className="text-[11px] text-gray-400 font-mono">Timeline: {caseStudies[activeCaseIdx].duration}</p>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-rose-400">Challenge:</span> {caseStudies[activeCaseIdx].challenge}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-teal-400">Solution:</span> {caseStudies[activeCaseIdx].solution}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-indigo-400 font-mono">Scope note:</span> {caseStudies[activeCaseIdx].roi}
                </p>
              </div>

              {/* Stats table */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <span className="text-[8px] font-mono text-gray-500 uppercase block">Review indicators</span>
                <div className="space-y-2">
                  {caseStudies[activeCaseIdx].stats.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] font-mono p-2 bg-white/[0.01] rounded">
                      <span className="text-gray-400">{s.label}</span>
                      <div className="flex gap-4">
                        <span className="text-rose-400 line-through">{s.before}</span>
                        <span className="text-teal-400 font-bold">➔ {s.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            COMPARISON TABLE
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Market Analysis</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.definition.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#030616]/60 text-left">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/40 text-[10px] font-mono uppercase text-gray-400">
                  <th className="p-4">Capabilities</th>
                  <th className="p-4 text-teal-400 font-bold">Natton Digital</th>
                  <th className="p-4">Traditional Agencies</th>
                  <th className="p-4">Generic CRM Providers</th>
                </tr>
              </thead>
              <tbody className="text-[10px] font-mono divide-y divide-white/5">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-gray-300">{row.cap}</td>
                    <td className="p-4 text-teal-300 font-bold bg-teal-500/[0.02]">{row.natton}</td>
                    <td className="p-4 text-gray-500">{row.trad}</td>
                    <td className="p-4 text-gray-500">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            FAQ (15 Accordion FAQ Questions)
           ========================================== */}
        <div className="mb-24 space-y-10 max-w-4xl mx-auto text-left">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Expert Knowledge Base</span>
            <h2 className="text-3xl font-bold font-display">{"Frequently Asked Questions"}</h2>
            <p className="text-xs text-gray-400">
              Find detailed answers about compliance, WhatsApp registries, cloud voice nodes, and our deployment process.
            </p>
          </div>

          <div className="space-y-2">
            {faqsList.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-white/5 bg-[#04081c]/60 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-semibold text-white font-display hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 border-t border-white/5 text-[10px] leading-relaxed text-gray-400 bg-black/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            HIGH CONVERTING LEAD FORM
           ========================================== */}
        <div id="lead_form" className="mb-24 max-w-4xl mx-auto text-left">
          <div className="p-6 sm:p-10 rounded-3xl border border-teal-500/20 bg-slate-950/80 backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-4 right-4 text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded uppercase">
              GoHighLevel / n8n Sync
            </div>

            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold font-display text-white">Book A Free Healthcare Growth Consultation</h3>
              <p className="text-xs text-gray-400 max-w-xl mx-auto">
                Our healthcare automation technicians specialize in custom clinic mapping. Setup your pipeline in under 7 business days.
              </p>
            </div>

            {formSuccess ? (
              <div className="p-8 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-4">
                <div className="p-3 bg-teal-500 text-black rounded-full w-fit mx-auto font-bold">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold font-display text-teal-400">Consultation Booked Successfully!</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  The lead credentials have been securely pushed to our GoHighLevel CRM and verified via an n8n webhook routing node. A technician will review your details and contact you within 2 business hours.
                </p>
                <div className="p-4 rounded bg-black/50 border border-white/5 font-mono text-[8px] text-left text-gray-400 space-y-1">
                  <span className="text-teal-400 font-bold block uppercase mb-1">Integration Status Logs:</span>
                  {integrationLogs.map((log, idx) => (
                    <div key={idx}>✓ {log}</div>
                  ))}
                </div>
              </div>
            ) : (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            )}

          </div>
        </div>

        {/* ==========================================
            FINAL CTA
           ========================================== */}
        

      </div>
    </div>
  );
}
