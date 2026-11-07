import FAQPanel from './review/FAQPanel.jsx';
import { InHousePlatforms, ToolMarquees } from './review/ReviewSections.jsx';
import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import data from './homepage/home-data.json';
import './homepage/homepage.css';
import './homepage/homepage-redesign.css';
import {
  ProjectBoard,
  CampaignExample,
  Pipeline,
  ReviewExample,
  ConversationExample,
  SupportExample,
  BundleExample,
  AgentExample,
  ProcessWorkspace,
  ContactRecord,
} from './homepage/WorkExamples.jsx';
import { themeFor, themeStyle } from './homepage/home-themes.js';
import { SmartLink } from './NavContext.jsx';

const CONTACT = '/contact/';
export const Motion = createContext({ running: true, toggle: () => {}, reduced: false });

const clients = [
  ['Dr. Vaggar Hospital', 'drv-aggar-hospital.webp'],
  ['Aarya Investment Services', 'aarya-investwell.webp'],
  ['Saral Sai Astrologer', 'saral-sai-astrologer.webp'],
  ['Niddore', 'niddore.webp'],
  ['Arogyadhama Hospital', 'arogyadhama-hospital.webp'],
  ['Vardhhan Hotel', 'vardhhan-hotel.webp'],
  ['Paritranaya IAS Academy', 'paritranayana-academy.webp'],
  ['Shri Vaishnavi Shikshan Samsthe', 'shri-vaishnavi-shikshan-samsthe.webp'],
];

const faqs = [
  [
    'What does Natton Digital do beyond regular digital marketing?',
    'Natton Digital brings marketing and business operations together. Alongside SEO, landing pages and Google or Meta campaigns, its solutions cover lead tracking, customer follow-ups, WhatsApp conversations and AI-powered workflows. The aim is not simply to bring people to your business, but to help your team respond to enquiries and turn more of the right ones into customers.',
  ],
  [
    'Is Natton Digital suitable for a small business?',
    'Natton Digital positions its solutions for MSMEs in India and small to medium-sized businesses worldwide. A business can start by solving one important problem, such as missed enquiries or slow follow-ups, rather than implementing every tool at once. The right scope depends on your goals, current systems and budget.',
  ],
  [
    'Which service or product should we start with?',
    'Start with the biggest gap in your customer journey. If too few people discover you, look at AI Growth Marketing. If creating campaigns takes too long, explore AI Marketing SaaS. If leads are scattered, consider CRM & Automation SaaS. If responses are slow, look at Conversational AI. For repetitive back-office work, explore AI Agents & Workflows.',
  ],
];

const steps = [
  {
    title: 'Understand',
    tag: 'YOUR BUSINESS COMES FIRST',
    copy: 'We start with your vision, the people you serve and the point where work gets difficult.',
    output: 'A shared view of the priority',
    items: ['Your goals', 'Your customers', 'Your current setup'],
    note: 'The conversation starts with your business—not a list of tools.',
  },
  {
    title: 'Shape',
    tag: 'A SCOPE WITH A PURPOSE',
    copy: 'Agree the work, the tools, the people involved and how progress will be reviewed.',
    output: 'An agreed scope and clear ownership',
    items: ['The right approach', 'Clear responsibilities', 'A practical next step'],
    note: 'Begin with the useful starting point. Build connections as the need becomes clear.',
  },
  {
    title: 'Build & launch',
    tag: 'STRATEGY BECOMES WORK',
    copy: 'Create the website, campaign or workflow, test the customer journey and prepare your team.',
    output: 'A working setup, ready for your team',
    items: ['Build the experience', 'Test real scenarios', 'Prepare the handover'],
    note: 'We connect the details: the message, the page, the enquiry and the person who responds.',
  },
  {
    title: 'Stay involved',
    tag: 'PROGRESS NEEDS ATTENTION',
    copy: 'Review what is happening, refine the work and agree the support your next stage needs.',
    output: 'A clearer direction for the next stage',
    items: ['Review useful signals', 'Improve the next step', 'Keep the team connected'],
    note: 'Your business keeps moving. The work should move with it.',
  },
];

function useVisible() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '60px',
      threshold: 0.05,
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Label({ children }) {
  return (
    <span className="nh-label">
      <i />
      {children}
    </span>
  );
}

function Link({ href, children, quiet = false }) {
  return (
    <SmartLink className={quiet ? 'nh-link' : 'nh-button'} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </SmartLink>
  );
}

function OutcomeLane({ systems = false }) {
  const { ref, visible } = useVisible();
  const { running } = useContext(Motion);
  const items = systems
    ? ['Consistent follow-up', 'Shared customer context', 'Clearer handovers', 'Less repetitive work']
    : ['Stronger discovery', 'Relevant enquiries', 'Clearer measurement', 'A useful next step'];
  return (
    <article
      tabIndex="0"
      ref={ref}
      className={`nh-outcome-lane ${systems ? 'nh-lane-systems' : 'nh-lane-services'}`}
      data-motion-state={running && visible ? 'running' : 'paused'}
    >
      <div className="nh-lane-heading">
        <span>{systems ? '02 / PRODUCTS & SOLUTIONS' : '01 / SERVICES'}</span>
        <h3>{systems ? 'Keep the work moving.' : 'Give discovery a direction.'}</h3>
        <p>{systems ? 'From the first enquiry to the next action.' : 'From being found to a useful conversation.'}</p>
      </div>
      <div className="nh-outcome-marquee">
        <div className="nh-outcome-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="nh-outcome-group" key={copy}>
              {items.map((text, i) => (
                <span key={text}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  {text}
                  <span className="nh-marquee-star" aria-hidden="true">
                    /
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ul className="nh-sr-only">
        {items.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </article>
  );
}

function OutcomeMarquees() {
  return (
    <section id="working-toward" className="nh-section nh-outcomes">
      <div className="nh-container">
        <div className="nh-section-heading">
          <div>
            <Label>WHAT THE WORK MOVES TOWARD</Label>
            <h2>
              Different work. <em>A connected purpose.</em>
            </h2>
          </div>
          <div className="nh-section-aside">
            <p>Marketing helps the right people find you. Connected systems help your team take the next step.</p>
          </div>
        </div>
        <div className="nh-outcome-lanes">
          <OutcomeLane />
          <OutcomeLane systems />
        </div>
      </div>
    </section>
  );
}

function SoftwareTools() {
  return <ToolMarquees />;
}

function WhoWeAre() {
  return (
    <section id="who-we-are" className="nh-section nh-about">
      <div className="nh-container">
        <header className="polish-section-heading">
          <Label>WHO WE ARE</Label>
          <h2>
            Built around your business.
            <br />
            <em>Invested in what comes next.</em>
          </h2>
          <p>Strategy, creative work and connected systems, with one team responsible for the next step.</p>
        </header>
        <div className="nh-about-grid">
          <div className="nh-about-copy">
            <p className="nh-lead">
              Natton is your strategic partner for digital growth, bringing market research, creative campaigns and AI
              together to strengthen your online presence and attract the right customers.
            </p>
            <p>
              We build solutions around your vision and business goals. Whether you need an AI-powered digital marketing
              partnership—from growth strategy to campaign execution—or a specific software or business automation
              solution, our specialists take ownership of delivery and stay invested in your next stage of growth.
            </p>
            <Link href={CONTACT} quiet>
              Talk about your goals
            </Link>
          </div>
          <figure className="nh-about-photo">
            <img
              src="/media/services/people/ai-growth-marketing-960.webp"
              alt="An illustrative team scene reviewing marketing plans, creative work and customer information together"
              width="960"
              height="600"
              loading="lazy"
            />
            <div className="nh-shared-goal">
              <span>A SHARED WAY FORWARD</span>
              <strong>
                Your vision.
                <br />A connected team.
              </strong>
              <div>
                <Check size={13} />
                Clear priorities
              </div>
              <div>
                <Check size={13} />
                Shared ownership
              </div>
              <div>
                <Check size={13} />
                An agreed next step
              </div>
            </div>
            <figcaption>STRATEGY · CREATIVE · CONNECTED SYSTEMS</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: 'Strategy & Execution',
    description: 'We do more than suggest ideas — we help plan, build, launch, and improve them.',
    cta: 'See how we work',
    href: '/#our-process',
    kind: 'strategy',
  },
  {
    title: 'AI-Powered Marketing',
    description: 'Create content, campaigns, and customer journeys faster with smart AI support.',
    cta: 'Explore marketing',
    href: '/services/ai-growth-marketing/',
    kind: 'marketing',
  },
  {
    title: 'Automation That Saves Time',
    description: 'Reduce repetitive work with workflows for leads, follow-ups, reporting, and support.',
    cta: 'View automation',
    href: '/products/crm-ai-automation/',
    kind: 'automation',
  },
  {
    title: 'ROI-Focused Solutions',
    description: 'Every solution is designed to improve visibility, conversions, efficiency, or revenue.',
    cta: 'See business value',
    href: '/#working-toward',
    kind: 'value',
  },
  {
    title: 'Connected Customer Communication',
    description: 'Manage enquiries across WhatsApp, calls, forms, and CRM from one connected system.',
    cta: 'Explore channels',
    href: '/products/conversational-ai/',
    kind: 'communication',
  },
  {
    title: 'Ongoing Support & Optimization',
    description: 'We keep refining your systems and campaigns so your results improve over time.',
    cta: 'Get continuous support',
    href: CONTACT,
    kind: 'support',
  },
];

function ReasonArt({ kind }) {
  const examples = {
    strategy: ProjectBoard,
    marketing: CampaignExample,
    automation: () => <Pipeline compact />,
    value: ReviewExample,
    communication: ConversationExample,
    support: SupportExample,
  };
  const Example = examples[kind];
  return <Example />;
}

function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="nh-section nh-reasons">
      <div className="nh-container">
        <div className="nh-reasons-intro">
          <Label>WHY CHOOSE US?</Label>
          <h2>What gives your business an upper hand with Natton Digital?</h2>
          <p>Practical AI solutions, faster execution, measurable results, and support that helps your business grow.</p>
        </div>
        <div className="nh-reason-grid">
          {reasons.map((reason, i) => (
            <article className={`nh-reason-card nh-reason-${reason.kind}`} key={reason.title}>
              <div className="nh-reason-top">
                <span className="nh-reason-number">0{i + 1}</span>
                <h3>{reason.title}</h3>
              </div>
              <div className="nh-reason-art">
                <ReasonArt kind={reason.kind} />
              </div>
              <p>{reason.description}</p>
              <Link href={reason.href} quiet>
                {reason.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardArt({ Art }) {
  const { ref, visible } = useVisible();
  return (
    <div ref={ref} className={'nh-art-view ' + (visible ? 'nh-art-visible' : '')}>
      <Art />
    </div>
  );
}

function MarketingPreview() {
  return (
    <div className="nh-card-art nx-marketing-scene">
      <img
        src="/media/services/people/social-media-marketing-960.webp"
        alt="Illustrative customers discovering a local business on their phone"
        width="960"
        height="540"
        loading="lazy"
      />
      <div className="nx-search-preview">
        <img src="/media/brands/google-wordmark.png" alt="Google" width="544" height="184" />
        <span>best service near me</span>
        <strong>Your business. The right information.</strong>
        <p>A relevant service page with a clear way to enquire.</p>
        <small>Illustrative search preview</small>
      </div>
    </div>
  );
}

function AutomationPreview() {
  return (
    <div className="nh-card-art nx-crm-scene">
      <img
        src="/media/homepage/crm-team-1280.webp"
        srcSet="/media/homepage/crm-team-960.webp 960w, /media/homepage/crm-team-1280.webp 1280w"
        sizes="(max-width:760px) 100vw, 55vw"
        alt="Illustrative sales team reviewing a CRM pipeline on a laptop in an office"
        width="1536"
        height="1024"
        loading="lazy"
      />
      <Pipeline />
    </div>
  );
}

function BundlePreview() {
  return (
    <div className="nh-card-art nx-bundle-scene">
      <BundleExample />
    </div>
  );
}

function AgentPreview() {
  return (
    <div className="nh-card-art nx-agent-scene">
      <AgentExample />
    </div>
  );
}

function WaysToWork() {
  const cards = [
    {
      name: 'Digital Marketing Services',
      eyebrow: 'GET FOUND. GIVE PEOPLE A REASON TO RESPOND.',
      copy: 'Research, websites, search and creative campaigns, shaped around the customers you want to reach.',
      items: data.services,
      cta: 'Find your starting point',
      href: '/services/',
      theme: 'marketing',
      Art: MarketingPreview,
    },
    {
      name: 'Products & Platforms',
      eyebrow: 'CONNECTED SYSTEMS. BUILT AROUND YOUR WORK.',
      copy: 'Bring marketing, customer records and conversations into platforms your team can understand and use.',
      items: data.products,
      cta: 'View all products',
      href: '/products/',
      theme: 'automation',
      Art: AutomationPreview,
    },
    {
      name: 'Tailored Solutions',
      eyebrow: 'THE RIGHT COMBINATION FOR YOUR NEXT STAGE.',
      copy: 'A considered starting point for marketing, customer operations or supervised AI, customised around your business.',
      items: data.solutions,
      cta: 'Find a solution that fits',
      href: '/solutions/',
      theme: 'bundles',
      Art: BundlePreview,
    },
    {
      name: 'AI Agents & Workflows',
      eyebrow: 'FOCUSED TASKS. CONNECTED TO YOUR TEAM.',
      copy: 'Introduce AI where it can help interpret, prepare and coordinate work—with suitable tools, review steps and ownership.',
      items: data.products.filter((x) =>
        ['/products/ai-agents/', '/products/ai-calling-agents/', '/products/conversational-ai/'].includes(x.path)
      ),
      cta: 'See how agents can help',
      href: '/products/ai-agents/',
      theme: 'agents',
      Art: AgentPreview,
    },
  ];
  return (
    <section id="how-we-help" className="nh-section nh-ways">
      <div className="nh-container">
        <div className="nh-section-heading">
          <div>
            <Label>HOW WE CAN HELP</Label>
            <h2>
              Not every business needs everything.
              <br />
              <em>Start with what matters now.</em>
            </h2>
          </div>
          <p className="nh-section-aside">
            One focused requirement or an end-to-end partnership. The starting point follows your goals, your team and
            the way your business works.
          </p>
        </div>
        <div className="nh-way-grid">
          {cards.map(({ Art, ...card }) => (
            <article
              key={card.name}
              className={`nh-way-card nh-way-${card.theme}`}
              style={themeStyle(themeFor(card.href))}
            >
              <CardArt Art={Art} />
              <div className="nh-way-copy">
                <span className="nh-card-eyebrow">{card.eyebrow}</span>
                <h3>{card.name}</h3>
                <p>{card.copy}</p>
                <ul className="nh-offering-list">
                  {card.items.map((item) => (
                    <li key={item.path}>
                      <SmartLink href={item.path} style={themeStyle(themeFor(item.path))}>
                        <span className="nh-offering-dot" aria-hidden="true" />
                        {item.name}
                        <ArrowUpRight size={13} />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
                {card.theme === 'automation' && <ContactRecord />}
                <Link quiet href={card.href}>
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const [active, setActive] = useState(0);
  const id = useId();
  const step = steps[active];
  return (
    <section id="our-process" className="nh-section nh-process">
      <div className="nh-container">
        <div className="nh-section-heading">
          <div>
            <Label>HOW WE WORK</Label>
            <h2>
              A clear direction.
              <br />
              <em>A team that follows through.</em>
            </h2>
          </div>
          <p className="nh-section-aside">
            The tools may change. The way we take responsibility for the work stays consistent.
          </p>
        </div>
        <div className="nh-process-grid">
          <div role="tablist" aria-label="Our working process" className="nh-process-tabs">
            {steps.map((s, i) => (
              <button
                type="button"
                role="tab"
                key={s.title}
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  let next;
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % steps.length;
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i + steps.length - 1) % steps.length;
                  if (e.key === 'Home') next = 0;
                  if (e.key === 'End') next = steps.length - 1;
                  if (next !== undefined) {
                    e.preventDefault();
                    setActive(next);
                    e.currentTarget.parentElement.querySelectorAll('button')[next].focus();
                  }
                }}
              >
                <span>0{i + 1}</span>
                <strong>{s.title}</strong>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${active}`}
            className="nh-process-panel"
          >
            <span className="nh-card-eyebrow">{step.tag}</span>
            <h3>{step.copy}</h3>
            <ul className="nx-stage-points">
              {step.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="nh-process-output">
              <span>
                WHAT WE WORK TOWARD<strong>{step.output}</strong>
              </span>
            </div>
            <p>{step.note}</p>
          </div>
          <ProcessWorkspace stage={active} />
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const names = {
    healthcare: 'Patient information. A clearer enquiry.',
    education: 'Course discovery. Admissions follow-up.',
    'education-edtech': 'Course discovery. Admissions follow-up.',
    'real-estate': 'Property discovery. Connected enquiries.',
    manufacturing: 'Business enquiries. Clear capabilities.',
    'retail-ecommerce': 'Product discovery. Customer journeys.',
    'professional-services': 'Expertise people can understand.',
  };
  return (
    <section id="industries" className="nh-section nh-industries">
      <div className="nh-container">
        <div className="nh-section-heading">
          <div>
            <Label>INDUSTRIES WE WORK WITH</Label>
            <h2>
              Different businesses.
              <br />
              <em>Different ways forward.</em>
            </h2>
          </div>
          <div className="nh-section-aside">
            <p>
              The people you serve should shape the experience. We connect marketing and workflows to the context of
              your industry.
            </p>
            <Link href="/industries/" quiet>
              Find your industry
            </Link>
          </div>
        </div>
        <div className="nh-industry-grid">
          {data.industries.map((item, i) => {
            const slug = item.path.split('/').filter(Boolean).at(-1);
            return (
              <SmartLink className="nh-industry-card" href={item.path} key={item.path}>
                <div>
                  <img
                    src={item.image}
                    alt={`Illustrative ${item.name.toLowerCase()} business scene`}
                    width="720"
                    height="480"
                    loading="lazy"
                  />
                  <span className="nh-industry-number">0{i + 1}</span>
                  <span className="nh-industry-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <h3>{item.name}</h3>
                <p>{names[slug]}</p>
              </SmartLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Clients() {
  const { ref, visible } = useVisible();
  const { running } = useContext(Motion);
  return (
    <section
      id="our-clientele"
      ref={ref}
      className="nh-section nh-clients"
      data-motion-state={running && visible ? 'running' : 'paused'}
    >
      <div className="nh-container">
        <div className="nh-client-heading">
          <Label>BUSINESSES WE WORK WITH</Label>
          <h2>Our Clientele</h2>
          <p>Across industries, with different ambitions and a shared focus on the next step.</p>
        </div>
        <div tabIndex="0" aria-label="Client logos; pause on hover or focus" className="nh-client-marquee">
          <div className="nh-client-track">
            {[0, 1].map((copy) => (
              <ul className="nh-client-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {clients.map(([name, file]) => (
                  <li key={name}>
                    <img
                      src={`/media/homepage/client-logos/${file}`}
                      alt={copy ? '' : name}
                      width="180"
                      height="90"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  return (
    <section id="questions" className="nh-section nh-faq">
      <FAQPanel
        items={faqs}
        context="Working with Natton"
        intro="Still figuring out what your business needs? Start with these answers."
        contact="/contact/"
      />
    </section>
  );
}


export default function HomeBody() {
  useEffect(() => {
    let frame = 0;
    try {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const target = hash && document.getElementById(hash);
      if (target) frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
    } catch {}
    return () => cancelAnimationFrame(frame);
  }, []);

  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion:reduce)');
    const sync = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    sync();
    visibility();
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    try {
      setPaused(sessionStorage.getItem('natton-home-motion') === 'paused');
    } catch {}
    return () => {
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  const toggle = () =>
    setPaused((value) => {
      try {
        sessionStorage.setItem('natton-home-motion', value ? 'running' : 'paused');
      } catch {}
      return !value;
    });

  const running = !paused && !reduced && visible;

  return (
    <Motion.Provider value={{ running, toggle, reduced }}>
      <div className={`home-body home-refresh ${running ? 'nh-motion-running' : 'nh-motion-paused'}`} id="homepage-body">
        <WhoWeAre />
        <WhyChooseUs />
        <InHousePlatforms />
        <WaysToWork />
        <Process />
        <OutcomeMarquees />
        <SoftwareTools />
        <Industries />
        <Clients />
        <FAQs />
      </div>
    </Motion.Provider>
  );
}
