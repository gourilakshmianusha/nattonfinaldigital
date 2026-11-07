import React from 'react';
import { ArrowRight, Boxes, BriefcaseBusiness } from 'lucide-react';
import { RoutePath } from '../types';

interface ServiceProductBridgeProps {
  kind: 'service' | 'product';
  route: string;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

const serviceToProduct: Record<string, { name: string; path: RoutePath }> = {
  'ai-growth-marketing': { name: 'AI Marketing Platform', path: 'solutions/ai-marketing-platform' },
  'ai-marketing-saas': { name: 'AI Marketing Platform', path: 'solutions/ai-marketing-platform' },
  'crm-ai-automation': { name: 'GrowthOS', path: 'solutions/growth-os' },
  'conversational-ai': { name: 'BusinessOS', path: 'solutions/business-os' },
  'whatsapp-automation': { name: 'BusinessOS', path: 'solutions/business-os' },
  'ai-agents': { name: 'AgenticOS', path: 'solutions/agentic-os' },
  'ai-calling-agents': { name: 'AgenticOS', path: 'solutions/agentic-os' },
  'cloud-telephony': { name: 'BusinessOS', path: 'solutions/business-os' },
  'rcs-messaging': { name: 'BusinessOS', path: 'solutions/business-os' }
};

const productToService: Record<string, { name: string; path: RoutePath }> = {
  'growth-os': { name: 'CRM & AI Automation', path: 'products/crm-ai-automation' },
  'growthos': { name: 'CRM & AI Automation', path: 'products/crm-ai-automation' },
  'ai-marketing-platform': { name: 'AI Growth Marketing', path: 'services/ai-growth-marketing' },
  'business-os': { name: 'Conversational AI', path: 'products/conversational-ai' },
  'businessos': { name: 'Conversational AI', path: 'products/conversational-ai' },
  'agentic-os': { name: 'AI Agents', path: 'products/ai-agents' },
  'agenticos': { name: 'AI Agents', path: 'products/ai-agents' }
};

export default function ServiceProductBridge({ kind, route, setPath, darkMode }: ServiceProductBridgeProps) {
  const target = (kind === 'service' ? serviceToProduct : productToService)[route];
  if (!target) return null;

  const isService = kind === 'service';
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isService ? 'pt-3' : 'pt-3'}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs ${darkMode ? 'border-white/10 bg-white/[0.02] text-gray-300' : 'border-slate-200 bg-white text-slate-700 shadow-sm'}`}>
        <div className="flex items-center gap-2">
          {isService ? <BriefcaseBusiness className="h-4 w-4 text-primary" /> : <Boxes className="h-4 w-4 text-primary" />}
          <span>
            <strong className={darkMode ? 'text-white' : 'text-[#110B33]'}>{isService ? 'Service' : 'Product'}:</strong>{' '}
            {isService ? 'Managed strategy and implementation' : 'Software platform and operating system'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPath(target.path)}
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent transition-colors"
        >
          {isService ? `Explore ${target.name}` : `See ${target.name} service`}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
