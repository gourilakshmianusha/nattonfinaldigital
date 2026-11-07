import archivePage from '../content/ten-pages/business-os.json';
import {ArchiveHeroBackground,ArchiveContentGroup,ArchiveFAQ} from '../components/ArchivePageMedia';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Search, 
  FileText, 
  CheckCircle, 
  Layers, 
  Workflow, 
  BarChart2, 
  Activity, 
  ArrowRight, 
  Play, 
  Zap, 
  Star, 
  MessageSquare, 
  Users, 
  Globe, 
  Target, 
  ChevronRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Sliders,
  DollarSign,
  Plus,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Phone,
  PhoneCall,
  PhoneIncoming,
  Smartphone,
  Shield,
  Briefcase,
  Share2,
  Lock,
  ArrowRightLeft,
  X,
  Volume2,
  Mic,
  Bookmark
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function ProductBusinessOs({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode?: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // 1. CHAT SIMULATOR (WhatsApp) STATE
  // ==========================================
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot', text: string, time: string }>>([
    { sender: 'user', text: "Hello, I want to book an appointment for dental consulting.", time: "10:30 AM" },
    { sender: 'bot', text: "Welcome to Radiant Dental! 🦷 I am your BusinessOS™ AI assistant. I can fetch available slots. Could you please share your preferred day (e.g. Monday, Tuesday)?", time: "10:30 AM" }
  ]);
  const [waInput, setWaInput] = useState('');
  const [isWaTyping, setIsWaTyping] = useState(false);

  const handleWaSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput.trim()) return;
    
    const userMsg = waInput;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaMessages(prev => [...prev, { sender: 'user', text: userMsg, time }]);
    setWaInput('');
    setIsWaTyping(true);

    setTimeout(() => {
      setIsWaTyping(false);
      let replyText = "Understood! Let me lock that into our CRM. What is your full name to finalize the calendar hold?";
      if (userMsg.toLowerCase().includes('monday')) {
        replyText = "Monday looks perfect! We have slots at 11:00 AM and 3:30 PM. Which one suits you best?";
      } else if (userMsg.toLowerCase().includes('tuesday')) {
        replyText = "Tuesday is open! We can do 10:00 AM or 2:00 PM. Please choose a slot.";
      }
      setWaMessages(prev => [...prev, { sender: 'bot', text: replyText, time }]);
    }, 1200);
  };

  // ==========================================
  // 2. AI CALLING AGENTS STATE
  // ==========================================
  const [activeVoiceScenario, setActiveVoiceScenario] = useState<'healthcare' | 'realestate' | 'retail'>('healthcare');
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'connected' | 'completed'>('idle');
  const [voiceLogs, setVoiceLogs] = useState<Array<{ speaker: 'Customer' | 'AI Agent', text: string }>>([]);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const voiceScenarios: Record<'healthcare' | 'realestate' | 'retail', Array<{ speaker: 'Customer' | 'AI Agent'; text: string }>> = {
    healthcare: [
      { speaker: 'AI Agent', text: "Hello! Thank you for calling Apollo Aesthetics. I am your automated clinic assistant. Am I speaking with Priya Roy?" },
      { speaker: 'Customer', text: "Yes, this is Priya. I missed an appointment confirmation message." },
      { speaker: 'AI Agent', text: "Ah, I see that. You are scheduled for a premium Ayurvedic Skin Rejuvenation therapy tomorrow at 2:00 PM. Would you like me to confirm your booking?" },
      { speaker: 'Customer', text: "Yes, please confirm that. Can I add a massage therapy to that?" },
      { speaker: 'AI Agent', text: "Absolutely! I have added the Ayurvedic Abhyanga Massage addon to your session. Your updated appointment is secured. I have also synchronized this with our Razorpay checkout link for online payment. Anything else I can do for you?" },
      { speaker: 'Customer', text: "No, that is all. Thank you!" },
      { speaker: 'AI Agent', text: "Perfect, Priya! A confirmation message is on its way to your WhatsApp. Have a wonderful evening!" }
    ],
    realestate: [
      { speaker: 'AI Agent', text: "Hello! This is Arjun from Prestige Realty. I saw you were browsing our luxury 3BHK villas in Bangalore. Are you looking for self-use or investment?" },
      { speaker: 'Customer', text: "Hi, actually I am looking for investment. Do you have flexible payment options?" },
      { speaker: 'AI Agent', text: "Yes, indeed! For investors, we offer an interest-free 10:90 structural plan where you pay 10% now and nothing until possession. Would you like a brochure on WhatsApp?" },
      { speaker: 'Customer', text: "Yes, please send that over right away." },
      { speaker: 'AI Agent', text: "Excellent! Dispatched. I will also register you as a Hot Investor in our system. Have a great day!" }
    ],
    retail: [
      { speaker: 'AI Agent', text: "Hi, this is Organic Wellness Support! I noticed your payment for the skincare pack failed at checkout. Can I help you complete it?" },
      { speaker: 'Customer', text: "Yes, my card was declined twice. I don't know why." },
      { speaker: 'AI Agent', text: "I apologize for that! Let me generate a direct UPI QR code or alternative Stripe payment node for your convenience. I will send it via SMS now." },
      { speaker: 'Customer', text: "Great, I will use UPI instead. Thanks." },
      { speaker: 'AI Agent', text: "Perfect! Received and synced. Your order #5021 has been cleared for immediate shipping." }
    ]
  };

  const startVoiceCall = () => {
    setIsCalling(true);
    setCallStatus('dialing');
    setVoiceLogs([]);
    setCallDuration(0);

    // Simulated dialing
    setTimeout(() => {
      setCallStatus('connected');
      // Loop through scenario script
      const script = voiceScenarios[activeVoiceScenario];
      let i = 0;
      
      const printNextLine = () => {
        if (i < script.length && isCalling) {
          setVoiceLogs(prev => [...prev, script[i]]);
          i++;
          setTimeout(printNextLine, 2500);
        } else {
          setCallStatus('completed');
          setIsCalling(false);
        }
      };
      printNextLine();
    }, 1500);

    // Duration timer
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setCallStatus('completed');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ==========================================
  // 3. TEAM INBOX WORKSPACE STATE
  // ==========================================
  const [selectedThread, setSelectedThread] = useState<number>(1);
  const [inboxThreads, setInboxThreads] = useState([
    {
      id: 1,
      customer: "Karan Johar",
      channel: "WhatsApp",
      unread: true,
      lastMsg: "Is my payment confirmed? Pls verify",
      assignedTo: "Rahul Sharma",
      status: "Open",
      tag: "Payment Inquiry",
      history: [
        { sender: 'customer', text: "Hi, I sent ₹9,999 via UPI for the Starter subscription.", time: "10:10 AM" },
        { sender: 'system', text: "WhatsApp Bot: Checking ledger nodes...", time: "10:11 AM" },
        { sender: 'customer', text: "Is my payment confirmed? Pls verify", time: "10:15 AM" }
      ],
      notes: "Customer seems slightly anxious about UPI settlement speed."
    },
    {
      id: 2,
      customer: "Dr. Anjali Sen",
      channel: "LiveChat",
      unread: false,
      lastMsg: "Need demo for clinics",
      assignedTo: "Unassigned",
      status: "New",
      tag: "Demo Request",
      history: [
        { sender: 'customer', text: "Hello! I run 3 dental clinics. Can we automate appointment booking?", time: "09:45 AM" },
        { sender: 'bot', text: "Hi Dr. Anjali! Yes, we can route calls and WhatsApp notifications to single calendar pools.", time: "09:46 AM" },
        { sender: 'customer', text: "Need demo for clinics", time: "09:50 AM" }
      ],
      notes: "High intent clinic lead. Needs senior relationship manager."
    },
    {
      id: 3,
      customer: "Sneha Reddy",
      channel: "RCS",
      unread: false,
      lastMsg: "Thanks for the discount link!",
      assignedTo: "Meera Nair",
      status: "Closed",
      tag: "Support",
      history: [
        { sender: 'customer', text: "Do you have discount links for annual packages?", time: "Yesterday" },
        { sender: 'agent', text: "Dispatched! Here is a 15% discount for our Growth tier: SECURE15", time: "Yesterday" },
        { sender: 'customer', text: "Thanks for the discount link!", time: "Yesterday" }
      ],
      notes: "Annual upgrade completed."
    }
  ]);

  const [inboxReplyText, setInboxReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  const sendInboxReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboxReplyText.trim()) return;

    setInboxThreads(prev => prev.map(thread => {
      if (thread.id === selectedThread) {
        return {
          ...thread,
          unread: false,
          lastMsg: inboxReplyText,
          history: [...thread.history, { sender: 'agent', text: inboxReplyText, time: 'Now' }]
        };
      }
      return thread;
    }));
    setInboxReplyText('');
  };

  const saveInternalNote = () => {
    if (!internalNoteText.trim()) return;
    setInboxThreads(prev => prev.map(thread => {
      if (thread.id === selectedThread) {
        return {
          ...thread,
          notes: internalNoteText
        };
      }
      return thread;
    }));
    setInternalNoteText('');
  };

  // ==========================================
  // 4. WORKFLOW GRAPH HIGHLIGHTS STATE
  // ==========================================
  const [hoveredWorkflowIdx, setHoveredWorkflowIdx] = useState<number | null>(null);
  const workflowNodes = [
{ title: "Map one real customer journey", desc: "Understand how a request arrives, which information the team needs, where it is stored and where the current handover breaks down.", detail: "Understand how a request arrives, which information the team needs, where it is stored and where the current handover breaks down." },
{ title: "Agree the records and responsibilities", desc: "Define the customer record, status stages, owners, response rules and outcomes that make the process understandable.", detail: "Define the customer record, status stages, owners, response rules and outcomes that make the process understandable." },
{ title: "Connect the appropriate tools", desc: "Configure the agreed CRM, channels and workflow connections. Access, customer permissions and third-party costs are considered before activation.", detail: "Configure the agreed CRM, channels and workflow connections. Access, customer permissions and third-party costs are considered before activation." },
{ title: "Test the ordinary and difficult cases", desc: "Check missing information, duplicate requests, unavailable owners, failed actions and human handovers with representative examples.", detail: "Check missing information, duplicate requests, unavailable owners, failed actions and human handovers with representative examples." },
{ title: "Introduce, review and refine", desc: "Help the team use the workflow, review outstanding work and adjust the information, rules or handovers that need attention.", detail: "Help the team use the workflow, review outstanding work and adjust the information, rules or handovers that need attention." }
];

  // ==========================================
  // 5. LIVE CHARTS & ANALYTICS STATE
  // ==========================================
  const [analyticsCategory, setAnalyticsCategory] = useState<'response' | 'csat' | 'channels'>('response');

  // ==========================================
  // 6. ROI CALCULATOR STATE
  // ==========================================
  const [teamSize, setTeamSize] = useState(15);
  const [monthlyConversations, setMonthlyConversations] = useState(12000);
  const [avgTicketTime, setAvgTicketTime] = useState(25); // in minutes
  const [currentSoftwareCost, setCurrentSoftwareCost] = useState(35000); // in INR

  // Calculators:
  // 1. Cost savings: AI deflects 60% of tickets. Human tickets drop. Plus consolidated tool costs.
  const deflectedTickets = Math.round(monthlyConversations * 0.65);
  const hoursSaved = Math.round((deflectedTickets * avgTicketTime) / 60);
  const rawLaborSavings = hoursSaved * 180; // assume ₹180/hour rate
  const softwareSavings = Math.max(0, currentSoftwareCost - 24999); // compared to Growth tier (₹24,999)
  const totalMonthlySavings = rawLaborSavings + softwareSavings;

  const responseTimeBefore = "18 Minutes";
  const responseTimeAfter = "< 15 Seconds (Instant AI)";

  // ==========================================
  // 7. DEMO FORM SUBMISSION STATE
  // ==========================================
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'India',
    industry: 'Healthcare',
    teamSize: '11-50',
    conversations: '1,000 - 10,000',
    currentTool: 'Intercom / Zendesk',
    message: ''
  });

  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
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
      alert("Incorrect SUM value. Please try again.");
      generateCaptcha();
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please solve the verification math challenge first.");
      return;
    }
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1500);
  };

  // ==========================================
  // 8. FAQ STATE
  // ==========================================

  const faqs = [
{
      q: "What is BusinessOS?",
      a: "BusinessOS is Natton Digital’s approach to connecting CRM, business communications, customer support and operational workflows. We configure the agreed tools, responsibilities and handovers around how the team works. It is a scoped implementation and ongoing partnership, not a fixed software stack every business must adopt."
    },
{
      q: "Why use HighLevel for CRM?",
      a: "HighLevel can support contact records, conversations, pipelines, appointments and follow-up in the CRM scope we agree. The starting point is the business process and current systems. The selected setup should have a practical role, with responsibilities and data access reviewed before implementation."
    },
{
      q: "Do we need all eleven tools shown on the page?",
      a: "No. The tools are implementation options. Some overlap and are alternatives in a particular scope. We select the connections that fit the workflow, the systems already in use and the agreed budget. Implementation fees, subscriptions and usage charges are identified separately in the proposal."
    },
{
      q: "Can we keep our existing CRM and business tools?",
      a: "We can assess the existing systems and identify practical connections. Available system connections (APIs), data access, provider limits, account permissions and maintenance requirements affect the scope. We do not assume that every connection is native or already included in a platform subscription."
    },
{
      q: "Does every workflow use an AI assistant?",
      a: "No. A rule-based workflow or direct human response can be the better fit. AI may support a defined activity such as collecting information, answering agreed questions or assisting with calls, with suitable handover. Human ownership remains part of the operating design."
    },
{
      q: "How does BusinessOS differ from GrowthOS and AgenticOS?",
      a: "GrowthOS concentrates on marketing foundations, visibility and attracting relevant enquiries. BusinessOS organises customer context, communications and operational follow-up. AgenticOS addresses a more advanced, defined AI-agent workflow that needs tool access, oversight and evaluation. These are useful scopes to discuss, not compulsory upgrades."
    }
];

  // ==========================================
  // 9. CLIENT CAROUSEL STATE
  // ==========================================
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const clientStories = [
{
      brand: "BusinessOS — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative workflow. Human-led and AI-assisted paths are selected according to the task.",
      author: "BusinessOS — illustrative example"
    },
{
      brand: "BusinessOS — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative workflow. Human-led and AI-assisted paths are selected according to the task.",
      author: "BusinessOS — illustrative example"
    },
{
      brand: "BusinessOS — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative workflow. Human-led and AI-assisted paths are selected according to the task.",
      author: "BusinessOS — illustrative example"
    },
{
      brand: "BusinessOS — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative workflow. Human-led and AI-assisted paths are selected according to the task.",
      author: "BusinessOS — illustrative example"
    }
];

  return (
    <div className={`business-os-page py-12 animate-fade-in font-sans text-left transition-colors duration-500 overflow-hidden relative selection:bg-cyan-500 selection:text-white ${darkMode ? 'bg-[#03010E] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] -right-40 w-[600px] h-[600px] bg-emerald-950/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute -bottom-40 left-[15%] w-[600px] h-[600px] bg-blue-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* ==========================================
            1. HERO SECTION (Dark Premium Enterprise SaaS)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 relative">
          
          <div className="archive-hero-copy lg:col-span-7 space-y-6">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Keep"} <br />
<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">{"your business moving."}</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-gray-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#demo_form" 
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Live Demo <ArrowRight className="h-4 w-4" />
              </a>
              
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-cyan-400">{"Shared customer context"}</span>
              <span className="flex items-center gap-1.5 text-emerald-400">{"Clear ownership"}</span>
              <span className="flex items-center gap-1.5 text-blue-400">{"Visible next actions"}</span>
            </div>
          </div>

          {/* Right Column: Omnichannel Visual Grid */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            2. ECOSYSTEM (Bento Grid - 12 Cards)
           ========================================== */}
        <div id="ecosystem" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold">Integrated Communications</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"What we can help you connect"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.definition.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
{ title: "CRM & Customer Workspace", desc: "Bring contact records, conversations, opportunities and the next customer action into a practical workspace. HighLevel can support the CRM scope we agree, including pipelines, forms, calendars and follow-up. Existing systems can remain where they still have a useful role.", icon: MessageSquare, c: "text-emerald-400 bg-emerald-500/10" },
{ title: "Omnichannel Conversations", desc: "Connect the agreed messaging channels with useful context and a clear owner for the response. WhatsApp Business Platform, web chat, SMS and other channels depend on provider capabilities, customer permissions and the implementation scope. Rich Communication Services (RCS) messaging availability is assessed for the relevant provider and market.", icon: PhoneCall, c: "text-cyan-400 bg-cyan-500/10" },
{ title: "Calling & Appointments", desc: "Connect business calls, routing, appointment requests and team handovers. Cloud telephony or an AI-assisted calling flow may support a defined task, with a suitable route to a person. Calendar access and booking rules need to reflect how the business actually schedules work.", icon: Phone, c: "text-blue-400 bg-blue-500/10" },
{ title: "Support & Knowledge", desc: "Give service requests a home, a priority and a responsible owner. An agreed knowledge base can support consistent answers, while unresolved questions reach the appropriate team. Customer feedback and customer satisfaction (CSAT) surveys can be included where the process and available data make them useful.", icon: Smartphone, c: "text-purple-400 bg-purple-500/10" },
{ title: "Workflow Automation", desc: "Connect routine actions such as assignments, reminders, approved record updates and payment-event notifications. n8n, Zapier and native platform workflows are possible implementation options. Each connection is scoped against access, provider limits and the action it needs to perform.", icon: FileText, c: "text-pink-400 bg-pink-500/10" },
{ title: "Reporting & Team Visibility", desc: "Review open requests, response patterns, follow-up and available customer feedback. Reports should help the team decide what needs attention. Metric definitions and data coverage are agreed so a dashboard does not suggest visibility the connected systems cannot provide.", icon: MessageSquare, c: "text-yellow-400 bg-yellow-500/10" }
].map((card, idx) => {
              const Icon = card.icon || MessageSquare;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.c}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-xs font-bold font-display">{card.title}</h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1 text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                    <span>Active node</span> <ChevronRight className="h-2 w-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            3. INTERACTIVE TEAM INBOX EXPERIENCE
           ========================================== */}
        <div id="team_inbox" className="mb-24 scroll-mt-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold">Unified Inbox Sandbox</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Interactive Team Inbox Experience
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.example.note}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border border-white/10 rounded-3xl overflow-hidden bg-slate-950/60 backdrop-blur-md">
            
            {/* Left Queue Panel */}
            <div className="lg:col-span-4 border-r border-white/5 flex flex-col justify-between bg-black/20 min-h-[420px]">
              <div className="p-4 border-b border-white/5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">ACTIVE CHANNELS INBOX</span>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[10px] font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-grow overflow-y-auto divide-y divide-white/5">
                {inboxThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full p-4 text-left block transition-all ${
                      selectedThread === thread.id 
                        ? 'bg-cyan-500/10 border-l-4 border-cyan-400' 
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {thread.customer}
                        {thread.unread && <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${
                        thread.channel === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-400' :
                        thread.channel === 'LiveChat' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {thread.channel}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate mb-1">{thread.lastMsg}</p>
                    <div className="flex justify-between text-[8px] font-mono text-gray-500">
                      <span>Owner: {thread.assignedTo}</span>
                      <span className="text-zinc-500">{thread.tag}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Central Chat History and Reply */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 min-h-[420px]">
              {/* Target info */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/10">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {inboxThreads.find(x => x.id === selectedThread)?.customer}
                  </h4>
                  <span className="text-[8px] font-mono text-gray-500">
                    Channel: {inboxThreads.find(x => x.id === selectedThread)?.channel}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-mono">
                  SLA: Active
                </span>
              </div>

              {/* Chat lines */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-[220px]">
                {inboxThreads.find(x => x.id === selectedThread)?.history.map((msg, i) => {
                  const isUser = msg.sender === 'customer';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] text-[10px] font-mono leading-relaxed ${
                        isUser 
                          ? 'bg-slate-900/80 text-gray-300 border border-white/5' 
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="text-[7px] text-gray-400 block mt-1 text-right">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              <form onSubmit={sendInboxReply} className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
                <input 
                  type="text"
                  value={inboxReplyText}
                  onChange={(e) => setInboxReplyText(e.target.value)}
                  placeholder="Type official response..." 
                  className="flex-grow bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
                <button 
                  type="submit" 
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Right Context & private Note Panel */}
            <div className="lg:col-span-3 p-4 bg-slate-950 flex flex-col justify-between min-h-[420px]">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase block border-b border-white/5 pb-2">CUSTOMER CONTEXT</span>
                
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned Agent:</span>
                    <span className="text-white font-bold">{inboxThreads.find(x => x.id === selectedThread)?.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Tag:</span>
                    <span className="text-cyan-400 font-bold">{inboxThreads.find(x => x.id === selectedThread)?.tag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CRM Sync Status:</span>
                    <span className="text-emerald-400 font-bold">Synchronized</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-yellow-400 font-bold block">Internal Co-worker Notes:</span>
                  <div className="p-3 bg-black/30 border border-yellow-500/10 rounded text-[9px] text-yellow-100 font-mono italic">
                    "{inboxThreads.find(x => x.id === selectedThread)?.notes || "No notes written yet."}"
                  </div>
                </div>
              </div>

              {/* Add Note Input */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <textarea 
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Type secret internal note..." 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] font-mono focus:outline-none focus:border-yellow-500 h-16"
                />
                <button 
                  onClick={saveInternalNote}
                  className="w-full py-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded border border-yellow-500/30 text-[9px] font-mono font-bold uppercase"
                >
                  Save Internal Note
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            4. CHAT SIMULATOR (WhatsApp Live Interface)
           ========================================== */}
        <div id="whatsapp" className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 font-bold">
              <span>💬 OFFICIAL META CHATBOT</span>
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              WhatsApp Conversational Checkout
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.example.note}</p>

            <ul className="space-y-3 font-mono text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> WhatsApp Template Broadcast Campaigns</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Interactive Product Catalogs & Shopping Carts</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Bidirectional CRM Contact Auto-Updates</li>
            </ul>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-black overflow-hidden shadow-2xl relative">
              <div className="bg-[#075E54] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-emerald-400/50">W</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Wellness Chatbot API</h4>
                    <span className="text-[8px] text-emerald-300 font-mono">Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-white opacity-80" />
                  <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="h-64 p-4 bg-[#0B141A] overflow-y-auto space-y-4">
                {waMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-lg max-w-[80%] text-[10px] font-mono leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#005C4B] text-white' 
                        : 'bg-[#202C33] text-gray-300'
                    }`}>
                      <p>{msg.text}</p>
                      <span className="text-[7px] text-gray-400 block text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isWaTyping && (
                  <div className="flex justify-start">
                    <div className="p-2 bg-[#202C33] text-gray-400 rounded-lg text-[9px] font-mono animate-pulse">
                      Typing auto reply...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleWaSend} className="p-3 bg-[#1F2C34] border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={waInput}
                  onChange={(e) => setWaInput(e.target.value)}
                  placeholder="Type 'Monday' or alternative..."
                  className="flex-grow bg-[#2A3942] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
                <button type="submit" className="p-2 bg-[#00A884] hover:bg-[#008F72] text-white rounded-lg flex items-center justify-center">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ==========================================
            5. AI CALLING AGENTS (Voice Wave Simulation)
           ========================================== */}
        <div id="ai_calling" className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold">
              <span>📞 SPOKEN INTELLIGENCE VOICE</span>
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              AI Spoken Calling Agents
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.example.note}</p>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Choose Scenario:</span>
              <div className="flex gap-2">
                {[
                  { id: 'healthcare', label: 'Clinics Booking' },
                  { id: 'realestate', label: 'Real Estate' },
                  { id: 'retail', label: 'Retail Support' }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      if (!isCalling) setActiveVoiceScenario(sc.id as any);
                    }}
                    className={`px-3 py-1 rounded text-[10px] font-mono border ${
                      activeVoiceScenario === sc.id 
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' 
                        : 'border-white/5 bg-black/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1 flex justify-center">
            <div className="w-full max-w-[380px] p-6 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 animate-bounce" /> VOICE NODE ACTIVE
                </span>
                <span className="text-[9px] text-gray-500 font-mono">Duration: {callDuration}s</span>
              </div>

              {/* Call Controls & Dial Box */}
              {callStatus === 'idle' && (
                <div className="text-center py-8 space-y-4 my-auto">
                  <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold">System ready for dialer output</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Scenario: {activeVoiceScenario.toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={startVoiceCall}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold uppercase transition-all"
                  >
                    Start Simulated Voice Call
                  </button>
                </div>
              )}

              {callStatus === 'dialing' && (
                <div className="text-center py-8 space-y-4 my-auto">
                  <div className="h-16 w-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-400 animate-spin">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-mono text-yellow-400 font-bold animate-pulse">Dialing automated client line...</h4>
                </div>
              )}

              {(callStatus === 'connected' || callStatus === 'completed') && (
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  {/* Voice waveform */}
                  <div className="h-12 w-full flex items-center justify-center gap-1 bg-black/40 border border-white/5 rounded-xl">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                      const h = callStatus === 'connected' ? Math.floor(Math.random() * 28) + 4 : 4;
                      return (
                        <div 
                          key={bar} 
                          className="w-1.5 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-full transition-all duration-300" 
                          style={{ height: `${h}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Script display scroll */}
                  <div className="p-3 bg-black/20 border border-white/5 rounded-lg max-h-[140px] overflow-y-auto space-y-2 text-[9px] font-mono leading-relaxed">
                    {voiceLogs.map((log, i) => (
                      <p key={i} className={log.speaker === 'AI Agent' ? 'text-cyan-300' : 'text-gray-400'}>
                        <strong>{log.speaker}:</strong> {log.text}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {callStatus === 'connected' && (
                      <button 
                        onClick={endVoiceCall}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-mono font-bold uppercase"
                      >
                        Disconnect Call
                      </button>
                    )}
                    {callStatus === 'completed' && (
                      <button 
                        onClick={startVoiceCall}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-mono font-bold uppercase"
                      >
                        Redial Call
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ==========================================
            6. COMMUNICATION WORKFLOW (Node-Based Diagram)
           ========================================== */}
        <div id="workflow" className="mb-24 space-y-12 scroll-mt-12 solution-process-section">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold">Node Routing Flow</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"How we work"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative solution-process-step-grid">
            {workflowNodes.map((node, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredWorkflowIdx(i)}
                onMouseLeave={() => setHoveredWorkflowIdx(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 relative ${
                  hoveredWorkflowIdx === i 
                    ? 'border-cyan-400 bg-cyan-500/5 scale-[1.02]' 
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                <div className="absolute top-4 right-4 text-xs font-mono text-gray-600 font-bold">#0{i+1}</div>
                <h3 className="text-sm font-bold font-display text-white mb-2">{node.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{node.desc}</p>
                
                {hoveredWorkflowIdx === i && (
                  <div className="p-3 bg-black/40 border border-cyan-500/20 rounded-xl text-[10px] font-mono text-cyan-300">
                    {node.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            7. CONVERSATION ANALYTICS (Response, CSAT, Volume)
           ========================================== */}
        <div id="analytics" className="business-analytics mb-24 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Performance Analytics</span>
              <h2 className="text-3xl font-bold font-display tracking-tight">{"Useful signals. Better conversations."}</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{"We agree the indicators around your objective, the information available and the work in scope. Review the quality of the next step as well as the activity that led to it."}</p>

              <div className="space-y-3">
                <button
                  onClick={() => setAnalyticsCategory('response')}
                  className={`w-full p-4 text-left border rounded-xl flex justify-between items-center transition-all ${
                    analyticsCategory === 'response' ? 'border-cyan-400 bg-cyan-500/5 text-white' : 'border-white/5 text-gray-400'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">Average Response Intervals</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAnalyticsCategory('csat')}
                  className={`w-full p-4 text-left border rounded-xl flex justify-between items-center transition-all ${
                    analyticsCategory === 'csat' ? 'border-emerald-400 bg-emerald-500/5 text-white' : 'border-white/5 text-gray-400'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">Customer Satisfaction Index (CSAT)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="text-sm font-bold font-mono">
                    {analyticsCategory === 'response' ? '📊 SLA RESPONSE OVERVIEW' : '📈 CSAT SCORE DISTRIBUTION'}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 animate-pulse">Illustrative example</span>
                </div>

                {analyticsCategory === 'response' ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">WhatsApp Inbound Automated</span>
                        <span className="text-cyan-400 font-bold">98% Responded (Sub-Seconds)</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-[98%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Inbound Cloud IVR Routing</span>
                        <span className="text-blue-400 font-bold">92% Connected</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[92%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Support Helpdesk Manual Tickets</span>
                        <span className="text-pink-400 font-bold">85% Resolved within SLA</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full w-[85%]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-1">
                        <span className="text-[10px] font-mono text-gray-500 block">TOTAL RATINGS</span>
                        <span className="text-white text-base font-bold font-mono">2,840</span>
                      </div>
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-1">
                        <span className="text-[10px] font-mono text-gray-500 block">EXCELLENT (5★)</span>
                        <span className="text-emerald-400 text-base font-bold font-mono">92.4%</span>
                      </div>
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-1">
                        <span className="text-[10px] font-mono text-gray-500 block">AVG CSAT</span>
                        <span className="text-cyan-400 text-base font-bold font-mono">4.85 / 5</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
          <ArchiveContentGroup page={archivePage} group="metrics" />
        </div>

        {/* ==========================================
            8. BUILT FOR EVERY INDUSTRY (Use Cases)
           ========================================== */}
        <div id="industry_use_cases" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold font-bold">Vertical Adaptability</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Who this can help"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="business-audience-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Growing MSMEs and SMBs', description: 'Bring enquiries, customer records and follow-ups into one organised workflow so your team can see who owns the next step.' },
              { title: 'B2B sales and service teams', description: 'Connect sales conversations with appointments and service requests. Keep handovers clear as a customer moves between teams.' },
              { title: 'Multi-location businesses', description: 'Coordinate incoming enquiries across branches, assign the right owner and review shared reporting with appropriate access for each team.' }
            ].map(item => (
              <article key={item.title} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <Briefcase className="h-6 w-6 text-cyan-400" />
                <h3 className="text-lg font-bold font-display">{item.title}</h3>
                <p className="text-sm leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* ==========================================
            9. INTEGRATIONS (Continuous Horizontal Scroll)
           ========================================== */}
        <div id="integrations" className="mb-24 space-y-8 overflow-hidden relative">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold font-bold font-bold">Workspace Connections</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Connect Your Business Stack
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.scopeNote}</p>
          </div>

          <div className="relative w-full flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
              {[
                "GoHighLevel", "HubSpot", "Salesforce", "WhatsApp API", "Google Workspace",
                "Slack", "Zoom", "Razorpay", "Stripe", "n8n", "Zapier", "Shopify"
              ].map((logo, idx) => (
                <div key={idx} className="px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-mono text-cyan-300 font-bold inline-block">
                  🔌 {logo}
                </div>
              ))}
            </div>

            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#03010E] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#03010E] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ==========================================
            10. WHY CHOOSE BUSINESSOS (Comparison Table)
           ========================================== */}
        <div id="comparison" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold font-bold font-bold">Unmatched Utility</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.definition.title}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.definition.body}</p>
          </div><ArchiveContentGroup page={archivePage} group="needs" />

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/40 backdrop-blur-md overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10">
                  <th className="p-4 text-gray-400 font-bold uppercase">Features</th>
                  <th className="p-4 text-cyan-300 font-bold uppercase">BusinessOS™</th>
                  <th className="p-4 text-zinc-500 uppercase">Intercom</th>
                  <th className="p-4 text-zinc-500 uppercase">Freshworks</th>
                  <th className="p-4 text-zinc-500 uppercase">Zendesk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { f: "Unified Team Inbox Queue", os: "Yes (All channels included)", int: "Extra addon costs", fw: "Limited separate layouts", zd: "Fragmented queue" },
                  { f: "Official WhatsApp Cloud API", os: "Yes (Included natively)", int: "Heavily priced per conversation", fw: "Separate billing setup", zd: "Third-party connector needed" },
                  { f: "AI Spoken Voice Calling Agents", os: "Yes (Built-in)", int: "Not supported natively", fw: "Basic telephony fallback", zd: "Requires external integration" },
                  { f: "Interactive Chatbot Flow Creator", os: "Yes (Drag & Drop)", int: "Premium tier unlock only", fw: "Extra module subscription", zd: "Requires custom builder code" },
                  { f: "Predictive Lead Scoring & Tags", os: "Yes (AI automated)", int: "Not supported", fw: "Requires Enterprise license", zd: "Basic tags only" },
                  { f: "RCS / Rich Video Messaging", os: "Yes (Supported)", int: "Not supported", fw: "Not supported", zd: "Requires custom plugin" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-gray-300 font-bold">{row.f}</td>
                    <td className="p-4 text-cyan-400 font-bold bg-cyan-500/5">{row.os}</td>
                    <td className="p-4 text-gray-500">{row.int}</td>
                    <td className="p-4 text-gray-500">{row.fw}</td>
                    <td className="p-4 text-gray-500">{row.zd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            11. ROI CALCULATOR SECTION
           ========================================== */}
        <div id="roi_calculator" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold">Financial Visualizer</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Calculate Communication ROI
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-white/10 rounded-3xl p-6 bg-slate-950/60 backdrop-blur-md">
            
            {/* Input Slider Blocks */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
              
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-400">Team Size (Support agents):</span>
                  <span className="text-white font-bold">{teamSize} Agents</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="100" 
                  value={teamSize} 
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-400">Monthly Customer Conversations:</span>
                  <span className="text-white font-bold">{monthlyConversations.toLocaleString()} Chats</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={monthlyConversations} 
                  onChange={(e) => setMonthlyConversations(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-400">Average Resolution Time per ticket:</span>
                  <span className="text-white font-bold">{avgTicketTime} Minutes</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  value={avgTicketTime} 
                  onChange={(e) => setAvgTicketTime(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 mb-1">Current software cost (INR / Month):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-mono text-xs">₹</span>
                  <input 
                    type="number" 
                    value={currentSoftwareCost} 
                    onChange={(e) => setCurrentSoftwareCost(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-7 pr-4 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Outputs Visual representation */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block border-b border-white/5 pb-2 mb-4 font-bold">ESTIMATED MONTHLY SAVINGS</span>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block">TOTAL FINANCIAL DEFLECTION</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                    ₹{totalMonthlySavings.toLocaleString('en-IN')}/mo
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 mt-1">Calculated using an average conversational deflection rating of 65% by AI agents.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 block">LABOR HOURS SAVED</span>
                    <span className="text-sm font-bold font-mono text-cyan-400">{hoursSaved} Hours / mo</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 block">SLA RESPONSE INTERVALS</span>
                    <span className="text-sm font-bold font-mono text-white flex items-center gap-1"><Clock className="h-4 w-4 text-emerald-400" /> Instant</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 flex items-center gap-1">
                <span>Calculations verified by Natton financial metrics models.</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            12. PRICING PLANS
           ========================================== */}
        <div id="pricing" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold font-bold font-bold">Predictable Packages</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"A practical scope. A team that stays involved."}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[{
                name: "Define the scope",
                price: "Let’s discuss",
                popular: false,
                desc: "We first map the current customer process and responsibilities. CRM structure, routing and selected connections are configured in stages, then checked with representative cases before the team starts using them. Timing depends on data quality, account access, provider limits and the handovers in scope.",
                features: ["A customer-record structure and agreed CRM stages","Conversation routing and named request owners","Scoped reminders, calendar rules and handovers","Tested connections and exception-handling notes","Team guidance and agreed operational reports"],
                bg: "border-white/5 bg-white/[0.01]"
              },{
                name: "Configure and test",
                price: "Let’s discuss",
                popular: true,
                desc: "We first map the current customer process and responsibilities. CRM structure, routing and selected connections are configured in stages, then checked with representative cases before the team starts using them. Timing depends on data quality, account access, provider limits and the handovers in scope.",
                features: ["A customer-record structure and agreed CRM stages","Conversation routing and named request owners","Scoped reminders, calendar rules and handovers","Tested connections and exception-handling notes","Team guidance and agreed operational reports"],
                bg: "border-cyan-500/40 bg-gradient-to-b from-cyan-950/10 to-transparent relative shadow-xl shadow-cyan-500/5"
              },{
                name: "Review and refine",
                price: "Let’s discuss",
                popular: false,
                desc: "We first map the current customer process and responsibilities. CRM structure, routing and selected connections are configured in stages, then checked with representative cases before the team starts using them. Timing depends on data quality, account access, provider limits and the handovers in scope.",
                features: ["A customer-record structure and agreed CRM stages","Conversation routing and named request owners","Scoped reminders, calendar rules and handovers","Tested connections and exception-handling notes","Team guidance and agreed operational reports"],
                bg: "border-white/5 bg-white/[0.01]"
              }].map((plan, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border flex flex-col justify-between ${plan.bg}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{plan.desc}</p>
                    </div>
                    {plan.popular && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold font-mono uppercase tracking-wider">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div className="py-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{plan.price}</span>
                  </div>

                  <ul className="space-y-3 border-t border-white/5 pt-4 text-[11px] font-mono text-gray-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a 
                    href="#demo_form"
                    className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold block text-center transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:from-cyan-500 hover:to-emerald-500 shadow-md shadow-cyan-500/25' 
                        : 'border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white'
                    }`}
                  >
                    Select {plan.name} Package
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            13. CUSTOMER SUCCESS STORIES (Carousel)
           ========================================== */}
        <div id="customer_stories" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase block font-bold font-bold font-bold font-bold">Client Triumphs</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.example.title}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.example.description}</p>
          </div><ArchiveContentGroup page={archivePage} group="example" />

          <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-4 right-4 text-gray-600 font-mono font-bold text-xs">#0{activeStoryIdx+1}</div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 font-display">
                    {clientStories[activeStoryIdx].brand}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-500">Industry Client Case</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                  {clientStories[activeStoryIdx].growth}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed">
                "{clientStories[activeStoryIdx].quote}"
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-gray-500">
                  By {clientStories[activeStoryIdx].author}
                </span>
                
                <div className="flex gap-2">
                  {clientStories.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveStoryIdx(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        activeStoryIdx === i ? 'bg-cyan-400 w-4' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            14. FAQ ACCORDION SECTION
           ========================================== */}
        <ArchiveFAQ items={faqs.map(item => ({question:item.q,answer:item.a}))} idPrefix="business-os" />

        {/* ==========================================
            15. DEMO FORM (GHL + Captcha Validation)
           ========================================== */}
        <div id="demo_form" className="mb-24 scroll-mt-12">
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center space-y-3 mb-8">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">BOOK PRODUCT INTAKE</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Book Your BusinessOS™ Demo
              </h2>
              <p className="text-xs text-gray-400">
                Submit details below to schedule an onboarding consultation call. Our engineers will follow up in 2 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-mono">Demo Booked Successfully!</h3>
                  <p className="text-[11px] text-gray-400 font-mono">We have synced this lead with our GoHighLevel pipeline webhook.</p>
                </div>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-bold"
                >
                  Book Another Consultation
                </button>
              </div>
            ) : (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            )}
          </div>
        </div>

        {/* ==========================================
            16. FINAL HIGH IMPACT CTA
           ========================================== */}
        <div id="final_cta" className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00ffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-white">{"Let’s make the next step clearer."}</h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{"Tell us about your priorities, the people you want to reach and where the process needs attention."}</p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a 
                href="#demo_form"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-cyan-300 hover:scale-[1.01] transition-all text-xs font-mono uppercase"
              >
                Secure Consultation Demo
              </a>
              <a 
                href="#roi_calculator"
                className="px-6 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-400 transition-all text-xs font-mono uppercase"
              >
                Recalculate Savings
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
