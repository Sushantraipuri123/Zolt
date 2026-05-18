import { gsap } from '@/lib/gsap';

export function createHeroIntro(container?: HTMLElement | null) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  const safeFromTo = (
    selector: string,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    position?: string | number
  ) => {
    const targets = container
      ? container.querySelectorAll(selector)
      : document.querySelectorAll(selector);
    if (targets && targets.length > 0) {
      tl.fromTo(targets, fromVars, toVars, position);
    }
  };

  safeFromTo(
    '.hero-reveal-label',
    { opacity: 0, y: 20, letterSpacing: '0.35em' },
    { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 1.1 }
  );

  safeFromTo(
    '.hero-reveal-line',
    { opacity: 0, y: 80, scale: 0.92 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.14 },
    '-=0.7'
  );

  safeFromTo(
    '.hero-reveal-sub',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1 },
    '-=0.5'
  );

  safeFromTo(
    '.hero-reveal-cta',
    { opacity: 0, y: 20, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85 },
    '-=0.55'
  );

  safeFromTo(
    '.can-canvas',
    { opacity: 0 },
    { opacity: 1, duration: 1.6, ease: 'power2.inOut' },
    '-=1.4'
  );

  safeFromTo(
    '.scene-parallax-slow',
    { opacity: 0 },
    { opacity: 0.3, duration: 1.4, ease: 'power2.out' },
    '-=1.5'
  );

  safeFromTo(
    '.hero-reveal-accent',
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.out' },
    '-=0.6'
  );

  return tl;
}
