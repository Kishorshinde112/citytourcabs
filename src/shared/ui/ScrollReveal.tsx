import React, { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Immediate-paint layout wrapper that preserves spacing/className without hiding SSR content at opacity: 0.
 */
export default function ScrollReveal({
  children,
  className = '',
  style = {},
}: ScrollRevealProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
