import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

const DEG = Math.PI / 180;

/**
 * Creates the high-voltage cinematic entrance sequence for Zolt.
 * Coordinates sequential lightning reveals, can "emergence" on scrollState, shockwave, HUD, and nav chrome.
 */
export function createHeroIntro(container?: HTMLElement | null) {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    const isDesktopRm = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetScaleRm = isDesktopRm ? 1.05 : 0.88;
    const targetYRm = isDesktopRm ? 0.05 : -0.05;
    scrollState.can.scale = targetScaleRm;
    scrollState.can.y = targetYRm;
    scrollState.can.rotX = (isDesktopRm ? -5 : -4) * DEG;
    scrollState.can.rotY = -20 * DEG;
    scrollState.bloomIntensity = 0.28;
    scrollState.energyPulse = 0;
    scrollState.idleSpinY = 0;
    gsap.set('.can-canvas', { opacity: 1, scale: 1 });
    gsap.set('.navigation', { opacity: 1, filter: 'none' });
    gsap.set('.hero-intro-shockwave', { opacity: 0, visibility: 'hidden' });
    gsap.set('.center-content', { opacity: 1, scale: 1 });
    gsap.set('.hero-center-line-inner', { clearProps: 'all' });
    gsap.set('.corner-card', { clearProps: 'skewX,rotateX' });
    if (typeof window !== 'undefined' && (window as any).zoltRevealCenterContent) {
      (window as any).zoltRevealCenterContent();
    }
    return gsap.timeline();
  }

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

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const targetScale = isDesktop ? 1.05 : 0.88;
  const targetY = isDesktop ? 0.05 : -0.05;
  const endRotY = -20 * DEG;

  scrollState.bloomIntensity = 0.28;
  scrollState.energyPulse = 0;
  scrollState.idleSpinY = 0;

  scrollState.can.scale = targetScale;
  scrollState.can.y = targetY;
  scrollState.can.rotX = (isDesktop ? -5 : -4) * DEG;

  gsap.set('.can-canvas', { opacity: 0, scale: 0.9 });

  // Nav chrome: part of the same launch (subtle, no layout change)
  safeFromTo(
    '.navigation',
    { opacity: 0.4, filter: 'blur(6px)' },
    { opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' },
    0.12
  );

  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(0);
    }
  }, 0.1);

  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(1);
    }
  }, 0.7);

  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(2);
    }
  }, 1.3);

  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltStrikeMenuLink) {
      (window as any).zoltStrikeMenuLink(3);
    }
  }, 1.9);

  // Corner cards: micro "snap to spec" after strikes
  safeFromTo(
    '.corner-card',
    { skewX: -4, rotateX: 5 },
    { skewX: 0, rotateX: 0, duration: 0.85, ease: 'elastic.out(1)', stagger: 0.08 },
    2.15
  );

  // Energy pulse + bloom bump as the core "ignites"
  tl.to(scrollState, { energyPulse: 1, bloomIntensity: 0.52, duration: 0.14, ease: 'power2.out' }, 2.32);
  tl.to(scrollState, { energyPulse: 0, bloomIntensity: 0.34, duration: 0.45, ease: 'power2.inOut' }, 2.46);

  // 2D shockwave ring (element lives in LandingPage #home)
  safeFromTo(
    '.hero-intro-shockwave',
    { opacity: 0, scale: 0.2 },
    { opacity: 0.5, scale: 1.35, duration: 0.55, ease: 'expo.out' },
    2.34
  );
  const shock =
    container?.querySelector('.hero-intro-shockwave') ?? document.querySelector('.hero-intro-shockwave');
  if (shock) {
    tl.to(shock, { opacity: 0, scale: 2.1, duration: 0.65, ease: 'power2.in' }, 2.78);
  }

  // Can rig: compressed → full identity in sync with canvas reveal
  tl.fromTo(
    scrollState.can,
    {
      scale: targetScale * 0.28,
      rotY: endRotY + Math.PI * 0.72,
    },
    {
      scale: targetScale,
      rotY: endRotY,
      duration: 2.05,
      ease: 'expo.out',
    },
    2.4
  );

  safeFromTo(
    '.can-canvas',
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 2.2,
      ease: 'expo.out',
      onStart: () => {
        scrollState.idleSpinY = isDesktop ? 0.15 : 0.12;
      },
    },
    2.4
  );

  tl.add(() => {
    if (typeof window !== 'undefined' && (window as any).zoltRevealCenterContent) {
      (window as any).zoltRevealCenterContent();
    }
  }, 2.4);

  // Center HUD lines: clip reveal (targets exist under .center-content)
  safeFromTo(
    '.hero-center-line-inner',
    { yPercent: 110, rotate: 3 },
    {
      yPercent: 0,
      rotate: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.12,
    },
    2.42
  );

  safeFromTo(
    '.hero-scroll-cue',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    3.0
  );

  return tl;
}
