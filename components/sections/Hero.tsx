'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { canIntro, kickCan, triggerFlash } from '@/lib/runtime';
import { unlockScroll } from '@/lib/scroll/smoothScroll';
import MagneticButton from '@/components/ui/MagneticButton';

const LETTERS = ['Z', 'O', 'L', 'T'];
const STATS = [
  { value: '150', unit: 'mg', label: 'Natural caffeine' },
  { value: '0', unit: 'g', label: 'Sugar' },
  { value: '3', unit: '', label: 'Electrolytes' },
];

interface HeroProps {
  ignited: boolean;
  reduced: boolean;
}

/**
 * 01 IGNITION. Ownership (one animator per element+property):
 *  - .hero-letter-inner / .hero-line-inner / [data-hero-in] / .hero-bg-img → intro timeline
 *  - .hero-letter / .hero-copy / .hero-bg / .hero-cue                       → scroll-out scrub
 *  - canIntro                                                               → intro timeline only
 */
export default function Hero({ ignited, reduced }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  // Pre-ignition state + scroll-out choreography (registered once, on mount).
  useGSAP(
    () => {
      gsap.set('.hero-letter-inner', { yPercent: 115, rotate: 6 });
      gsap.set('.hero-line-inner', { yPercent: 110 });
      gsap.set('[data-hero-in]', { autoAlpha: 0, y: 26 });
      gsap.set('.hero-bg-img', { scale: 1.3, filter: 'brightness(0.15) saturate(0.6)' });

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        .to('.hero-letter', { xPercent: (i: number) => (i - 1.5) * 70, yPercent: -12, scale: 1.25, autoAlpha: 0 }, 0)
        .to('.hero-copy', { yPercent: -35, autoAlpha: 0 }, 0)
        .to('.hero-bg', { yPercent: 22 }, 0)
        .to('.hero-cue', { autoAlpha: 0, duration: 0.25 }, 0);
    },
    { scope: root }
  );

  // Intro, once the visitor hits IGNITE.
  useGSAP(
    () => {
      if (!ignited) return;
      const chrome = document.querySelectorAll('.site-nav, .charge-meter');

      if (reduced) {
        gsap.set(canIntro, { y: 0, spin: 0, scale: 1 });
        gsap
          .timeline({ onComplete: unlockScroll })
          .to('.hero-bg-img', { scale: 1.05, filter: 'brightness(1) saturate(1)', duration: 0.6 }, 0)
          .to('.hero-letter-inner, .hero-line-inner', { yPercent: 0, rotate: 0, duration: 0.6 }, 0)
          .to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
          .to(canIntro, { alpha: 1, duration: 0.6 }, 0)
          .to(chrome, { autoAlpha: 1, duration: 0.6 }, 0);
        return;
      }

      gsap
        .timeline({ delay: 0.3 })
        .to('.hero-bg-img', { scale: 1.06, filter: 'brightness(1) saturate(1)', duration: 2.6, ease: 'expo.out' }, 0)
        .to('.hero-letter-inner', { yPercent: 0, rotate: 0, duration: 1.4, ease: 'expo.out', stagger: 0.075 }, 0.05)
        // The can rockets up from below with a double spin and lands with a strike.
        .to(canIntro, { y: 0, duration: 1.5, ease: 'expo.out' }, 0.3)
        .to(canIntro, { spin: 0, duration: 2.1, ease: 'power3.out' }, 0.3)
        .to(canIntro, { scale: 1, alpha: 1, duration: 0.9, ease: 'power2.out' }, 0.3)
        .call(() => triggerFlash(1.1), undefined, 0.78)
        .fromTo('.hero-shock', { scale: 0.2, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.78)
        .to('.hero-line-inner', { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0.75)
        .to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 }, 0.95)
        .to(chrome, { autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 1.1)
        .call(unlockScroll, undefined, 1.2);
    },
    { scope: root, dependencies: [ignited, reduced] }
  );

  return (
    <section ref={root} id="home" className="hero relative h-svh min-h-[620px] overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden>
        <Image
          src="/images/herobg.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="hero-bg-img object-cover object-[center_75%]"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="hero-shock" aria-hidden />

      <div className="hero-word" aria-hidden>
        {LETTERS.map((l) => (
          <span key={l} className="hero-letter">
            <span className="hero-letter-inner">{l}</span>
          </span>
        ))}
      </div>

      {/* Tap target over the can — the can lives in the fixed WebGL layer above. */}
      <button
        type="button"
        className="hero-can-hit"
        onClick={() => kickCan(1)}
        aria-label="Spin the can"
        data-cursor
      />

      <div className="hero-copy absolute inset-x-0 bottom-0 z-[3] px-5 pb-8 md:px-10 md:pb-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p data-hero-in className="label text-volt">
              [ 001 ] High-voltage energy
            </p>
            <h1 className="display mt-4 text-[clamp(2.5rem,5.6vw,6rem)] leading-[0.88]">
              <span className="line-mask">
                <span className="hero-line-inner block">Unleash</span>
              </span>
              <span className="line-mask">
                <span className="hero-line-inner block text-stroke-volt">the charge.</span>
              </span>
            </h1>
            <p data-hero-in className="mt-5 max-w-sm text-[15px] leading-relaxed text-bone/70">
              Clean voltage. Zero sugar. Zero crash. Built for the ones who outrun the moment.
            </p>
            <div data-hero-in className="mt-7 flex flex-wrap items-center gap-6">
              <MagneticButton href="#final" className="btn-volt">
                Pre-order now
              </MagneticButton>
              <a href="#pulse" className="link-underline label">
                Enter the story ↓
              </a>
            </div>
          </div>

          <ul className="hidden gap-10 lg:flex">
            {STATS.map((s) => (
              <li key={s.label} data-hero-in className="hero-stat">
                <span className="display text-5xl">
                  {s.value}
                  <span className="text-2xl text-volt">{s.unit}</span>
                </span>
                <span className="label mt-2 block text-bone/55">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero-cue" aria-hidden>
        <div data-hero-in className="flex flex-col items-center gap-3">
          <span className="label">Scroll to charge</span>
          <span className="hero-cue-line" />
        </div>
      </div>
    </section>
  );
}
