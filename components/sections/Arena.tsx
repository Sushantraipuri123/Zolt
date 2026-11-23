'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { pinEnd } from '@/lib/device';

/**
 * 06 ARENA — two worlds, one can. Altitude is torn away by a lightning-shaped
 * wipe (CSS clip-path driven by the --e custom property) to reveal Iron, while
 * the can flips across the seam (see canKeyframes).
 */
export default function Arena() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'arena-pin',
            trigger: section,
            start: 'top top',
            end: pinEnd(240),
            anticipatePin: 1,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo('.arena-a-img', { scale: 1.22 }, { scale: 1.02, duration: 0.62 }, 0)
        .from('.arena-a-copy .arena-reveal', { yPercent: 80, autoAlpha: 0, stagger: 0.025, duration: 0.14, ease: 'power3.out' }, 0.02)
        .fromTo('.arena-wipe', { '--e': 1.3 }, { '--e': -0.5, duration: 0.36, ease: 'power1.inOut' }, 0.4)
        .to('.arena-a-copy', { xPercent: -25, autoAlpha: 0, duration: 0.12 }, 0.42)
        .fromTo('.arena-b-img', { scale: 1.28 }, { scale: 1.02, duration: 0.6 }, 0.4)
        .from('.arena-b-copy .arena-reveal', { yPercent: 80, autoAlpha: 0, stagger: 0.025, duration: 0.14, ease: 'power3.out' }, 0.7)
        .to({}, { duration: 0.08 }, 0.92);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="arena" className="arena relative h-svh overflow-hidden" aria-label="Where Zolt hits">
      {/* Scene A — Altitude */}
      <div className="arena-scene">
        <Image src="/images/adventure_backdrop.png" alt="" fill sizes="100vw" className="arena-a-img object-cover" />
        <div className="arena-shade arena-shade--a" />
      </div>

      {/* Lightning seam + Scene B — Iron */}
      <div className="arena-scene arena-wipe arena-edge" aria-hidden />
      <div className="arena-scene arena-wipe arena-b">
        <Image src="/images/gym_backdrop.png" alt="" fill sizes="100vw" className="arena-b-img object-cover" />
        <div className="arena-shade arena-shade--b" />
      </div>

      <div className="arena-copy arena-a-copy">
        <p className="arena-reveal label text-volt">[ 006 ] Phase 01 — Altitude</p>
        <h2 className="display mt-5 text-[clamp(2.4rem,6vw,6.4rem)] leading-[0.9]">
          <span className="line-mask">
            <span className="arena-reveal block">Built for</span>
          </span>
          <span className="line-mask">
            <span className="arena-reveal block text-stroke-volt">the extreme.</span>
          </span>
        </h2>
        <p className="arena-reveal mt-6 max-w-md text-[15px] leading-relaxed text-bone/75">
          Thin air, cold wind, long climbs. When gravity pulls down, Zolt pushes back — sustained energy that
          holds when the conditions don&apos;t.
        </p>
      </div>

      <div className="arena-copy arena-b-copy">
        <p className="arena-reveal label text-ice">[ 006 ] Phase 02 — Iron</p>
        <h2 className="display mt-5 text-[clamp(2.4rem,6vw,6.4rem)] leading-[0.9]">
          <span className="line-mask">
            <span className="arena-reveal block">Maximum</span>
          </span>
          <span className="line-mask">
            <span className="arena-reveal block text-stroke-ice">output.</span>
          </span>
        </h2>
        <p className="arena-reveal mt-6 max-w-md text-[15px] leading-relaxed text-bone/75">
          Heavy sets, short rests, no excuses. Clean caffeine for the push, electrolytes for the sweat, focus for
          the last rep.
        </p>
        <ul className="arena-reveal mt-7 flex flex-wrap gap-2 lg:justify-end">
          {['Pre-workout', 'Hydration', 'Focus'].map((c) => (
            <li key={c} className="chip chip--ice">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
