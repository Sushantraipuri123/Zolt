'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import MagneticButton from '@/components/ui/MagneticButton';
import BoltIcon from '@/components/ui/BoltIcon';

const PACKS = [
  { id: 'single', name: 'Trial pack', detail: '6 cans — one-time', price: '$19.99', note: '' },
  { id: 'sub', name: 'Kinetic flow plan', detail: '12 cans / month — free shipping', price: '$32.99', note: 'Best value — 15% off' },
] as const;

const FOOTER_LINKS = [
  { href: '#home', label: 'Top' },
  { href: '#about', label: 'Story' },
  { href: '#formula', label: 'Formula' },
  { href: '#final', label: 'Pre-order' },
];

/** 09 YOUR TURN — the can drops back in beside the pre-order; giant ZOLT footer rises. */
export default function FinalCharge() {
  const root = useRef<HTMLDivElement>(null);
  const [pack, setPack] = useState<(typeof PACKS)[number]['id']>('sub');
  const reduceUi = useReducedMotion();

  useGSAP(
    () => {
      gsap.from('.final-reveal', {
        yPercent: 90,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#final', start: 'top 45%' },
      });

      // Letters rise one by one as the footer scrolls in.
      gsap.fromTo(
        '.footer-shine-char',
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: '.footer-drink', start: 'top bottom', end: 'bottom bottom', scrub: true },
        }
      );

      // Each letter is its own element (so it can rise), but the shine must sweep the
      // whole line as one band — like the original single-element footer title.
      // Align every letter's gradient to the full line: --line-w = line width,
      // --char-x = the letter's offset inside the line (read from its untransformed mask).
      const line = root.current?.querySelector<HTMLElement>('.footer-drink');
      const chars = gsap.utils.toArray<HTMLElement>('.footer-shine-char', root.current);
      if (!line) return;
      const measure = () => {
        const left = line.getBoundingClientRect().left;
        line.style.setProperty('--line-w', `${line.clientWidth}px`);
        chars.forEach((c) => {
          const mask = c.parentElement;
          if (mask) c.style.setProperty('--char-x', `${mask.getBoundingClientRect().left - left}px`);
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(line);
      document.fonts?.ready.then(measure);
      return () => ro.disconnect();
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <section id="final" className="final relative min-h-svh overflow-hidden">
        <div className="final-glow" aria-hidden />
        <div className="relative z-[1] mx-auto grid min-h-svh max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-24 md:px-10 lg:grid-cols-12">
          {/* Landing zone for the 3D can */}
          <div className="h-[38svh] lg:col-span-5 lg:h-[70svh]" aria-hidden />

          <div className="lg:col-span-7">
            <p className="line-mask">
              <span className="final-reveal label block text-volt">[ 009 ] Secure your supply</span>
            </p>
            <h2 className="display mt-4 text-[clamp(2.6rem,6.4vw,7rem)] leading-[0.88]">
              <span className="line-mask">
                <span className="final-reveal block">Your turn</span>
              </span>
              <span className="line-mask">
                <span className="final-reveal block text-stroke-volt">to charge.</span>
              </span>
            </h2>

            <div className="line-mask mt-8">
              <div className="final-reveal grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Choose a pack">
                {PACKS.map((p) => {
                  const active = pack === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPack(p.id)}
                      className={`pack ${active ? 'is-active' : ''}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pack-highlight"
                          className="pack-highlight"
                          transition={reduceUi ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      {p.note && <span className="pack-note">{p.note}</span>}
                      <span className="relative block">
                        <span className="label block text-bone">{p.name}</span>
                        <span className="mt-1 block text-[12px] text-bone/50">{p.detail}</span>
                      </span>
                      <span className="display relative mt-6 block text-3xl">{p.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="line-mask mt-6 pb-2">
              <div className="final-reveal flex max-w-xl flex-col gap-3">
                <MagneticButton href="#final" className="btn-volt btn-lg btn-block" strength={0.18}>
                  <BoltIcon className="h-5 w-5" />
                  Pre-order now
                </MagneticButton>
                <p className="text-center text-[11px] tracking-wide text-bone/40">
                  Secure checkout. 30-day performance guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="site-footer relative overflow-hidden">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 pt-16 md:flex-row md:items-center md:justify-between md:px-10">
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            {FOOTER_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="link-underline label">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-6">
            <a href="#" className="link-underline label">
              Instagram
            </a>
            <a href="#" className="link-underline label">
              X / Twitter
            </a>
          </div>
        </div>

        <div className="footer-drink" aria-label="Drink Zolt">
          <p className="footer-shine-line" aria-hidden>
            {'DRINK ZOLT'.split('').map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="footer-shine-space" />
              ) : (
                <span key={i} className="footer-shine-mask">
                  <span className="footer-shine-char">{ch}</span>
                </span>
              )
            )}
          </p>
        </div>

        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 border-t border-white/10 px-5 py-6 text-[11px] text-bone/40 md:flex-row md:justify-between md:px-10">
          <span>© 2026 Zolt Energy. All rights reserved.</span>
          <span>Privacy — Terms</span>
        </div>
      </footer>
    </div>
  );
}
