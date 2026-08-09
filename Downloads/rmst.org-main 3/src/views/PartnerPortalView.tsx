import React, { useState } from 'react';
import { trustInfo, csrDocuments } from '../data/mockData';
import { KarnatakaMap } from '../components/KarnatakaMap';
import {
  Building2,
  BarChart3,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  Users,
  Bot,
  ShieldCheck,
  Video,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PartnerPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'documents' | 'copilot' | 'meetings'>('dashboard');
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotPrompt) return;
    setCopilotResponse(
      `[AI CSR Copilot Response]: Based on Raita Mitra Social Trust's FY 2024-25 data in Dharwad and Belagavi, your CSR contribution of ₹15 Lakhs aligns with SDG 1 (No Poverty), SDG 2 (Zero Hunger), and SDG 8 (Decent Work). Total verified direct beneficiaries: 1,250 farmers and 350 rural youth. Utilization Certificate and geo-tagged project evidence available under Documents.`
    );
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Building2 className="w-3.5 h-3.5" /> Enterprise CSR & Institutional Partner Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Collaborate. Measure. Transform.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            A unified platform for Corporate CSR Committees, ESG Foundations, and Development Agencies to monitor project milestones, review fund utilization, and track community impact.
          </p>
        </div>
      </section>

      {/* Main Portal Workspace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {[
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
            { id: 'projects', label: 'Project Milestones', icon: CheckCircle2 },
            { id: 'documents', label: 'Compliance Repository', icon: FileText },
            { id: 'copilot', label: 'AI CSR Copilot', icon: Bot, badge: 'AI' },
            { id: 'meetings', label: 'Schedule Review Meeting', icon: Calendar }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-900 text-white shadow'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-slate-950 font-extrabold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-500">Active CSR Projects</span>
                <span className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white block mt-1">4 Active</span>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">Dharwad & Belagavi Clusters</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-500">Beneficiaries Reached</span>
                <span className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white block mt-1">5,000+</span>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">Farmers & Rural Youth</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-500">Fund Utilization</span>
                <span className="text-3xl font-extrabold font-serif text-emerald-800 dark:text-emerald-400 block mt-1">92.4%</span>
                <span className="text-xs text-slate-500">Audited Utilization FY 24-25</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-500">Employee Volunteer Hours</span>
                <span className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white block mt-1">840 Hrs</span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Corporate Team Engagements</span>
              </div>
            </div>

            {/* GIS Map */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                GIS Field Project Coverage Map
              </h3>
              <KarnatakaMap />
            </div>
          </div>
        )}

        {/* Tab 2: Project Milestones */}
        {activeTab === 'projects' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Project Milestones & Deliverables
            </h3>

            <div className="space-y-4">
              {[
                { title: "Soil Testing & High-Yield Seed Distribution", location: "Navalgund, Dharwad", status: "Completed", percent: 100 },
                { title: "Rural AI & Digital Skills Lab Hardware Setup", location: "Hubballi & Kundgol", status: "In Progress", percent: 75 },
                { title: "Women SHG Spice Processing Equipment Grant", location: "Tarikoppa Village", status: "In Progress", percent: 60 },
                { title: "Rainwater Recharge Pits & Tree Plantation Drive", location: "Belagavi & Bagalkot", status: "Scheduled Q3", percent: 25 }
              ].map((m, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">{m.title}</h4>
                      <p className="text-xs text-slate-500">{m.location}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {m.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${m.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Documents */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              CSR Compliance & Utilization Certificates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {csrDocuments.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                    <span>{doc.category}</span>
                    <span>{doc.year}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{doc.title}</h4>
                  <button
                    onClick={() => alert(`Downloading ${doc.title}`)}
                    className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI CSR Copilot */}
        {activeTab === 'copilot' && (
          <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-emerald-900 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Bot className="w-4 h-4 text-amber-400" /> AI CSR Knowledge Copilot
            </div>

            <h3 className="text-2xl font-bold font-serif">Ask AI About Project Impact & Compliance</h3>

            <div className="flex flex-wrap gap-2">
              {["Explain CSR-1 Compliance", "Summarize FY 24-25 Fund Utilization", "Show SDG Mapping for Dharwad"].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setCopilotPrompt(prompt)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleCopilotSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about beneficiary numbers, 80G receipts, or district interventions..."
                value={copilotPrompt}
                onChange={(e) => setCopilotPrompt(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Ask Copilot
              </button>
            </form>

            {copilotResponse && (
              <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800 text-xs text-slate-200 leading-relaxed font-sans animate-fade-in">
                {copilotResponse}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Schedule Review Meeting */}
        {activeTab === 'meetings' && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Schedule A Quarterly CSR Review Meeting
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Select a convenient time for a virtual video conference with Dr. Ramesh Patil (Managing Trustee) and our CSR Compliance Directors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => alert("Meeting invite sent to your corporate email.")}
                className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 text-left hover:border-emerald-600"
              >
                <Video className="w-5 h-5 text-emerald-700 mb-2" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white font-serif">Quarterly Impact Review (30 Mins)</h4>
                <p className="text-[11px] text-slate-500">Discuss quarterly utilization reports & field photos.</p>
              </button>

              <button
                onClick={() => alert("Field visit request registered.")}
                className="p-4 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700 text-left hover:border-amber-600"
              >
                <Calendar className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white font-serif">Schedule Field Site Visit</h4>
                <p className="text-[11px] text-slate-500">Plan an in-person field visit to Dharwad or Belagavi.</p>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
