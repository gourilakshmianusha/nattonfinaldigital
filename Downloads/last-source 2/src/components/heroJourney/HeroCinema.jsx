import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scene from './Scene';

// Native page scroll scrubs the backdrop; the hero never pins or captures input.
export default function HeroCinema({ heroRef, fallbackSrc = '/hero-journey/cinema/000.webp' }) {
  const driver = useRef({ progress: 0, stage: 0, motion: true, reduced: false, mobile: false, active: true });
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 760px)');
    let frame = 0;
    function update() {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      // The fixed navigation already has space reserved by .site-main.
      const header = document.querySelector('header.site-header');
      const headerBottom = header?.getBoundingClientRect().bottom || 0;
      driver.current.reduced = reduced.matches;
      driver.current.mobile = mobile.matches;
      driver.current.progress = reduced.matches ? 0 : Math.max(0, Math.min(1, (headerBottom - rect.top) / Math.max(1, rect.height)));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const observer = new IntersectionObserver(([entry]) => {
      driver.current.active = entry.isIntersecting;
      if (entry.isIntersecting) schedule();
    });
    const resize = new ResizeObserver(schedule);
    observer.observe(hero);
    resize.observe(hero);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', schedule);
    mobile.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      mobile.removeEventListener('change', schedule);
    };
  }, [heroRef]);

  return <div className={`hero-backdrop ${ready ? 'is-ready' : ''}`} aria-hidden="true">
    <img src={fallbackSrc} alt="" fetchPriority="high" loading="eager" decoding="async" />
    <Scene driver={driver} onReady={onReady} fullBleed />
  </div>;
}
