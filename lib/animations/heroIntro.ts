import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

export function createHeroIntro(container?: HTMLElement | null) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15,
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

  scrollState.bloomIntensity = 0.05;
  scrollState.energyPulse = 0;
  scrollState.idleSpinY = 0;

  // Cinematic bloom flare on launch
  tl.to(scrollState, { bloomIntensity: 0.65, energyPulse: 1, duration: 0.35, ease: 'power2.in' }, 0.1);
  tl.to(scrollState, { bloomIntensity: 0.28, energyPulse: 0, duration: 0.8, ease: 'power2.out' }, 0.45);
  tl.to(scrollState, { idleSpinY: 0.15, duration: 0.6, ease: 'power2.out' }, 0.65);

  // Fade and scale in the fixed Three.js canvas layer
  safeFromTo(
    '.can-canvas',
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: 'power2.inOut' },
    0.1
  );

  // Animate Stage 1 main monogram headers
  safeFromTo(
    '.text-behind',
    { opacity: 0, y: 35, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
    0.25
  );

  safeFromTo(
    '.text-front',
    { opacity: 0, y: 35, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
    0.35
  );

  // Expand the orange dashed line from center
  safeFromTo(
    '.dottedLine',
    { opacity: 0, scaleX: 0 },
    { opacity: 1, scaleX: 1, duration: 1.2 },
    0.3
  );

  // Fade in the tech description subtitle
  safeFromTo(
    '.title-description',
    { opacity: 0, y: 15, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'sine.out' },
    0.6
  );

  // Staggered partners marquee pills entrance
  const partnerItems = q('.hero-content-bottom-item-content');
  if (partnerItems.length) {
    tl.fromTo(
      partnerItems,
      { opacity: 0, y: 20, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      0.7
    );
  }

  // Fade in scroll cue chevron
  safeFromTo(
    '.hero-scroll-cue',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8 },
    1.1
  );

  return tl;
}
