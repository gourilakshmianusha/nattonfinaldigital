export interface TrustInfo {
  name: string;
  tagline: string;
  established: string;
  headquarters: string;
  address: string;
  phone: string;
  email: string;
  ngoDarpanId: string;
  csrRegNo: string;
  pan: string;
  tax80gUrn: string;
  tax12aReg: string;
}

export interface FocusArea {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  bannerImage: string;
  sdgs: string[];
  activities: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  beneficiariesCount: string;
  longDescription?: string;
}

export interface ImpactMetric {
  id: string;
  title: string;
  count: string;
  numericCount: number;
  suffix: string;
  icon: string;
  description: string;
}

export interface DistrictImpact {
  id: string;
  name: string;
  farmers: number;
  youth: number;
  shgs: number;
  programsActive: string[];
  status: 'High Impact' | 'Growing' | 'Key Hub';
}

export interface TransformationStory {
  id: string;
  title: string;
  category: string;
  beneficiaryName: string;
  age: number;
  village: string;
  district: string;
  beforeText: string;
  afterText: string;
  beforeImage: string;
  afterImage: string;
  quote: string;
  metrics: { label: string; value: string }[];
  sdgs: string[];
}

export interface CsrDocument {
  id: string;
  title: string;
  category: 'Registration' | 'Tax & Exemptions' | 'Audits & Financials' | 'Annual Reports' | 'Governance Policies';
  description: string;
  fileSize: string;
  fileType: string;
  year: string;
  downloadUrl: string;
  status: 'Verified' | 'Approved' | 'Active';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  mode: 'In-Person' | 'Online' | 'Hybrid';
  description: string;
  speakers: { name: string; title: string; image: string }[];
  seatsLeft: number;
  image: string;
  status: 'Upcoming' | 'Live' | 'Completed';
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Annual Report' | 'Impact Report' | 'Case Study' | 'CSR Brochure' | 'Policy' | 'Toolkit';
  format: string;
  size: string;
  date: string;
  downloadCount: number;
  description: string;
  fileUrl: string;
  coverImage: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: { name: string; role: string; avatar: string };
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  keyTakeaways?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Agriculture' | 'Women Empowerment' | 'AI & Youth Skills' | 'Healthcare & Sanitation' | 'Tree Plantation' | 'CSR Events';
  image: string;
  district: string;
  date: string;
  caption: string;
  photographer?: string;
}

export interface CsrInquiry {
  organizationName: string;
  contactPerson: string;
  designation: string;
  corporateEmail: string;
  phone: string;
  csrFocusArea: string;
  budgetRange: string;
  state: string;
  message: string;
}

export interface VolunteerApplication {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  skills: string[];
  areasOfInterest: string[];
  availability: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedQuestions?: string[];
}
