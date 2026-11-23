'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';

const PANELS = [
  {
    num: '01',
    tag: 'Voltage',
    title: ['150mg', 'clean voltage'],
    body: 'Natural caffeine that hits fast, holds steady and fades clean. Power on demand, without the jitter tax.',
    chips: ['Fast onset', 'Natural source', 'No jitters'],
    tone: 'volt',
  },
  {
    num: '02',
    tag: 'Zero',
    title: ['Zero sugar.', 'zero crash'],
    body: 'No sugar, no artificial sweeteners, nothing waiting to drop you an hour later. Just the charge.',
    chips: ['Zero sugar', 'Stevia sweetened', 'No crash'],
    tone: 'ink',
  },
  {
    num: '03',
    tag: 'Hydration',
    title: ['Electrolyte', 'loaded'],
    body: 'Sodium, potassium and magnesium citrate keep you hydrated when the effort peaks and the sweat hits.',
    chips: ['Sodium', 'Potassium', 'Magnesium'],
    tone: 'ice',
  },
  {
    num: '04',
    tag: 'Focus',
    title: ['Locked-in', 'focus'],
    body: '75mg of L-theanine smooths the edge, so the energy turns into focus — not noise.',
    chips: ['75mg L-theanine', 'Calm focus', 'Flow state'],
    tone: 'lime',
  },
] as const;

/** 04 INSIDE THE CAN — horizontal ride through four panels; the can swaps sides on each. */
export default function InsideCan() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const track = section?.querySelector<HTMLElement>('.inside-track');
      if (!section || !track) return;

      const distance = () => track.scrollWidth - window.innerWidth;
      const fill = section.querySelector<HTMLElement>('.inside-progress-fill');
      const setFill = fill ? gsap.quickSetter(fill, 'scaleX') : null;

      const ride = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'inside-pin',
          trigger: section,
          start: 'top top',
          end: () => `+=${distance() * 1.15}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setFill?.(self.progress),
        },
      });

      const panels = gsap.utils.toArray<HTMLElement>('.inside-panel', section);
      panels.forEach((panel, i) => {
        const reveal = panel.querySelectorAll('.panel-reveal');
        if (i === 0) {
          gsap.from(reveal, {
            yPercent: 60,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: section, start: 'top 60%' },
          });
        } else {
          gsap.from(reveal, {
            yPercent: 70,
            autoAlpha: 0,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: ride,
              start: 'left 78%',
              end: 'left 28%',
              scrub: true,
            },
          });
        }

        const num = panel.querySelector('.panel-num');
        if (num) {
          gsap.fromTo(
            num,
            { xPercent: 30 },
            {
              xPercent: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: ride,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });

      // Titles skew with scroll speed while the ride is active.
      const skewers = gsap.utils
        .toArray<HTMLElement>('.panel-skew', section)
        .map((el) => gsap.quickTo(el, 'skewX', { duration: 0.45, ease: 'power3' }));
      const tick = () => {
        if (!ride.scrollTrigger?.isActive) return;
        const v = runtime.reducedMotion ? 0 : runtime.velocity;
        skewers.forEach((to) => to(-v * 16));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="inside" className="inside relative h-svh overflow-hidden" aria-label="Inside the can">
      <div className="inside-track flex h-full w-max">
        {PANELS.map((p, i) => {
          const copyRight = i % 2 === 1;
          return (
            <article key={p.num} className={`inside-panel inside-panel--${p.tone}`}>
              {p.tone === 'ice' && (
                <video
                  className="inside-video"
                  src="/videos/water4.mp4"
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
              )}
              <div className="inside-grid" aria-hidden />
              <span
                className={`panel-num ${copyRight ? 'left-[4vw]' : 'right-[4vw]'}`}
                aria-hidden
              >
                {p.num}
              </span>

              <div
                className={`panel-copy ${copyRight ? 'lg:ml-auto lg:text-right' : ''}`}
              >
                <p className="panel-reveal label text-volt">
                  [ 004 ] {p.num} / 04 — {p.tag}
                </p>
                <h2 className="panel-skew display mt-5 text-[clamp(2.4rem,6.2vw,6.8rem)] leading-[0.9]">
                  <span className="line-mask">
                    <span className="panel-reveal block">{p.title[0]}</span>
                  </span>
                  <span className="line-mask">
                    <span className="panel-reveal block text-stroke-volt">{p.title[1]}</span>
                  </span>
                </h2>
                <p className="panel-reveal mt-6 max-w-md text-[15px] leading-relaxed text-bone/70 lg:inline-block">
                  {p.body}
                </p>
                <ul className={`panel-reveal mt-7 flex flex-wrap gap-2 ${copyRight ? 'lg:justify-end' : ''}`}>
                  {p.chips.map((c) => (
                    <li key={c} className="chip">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <div className="inside-progress" aria-hidden>
        <span className="label">Inside the can</span>
        <span className="inside-progress-track">
          <span className="inside-progress-fill" />
        </span>
        <span className="label">04</span>
      </div>
    </section>
  );
}
