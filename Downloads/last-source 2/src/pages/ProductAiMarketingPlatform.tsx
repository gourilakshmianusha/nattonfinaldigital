import archivePage from '../content/ten-pages/ai-marketing-platform.json';
import {ArchiveHeroBackground,ArchiveContentGroup} from '../components/ArchivePageMedia';
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
  Clock
} from 'lucide-react';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

export default function ProductAiMarketingPlatform({ setPath, darkMode: propDarkMode }: any) {
  useEffect(() => {
    document.title = archivePage.metaTitle;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Use dark theme by default as requested in "theme": "Dark with blue and purple gradients"
  const darkMode = propDarkMode;

  // ==========================================
  // 1. DEMO FORM STATE
  // ==========================================
  const [demoForm, setDemoForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'India',
    currentTools: 'None / Spreadsheets',
    monthlyLeads: '50 - 200',
    message: ''
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      alert("Incorrect verification sum. Please try again.");
      generateCaptcha();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please solve the CAPTCHA code first.");
      return;
    }
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1500);
  };

  // ==========================================
  // 2. AI CONTENT STUDIO: LIVE TYPING SIMULATION
  // ==========================================
  const [contentType, setContentType] = useState<'blog' | 'landing' | 'ad' | 'email' | 'description' | 'social'>('blog');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typingKeywords, setTypingKeywords] = useState('organic skincare, ayurveda, cold-pressed oils');

  const contentTemplates = {
    blog: {
      prompt: "Write a high-ranking SEO blog post outline about Ayurveda Skincare",
      output: `### 10 Ayurvedic Rituals For Glass Skin (Backed By Modern Science)

**Target Keywords:** ayurveda skincare (92), organic cold pressed oils (88), ancient healing herbs (79)
**Suggested Meta Description:** Uncover the transformative secrets of traditional Ayurvedic botanical extracts combined with modern dermatology for natural, radiant hydration.

#### Introduction
The global skincare paradigm is undergoing a massive shift. Consumers are trading petrochemical fillers for active, bio-available phytonutrients. Here is how ancient Ayurvedic wisdom meets 2026 clinical validation.

#### Section 1: The Bio-Physics of Doshas
*   **Vata Skincare:** Intensely restorative oil infusions (such as saffron-infused kumkumadi oil) to heal extreme moisture-barrier depletion.
*   **Pitta Skincare:** Cool botanical concentrates (vetiver, pure sandalwood, aloe leaf pulp) to neutralize dermal inflammation.
*   **Kapha Skincare:** Clarifying warming elements (neem, turmeric rhizome, lightweight moringa seed base).`
    },
    landing: {
      prompt: "Generate a conversion-optimized hero headline + copy for an Ayurvedic Spa",
      output: `# Reclaim Cellular Harmony: Ancient Botanical Therapies For Modern Stress

## Elevate your physical vitality with India's most advanced wellness experience.
*Our bespoke therapeutic programs consolidate customized herbal formulations, high-velocity detox massage, and private sensory deprivation tanks.*

[Schedule Your Personal Prakriti Evaluation Today - Save 25% on First Visit]`
    },
    ad: {
      prompt: "Generate Meta & Google Ad Creative Copy for Summer Glow Serum",
      output: `📢 **Facebook/Instagram Ad Copy (High Conversion Hook):**
Tired of synthetic acids that leave your moisture barrier stripped and burning? 🌿 
Meet the ancient secret that works *with* your cells, not against them. Our Kumkumadi Summer Serum delivers radiant 24-hour hydration using only 16 cold-pressed botanicals. 
✨ NO mineral oils. NO parabens. NO fillers. Just pure botanical light.
👉 Tap 'Shop Now' for free shipping + free sample bottle today.

⚡ **Google Search Ad Headlines (Dynamic CTR Boosters):**
1. 100% Organic Glow Serum | Ayurveda Meets Clean Science
2. Heals Skin Moisture Barriers | Radiance Guaranteed in 14 Days
3. Buy Cold-Pressed Face Oil | Direct From Organic Farms`
    },
    email: {
      prompt: "Generate a 3-part email nurture sequence for cold subscribers",
      output: `Subject: Why standard face washes are thinning your skin... (Read carefully)

Hey {{First_Name}},

Most skincare lines are built to strip. They use heavy surfactants to create a satisfying lather—but that lather is actively eroding your lipid barrier, leaving you vulnerable to accelerated aging.

In ancient Ayurveda, skincare isn't about scrubbing. It's about feeding.

Tomorrow, I'll show you the exact 3 botanicals dermatologists are using to rebuild natural lipid layers in under 7 days. Keep your eyes on your inbox.

Warmly,
The Natton Glow Team`
    },
    description: {
      prompt: "Generate an Amazon-optimized product description for Cold-Pressed Moringa Oil",
      output: `🛒 **Natton Premium Moringa seed Oil - 100ml (Ayurvedic Cold-Pressed)**

*   **100% SINGLE-INGREDIENT PURITY:** Cold-pressed in small batches in Kerala, India. Free from hexanes, parabens, synthetic fragrances, and preservatives.
*   **NATURAL RETINOL ALTERNATIVE:** Rich in Vitamin A and Zeatin, known to stimulate collagen synthesis and promote deep cellular rejuvenation.
*   **BARRIER RECONSTRUCTION:** Packed with Behenic Acid to repair environmental damage, soothe dry patches, and protect against urban smog.
*   **MULTIPURPOSE REPAIR:** Absorbs instantly into facial tissues, cuticles, and hair roots without leaving heavy greasy residues.`
    },
    social: {
      prompt: "Generate a viral Twitter Thread & LinkedIn post on organic cosmetic trends",
      output: `🧵 **Twitter Thread: The Death of Multi-Step Chemical Peel Routines (1/5)**
The "10-step glass skin routine" was a marketing masterpiece invented to sell 10 products instead of 1. But your skin is a living organ, not a kitchen counter to be bleached. Here is why the industry is returning to Ayurvedic botanical simplicity. 👇

**(2/5)** Harvester methods matter. Active chemical ingredients degrade in plastic bottles on retail shelves. Cold-pressed botanical extracts preserved in violet glass retain original phytonutrient potency for up to 18 months without synthetic chemical binders.

**(3/5)** True skin health comes from nourishing your moisture barrier, not stripping it. Look for lipid-identical plant ceramides like moringa and kumkumadi.

**(4/5)** At Natton Digital, we're building the future of automated marketing pipelines for authentic organic brands. Let AI scale your content while you perfect your formulas.`
    }
  };

  const triggerTypingAnimation = (type: keyof typeof contentTemplates) => {
    setContentType(type);
    setIsTyping(true);
    setTypedText('');
    
    const textToType = contentTemplates[type].output;
    let i = 0;
    const interval = setInterval(() => {
      if (i < textToType.length) {
        setTypedText((prev) => prev + textToType.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 4); // super fast typing for instant feedback
  };

  useEffect(() => {
    triggerTypingAnimation(contentType);
  }, []);

  // ==========================================
  // 3. INTERACTIVE DASHBOARD SIMULATOR STATE
  // ==========================================
  const [currentTab, setCurrentTab] = useState<'content' | 'seo' | 'ads' | 'reviews' | 'scoring'>('content');
  const [seoSearchTerm, setSeoSearchTerm] = useState('organic kumkumadi tailam online');
  const [seoScore, setSeoScore] = useState(48);
  const [seoResults, setSeoResults] = useState<any>(null);
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);

  const handleSeoAnalyze = () => {
    setIsAnalyzingSeo(true);
    setTimeout(() => {
      setSeoScore(94);
      setSeoResults({
        keywordsCount: 18,
        backlinksRequired: 3,
        searchVolume: '45,000 searches/mo',
        competition: 'Medium-High',
        seoScore: 94,
        aeoScore: 'Optimized for ChatGPT, Gemini & Claude Search Protocols (97%)',
        suggestions: [
          'Add schema markup for local organic merchant stores',
          'Optimize H2 headers to address "how to apply kumkumadi serum on oily skin"',
          'Include 3 external references to Ayurvedic clinical research papers'
        ]
      });
      setIsAnalyzingSeo(false);
    }, 1500);
  };

  // ==========================================
  // 4. CAMPAIGN BUILDER STATE
  // ==========================================
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['meta', 'google']);
  const [adBudget, setAdBudget] = useState(50000); // INR per month
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [campaignOutput, setCampaignOutput] = useState<string[]>([]);
  const [isBuildingCampaign, setIsBuildingCampaign] = useState(false);

  const triggerCampaignBuilder = () => {
    setIsBuildingCampaign(true);
    setCampaignProgress(10);
    setCampaignOutput([]);

    const steps = [
      { p: 30, text: "🔍 Scraped competitor ad assets for organic skin wellness in India..." },
      { p: 60, text: "✍️ Created 3 variant ad copies using Gemini neural language generation models..." },
      { p: 85, text: "🎯 Target demographic mapped: Females 24-45 interested in clean beauty & holistic health..." },
      { p: 100, text: "🚀 Ready! Click the code export buttons to upload variables directly to Meta Ads Manager." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCampaignProgress(step.p);
        setCampaignOutput(prev => [...prev, step.text]);
        if (step.p === 100) {
          setIsBuildingCampaign(false);
        }
      }, (idx + 1) * 800);
    });
  };

  // ==========================================
  // 5. REVIEW RESPONDER STATE
  // ==========================================
  const [reviewList, setReviewList] = useState([
    {
      id: 1,
      author: "Aditi S. from Bangalore",
      rating: 5,
      text: "The Kumkumadi oil is absolutely fantastic! My dry patches cleared up in just 3 days. But my delivery package was slightly dented on arrival.",
      sentiment: "Positive (88%)",
      response: ""
    },
    {
      id: 2,
      author: "Rajesh K. from New Delhi",
      rating: 2,
      text: "Product seems high quality, but I was charged twice on checkout. Customer support didn't reply to my WhatsApp message for 4 hours.",
      sentiment: "Negative (24%)",
      response: ""
    }
  ]);

  const generateReviewResponse = (id: number) => {
    const r = reviewList.find(x => x.id === id);
    if (!r) return;
    
    let generated = "";
    if (id === 1) {
      generated = "Dear Aditi, we are thrilled that our Kumkumadi oil brought beautiful hydration to your skin in just 3 days! 🌸 We sincerely apologize for the dented delivery package. Our shipping partners have been notified to exercise extreme care. We are shipping a complimentary organic lip balm to your registered address as a gesture of goodwill! Warmly, customer care.";
    } else {
      generated = "Dear Rajesh, we are deeply sorry for the double charge and the WhatsApp response delay. This is definitely not the premium experience we promise. Our finance node has initiated an immediate refund of the duplicate ₹2,499 transaction (Reference ID: #TXN45089). We will also message you directly on WhatsApp in the next 5 minutes to ensure everything is resolved. Warmly, operations chief.";
    }

    setReviewList(prev => prev.map(x => x.id === id ? { ...x, response: generated } : x));
  };

  // ==========================================
  // 6. LEAD SCORING FUNNEL STATE
  // ==========================================
  const [scoringWeight, setScoringWeight] = useState(85);
  const leadsPool = [
    { name: "Priya Roy (Healthcare Director)", activity: "Downloaded ayurvedic intake sheet + viewed pricing page 3 times", city: "Mumbai", score: 98, status: "Hot Lead (Notify Sales)" },
    { name: "Sneha Nair (Retail Owner)", activity: "Opened intro welcome email + clicked product brochure", city: "Kochi", score: 78, status: "Warm Lead (Nurture Drip)" },
    { name: "Vikram Sen (Hobby Blogger)", activity: "Read 1 blog article + stayed on page for 45 seconds", city: "Kolkata", score: 34, status: "Cold Lead (Low Intent)" }
  ];

  // ==========================================
  // 7. WORKFLOW INTERACTIVE FLOW DIAGRAM
  // ==========================================
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);
  const workflowNodes = [
{ title: "Review the content workflow", desc: "Understand the team, channels, formats, current tools and where work slows down. Identify the first repeatable content task worth improving.", detail: "Understand the team, channels, formats, current tools and where work slows down. Identify the first repeatable content task worth improving." },
{ title: "Define brand inputs and review rules", desc: "Gather suitable references, business facts and brand guidance. Agree what the tools may use and who checks the output before release.", detail: "Gather suitable references, business facts and brand guidance. Agree what the tools may use and who checks the output before release." },
{ title: "Configure the useful workspace", desc: "Select or develop the agreed platform experience, briefs, templates and tool connections. Avoid adding software that duplicates an existing useful capability.", detail: "Select or develop the agreed platform experience, briefs, templates and tool connections. Avoid adding software that duplicates an existing useful capability." },
{ title: "Trial representative briefs", desc: "Work through realistic content requests, compare the outputs with the brief and check how editing, approval and handover operate.", detail: "Work through realistic content requests, compare the outputs with the brief and check how editing, approval and handover operate." },
{ title: "Introduce and refine", desc: "Help the team use the setup, review the quality and effort involved and improve the templates or workflow as the content needs change.", detail: "Help the team use the setup, review the quality and effort involved and improve the templates or workflow as the content needs change." }
];

  // ==========================================
  // 8. MARKETING ANALYTICS STATE
  // ==========================================
  const [analyticsScale, setAnalyticsScale] = useState<'normal' | 'optimized'>('normal');

  const analyticsMetrics = {
    normal: {
      traffic: "12,400 monthly views",
      seoScore: "62/100",
      leads: "420 monthly leads",
      roi: "1.8x ROAS",
      revenue: "₹4.8 Lakhs/mo"
    },
    optimized: {
      traffic: "48,600 monthly views (+292%)",
      seoScore: "96/100 (Google & AI Search Verified)",
      leads: "2,840 monthly leads (High Intent)",
      roi: "4.2x ROAS",
      revenue: "₹24.5 Lakhs/mo (+410%)"
    }
  };

  const currentMetrics = analyticsMetrics[analyticsScale];

  // ==========================================
  // 9. FAQ AND ACCORDION STATE
  // ==========================================
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
{
      q: "What are Natton’s AI Marketing Platforms?",
      a: "This product scope helps a team use AI-assisted content and creative tools through a clearer marketing workflow. Depending on the brief, it can involve configuring existing software, connecting selected applications or developing a customised workspace. The exact tools, formats and deliverables are agreed together."
    },
{
      q: "Is this a ready-made SaaS subscription?",
      a: "Not necessarily. Natton’s products are customised consultancy and implementation bundles. An AI Marketing Platforms proposal may use existing software or a custom interface, with implementation, subscriptions, model usage and support identified separately. The scope should make clear what is delivered and who operates it."
    },
{
      q: "Can it create copy, graphics and videos?",
      a: "Those can be part of the scope when suitable tools and production steps are selected. We agree the required formats, brand inputs, editing needs and review process first. There is no assumption that every format, model or generation allowance is included in every implementation."
    },
{
      q: "Will the content automatically match our brand?",
      a: "Brand references, structured briefs and templates can help guide the output, but they do not remove the need for editing and approval. The team checks business facts, tone, claims and asset suitability. Trial briefs help identify which outputs are useful and where the workflow needs refinement."
    },
{
      q: "Does AI-generated content guarantee better SEO or campaign results?",
      a: "No. Useful content depends on audience understanding, accurate information, originality and a clear purpose. Search visibility and campaign outcomes also depend on the wider website, targeting, offer and customer journey. We evaluate the workflow’s contribution without treating content volume as a guarantee of growth."
    },
{
      q: "How does this relate to the other Natton products?",
      a: "GrowthOS connects marketing foundations and acquisition activity. BusinessOS connects customer context and operational follow-up. AgenticOS supports advanced, scoped AI-agent workflows. AI Marketing Platforms focuses on content tools and creative production. It is a specialised option rather than a compulsory fourth stage after the other products."
    }
];

  // ==========================================
  // 10. CLIENT CAROUSEL STATE
  // ==========================================
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const clientStories = [
{
      brand: "AI Marketing Platforms — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative content workflow. The page does not generate or publish live marketing assets.",
      author: "AI Marketing Platforms — illustrative example"
    },
{
      brand: "AI Marketing Platforms — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative content workflow. The page does not generate or publish live marketing assets.",
      author: "AI Marketing Platforms — illustrative example"
    },
{
      brand: "AI Marketing Platforms — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative content workflow. The page does not generate or publish live marketing assets.",
      author: "AI Marketing Platforms — illustrative example"
    },
{
      brand: "AI Marketing Platforms — illustrative example",
      growth: "Illustrative workflow",
      quote: "Illustrative content workflow. The page does not generate or publish live marketing assets.",
      author: "AI Marketing Platforms — illustrative example"
    }
];

  return (
    <div className={`py-12 animate-fade-in font-sans text-left transition-colors duration-500 overflow-hidden relative selection:bg-purple-500 selection:text-white ${propDarkMode ? 'bg-[#04020F] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] -right-40 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute -bottom-40 left-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* ==========================================
            1. HERO SECTION (Dark Premium AI SaaS)
           ========================================== */}
        <div id="hero" className="archive-hero grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 relative">
          
          <div className="archive-hero-copy lg:col-span-7 space-y-6">
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight">{"Turn a clear brief"} <br />
<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{"into content your team can use."}</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-gray-400 max-w-2xl">{archivePage.description}</p><ArchiveContentGroup page={archivePage} group="audience" />

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#demo_form" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Book Live Demo <ArrowRight className="h-4 w-4" />
              </a>
              
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 text-[10px] font-mono text-gray-500 border-t border-white/5">
              <span className="flex items-center gap-1.5">{"Clear briefs"}</span>
              <span className="flex items-center gap-1.5">{"Useful drafts"}</span>
              <span className="flex items-center gap-1.5">{"A shared creative direction"}</span>
            </div>
          </div>

          {/* Right Column: Holographic AI Dashboard preview */}
          <ArchiveHeroBackground page={archivePage} />
        </div>

        {/* ==========================================
            2. PLATFORM OVERVIEW (Bento Grid)
           ========================================== */}
        <div id="platform_overview" className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase block font-bold">Unified AI Ecosystem</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"What we can help you connect"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.definition.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
{
                id: "studio",
                title: "A better starting brief",
                desc: "Bring the audience, offer, channel, format and intended action into a clear brief. Approved business information and brand references give the team a more useful starting point than an open-ended prompt.",
                icon: FileText,
                color: "text-blue-400 bg-blue-500/10"
              },
{
                id: "seo",
                title: "AI-assisted copy and content drafts",
                desc: "Prepare draft website copy, social captions, articles, email content or campaign variations within the agreed scope. Editors review accuracy, originality, tone and relevance before publication. AI-generated text is treated as draft material rather than automatically accepted as fact.",
                icon: Search,
                color: "text-purple-400 bg-purple-500/10"
              },
{
                id: "ads",
                title: "Creative assets with a shared direction",
                desc: "Support graphics, image concepts, video preparation and channel-ready variations through the selected creative tools. Style references, templates and review rules help the assets belong to the same brand. The agreed scope identifies which formats and production tasks are included.",
                icon: Target,
                color: "text-pink-400 bg-pink-500/10"
              },
{
                id: "reviews",
                title: "Campaign planning and content organisation",
                desc: "Connect a campaign idea with its messages, asset requirements and content calendar. A shared view can help teams organise tasks and prepare variations. Publishing and advertising-platform connections are included only where they are explicitly assessed and agreed.",
                icon: MessageSquare,
                color: "text-emerald-400 bg-emerald-500/10"
              },
{
                id: "scoring",
                title: "Brand context and approval stages",
                desc: "Define the approved references, tone, prohibited claims and review responsibilities. Reviewable draft states and feedback help the team decide what can be revised, reused or released. Rights to source material and the selected tools’ terms need to be considered in the working process.",
                icon: TrendingUp,
                color: "text-yellow-400 bg-yellow-500/10"
              },
{
                id: "social",
                title: "A platform setup that fits the team",
                desc: "Start with the software and working process you need. The scope may configure existing tools, connect selected applications or develop a custom interface around an agreed workflow. Integrations, access, subscriptions and support responsibilities are made clear before development.",
                icon: Globe,
                color: "text-indigo-400 bg-indigo-500/10"
              }
].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between backdrop-blur-md"
                >
                  <div className="space-y-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold font-display">{card.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold hover:text-blue-400 transition-colors cursor-pointer">
                    <span>Access Node</span> <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            3. INTERACTIVE DASHBOARD EXPERIENCE (Typing + Real Sandbox)
           ========================================== */}
        <div id="interactive_dashboard" className="mb-24 scroll-mt-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase block font-bold">Sandbox Environment</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Interactive Product Experience
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.example.note}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold mb-1">CHOOSE MARKETING NODE</span>
              {[
                { id: 'content', title: 'AI Content Studio', icon: FileText, color: 'border-blue-500/30 text-blue-300 bg-blue-500/5' },
                { id: 'seo', title: 'SEO + AEO Assistant', icon: Search, color: 'border-purple-500/30 text-purple-300 bg-purple-500/5' },
                { id: 'ads', title: 'Campaign Ad Builder', icon: Target, color: 'border-pink-500/30 text-pink-300 bg-pink-500/5' },
                { id: 'reviews', title: 'Reputation Manager', icon: MessageSquare, color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/5' },
                { id: 'scoring', title: 'Predictive Lead Scoring', icon: TrendingUp, color: 'border-yellow-500/30 text-yellow-300 bg-yellow-500/5' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all duration-300 ${
                      isActive 
                        ? 'border-blue-400 bg-blue-500/10 text-white shadow-lg shadow-blue-500/5 scale-[1.01]' 
                        : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`} />
                      <span>{tab.title}</span>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>

            {/* Central Terminal Screen */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block">AI SHELL v1.9</span>
                  <h4 className="text-sm font-bold font-display flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} /> 
                    {currentTab === 'content' && 'Content Generation Terminal'}
                    {currentTab === 'seo' && 'SEO & AEO Analysis Board'}
                    {currentTab === 'ads' && 'Ad Campaign Publisher Engine'}
                    {currentTab === 'reviews' && 'AI Review Sentiment Engine'}
                    {currentTab === 'scoring' && 'Behavioral Intake Scoring Grid'}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* ==========================================
                  PLAYGROUND COMPONENT: CONTENT STUDIO
                 ========================================== */}
              {currentTab === 'content' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(contentTemplates) as Array<keyof typeof contentTemplates>).map((type) => (
                      <button
                        key={type}
                        onClick={() => triggerTypingAnimation(type)}
                        className={`p-2 rounded text-[10px] font-mono border transition-all ${
                          contentType === type 
                            ? 'border-blue-400 bg-blue-500/10 text-blue-300' 
                            : 'border-white/5 bg-black/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 min-h-[220px] flex flex-col justify-between">
                    <div className="text-[11px] text-gray-500 font-mono flex justify-between pb-2 border-b border-white/5 mb-3">
                      <span>Query: {contentTemplates[contentType].prompt}</span>
                      {isTyping && <span className="text-blue-400 font-bold animate-pulse">🤖 WRITING...</span>}
                    </div>

                    <div className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-y-auto pr-2">
                      {typedText}
                      {isTyping && <span className="inline-block w-2 h-4 ml-0.5 bg-blue-400 animate-pulse" />}
                    </div>

                    <div className="pt-2 border-t border-white/5 mt-3 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                      <span>Output: Standard Markdown (UTF-8)</span>
                      <span>Target: Clean Ayurvedic Language Patterns</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  PLAYGROUND COMPONENT: SEO / AEO
                 ========================================== */}
              {currentTab === 'seo' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        value={seoSearchTerm}
                        onChange={(e) => setSeoSearchTerm(e.target.value)}
                        placeholder="Enter target organic search term..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs font-mono focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSeoAnalyze}
                      disabled={isAnalyzingSeo}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isAnalyzingSeo ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 min-h-[220px] flex flex-col justify-between">
                    {!seoResults ? (
                      <div className="text-center py-12 text-gray-500 space-y-2">
                        <Search className="h-8 w-8 mx-auto text-purple-500 animate-pulse" />
                        <p className="text-xs font-mono">Input a search term and press analyze to fetch organic scoring indices.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-[8px] text-gray-500 font-mono block">AEO ACC RECOMMENDATION</span>
                            <span className="text-emerald-400 font-bold font-mono text-xs">High Match</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-[8px] text-gray-500 font-mono block">MONTHLY SEARCH VOL</span>
                            <span className="text-white font-bold font-mono text-xs">{seoResults.searchVolume}</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-[8px] text-gray-500 font-mono block">COMPETITIVE INDEX</span>
                            <span className="text-purple-400 font-bold font-mono text-xs">{seoResults.competition}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-purple-400 font-bold font-mono block">Optimized Structure Adjustments:</span>
                          <ul className="space-y-1.5 text-xs">
                            {seoResults.suggestions.map((s: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300 font-mono text-[10px]">
                                <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 mt-3 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                      <span>Index Target: ChatGPT Search, Gemini Protocols</span>
                      <span>Health Index score: <span className="text-emerald-400 font-bold">{seoScore}/100</span></span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  PLAYGROUND COMPONENT: ADS CAMPAIGN BUILDER
                 ========================================== */}
              {currentTab === 'ads' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block">Select Outbound Channels</span>
                      <div className="flex flex-wrap gap-2">
                        {['meta', 'google', 'linkedin'].map((ch) => (
                          <button
                            key={ch}
                            onClick={() => {
                              if (selectedChannels.includes(ch)) {
                                setSelectedChannels(selectedChannels.filter(c => c !== ch));
                              } else {
                                setSelectedChannels([...selectedChannels, ch]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase font-bold transition-all ${
                              selectedChannels.includes(ch)
                                ? 'border-pink-500 bg-pink-500/10 text-pink-300'
                                : 'border-white/5 bg-black/20 text-gray-400'
                            }`}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block">Set Monthly Budget (₹{adBudget.toLocaleString('en-IN')})</span>
                      <input
                        type="range"
                        min="10000"
                        max="200000"
                        step="5000"
                        value={adBudget}
                        onChange={(e) => setAdBudget(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 min-h-[180px] flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3">
                      <span className="text-[10px] text-gray-500 font-mono">Campaign Generation Log:</span>
                      {isBuildingCampaign && <span className="text-pink-400 font-bold font-mono text-[9px] animate-pulse">CREATING VARIABLES...</span>}
                    </div>

                    <div className="space-y-2 min-h-[100px]">
                      {campaignOutput.length === 0 && (
                        <div className="text-center py-8 text-gray-500 font-mono text-[10px] space-y-2">
                          <Target className="h-6 w-6 mx-auto text-pink-500 animate-pulse" />
                          <p>Click 'Build Campaign' to compile organic target parameters.</p>
                        </div>
                      )}
                      {campaignOutput.map((log, i) => (
                        <p key={i} className="text-[10px] font-mono text-gray-300 leading-relaxed flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{log}</span>
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={triggerCampaignBuilder}
                      disabled={isBuildingCampaign || selectedChannels.length === 0}
                      className="w-full mt-3 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-mono font-bold uppercase transition-all disabled:opacity-50"
                    >
                      {isBuildingCampaign ? `Progressing... ${campaignProgress}%` : 'Build Campaign Assets'}
                    </button>
                  </div>
                </div>
              )}

              {/* ==========================================
                  PLAYGROUND COMPONENT: REPUTATION MANAGER
                 ========================================== */}
              {currentTab === 'reviews' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {reviewList.map((rev) => (
                      <div key={rev.id} className="p-3 rounded-lg border border-white/5 bg-black/20 text-[10px] font-mono space-y-2">
                        <div className="flex justify-between items-center text-gray-400">
                          <span className="font-bold">{rev.author}</span>
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>Sentiment: {rev.sentiment}</span>
                          </span>
                        </div>
                        <p className="text-gray-300 italic">"{rev.text}"</p>
                        
                        {rev.response ? (
                          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded font-sans whitespace-pre-wrap leading-relaxed">
                            <span className="font-mono text-[8px] text-emerald-400 block font-bold mb-1">AUTO RESPONSE DISPATCHED:</span>
                            {rev.response}
                          </div>
                        ) : (
                          <button
                            onClick={() => generateReviewResponse(rev.id)}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold text-[9px] uppercase border border-white/5"
                          >
                            Draft Auto Response
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  PLAYGROUND COMPONENT: LEAD SCORING
                 ========================================== */}
              {currentTab === 'scoring' && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>Hot Lead Filter Threshold:</span>
                      <span className="text-yellow-400 font-bold">{scoringWeight}% interest score</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      value={scoringWeight}
                      onChange={(e) => setScoringWeight(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                  </div>

                  <div className="space-y-2">
                    {leadsPool.map((lead, idx) => {
                      const isHot = lead.score >= scoringWeight;
                      return (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg border transition-all ${
                            isHot 
                              ? 'border-yellow-400/50 bg-yellow-400/5' 
                              : 'border-white/5 bg-black/20 opacity-70'
                          }`}
                        >
                          <div className="flex justify-between items-center font-mono text-[10px] mb-1">
                            <span className="font-bold text-gray-200">{lead.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              isHot ? 'bg-yellow-400/20 text-yellow-300' : 'bg-zinc-800 text-gray-400'
                            }`}>
                              Score: {lead.score}%
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-sans">{lead.activity}</p>
                          <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 mt-2">
                            <span>Origin: {lead.city}, India</span>
                            <span className={isHot ? 'text-yellow-300 font-bold' : 'text-gray-500'}>
                              Action: {isHot ? '🔥 CALL ADVISOR' : '✉️ Nurture sequence'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Terminal Footer */}
              <div className="pt-4 border-t border-white/5 mt-6 flex flex-wrap items-center justify-between gap-4 text-[9px] text-gray-500 font-mono">
                <span>Model Route: Server-Side Gemini 1.5 PRO API</span>
                <span>Security State: Sandbox Isolations Live</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================
            4. DEEP DIVE: CONTENT STUDIO SPEC
           ========================================== */}
        <div id="content_studio" className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
          <div className="space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">Deep Dive Spec</span>
            <h3 className="text-3xl font-bold font-display">AI Content Studio</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Compile editorial-grade cosmetic outlines, long-form blogs, landing page conversion headings, high-click Google search keywords, and Twitter hooks instantly.
            </p>
            <div className="space-y-3 font-sans text-xs">
              {[
                { title: "SEO-Optimized Outlines", desc: "Maps relevant search patterns and outputs structured markdown headings." },
                { title: "Conversion Headlines", desc: "Generates high-CTR landing page titles using psychological marketing principles." },
                { title: "Ad Copy Generator", desc: "Constructs Meta and Google ads tailored to specific buyer personas." },
                { title: "Email Drip Campaigns", desc: "Drafts comprehensive nurture chains that keep your subscribers engaged." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-200">{item.title}</h5>
                    <p className="text-gray-400 text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#070514]/80 space-y-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">LIVE TYPING WORKSPACE PREVIEW</span>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] space-y-3">
              <p className="text-[#00C2FF]">&gt; Initializing server-side generative text parameters...</p>
              <p className="text-purple-400">&gt; Fine-tuning Ayurvedic brand tone of voice (Premium & Holistic)...</p>
              <p className="text-emerald-400">&gt; Generating 45-day social campaign calendar...</p>
              <div className="border-t border-white/5 pt-2 mt-2">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  "Unveil your skin's true biological destiny. Cold-pressed in small batches, our organic moringa serum pairs cellular active lipids with ancient wisdom."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            5. DEEP DIVE: SEO & AEO ASSISTANT
           ========================================== */}
        <div id="seo_assistant" className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
          <div className="order-2 lg:order-1 p-6 rounded-2xl border border-white/10 bg-[#070514]/80 space-y-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">SEO/AEO CORE DASHBOARD</span>
            
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between">
                <span className="text-gray-400">Google Index Position</span>
                <span className="text-emerald-400 font-bold">#1 spot (Keyword: Organic Skin India)</span>
              </div>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between">
                <span className="text-gray-400">AEO Conversational Score</span>
                <span className="text-purple-400 font-bold">96% ChatGPT recommended</span>
              </div>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between">
                <span className="text-gray-400">Schema Markups Indexed</span>
                <span className="text-blue-400 font-bold">JSON-LD Local Merchant</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Search className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Search Optimization</span>
            <h3 className="text-3xl font-bold font-display">SEO + AEO Assistant</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Traditional SEO is not enough. With the rise of SearchGPT, Claude, and Gemini, customers are asking conversational questions. Our engine structures your data schemas so AI systems actively propose your products.
            </p>
            <div className="space-y-3 font-sans text-xs">
              {[
                { title: "ChatGPT and Claude optimization", desc: "Aligns structural copy with indexing protocols of top AI search engines." },
                { title: "Keyword Difficulty Mapping", desc: "Flags low-competition, high-yield organic search targets." },
                { title: "Structured Schema Markups", desc: "Injects JSON-LD local merchant metadata so crawlers parse pricing instantly." },
                { title: "Competitor Semantics analysis", desc: "Detects missing conversational topics compared to top organic peers." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-200">{item.title}</h5>
                    <p className="text-gray-400 text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            6. WORKFLOW AUTOMATION (Interactive Flow Chart Diagram)
           ========================================== */}
        <div id="workflow" className="mb-24 scroll-mt-12 solution-process-section">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-pink-400 uppercase block font-bold">System Architecture</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"How we work"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.timing}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 solution-process-step-grid">
            {workflowNodes.map((node, idx) => {
              const isActive = activeWorkflowIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveWorkflowIdx(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 min-h-[120px] flex flex-col justify-between ${
                    isActive 
                      ? 'border-purple-400 bg-purple-500/10 shadow-lg scale-[1.01]' 
                      : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-gray-500">STEP 0{idx + 1}</span>
                    {isActive && <span className="text-purple-400 font-bold">● VISUALIZING</span>}
                  </div>
                  
                  <h4 className="text-xs font-bold font-display mt-2">{node.title}</h4>
                  <span className="text-[10px] text-gray-400 line-clamp-2 leading-tight mt-1">{node.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Workflow description detail card */}
          <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-2">TECHNICAL PROTOCOL:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-bold font-display text-white">{workflowNodes[activeWorkflowIdx].title}</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{workflowNodes[activeWorkflowIdx].desc}</p>
              </div>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] flex items-center justify-between">
                <div>
                  <span className="text-gray-500 block mb-1">AUTOMATED SUBPROCESS</span>
                  <span className="text-emerald-400 font-bold">{workflowNodes[activeWorkflowIdx].detail}</span>
                </div>
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            7. MARKETING ANALYTICS (Interactive Simulation)
           ========================================== */}
        <div id="analytics" className="mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase block font-bold">Operational Impact</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Useful signals. Better conversations."}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{"We agree the indicators around your objective, the information available and the work in scope. Review the quality of the next step as well as the activity that led to it."}</p>
          </div><ArchiveContentGroup page={archivePage} group="metrics" />

          <div className="p-8 rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Toggle Switch */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className={`text-xs font-mono font-bold uppercase transition-colors ${analyticsScale === 'normal' ? 'text-white' : 'text-gray-500'}`}>
                Standard Marketing
              </span>
              <button
                onClick={() => setAnalyticsScale(analyticsScale === 'normal' ? 'optimized' : 'normal')}
                className="w-14 h-8 bg-zinc-800 rounded-full p-1 relative flex items-center transition-colors focus:outline-none border border-white/10"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 absolute transition-all duration-300 ${
                  analyticsScale === 'optimized' ? 'left-7' : 'left-1'
                }`} />
              </button>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors ${analyticsScale === 'optimized' ? 'text-[#00C2FF]' : 'text-gray-500'}`}>
                Natton Optimized <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
              </span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'MONTHLY TRAFFIC', val: currentMetrics.traffic, icon: Globe, color: 'text-blue-400 bg-blue-500/10' },
                { title: 'SEO INDEX SCORE', val: currentMetrics.seoScore, icon: Search, color: 'text-purple-400 bg-purple-500/10' },
                { title: 'MONTHLY LEADS', val: currentMetrics.leads, icon: Users, color: 'text-pink-400 bg-pink-500/10' },
                { title: 'CAMPAIGN ROI', val: currentMetrics.roi, icon: TrendingUp, color: 'text-yellow-400 bg-yellow-500/10' },
                { title: 'ESTIMATED REVENUE', val: currentMetrics.revenue, icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${m.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider font-bold">{m.title}</span>
                    </div>
                    <p className="text-xs font-bold font-display text-white mt-2 transition-all duration-300">{m.val}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            8. INTEGRATIONS GRID (Beautiful Badges)
           ========================================== */}
        <div id="integrations" className="mb-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase block font-bold">Unrestricted Interoperability</span>
            <h2 className="text-2xl font-bold font-display tracking-tight">
              Integrates With Your Stack
            </h2>
            <p className="text-xs text-gray-400">{archivePage.scopeNote}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "GoHighLevel", "HubSpot", "Google Workspace", "Meta Ads", 
              "LinkedIn Ads", "WordPress", "Shopify", "WooCommerce", "n8n"
            ].map((logo, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-purple-500/30 text-xs font-mono font-bold text-gray-300 rounded-xl transition-all hover:scale-[1.02]"
              >
                🔗 {logo}
              </span>
            ))}
          </div>
        </div>

        {/* ==========================================
            9. COMPARISON TABLE
           ========================================== */}
        <div id="comparison" className="mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase block font-bold">Direct Market Comparison</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.definition.title}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.definition.body}</p>
          </div><ArchiveContentGroup page={archivePage} group="needs" />

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono text-gray-400 uppercase">
                  <th className="p-4 font-bold">Features</th>
                  <th className="p-4 text-[#00C2FF] font-bold">AI Marketing Platform™</th>
                  <th className="p-4 font-semibold">Jasper</th>
                  <th className="p-4 font-semibold">Writesonic</th>
                  <th className="p-4 font-semibold">SurferSEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px] text-gray-300">
                {[
                  { f: archivePage.deliverables[0%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" },
                  { f: archivePage.deliverables[1%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" },
                  { f: archivePage.deliverables[2%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" },
                  { f: archivePage.deliverables[3%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" },
                  { f: archivePage.deliverables[4%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" },
                  { f: archivePage.deliverables[5%archivePage.deliverables.length], a: "Agreed in the proposal", b: "Assess against your requirements", c: "Assess against your requirements", d: "Assess against your requirements" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-sans text-xs font-semibold text-white">{row.f}</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ {row.a}</td>
                    <td className="p-4 text-gray-500">{row.b}</td>
                    <td className="p-4 text-gray-500">{row.c}</td>
                    <td className="p-4 text-gray-500">{row.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            10. PRICING SECTION
           ========================================== */}
        <div id="pricing" className="mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-pink-400 uppercase block font-bold">Predictable Billing</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"A practical scope. A team that stays involved."}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">{archivePage.scopeNote}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
                name: "Define the scope",
                price: "Let’s discuss",
                popular: false,
                features: ["Audience, brand and campaign brief templates","Approved reference material and creative guidance","A draft, feedback and approval workflow","Configured tools or a scoped custom workspace","Team guidance and a practical production-review plan"]
              },{
                name: "Configure and test",
                price: "Let’s discuss",
                popular: true,
                features: ["Audience, brand and campaign brief templates","Approved reference material and creative guidance","A draft, feedback and approval workflow","Configured tools or a scoped custom workspace","Team guidance and a practical production-review plan"]
              },{
                name: "Review and refine",
                price: "Let’s discuss",
                popular: false,
                features: ["Audience, brand and campaign brief templates","Approved reference material and creative guidance","A draft, feedback and approval workflow","Configured tools or a scoped custom workspace","Team guidance and a practical production-review plan"]
              }].map((plan, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl border flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.01] ${
                  plan.popular 
                    ? 'border-purple-400 bg-purple-950/10 shadow-lg shadow-purple-500/5' 
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-600 text-[9px] font-mono uppercase font-bold tracking-widest">
                    Agreed together
                  </span>
                )}

                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-gray-400">{plan.name}</span>
                  <p className="text-3xl font-bold font-display">{plan.price}</p>
                  
                  <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
                    {plan.features.map((feat, idx) => (
                      <p key={idx} className="flex items-start gap-2 text-gray-300 leading-tight">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <a 
                  href="#demo_form" 
                  className={`w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono block mt-8 transition-all ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                  }`}
                >
                  Book Setup Session
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            11. CUSTOMER STORIES
           ========================================== */}
        <div id="customer_stories" className="mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-[#00C2FF] uppercase block font-bold">Verified Success</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{archivePage.example.title}</h2>
          </div><ArchiveContentGroup page={archivePage} group="example" />

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="px-2.5 py-1 rounded bg-blue-500/15 text-blue-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  {clientStories[activeStoryIdx].brand}
                </span>
                <p className="text-base sm:text-lg italic text-gray-200">
                  "{clientStories[activeStoryIdx].quote}"
                </p>
                <p className="text-xs font-mono text-gray-500">
                  — {clientStories[activeStoryIdx].author}
                </p>
              </div>

              <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">CONVERSION IMPACT</span>
                <span className="text-2xl sm:text-3xl font-bold font-display text-emerald-400">{clientStories[activeStoryIdx].growth}</span>
              </div>
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex justify-center gap-2 mt-8 border-t border-white/5 pt-4">
              {clientStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeStoryIdx === idx ? 'w-8 bg-blue-400' : 'w-2 bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            12. FAQ ACCORDIONS (Exactly 15 Items)
           ========================================== */}
        <div id="faq" className="mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase block font-bold">Product Help Center</span>
            <h2 className="text-3xl font-bold font-display tracking-tight">{"Frequently Asked Questions"}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
              Browse through deep structural answers addressing local RAG deployments, n8n databases, data security, and AEO index protocols.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm flex justify-between items-center hover:bg-white/[0.02]"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-purple-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-white/5 text-xs text-gray-400 leading-relaxed bg-black/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            13. DEMO BOOKING FORM WITH CAPTCHA
           ========================================== */}
        <div id="demo_form" className="mb-24 scroll-mt-12">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-3 mb-8">
              <span className="text-[10px] font-mono tracking-wider text-[#00C2FF] uppercase block font-bold">Enterprise Onboarding</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Book Your Product Demo</h2>
              <p className="text-xs text-gray-400">
                Submit your parameters below. Our architects will prepare a custom Ayurvedic demo workspace prior to your call.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 animate-bounce" />
                <h3 className="text-lg font-bold font-display text-white">Demo Booking Submitted Successfully!</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Our system parsed your variables to n8n and GoHighLevel. A team member will WhatsApp you at <span className="text-white font-bold">{demoForm.phone}</span> in the next 15 minutes to secure your Zoom link.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setDemoForm({
                      name: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      country: 'India',
                      currentTools: 'None / Spreadsheets',
                      monthlyLeads: '50 - 200',
                      message: ''
                    });
                    generateCaptcha();
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-bold uppercase"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <ContactFormLink setPath={setPath} darkMode={darkMode} />
            )}
          </div>
        </div>

        {/* ==========================================
            14. FINAL CTA (Animated particles design feel)
           ========================================== */}
        

      </div>
    </div>
  );
}
