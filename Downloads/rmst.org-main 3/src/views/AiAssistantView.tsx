import React, { useState } from 'react';
import { trustInfo, focusAreas, faqsList } from '../data/mockData';
import { ChatMessage } from '../types';
import { Bot, Send, User, Sparkles, BookOpen, ShieldCheck, Heart, Users, RefreshCw } from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaskara! I am **Mitra AI**, the 24x7 Knowledge Copilot for **${trustInfo.name}**.\n\nI can assist you with:\n- **CSR & ESG Compliance** (NGO Darpan: ${trustInfo.ngoDarpanId}, MCA CSR-1: ${trustInfo.csrRegNo})\n- **80G Tax Exemptions** & Digital Receipts\n- **Our 6 Core Programs** (Agriculture, Women SHGs, AI Skills, Health, Climate)\n- **Volunteering & Event Schedule** in Hubballi, Dharwad & Belagavi\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "How do I claim 80G tax exemption for my donation?",
        "What are Raita Mitra's CSR registrations?",
        "Explain the Sustainable Agriculture program",
        "How can my company partner for CSR?"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    // Call server endpoint or fallback to local knowledge engine
    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("80g") || lower.includes("tax") || lower.includes("receipt")) {
        replyText = `**80G Tax Exemption Details:**\n\nAll monetary contributions to **${trustInfo.name}** qualify for **50% tax deduction** under Section 80G of the Income Tax Act 1961.\n\n- **80G Unique Reg No (URN):** \`${trustInfo.tax80gUrn}\`\n- **12A Registration:** \`${trustInfo.tax12aReg}\`\n- **PAN:** \`${trustInfo.pan}\`\n\nDonors receive an instant 80G PDF receipt containing URN and transaction details right after donating on our website.`;
      } else if (lower.includes("csr") || lower.includes("darpan") || lower.includes("mca") || lower.includes("partner")) {
        replyText = `**Corporate CSR & Compliance Credentials:**\n\n**${trustInfo.name}** is fully eligible to receive Corporate Social Responsibility funds:\n\n- **NITI Aayog NGO Darpan ID:** \`${trustInfo.ngoDarpanId}\`\n- **MCA CSR-1 Registration No:** \`${trustInfo.csrRegNo}\`\n\nWe provide quarterly utilization certificates, third-party impact assessment reports, geo-tagged field photos, and customized ESG alignment metrics for corporate partners. Click "Partner With Us" to submit an inquiry!`;
      } else if (lower.includes("agri") || lower.includes("farmer") || lower.includes("soil")) {
        replyText = `**Sustainable Agriculture & Farmer Empowerment:**\n\nOur flagship program supports over 5,000 farmers in Dharwad, Belagavi, Bagalkot, and Haveri with:\n- Scientific Soil Testing & Nutrient Cards\n- Organic Input Kits & Bio-Fertilizer Production\n- Drip Irrigation Promotion & Rainwater Recharge Pits\n- Farmer Producer Organization (FPO) Direct Market Access.`;
      } else if (lower.includes("ai") || lower.includes("digital") || lower.includes("skill") || lower.includes("student")) {
        replyText = `**Education, Digital & AI Skills Program:**\n\nWe bridge the digital divide for rural youth through 3-month bootcamps teaching:\n- Basic Computer & Internet Research Operations\n- Office Software & Document Processing\n- Foundational AI Prompt Usage & Digital Literacy\n\nOver 3,000 students across 45+ rural Karnataka schools have been trained.`;
      } else if (lower.includes("contact") || lower.includes("office") || lower.includes("hubballi") || lower.includes("address")) {
        replyText = `**Headquarters & Contact Details:**\n\n**${trustInfo.name}**\n- **Address:** ${trustInfo.address}\n- **Phone:** ${trustInfo.phone}\n- **Email:** ${trustInfo.email}\n- **Working Hours:** Monday - Saturday | 10:00 AM - 06:00 PM`;
      } else {
        replyText = `Thank you for asking! **${trustInfo.name}** is a registered Karnataka non-profit (NGO Darpan: ${trustInfo.ngoDarpanId}, MCA CSR-1: ${trustInfo.csrRegNo}) empowering farmers, women SHGs, and rural youth across 12+ districts.\n\nYou can explore our 6 Core Programs, download audited Annual Reports, or submit a CSR inquiry directly through our portal.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          "How do I claim 80G tax exemption?",
          "Show MCA CSR-1 registration info",
          "Where is the Hubballi office located?"
        ]
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-emerald-900 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900 text-amber-400 rounded-2xl border border-emerald-700">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif">Mitra AI Knowledge Copilot</h1>
            <p className="text-xs text-slate-300">24x7 Digital Relationship Manager for Donors, CSR Heads & Volunteers</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1"
          title="Reset Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Chat Messages Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 min-h-[450px] max-h-[550px] overflow-y-auto flex flex-col gap-4">
        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                isAssistant ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  isAssistant
                    ? 'bg-emerald-900 text-amber-300 font-bold'
                    : 'bg-amber-500 text-slate-950 font-bold'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-800 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {m.suggestedQuestions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedQuestions.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sq)}
                        className="px-2.5 py-1 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 border border-emerald-200 dark:border-slate-700 text-emerald-900 dark:text-emerald-300 text-[11px] font-medium rounded-lg"
                      >
                        💡 {sq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="self-start flex gap-2 items-center text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
            <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Mitra AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Type your question about 80G tax exemption, CSR-1, programs, or volunteering..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow flex items-center gap-1.5"
        >
          <Send className="w-4 h-4 text-amber-300" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
