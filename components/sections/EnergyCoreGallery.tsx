'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';

/**
 * Dark, high-contrast action shots (Unsplash licence), stored locally in
 * public/images/gallery and ordered so light and dark cards alternate.
 */
const SHOTS = [
  { src: '/images/gallery/night-run.jpg', alt: 'Runners silhouetted against a low evening sun', tag: 'Night run' },
  { src: '/images/gallery/lift.jpg', alt: 'Athlete gripping a loaded barbell on a gym floor', tag: 'Lift' },
  { src: '/images/gallery/powder.jpg', alt: 'Snowboarder carving a wall of powder into the sun', tag: 'Powder' },
  { src: '/images/gallery/fight.jpg', alt: 'Black boxing gloves on the canvas', tag: 'Fight' },
  { src: '/images/gallery/track.jpg', alt: 'Sprinters seen from above on an orange running track', tag: 'Track' },
  { src: '/images/gallery/pull.jpg', alt: 'Athlete mid pull-up in a dark gym', tag: 'Pull' },
  { src: '/images/gallery/surf.jpg', alt: 'Surfer riding inside a barrel wave', tag: 'Surf' },
  { src: '/images/gallery/sprint.jpg', alt: 'Sprinter set in the starting blocks', tag: 'Sprint' },
  { src: '/images/gallery/squat.jpg', alt: 'Athlete with a barbell across her shoulders, in black and white', tag: 'Squat' },
  { src: '/images/gallery/stairs.jpg', alt: 'Runner in orange shoes powering up concrete stairs', tag: 'Climb' },
  { src: '/images/gallery/spar.jpg', alt: 'Boxer throwing a punch at a sparring session', tag: 'Spar' },
  { src: '/images/gallery/focus.jpg', alt: 'Athlete resting between sets in a dark gym', tag: 'Focus' },
] as const;

/** One full turn every 32s at rest (128s with reduced motion), like the reference ring. */
const BASE_DEG_PER_S = 360 / 32;
const REDUCED_DEG_PER_S = 360 / 128;
/** Extra spin per unit of scroll velocity — the ring surges with the scroll, like the marquees. */
const VELOCITY_BOOST = 160;
/** Fastest fling a swipe can give the ring. */
const MAX_FLING = 540;
/** Ring radius in card-em units — keep in sync with .ecg-card's translateZ in globals.css. */
const RING_RADIUS_EM = (0.5 * 17.5 + 0.5) / Math.tan(Math.PI / SHOTS.length);

/**
 * 08 OUT THERE — a 3D ring of cards. Desktop looks at it from inside; phones
 * look from outside (carousel), which keeps the front card big on a narrow
 * screen. It turns on its own, surges with scroll, can be swiped/dragged, and
 * tilts in/out as it passes.
 */
export default function EnergyCoreGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const scrub = desktop ? 0.6 : 0.8;

      gsap.from('.ecg-head .fx-reveal', {
        yPercent: 90,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ecg-head', start: 'top 80%' },
      });

      const scene = section.querySelector<HTMLElement>('.ecg-ring-scene');
      const tilt = section.querySelector<HTMLElement>('.ecg-ring-tilt');
      const ring = section.querySelector<HTMLElement>('.ecg-ring');
      if (!scene || !tilt || !ring) return;

      // Tilts up into view, flattens at centre screen, tips away on exit.
      // Opacity is faded on the scene, never on the preserve-3d elements:
      // opacity < 1 there forces the browser to flatten the ring into a strip.
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true },
        })
        .fromTo(tilt, { rotationX: 18, scale: 0.82 }, { rotationX: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(scene, { opacity: 0.25 }, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .to(tilt, { rotationX: -10, scale: 0.94, duration: 0.5, ease: 'power1.in' }, 0.5);

      // Continuous spin on the shared ticker, paused while off-screen.
      let visible = false;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(scene);

      const setRotY = gsap.quickSetter(ring, 'rotationY', 'deg');
      let angle = 0;
      let speed = BASE_DEG_PER_S;

      // Swipe / drag: the ring follows the finger, then keeps the fling and eases back.
      let dragging = false;
      let lastX = 0;
      let lastT = 0;
      let degPerPx = 0;
      let flingV = 0;

      const onDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const cs = getComputedStyle(scene);
        // Outside view (phones) moves the front card with the finger; inside view is mirrored.
        const dir = Number(cs.getPropertyValue('--ring-dir')) || -1;
        const radiusPx = RING_RADIUS_EM * parseFloat(cs.fontSize);
        degPerPx = (dir > 0 ? 1 : -1) * (180 / (Math.PI * radiusPx));
        dragging = true;
        flingV = 0;
        lastX = e.clientX;
        lastT = performance.now();
        scene.classList.add('is-dragging');
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const now = performance.now();
        const d = (e.clientX - lastX) * degPerPx;
        const dt = Math.max(now - lastT, 1) / 1000;
        angle += d;
        flingV = flingV * 0.6 + (d / dt) * 0.4;
        lastX = e.clientX;
        lastT = now;
        setRotY(angle);
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        // A pause before release means no fling.
        if (performance.now() - lastT > 120) flingV = 0;
        speed = gsap.utils.clamp(-MAX_FLING, MAX_FLING, flingV);
        scene.classList.remove('is-dragging');
      };
      scene.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      const tick = (_t: number, deltaMs: number) => {
        if (!visible || dragging) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        const reduced = runtime.reducedMotion;
        const target = reduced ? REDUCED_DEG_PER_S : BASE_DEG_PER_S + runtime.velocity * VELOCITY_BOOST;
        speed += (target - speed) * (1 - Math.exp(-dt * 2.5));
        angle = (angle + speed * dt) % 360;
        setRotY(angle);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        scene.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} id="energy-core" className="ecg-root relative z-[5] w-full overflow-x-clip">
    <div className="ecg-inner relative w-full bg-[#030303] text-white">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-radial-vignette opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 0), linear-gradient(180deg, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: 'min(3rem, 8vw) min(3rem, 8vw)',
        }}
        aria-hidden
      />

      {/* Heading left, intro copy right on wide screens (like the hero); stacked on smaller ones. */}
      <header className="ecg-head relative z-[2] flex flex-col gap-6 px-5 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16 xl:flex-row xl:items-end xl:justify-between xl:gap-16">
        <div className="shrink-0">
          <p className="line-mask">
            <span className="fx-reveal label block text-volt">[ 008 ] Out there</span>
          </p>
          {/* Always two lines on laptop+: "full voltage." must never break mid-phrase. */}
          <h2 className="display mt-4 text-[clamp(2.4rem,6vw,6.4rem)] leading-[0.9] lg:whitespace-nowrap">
            <span className="line-mask">
              <span className="fx-reveal block">Live at</span>
            </span>
            <span className="line-mask">
              <span className="fx-reveal block text-stroke-volt">full voltage.</span>
            </span>
          </h2>
        </div>
        <p className="line-mask max-w-xl xl:mr-12 xl:mb-3 xl:max-w-sm xl:border-l xl:border-volt/45 xl:pl-5">
          <span className="fx-reveal block text-[15px] leading-relaxed text-bone/60">
            Mountains, waves, tracks and late-night runs. Wherever you push, Zolt goes with you.
          </span>
        </p>
      </header>

      <div className="ecg-ring-scene relative z-[2]" data-cursor>
        <div className="ecg-ring-glow" aria-hidden />
        <div className="ecg-ring-tilt">
          <ul className="ecg-ring" style={{ '--n': SHOTS.length } as React.CSSProperties}>
            {SHOTS.map((shot, i) => (
              <li key={shot.src} className="ecg-card" style={{ '--i': i } as React.CSSProperties}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 1023px) 70vw, 320px"
                  className="ecg-card-img"
                  draggable={false}
                />
                <span className="ecg-card-caption">
                  <span className="text-volt">{String(i + 1).padStart(2, '0')}</span>
                  <span>{shot.tag}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ecg-spacer ecg-spacer--tall label flex items-center justify-center px-6 text-center text-bone/40">
        Flow state unlocked
      </div>
    </div>
    </section>
  );
}
