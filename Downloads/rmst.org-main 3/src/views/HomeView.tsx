import React from 'react';
import { trustInfo, impactMetrics, focusAreas, transformationStories, blogPosts, upcomingEvents } from '../data/mockData';
import { KarnatakaMap } from '../components/KarnatakaMap';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import {
  Wheat,
  GraduationCap,
  Briefcase,
  MapPin,
  ShieldCheck,
  Award,
  Lock,
  ArrowRight,
  Handshake,
  Heart,
  Download,
  Sprout,
  Users,
  Laptop,
  HeartPulse,
  Trees,
  Store,
  Building2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenCsrModal }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000"
            alt="Karnataka Agricultural Fields"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Registered Karnataka Non-Profit Trust • Established 2021
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight">
            Where Grassroots Action Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-emerald-400">Sustainable Impact</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
            Empowering Farmers, Strengthening Rural Communities, and Nurturing Sustainable Futures Across Karnataka through Soil Science, Women SHGs, Rural AI Skills, and Climate Resilience.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenCsrModal}
              className="px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Handshake className="w-5 h-5 text-slate-950" />
              <span>Partner With Us (CSR)</span>
            </button>

            <button
              onClick={() => { setActiveTab('donate'); window.scrollTo({ top: 0 }); }}
              className="px-6 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl transition-all border border-emerald-600 flex items-center gap-2"
            >
              <Heart className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Donate Now (80G Tax Exemption)</span>
            </button>

            <button
              onClick={onOpenCsrModal}
              className="px-5 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download CSR Brochure</span>
            </button>
          </div>

          {/* Floating Trust Credentials Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono uppercase text-slate-400">NGO Darpan Unique ID</p>
              <p className="text-xs font-bold text-emerald-300 font-mono mt-0.5">{trustInfo.ngoDarpanId}</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono uppercase text-slate-400">MCA CSR-1 Registration</p>
              <p className="text-xs font-bold text-amber-300 font-mono mt-0.5">{trustInfo.csrRegNo}</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono uppercase text-slate-400">80G Tax Exemption URN</p>
              <p className="text-xs font-bold text-emerald-300 font-mono mt-0.5">{trustInfo.tax80gUrn}</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono uppercase text-slate-400">Headquarters</p>
              <p className="text-xs font-bold text-white mt-0.5">Hubballi, Karnataka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Dashboard Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Measurable Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Creating Measurable Change Across Karnataka
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {m.id === 'farmers' && <Wheat className="w-6 h-6" />}
                {m.id === 'youth' && <GraduationCap className="w-6 h-6" />}
                {m.id === 'livelihoods' && <Briefcase className="w-6 h-6" />}
                {m.id === 'districts' && <MapPin className="w-6 h-6" />}
              </div>
              <div className="text-4xl font-extrabold font-serif text-slate-900 dark:text-white mb-2">
                {m.count}
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-400 mb-1">
                {m.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Building2 className="w-3.5 h-3.5" />
              Established 2021 in Hubballi, KA
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
              Building Sustainable & Capable Rural Ecosystems
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Inspired by Amartya Sen's Capability Approach, Raita Mitra Social Trust (R) believes true development is about expanding human agency. We work at the grassroots in Dharwad, Belagavi, Bagalkot, Gadag, Haveri, and neighboring districts to turn economic dependency into self-reliant dignity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified 80G Tax Exemption</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Quarterly CSR Impact Audits</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>150+ Women SHGs Mobilized</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>12+ Karnataka Districts Covered</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0 }); }}
                className="px-5 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 flex items-center gap-2 shadow"
              >
                <span>Read Full Organization Story</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Women Entrepreneurs & Farmers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">Grassroot Empowerment</span>
                Laxmidevi Hubballi & Women SHG members processing local spices.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Focus Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Integrated Interventions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Our Six Core Focus Areas
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            A multi-dimensional approach targeting agriculture, female self-reliance, youth technology skills, healthcare, climate resilience, and enterprise growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((fa) => (
            <div
              key={fa.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fa.bannerImage}
                  alt={fa.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-white p-2 rounded-xl text-xs font-bold shadow-md">
                  {fa.id === 'agri' && <Sprout className="w-5 h-5 text-amber-300" />}
                  {fa.id === 'women' && <Users className="w-5 h-5 text-amber-300" />}
                  {fa.id === 'education' && <Laptop className="w-5 h-5 text-amber-300" />}
                  {fa.id === 'health' && <HeartPulse className="w-5 h-5 text-amber-300" />}
                  {fa.id === 'climate' && <Trees className="w-5 h-5 text-amber-300" />}
                  {fa.id === 'livelihood' && <Store className="w-5 h-5 text-amber-300" />}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                    {fa.beneficiariesCount}
                  </span>
                  <h3 className="text-base font-bold font-serif leading-snug line-clamp-1">
                    {fa.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {fa.description}
                </p>

                {/* SDG Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {fa.sdgs.map((sdg, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-100 dark:border-emerald-900"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => { setActiveTab('programs'); window.scrollTo({ top: 0 }); }}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-800 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-between group-hover:bg-emerald-900 group-hover:text-white"
                >
                  <span>Explore Program Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Karnataka SVG Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Regional Operations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Operational Presence Across Karnataka
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Click any district below to explore active farmer training hubs, women SHGs, and digital bootcamps.
          </p>
        </div>

        <KarnatakaMap />
      </section>

      {/* Transformation Story Before-After */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Tangible Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Transformation Stories from the Field
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div>
            <BeforeAfterSlider
              title={transformationStories[0].title}
              beforeImage={transformationStories[0].beforeImage}
              afterImage={transformationStories[0].afterImage}
              beforeLabel="Before (Chemical Farming & Debt)"
              afterLabel="Transformed (Soil Testing & organic yield)"
            />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Featured Case Study • {transformationStories[0].village}, {transformationStories[0].district}
            </div>

            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white leading-snug">
              {transformationStories[0].title}
            </h3>

            <blockquote className="italic text-sm text-slate-700 dark:text-slate-300 border-l-4 border-emerald-600 pl-4 py-1">
              "{transformationStories[0].quote}"
            </blockquote>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {transformationStories[0].metrics.map((m, idx) => (
                <div key={idx} className="bg-emerald-50 dark:bg-slate-800 p-3 rounded-xl text-center">
                  <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-400 block">{m.value}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{m.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setActiveTab('impact'); window.scrollTo({ top: 0 }); }}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-2"
            >
              <span>View More Impact Stories</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* CSR Dedicated Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-emerald-900 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Corporate CSR & ESG Trustees
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
              Partner with Us for Auditable, High-Impact CSR Projects
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We provide complete financial transparency, MCA CSR-1 compliance, 80G tax receipts, quarterly utilization certificates, and third-party impact assessment documentation.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onOpenCsrModal}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                <span>Submit CSR Partnership Inquiry</span>
              </button>

              <button
                onClick={() => { setActiveTab('csr-compliance'); window.scrollTo({ top: 0 }); }}
                className="px-6 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl border border-emerald-700 flex items-center gap-2"
              >
                <span>Explore CSR Compliance Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Latest Field Insights & Articles
            </h3>
            <button
              onClick={() => { setActiveTab('blog'); window.scrollTo({ top: 0 }); }}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                onClick={() => { setActiveTab('blog'); window.scrollTo({ top: 0 }); }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">{post.date} • {post.readTime}</div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif line-clamp-2 group-hover:text-emerald-700">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Upcoming Events
            </h3>
            <button
              onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0 }); }}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Calendar
            </button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0 }); }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow hover:border-emerald-500 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {evt.date}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                    {evt.district}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-serif line-clamp-1">
                  {evt.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{evt.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
