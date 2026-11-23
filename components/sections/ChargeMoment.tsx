'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '@/lib/gsap';
import { pinEnd } from '@/lib/device';
import { triggerFlash } from '@/lib/runtime';

const PEAK = 0.72;

/**
 * 05 OVERLOAD — the wow beat. Pinned; the charge climbs to 100%, the core and
 * shock rings swell, the can (see canKeyframes) grows and spins up with full
 * arcs, and at the peak the screen flashes into FULL VOLTAGE.
 * Fully scrubbed, so it plays backwards just as well.
 */
export default function ChargeMoment() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const one = SplitText.create('.charge-one', { type: 'chars', mask: 'chars' });
      const full = SplitText.create('.charge-full-text', { type: 'chars' });
      const meter = section.querySelector<HTMLElement>('.charge-value');
      const proxy = { v: 0 };
      let past = false;

      gsap.set(one.chars, { yPercent: 110 });
      gsap.set(full.chars, { autoAlpha: 0, scale: 2.4 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'charge-pin',
          trigger: section,
          start: 'top top',
          end: pinEnd(230),
          anticipatePin: 1,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const now = self.progress >= PEAK;
            if (now && !past && self.direction === 1) triggerFlash(1.4);
            if (now !== past) section.classList.toggle('is-overloaded', now);
            past = now;
          },
        },
      });

      tl.to(one.chars, { yPercent: 0, stagger: 0.012, duration: 0.12, ease: 'power3.out' }, 0.02)
        .to(
          proxy,
          {
            v: 100,
            duration: PEAK,
            ease: 'power1.in',
            onUpdate: () => {
              if (meter) meter.textContent = String(Math.round(proxy.v)).padStart(3, '0');
            },
          },
          0
        )
        .fromTo('.charge-bar-fill', { scaleX: 0 }, { scaleX: 1, duration: PEAK, ease: 'power1.in' }, 0)
        .fromTo('.charge-core', { scale: 0.25, opacity: 0.15 }, { scale: 1.7, opacity: 1, duration: PEAK, ease: 'power2.in' }, 0)
        .fromTo(
          '.charge-ring',
          { scale: 0.2, opacity: 0 },
          { keyframes: { scale: [0.2, 3.2], opacity: [0, 0.85, 0] }, duration: 0.3, stagger: 0.12 },
          0.08
        )
        .to(one.chars, { yPercent: -110, stagger: 0.006, duration: 0.05 }, PEAK - 0.03)
        .to('.charge-flash', { opacity: 1, duration: 0.015 }, PEAK)
        .to('.charge-flash', { opacity: 0, duration: 0.12, ease: 'power2.out' }, PEAK + 0.015)
        .to(full.chars, { autoAlpha: 1, scale: 1, stagger: 0.008, duration: 0.09, ease: 'expo.out' }, PEAK + 0.01)
        .to('.charge-core', { scale: 1.15, opacity: 0.55, duration: 0.18 }, PEAK + 0.05)
        .fromTo('.charge-sub', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.84)
        .to({}, { duration: 0.06 }, 0.94);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="charge" className="charge relative h-svh overflow-hidden" aria-label="Full voltage">
      <div className="charge-core" aria-hidden />
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="charge-ring" aria-hidden />
      ))}
      <div className="charge-scan" aria-hidden />

      <div className="charge-hud">
        <span className="label text-volt">[ 005 ] Overload</span>
        <span className="charge-bar" aria-hidden>
          <span className="charge-bar-fill" />
        </span>
        <span className="label tabular-nums">
          Charge <span className="charge-value">000</span>%
        </span>
      </div>

      <h2 className="charge-one display">One can.</h2>

      <div className="charge-full" data-text="Full voltage.">
        <span className="charge-full-text display">Full voltage.</span>
      </div>

      <p className="charge-sub">
        This is what clean energy feels like. <span className="text-volt">No sugar. No crash.</span>
      </p>

      <div className="charge-flash" aria-hidden />
    </section>
  );
}
