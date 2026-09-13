import React, { useEffect, useRef, useState } from 'react';

interface CinematicRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Milliseconds delay for staggered grid items
  threshold?: number;
  direction?: 'up' | 'none';
  id?: string;
}

export const CinematicReveal: React.FC<CinematicRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
  direction = 'up',
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const transformStyle = direction === 'up'
    ? isVisible
      ? 'translate-y-0 opacity-100 blur-0 scale-100'
      : 'translate-y-8 opacity-0 blur-[1.5px] scale-[0.98]'
    : isVisible
    ? 'opacity-100'
    : 'opacity-0';

  return (
    <div
      ref={ref}
      id={id}
      style={{
        transitionDuration: '950ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all ${transformStyle} ${className}`}
    >
      {children}
    </div>
  );
};
