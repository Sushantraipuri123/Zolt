'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
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

  // States for Rotate Zolt click micro-interaction
  const [rotate, setRotate] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Diminish initial loader screen after 1.1s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

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
      if (!heroRef.current || !canvasMounted || loading) return;

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
    { scope: rootRef, dependencies: [reducedMotion, canvasMounted, loading] }
  );

  return (
    <SmoothScroll>
      <div ref={rootRef} className="relative w-full">
        
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
    </SmoothScroll>
  );
}
