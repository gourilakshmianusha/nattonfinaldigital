import React, { useState } from 'react';
import { trustInfo } from '../data/mockData';
import {
  Users,
  Award,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

export const VolunteerView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Hubballi',
    occupation: 'Student / Graduate',
    skills: 'Teaching, Digital Tools',
    availability: 'Weekends',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <HeartHandshake className="w-3.5 h-3.5" /> Become A Changemaker
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Volunteer With Raita Mitra Social Trust
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Contribute your time, technical skills, teaching passion, or medical expertise to create sustainable impact across Karnataka's rural communities.
          </p>
        </div>
      </section>

      {/* Volunteer Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Ways You Can Contribute
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Field Operations Volunteer", desc: "Assist with soil testing camps, tree plantation, and seed distribution in Dharwad villages.", icon: Users },
            { title: "AI & Digital Skills Trainer", desc: "Teach computer basics and AI tool usage to rural school students in weekend bootcamps.", icon: GraduationCap },
            { title: "Corporate Team Engagement", desc: "Engage employee teams in structured community service and ESG volunteer days.", icon: HeartHandshake },
            { title: "Medical & Health Camp Expert", desc: "Doctors, nurses, and eye check specialists offering volunteer consultation during health camps.", icon: Award },
            { title: "Content & Communications", desc: "Help photograph field activities, write impact blog posts, and manage social media.", icon: Sparkles },
            { title: "Women SHG Mentor", desc: "Mentor rural women entrepreneurs in food packaging, local marketing, and bookkeeping.", icon: CheckCircle2 }
          ].map((cat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow hover:shadow-xl transition-all space-y-3">
              <cat.icon className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif">{cat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form & Gamified Recognition */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10">
          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6 text-center">
            Volunteer Application Form
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Application Received!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for applying to volunteer with {trustInfo.name}. Our Volunteer Coordinator will contact you via WhatsApp or email to schedule your orientation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current City / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Hubballi, Dharwad, Belagavi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skills & Key Expertise</label>
                <input
                  type="text"
                  placeholder="e.g. Soil Science, Computer Teaching, Graphic Design, Medical Nursing"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" /> Submit Application
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
