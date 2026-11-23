'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';
import BoltIcon from './BoltIcon';

interface MarqueeProps {
  items: string[];
  /** Base speed in % of one copy per second. */
  speed?: number;
  /** 1 = moves right, -1 = moves left (when scrolling down; flips on scroll up). */
  direction?: 1 | -1;
  className?: string;
}

/**
 * Infinite marquee that accelerates with scroll velocity, reverses with scroll
 * direction and skews into the motion. Pauses itself when off-screen.
 */
export default function Marquee({ items, speed = 2.2, direction = -1, className = '' }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      const host = root.current;
      if (!el || !host) return;

      let visible = false;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);

      const wrap = gsap.utils.wrap(-50, 0);
      const setX = gsap.quickSetter(el, 'xPercent');
      const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' });
      let pos = 0;

      const tick = (_t: number, deltaMs: number) => {
        if (!visible) return;
        const reduced = runtime.reducedMotion;
        const v = reduced ? 0 : runtime.velocity;
        const dir = direction * (reduced ? 1 : runtime.direction);
        pos = wrap(pos + (speed * (reduced ? 0.4 : 1) + Math.abs(v) * 26) * (deltaMs / 1000) * dir);
        setX(pos);
        skewTo(-v * 14);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
      };
    },
    { scope: root, dependencies: [speed, direction] }
  );

  const group = [...items, ...items];

  return (
    <div ref={root} className={`marquee ${className}`}>
      <div ref={track} className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
            {group.map((text, i) => (
              <span key={i} className="marquee-item">
                {text}
                <BoltIcon className="marquee-bolt" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
