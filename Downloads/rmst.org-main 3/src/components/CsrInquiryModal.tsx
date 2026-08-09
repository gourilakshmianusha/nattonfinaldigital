import React, { useState } from 'react';
import { trustInfo } from '../data/mockData';
import { X, CheckCircle2, ShieldCheck, Download, Send, Building2, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

interface CsrInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsrInquiryModal: React.FC<CsrInquiryModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    focusArea: 'Sustainable Agriculture',
    budget: '₹5 Lakhs - ₹20 Lakhs',
    state: 'Karnataka',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 dark:border-slate-800 shadow-2xl relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-emerald-950 text-white p-6 rounded-t-2xl flex justify-between items-start z-10 border-b border-emerald-900">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              MCA CSR-1 Registered • 80G Tax Exempt
            </div>
            <h3 className="text-xl font-bold font-serif">Corporate CSR Partnership Inquiry</h3>
            <p className="text-xs text-emerald-200 mt-1">
              Connect with {trustInfo.name} for measurable ESG & CSR impact projects.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">Inquiry Submitted Successfully!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for your interest in partnering with {trustInfo.name}. Our Corporate Partnership Team will contact you within 24 business hours with project proposals and compliance documentation.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <a
                  href="#"
                  className="px-4 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center gap-2"
                  onClick={(e) => { e.preventDefault(); alert("CSR Brochure PDF download started."); }}
                >
                  <Download className="w-4 h-4" /> Download Official CSR Brochure
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Corporate Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Infosys Foundation / Tata Steel CSR"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred CSR Focus Area
                  </label>
                  <select
                    value={formData.focusArea}
                    onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Sustainable Agriculture">Sustainable Agriculture & Farmer Support</option>
                    <option value="Women Empowerment">Women Empowerment & Micro-Enterprises</option>
                    <option value="AI & Digital Skills">Rural AI & Digital Skill Development</option>
                    <option value="Health & Nutrition">Health, Nutrition & Water Sanitation</option>
                    <option value="Climate Action">Environment & Tree Plantation</option>
                    <option value="Integrated Model">Holistic Integrated Rural Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated CSR Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                    <option value="₹5 Lakhs - ₹20 Lakhs">₹5 Lakhs - ₹20 Lakhs</option>
                    <option value="₹20 Lakhs - ₹50 Lakhs">₹20 Lakhs - ₹50 Lakhs</option>
                    <option value="Above ₹50 Lakhs">Above ₹50 Lakhs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Requirements / Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your organization's CSR objectives, target geography, or reporting expectations..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              {/* Trust Callout */}
              <div className="bg-emerald-50 dark:bg-slate-800 p-3 rounded-xl border border-emerald-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Auditable Verification:</span> We provide quarterly utilization certificates, third-party impact evaluation reports, and 80G tax exemption receipts for all corporate sponsors.
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-extrabold text-xs rounded-xl hover:from-emerald-900 hover:to-black shadow-lg flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Submit Partnership Inquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
