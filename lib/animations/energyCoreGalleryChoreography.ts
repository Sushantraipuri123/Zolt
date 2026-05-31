import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Scroll-driven “energy core” gallery — CodePen WbodqRe behavior (no ScrollSmoother):
 * - Grid: scale-from-depth + outer column image fly-ins
 * - Parallax strip: scale scrub (enter from compressed depth)
 * - Pin: two rows horizontal counter-scroll
 */
export function registerEnergyCoreGalleryChoreography(
  root: HTMLElement,
  desktop: boolean
): () => void {
  const triggers: ScrollTrigger[] = [];
  const timelines: gsap.core.Timeline[] = [];

  const q = <T extends Element = Element>(sel: string) => root.querySelector<T>(sel);

  const gridSection = q('.ecg-grid-section');
  const gridLayout = q('.ecg-grid-layout');
  const col1Images = root.querySelectorAll<HTMLElement>('.ecg-column-1 .ecg-grid-image');
  const col3Images = root.querySelectorAll<HTMLElement>('.ecg-column-3 .ecg-grid-image');
  const parallaxSection = q('.ecg-parallax-section');
  const pinSection = q('.ecg-pin-section');
  const pinContent1 = q<HTMLElement>('.ecg-pin-content-1');
  const pinContent2 = q<HTMLElement>('.ecg-pin-content-2');

  const scrub = desktop ? 1 : 1.15;

  if (gridSection && gridLayout) {
    const gridTl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: gridSection,
        start: 'top center',
        end: 'bottom+=10% bottom',
        scrub,
        invalidateOnRefresh: true,
      },
    });
    gridTl.add('ecgGridStart');
    gridTl.from(
      gridLayout,
      {
        scale: 3,
        ease: 'power1.inOut',
        transformOrigin: 'center top',
      },
      'ecgGridStart'
    );
    col1Images.forEach((el, i) => {
      gridTl.from(
        el,
        {
          duration: 0.6,
          xPercent: -((i + 1) * 40 + i * 100),
          yPercent: (i + 1) * 40 + i * 100,
          ease: 'power1.inOut',
        },
        'ecgGridStart'
      );
    });
    col3Images.forEach((el, i) => {
      gridTl.from(
        el,
        {
          duration: 0.6,
          xPercent: (i + 1) * 40 + i * 100,
          yPercent: (i + 1) * 40 + i * 100,
          ease: 'power1.inOut',
        },
        'ecgGridStart'
      );
    });
    timelines.push(gridTl);
    if (gridTl.scrollTrigger) triggers.push(gridTl.scrollTrigger);
  }

  if (parallaxSection) {
    const st = ScrollTrigger.create({
      trigger: parallaxSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub,
      animation: gsap.fromTo(
        parallaxSection,
        { scale: 1 / 3, transformOrigin: 'center top' },
        { scale: 1, ease: 'none' }
      ),
      invalidateOnRefresh: true,
    });
    triggers.push(st);
  }

  if (pinSection && pinContent1 && pinContent2) {
    const pinTl = gsap.timeline({
      scrollTrigger: {
        pin: true,
        trigger: pinSection,
        scrub: true,
        start: 'top top',
        end: () => `+=${pinContent1.offsetWidth}`,
        invalidateOnRefresh: true,
      },
    });
    const vw = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);
    pinTl.fromTo(
      pinContent1,
      { x: () => vw() * 0.9 },
      { x: () => -pinContent1.offsetWidth, ease: 'none' },
      0
    );
    pinTl.fromTo(
      pinContent2,
      { x: () => -pinContent2.offsetWidth + vw() * 0.1 },
      { x: () => vw(), ease: 'none' },
      0
    );
    timelines.push(pinTl);
    if (pinTl.scrollTrigger) triggers.push(pinTl.scrollTrigger);
  }

  return () => {
    timelines.forEach((tl) => tl.kill());
    triggers.forEach((st) => st.kill());
  };
}
