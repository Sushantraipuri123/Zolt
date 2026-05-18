import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

const DEG = Math.PI / 180;

export interface ScrollChoreography3dElements {
  hero: HTMLElement;
  heroContent?: HTMLElement;
  heroScene?: HTMLElement;
  story?: HTMLElement;
  storyScene?: HTMLElement;
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
  const { hero, heroContent, heroScene, story, storyScene } = elements;

  if (reducedMotion) {
    gsap.set('.story-reveal', { opacity: 1, y: 0, x: 0 });
    setCan(0.5, 0, 0, 5, -15, 0, 0.9);
    setCam(0, 0.2, 5.2, 0.5, 0, 0);
    scrollState.progress = 0;
    return () => {};
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
        // Hero start pose (desktop specific to clear text)
        setCan(1.35, 0.1, 0, 4, -12, 0, 0.98);
        setCam(0, 0.15, 5.4, 0.45, 0, 0);
        scrollState.rimIntensity = 1.2;
        scrollState.progress = 0;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            scrollState.progress = tl.progress();
          },
        });

        // Phase 1 — push in
        tl.to(
          scrollState.camera,
          {
            z: 4.6,
            y: 0.15,
            duration: 0.2,
            ease: 'power2.in',
          },
          0
        );
        tl.to(
          scrollState.can,
          {
            scale: 1.05,
            rotX: 8 * DEG,
            rotY: -6 * DEG,
            duration: 0.2,
            ease: 'power2.in',
          },
          0
        );
        tl.to(scrollState, { rimIntensity: 1.5, duration: 0.2 }, 0);

        // Phase 2 — descend
        tl.to(
          scrollState.can,
          {
            x: 0.95,
            y: -0.25,
            z: -0.1,
            rotX: 10 * DEG,
            rotY: 12 * DEG,
            scale: 0.95,
            duration: 0.32,
            ease: 'power1.inOut',
          },
          0.2
        );
        tl.to(
          scrollState.camera,
          {
            y: -0.05,
            z: 5.1,
            targetY: -0.1,
            duration: 0.32,
            ease: 'power1.inOut',
          },
          0.2
        );

        // Phase 3 — arc right
        tl.to(
          scrollState.can,
          {
            x: 1.25,
            y: -0.35,
            z: -0.15,
            rotX: 8 * DEG,
            rotY: -8 * DEG,
            rotZ: 1 * DEG,
            scale: 0.88,
            duration: 0.28,
            ease: 'power2.inOut',
          },
          0.52
        );
        tl.to(
          scrollState.camera,
          {
            x: 0.15,
            targetX: 0.48,
            targetY: -0.08,
            duration: 0.28,
            ease: 'power2.inOut',
          },
          0.52
        );

        // Phase 4 — settle story (aligned precisely on right column)
        tl.to(
          scrollState.can,
          {
            x: 1.4,
            y: -0.2,
            z: -0.12,
            rotX: 6 * DEG,
            rotY: -16 * DEG,
            rotZ: 0,
            scale: 0.82,
            duration: 0.2,
            ease: 'power3.out',
          },
          0.8
        );
        tl.to(
          scrollState.camera,
          {
            x: 0.1,
            y: 0,
            z: 5.3,
            targetX: 0.5,
            targetY: -0.05,
            duration: 0.2,
            ease: 'power3.out',
          },
          0.8
        );
        tl.to(scrollState, { rimIntensity: 1.35, duration: 0.2 }, 0.8);

        setupChoreography(tl, isDesktop);
      } else {
        // Hero start pose (mobile centered)
        setCan(0, -0.05, 0, 6, -18, 0, 0.9);
        setCam(0, 0.25, 5.4, 0, 0.05, 0);
        scrollState.rimIntensity = 1.2;
        scrollState.progress = 0;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            scrollState.progress = tl.progress();
          },
        });

        tl.to(
          scrollState.can,
          {
            y: -0.2,
            scale: 1.02,
            rotX: 8 * DEG,
            rotY: 5 * DEG,
            duration: 0.25,
            ease: 'power2.in',
          },
          0
        )
          .to(
            scrollState.can,
            {
              y: -0.85,
              scale: 0.88,
              rotY: -10 * DEG,
              duration: 0.35,
              ease: 'power1.inOut',
            },
            0.25
          )
          .to(
            scrollState.can,
            {
              x: 0.35,
              y: -1.1,
              scale: 0.78,
              rotX: 6 * DEG,
              rotY: -18 * DEG,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.6
          );
        tl.to(
          scrollState.camera,
          { y: -0.1, z: 5.5, targetY: -0.3, duration: 0.5, ease: 'power1.inOut' },
          0.2
        );

        setupChoreography(tl, isDesktop);
      }
    }
  );

  return () => mm.revert();

  function setupChoreography(tl: gsap.core.Timeline, isDesktop: boolean) {
    if (heroContent) {
      tl.fromTo(
        heroContent,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -80, duration: 0.35, ease: 'power2.in' },
        isDesktop ? 0.42 : 0.35
      );
    }

    const storyReveals = story?.querySelectorAll('.story-reveal');
    if (storyReveals?.length) {
      tl.fromTo(
        storyReveals,
        { opacity: 0, y: 48, x: -20 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.38,
          stagger: 0.08,
          ease: 'power3.out',
        },
        isDesktop ? 0.58 : 0.5
      );
    }

    if (heroScene) {
      const slow = heroScene.querySelector('.scene-parallax-slow');
      if (slow) {
        tl.to(
          slow,
          { y: -80, opacity: 0.08, duration: 0.45, ease: 'power1.in' },
          0
        );
      }
      const mid = heroScene.querySelector('.scene-parallax-mid');
      if (mid) {
        tl.to(
          mid,
          { y: -140, opacity: 0.04, duration: 0.5, ease: 'power1.in' },
          0.05
        );
      }
      const sweep = heroScene.querySelector('.hero-light-sweep');
      if (sweep) {
        tl.to(
          sweep,
          { opacity: 0, x: '-15%', duration: 0.35, ease: 'power2.in' },
          0.12
        );
      }
    }

    if (storyScene) {
      tl.fromTo(storyScene, { opacity: 0.7 }, { opacity: 1, duration: 0.35 }, 0.55);
    }

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: isDesktop ? '+=55%' : '+=35%',
      pin: true,
      pinSpacing: true,
      scrub: 0.85,
      anticipatePin: 1,
      animation: tl,
      invalidateOnRefresh: true,
    });
  }
}
