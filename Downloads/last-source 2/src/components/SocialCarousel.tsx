import React, { useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './SocialCarousel.css';

type SocialPlatform = 'Instagram' | 'LinkedIn' | 'Facebook';

interface SocialSlide {
  platform: SocialPlatform;
  image: string;
  color: string;
  alt: string;
  description: string;
  url: string;
}

const slides: SocialSlide[] = [
  {
    platform: 'Instagram',
    image: 'instagram.png',
    color: '#087e89',
    alt: 'Ideas into action: a teal and navy campaign collage with a brochure, sculptural forms and plants.',
    description: 'Creative campaigns, quick marketing tips and behind-the-scenes moments.',
    url: 'https://www.instagram.com/nattondigital/',
  },
  {
    platform: 'LinkedIn',
    image: 'linkedin.png',
    color: '#101944',
    alt: 'Where AI meets everyday work: a mint office scene with a laptop, plant and workflow icons.',
    description: 'Practical insights on digital marketing, AI agents and business automation.',
    url: 'https://www.linkedin.com/showcase/nattondigital/posts/?feedView=all',
  },
  {
    platform: 'Facebook',
    image: 'facebook.png',
    color: '#1877f2',
    alt: 'Big ideas. Stronger connections: sculptural teal, mint and blush speech bubbles.',
    description: 'Stories, fresh ideas and a community that grows together.',
    url: 'https://www.facebook.com/nattondigital/',
  },
];

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'Instagram') {
    return (
      <svg className="social-platform-icon social-instagram-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <span className={`social-platform-icon social-${platform.toLowerCase()}-icon`} aria-hidden="true">
      {platform === 'LinkedIn' ? 'in' : 'f'}
    </span>
  );
}

export default function SocialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const handleKeys = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const horizontalDistance = touch.clientX - touchStart.current.x;
    const verticalDistance = touch.clientY - touchStart.current.y;

    if (Math.abs(horizontalDistance) > 50 && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      move(horizontalDistance < 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  return (
    <section className="social-carousel-section" aria-labelledby="social-carousel-heading">
      <div className="social-carousel-inner">
        <header className="social-carousel-intro">
          <span className="social-carousel-eyebrow">
            <span className="social-carousel-live-dot" aria-hidden="true" />
            THE NATTON DIGITAL EDIT
          </span>
          <h2 id="social-carousel-heading">
            Ideas worth <em>connecting over.</em>
          </h2>
          <p>Marketing ideas, campaign highlights and a closer look at how we work.</p>
        </header>

        <div
          className="social-carousel"
          aria-roledescription="carousel"
          aria-label="Natton Digital social channels"
          onKeyDown={handleKeys}
        >
          <div className="social-platform-tabs" role="group" aria-label="Choose a platform">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.platform}
                className={`social-platform-tab ${activeIndex === index ? 'is-active' : ''}`}
                aria-pressed={activeIndex === index}
                aria-controls="social-carousel-slides"
                onClick={() => setActiveIndex(index)}
              >
                <PlatformIcon platform={slide.platform} />
                <span>{slide.platform}</span>
                <ArrowUpRight className="social-tab-mark" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="social-carousel-stage">
            <div
              className="social-carousel-viewport"
              id="social-carousel-slides"
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStart.current = { x: touch.clientX, y: touch.clientY };
              }}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => { touchStart.current = null; }}
            >
              <div className="social-slide-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {slides.map((slide, index) => (
                  <article
                    key={slide.platform}
                    className="social-slide"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${slides.length}: ${slide.platform}`}
                    aria-hidden={activeIndex !== index}
                  >
                    <img
                      className="social-slide-image"
                      src={`${import.meta.env.BASE_URL}social-carousel/${slide.image}`}
                      alt={slide.alt}
                      width="1536"
                      height="1024"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      draggable="false"
                    />
                    <div className="social-slide-caption">
                      <div className="social-caption-copy">
                        <span className="social-caption-label">FIND US ON {slide.platform.toUpperCase()}</span>
                        <p>{slide.description}</p>
                      </div>
                      <a
                        className="social-follow-button"
                        href={slide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={activeIndex === index ? 0 : -1}
                        style={{ '--social-button-color': slide.color } as React.CSSProperties}
                        aria-label={`Follow Natton Digital on ${slide.platform} (opens in a new tab)`}
                      >
                        Follow on {slide.platform}
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button type="button" className="social-nav-arrow social-previous" aria-label="Previous slide" onClick={() => move(-1)}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="social-nav-arrow social-next" aria-label="Next slide" onClick={() => move(1)}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <div className="social-carousel-footer">
            <span className="social-slide-count" aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}>
              <strong>0{activeIndex + 1}</strong>
              <span className="social-count-line" aria-hidden="true" />
              0{slides.length}
            </span>
            <div className="social-pagination" role="group" aria-label="Choose a slide">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.platform}
                  className={`social-pagination-dot ${activeIndex === index ? 'is-active' : ''}`}
                  aria-label={`Show ${slide.platform} slide`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <span className="social-browse-hint">EXPLORE OUR WORLD <ArrowUpRight aria-hidden="true" /></span>
          </div>
          <p className="social-sr-only" role="status" aria-live="polite" aria-atomic="true">
            {slides[activeIndex].platform} slide, {activeIndex + 1} of {slides.length}
          </p>
        </div>
      </div>
    </section>
  );
}