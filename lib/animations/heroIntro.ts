import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

const DEG = Math.PI / 180;

/**
 * Cinematic hero entrance: DOM ring/platform, headline + stats + CTA stagger,
 * shockwave + can emergence + canvas reveal (unchanged handoff to scroll choreography).
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
    gsap.set('.hero-headline-line-inner', { clearProps: 'all' });
    gsap.set('.hero-eyebrow', { clearProps: 'all' });
    gsap.set('.hero-body-copy', { clearProps: 'all' });
    gsap.set('.hero-cta-wrap', { clearProps: 'all' });
    gsap.set('.hero-trailer-row', { clearProps: 'all' });
    gsap.set('.hero-stat-row', { clearProps: 'all' });
    gsap.set('.hero-energy-platform', { opacity: 1, scale: 1 });
    gsap.set('.hero-orbit-ring-scale', { opacity: 1, scale: 1 });
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
  gsap.set('.hero-energy-platform', { opacity: 0, scale: 0.88 });
  gsap.set('.hero-orbit-ring-scale', { opacity: 0, scale: 0.92 });

  // Nav chrome
  safeFromTo(
    '.navigation',
    { opacity: 0.4, filter: 'blur(6px)' },
    { opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' },
    0.12
  );

  // Ring + platform (hero-only DOM; scroll fade on .hero-fx-layer)
  safeFromTo(
    '.hero-orbit-ring-scale',
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.95, ease: 'power3.out' },
    0.18
  );
  safeFromTo(
    '.hero-energy-platform',
    { opacity: 0, scale: 0.88 },
    { opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' },
    0.28
  );

  safeFromTo(
    '.hero-eyebrow',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.65 },
    0.35
  );

  safeFromTo(
    '.hero-headline-line-inner',
    { yPercent: 110, rotate: 2 },
    {
      yPercent: 0,
      rotate: 0,
      duration: 0.95,
      ease: 'power4.out',
      stagger: 0.12,
    },
    0.48
  );

  safeFromTo(
    '.hero-body-copy',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7 },
    0.72
  );

  safeFromTo(
    '.hero-stat-row',
    { opacity: 0, x: isDesktop ? 28 : 0, y: isDesktop ? 0 : 10 },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.72,
      ease: 'power3.out',
      stagger: 0.1,
    },
    0.58
  );

  safeFromTo(
    '.hero-cta-wrap',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.65 },
    1.05
  );

  safeFromTo(
    '.hero-trailer-row',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6 },
    1.22
  );

  // Energy pulse + bloom bump
  tl.to(scrollState, { energyPulse: 1, bloomIntensity: 0.52, duration: 0.14, ease: 'power2.out' }, 2.32);
  tl.to(scrollState, { energyPulse: 0, bloomIntensity: 0.34, duration: 0.45, ease: 'power2.inOut' }, 2.46);

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

  safeFromTo(
    '.hero-scroll-cue',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    3.0
  );

  return tl;
}
