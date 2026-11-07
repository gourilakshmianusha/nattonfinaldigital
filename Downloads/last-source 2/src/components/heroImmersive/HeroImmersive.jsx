import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import HeroScene from './HeroScene';
import './heroImmersive.css';

gsap.registerPlugin(ScrollTrigger);

function preferReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}

function SplitLetters({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="hero-im-letter"
          style={{ '--i': i }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function MagneticCTA({ as: Tag = 'button', className, children, onClick, href, disabledMag }) {
  const ref = useRef(null);

  const onMove = useCallback(
    (event) => {
      if (disabledMag || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(ref.current, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power3.out',
      });
    },
    [disabledMag],
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
  }, []);

  const shared = {
    ref,
    className,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
  };

  if (Tag === 'a') {
    return (
      <a {...shared} href={href}>
        {children}
      </a>
    );
  }

  return <button type="button" {...shared}>{children}</button>;
}

export default function HeroImmersive({ setPath }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const copyRef = useRef(null);
  const overlayRef = useRef(null);
  const sceneLabelRef = useRef(null);
  const isMobile = useIsMobile();
  const [reduced, setReduced] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [canvasVisible, setCanvasVisible] = useState(true);

  const sceneLabels = useMemo(
    () => ['Entrance', 'Horizontal Flow', 'Liquid Transform', 'Typography Depth', 'Cinematic Settle'],
    [],
  );

  useEffect(() => {
    setReduced(preferReducedMotion());
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setCanvasVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Cursor-following light
  useEffect(() => {
    if (reduced || isMobile) return undefined;
    const onMove = (event) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.current.x = nx;
      pointer.current.y = ny;
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          duration: 0.55,
          ease: 'power3.out',
        });
      }
    };
    const stage = stageRef.current;
    stage?.addEventListener('pointermove', onMove);
    return () => stage?.removeEventListener('pointermove', onMove);
  }, [reduced, isMobile]);

  // GSAP ScrollTrigger cinematic sequence
  useEffect(() => {
    if (!rootRef.current || !stageRef.current) return undefined;
    if (reduced) {
      progress.current = 0;
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.05,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            const scene = Math.min(4, Math.floor(self.progress * 4.999));
            setActiveScene((prev) => (prev === scene ? prev : scene));
          },
        },
      });

      // Scene 1 — Cinematic entrance
      tl.fromTo(
        '.hero-im-letter',
        { yPercent: 120, opacity: 0, rotateX: -70 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.028,
          duration: 0.9,
          ease: 'power3.out',
        },
        0,
      );
      tl.fromTo(
        '.hero-im-desc',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
        0.18,
      );
      tl.fromTo(
        '.hero-im-cta-group',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.32,
      );
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.92 },
        { opacity: 0.55, duration: 0.8 },
        0,
      );

      // Scene 2 — Horizontal motion (typography drifts opposite to ribbons)
      tl.to(
        copyRef.current,
        { xPercent: isMobile ? -4 : -12, duration: 1 },
        0.85,
      );
      tl.to(
        '.hero-im-gradient-word',
        { backgroundPosition: '120% 50%', duration: 1 },
        0.85,
      );
      tl.to(overlayRef.current, { opacity: 0.42, duration: 0.8 }, 0.9);

      // Scene 3 — Liquid transform atmosphere shift
      tl.to(
        stageRef.current,
        {
          '--hero-glow-x': '68%',
          '--hero-glow-y': '42%',
          '--hero-glow-a': '0.55',
          duration: 1,
        },
        1.7,
      );
      tl.to(
        copyRef.current,
        { xPercent: isMobile ? 2 : 6, yPercent: -4, duration: 1 },
        1.7,
      );
      tl.to('.hero-im-subtitle', { scale: 0.96, duration: 1 }, 1.7);

      // Scene 4 — Typography rearrange / layered depth
      tl.to(
        '.hero-im-hook',
        { y: -28, letterSpacing: '0.32em', opacity: 0.75, duration: 0.9 },
        2.55,
      );
      tl.to(
        '.hero-im-subtitle',
        { y: -18, scale: 1.04, duration: 0.9 },
        2.55,
      );
      tl.to(
        '.hero-im-ghost-type',
        { opacity: 0.18, yPercent: -20, duration: 0.9 },
        2.55,
      );
      tl.to(copyRef.current, { xPercent: 0, duration: 0.9 }, 2.55);

      // Scene 5 — Final cinematic settle
      tl.to(
        '.hero-im-ghost-type',
        { opacity: 0, yPercent: -40, duration: 0.7 },
        3.35,
      );
      tl.to(
        copyRef.current,
        { xPercent: 0, yPercent: 0, scale: 1, duration: 0.8 },
        3.35,
      );
      tl.to(
        '.hero-im-subtitle',
        { y: 0, scale: 1, duration: 0.8 },
        3.35,
      );
      tl.to(
        '.hero-im-hook',
        { y: 0, letterSpacing: '0.16em', opacity: 1, duration: 0.8 },
        3.35,
      );
      tl.to(
        '.hero-im-cta-group',
        { scale: 1.03, duration: 0.5 },
        3.5,
      );
      tl.to(overlayRef.current, { opacity: 0.62, duration: 0.8 }, 3.35);
      tl.to(
        stageRef.current,
        {
          '--hero-glow-x': '28%',
          '--hero-glow-y': '58%',
          '--hero-glow-a': '0.35',
          duration: 0.8,
        },
        3.35,
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isMobile]);

  const simplified = isMobile || reduced;

  return (
    <div className="hero-im-root" ref={rootRef} data-reduced={reduced ? 'true' : 'false'}>
      <div className="hero-im-stage" ref={stageRef}>
        <div className="hero-im-canvas-wrap" aria-hidden="true">
          {!reduced ? (
            <Canvas
              dpr={simplified ? [1, 1.25] : [1, 1.6]}
              frameloop={canvasVisible ? 'always' : 'never'}
              camera={{ position: [0, 0.2, 7.2], fov: 42, near: 0.1, far: 40 }}
              gl={{
                antialias: !simplified,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                <HeroScene progress={progress} pointer={pointer} simplified={simplified} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="hero-im-fallback" />
          )}
        </div>

        <div className="hero-im-overlay" ref={overlayRef} />
        <div className="hero-im-atmosphere" />
        {!simplified && <div className="hero-im-cursor-light" ref={cursorRef} />}

        <div className="hero-im-ghost-type" aria-hidden="true">
          EVOLVE
        </div>

        <div className="hero-im-content" ref={copyRef}>
          <p className="hero-im-hook">
            <SplitLetters text="NATTON DIGITAL" className="hero-im-hook-inner" />
          </p>

          <h1 className="hero-im-subtitle">
            <span className="hero-im-line">
              <SplitLetters text="Marketing that" />
            </span>
            <span className="hero-im-line">
              <SplitLetters text="evolves. " />
              <span className="hero-im-gradient-word">
                <SplitLetters text="A team that" />
              </span>
            </span>
            <span className="hero-im-line hero-im-gradient-word">
              <SplitLetters text="stays involved." />
            </span>
          </h1>

          <p className="hero-im-desc">
            We help MSMEs and SMBs attract qualified leads, streamline operations and grow through
            digital marketing, AI automation and software solutions tailored to their business goals.
          </p>

          <div className="hero-im-cta-group">
            <MagneticCTA
              as="a"
              className="hero-im-btn hero-im-btn-primary"
              href="/contact"
              disabledMag={simplified}
              onClick={(event) => {
                event.preventDefault();
                setPath('contact');
              }}
            >
              Book a Free Strategy Consultation
              <ArrowRight aria-hidden="true" size={18} />
            </MagneticCTA>
            <MagneticCTA
              className="hero-im-btn hero-im-btn-secondary"
              disabledMag={simplified}
              onClick={() => setPath('our-process')}
            >
              <Play aria-hidden="true" size={18} />
              See How We Work
            </MagneticCTA>
          </div>
        </div>

        <div className="hero-im-hud" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeScene}
              className="hero-im-scene"
              ref={sceneLabelRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {String(activeScene + 1).padStart(2, '0')} — {sceneLabels[activeScene]}
            </motion.span>
          </AnimatePresence>
          <div className="hero-im-progress">
            {sceneLabels.map((_, i) => (
              <span key={i} className={i <= activeScene ? 'is-active' : ''} />
            ))}
          </div>
          <motion.span
            className="hero-im-scroll-hint"
            animate={{ opacity: activeScene === 0 ? 0.7 : 0.25 }}
            transition={{ duration: 0.4 }}
          >
            Scroll to explore
          </motion.span>
        </div>
      </div>
    </div>
  );
}
