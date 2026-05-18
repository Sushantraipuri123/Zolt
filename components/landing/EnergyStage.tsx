'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { landingCopy } from '@/content/landing';

interface EnergyStageProps {
  variant?: 'hero' | 'story';
}

const SPARK_COUNT = 18;

const EnergyStage = forwardRef<HTMLDivElement, EnergyStageProps>(
  function EnergyStage({ variant = 'hero' }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);
    const isHero = variant === 'hero';

    useEffect(() => {
      const root = innerRef.current;
      const ring = ringRef.current;
      const orb = orbRef.current;
      if (!root || !isHero) return;

      const ctx = gsap.context(() => {
        if (ring) {
          gsap.fromTo(
            ring,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.15 }
          );
        }
        if (orb) {
          gsap.fromTo(
            orb,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out', delay: 0.1 }
          );
        }

        root.querySelectorAll('[data-spark]').forEach((el, i) => {
          gsap.to(el, {
            y: -20 - (i % 4) * 10,
            x: (i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 3),
            opacity: 0.2 + (i % 3) * 0.15,
            duration: 3 + (i % 5) * 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.12,
          });
        });
      });

      return () => ctx.revert();
    }, [isHero]);

    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        {isHero ? (
          <>
            <div
              ref={orbRef}
              className="energy-orb scene-parallax-slow absolute right-[-5%] top-[8%] h-[85vh] w-[70vw] opacity-0 md:right-[0%] md:w-[58vw]"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(77,124,255,0.22) 0%, rgba(0,229,255,0.06) 35%, transparent 68%)',
              }}
            />

            <div
              ref={ringRef}
              className="energy-ring energy-ring-spin absolute right-[8%] top-[22%] h-[min(72vw,520px)] w-[min(72vw,520px)] opacity-0 md:right-[12%]"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(0,229,255,0.12) 15%, transparent 30%, rgba(77,124,255,0.18) 50%, transparent 65%, rgba(200,255,0,0.08) 80%, transparent 100%)',
                borderRadius: '50%',
                mask: 'radial-gradient(circle, transparent 42%, black 43%, black 48%, transparent 49%)',
                WebkitMask:
                  'radial-gradient(circle, transparent 42%, black 43%, black 48%, transparent 49%)',
              }}
            />

            <p
              className="absolute right-[2%] top-[18%] select-none text-[clamp(6rem,18vw,14rem)] font-black leading-none tracking-[-0.06em] text-white/[0.03] md:right-[6%]"
              aria-hidden
            >
              {landingCopy.hero.ghost}
            </p>

            <div
              className="hero-light-sweep absolute inset-0 z-[1] opacity-0"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(0,229,255,0.08) 48%, rgba(255,255,255,0.12) 50%, rgba(0,229,255,0.06) 52%, transparent 60%)',
              }}
            />

            <div className="absolute inset-0">
              {Array.from({ length: SPARK_COUNT }).map((_, i) => (
                <div
                  key={i}
                  data-spark
                  className="absolute rounded-full"
                  style={{
                    width: i % 4 === 0 ? 2 : 1,
                    height: i % 4 === 0 ? 2 : 1,
                    left: `${55 + ((i * 13) % 40)}%`,
                    top: `${15 + ((i * 19) % 70)}%`,
                    opacity: 0.1,
                    background: i % 5 === 0 ? 'var(--accent-spark)' : 'var(--accent-cyan)',
                    boxShadow:
                      i % 5 === 0
                        ? '0 0 6px rgba(200,255,0,0.6)'
                        : '0 0 4px rgba(0,229,255,0.5)',
                  }}
                />
              ))}
            </div>

            <div
              className="scene-parallax-fast absolute bottom-0 left-0 right-0 h-[40vh]"
              style={{
                background:
                  'linear-gradient(0deg, #020202 0%, rgba(2,2,2,0.6) 50%, transparent 100%)',
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 75% 65% at 55% 45%, transparent 25%, rgba(0,0,0,0.5) 100%)',
              }}
            />
          </>
        ) : (
          <>
            <div className="story-scanlines absolute inset-0 opacity-60" aria-hidden />
            <div
              className="absolute left-[-10%] top-[20%] h-[50vh] w-[50vw] rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(77,124,255,0.08) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[30vh]"
              style={{
                background: 'linear-gradient(0deg, #020202 0%, transparent 100%)',
              }}
            />
          </>
        )}
      </div>
    );
  }
);

export default EnergyStage;
