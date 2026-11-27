'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/** Bone for most dots, volt for a few — the site palette. */
const BONE = '245, 242, 234';
const VOLT = '255, 113, 32';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Cruise velocity the dot drifts back to after the cursor pulls it. */
  bx: number;
  by: number;
  r: number;
  a: number;
  rgb: string;
}

interface PreloaderParticlesProps {
  /** Runs while the preloader is up; stops its loop once the visitor ignites. */
  active: boolean;
  reduced: boolean;
}

/**
 * Charged dust behind the preloader: drifting dots that link up when close and
 * are pulled toward the cursor / finger, wiring themselves to it.
 * Density scales with screen area, so phones stay light and big screens stay full.
 */
export default function PreloaderParticles({ active, reduced }: PreloaderParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !active) return;

    let w = 0;
    let h = 0;
    let link = 110;
    let reach = 150;
    let dots: Dot[] = [];
    const pointer = { x: 0, y: 0, on: false };

    const spawn = (): Dot => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.45;
      const volt = Math.random() < 0.3;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        bx: Math.cos(angle) * speed,
        by: Math.sin(angle) * speed,
        // 2–4.8px radius (4–9.6px across).
        r: Math.random() * 2.8 + 2,
        a: Math.random() * 0.45 + 0.25,
        rgb: volt ? VOLT : BONE,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ~1 dot per 12k px² (≈50 on a phone, ≈120 on a laptop), capped for the O(n²) linking.
      const target = Math.round(gsap.utils.clamp(50, 120, (w * h) / 12000));
      link = gsap.utils.clamp(80, 130, w * 0.08);
      reach = gsap.utils.clamp(110, 170, Math.min(w, h) * 0.22);
      // Keep the dots already on screen (no pop on resize); just add/remove to the target.
      dots = dots.filter((d) => d.x <= w && d.y <= h).slice(0, target);
      while (dots.length < target) dots.push(spawn());
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link * link) continue;
          const t = 1 - Math.sqrt(d2) / link;
          ctx.strokeStyle = `rgba(${VOLT}, ${0.16 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Live wires from the cursor to the dots it is pulling.
      if (pointer.on) {
        for (const d of dots) {
          const dx = pointer.x - d.x;
          const dy = pointer.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > reach) continue;
          ctx.strokeStyle = `rgba(${VOLT}, ${0.35 * (1 - dist / reach)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();
        }
      }

      for (const d of dots) {
        ctx.fillStyle = `rgba(${d.rgb}, ${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (dt: number) => {
      // dt in 60fps frames, so motion is the same on 60/120Hz screens.
      for (const d of dots) {
        if (pointer.on) {
          const dx = pointer.x - d.x;
          const dy = pointer.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < reach) {
            const force = (reach - dist) / reach;
            d.vx += (dx / dist) * force * 0.35 * dt;
            d.vy += (dy / dist) * force * 0.35 * dt;
          }
        }
        // Ease back to cruise speed instead of stalling (the demo's friction stops every dot).
        const k = 1 - Math.pow(0.97, dt);
        d.vx += (d.bx - d.vx) * k;
        d.vy += (d.by - d.vy) * k;
        // Cap speed so a fast swipe never flings dots off like sparks.
        const sp = Math.hypot(d.vx, d.vy);
        if (sp > 4) {
          d.vx *= 4 / sp;
          d.vy *= 4 / sp;
        }

        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.x < 0 || d.x > w) {
          d.vx *= -1;
          d.bx *= -1;
          d.x = gsap.utils.clamp(0, w, d.x);
        }
        if (d.y < 0 || d.y > h) {
          d.vy *= -1;
          d.by *= -1;
          d.y = gsap.utils.clamp(0, h, d.y);
        }
      }
    };

    const tick = (_t: number, deltaMs: number) => {
      step(Math.min(deltaMs, 50) / (1000 / 60));
      draw();
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') pointer.on = false;
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // Still a starfield, just no motion.
      draw();
      return () => window.removeEventListener('resize', resize);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onLeave);
    document.documentElement.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [active, reduced]);

  return <canvas ref={ref} className="pl-particles" aria-hidden />;
}
