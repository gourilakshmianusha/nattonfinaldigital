import {
  TrustInfo,
  FocusArea,
  ImpactMetric,
  DistrictImpact,
  TransformationStory,
  CsrDocument,
  TeamMember,
  EventItem,
  ResourceItem,
  BlogPost,
  GalleryItem
} from '../types';

export const trustInfo: TrustInfo = {
  name: "Raita Mitra Social Trust (R)",
  tagline: "Empowering Farmers, Strengthening Rural Communities, Nurturing Sustainable Futures",
  established: "2021",
  headquarters: "Hubballi, Karnataka, India",
  address: "#37, First Floor, Pride Icon, Gokul Road, Hubballi - 580030, Karnataka, India",
  phone: "+91 7676376221",
  email: "contact@raitamitrasocialtrust.org",
  ngoDarpanId: "KA/2023/0342549",
  csrRegNo: "CSR00059487",
  pan: "AAETR3286K",
  tax80gUrn: "AAETR3286KF20231",
  tax12aReg: "AAETR3286KE20230"
};

export const impactMetrics: ImpactMetric[] = [
  {
    id: "farmers",
    title: "Farmers Empowered",
    count: "5000+",
    numericCount: 5000,
    suffix: "+",
    icon: "Wheat",
    description: "Trained in soil health management, organic inputs, micro-irrigation, and market linkages across rural Karnataka."
  },
  {
    id: "youth",
    title: "Rural Youth Trained",
    count: "3000+",
    numericCount: 3000,
    suffix: "+",
    icon: "GraduationCap",
    description: "Skilled in digital literacy, AI tools, workplace readiness, and future-oriented vocational competencies."
  },
  {
    id: "livelihoods",
    title: "Livelihoods Supported",
    count: "1500+",
    numericCount: 1500,
    suffix: "+",
    icon: "Briefcase",
    description: "Women self-help group members and micro-entrepreneurs enabled with enterprise grants and market connections."
  },
  {
    id: "districts",
    title: "Districts Covered",
    count: "12+",
    numericCount: 12,
    suffix: "+",
    icon: "MapPin",
    description: "Active community intervention programs in Dharwad, Belagavi, Bagalkot, Gadag, Haveri, Koppal, Raichur, and beyond."
  }
];

export const focusAreas: FocusArea[] = [
  {
    id: "agri",
    title: "Sustainable Agriculture & Farmer Empowerment",
    slug: "sustainable-agriculture",
    description: "Promoting climate-resilient farming, soil health testing, micro-irrigation, organic inputs, and direct-to-market linkages.",
    iconName: "Sprout",
    bannerImage: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 1: No Poverty", "SDG 2: Zero Hunger", "SDG 13: Climate Action"],
    activities: [
      "Farmer Capacity Building & Soil Health Camps",
      "Organic Input Production & Vermicomposting Units",
      "Rainwater Harvesting & Drip Irrigation Promotion",
      "Crop Productivity Enhancement Workshops",
      "Farmer Producer Organization (FPO) Support"
    ],
    metrics: [
      { label: "Farmers Trained", value: "5,000+" },
      { label: "Soil Tests Conducted", value: "1,200+" },
      { label: "Yield Increase Avg", value: "28%" }
    ],
    beneficiariesCount: "5000+ Farmers",
    longDescription: "Agriculture is the backbone of rural Karnataka. Raita Mitra Social Trust equips smallholder farmers with scientific soil testing, bio-fertilizer training, water conservation techniques, and direct market access to eliminate middleman exploitation."
  },
  {
    id: "women",
    title: "Women Empowerment & Livelihoods",
    slug: "women-empowerment",
    description: "Strengthening women-led self-help groups (SHGs), micro-entrepreneurship, financial literacy, and vocational craft skills.",
    iconName: "Users",
    bannerImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 5: Gender Equality", "SDG 8: Decent Work & Economic Growth"],
    activities: [
      "Self-Help Group (SHG) Formation & Strengthening",
      "Financial Literacy & Bank Linkage Drives",
      "Tailoring, Food Processing & Handicrafts Training",
      "Seed Capital & Micro-Grant Assistance",
      "Leadership & Community Advocacy Workshops"
    ],
    metrics: [
      { label: "Women Beneficiaries", value: "1,500+" },
      { label: "SHGs Mobilized", value: "85+" },
      { label: "Micro-Enterprises Started", value: "120+" }
    ],
    beneficiariesCount: "1500+ Women",
    longDescription: "By placing economic agency in the hands of women, Raita Mitra Social Trust transforms entire households. Women SHGs are trained in value-added food products, tailoring, and eco-friendly handicrafts."
  },
  {
    id: "education",
    title: "Education, Digital & AI Skills",
    slug: "education-ai-skills",
    description: "Bridging the digital divide for rural youth and students through computer literacy, AI skill workshops, and career mentoring.",
    iconName: "Laptop",
    bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 4: Quality Education", "SDG 8: Decent Work & Economic Growth"],
    activities: [
      "Rural AI & Digital Literacy Bootcamps",
      "School Computer Lab Support & Digital Classrooms",
      "Career Guidance & Resume Workshops",
      "Soft Skills & English Communication Training",
      "STEM & Robotics Exposure for Rural Schools"
    ],
    metrics: [
      { label: "Youth Trained", value: "3,000+" },
      { label: "Schools Reached", value: "45+" },
      { label: "Workshops Conducted", value: "180+" }
    ],
    beneficiariesCount: "3000+ Students",
    longDescription: "Ensuring rural youth are not left behind in the artificial intelligence revolution. We provide practical hands-on training in digital tools, internet research, office automation, and foundational AI prompt engineering."
  },
  {
    id: "health",
    title: "Health, Nutrition & Community Well-being",
    slug: "health-nutrition",
    description: "Organizing free medical camps, maternal nutrition drives, eye checks, and community hygiene awareness across villages.",
    iconName: "HeartPulse",
    bannerImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 3: Good Health & Well-being", "SDG 6: Clean Water & Sanitation"],
    activities: [
      "Free General Health & Eye Checkup Camps",
      "Maternal & Child Malnutrition Awareness Drives",
      "Anemia Screening & Dietary Supplementation",
      "Clean Drinking Water & Sanitation Literacy",
      "First Aid & Tele-Health Guidance"
    ],
    metrics: [
      { label: "Patients Treated", value: "8,500+" },
      { label: "Health Camps", value: "35+" },
      { label: "Free Spectacles Distributed", value: "950+" }
    ],
    beneficiariesCount: "8500+ Patients",
    longDescription: "Preventive health is the foundation of human capability. Raita Mitra collaborates with medical experts to bring diagnostic, ophthalmic, and nutritional support directly to underserved rural hamlets."
  },
  {
    id: "climate",
    title: "Environment & Climate Action",
    slug: "climate-action",
    description: "Drive mass tree plantation, rainwater harvesting, watershed management, and bio-waste recycling initiatives.",
    iconName: "Trees",
    bannerImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 6: Clean Water & Sanitation", "SDG 13: Climate Action", "SDG 15: Life on Land"],
    activities: [
      "Native Sapling & Fruit Tree Plantation Drives",
      "Recharge Pit & Rainwater Harvesting Structures",
      "Single-Use Plastic Reduction Campaigns",
      "Renewable Solar Agriculture Pumps Literacy",
      "Community Biodiversity & Soil Conservation"
    ],
    metrics: [
      { label: "Trees Planted", value: "15,000+" },
      { label: "Water Recharge Units", value: "25+" },
      { label: "Survival Rate", value: "88%" }
    ],
    beneficiariesCount: "15,000+ Saplings Planted",
    longDescription: "Combating desertification and groundwater depletion in North Karnataka through community-driven afforestation and water conservation projects."
  },
  {
    id: "livelihood",
    title: "Livelihoods & Rural Entrepreneurship",
    slug: "rural-entrepreneurship",
    description: "Nurturing micro-enterprises, dairy & poultry allied activities, local artisan marketing, and financial inclusion.",
    iconName: "Store",
    bannerImage: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=1200",
    sdgs: ["SDG 1: No Poverty", "SDG 8: Decent Work & Economic Growth"],
    activities: [
      "Allied Farming (Dairy, Goatry, Beekeeping) Guidance",
      "Micro-Business Plan Mentorship",
      "E-Commerce & Digital Payment Adoption for Rural Sellers",
      "Fair Price Cooperative Market Pop-Ups",
      "Government Scheme Linkage Facilitation"
    ],
    metrics: [
      { label: "Enterprises Mentored", value: "210+" },
      { label: "Average Income Growth", value: "35%" },
      { label: "Schemes Availed", value: "850+" }
    ],
    beneficiariesCount: "1500+ Micro-Entrepreneurs",
    longDescription: "Unlocking non-farm and allied agricultural income channels so that rural households possess multiple resilient revenue streams throughout dry seasons."
  }
];

export const districtImpacts: DistrictImpact[] = [
  { id: "dharwad", name: "Dharwad", farmers: 1250, youth: 850, shgs: 25, programsActive: ["Agri", "AI Skills", "Health", "SHGs"], status: "Key Hub" },
  { id: "belagavi", name: "Belagavi", farmers: 950, youth: 600, shgs: 18, programsActive: ["Agri", "Climate", "SHGs"], status: "High Impact" },
  { id: "bagalkot", name: "Bagalkot", farmers: 800, youth: 450, shgs: 14, programsActive: ["Agri", "Livelihoods"], status: "High Impact" },
  { id: "gadag", name: "Gadag", farmers: 650, youth: 300, shgs: 12, programsActive: ["Agri", "Climate"], status: "Growing" },
  { id: "haveri", name: "Haveri", farmers: 500, youth: 280, shgs: 10, programsActive: ["Agri", "Health"], status: "Growing" },
  { id: "koppal", name: "Koppal", farmers: 450, youth: 250, shgs: 8, programsActive: ["Agri", "AI Skills"], status: "Growing" },
  { id: "raichur", name: "Raichur", farmers: 400, youth: 220, shgs: 6, programsActive: ["Agri", "Health"], status: "Growing" },
  { id: "bidar", name: "Bidar", farmers: 350, youth: 200, shgs: 5, programsActive: ["Agri", "SHGs"], status: "Growing" },
  { id: "vijayapura", name: "Vijayapura", farmers: 380, youth: 210, shgs: 7, programsActive: ["Agri", "Climate"], status: "Growing" }
];

export const transformationStories: TransformationStory[] = [
  {
    id: "story-1",
    title: "From Debt to Bumper Yield: Basavaraj's Organic Farming Journey",
    category: "Sustainable Agriculture",
    beneficiaryName: "Basavarajappa Patil",
    age: 48,
    village: "Navalgund",
    district: "Dharwad",
    beforeText: "Faced severe soil degradation, excessive chemical costs, and falling groundwater levels, leading to debt of ₹1.2 Lakhs.",
    afterText: "Adopted soil health testing, vermicomposting, and drip irrigation under Raita Mitra support. Reduced input costs by 40% and improved crop yield by 32%.",
    beforeImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    quote: "Raita Mitra showed me that soil is living gold. Today I spend far less on chemical fertilizers and my land produces healthiest crops.",
    metrics: [
      { label: "Cost Reduction", value: "40%" },
      { label: "Net Income Gain", value: "₹85,000/yr" }
    ],
    sdgs: ["SDG 1", "SDG 2", "SDG 13"]
  },
  {
    id: "story-2",
    title: "Laxmi's Food Processing Enterprise Empowers 12 Rural Women",
    category: "Women Empowerment",
    beneficiaryName: "Laxmidevi Hubballi",
    age: 36,
    village: "Tarikoppa",
    district: "Dharwad",
    beforeText: "Homemaker without personal savings or credit access, reliant entirely on seasonal agricultural day labor.",
    afterText: "Joined Raita Mitra SHG training in food processing and packaging. Received micro-grant for spice grinding machinery and now runs 'Ananya Food Products'.",
    beforeImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    quote: "I never imagined I would sign paychecks for 12 other women in my village. Financial freedom changed my family's dignity.",
    metrics: [
      { label: "Monthly Income", value: "₹18,000" },
      { label: "Women Employed", value: "12" }
    ],
    sdgs: ["SDG 5", "SDG 8"]
  },
  {
    id: "story-3",
    title: "Farmer's Son to Digital & AI Facilitator: Chetan's Rise",
    category: "Education & AI Skills",
    beneficiaryName: "Chetan Kumar",
    age: 21,
    village: "Kundgol",
    district: "Dharwad",
    beforeText: "Unemployed diploma graduate considering urban distress migration to Bangalore for low-wage factory labor.",
    afterText: "Enrolled in Raita Mitra's 3-month AI & Digital Skills Bootcamp. Mastered computer operations, document processing, and basic AI prompt usage. Now works as a digital assistant at a local agro-tech cooperative.",
    beforeImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    quote: "Learning AI tools and digital literacy gave me confidence right in my home district without having to leave my aging parents.",
    metrics: [
      { label: "Monthly Salary", value: "₹16,500" },
      { label: "Skills Mastered", value: "Digital & AI Tools" }
    ],
    sdgs: ["SDG 4", "SDG 8"]
  }
];

export const csrDocuments: CsrDocument[] = [
  {
    id: "doc-1",
    title: "NGO Darpan Registration Certificate",
    category: "Registration",
    description: "Official NITI Aayog NGO Darpan Registration (Unique ID: KA/2023/0342549).",
    fileSize: "1.2 MB",
    fileType: "PDF",
    year: "2023",
    downloadUrl: "#",
    status: "Verified"
  },
  {
    id: "doc-2",
    title: "Ministry of Corporate Affairs CSR-1 Form",
    category: "Registration",
    description: "MCA Registration for undertaking CSR activities (Registration No: CSR00059487).",
    fileSize: "1.8 MB",
    fileType: "PDF",
    year: "2023",
    downloadUrl: "#",
    status: "Approved"
  },
  {
    id: "doc-3",
    title: "80G Tax Exemption Certificate",
    category: "Tax & Exemptions",
    description: "50% Tax Exemption certificate under Section 80G for individual and corporate donors (URN: AAETR3286KF20231).",
    fileSize: "1.4 MB",
    fileType: "PDF",
    year: "2023",
    downloadUrl: "#",
    status: "Approved"
  },
  {
    id: "doc-4",
    title: "12A Income Tax Exemption Order",
    category: "Tax & Exemptions",
    description: "Registration order under Section 12A of the Income Tax Act 1961 (Reg: AAETR3286KE20230).",
    fileSize: "1.1 MB",
    fileType: "PDF",
    year: "2023",
    downloadUrl: "#",
    status: "Approved"
  },
  {
    id: "doc-5",
    title: "Audited Financial Statement FY 2024-25",
    category: "Audits & Financials",
    description: "Complete independent Chartered Accountant Audit Report, Balance Sheet, Income & Expenditure Statement.",
    fileSize: "3.5 MB",
    fileType: "PDF",
    year: "2024-25",
    downloadUrl: "#",
    status: "Verified"
  },
  {
    id: "doc-6",
    title: "Annual Impact Report FY 2024-25",
    category: "Annual Reports",
    description: "Comprehensive narrative and financial utilization report covering 5,000+ farmer beneficiaries.",
    fileSize: "5.2 MB",
    fileType: "PDF",
    year: "2024-25",
    downloadUrl: "#",
    status: "Active"
  },
  {
    id: "doc-7",
    title: "Child Protection & Safeguarding Policy",
    category: "Governance Policies",
    description: "Trust Governance policy ensuring safety, non-discrimination, and ethical code of conduct.",
    fileSize: "950 KB",
    fileType: "PDF",
    year: "2024",
    downloadUrl: "#",
    status: "Active"
  },
  {
    id: "doc-8",
    title: "Anti-Fraud & Whistleblower Policy",
    category: "Governance Policies",
    description: "Zero-tolerance anti-corruption policy and transparent reporting mechanisms.",
    fileSize: "820 KB",
    fileType: "PDF",
    year: "2024",
    downloadUrl: "#",
    status: "Active"
  }
];

export const leadershipTeam: TeamMember[] = [
  {
    id: "leader-1",
    name: "Dr. Ramesh Patil",
    role: "Managing Trustee",
    title: "Founder & Managing Trustee",
    bio: "Agricultural scientist and social entrepreneur with over 22 years of grassroots experience in rural Karnataka's farming communities.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    linkedin: "https://linkedin.com",
    email: "ramesh@raitamitrasocialtrust.org"
  },
  {
    id: "leader-2",
    name: "Smt. Sunita Kulkarni",
    role: "Director - Rural Programs",
    title: "Director - Women & Livelihood Initiatives",
    bio: "Dedicated advocate for women's economic self-reliance, having mobilized over 150 SHGs across Dharwad and Belagavi districts.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    linkedin: "https://linkedin.com",
    email: "sunita@raitamitrasocialtrust.org"
  },
  {
    id: "leader-3",
    name: "Mr. Vijaykumar Hubballi",
    role: "Director - Operations & CSR",
    title: "Director - CSR Compliance & Operations",
    bio: "Former corporate ESG consultant specialized in M&E frameworks, financial transparency, and quarterly partner reporting.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    linkedin: "https://linkedin.com",
    email: "vijay@raitamitrasocialtrust.org"
  }
];

export const upcomingEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Karnataka Sustainable Farmers Summit 2026",
    category: "Agriculture",
    date: "Aug 28, 2026",
    time: "10:00 AM - 04:30 PM",
    venue: "KLE Tech Auditorium, Hubballi",
    district: "Dharwad",
    mode: "Hybrid",
    description: "A flagship gathering of 500+ smallholder farmers, agricultural scientists, FPO leaders, and CSR donors discussing climate resilience.",
    speakers: [
      { name: "Dr. Ramesh Patil", title: "Managing Trustee", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
      { name: "Prof. S. N. Joshi", title: "Soil Health Expert", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" }
    ],
    seatsLeft: 42,
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    status: "Upcoming"
  },
  {
    id: "evt-2",
    title: "Rural Youth AI & Digital Skills Bootcamp",
    category: "AI Skills & Education",
    date: "Sep 10, 2026",
    time: "09:30 AM - 02:00 PM",
    venue: "Raita Mitra Resource Hub, Gokul Road, Hubballi",
    district: "Dharwad",
    mode: "In-Person",
    description: "Hands-on interactive workshop teaching rural students basic computer applications, internet safety, and introduction to AI tools.",
    speakers: [
      { name: "Priya Sharma", title: "Tech Mentor", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" }
    ],
    seatsLeft: 18,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    status: "Upcoming"
  },
  {
    id: "evt-3",
    title: "Women SHG Food Processing & Micro-Enterprise Expo",
    category: "Women Livelihoods",
    date: "Sep 22, 2026",
    time: "11:00 AM - 06:00 PM",
    venue: "Urban Haat, Belagavi",
    district: "Belagavi",
    mode: "In-Person",
    description: "Exhibition showcasing authentic homemade spices, pickles, millets, and handicrafts crafted by 30+ Women Self-Help Groups.",
    speakers: [
      { name: "Sunita Kulkarni", title: "Director Programs", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" }
    ],
    seatsLeft: 100,
    image: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&q=80&w=800",
    status: "Upcoming"
  }
];

export const resourcesList: ResourceItem[] = [
  {
    id: "res-1",
    title: "Corporate CSR Partnership Brochure 2025-26",
    category: "CSR Brochure",
    format: "PDF",
    size: "4.2 MB",
    date: "July 2025",
    downloadCount: 1420,
    description: "Complete overview of CSR alignment, project intervention models, M&E frameworks, and 80G tax exemptions.",
    fileUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "res-2",
    title: "Sustainable Soil Health & Bio-Input Guide for Farmers",
    category: "Toolkit",
    format: "PDF",
    size: "3.1 MB",
    date: "May 2025",
    downloadCount: 2850,
    description: "Practical Kannada & English handbook explaining organic compost creation, soil testing protocols, and natural pest management.",
    fileUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "res-3",
    title: "Annual Impact & Audited Financial Report FY 2024-25",
    category: "Annual Report",
    format: "PDF",
    size: "5.8 MB",
    date: "April 2025",
    downloadCount: 980,
    description: "Detailed financial statements, independent audit opinion, beneficiary numbers, and district coverage heatmaps.",
    fileUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "res-4",
    title: "Women SHG Enterprise Model Case Study",
    category: "Case Study",
    format: "PDF",
    size: "2.4 MB",
    date: "February 2025",
    downloadCount: 760,
    description: "In-depth research report detailing the economic transformation of 120 rural women entrepreneurs in Dharwad.",
    fileUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Empowering Karnataka Farmers Through Climate-Resilient Agriculture",
    slug: "empowering-farmers-climate-resilient-agriculture",
    category: "Sustainable Agriculture",
    excerpt: "How soil testing, rainwater harvesting, and bio-fertilizers are helping smallholder farmers withstand dry spells in North Karnataka.",
    content: "Climate unpredictability is no longer a distant threat—it is a seasonal reality for farmers in North Karnataka. Through Raita Mitra's grassroot intervention, soil health cards are provided to farmers along with bio-input kits...",
    author: { name: "Dr. Ramesh Patil", role: "Managing Trustee", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    date: "Aug 02, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    tags: ["Agriculture", "Climate Action", "Soil Health", "Karnataka"],
    keyTakeaways: [
      "Soil health testing reduces chemical fertilizer overuse by up to 35%.",
      "Rainwater recharge pits secure emergency irrigation during dry spells.",
      "FPO linkages ensure farmers receive fair market pricing."
    ]
  },
  {
    id: "blog-2",
    title: "Democratizing AI & Digital Skills in Rural Classrooms",
    slug: "democratizing-ai-digital-skills-rural-classrooms",
    category: "AI & Skill Development",
    excerpt: "Why teaching basic computer operations and AI concepts to rural youth is crucial for sustainable economic mobility.",
    content: "When rural youth gain access to digital tools and basic artificial intelligence skills, the geographic boundary of opportunity disappears. Our 3-month bootcamps equip school students in Dharwad and Belagavi with essential digital literacy...",
    author: { name: "Vijaykumar Hubballi", role: "Director Operations", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    date: "Jul 24, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    tags: ["AI Skills", "Digital Literacy", "Rural Youth", "Education"],
    keyTakeaways: [
      "Digital literacy prevents rural youth distress migration.",
      "Practical computer skills open local cooperative and enterprise jobs.",
      "Interactive learning builds long-term problem-solving capability."
    ]
  },
  {
    id: "blog-3",
    title: "CSR Compliance & ESG Reporting: How Corporations Can Create Verified Impact",
    slug: "csr-compliance-esg-reporting-verified-impact",
    category: "CSR & Compliance",
    excerpt: "A guide for CSR heads on tracking quarterly metrics, 80G tax benefits, and geo-tagged project documentation.",
    content: "Corporate Social Responsibility is evolving from philanthropic giving to strategic ESG alignment. With MCA CSR-1 registration and NITI Aayog NGO Darpan verification, Raita Mitra ensures total transparency through quarterly utilization certificates...",
    author: { name: "Vijaykumar Hubballi", role: "Director Operations", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    date: "Jul 15, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    tags: ["CSR", "ESG", "Compliance", "80G Tax Exemption"],
    keyTakeaways: [
      "CSR-1 and 80G approvals guarantee tax exemption and compliance.",
      "Quarterly utilization certificates provide auditable financial trails.",
      "Geo-tagged field evidence ensures transparent project verification."
    ]
  }
];

export const faqsList = [
  {
    category: "General",
    question: "What is Raita Mitra Social Trust (R)?",
    answer: "Raita Mitra Social Trust (R) is a registered Karnataka-based non-profit organization established in 2021, headquartered in Hubballi. We empower farmers, women, youth, and rural communities through sustainable agriculture, digital & AI skills, healthcare, climate action, and entrepreneurship."
  },
  {
    category: "General",
    question: "Where does the Trust operate?",
    answer: "Our primary field operations span North and Central Karnataka districts, including Dharwad, Belagavi, Bagalkot, Gadag, Haveri, Koppal, Raichur, Bidar, and Vijayapura."
  },
  {
    category: "Donations & Tax",
    question: "Are donations to Raita Mitra Social Trust tax exempt?",
    answer: "Yes! Donations are eligible for 50% tax exemption under Section 80G of the Income Tax Act 1961 (80G URN: AAETR3286KF20231). Donors receive an instant digital 80G tax receipt."
  },
  {
    category: "Donations & Tax",
    question: "How are donor funds utilized?",
    answer: "88% of all donor contributions directly fund grassroots field implementation (seed supplies, soil testing kits, computer lab hardware, medical supplies). 12% covers administrative monitoring and compliance audit costs."
  },
  {
    category: "CSR Partnerships",
    question: "Is Raita Mitra Social Trust registered under MCA CSR-1?",
    answer: "Yes! The Trust is fully registered with the Ministry of Corporate Affairs under Registration No: CSR00059487, as well as NITI Aayog NGO Darpan (ID: KA/2023/0342549)."
  },
  {
    category: "CSR Partnerships",
    question: "Do you provide quarterly CSR utilization reports and certificates?",
    answer: "Yes. We provide auditable quarterly utilization certificates, third-party impact assessments, geo-tagged field photographs, and customized ESG alignment reports for CSR partners."
  },
  {
    category: "Volunteering",
    question: "Who can volunteer with Raita Mitra Social Trust?",
    answer: "Students, working professionals, corporate teams, medical experts, and retirees are all welcome to volunteer online or in-person across our Karnataka field locations. Digital certificates and volunteer hours logs are provided."
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Organic Farmers Workshop & Soil Testing Kit Distribution",
    category: "Agriculture",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200",
    district: "Dharwad",
    date: "July 2026",
    caption: "Over 120 smallholder farmers received bio-fertilizers and handheld soil acidity testers in Navalgund village.",
    photographer: "Raita Mitra Field Team"
  },
  {
    id: "gal-2",
    title: "Women Self-Help Group Food Processing Unit Inauguration",
    category: "Women Empowerment",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    district: "Belagavi",
    date: "June 2026",
    caption: "Ananya SHG members celebrating the launch of their solar-powered spice grinding and millet packaging facility.",
    photographer: "Sunita Kulkarni"
  },
  {
    id: "gal-3",
    title: "Rural High School AI & Computer Literacy Lab Opening",
    category: "AI & Youth Skills",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    district: "Dharwad",
    date: "May 2026",
    caption: "Students exploring digital learning tools and interactive coding tutorials during the 3-month AI Bootcamp.",
    photographer: "Vijaykumar H."
  },
  {
    id: "gal-4",
    title: "Native Sapling Tree Plantation Drive along Malaprabha Basin",
    category: "Tree Plantation",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
    district: "Bagalkot",
    date: "April 2026",
    caption: "Corporate volunteers & local youth planted 2,500 native saplings for soil conservation and rainwater retention.",
    photographer: "Climate Action Wing"
  },
  {
    id: "gal-5",
    title: "Karnataka CSR & NGO Governance Partnership Summit",
    category: "CSR Events",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    district: "Hubballi (HQ)",
    date: "March 2026",
    caption: "Corporate ESG leaders reviewing quarterly utilization certificates and 80G tax exemption guidelines.",
    photographer: "Raita Mitra Communications"
  },
  {
    id: "gal-6",
    title: "Mobile Healthcare & Clean Drinking Water Camp",
    category: "Healthcare & Sanitation",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200",
    district: "Gadag",
    date: "February 2026",
    caption: "Free health check-ups and RO water filter unit installations benefitting 850 rural households.",
    photographer: "Rural Health Wing"
  }
];
