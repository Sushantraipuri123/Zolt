'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import CinematicScene from '@/components/landing/CinematicScene';
import HeroSection from '@/components/landing/HeroSection';
import StorySection from '@/components/landing/StorySection';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { createHeroIntro } from '@/lib/animations/heroIntro';
import { createScrollChoreography3d } from '@/lib/animations/scrollChoreography3d';
import { gsap } from '@/lib/gsap';

const CanCanvas = dynamic(() => import('@/components/three/CanCanvas'), {
  ssr: false,
});

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const storySceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client to prevent any hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!heroRef.current) return;
      if (!canvasMounted) return;

      createHeroIntro(rootRef.current);

      if (!reducedMotion) {
        const cleanup = createScrollChoreography3d({
          hero: heroRef.current,
          heroContent: heroContentRef.current ?? undefined,
          heroScene: heroSceneRef.current ?? undefined,
          story: storyRef.current ?? undefined,
          storyScene: storySceneRef.current ?? undefined,
        });

        return cleanup;
      }

      gsap.set('.story-reveal', { opacity: 1, y: 0, x: 0 });
      gsap.set('.can-canvas', { opacity: 1 });
    },
    { scope: rootRef, dependencies: [reducedMotion, canvasMounted] }
  );

  return (
    <SmoothScroll>
      <div ref={rootRef}>
        {/* Floating Premium Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-transparent backdrop-blur-md border-b border-white/[0.02]">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6b8cff] shadow-[0_0_8px_rgba(107,140,255,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-foreground ml-1">
              ZOLT
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[9px] font-bold tracking-[0.25em] uppercase text-muted">
            <a href="#" className="hover:text-foreground transition-colors">FORMULATION</a>
            <a href="#story" className="hover:text-foreground transition-colors font-medium">PERFORMANCE</a>
            <a href="#" className="hover:text-foreground transition-colors">PURITY</a>
          </nav>
          
          <div>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-[9px] font-bold tracking-widest uppercase text-foreground hover:bg-[#6b8cff]/10 hover:border-[#6b8cff]/30 transition-all duration-300"
            >
              ORDER NOW
            </a>
          </div>
        </header>

        {/* Premium Technical Grid Backdrop */}
        <div 
          className="pointer-events-none fixed inset-0 z-0 opacity-12"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />

        {mounted && <CanCanvas onMount={() => setCanvasMounted(true)} />}
        <main
          className="relative bg-[#030303] text-foreground overflow-x-hidden animate-fade-in"
        >
          <section
            ref={heroRef}
            className="relative h-[100dvh] w-full overflow-hidden"
          >
            <CinematicScene ref={heroSceneRef} variant="hero" />
            <div ref={heroContentRef} className="relative h-full">
              <HeroSection />
            </div>
          </section>

          <section
            id="story"
            ref={storyRef}
            className="relative min-h-[100dvh] w-full overflow-hidden border-t border-white/[0.04]"
          >
            <CinematicScene ref={storySceneRef} variant="story" />
            <StorySection />
          </section>
        </main>
      </div>
    </SmoothScroll>
  );
}
