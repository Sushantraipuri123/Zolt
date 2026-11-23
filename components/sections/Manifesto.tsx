'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '@/lib/gsap';

const STATS = [
  { value: 150, unit: 'mg', label: 'Natural caffeine' },
  { value: 0, unit: 'g', label: 'Added sugar' },
  { value: 3, unit: '', label: 'Electrolytes' },
  { value: 0, unit: '', label: 'Crash' },
];

/** 03 MANIFESTO — pinned statement that charges up word by word as you scroll. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const split = SplitText.create('.manifesto-text', { type: 'words', wordsClass: 'mf-word' });
      gsap.set(split.words, { opacity: 0.1 });
      gsap.set('.mf-stat', { y: 50, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'about-pin',
          trigger: section,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo('.mf-label', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.06 }, 0)
        .to(split.words, { opacity: 1, duration: 0.05, stagger: 0.55 / split.words.length }, 0.04)
        .to('.mf-stat', { y: 0, autoAlpha: 1, duration: 0.1, stagger: 0.04 }, 0.66);

      section.querySelectorAll<HTMLElement>('[data-count]').forEach((el, i) => {
        const end = Number(el.dataset.count);
        const proxy = { v: 0 };
        tl.to(
          proxy,
          {
            v: end,
            duration: 0.2,
            onUpdate: () => {
              el.textContent = String(Math.round(proxy.v));
            },
          },
          0.68 + i * 0.04
        );
      });

      tl.to({}, { duration: 0.06 }, 0.94);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="manifesto relative h-svh overflow-hidden">
      <div className="manifesto-glow" aria-hidden />
      <div className="relative z-[1] mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 pt-[30svh] md:px-10 lg:pt-0">
        <div className="lg:w-[60%]">
          <p className="mf-label label text-volt">[ 003 ] The manifesto</p>
          <p className="manifesto-text display mt-6 text-[clamp(1.45rem,3.25vw,3.6rem)] leading-[1.08]">
            We don&apos;t do slow. <em>Zolt</em> is clean voltage for the ones who outrun the moment:{' '}
            <em>150mg</em> of natural caffeine, <em>zero</em> sugar and a full electrolyte load. No crash. No
            compromise. <em>Just charge.</em>
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4 lg:w-[60%]">
          {STATS.map((s) => (
            <li key={s.label} className="mf-stat stat-tile">
              <span className="display whitespace-nowrap text-[clamp(1.6rem,2.7vw,2.9rem)]">
                <span data-count={s.value}>0</span>
                <span className="text-volt">{s.unit}</span>
              </span>
              <span className="label mt-2 block text-bone/50">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
