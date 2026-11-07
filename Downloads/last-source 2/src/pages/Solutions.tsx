import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { RoutePath } from '../types';
import { enhancementScope } from '../components/solutionsSuite/enhancementScope';
import { initSite, initExperience, initCrm } from '../components/solutionsSuite/enhancements';
import '../components/solutionsSuite/site.css';
import '../components/solutionsSuite/experience.css';
import '../components/solutionsSuite/crm.css';
import '../components/solutionsSuite/crm-design.css';
import '../components/solutionsSuite/integration.css';

const pages = {
  hub: lazy(() => import('../components/solutionsSuite/pages/hub')),
  'ai-marketing-saas': lazy(() => import('../components/solutionsSuite/pages/ai-marketing-saas')),
  'crm-ai-automation': lazy(() => import('../components/solutionsSuite/pages/crm-ai-automation')),
  'conversational-ai': lazy(() => import('../components/solutionsSuite/pages/conversational-ai')),
  'whatsapp-automation': lazy(() => import('../components/solutionsSuite/pages/whatsapp-automation')),
  'ai-calling-agents': lazy(() => import('../components/solutionsSuite/pages/ai-calling-agents')),
  'cloud-telephony': lazy(() => import('../components/solutionsSuite/pages/cloud-telephony')),
  'rcs-messaging': lazy(() => import('../components/solutionsSuite/pages/rcs-messaging')),
  'ai-agents': lazy(() => import('../components/solutionsSuite/pages/ai-agents')),
};

type SolutionSlug = keyof typeof pages;
interface SolutionsProps {
  subPath?: SolutionSlug;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

function MountedSolution({ slug, setPath }: { slug: SolutionSlug; setPath: SolutionsProps['setPath'] }) {
  const root = useRef<HTMLDivElement>(null);
  const Page = pages[slug];
  useEffect(() => {
    if (!root.current) return;
    const scope = enhancementScope(root.current);
    initSite(scope);
    if (slug === 'crm-ai-automation') initCrm(scope);
    else initExperience(scope);
    return scope.dispose;
  }, [slug]);

  return <div ref={root} className={`natton-solutions ${slug === 'crm-ai-automation' ? 'crm-route' : 'experience-route'}`}
    onClick={event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest('a');
      if (!link || link.target || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href?.startsWith('/')) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const path = url.pathname.replace(/^\/+|\/+$/g, '') || 'home';
      if (path !== 'home' && path !== 'contact' && path !== 'products' && !path.startsWith('products/')) return;
      event.preventDefault();
      setPath(path as RoutePath);
    }}>
    <Page />
  </div>;
}

export default function Solutions({ subPath = 'hub', setPath }: SolutionsProps) {
  if (!Object.hasOwn(pages, subPath)) return <p>Solution page not found.</p>;
  return <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading solution…</div>}>
    <MountedSolution key={subPath} slug={subPath} setPath={setPath} />
  </Suspense>;
}
