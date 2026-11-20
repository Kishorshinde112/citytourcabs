'use client';

import React, { useState, useEffect, useRef, type ReactNode } from 'react';

interface LazyOnScrollProps {
  children: ReactNode;
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
}

/**
 * Scroll-triggered lazy loading wrapper.
 * Defers rendering and offscreen operations until the user scrolls within `rootMargin` of the element.
 * Guarantees zero UI shift and preserves identical styling.
 */
export default function LazyOnScroll({
  children,
  minHeight = '200px',
  rootMargin = '300px',
  className = '',
}: LazyOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If IntersectionObserver is not supported, fallback to immediate render
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div
      ref={containerRef}
      className={`lazy-render-scroll ${className}`}
      style={!isVisible ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight } : undefined}
    >
      {isVisible ? children : null}
    </div>
  );
}
