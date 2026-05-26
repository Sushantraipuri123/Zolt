'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

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
  const reduceMotion = useReducedMotion();

  const itemVariants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 },
        },
      };

  return (
    <div className=" w-full  h-dvh">
      {/* STAGE 2: Product Columns & Video Showcase */}
      <motion.div
        ref={heroContentTwoRef}
        className="hero-content hero-content-two pointer-events-auto w-full "
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.08 },
          },
        }}
      >
        {/* Left Column: Ingredients */}
        <motion.div variants={itemVariants} className="hero-content-two-left">
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
        </motion.div>

        {/* Center Video Card with mobile controls */}
        <motion.div variants={itemVariants} className="hero-content-two-center flex items-center justify-center ">
          <video
            ref={videoRef}
            className={`hero-content-two-center-video ${videoActive ? 'active' : ''}`}
            src="/videos/water4.mp4"
            playsInline
            autoPlay
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
        </motion.div>

        {/* Right Column: Introduction */}
        <motion.div variants={itemVariants} className="hero-content-two-right">
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
        </motion.div>
      </motion.div>
    </div>
  );
}
