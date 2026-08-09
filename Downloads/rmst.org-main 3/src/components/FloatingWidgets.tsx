import React, { useState } from 'react';
import { trustInfo } from '../data/mockData';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  User,
  Sparkles,
  X,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface FloatingWidgetsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

  // Mitra AI Mini Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-mini',
      sender: 'assistant',
      text: `Namaskara! I am **Mitra AI**, 24x7 Assistant for **${trustInfo.name}**.\n\nAsk me anything about 80G tax receipts, CSR-1 registration, 6 Core Programs, or volunteering!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "80G Tax Exemption URN?",
        "MCA CSR-1 Registration?",
        "Hubballi Office Contact?"
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

    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("80g") || lower.includes("tax") || lower.includes("receipt") || lower.includes("urn")) {
        replyText = `**80G Tax Exemption:**\n- 80G URN: \`${trustInfo.tax80gUrn}\`\n- 12A Reg: \`${trustInfo.tax12aReg}\`\n- PAN: \`${trustInfo.pan}\`\n\nDonations get 50% tax deduction with instant PDF receipt!`;
      } else if (lower.includes("csr") || lower.includes("darpan") || lower.includes("mca") || lower.includes("partner")) {
        replyText = `**CSR Compliance Details:**\n- NGO Darpan ID: \`${trustInfo.ngoDarpanId}\`\n- MCA CSR-1 Reg: \`${trustInfo.csrRegNo}\`\n\nWe issue quarterly utilization & ESG impact certificates.`;
      } else if (lower.includes("agri") || lower.includes("farmer") || lower.includes("program")) {
        replyText = `**Core Programs:**\n1. Sustainable Agriculture & Soil Health\n2. Women Empowerment & SHGs\n3. AI & Digital Literacy Bootcamps\n4. Rural Healthcare & Clean Water\n5. Climate Resilience & Tree Plantation`;
      } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("office") || lower.includes("address")) {
        replyText = `**Headquarters Contact:**\n📍 ${trustInfo.address}\n📞 ${trustInfo.phone}\n✉️ ${trustInfo.email}`;
      } else {
        replyText = `Thank you for reaching out! **${trustInfo.name}** operates across 12+ districts in Karnataka.\n\nYou can click 'Full AI Copilot' to explore more detailed questions or submit a CSR inquiry.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 500);
  };

  const whatsappNumber = trustInfo.phone.replace(/[^0-9]/g, '');
  const createWhatsappUrl = (msg: string) =>
    `https://wa.me/${whatsappNumber || '917676376221'}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* ----------------- MITRA AI MINI CHAT POPOVER ----------------- */}
      {isAiOpen && (
        <div className="pointer-events-auto w-[330px] sm:w-[380px] h-[480px] bg-slate-900 border border-emerald-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-3.5 border-b border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-900 text-amber-300 rounded-xl border border-emerald-600/50 relative">
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-serif text-white">Mitra AI</h3>
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-900/80 text-amber-300 border border-emerald-700 rounded font-semibold">
                    24x7
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Raita Mitra Knowledge Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsAiOpen(false);
                  setActiveTab('ai-assistant');
                }}
                className="p-1.5 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition"
                title="Open Full Page AI Copilot"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-950/80">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 max-w-[90%] ${
                    isAssistant ? 'self-start' : 'self-end flex-row-reverse ml-auto'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] ${
                      isAssistant
                        ? 'bg-emerald-900 text-amber-300 font-bold'
                        : 'bg-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`p-3 rounded-2xl leading-relaxed text-xs ${
                        isAssistant
                          ? 'bg-slate-900 text-slate-100 border border-slate-800 shadow'
                          : 'bg-emerald-800 text-white shadow'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>

                    {m.suggestedQuestions && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {m.suggestedQuestions.map((sq, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sq)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-950 border border-emerald-800/80 text-emerald-300 text-[10px] font-medium rounded-md transition"
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
              <div className="flex gap-2 items-center text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit">
                <Bot className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Mitra AI is replying...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-1.5"
            >
              <input
                type="text"
                placeholder="Ask Mitra AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Powered by Gemini AI</span>
              <button
                onClick={() => {
                  setIsAiOpen(false);
                  setActiveTab('ai-assistant');
                }}
                className="text-amber-400 hover:underline flex items-center gap-0.5 font-medium"
              >
                Full Page AI Chat
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- WHATSAPP QUICK POPOVER ----------------- */}
      {isWhatsappOpen && (
        <div className="pointer-events-auto w-[290px] sm:w-[320px] bg-slate-900 border border-emerald-600/60 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#128C7E] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Raita Mitra WhatsApp</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  Official Helpline Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWhatsappOpen(false)}
              className="p-1 text-emerald-100 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Options */}
          <div className="p-3.5 space-y-2 bg-slate-950 text-xs">
            <p className="text-[11px] text-slate-300 font-medium mb-1">
              Connect directly with our Hubballi Team:
            </p>

            <a
              href={createWhatsappUrl('Namaskara! I would like to inquire about CSR Partnership Opportunities.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-700 rounded-xl text-slate-200 hover:text-white font-medium transition flex items-center justify-between group"
            >
              <span>💼 Corporate CSR Partnership</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </a>

            <a
              href={createWhatsappUrl('Namaskara! I made a donation and need my 80G Tax Exemption Receipt.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-700 rounded-xl text-slate-200 hover:text-white font-medium transition flex items-center justify-between group"
            >
              <span>📜 80G Tax Receipt Request</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </a>

            <a
              href={createWhatsappUrl('Namaskara! I am interested in volunteering for upcoming events.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2.5 bg-slate-900 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-700 rounded-xl text-slate-200 hover:text-white font-medium transition flex items-center justify-between group"
            >
              <span>🤝 Volunteer & Field Work Inquiry</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </a>

            <a
              href={createWhatsappUrl('Namaskara! General Inquiry for Raita Mitra Social Trust.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-center rounded-xl transition shadow flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Start General WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* ----------------- FLOATING ACTION BUTTONS STACK ----------------- */}
      <div className="pointer-events-auto flex flex-col items-end gap-2.5">
        
        {/* MITRA AI BUTTON */}
        <button
          onClick={() => {
            setIsAiOpen(!isAiOpen);
            if (isWhatsappOpen) setIsWhatsappOpen(false);
          }}
          className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl transition-all duration-300 ${
            isAiOpen
              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
              : 'bg-slate-900 border-2 border-emerald-500 text-white hover:bg-emerald-950 hover:border-emerald-400 hover:scale-105'
          }`}
          title="Ask Mitra AI Assistant"
        >
          <div className="relative">
            <div className="p-1.5 bg-emerald-800/80 rounded-full text-amber-300 border border-emerald-600">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-extrabold tracking-wide font-serif text-amber-300 group-hover:text-amber-200">
                Mitra AI
              </span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-300 font-sans leading-none hidden sm:inline">
              24x7 Help Copilot
            </span>
          </div>
        </button>

        {/* WHATSAPP BUTTON */}
        <button
          onClick={() => {
            setIsWhatsappOpen(!isWhatsappOpen);
            if (isAiOpen) setIsAiOpen(false);
          }}
          className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl transition-all duration-300 ${
            isWhatsappOpen
              ? 'bg-[#128C7E] text-white ring-2 ring-emerald-300 scale-105'
              : 'bg-[#25D366] hover:bg-[#20ba5a] text-white hover:scale-105'
          }`}
          title="WhatsApp Direct Contact"
        >
          <div className="p-1.5 bg-white/20 rounded-full text-white">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wide font-sans text-white">
              WhatsApp
            </span>
            <span className="text-[10px] text-emerald-100 font-sans leading-none hidden sm:inline">
              Instant Helpline
            </span>
          </div>

          {/* Unread Badge Ping */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white text-[9px] font-bold text-slate-900 items-center justify-center">
              1
            </span>
          </span>
        </button>

      </div>
    </div>
  );
};
