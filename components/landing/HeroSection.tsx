'use client';

import { motion } from 'motion/react';
import { landingCopy } from '@/content/landing';

export default function HeroSection() {
  const { hero } = landingCopy;
  const [line1, line2] = hero.heading.split(' ').reduce<[string, string]>(
    (acc, word, i, arr) => {
      const mid = Math.ceil(arr.length / 2);
      if (i < mid) acc[0] += (acc[0] ? ' ' : '') + word;
      else acc[1] += (acc[1] ? ' ' : '') + word;
      return acc;
    },
    ['', '']
  );

  return (
    <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-16">
      <div className="hero-copy pointer-events-auto relative max-w-[min(92vw,620px)] pt-24 md:max-w-[min(92vw,720px)] md:pt-0 lg:pr-12">
        <p className="hero-reveal-label mb-6 opacity-0 text-[10px] font-medium uppercase tracking-[0.2em] text-muted md:text-[11px]">
          {hero.label}
        </p>

        <h1 className="overflow-hidden">
          <span className="hero-reveal-line block opacity-0 text-[clamp(3rem,11vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-foreground bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            {line1}
          </span>
          <span className="hero-reveal-line block opacity-0 text-[clamp(3rem,11vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.03em] bg-gradient-to-r from-[#6b8cff] to-[#a8c4ff] bg-clip-text text-transparent filter drop-shadow-[0_2px_30px_rgba(107,140,255,0.35)]">
            {line2}
          </span>
        </h1>

        <p className="hero-reveal-sub mt-8 max-w-md opacity-0 text-sm font-light leading-relaxed text-muted md:mt-10 md:text-base">
          {hero.sub}
        </p>

        <motion.a
          href="#story"
          className="hero-reveal-cta group mt-10 inline-flex opacity-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-xs font-semibold tracking-widest uppercase text-foreground transition-all duration-300 hover:border-[#6b8cff]/40 hover:bg-[#6b8cff]/10 md:mt-12"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#6b8cff] shadow-[0_0_12px_rgba(107,140,255,0.85)] animate-pulse" />
          {hero.cta}
        </motion.a>

        {/* Decorative accent line */}
        <div
          className="hero-reveal-accent mt-16 h-px w-24 origin-left scale-x-0 bg-gradient-to-r from-[#6b8cff]/60 to-transparent opacity-0"
          aria-hidden
        />
      </div>
    </div>
  );
}

