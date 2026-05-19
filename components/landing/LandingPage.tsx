'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CinematicScene from '@/components/landing/CinematicScene';
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

  const reducedMotion = usePrefersReducedMotion();
  
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEngaged, setIsEngaged] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const audioManager = useRef<any>(null);

  // States for Rotate Zolt click micro-interaction
  const [rotate, setRotate] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

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

  // Handle click to rotate can and play sound + video splash
  const handleRotateClick = () => {
    setRotate(true);

    // 1. Play splash water video inside the rounded card
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setVideoActive(true);
      }).catch((err) => {
        console.log('Video autoplay blocked:', err);
      });
    }

    // 2. Play Soda Opening audio sound effect
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

  // Turn off active video frame highlight when video ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoActive(false);
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [canvasMounted]);

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

        {/* Interactive System Entry Prompt */}
        {mounted && !isEngaged && (
          <div
            onClick={() => showStartPrompt && startInitialization()}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030305]/98 backdrop-blur-md transition-all duration-500 ${
              showStartPrompt ? 'cursor-pointer' : 'cursor-wait'
            }`}
          >
            <div className="relative mb-10">
              {/* Ripple Effect */}
              {showStartPrompt && (
                <>
                  <div className="absolute -inset-4 rounded-full border border-indigo-500/30 animate-ripple" style={{ animationDelay: '0s' }} />
                  <div className="absolute -inset-8 rounded-full border border-indigo-500/20 animate-ripple" style={{ animationDelay: '0.6s' }} />
                  <div className="absolute -inset-12 rounded-full border border-indigo-500/10 animate-ripple" style={{ animationDelay: '1.2s' }} />
                </>
              )}

              {/* Icon Background */}
              <div className={`absolute -inset-6 rounded-full bg-indigo-500/5 transition-all duration-500 ${showStartPrompt ? 'bg-indigo-500/20 scale-110 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'animate-pulse'}`} />

              {/* Custom SVG CPU Icon */}
              <svg
                className={`relative h-16 w-16 transition-all duration-500 ${showStartPrompt ? 'text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'text-zinc-600'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
                <path d="M9 1v3" />
                <path d="M15 1v3" />
                <path d="M9 20v3" />
                <path d="M15 20v3" />
                <path d="M20 9h3" />
                <path d="M20 15h3" />
                <path d="M1 9h3" />
                <path d="M1 15h3" />
              </svg>
            </div>

            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${showStartPrompt ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'}`}>
              <h3 className={`text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${showStartPrompt ? 'text-white' : 'text-zinc-500'}`}>
                {showStartPrompt ? "SYSTEM READY" : "INITIALIZING"}
              </h3>

              <div className={`px-6 py-2 border border-indigo-500/30 bg-indigo-500/5 rounded-full backdrop-blur-md transition-all duration-300 ${showStartPrompt ? 'opacity-100 hover:bg-indigo-500/10 hover:border-indigo-500/50' : 'opacity-0 scale-95'}`}>
                <p className="text-[10px] tracking-[0.2em] text-indigo-300 uppercase">
                  {showStartPrompt ? "Click anywhere to Start" : ""}
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

          {/* Section 2: Features (Stage 2) - Natural 100vh height */}
          <section
            id="features"
            className="features w-full h-[100vh] relative overflow-hidden"
          >
            <FeaturesSection
              heroContentTwoRef={heroContentTwoRef}
              videoRef={videoRef}
              onRotateClick={handleRotateClick}
              videoActive={videoActive}
            />
          </section>

          {/* About Section */}
          <section
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
            </div>
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
