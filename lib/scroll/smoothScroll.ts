import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';

let lenis: Lenis | null = null;
let locked = true;

function applyLock() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('is-locked', locked);
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}

export function lockScroll() {
  locked = true;
  applyLock();
}

export function unlockScroll() {
  locked = false;
  applyLock();
}

/** Smooth-scroll to an element or selector (falls back to native when Lenis is off). */
export function scrollToTarget(target: string | HTMLElement, duration = 1.8) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: 'auto' });
  }
}

/**
 * One clock for everything: Lenis, ScrollTrigger and (via CanCanvas) the R3F
 * render all advance inside gsap.ticker, so DOM and 3D can never drift apart.
 */
export function initSmoothScroll({ smooth }: { smooth: boolean }) {
  if (smooth) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.3,
      autoRaf: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
  }

  let lastY = window.scrollY;

  const tick = (time: number, deltaMs: number) => {
    lenis?.raf(time * 1000);

    const dt = Math.max(deltaMs, 1) / 1000;
    const y = window.scrollY;
    const raw = gsap.utils.clamp(-1, 1, (y - lastY) / dt / 2600);
    lastY = y;

    runtime.velocity += (raw - runtime.velocity) * (1 - Math.exp(-dt * 7));
    if (Math.abs(raw) > 0.015) runtime.direction = raw > 0 ? 1 : -1;
    runtime.flash *= Math.exp(-dt * 3.2);
    if (runtime.flash < 0.001) runtime.flash = 0;
  };

  gsap.ticker.add(tick, false, true);
  gsap.ticker.lagSmoothing(0);
  applyLock();

  // Smooth in-page anchor links (#about, #final, …) through Lenis.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const el = document.querySelector<HTMLElement>(hash);
    if (!el) return;
    e.preventDefault();
    if (locked) return;
    scrollToTarget(el);
  };
  document.addEventListener('click', onClick);

  return () => {
    document.removeEventListener('click', onClick);
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
  };
}
