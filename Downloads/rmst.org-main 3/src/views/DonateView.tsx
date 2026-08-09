import React, { useState } from 'react';
import { trustInfo } from '../data/mockData';
import {
  Heart,
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

export const DonateView: React.FC = () => {
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [donorName, setPanName] = useState('');
  const [donorPan, setPan] = useState('');
  const [donorEmail, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const currentAmount = customAmount ? Number(customAmount) : amount;
  const estimatedTaxSaving = Math.round(currentAmount * 0.25); // ~50% deduction at 50% slab/bracket

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            50% Tax Exemption Under Section 80G
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Donate & Support Sustainable Futures
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your voluntary contribution directly funds soil health testing, high-yield organic farming, rural AI digital labs, and women self-help group micro-enterprises in Karnataka.
          </p>
        </div>
      </section>

      {/* Main Donation Funnel */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                  Thank You for Your Contribution!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your donation of <span className="font-bold text-emerald-800 dark:text-emerald-400 font-mono">₹{currentAmount.toLocaleString('en-IN')}</span> to {trustInfo.name} has been processed successfully. An 80G tax receipt has been generated and sent to {donorEmail || 'your email'}.
                </p>

                {/* Instant Receipt Card Preview */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span>80G Tax Receipt Preview</span>
                    <span className="text-emerald-700">URN: {trustInfo.tax80gUrn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Donor Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{donorName || 'Valued Donor'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Donor PAN:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{donorPan || 'ABCDE1234F'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-emerald-700">₹{currentAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>80G Tax Exemption:</span>
                    <span>50% Deduction Eligible</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Official 80G Receipt PDF downloaded."); }}
                    className="px-4 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download 80G Receipt PDF
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    Donate Again
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-6">
                {/* One-time vs Monthly Toggle */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      frequency === 'one-time'
                        ? 'bg-emerald-900 text-white shadow'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    One-Time Giving
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      frequency === 'monthly'
                        ? 'bg-emerald-900 text-white shadow'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Monthly Sustainer
                  </button>
                </div>

                {/* Preset Amount Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Select Contribution Amount (INR)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setAmount(amt); setCustomAmount(''); }}
                        className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                          amount === amt && !customAmount
                            ? 'bg-emerald-950 text-amber-300 border-amber-500 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder="Or Enter Custom Amount in ₹"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Direct Impact Calculation */}
                <div className="p-4 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                    <span>Direct Tangible Impact of ₹{currentAmount.toLocaleString('en-IN')}:</span>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">100% Transparency</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {currentAmount >= 10000
                      ? "Provides full soil testing kits, seed supplies, and micro-grant support for 2 Women Self-Help Groups."
                      : currentAmount >= 5000
                      ? "Sponsors 1 rural youth for the 3-month AI & Digital Skills Bootcamp including lab access."
                      : currentAmount >= 2500
                      ? "Provides soil health testing cards and bio-fertilizer kits for 3 smallholder farming families."
                      : "Provides basic soil testing inputs and maternal health kits for rural hamlets."}
                  </p>
                </div>

                {/* Donor Details for 80G Tax Receipt */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    80G Tax Receipt Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name (As per PAN)"
                      value={donorName}
                      onChange={(e) => setPanName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PAN Number (Mandatory for 80G)"
                      value={donorPan}
                      onChange={(e) => setPan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <input
                    type="email"
                    required
                    placeholder="Email Address (To receive digital receipt)"
                    value={donorEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Payment Gateway Choice
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === 'upi'
                          ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-600 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-700" />
                      <span>BHIM / UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-600 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span>Debit / Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === 'netbanking'
                          ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-600 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Lock className="w-5 h-5 text-blue-600" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-extrabold text-sm rounded-xl hover:from-emerald-900 hover:to-black shadow-xl flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <span>Proceed to Pay ₹{currentAmount.toLocaleString('en-IN')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Verified Tax Exemption
              </div>

              <h3 className="text-xl font-bold font-serif">Estimated 80G Tax Savings</h3>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Tax Saved (~30% Tax Slab)</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono block">
                  ₹{estimatedTaxSaving.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-300 block">50% Deduction under Sec 80G</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Instant digital 80G receipt issued immediately.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Quarterly email reports showing field utilization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Secure 256-bit SSL encrypted payment processing.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white">{trustInfo.name}</p>
              <p>Pan: {trustInfo.pan} • 80G URN: {trustInfo.tax80gUrn}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
