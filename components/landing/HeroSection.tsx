'use client';

import React from 'react';
import ScrollCue from './ScrollCue';

interface HeroSectionProps {
  heroContentRef: React.RefObject<HTMLDivElement | null>;
  scrollCueRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  heroContentRef,
  scrollCueRef,
}: HeroSectionProps) {
  return (
    <div className="relative w-full">
      {/* STAGE 1: Centered Brand Title & Partner Logos */}
      <div ref={heroContentRef} className="hero-content pointer-events-none w-full">
        <div className="hero-text-contents">
          <h1 className="text-behind opacity-blur">
            ZOLT
          </h1>
          <div className="dottedLine opacity-blur">
            <svg viewBox="0 0 800 1" preserveAspectRatio="none">
              <line className="cls-1" y1="0.5" x2="800" y2="0.5" />
            </svg>
          </div>
          <h1 className="text-front opacity-blur">
            ENERGY
          </h1>
          <h2 className="title-description opacity-blur mt-4">
            Clean power. Zero crash. Built for those who outrun the moment.
          </h2>
        </div>

        {/* Partners Marquee Bar */}
        <div className="hero-content-bottom pointer-events-auto">
          <div className="hero-content-bottom-container">
            <div className="hero-content-bottom-item hero-content-bottom-item-first">
              <div className="hero-content-bottom-item-content opacity-blur">
                <img src="/images/chainlink.svg" className="hero-content-bottom-item-image" alt="Chainlink" />
              </div>
            </div>
            <div className="hero-content-bottom-item">
              <div className="hero-content-bottom-item-content opacity-blur">
                <img src="/images/tron.svg" className="hero-content-bottom-item-image" alt="TRON" />
              </div>
            </div>
            <div className="hero-content-bottom-item hero-content-bottom-item-mobile-hiden">
              <div className="hero-content-bottom-item-content opacity-blur">
                <img src="/images/bnb.svg" className="hero-content-bottom-item-image" alt="BNB" />
              </div>
            </div>
            <div className="hero-content-bottom-item">
              <div className="hero-content-bottom-item-content opacity-blur">
                <img src="/images/okx.svg" className="hero-content-bottom-item-image" alt="OKX" />
              </div>
            </div>
            <div className="hero-content-bottom-item hero-content-bottom-item-last">
              <div className="hero-content-bottom-item-content opacity-blur">
                <img src="/images/chainlink.svg" className="hero-content-bottom-item-image" alt="Chainlink" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue chevron */}
      <div ref={scrollCueRef} className="pointer-events-none">
        <ScrollCue className="hero-scroll-cue" />
      </div>
    </div>
  );
}
