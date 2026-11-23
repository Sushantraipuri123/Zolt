'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

/** Trailing energy ring that swells over interactive elements (fine pointers only). */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ring.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('has-cursor');
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-visible');
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.('a, button, [data-cursor]');
      el.classList.toggle('is-hover', !!hit);
    };
    const leave = () => el.classList.remove('is-visible');

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  });

  return <div ref={ring} className="cursor-ring" aria-hidden />;
}
