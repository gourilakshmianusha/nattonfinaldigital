import './industry-process-layout.css';
import archivePage from '../content/ten-pages/education-edtech.json';
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
  SlidersHorizontal,
  BookOpen,
  GraduationCap,
  Award,
  Bell,
  Fingerprint,
  Link2
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function IndustryEducation({ setPath, darkMode }: { setPath: (path: RoutePath) => void; darkMode: boolean }) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ==========================================
  // DIGITAL CAMPUS MESH CANVAS BACKGROUND
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

    const particleCount = 70;
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
      'rgba(14, 165, 233, 0.45)', // Sky Blue
      'rgba(168, 85, 247, 0.45)', // Purple
      'rgba(45, 212, 191, 0.35)', // Teal/Cyan
      'rgba(255, 255, 255, 0.2)' // White
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw elegant digital grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;
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

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.16;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
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
        p.pulse += 0.012;
        const radius = p.radius + Math.sin(p.pulse) * 0.5;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

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
  // 3D SMART CAMPUS ECOSYSTEM NODES
  // ==========================================
  const [selectedEcoNode, setSelectedEcoNode] = useState<string>('websites');
  const ecoNodes = [
{
      id: 'websites',
      title: "Education website & course pages",
      desc: "Present programme details, entry requirements, delivery format, fees, schedules and useful FAQs. Build clear enquiry or application routes around the institution's process.",
      features: ["A learner, programme and admissions-cycle plan","Accurate course pages and useful learner information","Selected campaign assets and enquiry routes","Counsellor ownership and agreed follow-up stages","A programme-level measurement and review plan"],
      icon: Globe
    },
{
      id: 'crm',
      title: "Education SEO & campus discovery",
      desc: "Research programme, career-learning and location intent. Improve course content and eligible campus profiles while keeping online-only and physical-location visibility needs distinct.",
      features: ["A learner, programme and admissions-cycle plan","Accurate course pages and useful learner information","Selected campaign assets and enquiry routes","Counsellor ownership and agreed follow-up stages","A programme-level measurement and review plan"],
      icon: Database
    },
{
      id: 'whatsapp',
      title: "Intake and programme campaigns",
      desc: "Plan suitable advertising around the audience, intake window and course offering. Align ads with accurate landing-page information and the counselling team's ability to respond.",
      features: ["A learner, programme and admissions-cycle plan","Accurate course pages and useful learner information","Selected campaign assets and enquiry routes","Counsellor ownership and agreed follow-up stages","A programme-level measurement and review plan"],
      icon: MessageSquare
    },
{
      id: 'voice_ai',
      title: "Content that answers real questions",
      desc: "Create course explainers, faculty introductions, learning-format previews and approved learner stories. Qualifications, recognition and outcome claims are checked with the institution before use.",
      features: ["A learner, programme and admissions-cycle plan","Accurate course pages and useful learner information","Selected campaign assets and enquiry routes","Counsellor ownership and agreed follow-up stages","A programme-level measurement and review plan"],
      icon: Phone
    },
{
      id: 'workflows',
      title: "Admissions CRM & counselling follow-up",
      desc: "Organise enquiry source, programme interest, assigned counsellor and next action. Add agreed acknowledgements and reminders, with staff responsible for admissions advice and decisions.",
      features: ["A learner, programme and admissions-cycle plan","Accurate course pages and useful learner information","Selected campaign assets and enquiry routes","Counsellor ownership and agreed follow-up stages","A programme-level measurement and review plan"],
      icon: Workflow
    }
];

  // ==========================================
  // STUDENT ACQUISITION BLUEPRINT (Interactive Funnel)
  // ==========================================
  const funnelSteps = [
{ id: 'web', stage: "Define the programme and learner", name: "Define the programme and learner", rate: "Agreed scope", desc: "Confirm the courses, learning formats, locations, audience, entry information and intake calendar. Identify who approves content and owns counselling follow-up." },
{ id: 'seo', stage: "Make course information useful", name: "Make course information useful", rate: "Agreed scope", desc: "Review the website, programme pages, enquiry routes and proof that can be substantiated. Resolve unclear eligibility, schedule, fee or recognition information before promotion." },
{ id: 'ads', stage: "Reach relevant learners", name: "Reach relevant learners", rate: "Agreed scope", desc: "Combine suitable search content, social communication and campaigns around the agreed programme and audience. Choose channels because they fit the decision journey, not because every platform must be used." },
{ id: 'capture', stage: "Connect enquiries to counselling", name: "Connect enquiries to counselling", rate: "Agreed scope", desc: "Give each enquiry an owner, programme context and next action. Test any acknowledgement, reminder and handover flow before it supports the admissions team." },
{ id: 'crm', stage: "Review the quality of the journey", name: "Review the quality of the journey", rate: "Agreed scope", desc: "Compare sources, relevant enquiries and available counselling or application milestones. Use the team's feedback to improve information, targeting and follow-up over time." }
];
  const [activeFunnelStep, setActiveFunnelStep] = useState<number>(0);

  // ==========================================
  // ADMISSION GROWTH MARKETING DASHBOARD
  // ==========================================
  const [activeMktTab, setActiveMktTab] = useState<'seo' | 'ads' | 'social' | 'local'>('seo');
  const mktDashboard = {
    seo: {
      stats: [
        { label: 'Organic Monthly Intakes', value: '54,210', change: '+34.2%', ok: true },
        { label: 'AEO AI Grounding Ratio', value: '11,450 matches', change: '+185%', ok: true },
        { label: 'Keywords in Top 5 Results', value: '184 words', change: '+29%', ok: true }
      ],
      list: [
        { item: 'best computer science colleges in town', ranking: '#1', volume: '3,800/mo', conversion: '6.4%' },
        { item: 'top CBSE high school admission syllabus', ranking: '#1', volume: '2,900/mo', conversion: '8.2%' },
        { item: 'affordable robotic coaching institute', ranking: '#2', volume: '1,400/mo', conversion: '5.1%' },
        { item: 'lasalle graphic design coaching fee', ranking: '#3', volume: '980/mo', conversion: '4.8%' }
      ]
    },
    ads: {
      stats: [
        { label: 'Meta Ads Cost-Per-Lead (CPL)', value: '₹118.00', change: '-41.2%', ok: true },
        { label: 'Google Ads CPC (Average)', value: '₹22.50', change: '-24%', ok: true },
        { label: 'Application Form Completion Rate', value: '14.2%', change: '+5.6%', ok: true }
      ],
      list: [
        { item: 'Core Meta Intake Lead Gen (June)', ranking: '₹14,500 budget', volume: '1,240 leads', conversion: '₹112/lead' },
        { item: 'High-Intent Google Ads CS/IT Special', ranking: '₹25,000 budget', volume: '840 leads', conversion: '₹210/lead' },
        { item: 'Scholarship Admission Retargeting Loop', ranking: '₹8,000 budget', volume: '320 leads', conversion: '₹95/lead' }
      ]
    },
    social: {
      stats: [
        { label: 'Google Map Views (GBP)', value: '142,800', change: '+44%', ok: true },
        { label: 'Click-To-Directions Fired', value: '3,410', change: '+52%', ok: true },
        { label: 'Click-To-Call Phone Triggers', value: '1,942', change: '+38%', ok: true }
      ],
      list: [
        { item: 'Downtown Main Campus Google Profile', ranking: '#1 on Map', volume: '1,842 calls', conversion: '1,940 directions' },
        { item: 'West Branch Coaching Academy Profile', ranking: '#2 on Map', volume: '820 calls', conversion: '1,100 directions' },
        { item: 'East Research Laboratory Annex Profile', ranking: '#1 on Map', volume: '610 calls', conversion: '942 directions' }
      ]
    }
  };

  // ==========================================
  // GROWTHOS™ ADMISSIONS CRM PREVIEW
  // ==========================================
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_1');
  const studentsList = [
    { id: 'std_1', name: 'Rohan Malhotra', age: 18, course: 'B.Tech Computer Science', date: 'Today, 09:12 AM', status: 'Document Verified', source: 'Meta Lead Form', color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'std_2', name: 'Ananya Sen', age: 16, course: 'IIT-JEE Prep Foundation', date: 'Today, 10:45 AM', source: 'Google Local SEO', status: 'Counsel Scheduled', color: 'text-teal-400 bg-teal-500/10' },
    { id: 'std_3', name: 'Devendra Kulkarni', age: 19, course: 'BBA Global Business', date: 'Today, 01:20 PM', source: 'WhatsApp Bot', status: 'Fees Pending', color: 'text-amber-400 bg-amber-500/10' },
    { id: 'std_4', name: 'Ishita Kapoor', age: 21, course: 'UI/UX Diploma EdTech', date: 'Yesterday, 04:30 PM', source: 'Direct Website', status: 'Enrolled Success', color: 'text-emerald-400 bg-emerald-500/10' }
  ];
  const studentDetails: Record<string, { notes: string; timeline: Array<{ time: string; event: string; type: string }> }> = {
    std_1: {
      notes: 'Rohan Malhotra is an honors applicant with 94.2% CBSE board score. High priority lead. Recommends direct Merit Scholarship prospectus dispatch.',
      timeline: [
        { time: '09:20 AM', event: 'Transcripts & CBSE marksheets verified by registrar system', type: 'System' },
        { time: '09:15 AM', event: 'Assigned to Admission Advisor Mrs. Roy', type: 'CRM Registry' },
        { time: '09:12 AM', event: 'Lead captured via Meta high-intent ads', type: 'Acquisition' }
      ]
    },
    std_2: {
      notes: 'Ananya Sen requested details for the premium Weekend Class 11-12 IIT-JEE program. Parents want a campus tour and physical counseling slot.',
      timeline: [
        { time: '11:00 AM', event: 'WhatsApp reservation link clicked for Campus Tour', type: 'WhatsApp' },
        { time: '10:48 AM', event: 'Outbound AI Calling Agent collected batch interest parameter', type: 'Voice AI' },
        { time: '10:45 AM', event: 'Inquiry received via website local maps search', type: 'SEO' }
      ]
    },
    std_3: {
      notes: 'Devendra Kulkarni passed preliminary counseling interview. Awaiting semester tuition deposit. Payment link active for 24 hours.',
      timeline: [
        { time: '01:50 PM', event: 'Tuition Invoice PDF & UPI QR code dispatched', type: 'Automation' },
        { time: '01:30 PM', event: 'Counseling checklist marked "Qualified" by Prof. Verma', type: 'Counselor' },
        { time: '01:20 PM', event: 'Completed interactive questionnaire via WhatsApp Bot', type: 'AI Agent' }
      ]
    },
    std_4: {
      notes: 'Ishita Kapoor enrolled successfully. LMS credentials created and sent. First class scheduled for upcoming Monday.',
      timeline: [
        { time: 'Yesterday', event: 'Admission receipt issued. Assigned Cohort ID #CSX-04', type: 'System' },
        { time: '2 days ago', event: 'Stripe Payment confirmed: ₹45,000', type: 'Finance' },
        { time: '3 days ago', event: 'Syllabus counseling completed over Zoom', type: 'Counselor' }
      ]
    }
  };

  // ==========================================
  // BUSINESSOS™ SIMULATED INTERACTIVE WHATSAPP
  // ==========================================
  const [waMessages, setWaMessages] = useState([
    { sender: 'user', text: 'Hello, I would like to check details for B.Tech CSE Admissions 2026.', time: '11:20 AM' },
    { sender: 'system', text: 'Hello! I am your Smart Virtual Admission Counselor. 🎓\n\nI can help you check course structures, calculate fee structures, or book an official counselor interview right here.', time: '11:20 AM' },
    { sender: 'system', text: 'Which option would you like to explore today? Please select by typing the number:\n1️⃣ Download CSE Course Syllabus PDF\n2️⃣ Calculate Semester Fees & Scholarships\n3️⃣ Book a 1-on-1 counseling call', time: '11:21 AM' }
  ]);
  const [newWaMsg, setNewWaMsg] = useState('');
  const [isWaTyping, setIsWaTyping] = useState(false);

  const handleWaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaMsg.trim()) return;

    const userMessage = { sender: 'user', text: newWaMsg, time: '11:21 AM' };
    setWaMessages(prev => [...prev, userMessage]);
    const text = newWaMsg.trim();
    setNewWaMsg('');
    setIsWaTyping(true);

    setTimeout(() => {
      let replyText = 'Pondering your request... Accessing our course matrix database...';
      if (text.includes('1') || text.toLowerCase().includes('syllabus') || text.toLowerCase().includes('course')) {
        replyText = '📚 Excellent choice! I have retrieved the **B.Tech CSE 2026 Syllabus**. \n\nKey Highlights: \n- Semester 1-4: Advanced AI Algorithms, Full-Stack Node Engine, and Data Systems.\n- Semester 5-8: Generative AI, Cloud Systems, and Internship capstones.\n\n👉 [Click here to download PDF Prospectus] (Simulated)';
      } else if (text.includes('2') || text.toLowerCase().includes('fee') || text.toLowerCase().includes('scholar')) {
        replyText = '💰 Semester Fee Matrix calculated for B.Tech Computer Science: \n- Base Tuition Fee: ₹1,20,000 per semester. \n- Merit Discount (based on 90%+ CBSE marks): 25% Off Tuition.\n- Net Semester Tuition: ₹90,000 only.\n\nWould you like me to send the direct UPI payment link to book your slot?';
      } else if (text.includes('3') || text.toLowerCase().includes('book') || text.toLowerCase().includes('call') || text.toLowerCase().includes('meet')) {
        replyText = '🗓️ Scheduling Desk: I have open counselor slots tomorrow! \n- Option A: 10:30 AM (Mrs. Priya Roy)\n- Option B: 03:00 PM (Prof. K. Sen)\n\nSimply reply with "A" or "B" to lock your consultation slot.';
      } else if (text.toUpperCase() === 'A' || text.toLowerCase().includes('10')) {
        replyText = '🎉 Confirmed! Your B.Tech admission counseling call is scheduled for tomorrow at 10:30 AM with Mrs. Priya Roy. \n\nAn outbound dialer will automatically call you on this number. Have a wonderful day!';
      } else {
        replyText = 'Got it! I have flagged your number. One of our human admission coordinators will message you directly on this chat thread shortly.';
      }

      setWaMessages(prev => [...prev, { sender: 'system', text: replyText, time: '11:22 AM' }]);
      setIsWaTyping(false);
    }, 1200);
  };

  // ==========================================
  // AGENTICOS™ FOR EDUCATION (MULTI-AGENTS)
  // ==========================================
  const [activeAgentId, setActiveAgentId] = useState<string>('admission');
  const educationAgents = [
{
      id: 'admission',
      name: "Education website & course pages",
      icon: GraduationCap,
      role: "Present programme details, entry requirements, delivery format, fees, schedules and useful FAQs. Build clear enquiry or application routes around the institution's process.",
      prompt: 'SYSTEM: Parse intake message. Extract student_name, guardian_phone, intended_course, and academic_score. Check database to ensure no duplicate files exist, then map details to course pipelines.',
      metrics: '88% qualified lead conversion, 10s latency SLA'
    },
{
      id: 'support',
      name: "Education SEO & campus discovery",
      icon: BookOpen,
      role: "Research programme, career-learning and location intent. Improve course content and eligible campus profiles while keeping online-only and physical-location visibility needs distinct.",
      prompt: 'SYSTEM: Authenticate student registration ID against LMS directories. Answer student queries regarding classroom location coordinates, holiday timetables, or professor email listings.',
      metrics: '91% inquiry deflection, instant 24/7 turnaround'
    },
{
      id: 'parent',
      name: "Intake and programme campaigns",
      icon: Users,
      role: "Plan suitable advertising around the audience, intake window and course offering. Align ads with accurate landing-page information and the counselling team's ability to respond.",
      prompt: 'SYSTEM: Extract student performance logs. Draft supportive and polite updates to parent WhatsApp threads. Highlight key improvement subjects and class attendance trends.',
      metrics: '420% parental engagement increase'
    },
{
      id: 'fee_reminder',
      name: "Content that answers real questions",
      icon: DollarSign,
      role: "Create course explainers, faculty introductions, learning-format previews and approved learner stories. Qualifications, recognition and outcome claims are checked with the institution before use.",
      prompt: 'SYSTEM: Query finance database for pending fees. Apply scholarships (e.g. Merit 10%). Create custom Razorpay payment gateways and send automated nudges with zero aggressive tone.',
      metrics: '94% timely fee recovery rate, zero manual tracking'
    },
{
      id: 'counselling_assistant',
      name: "Admissions CRM & counselling follow-up",
      icon: Award,
      role: "Organise enquiry source, programme interest, assigned counsellor and next action. Add agreed acknowledgements and reminders, with staff responsible for admissions advice and decisions.",
      prompt: 'SYSTEM: Scan uploaded student marksheets and interests. Generate candidate assessment summaries. Suggest fitting engineering/science branches and scholarship eligibility.',
      metrics: 'Halves interview intake prep time for counselors'
    },
{
      id: 'faq',
      name: "Enquiry-to-application visibility",
      icon: HelpCircle,
      role: "Review programme interest, suitable enquiries, attended counselling and application milestones where the data is available. Separate campaign activity from verified enrolment outcomes.",
      prompt: 'SYSTEM: Retrieve official institutional handbook. Answer queries about hostel amenities, cafeteria hygiene standards, bus routing schedules, and university approvals.',
      metrics: 'Over 800 hours saved in human reception work'
    }
];

  // ==========================================
  // ADMISSION AUTOMATION WORKFLOWS (Node diagram)
  // ==========================================
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState<number>(0);
  const workflowsList = [
{
      title: "Define the programme and learner",
      desc: "Confirm the courses, learning formats, locations, audience, entry information and intake calendar. Identify who approves content and owns counselling follow-up.",
      nodes: [
        { label: 'Form Captured', details: 'Candidate inputs details via Meta Ads or Website widget.' },
        { label: 'CRM Intake Node', details: 'GrowthOS™ filters age, score, and branch; alerts dedicated counselor.' },
        { label: 'Brochure Dispatch', details: 'System triggers automatic course syllabus delivery via WhatsApp.' },
        { label: 'Schedule Locked', details: 'Outbound voice dialer secures convenient time for counselor interview.' },
        { label: 'Counsel Completed', details: 'Advisor completes assessment, enters scholarship discount.' },
        { label: 'Fee Deposited', details: 'UPI link settles invoice; generates welcome registration ID.' }
      ]
    },
{
      title: "Make course information useful",
      desc: "Review the website, programme pages, enquiry routes and proof that can be substantiated. Resolve unclear eligibility, schedule, fee or recognition information before promotion.",
      nodes: [
        { label: 'Inquiry Fired', details: 'Student submits query at 11:30 PM (off-hours).' },
        { label: 'Instant Bot Reply', details: 'WhatsApp bot fires in 10s offering direct PDF course brochure.' },
        { label: 'VoIP AI Dialout', details: 'Outbound VoIP dials student next morning to verify course interest.' },
        { label: 'Roster Synced', details: 'Secures parent physical campus tour slot on doctor/registrar calendar.' },
        { label: 'Admissions Desk Alert', details: 'Reception panel alerted of pending guest arrival.' }
      ]
    },
{
      title: "Reach relevant learners",
      desc: "Combine suitable search content, social communication and campaigns around the agreed programme and audience. Choose channels because they fit the decision journey, not because every platform must be used.",
      nodes: [
        { label: 'Invoice Generated', details: 'Registrar uploads semester dues schedule.' },
        { label: 'AI Balance Verification', details: 'Checks academic score for merit-based rebate eligibility.' },
        { label: 'WhatsApp Broadcast', details: 'Dispatches personalized tax invoice PDF with safe payment gateways.' },
        { label: 'Payment Completed', details: 'Student completes transfer via UPI / debit card.' },
        { label: 'EHR Registry Cleared', details: 'Marked "Paid" in finance records; digital receipt issued.' }
      ]
    },
{
      title: "Connect enquiries to counselling",
      desc: "Give each enquiry an owner, programme context and next action. Test any acknowledgement, reminder and handover flow before it supports the admissions team.",
      nodes: [
        { label: 'Parent Inquiry', details: '"Does the school bus route cover sector 14, and what are the timings?"' },
        { label: 'Cognitive Context Scan', details: 'FAQ Agent searches school handbook bus roster spreadsheet.' },
        { label: 'Answer Drafted', details: 'Returns: "Yes! Bus #4 leaves at 07:15 AM from sector 14 main gate."' },
        { label: 'Admin Logged', details: 'Interaction captured for supervisor review if required.' }
      ]
    },
{
      title: "Review the quality of the journey",
      desc: "Compare sources, relevant enquiries and available counselling or application milestones. Use the team's feedback to improve information, targeting and follow-up over time.",
      nodes: [
        { label: 'Form Captured', details: 'Candidate inputs details via Meta Ads or Website widget.' },
        { label: 'CRM Intake Node', details: 'GrowthOS™ filters age, score, and branch; alerts dedicated counselor.' },
        { label: 'Brochure Dispatch', details: 'System triggers automatic course syllabus delivery via WhatsApp.' },
        { label: 'Schedule Locked', details: 'Outbound voice dialer secures convenient time for counselor interview.' },
        { label: 'Counsel Completed', details: 'Advisor completes assessment, enters scholarship discount.' },
        { label: 'Fee Deposited', details: 'UPI link settles invoice; generates welcome registration ID.' }
      ]
    }
];

  // ==========================================
  // ADMISSION ROI CALCULATOR
  // ==========================================
  const [monthlyEnquiries, setMonthlyEnquiries] = useState<number>(500);
  const [avgAdmissionValue, setAvgAdmissionValue] = useState<number>(65000); // INR
  const [currentConversionRate, setCurrentConversionRate] = useState<number>(4); // e.g., 4%
  const [calcMktBudget, setCalcMktBudget] = useState<number>(60000); // INR

  // Current admissions = enquiries * (currentConversion / 100)
  const currentAdmissionsCount = Math.round(monthlyEnquiries * (currentConversionRate / 100));
  const currentRevenue = currentAdmissionsCount * avgAdmissionValue;

  // With Natton Digital, conversion rate increases by 2.5x (e.g., from 4% to 10%) due to instant WhatsApp response, zero lead leakage, AI call-back dialers
  const optimizedConversionRate = Math.min(25, parseFloat((currentConversionRate * 2.5).toFixed(1)));
  const optimizedAdmissionsCount = Math.round(monthlyEnquiries * (optimizedConversionRate / 100));
  const optimizedRevenue = optimizedAdmissionsCount * avgAdmissionValue;

  const additionalAdmissions = optimizedAdmissionsCount - currentAdmissionsCount;
  const revenueIncrease = optimizedRevenue - currentRevenue;
  const roiPercentage = Math.round(((revenueIncrease - calcMktBudget) / calcMktBudget) * 100);

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // ==========================================
  // SUCCESS STORIES (Carousel)
  // ==========================================
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const caseStudies = [
{
      title: "Choose a programme",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      solution: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Building,
      stats: [{"label":"Programme-relevant visibility","before":"Baseline to agree","after":"Search and campaign activity connected with the courses and learners you intend to reach."},{"label":"Suitable enquiries","before":"Baseline to agree","after":"Enquiries that match the agreed programme, location and learning format."},{"label":"Counselling follow-through","before":"Baseline to agree","after":"Contact status, attended conversations and outstanding next actions where the team records them."},{"label":"Application milestones","before":"Baseline to agree","after":"Applications or enrolments reported from the institution's own reliable records, separately from lead counts."}]
    },
{
      title: "Send an enquiry",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      solution: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Award,
      stats: [{"label":"Programme-relevant visibility","before":"Baseline to agree","after":"Search and campaign activity connected with the courses and learners you intend to reach."},{"label":"Suitable enquiries","before":"Baseline to agree","after":"Enquiries that match the agreed programme, location and learning format."},{"label":"Counselling follow-through","before":"Baseline to agree","after":"Contact status, attended conversations and outstanding next actions where the team records them."},{"label":"Application milestones","before":"Baseline to agree","after":"Applications or enrolments reported from the institution's own reliable records, separately from lead counts."}]
    },
{
      title: "Counsellor receives context",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      solution: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Users,
      stats: [{"label":"Programme-relevant visibility","before":"Baseline to agree","after":"Search and campaign activity connected with the courses and learners you intend to reach."},{"label":"Suitable enquiries","before":"Baseline to agree","after":"Enquiries that match the agreed programme, location and learning format."},{"label":"Counselling follow-through","before":"Baseline to agree","after":"Contact status, attended conversations and outstanding next actions where the team records them."},{"label":"Application milestones","before":"Baseline to agree","after":"Applications or enrolments reported from the institution's own reliable records, separately from lead counts."}]
    },
{
      title: "Team agrees the next step",
      metric: "Illustrative workflow",
      duration: "Scope dependent",
      challenge: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      solution: "Example only. No live application, student record or automated admissions decision is used in this preview.",
      roi: "Illustrative workflow",
      icon: Zap,
      stats: [{"label":"Programme-relevant visibility","before":"Baseline to agree","after":"Search and campaign activity connected with the courses and learners you intend to reach."},{"label":"Suitable enquiries","before":"Baseline to agree","after":"Enquiries that match the agreed programme, location and learning format."},{"label":"Counselling follow-through","before":"Baseline to agree","after":"Contact status, attended conversations and outstanding next actions where the team records them."},{"label":"Application milestones","before":"Baseline to agree","after":"Applications or enrolments reported from the institution's own reliable records, separately from lead counts."}]
    }
];

  // ==========================================
  // COMPLETE EDUCATION TECHNOLOGY STACK
  // ==========================================
  const [selectedStackTab, setSelectedStackTab] = useState<string>('websites');
  const stackModules = [
    {
      id: 'websites',
      title: 'Next.js 15 Web Engines',
      details: 'High-fidelity, SSR (Server-Side Rendered) school portals with dynamic prospectus caching. Optimized for Google Core Web Vitals to guarantee a Lighthouse score of 100.',
      code: 'export async function getStaticProps() {\n  const prospectus = await cache.get("prospectus_pdf");\n  return { props: { prospectus }, revalidate: 60 };\n}'
    },
    {
      id: 'crm',
      title: 'GrowthOS™ CRM Schema',
      details: 'Durable, PostgreSQL relational tables with Prisma Client mappings, capturing admissions funnels, counseling assignments, and scholar flags.',
      code: 'model Candidate {\n  id          String   @id @default(uuid())\n  name        String\n  course      String\n  status      String   @default("ENQUIRY")\n  score       Float?\n}'
    },
    {
      id: 'whatsapp',
      title: 'Meta WhatsApp Webhooks',
      details: 'Secure endpoints verifying Meta API signatures, parsing parent selection parameters, and sending immediate brochures or fee logs.',
      code: 'app.post("/webhook/whatsapp", verifySignature, async (req, res) => {\n  const reply = parseSelection(req.body);\n  await sendWhatsAppMessage(reply);\n  res.sendStatus(200);\n});'
    },
    {
      id: 'ai_calling',
      title: 'Outbound Voice Nodes',
      details: 'Human-like conversational voice pipelines running over Twilio SIP gateways with advanced speech-to-text and intent parsing.',
      code: 'const callNode = await client.calls.create({\n  twiml: `<Response><Say voice="alice">Hello! Confirming your counseling tour.</Say></Response>`,\n  to: lead.phone\n});'
    },
    {
      id: 'automation',
      title: 'Admission Workflows n8n',
      details: 'Sovereign event loops coordinating complex wait intervals, SMS fallback routes, and Slack notification dispatches.',
      code: '{\n  "nodes": [\n    { "type": "n8n-nodes-base.webhook", "position": [100, 200] },\n    { "type": "n8n-nodes-base.slack", "position": [300, 200] }\n  ]\n}'
    },
    {
      id: 'analytics',
      title: 'Recharts Performance Engine',
      details: 'Interactive dashboards compiling Google Analytics, ad spend performance, and student funnel attrition metrics in real-time.',
      code: '<AreaChart data={funnelMetrics}>\n  <XAxis dataKey="stage" />\n  <Area type="monotone" dataKey="conversion" />\n</AreaChart>'
    },
    {
      id: 'ai_agents',
      title: 'Gemini-3.5 cognitive systems',
      details: 'Server-side sandboxed AI agents reading handbook documents to draft accurate answers regarding fee structures or uniform policies.',
      code: 'const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\nconst response = await ai.models.generateContent({\n  model: "gemini-3.5-flash",\n  contents: [{ role: "user", parts: [{ text: prompt }] }]\n});'
    }
  ];

  // ==========================================
  // COMPARISON MATRIX TABLE
  // ==========================================
  const comparisonRows = [
{ cap: "A learner, programme and admissions-cycle plan", natton: "A learner, programme and admissions-cycle plan", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Accurate course pages and useful learner information", natton: "Accurate course pages and useful learner information", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Selected campaign assets and enquiry routes", natton: "Selected campaign assets and enquiry routes", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "Counsellor ownership and agreed follow-up stages", natton: "Counsellor ownership and agreed follow-up stages", trad: "Assessed against your current process", generic: "Assessed against your current process" },
{ cap: "A programme-level measurement and review plan", natton: "A programme-level measurement and review plan", trad: "Assessed against your current process", generic: "Assessed against your current process" }
];

  // ==========================================
  // FAQ ACCORDION (15 custom questions)
  // ==========================================
  const faqsList = [
{ q: "Do you work with schools, colleges, coaching businesses and EdTech?", a: "The approach can be adapted to each, but they should not use an identical campaign. Parents, school leavers, working professionals and institutional buyers have different questions and decision journeys. We first review the offering, learner audience, delivery format, geography and admissions process." },
{ q: "Can you help us market a particular course or intake?", a: "Yes. A focused programme or intake can be a sensible starting point. We review its information, available capacity, audience and counselling process, then agree suitable content and channels. Programme availability, deadlines and claims must remain accurate as the campaign runs." },
{ q: "When should an institution start marketing an intake?", a: "Planning should begin early enough to prepare clear information, approvals, tracking and enquiry handling before promotion is needed. The right lead time varies with the programme and learner's decision cycle. We work backwards from the admissions calendar instead of promising one fixed campaign period for every institution." },
{ q: "Will AI counsel students or make admissions decisions?", a: "An assistant may answer approved administrative questions or collect programme interest when included in the scope. Staff remain responsible for individual guidance, eligibility checks and admissions decisions. Conversations involving children or sensitive information require an appropriately designed process and suitable human oversight." },
{ q: "How do you handle placement, selection and recognition claims?", a: "We use evidence supplied and verified by the institution, with the necessary approvals and context. We do not invent selection rates, guaranteed placements or success stories. Where recognition is relevant, the specific programme and current academic session should be checked rather than relying on a general claim." },
{ q: "Can you use our existing website, CRM or admissions software?", a: "Yes, we assess what already works and which connections are practical. The proposal sets out content, campaigns, follow-up responsibilities and any integration work. We also agree how performance will be reviewed, using available counselling and application records instead of assuming every enquiry becomes an enrolment." }
];
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // ==========================================
  // HIGH CONVERTING LEAD FORM & INTEGRATION LOGS
  // ==========================================
  const [formState, setFormState] = useState({
    fullName: '',
    instName: '',
    instType: 'Schools',
    location: '',
    email: '',
    phone: '',
    studentStrength: '100 - 500',
    challenges: '',
    message: ''
  });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captcha1, setCaptcha1] = useState(0);
  const [captcha2, setCaptcha2] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [integrationLogs, setIntegrationLogs] = useState<string[]>([]);

  useEffect(() => {
    setCaptcha1(Math.floor(Math.random() * 8) + 2);
    setCaptcha2(Math.floor(Math.random() * 8) + 2);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== (captcha1 + captcha2)) {
      alert('Mathematical Verification is incorrect. Please calculate again.');
      return;
    }

    setFormSubmitting(true);
    setIntegrationLogs([
      'Intercepting educational contact lead payload...',
      'Mapping attributes to GoHighLevel (GHL) API schema...',
      'Firing secure n8n integration webhook node...',
      'Triggering administrative Slack notify channel...'
    ]);

    setTimeout(() => {
      setIntegrationLogs(prev => [
        ...prev,
        'Sync successful. Created Contact ID: GHL_EDU_4921',
        'Fired welcoming confirmation sequence via Email/WhatsApp API.'
      ]);
      setTimeout(() => {
        setFormSubmitting(false);
        setFormSuccess(true);
      }, 1000);
    }, 1800);
  };

  return (
    <div className={`min-h-screen py-8 overflow-hidden relative selection:bg-purple-500 selection:text-white transition-colors duration-500 ${darkMode ? 'bg-[#030616] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Background Neon Lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[550px] h-[550px] bg-purple-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-5 right-10 w-[700px] h-[700px] bg-cyan-950/15 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-xs font-mono text-gray-500 flex items-center gap-1.5 border-b border-white/5 pb-4">
          <button onClick={() => setPath('home')} className="hover:text-purple-400 transition-colors">Home</button> 
          <span>/</span> 
          <a className="text-gray-400" href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');}}>Industries</a> 
          <span>/</span> 
          <span className="text-purple-400 font-semibold">Education</span>
        </div>

        {/* ==========================================
            HERO SECTION (Animated Digital Campus Mesh)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 relative min-h-[520px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden -z-20 border border-white/5 bg-slate-950/40">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-75" />
          </div>

          <div className="archive-hero-copy lg:col-span-7 space-y-6 z-10 p-6 sm:p-10">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Education marketing"} <br />
<span className="bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent animate-pulse">{"for more informed decisions."}</span>
            </h1>

            <p className="text-sm leading-relaxed text-gray-400 max-w-2xl">{archivePage.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#lead_form" 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:opacity-90 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="#ecosystem" 
                className="px-6 py-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-purple-400 transition-all flex items-center gap-2 text-sm font-semibold"
              >
                Explore Education Solutions
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-blue-400">{"Useful information"}</span>
              <span className="flex items-center gap-1.5 text-purple-400">{"A clearer customer journey"}</span>
              <span className="flex items-center gap-1.5 text-cyan-400">{"People before platforms"}</span>
            </div>
          </div>

          {/* Smart Campus Ecosystem visualizer */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            INSTITUTION TYPES (Solutions Built For)
           ========================================== */}
        <div id="ecosystem" className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Tailored Care Models</span>
            <h2 className="text-3xl font-bold font-display">{"Who this can help"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{Array.isArray(archivePage.audience)?archivePage.audience.join(" · "):archivePage.audience}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
{ label: "Schools and higher-education institutions", icon: Building, desc: "Help students, parents and working learners understand your offering. Bring programme information, relevant campaigns and counselling follow-up into a clear journey from first enquiry to the appropriate admissions team." },
{ label: "Coaching and training organisations", icon: GraduationCap, desc: "Help students, parents and working learners understand your offering. Bring programme information, relevant campaigns and counselling follow-up into a clear journey from first enquiry to the appropriate admissions team." },
{ label: "Professional and vocational learning providers", icon: BookOpen, desc: "Help students, parents and working learners understand your offering. Bring programme information, relevant campaigns and counselling follow-up into a clear journey from first enquiry to the appropriate admissions team." },
{ label: "EdTech platforms and online learning businesses", icon: Award, desc: "Help students, parents and working learners understand your offering. Bring programme information, relevant campaigns and counselling follow-up into a clear journey from first enquiry to the appropriate admissions team." }
].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#070b21]/50 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 group text-left">
                  <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 w-fit mb-4 group-hover:bg-purple-500/10 transition-colors">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xs font-bold font-display text-white mb-1">{card.label}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            PAIN POINTS (Education Challenges We Solve)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest font-bold">Structural Bottlenecks</span>
            <h2 className="text-3xl font-bold font-display">{"Recognise the gaps. Choose the right priority."}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"We begin with the business problem, then agree the work that will help address it."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
{ label: "Interest is not reaching the right programme", pain: "Generic pages and campaigns can attract enquiries that do not match the course, location, learning format or intake.", fix: "Generic pages and campaigns can attract enquiries that do not match the course, location, learning format or intake." },
{ label: "Important information is difficult to find", pain: "Learners need clear course details, eligibility information, schedules, fees and a route to ask questions.", fix: "Learners need clear course details, eligibility information, schedules, fees and a route to ask questions." },
{ label: "Counselling follow-up is scattered", pain: "Calls, forms and messages need ownership, context and a recorded next action as prospective learners consider their options.", fix: "Calls, forms and messages need ownership, context and a recorded next action as prospective learners consider their options." },
{ label: "Teams see enquiries but not the journey", pain: "Connecting source, counselling and application status helps teams identify where useful conversations stop moving.", fix: "Connecting source, counselling and application status helps teams identify where useful conversations stop moving." }
].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#030717] hover:bg-slate-900/40 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between text-left">
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
                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-purple-400 leading-relaxed">
                  <span className="font-semibold font-mono text-purple-300">Solution:</span> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            ADMISSION BLUEPRINT (Interactive Funnel)
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Candidate Journey</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Visual Funnel Stack */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
              {funnelSteps.map((step, idx) => {
                const isActive = activeFunnelStep === idx;
                // Calculate responsive width percentage based on funnel narrowing
                const widthPercent = 100 - (idx * 6);
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveFunnelStep(idx)}
                    className={`p-3 rounded-lg border text-left transition-all relative block overflow-hidden ${
                      isActive 
                        ? 'border-purple-400 bg-purple-500/15 font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                        : 'border-white/5 bg-[#05081c]/60 text-gray-400 hover:border-purple-500/25 hover:text-white'
                    }`}
                    style={{ width: `${widthPercent}%`, margin: '0 auto' }}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span>Step {idx + 1}</span>
                      <span className="text-purple-300">{step.rate}</span>
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">{step.name}</div>
                    {isActive && (
                      <div className="absolute top-0 right-0 h-full w-1 bg-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Detail Panel */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/80 p-8 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                    {funnelSteps[activeFunnelStep].stage}
                  </span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded font-bold font-mono">
                    STAGE ACTIVE
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white">
                  {funnelSteps[activeFunnelStep].name}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {funnelSteps[activeFunnelStep].desc}
                </p>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold">Key Performance Indicator (KPI):</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white font-mono">{funnelSteps[activeFunnelStep].rate}</span>
                    <span className="text-[10px] text-gray-500 font-mono">Attribution Reliability SLA</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                <button 
                  onClick={() => setActiveFunnelStep(prev => (prev > 0 ? prev - 1 : funnelSteps.length - 1))}
                  className="text-xs font-mono text-gray-500 hover:text-purple-400 transition-colors"
                >
                  ← PREV STAGE
                </button>
                <div className="flex gap-1">
                  {funnelSteps.map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeFunnelStep ? 'bg-purple-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setActiveFunnelStep(prev => (prev < funnelSteps.length - 1 ? prev + 1 : 0))}
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors font-bold"
                >
                  NEXT STAGE →
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            AI GROWTH MARKETING (Interactive Dashboard)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Growth Dashboards</span>
            <h2 className="text-3xl font-bold font-display">Admission Growth Marketing</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[2].description}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#04081e]/90 text-left shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
              <div className="flex gap-2">
                {(['seo', 'ads', 'local'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMktTab(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
                      activeMktTab === tab 
                        ? 'bg-purple-500/10 border border-purple-400/40 text-purple-300 font-bold' 
                        : 'text-gray-500 hover:text-white border border-transparent'
                    }`}
                  >
                    {tab.toUpperCase()} CHANNELS
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE TELEMETRY FEED
              </div>
            </div>

            {/* Quick Metrics Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {mktDashboard[activeMktTab === 'local' ? 'social' : activeMktTab].stats.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 block mb-1">{metric.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-white font-mono">{metric.value}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* List Table */}
            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase">
                    <th className="py-2.5 px-3">Target Objective</th>
                    <th className="py-2.5 px-3">Rank / Budget</th>
                    <th className="py-2.5 px-3">Search Vol / Leads</th>
                    <th className="py-2.5 px-3">Conversion / CPL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mktDashboard[activeMktTab === 'local' ? 'social' : activeMktTab].list.map((row, i) => (
                    <tr key={i} className="text-xs hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{row.item}</td>
                      <td className="py-3 px-3 font-mono text-purple-400">{row.ranking}</td>
                      <td className="py-3 px-3 font-mono text-gray-400">{row.volume}</td>
                      <td className="py-3 px-3 font-mono text-cyan-400">{row.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* ==========================================
            GROWTHOS™ ADMISSIONS CRM PREVIEW
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Centralized Registry</span>
            <h2 className="text-3xl font-bold font-display">GrowthOS™ For Admissions</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[0].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            
            {/* Student selection lists */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-1">Live Applications Registry</span>
              {studentsList.map((std) => {
                const isSelected = selectedStudentId === std.id;
                return (
                  <button
                    key={std.id}
                    onClick={() => setSelectedStudentId(std.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.15)]' 
                        : 'border-white/5 bg-[#05081b]/60 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-white">{std.name}</h4>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${std.color}`}>
                        {std.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-500">
                      <span>Course: <span className="text-gray-300">{std.course}</span></span>
                      <span className="text-right">Source: <span className="text-purple-400">{std.source}</span></span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Registry view */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/80 p-6 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                      Selected Candidate profile
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    ID: {selectedStudentId.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                      <span className="text-[9px] font-mono text-gray-500 block">Full Name</span>
                      <span className="text-xs font-bold text-white">{studentsList.find(s => s.id === selectedStudentId)?.name}</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                      <span className="text-[9px] font-mono text-gray-500 block">Age Parameter</span>
                      <span className="text-xs font-bold text-white">{studentsList.find(s => s.id === selectedStudentId)?.age} Years</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                      <span className="text-[9px] font-mono text-gray-500 block">Lead Source</span>
                      <span className="text-xs font-bold text-purple-400">{studentsList.find(s => s.id === selectedStudentId)?.source}</span>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                      <span className="text-[9px] font-mono text-gray-500 block">Course Selected</span>
                      <span className="text-xs font-bold text-cyan-400 truncate block">{studentsList.find(s => s.id === selectedStudentId)?.course}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] font-mono text-purple-300 block mb-1 uppercase font-bold">Counselor Admin Notes:</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {studentDetails[selectedStudentId]?.notes}
                    </p>
                  </div>

                  {/* Timelines */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase pl-1">Chronological System Events Timeline</span>
                    <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                      {studentDetails[selectedStudentId]?.timeline.map((evt, idx) => (
                        <div key={idx} className="flex gap-4 items-start relative pl-6">
                          <span className="absolute left-[5px] top-[6px] h-1.5 w-1.5 rounded-full bg-purple-400" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{evt.event}</span>
                              <span className="text-[9px] font-mono text-gray-500">{evt.time}</span>
                            </div>
                            <span className="text-[8px] font-mono text-purple-400 bg-purple-500/5 border border-purple-500/10 px-1.5 py-0.5 rounded">
                              {evt.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-2 text-[10px] font-mono text-gray-500">
                <span>Last updated sync: Today, {studentsList.find(s => s.id === selectedStudentId)?.date.split(',')[1]}</span>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            BUSINESSOS™ SIMULATED INTERACTIVE WHATSAPP
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Omnichannel Desk</span>
            <h2 className="text-3xl font-bold font-display">BusinessOS™ Communication Platform</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.services[4].description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Features panel left */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-2xl font-bold font-display text-white">Unified Communication Hub</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Empower your front desk team and prospective parents with synchronized multi-channel threads. No more manual copy-pasting between SMS registries and WhatsApp boxes.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">WA</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Verified Meta WhatsApp Channels</h4>
                    <p className="text-[10px] text-gray-500">Secure broadcasts of fees, syllabi, exam coordinates, and maps locations with 98% open ratios.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] font-bold">VO</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">High-Cadence Inbound AI Calling</h4>
                    <p className="text-[10px] text-gray-500">Friendly verbal voice loops dialing candidate requests back under 45 seconds to lock schedules.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">SMS</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Fallback SMS Redundancy</h4>
                    <p className="text-[10px] text-gray-500">Instantly triggers traditional cellular text sequences if candidate phone is offline from mobile data.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Phone mockup */}
            <div className="lg:col-span-7 p-1">
              <div className="w-full max-w-[420px] mx-auto rounded-3xl border-[6px] border-slate-900 bg-black overflow-hidden shadow-2xl flex flex-col justify-between min-h-[480px]">
                
                {/* Whatsapp Header */}
                <div className="bg-[#0b141a] px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">🎓</div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        Academic Advisor <Check className="h-3 w-3 text-emerald-400 bg-emerald-500/10 rounded-full" />
                      </h4>
                      <span className="text-[8px] text-emerald-400 font-mono">online - typing...</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">VERIFIED BOT</span>
                </div>

                {/* Messages screen */}
                <div className="flex-1 bg-[#0b0c10] p-4 space-y-3 overflow-y-auto max-h-[280px]">
                  {waMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`max-w-[85%] rounded-lg p-2.5 text-[11px] leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user' 
                          ? 'ml-auto bg-[#005c4b] text-white' 
                          : 'bg-[#202c33] text-gray-300'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-[8px] text-gray-500 text-right mt-1">{msg.time}</span>
                    </div>
                  ))}
                  {isWaTyping && (
                    <div className="bg-[#202c33] text-gray-400 max-w-[40%] rounded-lg p-2 text-[10px] animate-pulse">
                      typing response...
                    </div>
                  )}
                </div>

                {/* Simulated Clickable Inputs */}
                <div className="p-2 border-t border-white/5 bg-[#111b21] flex flex-wrap gap-1.5 justify-center">
                  <button 
                    onClick={() => { setNewWaMsg('1'); }}
                    className="text-[9px] font-mono bg-white/5 border border-white/10 hover:border-purple-400 px-2 py-1 rounded text-gray-300"
                  >
                    1 (CSE Course Syllabus PDF)
                  </button>
                  <button 
                    onClick={() => { setNewWaMsg('2'); }}
                    className="text-[9px] font-mono bg-white/5 border border-white/10 hover:border-purple-400 px-2 py-1 rounded text-gray-300"
                  >
                    2 (Calculate Fees & Scholar)
                  </button>
                  <button 
                    onClick={() => { setNewWaMsg('3'); }}
                    className="text-[9px] font-mono bg-white/5 border border-white/10 hover:border-purple-400 px-2 py-1 rounded text-gray-300"
                  >
                    3 (Book Counselling Session)
                  </button>
                </div>

                {/* Input form */}
                <form onSubmit={handleWaSubmit} className="p-3 bg-[#111b21] border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    value={newWaMsg}
                    onChange={(e) => setNewWaMsg(e.target.value)}
                    placeholder="Type '1', '2', or '3'..."
                    className="flex-1 bg-[#202c33] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <button 
                    type="submit" 
                    className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors text-white"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            AGENTICOS™ FOR EDUCATION (MULTI-AGENTS)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Cognitive Swarms</span>
            <h2 className="text-3xl font-bold font-display">AgenticOS™ For Education</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            
            {/* Agent selection grids */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {educationAgents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = activeAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgentId(agent.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected 
                        ? 'border-purple-400 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                        : 'border-white/5 bg-[#04081c]/60 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 w-fit border border-white/10 mb-3">
                      <Icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{agent.name}</h4>
                      <span className="text-[8px] font-mono text-purple-300 mt-1 block">Active Pipeline</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Cognitive Logs */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                    Cognitive System Prompts
                  </span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">
                    SYSTEM SECURE
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {educationAgents.find(a => a.id === activeAgentId)?.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">
                      {educationAgents.find(a => a.id === activeAgentId)?.role}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-[10px] text-cyan-300 leading-relaxed overflow-x-auto relative">
                    <span className="absolute top-2 right-2 text-[8px] text-gray-500 uppercase">SYS_PROMPT</span>
                    {educationAgents.find(a => a.id === activeAgentId)?.prompt}
                  </div>

                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-purple-300 uppercase font-bold">Performance Metric:</span>
                      <span className="text-xs font-bold text-white font-mono">
                        {educationAgents.find(a => a.id === activeAgentId)?.metrics}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex justify-end gap-2 text-[9px] font-mono text-gray-500">
                <span>AES-256 local encrypted sandbox</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            ADMISSION AUTOMATION WORKFLOWS (React Flow)
           ========================================== */}
        <div className="mb-24 space-y-10 industry-process-section">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Automation Loops</span>
            <h2 className="text-3xl font-bold font-display">{"How we work"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.timing}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#04081c]/90 text-left relative overflow-hidden">
            
            {/* Presets controller */}
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
              {workflowsList.map((wf, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflowIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all ${
                    activeWorkflowIdx === idx 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold' 
                      : 'text-gray-500 hover:text-white border border-transparent'
                  }`}
                >
                  Preset {idx + 1}: {wf.title.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-base font-bold text-white font-display">
                {workflowsList[activeWorkflowIdx].title}
              </h3>
              <p className="text-xs text-gray-400">
                {workflowsList[activeWorkflowIdx].desc}
              </p>
            </div>

            {/* Custom Horizontal Timeline Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative pt-4">
              <div className="hidden md:block absolute top-[35%] left-[5%] right-[5%] h-0.5 border-t border-dashed border-purple-500/20 -z-10" />
              
              {workflowsList[activeWorkflowIdx].nodes.map((node, i) => (
                <div key={i} className="p-3 bg-black/60 border border-white/5 rounded-xl text-left hover:border-purple-400/40 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-mono text-purple-400 uppercase font-bold">NODE #0{i+1}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <h4 className="text-[11px] font-bold text-white mb-1 leading-tight">{node.label}</h4>
                  <p className="text-[9px] text-gray-500 leading-relaxed">{node.details}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ==========================================
            USE CASES (Popular Education Use Cases)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Standard Features</span>
            <h2 className="text-3xl font-bold font-display">{"What we can help you connect"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {[
{ title: "Education website & course pages", icon: Mail, desc: "Present programme details, entry requirements, delivery format, fees, schedules and useful FAQs. Build clear enquiry or application routes around the institution's process." },
{ title: "Education SEO & campus discovery", icon: Award, desc: "Research programme, career-learning and location intent. Improve course content and eligible campus profiles while keeping online-only and physical-location visibility needs distinct." },
{ title: "Intake and programme campaigns", icon: Users, desc: "Plan suitable advertising around the audience, intake window and course offering. Align ads with accurate landing-page information and the counselling team's ability to respond." },
{ title: "Content that answers real questions", icon: DollarSign, desc: "Create course explainers, faculty introductions, learning-format previews and approved learner stories. Qualifications, recognition and outcome claims are checked with the institution before use." },
{ title: "Admissions CRM & counselling follow-up", icon: BookOpen, desc: "Organise enquiry source, programme interest, assigned counsellor and next action. Add agreed acknowledgements and reminders, with staff responsible for admissions advice and decisions." },
{ title: "Enquiry-to-application visibility", icon: Bell, desc: "Review programme interest, suitable enquiries, attended counselling and application milestones where the data is available. Separate campaign activity from verified enrolment outcomes." }
].map((uc, i) => {
              const Icon = uc.icon;
              return (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#030616] hover:bg-slate-900/40 hover:border-purple-500/20 transition-all duration-300">
                  <div className="p-2 bg-purple-500/5 rounded-xl border border-purple-500/20 w-fit mb-3">
                    <Icon className="h-4.5 w-4.5 text-purple-400" />
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">{uc.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{uc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            ADMISSION ROI CALCULATOR
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Financial Modeling</span>
            <h2 className="text-3xl font-bold font-display">Admission ROI Calculator</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{"Illustrative scenario. Results depend on your inputs and the agreed scope; they are not observed or guaranteed outcomes."}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            
            {/* Input fields */}
            <div className="lg:col-span-6 rounded-2xl border border-white/15 bg-slate-950/40 p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider border-b border-white/5 pb-2">
                Operational Parameters
              </h3>

              <div className="space-y-4">
                {/* 1. Monthly Enquiries */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Monthly Inquiries Received:</span>
                    <span className="text-purple-300 font-bold">{monthlyEnquiries}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={monthlyEnquiries}
                    onChange={(e) => setMonthlyEnquiries(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[9px] text-gray-600 block">Total monthly web forms, map leads, and voice calls received.</span>
                </div>

                {/* 2. Average Admission Value */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Average Admission Value (INR):</span>
                    <span className="text-purple-300 font-bold">₹{avgAdmissionValue.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="200000"
                    step="5000"
                    value={avgAdmissionValue}
                    onChange={(e) => setAvgAdmissionValue(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[9px] text-gray-600 block">Average annual tuition fee collected per enrolled candidate.</span>
                </div>

                {/* 3. Conversion rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Current Conversion Rate (%):</span>
                    <span className="text-purple-300 font-bold">{currentConversionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={currentConversionRate}
                    onChange={(e) => setCurrentConversionRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[9px] text-gray-600 block">Current enrollment conversion rate from lead to tuition deposit.</span>
                </div>

                {/* 4. Marketing budget */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Marketing & Tech Budget (INR):</span>
                    <span className="text-purple-300 font-bold">₹{calcMktBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="150000"
                    step="5000"
                    value={calcMktBudget}
                    onChange={(e) => setCalcMktBudget(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[9px] text-gray-600 block">Monthly allocation budget for local ads and software subscriptions.</span>
                </div>
              </div>
            </div>

            {/* Outputs view */}
            <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wider border-b border-white/5 pb-2">
                  Projected Financial Lift
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-left">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1">Additional admissions</span>
                    <span className="text-2xl font-bold text-white font-mono">+{additionalAdmissions}</span>
                    <span className="text-[9px] text-gray-600 block mt-1">enrolled candidates / mo</span>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-left">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1">Revenue increase</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">+{formatCurrency(revenueIncrease)}</span>
                    <span className="text-[9px] text-gray-600 block mt-1">additional tuition / mo</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 text-left space-y-1">
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">Optimized Conversion Rate:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{optimizedConversionRate}%</span>
                    <span className="text-xs text-gray-500 font-mono">({(optimizedConversionRate / currentConversionRate).toFixed(1)}x conversion lift)</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed pt-2">
                    Natton Digital intercepts lead leakage instantly via 15-second WhatsApp prospectus bots and automated outbound call queues, raising standard conversion from {currentConversionRate}% to {optimizedConversionRate}%.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-gray-500">Projected Marketing ROI</span>
                <span className="text-3xl font-black text-purple-400 font-mono">{roiPercentage}% ROI</span>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            SUCCESS STORIES (Carousel Layout)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Case Studies</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.example.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.example.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            
            {/* Carousel navigation sidebar */}
            <div className="lg:col-span-5 space-y-3">
              {caseStudies.map((cs, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCaseIdx(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    activeCaseIdx === idx 
                      ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                      : 'border-white/5 bg-[#04081c]/60 hover:border-purple-500/15'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-white leading-tight">{cs.title}</h4>
                    <span className="text-[8px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded uppercase font-bold">
                      {cs.metric.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{cs.duration}</span>
                </button>
              ))}
            </div>

            {/* Selected case view */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                    Verify Case Study Audit
                  </span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded font-mono font-bold uppercase">
                    {caseStudies[activeCaseIdx].metric}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {caseStudies[activeCaseIdx].title}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500 block mt-1">{caseStudies[activeCaseIdx].duration}</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Operational challenge:</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {caseStudies[activeCaseIdx].challenge}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">Automation solution implemented:</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {caseStudies[activeCaseIdx].solution}
                    </p>
                  </div>
                </div>

                {/* Micro metrics comparative list */}
                <div className="grid grid-cols-3 gap-3">
                  {caseStudies[activeCaseIdx].stats.map((st, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-center">
                      <span className="text-[8px] font-mono text-gray-500 block uppercase truncate mb-1">{st.label}</span>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-[10px] text-rose-400 line-through font-mono">{st.before}</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">→ {st.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-purple-300 font-mono">
                🚀 <span className="font-bold">Measurable ROI Outcome:</span> {caseStudies[activeCaseIdx].roi}
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            COMPLETE EDUCATION TECHNOLOGY STACK
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Technology Stack</span>
            <h2 className="text-3xl font-bold font-display">Complete Education Technology Stack</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.scopeNote}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#04081c]/90 text-left">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Selector left */}
              <div className="md:col-span-4 space-y-2 flex flex-col justify-center border-r border-white/5 pr-4">
                {stackModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedStackTab(mod.id)}
                    className={`p-3 rounded-lg text-left text-xs font-mono transition-all uppercase tracking-wider ${
                      selectedStackTab === mod.id 
                        ? 'bg-purple-500/10 border border-purple-400/40 text-purple-300 font-bold' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {mod.title.split(' ')[0]} MODULE
                  </button>
                ))}
              </div>

              {/* Console logs view right */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-400" />
                    {stackModules.find(m => m.id === selectedStackTab)?.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mt-2">
                    {stackModules.find(m => m.id === selectedStackTab)?.details}
                  </p>
                </div>

                <div className="p-4 bg-black rounded-xl border border-white/5 font-mono text-[10px] text-cyan-300 leading-relaxed overflow-x-auto relative">
                  <span className="absolute top-2 right-2 text-[8px] text-gray-500 uppercase">TYPESCRIPT_CODE</span>
                  <pre>{stackModules.find(m => m.id === selectedStackTab)?.code}</pre>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ==========================================
            COMPARISON MATRIX TABLE
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Comparative Audit</span>
            <h2 className="text-3xl font-bold font-display">{archivePage.definition.title}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">{archivePage.definition.body}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#04081c]/90 text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-purple-300 uppercase">
                  <th className="p-4 bg-white/5">Target Capability</th>
                  <th className="p-4 bg-purple-500/10 text-white font-bold">Natton Digital</th>
                  <th className="p-4 text-gray-400">Traditional Agencies</th>
                  <th className="p-4 text-gray-400">Generic CRM Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="text-xs hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-semibold text-white bg-white/[0.01]">{row.cap}</td>
                    <td className="p-4 text-cyan-300 font-medium bg-purple-500/5">{row.natton}</td>
                    <td className="p-4 text-gray-500">{row.trad}</td>
                    <td className="p-4 text-gray-500">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            ACCORDION FAQS (15 Custom Questions)
           ========================================== */}
        <div className="mb-24 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Knowledge Base</span>
            <h2 className="text-3xl font-bold font-display">{"Frequently Asked Questions"}</h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Find instant, detailed responses to common queries regarding security, ERP syncs, languages, and setup cycles:
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 text-left">
            {faqsList.map((faq, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-white/5 bg-[#04081c]/60 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex justify-between items-center text-xs font-bold font-display text-white hover:text-purple-400 transition-colors text-left gap-4"
                  >
                    <span>{idx + 1}. {faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-white/5 text-[11px] text-gray-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            HIGH-CONVERTING LEAD FORM
           ========================================== */}
        <div id="lead_form" className="mb-24 max-w-4xl mx-auto text-left relative">
          <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

            <div className="space-y-4 mb-8">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">Secure Intake Node</span>
              <h2 className="text-3xl font-extrabold font-display text-white">Book A Free Education Growth Consultation</h2>
              <p className="text-xs text-gray-400 max-w-2xl">
                Our operations engineers will audit your current student intake funnel, analyze conversion benchmarks, and construct a bespoke automation blueprint for your school or college.
              </p>
            </div>

            {formSuccess ? (
              <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-400/30 text-center space-y-4">
                <span className="text-4xl">🎉</span>
                <h3 className="text-lg font-bold text-white font-display">Inquiry Registered Successfully!</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your payload was successfully parsed. Fired GHL API Contact Node ID: #GHL_EDU_4921. An outbound operations manager will reach out via WhatsApp/Email within 2 hours.
                </p>
                <div className="p-4 bg-black/60 rounded-xl max-w-lg mx-auto text-left font-mono text-[9px] text-cyan-300 divide-y divide-white/5">
                  <div className="pb-1.5 font-bold uppercase text-purple-400">Real-Time Sync Logs:</div>
                  {integrationLogs.map((log, idx) => (
                    <div key={idx} className="py-1">✔ {log}</div>
                  ))}
                </div>
                <button 
                  onClick={() => { setFormSuccess(false); setFormState({ fullName: '', instName: '', instType: 'Schools', location: '', email: '', phone: '', studentStrength: '100 - 500', challenges: '', message: '' }); }}
                  className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 text-white"
                >
                  SUBMIT NEW FORM
                </button>
              </div>
            ) : (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            )}

          </div>
        </div>

        {/* ==========================================
            FINAL CTA (Transform Admissions With AI)
           ========================================== */}
        

      </div>

    </div>
  );
}
