import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

const DEG = Math.PI / 180;

export interface ScrollChoreography3dElements {
  hero: HTMLElement;
  heroContent?: HTMLElement;
  heroContentTwo?: HTMLElement;
  heroScene?: HTMLElement;
  scrollCue?: HTMLElement;
  about?: HTMLElement;
  adventure?: HTMLElement;
  gym?: HTMLElement;
  formula?: HTMLElement;
  checkout?: HTMLElement;
}

function setCan(
  x: number,
  y: number,
  z: number,
  rotX: number,
  rotY: number,
  rotZ: number,
  scale: number
) {
  scrollState.can.x = x;
  scrollState.can.y = y;
  scrollState.can.z = z;
  scrollState.can.rotX = rotX * DEG;
  scrollState.can.rotY = rotY * DEG;
  scrollState.can.rotZ = rotZ * DEG;
  scrollState.can.scale = scale;
}

function setCam(
  x: number,
  y: number,
  z: number,
  tx: number,
  ty: number,
  tz: number
) {
  scrollState.camera.x = x;
  scrollState.camera.y = y;
  scrollState.camera.z = z;
  scrollState.camera.targetX = tx;
  scrollState.camera.targetY = ty;
  scrollState.camera.targetZ = tz;
}

export function createScrollChoreography3d(
  elements: ScrollChoreography3dElements,
  reducedMotion = false
) {
  const { 
    hero, 
    heroContent, 
    heroContentTwo, 
    heroScene, 
    scrollCue, 
    about, 
    adventure, 
    gym, 
    formula, 
    checkout 
  } = elements;

  if (reducedMotion) {
    setCan(0, 0.04, 0.05, 8, 35, 0, 0.82);
    setCam(0, 0.1, 5.15, 0, 0.04, 0);
    scrollState.progress = 0;
    scrollState.idleSpinY = 0;
    scrollState.bloomIntensity = 0.28;
    return () => { };
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: '(min-width: 1024px)',
      isMobile: '(max-width: 1023px)',
    },
    (context) => {
      const { isDesktop } = context.conditions as {
        isDesktop: boolean;
        isMobile: boolean;
      };

      if (isDesktop) {
        // Stage 1 Coordinates - Centered, scaled up, tilted slightly
        setCan(0, 0.05, 0, -5, -20, 0, 1.05);
        setCam(0, 0.1, 5.2, 0, 0.05, 0);
        scrollState.rimIntensity = 1.35;
        scrollState.bloomIntensity = 0.28;
        scrollState.idleSpinY = 0.15;
        scrollState.progress = 0;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            scrollState.progress = tl.progress();
            scrollState.idleSpinY = Math.max(0, 0.15 * (1 - tl.progress() * 1.1));
          },
        });

        // Spin, shrink and translate Can to perfectly align inside center video card in Stage 2
        // Performs a full 360 degree head-over-heels flip on the X-axis (Pitch) so we see the top lid and back side!
        tl.to(
          scrollState.can,
          {
            x: 0,
            y: 0.04,
            z: 0.05,
            rotX: (-5 + 360) * DEG,
            rotY: 35 * DEG,
            scale: 0.82,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          0
        );

        // Z-axis (Roll) wobble: tilts 12 degrees out in the middle of the flip and auto-corrects right as it lands
        tl.to(
          scrollState.can,
          {
            rotZ: 12 * DEG,
            duration: 0.3,
            ease: 'power1.out',
          },
          0
        );
        tl.to(
          scrollState.can,
          {
            rotZ: 0,
            duration: 0.3,
            ease: 'power1.in',
          },
          0.3
        );

        tl.to(
          scrollState.camera,
          {
            x: 0,
            y: 0.1,
            z: 5.15,
            targetX: 0,
            targetY: 0.04,
            targetZ: 0,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          0
        );

        tl.to(scrollState, { bloomIntensity: 0.42, rimIntensity: 1.6, duration: 0.6 }, 0);

        setupChoreography(tl, isDesktop);
      } else {
        // Mobile coordinates
        setCan(0, -0.05, 0, -4, -20, 0, 0.88);
        setCam(0, 0.2, 5.6, 0, -0.05, 0);
        scrollState.rimIntensity = 1.2;
        scrollState.bloomIntensity = 0.22;
        scrollState.idleSpinY = 0.12;
        scrollState.progress = 0;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            scrollState.progress = tl.progress();
            scrollState.idleSpinY = Math.max(0, 0.12 * (1 - tl.progress()));
          },
        });

        // Mobile head-over-heels flip
        tl.to(
          scrollState.can,
          {
            y: -0.12,
            rotX: (-4 + 360) * DEG,
            rotY: 35 * DEG,
            scale: 0.72,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          0
        );

        // Mobile Z-axis wobble
        tl.to(
          scrollState.can,
          {
            rotZ: 10 * DEG,
            duration: 0.3,
            ease: 'power1.out',
          },
          0
        );
        tl.to(
          scrollState.can,
          {
            rotZ: 0,
            duration: 0.3,
            ease: 'power1.in',
          },
          0.3
        );

        tl.to(
          scrollState.camera,
          {
            y: 0.15,
            z: 5.4,
            targetY: -0.12,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          0
        );

        tl.to(scrollState, { idleSpinY: 0, duration: 0.6 }, 0);

        setupChoreography(tl, isDesktop);
      }

      function setupChoreography(tl: gsap.core.Timeline, desktop: boolean) {
        // Stage 1 Content fades out
        if (heroContent) {
          tl.fromTo(
            heroContent,
            { opacity: 1, y: 0, filter: 'blur(0px)' },
            {
              opacity: 0,
              y: -50,
              filter: 'blur(8px)',
              duration: 0.35,
              ease: 'power2.in',
            },
            0
          );
        }

        if (scrollCue) {
          tl.to(scrollCue, { opacity: 0, y: -12, duration: 0.15, ease: 'power2.in' }, 0);
        }

        // Stage 2 Content fades and slides in
        if (heroContentTwo) {
          const leftCol = heroContentTwo.querySelector('.hero-content-two-left');
          const rightCol = heroContentTwo.querySelector('.hero-content-two-right');
          const centerCol = heroContentTwo.querySelector('.hero-content-two-center');

          if (desktop) {
            if (centerCol) {
              tl.fromTo(
                centerCol,
                { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' },
                0.25
              );
            }
            if (leftCol) {
              tl.fromTo(
                leftCol,
                { opacity: 0, x: -40, filter: 'blur(6px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' },
                0.35
              );
            }
            if (rightCol) {
              tl.fromTo(
                rightCol,
                { opacity: 0, x: 40, filter: 'blur(6px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' },
                0.35
              );
            }
          } else {
            // Mobile entrance - center video element fades in
            if (centerCol) {
              tl.fromTo(
                centerCol,
                { opacity: 0, scale: 0.95, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out' },
                0.25
              );
            }
          }
        }

        if (heroScene) {
          const slow = heroScene.querySelector('.scene-parallax-slow');
          if (slow) {
            tl.to(slow, { y: -60, opacity: 0.05, duration: 0.4, ease: 'power1.in' }, 0);
          }
        }

        // Section 1 -> Section 2 ScrollTrigger
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top', // Exactly 80vh of scroll when Section 1 leaves the viewport
          scrub: 0.8,
          animation: tl,
          invalidateOnRefresh: true,
        });

        // ----------------------------------------------------
        // Stage 3: About -> Adventure (Section 3 -> Section 4)
        // ----------------------------------------------------
        if (adventure) {
          const tlAdventure = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: adventure,
              start: 'top bottom', // when adventure top enters viewport bottom
              end: 'top top',    // when adventure top reaches viewport top
              scrub: 1.2,
              invalidateOnRefresh: true,
            }
          });

          if (desktop) {
            tlAdventure.to(scrollState.can, {
              x: 0.42,
              y: 0.02,
              z: 0,
              rotX: 10 * DEG,
              rotY: 45 * DEG,
              rotZ: 8 * DEG,
              scale: 0.85,
            });
          } else {
            tlAdventure.to(scrollState.can, {
              x: 0,
              y: -0.15,
              z: 0,
              rotX: 8 * DEG,
              rotY: 45 * DEG,
              rotZ: 4 * DEG,
              scale: 0.72,
            });
          }
        }

        // ----------------------------------------------------
        // Stage 4: Adventure -> Gym (Section 4 -> Section 5)
        // ----------------------------------------------------
        if (gym) {
          const tlGym = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: gym,
              start: 'top bottom',
              end: 'top top',
              scrub: 1.2,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                // If we scroll past the trigger line into Gym, execute high-velocity slam shockwave
                if (self.isActive && self.direction === 1) {
                  triggerSlamEffect();
                }
              }
            }
          });

          // Accelerates and tumbles
          if (desktop) {
            tlGym.to(scrollState.can, {
              x: -0.45,
              y: -0.05,
              z: 0.05,
              rotX: 5 * DEG,
              rotY: 765 * DEG, // adds 720 degree spin
              rotZ: -5 * DEG,
              scale: 0.85,
            });
          } else {
            tlGym.to(scrollState.can, {
              x: 0,
              y: -0.1,
              z: 0.05,
              rotX: 5 * DEG,
              rotY: 765 * DEG,
              rotZ: -2 * DEG,
              scale: 0.72,
            });
          }
        }

        // ----------------------------------------------------
        // Stage 5: Gym -> Formula (Section 5 -> Section 6)
        // ----------------------------------------------------
        if (formula) {
          const tlFormula = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: formula,
              start: 'top bottom',
              end: 'top top',
              scrub: 1.2,
              invalidateOnRefresh: true,
            }
          });

          // Core spin centered and scaled up
          if (desktop) {
            tlFormula.to(scrollState.can, {
              x: 0,
              y: 0.05,
              z: 0.25,
              rotX: 0 * DEG,
              rotY: 1125 * DEG, // adds 360 degree spin
              rotZ: 0 * DEG,
              scale: 1.28,
            });
          } else {
            tlFormula.to(scrollState.can, {
              x: 0,
              y: -0.05,
              z: 0.2,
              rotX: 0 * DEG,
              rotY: 1125 * DEG,
              rotZ: 0 * DEG,
              scale: 1.05,
            });
          }
        }

        // ----------------------------------------------------
        // Stage 6: Formula -> Checkout (Section 6 -> Section 7)
        // ----------------------------------------------------
        if (checkout) {
          const tlCheckout = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: checkout,
              start: 'top bottom',
              end: 'top top',
              scrub: 1.2,
              invalidateOnRefresh: true,
            }
          });

          // Settles into perfect close-up logo angle next to buys
          if (desktop) {
            tlCheckout.to(scrollState.can, {
              x: -0.52,
              y: -0.08,
              z: 0.1,
              rotX: 8 * DEG,
              rotY: 1170 * DEG, // elegant tilt
              rotZ: -3 * DEG,
              scale: 0.9,
            });
          } else {
            tlCheckout.to(scrollState.can, {
              x: 0,
              y: -0.16,
              z: 0.05,
              rotX: 8 * DEG,
              rotY: 1170 * DEG,
              rotZ: -2 * DEG,
              scale: 0.75,
            });
          }
        }

        // ----------------------------------------------------
        // High-Voltage Impact Shockwave Helper
        // ----------------------------------------------------
        function triggerSlamEffect() {
          if (gsap.isTweening('.can-canvas') || gsap.isTweening('.lightning-flash-overlay')) return;

          // Severe vibration impact screen-shake on the WebGL canvas element
          gsap.fromTo(
            '.can-canvas',
            { x: -8, y: 8 },
            {
              x: 0,
              y: 0,
              duration: 0.35,
              ease: 'bounce.out',
              clearProps: 'transform',
            }
          );

          // Intense lightning-flash glow pulse
          gsap.fromTo(
            '.lightning-flash-overlay',
            { opacity: 0.55 },
            {
              opacity: 0,
              duration: 0.45,
              ease: 'power2.out',
            }
          );
        }

      }
    }
  );

  return () => mm.revert();
}

