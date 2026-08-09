import React from 'react';
import { trustInfo, leadershipTeam } from '../data/mockData';
import { KarnatakaMap } from '../components/KarnatakaMap';
import {
  Building2,
  Eye,
  Target,
  Shield,
  BadgeCheck,
  Lightbulb,
  Users,
  Leaf,
  Scale,
  Award,
  CheckCircle,
  Linkedin,
  Mail,
  ChevronRight
} from 'lucide-react';

interface AboutViewProps {
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab, onOpenCsrModal }) => {
  const milestones = [
    { year: '2021', title: 'Trust Established', desc: 'Raita Mitra Social Trust registered in Hubballi, Karnataka to serve smallholder farming communities.' },
    { year: '2022', title: 'Agri & SHG Initiatives', desc: 'Mobilized 50+ Women SHGs and conducted first soil testing camps across 12 villages.' },
    { year: '2023', title: 'CSR-1 & 80G Approval', desc: 'Achieved MCA CSR-1 registration (CSR00059487) and Section 80G tax exemption status.' },
    { year: '2024', title: 'AI Skills & Digital Labs', desc: 'Launched rural digital and AI skills bootcamps for 3,000+ rural youth in Dharwad & Belagavi.' },
    { year: '2025-26', title: 'District Expansion', desc: 'Scaled interventions to 12+ districts reaching over 5,000 farmers and 1,500 micro-entrepreneurs.' }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Building2 className="w-3.5 h-3.5" />
            Hubballi, Karnataka • Reg. No. 2021
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            About Us & Governance
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Rooted in Karnataka, committed to empowering farmers, strengthening rural communities, and nurturing sustainable futures through capability building and financial transparency.
          </p>
        </div>
      </section>

      {/* Our Story & Capability Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block">
            Our Development Philosophy
          </span>
          <h2 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Transforming Dependency Into Self-Reliant Dignity
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Established in 2021 and headquartered in Hubballi, Karnataka, Raita Mitra Social Trust (R) was founded on the fundamental principle that sustainable change must originate from grassroots capability building.
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Inspired by Amartya Sen's <em>Capability Approach</em>, we do not view rural communities as passive beneficiaries of charity, but as active agents of economic transformation. When a farmer understands soil nutrient science, or when a woman runs an SHG micro-enterprise, entire families achieve lasting economic resilience.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-50 dark:bg-slate-800 p-4 rounded-xl border border-emerald-100 dark:border-slate-700">
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 block mb-1">NITI Aayog NGO Darpan</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{trustInfo.ngoDarpanId}</span>
            </div>
            <div className="bg-amber-50 dark:bg-slate-800 p-4 rounded-xl border border-amber-100 dark:border-slate-700">
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 block mb-1">MCA CSR-1 Registered</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{trustInfo.csrRegNo}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <img
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"
              alt="Farmer in Karnataka"
              className="w-full h-80 object-cover"
            />
            <div className="p-4 bg-slate-900 text-white text-xs">
              <p className="font-bold text-amber-400 mb-1">Grassroots Farmer Training</p>
              <p className="text-slate-300">Dr. Ramesh Patil demonstrating soil acidity testing in Navalgund village.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Side by Side Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl border border-emerald-800 space-y-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-serif">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            To create resilient, self-reliant rural communities across Karnataka where every farming family, woman, and youth possesses access to scientific knowledge, digital opportunities, economic dignity, and sustainable livelihoods.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center border border-emerald-500/30">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-serif">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            To empower 50,000+ rural households by 2030 through sustainable agriculture, soil conservation, women self-help group entrepreneurship, digital & AI skill training, and verified CSR partner collaborations.
          </p>
        </div>
      </section>

      {/* Core Values 6 Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Governance Principles
          </span>
          <h2 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Shield, title: "Integrity", desc: "Honesty and ethical conduct in all actions." },
            { icon: BadgeCheck, title: "Transparency", desc: "Auditable financial and quarterly reporting." },
            { icon: Lightbulb, title: "Innovation", desc: "Applying digital & AI tools for rural uplift." },
            { icon: Users, title: "Inclusiveness", desc: "Equal access for women, youth & marginal farmers." },
            { icon: Leaf, title: "Sustainability", desc: "Long-term ecological & economic resilience." },
            { icon: Scale, title: "Accountability", desc: "Responsible stewardship of donor resources." }
          ].map((v, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow text-center space-y-2">
              <v.icon className="w-6 h-6 text-emerald-700 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones & Journey Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-emerald-900 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-8 text-center">
            Organizational Growth Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 inline-block">
                  {m.year}
                </span>
                <h4 className="text-sm font-bold font-serif text-white">{m.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Leadership
          </span>
          <h2 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Board of Trustees & Leadership Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadershipTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg p-6 text-center space-y-4"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/30"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">{member.name}</h3>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mt-0.5">{member.title}</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {member.bio}
              </p>
              <div className="pt-2 flex justify-center gap-3 text-slate-400">
                <a href={member.linkedin} className="hover:text-emerald-600">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={`mailto:${member.email}`} className="hover:text-emerald-600">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Governance & Org Hierarchy Structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 text-center space-y-6">
          <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Organizational Governance Structure
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-3 bg-emerald-900 text-white font-bold text-sm rounded-xl max-w-sm mx-auto shadow">
              Board of Trustees
            </div>
            <div className="h-4 w-0.5 bg-emerald-400 mx-auto"></div>
            <div className="p-3 bg-emerald-800 text-white font-semibold text-xs rounded-xl max-w-md mx-auto shadow">
              Advisory Committee (Agri Scientists, Legal & CSR Experts)
            </div>
            <div className="h-4 w-0.5 bg-emerald-400 mx-auto"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow text-slate-800 dark:text-slate-200">
                Programs Team
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow text-slate-800 dark:text-slate-200">
                Finance & Audit
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow text-slate-800 dark:text-slate-200">
                M&E & Field Analytics
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow text-slate-800 dark:text-slate-200">
                Volunteer Network
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
