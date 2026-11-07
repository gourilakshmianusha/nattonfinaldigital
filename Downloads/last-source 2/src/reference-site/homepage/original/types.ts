export type RoutePath =
  | `p/${string}`
  | `admin/${string}`
  | 'home'
  | 'services'
  | `services/${string}`
  | 'compare'
  | 'free-tools'
  | 'careers'
  | 'solutions'
  | 'products'
  | 'products/ai-growth-marketing'
  | 'products/ai-marketing-saas'
  | 'products/crm-ai-automation'
  | 'products/conversational-ai'
  | 'products/whatsapp-automation'
  | 'products/ai-agents'
  | 'products/ai-calling-agents'
  | 'products/cloud-telephony'
  | 'products/rcs-messaging'
  | 'solutions/growth-os'
  | 'solutions/growthos'
  | 'solutions/ai-marketing-platform'
  | 'solutions/business-os'
  | 'solutions/agentic-os'
  | 'industries'
  | 'industries/healthcare'
  | 'industries/education'
  | 'industries/real-estate'
  | 'industries/manufacturing'
  | 'industries/retail'
  | 'industries/retail-ecommerce'
  | 'industries/professional-services'
  | 'case-studies'
  | 'blog'
  | 'ai-readiness-assessment'
  | 'roi-calculator'
  | 'about'
  | 'why-natton-digital'
  | 'our-process'
  | 'book-demo'
  | 'resources'
  | 'integrations'
  | 'pricing'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-platform'
  | 'admin';

export interface BlogComment {
  id: string;
  authorName: string;
  authorEmail?: string;
  commentText: string;
  createdAt: string;
}

export interface SolutionCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  path: RoutePath;
  icon: string;
  stats: string;
  features: string[];
}

export interface ProductDetail {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  keyFeatures: { title: string; desc: string }[];
  techStack: string[];
  capabilities: string[];
  imagePrompt: string;
}

export interface IndustryDetail {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  painPoints: string[];
  solutions: string[];
  results: { metric: string; desc: string }[];
  caseStudyTitle: string;
  workflowSteps: { title: string; desc: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: 'Healthcare' | 'Education' | 'Real Estate' | 'Retail' | 'Manufacturing' | 'Professional Services';
  tagline: string;
  challenge: string;
  solution: string;
  results: string[];
  roi: string;
  beforeMetrics: string;
  afterMetrics: string;
}

export interface BlogPost {
  id: string;
  slug?: string;
  altText?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featuredImage?: string;
  comments?: BlogComment[];
}
