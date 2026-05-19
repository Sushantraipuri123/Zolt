import { forwardRef, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface CinematicSceneProps {
  variant?: 'hero' | 'story';
  active?: boolean;
}

const PARTICLE_COUNT = 24;

const CinematicScene = forwardRef<HTMLDivElement, CinematicSceneProps>(
  function CinematicScene({ variant = 'hero', active = false }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const lightningRef = useRef<SVGSVGElement>(null);
    const ambientFlashRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const root = innerRef.current;
      const lightning = lightningRef.current;
      const flash = ambientFlashRef.current;
      if (!root) return;

      const shouldStrike = variant === 'story' || active;

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

        root.querySelectorAll('[data-particle]').forEach((el, i) => {
          gsap.to(el, {
            y: -30 - (i % 5) * 12,
            x: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 4),
            opacity: 0.15 + (i % 3) * 0.08,
            duration: 4 + (i % 6),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
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
      });

      return () => ctx.revert();
    }, [variant, active]);

    const isHero = variant === 'hero';

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
              'radial-gradient(circle, rgba(90,160,255,0.1) 0%, transparent 70%)',
          }}
        />

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

        {/* Dust particles */}
        <div className="absolute inset-0">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <div
              key={i}
              data-particle
              className="absolute rounded-full bg-white"
              style={{
                width: 1 + (i % 3),
                height: 1 + (i % 3),
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                opacity: 0.08,
              }}
            />
          ))}
        </div>

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
                stroke="#6b8cff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow)"
              />
              
              {/* Branch 1 */}
              <path
                d="M 750 500 L 850 620 L 810 640 L 910 780"
                fill="none"
                stroke="#8ab4ff"
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
                stroke="#8ab4ff"
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
              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent to-[#8ab4ff]/30 opacity-0 pointer-events-none mix-blend-screen"
            />
          </>
        )}
      </div>
    );
  }
);

export default CinematicScene;
