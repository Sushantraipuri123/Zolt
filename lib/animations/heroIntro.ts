import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

/**
 * Creates the high-voltage cinematic entrance sequence for Zolt.
 * Coordinates 4 sequential canvas fractal lightning reveals followed by a majestic, liquid-smooth
 * Can scale-up and HUD swell, completely matched to the center content animation and resolved within 4.0s.
 */
export function createHeroIntro(container?: HTMLElement | null) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.05,
  });

  const q = (selector: string) =>
    container ? container.querySelectorAll(selector) : document.querySelectorAll(selector);

  const safeFromTo = (
    selector: string,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    position?: string | number
  ) => {
    const targets = q(selector);
    if (targets && targets.length > 0) {
      tl.fromTo(targets, fromVars, toVars, position);
    }
  };

  // Determine responsive resting position matching scrollChoreography3d initial values
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const targetScale = isDesktop ? 1.05 : 0.88;
  const targetY = isDesktop ? 0.05 : -0.05;

  // Initialize WebGL/3D states prior to Phase 1 trigger
  scrollState.bloomIntensity = 0.28;
  scrollState.energyPulse = 0;
  scrollState.idleSpinY = 0;

  // Keep the Can model immediately at its resting target coordinates to avoid scale jumps inside WebGL
  scrollState.can.scale = targetScale; 
  scrollState.can.y = targetY; 
  scrollState.can.rotX = (isDesktop ? -5 : -4) * (Math.PI / 180);

  // Set the 3D Canvas element scale to 0.9 and opacity to 0 immediately at the start of the page load
  gsap.set('.can-canvas', { opacity: 0, scale: 0.9 });

  // ----------------------------------------------------
  // LIGHTNING STRIKE 1: REVEAL TOP-LEFT HEADING (0.1s)
  // ----------------------------------------------------
  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(0);
    }
  }, 0.1);

  // ----------------------------------------------------
  // LIGHTNING STRIKE 2: REVEAL BOTTOM-LEFT HEADING (0.7s)
  // ----------------------------------------------------
  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(1);
    }
  }, 0.7);

  // ----------------------------------------------------
  // LIGHTNING STRIKE 3: REVEAL TOP-RIGHT HEADING (1.3s)
  // ----------------------------------------------------
  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(2);
    }
  }, 1.3);

  // ----------------------------------------------------
  // LIGHTNING STRIKE 4: REVEAL BOTTOM-RIGHT HEADING (1.9s)
  // ----------------------------------------------------
  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(3);
    }
  }, 1.9);

  // ----------------------------------------------------
  // THE GRACEFUL UNISON REVEAL (2.4s)
  // Both the 3D Can canvas container and the Center HUD scale and fade up in perfect visual harmony.
  // No lightning or flashes around the Can.
  // ----------------------------------------------------

  // 1. Can Canvas Fade & Scale Up: matches center-content exactly (starts at scale 0.9, ends at 1.0)
  safeFromTo(
    '.can-canvas',
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 2.2, // Increased for ultimate slow, buttery cinematic sweep!
      ease: 'expo.out', // Identical smooth exponential cushion ease!
      onStart: () => {
        // Activate standard idle spin once scale begins
        scrollState.idleSpinY = isDesktop ? 0.15 : 0.12;
      }
    },
    2.4
  );

  // 2. Fade up the System Online HUD underneath
  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltRevealCenterContent) {
      (window as any).zoltRevealCenterContent();
    }
  }, 2.4);

  // 3. Fade in scroll cue chevron
  safeFromTo(
    '.hero-scroll-cue',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    3.0
  );

  return tl;
}
