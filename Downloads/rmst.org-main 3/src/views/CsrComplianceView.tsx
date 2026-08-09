import React, { useState } from 'react';
import { trustInfo, csrDocuments } from '../data/mockData';
import {
  ShieldCheck,
  Award,
  Lock,
  Download,
  FileText,
  FileCheck,
  Building2,
  Handshake,
  CheckCircle2,
  BarChart3,
  Scale,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface CsrComplianceViewProps {
  onOpenCsrModal: () => void;
}

export const CsrComplianceView: React.FC<CsrComplianceViewProps> = ({ onOpenCsrModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Registration', 'Tax & Exemptions', 'Audits & Financials', 'Annual Reports', 'Governance Policies'];

  const filteredDocs = selectedCategory === 'All'
    ? csrDocuments
    : csrDocuments.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Corporate Governance & ESG Compliance Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            CSR & Financial Compliance Repository
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Providing corporate CSR committees, auditors, and institutional foundations with verified registrations, auditable financial statements, and 80G tax exemptions.
          </p>
        </div>
      </section>

      {/* Quick Verified Registration Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">NGO Darpan Unique ID</div>
            <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 font-mono mt-1">{trustInfo.ngoDarpanId}</div>
            <span className="inline-block text-[9px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded mt-2">Verified Active</span>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-100 dark:border-slate-700">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">MCA CSR-1 Registration</div>
            <div className="text-sm font-extrabold text-amber-900 dark:text-amber-300 font-mono mt-1">{trustInfo.csrRegNo}</div>
            <span className="inline-block text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded mt-2">Approved MCA</span>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">Section 80G Tax URN</div>
            <div className="text-sm font-extrabold text-blue-900 dark:text-blue-300 font-mono mt-1">{trustInfo.tax80gUrn}</div>
            <span className="inline-block text-[9px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded mt-2">50% Tax Exempt</span>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-slate-800/80 rounded-2xl border border-purple-100 dark:border-slate-700">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">Section 12A Registration</div>
            <div className="text-sm font-extrabold text-purple-900 dark:text-purple-300 font-mono mt-1">{trustInfo.tax12aReg}</div>
            <span className="inline-block text-[9px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded mt-2">IT Approved</span>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Permanent Account No</div>
              <div className="text-sm font-extrabold font-mono text-amber-400 mt-1">{trustInfo.pan}</div>
            </div>
            <button
              onClick={onOpenCsrModal}
              className="mt-2 w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <Handshake className="w-3.5 h-3.5 text-amber-300" /> CSR Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* Document Repository Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Compliance Document Repository
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Audited balance sheets, registration certificates, IT returns, and governance policies.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex overflow-x-auto gap-2 max-w-full pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-white shadow'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {doc.year}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {doc.fileType} • {doc.fileSize}
                </span>

                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`Downloading ${doc.title}`); }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-800 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fund Utilization & M&E Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fund Ratio Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-emerald-900 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            Financial Efficiency
          </div>

          <h3 className="text-2xl font-bold font-serif">Fund Utilization Ratio</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Grassroot Program Implementation</span>
                <span className="text-emerald-400 font-mono">88%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Administrative & Audit Expenses</span>
                <span className="text-amber-400 font-mono">12%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2">
            88% of every rupee contributed goes directly toward purchasing soil testing kits, high-yield seeds, digital lab hardware, and medical supplies for rural Karnataka hamlets.
          </p>
        </div>

        {/* M&E Framework Flow */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Monitoring & Evaluation
          </div>

          <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">5-Step M&E Framework</h3>

          <div className="space-y-2 text-xs">
            {[
              { step: "1. Baseline Assessment", desc: "Detailed socio-economic survey of target village households." },
              { step: "2. Field Execution", desc: "Direct seed distribution, soil testing & SHG training." },
              { step: "3. Geo-Tagged Field Proof", desc: "Photographic & GPS evidence logged for each activity." },
              { step: "4. Quarterly Audit", desc: "Independent CA review & financial utilization certificate." },
              { step: "5. Impact Reporting", desc: "Customized ESG report shared with Corporate CSR partner." }
            ].map((m, i) => (
              <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{m.step}</span>
                  <span className="text-slate-500 dark:text-slate-400">{m.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
