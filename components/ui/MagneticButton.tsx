'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
  autoFocus?: boolean;
}

/** Button/link that leans toward the pointer and springs back (desktop only). */
export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.35,
  ariaLabel,
  autoFocus,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const label = inner.current;
      if (!el || !label || !window.matchMedia('(pointer: fine)').matches) return;

      const cfg = { duration: 0.7, ease: 'elastic.out(1, 0.45)' };
      const xTo = gsap.quickTo(el, 'x', cfg);
      const yTo = gsap.quickTo(el, 'y', cfg);
      const ixTo = gsap.quickTo(label, 'x', cfg);
      const iyTo = gsap.quickTo(label, 'y', cfg);

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        ixTo(dx * strength * 0.45);
        iyTo(dy * strength * 0.45);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        ixTo(0);
        iyTo(0);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { scope: ref, dependencies: [strength] }
  );

  const content = (
    <span ref={inner} className="magnetic-inner">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={`magnetic ${className}`}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={`magnetic ${className}`}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
    >
      {content}
    </button>
  );
}
