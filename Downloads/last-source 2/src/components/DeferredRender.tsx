import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface DeferredRenderProps {
  children: ReactNode;
  placeholder: ReactNode;
  rootMargin?: string;
}

export default function DeferredRender({ children, placeholder, rootMargin = '240px' }: DeferredRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={containerRef}>{isNearViewport ? children : placeholder}</div>;
}

export function useIsVisible<T extends HTMLElement>(ref: React.RefObject<T | null>, rootMargin = '120px') {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isVisible;
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}
