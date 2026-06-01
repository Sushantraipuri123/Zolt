'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from '@/lib/gsap';
import ScrollCue from './ScrollCue';

interface HeroSectionProps {
  heroContentRef: React.RefObject<HTMLDivElement | null>;
  scrollCueRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  heroContentRef,
  scrollCueRef,
}: HeroSectionProps) {
  const [isComplete, setIsComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { zoltRevealCenterContent?: () => void }).zoltRevealCenterContent =
        () => {
          setIsComplete(true);
          gsap.to('.center-content', {
            opacity: 1,
            scale: 1,
            duration: 2.2,
            ease: 'expo.out',
          });
        };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as unknown as { zoltRevealCenterContent?: () => void }).zoltRevealCenterContent;
      }
    };
  }, []);

  return (
    <div className="hero-ref relative h-full min-h-0 w-full px-6 py-6 md:px-10 md:py-8 lg:px-16 xl:px-20">
      {/* Atmospheric fog — subtle so herobg + CinematicScene read */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] isolate overflow-hidden opacity-80"
        aria-hidden
      >
        <div
          className="hero-fog-layer hero-fog-sky absolute inset-x-[-10%] -top-[8%] h-[48%] opacity-60 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(ellipse 95% 70% at 50% 0%, rgba(255,113,32,0.06) 0%, rgba(185,215,255,0.1) 38%, rgba(0,200,230,0.05) 52%, transparent 72%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-a absolute -left-[10%] top-[14%] h-[46vh] w-[58vw] rounded-full blur-[88px] mix-blend-soft-light opacity-[0.35]"
          style={{
            background:
              'radial-gradient(ellipse at 42% 48%, rgba(245,250,255,0.22) 0%, rgba(0,210,240,0.08) 48%, transparent 72%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-b absolute right-[-8%] top-[28%] h-[40vh] w-[52vw] rounded-full blur-[96px] mix-blend-soft-light opacity-[0.32]"
          style={{
            background:
              'radial-gradient(ellipse at 58% 52%, rgba(130,185,255,0.18) 0%, rgba(0,160,200,0.05) 55%, transparent 74%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-c absolute left-[6%] right-[6%] bottom-[4%] h-[30vh] blur-[110px] mix-blend-soft-light opacity-[0.28]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(230,240,255,0.12) 0%, rgba(80,140,200,0.04) 45%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-20 grid h-full min-h-0 w-full grid-rows-[1fr_auto]">
        {/* Main HUD: vertically centered in the space above the scroll cue */}
        <div className="flex min-h-0 w-full flex-col justify-center">
          <div ref={heroContentRef} className="mx-auto w-full max-w-[min(100%,1920px)]">
            <div className="center-content glitch-ui pointer-events-none grid w-full grid-cols-1 items-center gap-8 opacity-0 scale-[0.98] lg:pointer-events-auto lg:grid-cols-12 lg:gap-8 xl:gap-10">
              {/* Left */}
              <div className="pointer-events-auto order-1 flex flex-col justify-center gap-6 lg:col-span-5">
                <p className="hero-ref-eyebrow hero-eyebrow">// Futuristic energy drink</p>

                <div className="space-y-0">
                  <div className="hero-headline-line overflow-hidden">
                    <h1 className="hero-ref-headline-line hero-ref-headline-line--white hero-headline-line-inner px-0.5">
                      Unleash your
                    </h1>
                  </div>
                  <div className="hero-headline-line overflow-hidden">
                    <h1 className="hero-ref-headline-line hero-ref-headline-line--accent hero-headline-line-inner px-0.5">
                      Energy
                    </h1>
                  </div>
                </div>

                <p className="hero-ref-body hero-body-copy">
                  ZOLT is more than an energy drink. It&apos;s hydration reinvented for the next generation.
                </p>

                <div className="hero-cta-wrap flex flex-wrap items-center gap-4">
                  <a href="#checkout" className="hero-cta-chamfer inline-flex items-center gap-2">
                    <span>Pre-order now</span>
                    <span aria-hidden className="text-base font-semibold leading-none">
                      →
                    </span>
                  </a>
                </div>

                <button
                  type="button"
                  className="hero-trailer-row group inline-flex cursor-pointer items-center gap-3 self-start border-0 bg-transparent p-0 text-left"
                  aria-label="Watch trailer"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors group-hover:border-white/45 group-hover:bg-white/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="font-space-grotesk text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85 group-hover:text-white">
                    Watch trailer
                  </span>
                </button>
              </div>

              <div
                className="pointer-events-none order-3 hidden min-h-[12vh] lg:order-2 lg:col-span-4 lg:block"
                aria-hidden
              >
                <div className="mx-auto h-full max-h-[50vh] w-full max-w-[220px] rounded-full opacity-[0.04] blur-3xl mix-blend-soft-light [background:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.35),transparent_70%)]" />
              </div>

              {/* Right stats — narrow rail, flush right */}
              <div className="pointer-events-auto order-2 flex w-full max-w-full flex-col border-t border-white/[0.08] pt-5 lg:order-3 lg:col-span-3 lg:max-w-[min(18rem,28vw)] lg:justify-self-end lg:border-t-0 lg:pt-0">
                <HeroStat icon={<IconBolt />} value="200 MG" label="Caffeine" size="lg" labelTone="accent" />
                <HeroStat icon={<IconCube />} value="0 G" label="Sugar" size="lg" labelTone="accent" />
                <HeroStat icon={<IconDrop />} value="Electrolytes + minerals" label="" size="md" labelTone="muted" />
                <HeroStat icon={<IconClock />} value="24 H" label="Energy" size="lg" labelTone="accent" />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="relative z-20 w-full shrink-0"
          animate={
            isComplete && !reduceMotion
              ? {
                  filter: [
                    'drop-shadow(0 0 0px transparent)',
                    'drop-shadow(0 0 20px rgba(255,77,0,0.15))',
                    'drop-shadow(0 0 10px rgba(255,255,255,0.08))',
                  ],
                }
              : {}
          }
          transition={{ duration: 2.4, ease: 'easeOut' }}
        >
          <div ref={scrollCueRef} className="pointer-events-none mx-auto max-w-[min(100%,1920px)] pb-4 pt-2">
            <ScrollCue variant="hero" className="hero-scroll-cue opacity-0" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HeroStat({
  icon,
  value,
  label,
  size,
  labelTone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  size: 'lg' | 'md';
  labelTone: 'accent' | 'muted';
}) {
  return (
    <div className="hero-stat-row">
      <span className="hero-stat-icon">{icon}</span>
      <div className="min-w-0 flex-1">
        <p
          className={`hero-stat-value ${size === 'lg' ? 'hero-stat-value--lg' : 'hero-stat-value--md'} hero-stat-row-value`}
        >
          {value}
        </p>
        {label ? (
          <p
            className={`hero-stat-label hero-stat-row-label ${labelTone === 'accent' ? 'hero-stat-label--accent' : ''}`}
          >
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinejoin="round" />
    </svg>
  );
}

function IconCube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        d="M12 2l8 4v8l-8 4-8-4V6l8-4zM4 6l8 4 8-4M12 10v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDrop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
