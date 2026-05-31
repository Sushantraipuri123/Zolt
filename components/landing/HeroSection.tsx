'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { scrollState } from '@/lib/three/scrollState';
import { gsap } from '@/lib/gsap';
import ScrollCue from './ScrollCue';

// --- TYPES ---
interface Point {
  x: number;
  y: number;
}

interface LightningBolt {
  segments: Point[];
  opacity: number;
  width: number;
  lifeSpeed: number;
}

interface HeroSectionProps {
  heroContentRef: React.RefObject<HTMLDivElement | null>;
  scrollCueRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  heroContentRef,
  scrollCueRef,
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeBolts = useRef<LightningBolt[]>([]);
  const flashIntensity = useRef(0);
  const [isComplete, setIsComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  const hudSpring = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.85 };
  /* Avoid translate/rotateX here — GSAP owns y/transform on these nodes during intro */
  const cardHover = reduceMotion
    ? {}
    : {
        scale: 1.018,
        boxShadow: '0 0 48px rgba(0, 229, 255, 0.12), 0 0 2px rgba(255,255,255,0.06)',
        transition: hudSpring,
      };
  const cardTap = reduceMotion ? {} : { scale: 0.99 };

  // --- RESIZE HANDLER ---
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FRACTAL LIGHTNING GENERATOR ---
  const createBoltPath = (start: Point, end: Point, displacement: number): Point[] => {
    if (displacement < 4) return [start, end];
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const jitter = (Math.random() - 0.5) * displacement;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const midPoint = {
      x: midX + (-(dy / len) * jitter),
      y: midY + ((dx / len) * jitter),
    };
    return [
      ...createBoltPath(start, midPoint, displacement / 2),
      ...createBoltPath(midPoint, end, displacement / 2),
    ];
  };

  const strikeMenuLink = (index: number) => {
    const el = menuItemsRef.current[index];
    if (!el || !canvasRef.current) return;

    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Create electrical bolt path discharging from above to the link center
    const path = createBoltPath(
      { x: targetX + (Math.random() * 400 - 200), y: -50 },
      { x: targetX, y: targetY },
      150
    );

    activeBolts.current.push({
      segments: path,
      opacity: 1.2,
      width: 2.8,
      lifeSpeed: 0.045,
    });

    // Full-screen ambient atmospheric flash feedback
    flashIntensity.current = 0.65;

    // Premium visual reveal with power-on brightness flicker
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power4.out',
      onStart: () => {
        gsap.fromTo(
          el,
          { filter: 'brightness(10) blur(10px)' },
          { filter: 'brightness(1) blur(0px)', duration: 0.9 }
        );
      },
    });
  };

  // --- RENDER LOOP FOR CANVAS LIGHTNING ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ambient lightning atmospheric flash
      if (flashIntensity.current > 0) {
        ctx.fillStyle = `rgba(255, 113, 32, ${flashIntensity.current * 0.08})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashIntensity.current *= 0.88;
      }

      // Draw active lightning bolts
      activeBolts.current.forEach((bolt, index) => {
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(255, 113, 32, 0.85)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 229, 255, ${bolt.opacity * 0.95})`;
        ctx.lineWidth = bolt.width;

        if (bolt.segments.length > 0) {
          ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
          bolt.segments.forEach((p) => ctx.lineTo(p.x, p.y));
        }
        ctx.stroke();

        bolt.opacity -= bolt.lifeSpeed;
        if (bolt.opacity <= 0) activeBolts.current.splice(index, 1);
      });

      requestAnimationFrame(render);
    };

    const raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  // --- DEFINE GLOBAL HOOKS FOR TIMELINE SYNCHRONIZATION ---
  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetScale = isDesktop ? 1.05 : 0.88;
    const targetY = isDesktop ? 0.05 : -0.05;

    if (typeof window !== 'undefined') {
      (window as any).zoltStrikeMenuLink = (index: number) => {
        strikeMenuLink(index);
      };

      (window as any).zoltRevealCenterContent = () => {
        setIsComplete(true);
        // Reveal center typography
        gsap.to('.center-content', { opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out' });
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).zoltStrikeMenuLink;
        delete (window as any).zoltRevealCenterContent;
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12 select-none pointer-events-none">
      {/* Atmospheric fog — soft-light reads on #020202; screen-blend did not (≈invisible on black) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] isolate overflow-hidden"
        aria-hidden
      >
        {/* Skylight wash — thin “high cloud” band */}
        <div
          className="hero-fog-layer hero-fog-sky absolute inset-x-[-10%] -top-[8%] h-[48%] opacity-90 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(ellipse 95% 70% at 50% 0%, rgba(255,113,32,0.08) 0%, rgba(185,215,255,0.18) 38%, rgba(0,200,230,0.08) 52%, transparent 72%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-a absolute -left-[10%] top-[14%] h-[46vh] w-[58vw] rounded-full blur-[88px] mix-blend-soft-light opacity-[0.55]"
          style={{
            background:
              'radial-gradient(ellipse at 42% 48%, rgba(245,250,255,0.35) 0%, rgba(0,210,240,0.12) 48%, transparent 72%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-b absolute right-[-8%] top-[28%] h-[40vh] w-[52vw] rounded-full blur-[96px] mix-blend-soft-light opacity-[0.5]"
          style={{
            background:
              'radial-gradient(ellipse at 58% 52%, rgba(130,185,255,0.28) 0%, rgba(0,160,200,0.08) 55%, transparent 74%)',
          }}
        />
        <div
          className="hero-fog-layer hero-fog-c absolute left-[6%] right-[6%] bottom-[4%] h-[30vh] blur-[110px] mix-blend-soft-light opacity-[0.45]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(230,240,255,0.2) 0%, rgba(80,140,200,0.06) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Fractal Lightning canvas overlay */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-40 h-full w-full" />

      {/* 3-Column Portfolio Layout Grid */}
      <div
        ref={heroContentRef}
        className="glitch-ui z-20 grid w-full max-w-screen-2xl grid-cols-1 md:grid-cols-3 px-8 md:px-12 items-center pointer-events-auto"
      >
        
        {/* LEFT MENU (Strikes 1 & 2) */}
        <div className="flex flex-col gap-16 items-center md:items-start order-2 md:order-1 mt-10 md:mt-0 pointer-events-auto">
          {/* Item 01 / ULTRA CAFFEINE */}
          <div
            ref={(el) => {
              menuItemsRef.current[0] = el;
            }}
            className="opacity-0 translate-y-10 corner-card"
            data-corner="tl"
          >
            <motion.div whileHover={cardHover} whileTap={cardTap} className="inline-block">
              <MenuLink index="01" label="ULTRA CAFFEINE" sub="Active Formulation" link="#caffeine" />
            </motion.div>
          </div>

          {/* Item 02 / ZERO SUGAR */}
          <div
            ref={(el) => {
              menuItemsRef.current[1] = el;
            }}
            className="opacity-0 translate-y-10 corner-card mt-8 md:mt-20"
            data-corner="bl"
          >
            <motion.div whileHover={cardHover} whileTap={cardTap} className="inline-block">
              <MenuLink index="02" label="ZERO SUGAR" sub="Mitochondrial Burn" link="#sugar" />
            </motion.div>
          </div>
        </div>

        {/* CENTER TITLE (Revealed after all strikes, in unison with 3D can fade up) */}
        <motion.div
          className="center-content opacity-0 scale-90 flex flex-col items-center text-center py-10 md:py-20 relative order-1 md:order-2 pointer-events-none max-w-lg mx-auto"
          animate={
            isComplete && !reduceMotion
              ? {
                  filter: [
                    'drop-shadow(0 0 0px transparent)',
                    'drop-shadow(0 0 28px rgba(255,113,32,0.22))',
                    'drop-shadow(0 0 12px rgba(0,229,255,0.18))',
                  ],
                }
              : {}
          }
          transition={{ duration: 2.6, ease: 'easeOut' }}
        >
          <h1 className="text-[10px] font-bold tracking-[1.5em] text-zinc-600 uppercase mb-6">
            ZOLT
          </h1>
          <div className="space-y-3 w-full">
            <div className="hero-center-line overflow-hidden">
              <p className="hero-center-line-inner text-[9px] font-black tracking-[0.42em] text-[var(--accent)] uppercase font-space-grotesk">
                Reactor online
              </p>
            </div>
            <div className="hero-center-line overflow-hidden">
              <p className="hero-center-line-inner text-xs md:text-sm font-light tracking-[0.22em] text-zinc-400 uppercase">
                Field-stable // Neural-grade flow
              </p>
            </div>
            <div className="hero-center-line overflow-hidden px-2">
              <p className="hero-center-line-inner text-[10px] md:text-[11px] text-zinc-600 leading-relaxed font-light">
                Precision hydration fused with kinetic voltage—calibrated for zero-compromise performance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT MENU (Strikes 3 & 4) */}
        <div className="flex flex-col gap-16 items-center md:items-end order-3 mt-10 md:mt-0 pointer-events-auto">
          {/* Item 03 / HYDRATION */}
          <div
            ref={(el) => {
              menuItemsRef.current[2] = el;
            }}
            className="opacity-0 translate-y-10 corner-card"
            data-corner="tr"
          >
            <motion.div whileHover={cardHover} whileTap={cardTap} className="inline-block">
              <MenuLink index="03" label="HYDRATION" sub="Plasma Recovery" link="#hydration" />
            </motion.div>
          </div>

          {/* Item 04 / KINETIC FOCUS */}
          <div
            ref={(el) => {
              menuItemsRef.current[3] = el;
            }}
            className="opacity-0 translate-y-10 corner-card mt-8 md:mt-20"
            data-corner="br"
          >
            <motion.div whileHover={cardHover} whileTap={cardTap} className="inline-block">
              <MenuLink index="04" label="KINETIC " sub="Synapse Synthesis" link="#focus" />
            </motion.div>
          </div>
        </div>

      </div>

      {/* Bottom section with scroll cue chevron */}
      <div ref={scrollCueRef} className="pointer-events-none mt-auto pb-4 mx-auto z-20">
        <ScrollCue className="hero-scroll-cue" />
      </div>
    </div>
  );
}

/**
 * Reusable Menu Link component matching the portfolio design perfectly
 */
function MenuLink({
  index,
  label,
  sub,
  link,
}: {
  index: string;
  label: string;
  sub: string;
  link: string;
}) {
  return (
    <a href={link} className="group cursor-pointer flex flex-col items-center md:items-start">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-[var(--accent)]/45 group-hover:text-[var(--accent-cyan)]">
          {index}
        </span>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter text-white/40 group-hover:text-white transition-all duration-500 ease-out">
          {label}
        </h3>
      </div>
      <p className="text-[9px] tracking-[0.4em] text-zinc-400 mt-2 uppercase transition-colors group-hover:text-[var(--accent)]/90">
        // {sub}
      </p>
    </a>
  );
}
