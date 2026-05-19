'use client';

import React, { useEffect, useRef, useState } from 'react';
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
        ctx.fillStyle = `rgba(99, 102, 241, ${flashIntensity.current * 0.12})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashIntensity.current *= 0.88;
      }

      // Draw active lightning bolts
      activeBolts.current.forEach((bolt, index) => {
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#6366f1';
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.opacity})`;
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
            <MenuLink index="01" label="ULTRA CAFFEINE" sub="Active Formulation" link="#caffeine" />
          </div>

          {/* Item 02 / ZERO SUGAR */}
          <div
            ref={(el) => {
              menuItemsRef.current[1] = el;
            }}
            className="opacity-0 translate-y-10 corner-card mt-8 md:mt-20"
            data-corner="bl"
          >
            <MenuLink index="02" label="ZERO SUGAR" sub="Mitochondrial Burn" link="#sugar" />
          </div>
        </div>

        {/* CENTER TITLE (Revealed after all strikes, in unison with 3D can fade up) */}
        <div className="center-content opacity-0 scale-90 flex flex-col items-center text-center py-10 md:py-20 relative order-1 md:order-2 pointer-events-none">
          <h1 className="text-[10px] font-bold tracking-[1.5em] text-zinc-600 uppercase mb-8">
            ZOLT
          </h1>
        </div>

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
            <MenuLink index="03" label="HYDRATION" sub="Plasma Recovery" link="#hydration" />
          </div>

          {/* Item 04 / KINETIC FOCUS */}
          <div
            ref={(el) => {
              menuItemsRef.current[3] = el;
            }}
            className="opacity-0 translate-y-10 corner-card mt-8 md:mt-20"
            data-corner="br"
          >
            <MenuLink index="04" label="KINETIC " sub="Synapse Synthesis" link="#focus" />
          </div>
        </div>

      </div>

      {/* Bottom section with scroll cue chevron */}
      <div ref={scrollCueRef} className="pointer-events-none mt-auto pb-4 mx-auto z-20">
        <ScrollCue className="hero-scroll-cue animate-pulse" />
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
        <span className="text-[10px] font-mono text-indigo-500/50 group-hover:text-indigo-400">
          {index}
        </span>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter text-white/40 group-hover:text-white transition-all duration-500 ease-out">
          {label}
        </h3>
      </div>
      <p className="text-[9px] tracking-[0.4em] text-zinc-400 mt-2 uppercase transition-colors group-hover:text-indigo-400/80">
        // {sub}
      </p>
    </a>
  );
}
