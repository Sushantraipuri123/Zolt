'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { pinEnd } from '@/lib/device';

const CALLOUTS = [
  { value: 150, unit: 'mg', label: 'Natural caffeine', body: 'Clean, steady lift without the synthetic spike.', side: 'left' },
  { value: 75, unit: 'mg', label: 'L-theanine', body: 'Smooths the edge into calm, locked-in focus.', side: 'left' },
  { value: 250, unit: 'mg', label: 'BCAA complex', body: 'Branched-chain amino acids for muscles under load.', side: 'right' },
  { value: 0, unit: 'g', label: 'Sugar', body: 'Sodium, potassium and magnesium — and nothing sweet to crash on.', side: 'right' },
] as const;

/** 07 FORMULA — can dead centre, callouts power on and wire themselves to it. */
export default function Formula() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'formula-pin',
          trigger: section,
          start: 'top top',
          end: pinEnd(150),
          anticipatePin: 1,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.from('.formula-head .fx-reveal', { yPercent: 80, autoAlpha: 0, stagger: 0.03, duration: 0.14, ease: 'power3.out' }, 0);

      gsap.utils.toArray<HTMLElement>('.callout', section).forEach((el, i) => {
        const dir = el.dataset.side === 'left' ? -1 : 1;
        const at = 0.14 + i * 0.12;
        tl.from(el, { xPercent: 22 * dir, autoAlpha: 0, duration: 0.16, ease: 'power3.out' }, at);
        const wire = el.querySelector('.callout-wire');
        if (wire) tl.from(wire, { scaleX: 0, duration: 0.14 }, at + 0.06);
        const num = el.querySelector<HTMLElement>('[data-count]');
        if (num) {
          const proxy = { v: 0 };
          const end = Number(num.dataset.count);
          tl.to(
            proxy,
            {
              v: end,
              duration: 0.18,
              onUpdate: () => {
                num.textContent = String(Math.round(proxy.v));
              },
            },
            at
          );
        }
      });

      tl.to({}, { duration: 0.1 }, 0.9);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="formula" className="formula relative h-svh overflow-hidden" aria-label="The formula">
      <div className="formula-orbit" aria-hidden />
      <div className="formula-orbit formula-orbit--inner" aria-hidden />

      <div className="relative z-[1] mx-auto flex h-full max-w-[1600px] flex-col px-5 pt-24 pb-8 md:px-10 lg:pt-28">
        <header className="formula-head text-center">
          <p className="line-mask">
            <span className="fx-reveal label block text-volt">[ 007 ] The formula</span>
          </p>
          <h2 className="display mt-3 text-[clamp(1.8rem,3.6vw,3.6rem)] leading-none">
            <span className="line-mask">
              <span className="fx-reveal block">What&apos;s inside</span>
            </span>
          </h2>
        </header>

        <div className="formula-grid mt-auto lg:mt-0 lg:flex-1">
          {CALLOUTS.map((c) => (
            <div key={c.label} className={`callout callout--${c.side}`} data-side={c.side}>
              <span className="callout-wire" aria-hidden />
              <span className="display callout-value">
                <span data-count={c.value}>0</span>
                <span className="text-volt">{c.unit}</span>
              </span>
              <span className="label mt-2 block">{c.label}</span>
              <p className="callout-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
