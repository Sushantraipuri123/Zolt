'use client';

import { motion } from 'motion/react';
import { landingCopy } from '@/content/landing';

export default function StorySection() {
  const { story } = landingCopy;

  const specs = [
    {
      metric: "800mg",
      label: "ELECTROLYTE MATRIX",
      title: "Cellular Hydration",
      desc: "An optimal ratio of sodium, potassium, and magnesium designed to support immediate fluid balance and cellular vitality under peak physical stress.",
      glow: "from-[#6b8cff]/10 to-transparent",
    },
    {
      metric: "150mg",
      label: "NATURAL NOOTROPICS",
      title: "Cognitive Focus",
      desc: "Pure caffeine extracted from organic green tea leaf, paired with active co-factors to deliver high cognitive performance with zero jitters and no crash.",
      glow: "from-[#8ab4ff]/10 to-transparent",
    },
    {
      metric: "0.0g",
      label: "PURITY STANDARD",
      title: "Zero Compromise",
      desc: "Absolutely no added sugar, artificial sweeteners, or chemical preservatives. Lightly sweetened with natural botanicals for a clean, premium taste.",
      glow: "from-[#a8c4ff]/10 to-transparent",
    },
  ];

  return (
    <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-16 px-6 py-28 md:px-12 lg:grid-cols-2 lg:gap-4 lg:py-0 lg:pl-16">
      <div className="flex flex-col justify-center lg:max-w-xl lg:pr-8">
        <p className="story-reveal mb-5 opacity-0 text-[10px] font-medium uppercase tracking-[0.25em] text-muted md:text-[11px]">
          {story.label}
        </p>

        <h2 className="story-reveal opacity-0 text-[clamp(2.25rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {story.heading}
        </h2>

        <p className="story-reveal mt-6 opacity-0 text-sm font-light leading-relaxed text-muted md:text-base">
          {story.body}
        </p>

        {/* Spec Cards Matrix */}
        <div className="mt-10 space-y-4">
          {specs.map((spec, i) => (
            <div
              key={spec.title}
              className="story-reveal group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 backdrop-blur-md transition-all duration-500 hover:border-[#6b8cff]/30 hover:bg-white/[0.03] opacity-0"
            >
              {/* Dynamic hover background glow */}
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${spec.glow} opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-start border-b sm:border-b-0 sm:border-r border-white/5 pb-3 sm:pb-0 sm:pr-6 min-w-[100px]">
                  <span className="text-[9px] font-bold tracking-[0.15em] text-[#6b8cff] uppercase">
                    {spec.label}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-foreground sm:mt-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {spec.metric}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-semibold tracking-wide text-foreground">
                    {spec.title}
                  </h3>
                  <p className="text-xs font-light text-muted mt-1.5 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.a
          href="#shop"
          className="story-reveal mt-12 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 text-xs font-medium tracking-widest uppercase text-foreground transition-all duration-300 hover:border-[#6b8cff]/40 hover:bg-[#6b8cff]/10 opacity-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="h-1 w-1 rounded-full bg-[#6b8cff] shadow-[0_0_8px_rgba(107,140,255,0.8)]" />
          {story.cta}
        </motion.a>
      </div>

      {/* Can landing zone — visual anchor for scroll end position */}
      <div
        className="relative hidden min-h-[55vh] lg:block"
        aria-hidden
      />
    </div>
  );
}
