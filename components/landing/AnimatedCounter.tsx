'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  end: number;
  duration?: number; // in milliseconds, default 1500 (1.5s)
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2200,
  prefix = '',
  suffix = '',
  label,
  decimals = 0,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic ease-out curve for smooth deceleration
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutCubic * end;
            
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [end, duration]);

  // Format count nicely (e.g. dynamic decimal rendering)
  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a]/40 border border-white/[0.04] rounded-xl backdrop-blur-xl transition-all duration-500 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.02] group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,113,32,0.1)] hover:-translate-y-1"
    >
      <div className="font-outfit text-4xl md:text-5xl font-black tracking-tight text-white transition-all duration-300 group-hover:text-[var(--accent)] group-hover:drop-shadow-[0_0_15px_rgba(255,113,32,0.4)]">
        {prefix}
        {formattedCount}
        {suffix}
      </div>
      <p className="mt-3 font-space-grotesk text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase transition-colors duration-300 group-hover:text-white">
        {label}
      </p>
    </div>
  );
}
