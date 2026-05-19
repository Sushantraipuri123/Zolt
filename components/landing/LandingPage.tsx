'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StorySection from '@/components/landing/StorySection';
import CinematicScene from '@/components/landing/CinematicScene';
import AnimatedCounter from '@/components/landing/AnimatedCounter';
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
  const heroContentTwoRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEngaged, setIsEngaged] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const audioManager = useRef<any>(null);

  // States for Rotate Zolt click micro-interaction
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dynamically instantiate AudioManager on the client side
    import('@/lib/audio/AudioManager').then(({ AudioManager }) => {
      audioManager.current = new AudioManager('/horror.mp3');
      audioManager.current.preload();
    });

    // Diminish initial loader screen after 1.1s
    const timer = setTimeout(() => {
      setLoading(false);
      // Show start prompt shortly after loader dims
      setTimeout(() => {
        setShowStartPrompt(true);
      }, 350);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  const startInitialization = () => {
    if (isEngaged) return;
    setIsEngaged(true);
    audioManager.current?.play(0.65);
  };

  // Handle click to rotate can and play sound
  const handleRotateClick = () => {
    setRotate(true);

    // Play Soda Opening audio sound effect
    try {
      const audio = new Audio('https://hydroflowdrink.com/audio/sodaopening.mp3');
      audio.volume = 0.55;
      audio.play().catch((err) => {
        console.log('Audio playback blocked by user interaction restrictions:', err);
      });
    } catch (e) {
      console.log('Audio failed to play:', e);
    }
  };

  useGSAP(
    () => {
      if (!heroRef.current || !canvasMounted || loading || !isEngaged) return;

      // Launch the entrance animation
      createHeroIntro(rootRef.current);

      if (!reducedMotion) {
        // Setup GSAP scroll trigger choreography
        const cleanupScroll = createScrollChoreography3d({
          hero: heroRef.current,
          heroContent: heroContentRef.current ?? undefined,
          heroContentTwo: heroContentTwoRef.current ?? undefined,
          about: aboutRef.current ?? undefined,
          story: storyRef.current ?? undefined,
          scrollCue: scrollCueRef.current?.querySelector('.hero-scroll-cue') as HTMLElement | undefined,
        });

        return () => {
          cleanupScroll();
        };
      }

      // Reduced motion fallback states
      gsap.set('.can-canvas', { opacity: 1 });
      gsap.set('.hero-content-two', { opacity: 1 });
      gsap.set('.hero-scroll-cue', { opacity: 0 });
    },
    { scope: rootRef, dependencies: [reducedMotion, canvasMounted, loading, isEngaged] }
  );

  return (
    <SmoothScroll>
      <div ref={rootRef} className="relative w-full">
        {/* Full-screen high-voltage lightning glitch overlay */}
        <div className="lightning-flash-overlay fixed inset-0 z-[999] pointer-events-none bg-white opacity-0 mix-blend-overlay transition-none" />

        {/* Interactive Energy Entry Prompt */}
        {mounted && !isEngaged && (
          <div
            onClick={() => showStartPrompt && startInitialization()}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202]/95 backdrop-blur-xl transition-all duration-700 ${
              showStartPrompt ? 'cursor-pointer' : 'cursor-wait'
            }`}
          >
            {/* Background ambient glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#ff7120]/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 ${showStartPrompt ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />

            <div className="relative mb-12">
              {/* Ripple Effect */}
              {showStartPrompt && (
                <>
                  <div className="absolute -inset-6 rounded-full border border-[#ff7120]/60 animate-ripple" style={{ animationDelay: '0s' }} />
                  <div className="absolute -inset-10 rounded-full border border-[#ffb300]/40 animate-ripple" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute -inset-14 rounded-full border border-[#ff7120]/20 animate-ripple" style={{ animationDelay: '0.8s' }} />
                </>
              )}

              {/* Icon Background */}
              <div className={`absolute -inset-8 rounded-full transition-all duration-700 ${showStartPrompt ? 'bg-gradient-to-tr from-[#ff7120]/20 to-[#ffb300]/20 scale-110 shadow-[0_0_50px_rgba(255,113,32,0.4)] border border-[#ff7120]/30' : 'bg-[#ff7120]/5 animate-pulse'}`} />

              {/* Lightning Icon */}
              <svg
                className={`relative h-20 w-20 transition-all duration-700 ${showStartPrompt ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-110' : 'text-zinc-700 scale-95'}`}
                viewBox="0 0 24 24"
                fill={showStartPrompt ? "url(#lightning-gradient)" : "none"}
                stroke={showStartPrompt ? "none" : "currentColor"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showStartPrompt && (
                  <defs>
                    <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#c8ff00" />
                      <stop offset="100%" stopColor="#ff7120" />
                    </linearGradient>
                  </defs>
                )}
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>

            <div className={`flex flex-col items-center gap-5 transition-all duration-700 ${showStartPrompt ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h3 
                className="text-3xl md:text-4xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff7120] via-[#ffb300] to-[#ff7120] animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(255,113,32,0.5)]"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
              >
                {showStartPrompt ? "READY TO IGNITE" : "CHARGING"}
              </h3>

              <div className={`px-8 py-3 border border-[#ff7120]/40 bg-[#ff7120]/10 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-[#ff7120]/20 hover:border-[#ff7120]/80 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,113,32,0.4)] cursor-pointer overflow-hidden relative group ${showStartPrompt ? 'opacity-100' : 'opacity-0 scale-95'}`}>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                <p 
                  className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-white uppercase relative z-10"
                  style={{ fontFamily: 'var(--font-space-grotesk), monospace' }}
                >
                  {showStartPrompt ? "Tap Anywhere To Start" : ""}
                </p>
              </div>
            </div>
          </div>
        )}


        
        {/* Navigation Bar */}
        <div className="navigation">
          <div className="navigation-left">
            <p>ZOLT</p>
          </div>
          <div className="navigation-center">
            <a href="#home" className="navigation-description">Home</a>
            <a href="#about" className="navigation-description">About</a>
            <a href="#testimonials" className="navigation-description">Testimonials</a>
            <a href="#faq" className="navigation-description">FAQ</a>
          </div>
          <div className="navigation-right">
            <div className="navigation-right-button">
              <p>Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Monogram Tech Loading Screen */}
        {mounted && (
          <div className={`initial-loading-screen ${!loading ? 'fade-out' : ''}`}>
            <h1 className="gradient-text">ZOLT</h1>
          </div>
        )}

        {/* 3D Canvas Layer Context */}
        {mounted && (
          <CanCanvas
            rotate={rotate}
            setRotate={setRotate}
            onMount={() => setCanvasMounted(true)}
          />
        )}

        {/* Main Dark Grid container wrapping sections */}
        <main className="background-container text-foreground min-h-screen pt-20">
          
          {/* Section 1: Hero (Stage 1) - Natural 80vh height */}
          <section
            ref={heroRef}
            id="home"
            className="hero w-full h-[80vh] relative overflow-hidden"
          >
            {mounted && (
              <CinematicScene variant="hero" active={isEngaged} />
            )}
            <div className="hero-absolute">
              <HeroSection
                heroContentRef={heroContentRef}
                scrollCueRef={scrollCueRef}
              />
            </div>
          </section>

          {/* Section 2: Features (Stage 2) - Natural 86vh height to end at card bottom */}
          <section
            id="features"
            className="features w-full h-[86vh] relative overflow-hidden"
          >
            <FeaturesSection
              heroContentTwoRef={heroContentTwoRef}
              videoRef={videoRef}
              onRotateClick={handleRotateClick}
              videoActive={true}
            />
          </section>

          {/* About Section (Section 3) */}
          <section
            ref={aboutRef}
            id="about"
            className="about w-full"
          >
            <div className="about-content">
              <p className="description" style={{ color: 'var(--accent)' }}>About Zolt Energy</p>
              <h1 className="at-headline">WELCOME TO ZOLT WHERE PERFORMANCE MEETS HYDRATION</h1>
              <p className="about-description">
                Here, we redefine energy for the modern world. Zolt combines sustained cognitive performance with
                clean, electrolyte-balanced hydration, creating an invigorating experience that is as focused as it is
                refreshing. Each sip represents an upgrade—clean energy, zero compromise, and absolute performance.
                This is more than a drink; this is Zolt. Recharge your life. Outrun the moment.
              </p>

              {/* High-Voltage Metrics Counters Grid */}
              <div className="mt-12 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-10 px-4">
                <AnimatedCounter
                  end={150}
                  suffix="mg"
                  label="Active Caffeine"
                  duration={1500}
                />
                <AnimatedCounter
                  end={0}
                  suffix="g"
                  label="Added Sugar"
                  duration={1500}
                />
                <AnimatedCounter
                  end={100}
                  suffix="%"
                  label="Electrolytes"
                  duration={1500}
                />
                <AnimatedCounter
                  end={4.9}
                  decimals={1}
                  suffix="/5"
                  label="Energy Rating"
                  duration={1500}
                />
              </div>
            </div>
          </section>

          {/* Story Section (Section 4) */}
          <section
            ref={storyRef}
            id="story"
            className="story w-full"
          >
            <StorySection />
          </section>

        </main>
      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
      `}</style>
    </SmoothScroll>
  );
}
