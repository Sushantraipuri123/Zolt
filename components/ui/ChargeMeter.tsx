'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const CHAPTERS: Array<[string, string]> = [
  ['#home', 'Ignition'],
  ['#pulse', 'Pulse'],
  ['#about', 'Manifesto'],
  ['#inside', 'Inside'],
  ['#charge', 'Overload'],
  ['#arena', 'Arena'],
  ['#formula', 'Formula'],
  ['#energy-core', 'Out there'],
  ['#final', 'Your turn'],
];

/**
 * Side HUD: the whole page is a charge cycle. Must render *after* the sections so
 * its ScrollTriggers are created after their pins (correct refresh order).
 */
export default function ChargeMeter() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const fill = root.current?.querySelector<HTMLElement>('.meter-fill');
      const value = root.current?.querySelector<HTMLElement>('.meter-value');
      const label = root.current?.querySelector<HTMLElement>('.meter-label');
      if (!fill || !value || !label) return;

      let max = ScrollTrigger.maxScroll(window);
      const onRefresh = () => {
        max = ScrollTrigger.maxScroll(window);
      };
      ScrollTrigger.addEventListener('refresh', onRefresh);

      const setFill = gsap.quickSetter(fill, 'scaleY');
      let lastP = -1;
      let lastPct = -1;
      const tick = () => {
        const p = max > 0 ? gsap.utils.clamp(0, 1, window.scrollY / max) : 0;
        if (Math.abs(p - lastP) < 0.0005) return;
        lastP = p;
        setFill(p);
        const pct = Math.round(p * 100);
        if (pct !== lastPct) {
          lastPct = pct;
          value.textContent = String(pct).padStart(3, '0');
        }
      };
      gsap.ticker.add(tick);

      CHAPTERS.forEach(([sel, name], i) => {
        // Pass the element, not the selector: selectors resolve inside this component's scope.
        // Pinned sections are measured via their pin-spacer so the whole pin distance counts.
        const el = document.querySelector(sel);
        if (!el) return;
        const parent = el.parentElement;
        const trigger = parent?.classList.contains('pin-spacer') ? parent : el;
        ScrollTrigger.create({
          trigger,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) label.textContent = `${String(i + 1).padStart(2, '0')} ${name}`;
          },
        });
      });

      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener('refresh', onRefresh);
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="charge-meter" aria-hidden>
      <span className="meter-label">01 Ignition</span>
      <div className="meter-track">
        <div className="meter-fill" />
      </div>
      <span className="meter-readout">
        <span className="meter-value">000</span>%
      </span>
    </div>
  );
}
