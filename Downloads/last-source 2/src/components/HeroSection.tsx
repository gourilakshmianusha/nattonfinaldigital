import React, { Suspense, lazy } from 'react';
import { RoutePath } from '../types';

const HeroImmersive = lazy(() => import('./heroImmersive/HeroImmersive'));

interface HeroSectionProps {
  setPath: (path: RoutePath) => void;
}

function HeroFallback() {
  return (
    <div
      className="hero-im-fallback-shell"
      style={{
        minHeight: '100svh',
        background:
          'radial-gradient(circle at 70% 40%, rgba(0,197,233,0.22), transparent 50%), linear-gradient(160deg, #100D2D, #151039 60%, #0b1a3a)',
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Homepage hero only — immersive full-screen R3F + GSAP experience.
 * About page continues to use HeroCinema + HeroSection.css independently.
 */
export default function HeroSection({ setPath }: HeroSectionProps) {
  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroImmersive setPath={setPath} />
    </Suspense>
  );
}
