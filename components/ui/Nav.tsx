'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';
import MagneticButton from './MagneticButton';
import BoltIcon from './BoltIcon';

const LINKS = [
  { href: '#about', label: 'Story' },
  { href: '#inside', label: 'Inside' },
  { href: '#formula', label: 'Formula' },
  { href: '#arena', label: 'Arena' },
];

/** Fixed nav: hides while charging down the page, returns the moment you scroll up. */
export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    let hidden = false;
    const tick = () => {
      const y = window.scrollY;
      const hide = y > 240 && runtime.direction === 1 && runtime.velocity > 0.02;
      const show = y < 240 || runtime.direction === -1;
      if (hide && !hidden) {
        hidden = true;
        el.classList.add('is-hidden');
      } else if (show && hidden) {
        hidden = false;
        el.classList.remove('is-hidden');
      }
      el.classList.toggle('is-solid', y > 40);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <header ref={ref} className="site-nav">
      <a href="#home" className="nav-logo" aria-label="Zolt — back to top">
        <BoltIcon className="h-4 w-4 text-volt" />
        <span>ZOLT</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            <span className="nav-link-text" data-text={l.label}>
              {l.label}
            </span>
          </a>
        ))}
      </nav>
      <MagneticButton href="#final" className="btn-volt btn-sm" strength={0.25}>
        Pre-order
      </MagneticButton>
    </header>
  );
}
