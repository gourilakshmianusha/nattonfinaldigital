import React, { useState } from 'react';
import { trustInfo } from '../data/mockData';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-6 sm:px-12 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <MapPin className="w-3.5 h-3.5" /> Hubballi Headquarters & Field Desks
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
          Contact Us & Helpline Desk
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connect with Raita Mitra Social Trust (R) for CSR partnerships, donor receipts, volunteering, or field visits across Karnataka.
        </p>
      </section>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-2">
          <MapPin className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-xs uppercase text-slate-400">Headquarters Address</h3>
          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">{trustInfo.address}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-2">
          <Phone className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-xs uppercase text-slate-400">Phone Support</h3>
          <a href={`tel:${trustInfo.phone}`} className="text-sm font-bold text-emerald-800 dark:text-emerald-400 font-mono block">
            {trustInfo.phone}
          </a>
          <span className="text-[10px] text-slate-500">Mon - Sat | 10:00 AM - 06:00 PM</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-2">
          <Mail className="w-6 h-6 text-emerald-700" />
          <h3 className="font-bold text-xs uppercase text-slate-400">Official Email</h3>
          <a href={`mailto:${trustInfo.email}`} className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block">
            {trustInfo.email}
          </a>
          <span className="text-[10px] text-slate-500">Fast 24-hr email response</span>
        </div>

        <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-900 shadow space-y-2 flex flex-col justify-between">
          <div>
            <MessageCircle className="w-6 h-6 text-amber-400 mb-1" />
            <h3 className="font-bold text-xs uppercase text-amber-300">Instant WhatsApp Support</h3>
            <p className="text-[11px] text-slate-300 mt-1">Connect directly with our field assistance team.</p>
          </div>
          <a
            href="https://wa.me/917676376221"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow transition-all block mt-2"
          >
            Chat On WhatsApp
          </a>
        </div>
      </div>

      {/* Form & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Send Us a Message</h2>

          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h3 className="text-xl font-bold font-serif">Message Received!</h3>
              <p className="text-xs text-slate-600">Our Hubballi team will get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="CSR Partnership">CSR & Corporate Partnership</option>
                  <option value="80G Receipt Query">80G Tax Receipt Support</option>
                  <option value="Volunteering">Volunteering Opportunity</option>
                </select>
              </div>

              <textarea
                rows={4}
                required
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Map & Office Info */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl border border-emerald-900 shadow-xl space-y-6">
          <h3 className="text-xl font-bold font-serif">Hubballi Location</h3>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-800 flex items-center justify-center text-center p-4">
            <div>
              <MapPin className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
              <p className="font-bold text-xs text-white">Pride Icon, Gokul Road, Hubballi</p>
              <p className="text-[11px] text-slate-400 mt-1">580030, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
