'use client';

import React from 'react';

interface FeaturesSectionProps {
  heroContentTwoRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onRotateClick: () => void;
  videoActive: boolean;
}

export default function FeaturesSection({
  heroContentTwoRef,
  videoRef,
  onRotateClick,
  videoActive,
}: FeaturesSectionProps) {
  return (
    <div className="relative w-full">
      {/* STAGE 2: Product Columns & Video Showcase */}
      <div ref={heroContentTwoRef} className="hero-content hero-content-two pointer-events-auto w-full">
        {/* Left Column: Ingredients */}
        <div className="hero-content-two-left">
          <div className="hero-content-two-item">
            <p className="description">High-Voltage Energy</p>
            <h3 className="at-subheadline">Zolt <br /> Splash</h3>
            <p className="description">330ml with Zero Sugar</p>
          </div>
          <div className="hero-content-two-item">
            <p className="at-description">INGREDIENTS</p>
            <p className="description">
              Caffeine, Natural Flavor, Magnesium Citrate, Sodium Citrate, Stevia Extract
            </p>
          </div>
        </div>

        {/* Center Video Card with mobile controls */}
        <div className="hero-content-two-center flex items-center justify-center">
          <video
            ref={videoRef}
            className={`hero-content-two-center-video ${videoActive ? 'active' : ''}`}
            src="/videos/water4.mp4#t=0.1"
            playsInline
            muted
            loop
          />
          {/* Hide-on-desktop button */}
          <div
            className="hero-content-two-center-button hero-content-two-center-button-hide-on-desktop pointer-events-auto"
            onClick={onRotateClick}
          >
            <p className="description">Rotate Zolt</p>
          </div>
        </div>

        {/* Right Column: Introduction */}
        <div className="hero-content-two-right">
          <div className="hero-content-two-item">
            <p className="at-description">INTRODUCTION TO ZOLT</p>
            <p className="description">
              Zolt Splash is the world’s first high-voltage energy drink, blending cutting-edge performance
              with clean hydration. Designed for active high-performers, Zolt combines sharp cognitive focus
              with zero compromise, redefining how you charge and energize.
            </p>
          </div>
          <div
            className="hero-content-two-center-button pointer-events-auto cursor-pointer"
            onClick={onRotateClick}
          >
            <p className="description">Rotate Zolt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
