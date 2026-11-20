'use client';

import React, { useState, useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 1:1 Scroll Reveal Animation Component (matching citytourcabs.com `Re` component)
 * Smoothly fades in and slides up elements when scrolled into view.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 40,
  className = '',
  style = {},
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If running in SSR or browser without IntersectionObserver, render immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.4, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.4, 0.25, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
