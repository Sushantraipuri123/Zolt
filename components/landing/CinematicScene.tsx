import { forwardRef, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CinematicSceneProps {
  variant?: 'hero' | 'story';
  active?: boolean;
}

const PARTICLE_COUNT_STORY = 24;
const PARTICLE_COUNT_HERO = 72;

const CinematicScene = forwardRef<HTMLDivElement, CinematicSceneProps>(
  function CinematicScene({ variant = 'hero', active = false }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const lightningRef = useRef<SVGSVGElement>(null);
    const ambientFlashRef = useRef<HTMLDivElement>(null);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
      const root = innerRef.current;
      const lightning = lightningRef.current;
      const flash = ambientFlashRef.current;
      if (!root) return;

      const shouldStrike = variant === 'story' || active;
      const isHero = variant === 'hero';

      const ctx = gsap.context(() => {
        // High-voltage double electrical lightning discharge
        if (shouldStrike && lightning && flash) {
          const lt = gsap.timeline({ delay: 0.15 });
          
          // First strike (rapid triple-flicker)
          lt.to(lightning, { opacity: 0.85, duration: 0.03 })
            .to(lightning, { opacity: 0.05, duration: 0.02 })
            .to(lightning, { opacity: 0.95, duration: 0.04 })
            .to(lightning, { opacity: 0, duration: 0.04 })
            .to(lightning, { opacity: 0.7, duration: 0.03 })
            .to(lightning, { opacity: 0, duration: 0.35, ease: 'power2.out' });

          lt.to(flash, { opacity: 0.18, duration: 0.03 }, 0)
            .to(flash, { opacity: 0.01, duration: 0.02 }, 0.03)
            .to(flash, { opacity: 0.24, duration: 0.04 }, 0.05)
            .to(flash, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.09);

          // Second strike (double flicker strike, slightly delayed)
          lt.to(lightning, { opacity: 0.9, duration: 0.03 }, 0.65)
            .to(lightning, { opacity: 0.05, duration: 0.02 }, 0.68)
            .to(lightning, { opacity: 0.8, duration: 0.04 }, 0.70)
            .to(lightning, { opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.74);

          lt.to(flash, { opacity: 0.15, duration: 0.03 }, 0.65)
            .to(flash, { opacity: 0.01, duration: 0.02 }, 0.68)
            .to(flash, { opacity: 0.22, duration: 0.04 }, 0.70)
            .to(flash, { opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.74);
        }

        if (!reducedMotion) {
          root.querySelectorAll('[data-particle]').forEach((el, i) => {
            gsap.to(el, {
              y: -30 - (i % 5) * 12,
              x: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 4),
              opacity: 0.15 + (i % 3) * 0.08,
              duration: 4 + (i % 6),
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.12,
            });
          });

          root.querySelectorAll('[data-smoke]').forEach((el, i) => {
            gsap.to(el, {
              y: 40 + i * 10,
              opacity: 0.2,
              scale: 1.05,
              duration: 10 + i * 2,
              ease: 'none',
              yoyo: true,
              repeat: -1,
            });
          });

          if (isHero) {
            root.querySelectorAll('[data-hero-beam]').forEach((el, i) => {
              gsap.to(el, {
                x: (i % 2 === 0 ? 1 : -1) * (18 + i * 6),
                opacity: 0.22 + (i % 3) * 0.06,
                duration: 14 + i * 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * 0.4,
              });
            });
            root.querySelectorAll('[data-reactor-ring]').forEach((el, i) => {
              gsap.to(el, {
                opacity: 0.06 + i * 0.05,
                duration: 5 + i * 1.2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * 0.35,
              });
            });
            root.querySelectorAll('[data-hero-streak]').forEach((el, i) => {
              gsap.fromTo(
                el,
                { xPercent: -120 },
                {
                  xPercent: 140,
                  duration: 9 + i * 2.5,
                  ease: 'none',
                  repeat: -1,
                  delay: i * 1.8,
                }
              );
            });
          }
        }
      });

      return () => ctx.revert();
    }, [variant, active, reducedMotion]);

    const isHero = variant === 'hero';
    const particleCount = isHero ? PARTICLE_COUNT_HERO : PARTICLE_COUNT_STORY;

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
        {/* Depth layer — far */}
        <div
          className="scene-parallax-slow absolute -left-[20%] top-[10%] h-[80vh] w-[70vw] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(107,140,255,0.14) 0%, transparent 68%)',
          }}
        />

        {/* Depth layer — mid */}
        <div
          className={`scene-parallax-mid absolute rounded-full ${
            isHero
              ? 'right-[-15%] top-[20%] h-[65vh] w-[55vw] opacity-40'
              : 'right-[-10%] top-[30%] h-[50vh] w-[45vw] opacity-25'
          }`}
          style={{
            background:
              isHero
                ? 'radial-gradient(circle, rgba(255,113,32,0.08) 0%, rgba(90,160,255,0.12) 42%, transparent 72%)'
                : 'radial-gradient(circle, rgba(90,160,255,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Power core — very slow radial breathing behind scene center */}
        {isHero && (
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[min(85vh,900px)] w-[min(95vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen hero-core-breathe"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,113,32,0.12) 0%, rgba(0,229,255,0.12) 38%, rgba(100,160,255,0.05) 52%, transparent 65%)',
              transform: 'translate(-50%, calc(-50% + var(--heroScroll, 0) * -18px))',
            }}
          />
        )}

        {isHero && (
          <>
            <div
              data-hero-beam
              className="pointer-events-none absolute -left-[8%] top-0 z-[1] h-[115%] w-[38%] -skew-x-[12deg] opacity-20 mix-blend-plus-lighter blur-3xl"
              style={{
                background:
                  'linear-gradient(105deg, transparent 0%, rgba(255,113,32,0.35) 40%, rgba(0,229,255,0.12) 70%, transparent 100%)',
              }}
            />
            <div
              data-hero-beam
              className="pointer-events-none absolute -right-[5%] top-[5%] z-[1] h-[100%] w-[32%] skew-x-[10deg] opacity-[0.18] mix-blend-screen blur-[56px]"
              style={{
                background:
                  'linear-gradient(-95deg, transparent 0%, rgba(0,229,255,0.22) 45%, rgba(255,113,32,0.08) 78%, transparent 100%)',
              }}
            />
            <div
              data-hero-beam
              className="pointer-events-none absolute left-[22%] top-[12%] z-[1] h-[88%] w-[22%] -skew-x-[6deg] opacity-14 mix-blend-soft-light blur-[48px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,180,90,0.2) 0%, transparent 55%, rgba(0,229,255,0.08) 100%)',
              }}
            />
          </>
        )}

        {isHero && (
          <div
            className="pointer-events-none absolute left-1/2 top-[44%] z-[1] h-[min(90vh,920px)] w-[min(96vw,920px)] -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`ring-${i}`}
                data-reactor-ring
                className="absolute left-1/2 top-1/2 rounded-full border border-[color-mix(in_srgb,var(--accent)_38%,transparent)] opacity-20"
                style={{
                  width: `${38 + i * 11}%`,
                  height: `${38 + i * 11}%`,
                  transform: `translate(-50%, -50%) scale(${0.92 + i * 0.04})`,
                  boxShadow: '0 0 40px rgba(255,113,32,0.06), inset 0 0 60px rgba(0,229,255,0.04)',
                }}
              />
            ))}
          </div>
        )}

        {isHero && (
          <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden mix-blend-screen opacity-30">
            {[0, 1, 2].map((i) => (
              <div
                key={`streak-${i}`}
                data-hero-streak
                className="hero-light-streak absolute left-0 top-0 h-full w-[45%] -translate-x-1/2"
                style={{
                  top: `${18 + i * 22}%`,
                  height: '2px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), rgba(255,113,32,0.45), transparent)',
                  opacity: 0.35,
                  filter: 'blur(0.5px)',
                }}
              />
            ))}
          </div>
        )}

        {/* Floor haze */}
        <div
          className="scene-parallax-fast absolute bottom-0 left-0 right-0 h-[45vh] opacity-50"
          style={{
            background:
              'linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(107,140,255,0.04) 40%, transparent 100%)',
          }}
        />

        {/* Smoke layers */}
        <div
          data-smoke
          className="absolute bottom-[15%] left-[10%] h-[40vh] w-[50vw] opacity-10"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          data-smoke
          className="absolute bottom-[20%] right-[5%] h-[35vh] w-[45vw] opacity-10"
          style={{
            background:
              'radial-gradient(ellipse, rgba(107,140,255,0.06) 0%, transparent 72%)',
          }}
        />

        {/* Dust / energy particles */}
        <div className="absolute inset-0">
          {Array.from({ length: particleCount }).map((_, i) => {
            const accent = i % 4 === 0;
            const cyan = i % 4 === 1;
            return (
              <div
                key={i}
                data-particle
                className={`absolute rounded-full ${accent ? 'bg-[var(--accent)]' : cyan ? 'bg-[var(--accent-cyan)]' : 'bg-white'}`}
                style={{
                  width: 1 + (i % 4),
                  height: 1 + (i % 4),
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 19) % 100}%`,
                  opacity: accent ? 0.14 : cyan ? 0.12 : 0.07,
                  boxShadow:
                    accent || cyan
                      ? '0 0 10px rgba(255,113,32,0.25), 0 0 14px rgba(0,229,255,0.12)'
                      : undefined,
                }}
              />
            );
          })}
        </div>

        <div
          data-smoke
          className="absolute bottom-[12%] left-1/2 h-[38vh] w-[55vw] -translate-x-1/2 opacity-[0.07]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(200,255,255,0.06) 0%, transparent 72%)',
          }}
        />
        <div
          data-smoke
          className="absolute top-[18%] right-[8%] h-[28vh] w-[38vw] opacity-[0.06]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 75%)',
          }}
        />

        {/* Vignette */}
        <div
          className="scene-vignette absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.65)',
          }}
        />

        {isHero && (
          <>
            {/* SVG Lightning Bolt Backdrop */}
            <svg
              ref={lightningRef}
              className="absolute inset-0 z-10 h-full w-full opacity-0 pointer-events-none scale-x-[-1]"
              viewBox="0 0 1920 1080"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <filter id="electric-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" result="blur1" />
                  <feGaussianBlur stdDeviation="4" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main electric discharge line */}
              <path
                d="M 680 -50 L 700 180 L 650 220 L 750 500 L 670 540 L 800 820 L 750 860 L 880 1150"
                fill="none"
                stroke="#ff7120"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow)"
              />
              
              {/* Branch 1 */}
              <path
                d="M 750 500 L 850 620 L 810 640 L 910 780"
                fill="none"
                stroke="#ffb300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow)"
                opacity="0.8"
              />

              {/* Branch 2 */}
              <path
                d="M 670 540 L 590 680 L 630 710 L 550 850"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow)"
                opacity="0.75"
              />

              {/* Inner hot core */}
              <path
                d="M 680 -50 L 700 180 L 650 220 L 750 500 L 670 540 L 800 820 L 750 860 L 880 1150"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Ambient Lightning Flash Overlay */}
            <div
              ref={ambientFlashRef}
              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#ff7120]/25 to-[#00e5ff]/25 opacity-0 pointer-events-none mix-blend-screen"
            />
          </>
        )}
      </div>
    );
  }
);

export default CinematicScene;
