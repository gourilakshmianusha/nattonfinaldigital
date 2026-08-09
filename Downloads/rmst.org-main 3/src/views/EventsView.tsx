import React, { useState } from 'react';
import { upcomingEvents } from '../data/mockData';
import { Calendar, MapPin, Clock, Users, CheckCircle2, Send, Download } from 'lucide-react';

export const EventsView: React.FC = () => {
  const [registeringEvent, setRegisteringEvent] = useState<any | null>(null);
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    participants: 1
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Calendar className="w-3.5 h-3.5 text-amber-300" /> Community Learning & Action
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Events, Workshops & Summits
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join our farmer capacity building workshops, AI literacy bootcamps, women SHG expos, and environmental awareness drives across Karnataka.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
          Upcoming Flagship Gatherings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                    {evt.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow">
                    {evt.seatsLeft} Seats Left
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {evt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evt.time}</span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => { setRegisteringEvent(evt); setRegistered(false); }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Register Free Spot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            {registered ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <h3 className="text-xl font-bold font-serif">Registration Confirmed!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your seat for <strong>{registeringEvent.title}</strong> on {registeringEvent.date} has been confirmed. Confirmation sent to {formData.email}.
                </p>
                <button
                  onClick={() => setRegisteringEvent(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h3 className="text-lg font-bold font-serif">Register for {registeringEvent.title}</h3>
                <p className="text-xs text-slate-500">{registeringEvent.date} • {registeringEvent.venue}</p>

                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />

                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
