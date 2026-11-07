import React, { useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { RoutePath } from '../types';
import './HeroSection.css';
import HeroCinema from './heroJourney/HeroCinema';

interface HeroSectionProps {
  setPath: (path: RoutePath) => void;
}

export default function HeroSection({ setPath }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section className="hero-container" ref={heroRef}>
      <HeroCinema heroRef={heroRef} />
      <div className="hero-content">
        <div className="hero-text-section">
          <h1 className="hero-title-hook">NATTON DIGITAL</h1>
          <h2 className="hero-subtitle">
            Marketing that <br />
            evolves. <span className="hero-highlight">A team that <br /> stays involved.</span>
          </h2>
          <p className="hero-description">
            We help MSMEs and SMBs attract qualified leads, streamline operations and grow through
            digital marketing, AI automation and software solutions tailored to their business goals.
          </p>

          <div className="hero-cta-group">
            <a className="btn-primary" href="/contact/" onClick={(event) => { event.preventDefault(); setPath('contact'); }}>
              Book a Free Strategy Consultation
              <ArrowRight aria-hidden="true" size={20} />
            </a>
            <button className="btn-secondary" onClick={() => setPath('our-process')}>
              <Play aria-hidden="true" size={20} />
              See How We Work
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
