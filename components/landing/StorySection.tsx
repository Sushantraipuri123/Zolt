'use client';

import { motion } from 'motion/react';
import { landingCopy } from '@/content/landing';

export default function StorySection() {
  const { story } = landingCopy;

  return (
    <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 md:px-10 lg:grid-cols-2 lg:gap-8 lg:py-0 lg:pl-12 lg:pr-8">
      {/* Chapters — left */}
      <div className="flex flex-col justify-center lg:max-w-lg lg:pr-6">
        <p className="story-reveal mb-4 opacity-0 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
          {story.label}
        </p>

        <h2 className="story-reveal opacity-0 text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
          {story.heading}
        </h2>

        <p className="story-reveal mt-5 opacity-0 text-sm font-light leading-relaxed text-muted md:text-[15px]">
          {story.body}
        </p>

        <div className="mt-10 space-y-0 divide-y divide-white/[0.06]">
          {story.chapters.map((chapter) => (
            <article
              key={chapter.num}
              className="story-chapter story-reveal group py-6 opacity-0 transition-colors first:pt-0"
            >
              <div className="flex gap-5">
                <span className="text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tighter text-white/[0.08] transition-colors group-hover:text-[var(--accent-cyan)]/20">
                  {chapter.num}
                </span>
                <div className="flex-1 border-l border-transparent pl-0 transition-all group-hover:border-[var(--accent-cyan)]/30 group-hover:pl-4">
                  <h3 className="text-base font-semibold tracking-wide text-foreground">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted">
                    {chapter.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <motion.a
          href="#"
          className="story-reveal mt-10 inline-flex w-fit items-center gap-3 border border-white/10 bg-white/[0.03] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground opacity-0 transition-colors hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--accent-cyan)]/5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="h-px w-5 bg-[var(--accent-cyan)]" />
          {story.cta}
        </motion.a>
      </div>

      {/* Can anchor + floating stat pills — right */}
      <div className="relative hidden min-h-[70vh] lg:block">
        <div className="can-stage absolute inset-0" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pl-8">
          {story.chapters.map((chapter, i) => (
            <div
              key={chapter.metric}
              className="story-stat-pill flex items-center gap-4 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-3 opacity-0 backdrop-blur-md transition-all duration-500"
              style={{ marginLeft: i % 2 === 0 ? '0' : '2rem' }}
            >
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {chapter.metric}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-cyan)]">
                {chapter.metricLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
