import React from 'react';
import { ArrowLeft, FileText, Lock, ShieldCheck } from 'lucide-react';
import { RoutePath } from '../types';

interface LegalProps {
  document: 'privacy-policy' | 'terms-of-platform';
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const privacySections: LegalSection[] = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'We collect information you provide when you contact us, request a demonstration, subscribe to updates, submit an assessment, or use a Natton Digital service. This may include your name, work email, phone number, company details, message content, and service preferences.',
      'We also receive limited technical information needed to operate and secure the platform, such as browser type, device information, approximate location, referral pages, and interaction logs.'
    ]
  },
  {
    title: 'How We Use Information',
    paragraphs: ['We use information to deliver, maintain, improve, and secure our services; respond to enquiries; provide requested resources; manage accounts and integrations; communicate service updates; and understand product usage. We do not sell personal information.'],
    bullets: ['Provide requested services and support', 'Process enquiries, bookings, and form submissions', 'Monitor reliability, prevent misuse, and protect the platform', 'Send relevant operational or marketing communications where permitted']
  },
  {
    title: 'Service Providers and Integrations',
    paragraphs: ['We may use trusted infrastructure, analytics, communications, payment, CRM, automation, and hosting providers to operate the platform. These providers may process information only as needed to provide their contracted services and are expected to maintain appropriate security controls.'],
  },
  {
    title: 'Data Retention and Security',
    paragraphs: ['We retain information only for as long as reasonably necessary for the purposes described here, legal obligations, dispute resolution, and legitimate business operations. We use administrative, technical, and organizational safeguards, but no internet transmission or storage system can be guaranteed to be completely secure.'],
  },
  {
    title: 'Your Choices and Rights',
    paragraphs: ['Depending on your location, you may have rights to access, correct, delete, restrict, or receive a copy of your personal information, and to withdraw consent for certain communications. Contact us to make a request. We may need to verify your identity before completing it.'],
  },
  {
    title: 'Contact',
    paragraphs: ['For privacy questions or requests, contact Natton Digital through the Contact page on this website. We may update this policy when our services, legal obligations, or data practices change. The latest version will always be posted on this page.']
  }
];

const termsSections: LegalSection[] = [
  {
    title: 'Acceptance of These Terms',
    paragraphs: ['These Terms of Platform govern access to and use of Natton Digital websites, software, automation services, integrations, and related materials. By accessing or using the platform, you agree to these terms. If you use the platform for an organization, you confirm that you have authority to accept these terms on its behalf.']
  },
  {
    title: 'Use of the Platform',
    paragraphs: ['You may use the platform only for lawful business purposes and in accordance with applicable laws, third-party provider requirements, and any service-specific agreement. You are responsible for the accuracy of information you provide and for activity performed through your account or integrations.'],
    bullets: ['Do not attempt to gain unauthorized access or disrupt the platform', 'Do not use the platform for unlawful, deceptive, abusive, or harmful activity', 'Do not upload content that infringes rights or contains malicious code', 'Maintain appropriate permissions and credentials for connected systems']
  },
  {
    title: 'Accounts, Integrations, and Customer Content',
    paragraphs: ['You are responsible for keeping account credentials secure and for obtaining the permissions needed to connect third-party systems. You retain ownership of content and data you submit. You grant Natton Digital the limited rights needed to host, process, transmit, and transform that content to provide the services.'],
  },
  {
    title: 'AI-Generated and Automated Outputs',
    paragraphs: ['Automation and AI features may produce outputs that require review. You are responsible for validating outputs before relying on them, especially for legal, financial, medical, employment, safety, or customer-impacting decisions. Natton Digital does not guarantee that automated outputs will always be complete, accurate, or uninterrupted.'],
  },
  {
    title: 'Intellectual Property',
    paragraphs: ['The platform, software, designs, documentation, trademarks, and service materials are owned by or licensed to Natton Digital and are protected by applicable law. Except for the limited access rights granted under these terms, no ownership rights are transferred to you.'],
  },
  {
    title: 'Availability, Disclaimers, and Liability',
    paragraphs: ['We work to keep the platform reliable, but services may be changed, suspended, or interrupted for maintenance, security, provider outages, or circumstances beyond our control. To the extent permitted by law, the platform is provided without warranties not expressly stated in a signed agreement. Any limitations of liability will apply to the maximum extent permitted by applicable law.'],
  },
  {
    title: 'Changes and Contact',
    paragraphs: ['We may update these terms as the platform evolves. Continued use after an updated version is posted constitutes acceptance of the revised terms. For questions about these terms or a service agreement, contact Natton Digital through the Contact page.']
  }
];

export default function Legal({ document, setPath, darkMode }: LegalProps) {
  const isPrivacy = document === 'privacy-policy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Platform';
  const summary = isPrivacy
    ? 'How Natton Digital handles information across its websites, platform, and managed automation services.'
    : 'The rules and responsibilities that apply when you access or use Natton Digital platform services.';
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <main className={`min-h-screen px-4 py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-[#110B33] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setPath('home')}
          className={`mb-8 inline-flex items-center gap-2 text-xs font-semibold transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#110B33]'}`}
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <header className={`rounded-2xl border p-6 sm:p-10 ${darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-white'}`}>
          <div className="mb-5 flex items-center gap-3 text-[#47C7BF]">
            {isPrivacy ? <Lock className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Natton Digital Legal</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {summary}
          </p>
          <p className={`mt-6 text-[10px] font-mono uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Effective date: September 7, 2026
          </p>
        </header>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className={`rounded-2xl border p-6 sm:p-8 ${darkMode ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold sm:text-xl">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#47C7BF]" />
                {section.title}
              </h2>
              <div className={`mt-4 space-y-3 text-sm leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
