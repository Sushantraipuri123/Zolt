'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import { gsap } from '@/lib/gsap';
import { triggerFlash } from '@/lib/runtime';
import MagneticButton from './MagneticButton';
import BoltIcon from './BoltIcon';
import PreloaderParticles from './PreloaderParticles';

interface PreloaderProps {
  ready: boolean;
  ignited: boolean;
  onIgnite: () => void;
  reduced: boolean;
}

/**
 * Real loader: the ZOLT mark fills with actual 3D asset progress, then offers
 * IGNITE (which also unlocks audio). Exits by splitting open like a blast door.
 */
export default function Preloader({ ready, ignited, onIgnite, reduced }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useProgress((s) => s.progress);
  const [timedOut, setTimedOut] = useState(false);
  /** True once the blast doors have fully opened — stops the particle loop for good. */
  const [gone, setGone] = useState(false);

  // Never trap the visitor if the model stalls.
  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), 15000);
    return () => window.clearTimeout(t);
  }, []);

  const canStart = ready || timedOut;
  const shown = canStart ? 100 : Math.min(99, Math.round(progress));

  useGSAP(
    () => {
      if (!ignited || !root.current) return;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root.current, { display: 'none' });
          setGone(true);
        },
      });
      if (reduced) {
        tl.to(root.current, { autoAlpha: 0, duration: 0.5 });
        return;
      }
      tl.to('.pl-content', { scale: 1.15, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0)
        .to('.pl-particles', { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0)
        .call(() => triggerFlash(1.3), undefined, 0.35)
        .to('.pl-flash', { opacity: 1, duration: 0.06 }, 0.35)
        .to('.pl-flash', { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.42)
        .to('.pl-top', { yPercent: -101, duration: 1.05, ease: 'expo.inOut' }, 0.38)
        .to('.pl-bottom', { yPercent: 101, duration: 1.05, ease: 'expo.inOut' }, 0.38)
        .to('.pl-seam', { scaleX: 1, duration: 0.35, ease: 'power4.out' }, 0.2)
        .to('.pl-seam', { autoAlpha: 0, duration: 0.3 }, 0.6);
    },
    { scope: root, dependencies: [ignited, reduced] }
  );

  return (
    <div ref={root} className="preloader" role="dialog" aria-label="Loading Zolt">
      <div className="pl-half pl-top" />
      <div className="pl-half pl-bottom" />
      <PreloaderParticles active={!gone} reduced={reduced} />
      <div className="pl-seam" />
      <div className="pl-flash" />

      <div className="pl-content">
        <div className="pl-logo" aria-hidden>
          <span className="pl-logo-outline">ZOLT</span>
          <span className="pl-logo-fill" style={{ clipPath: `inset(${100 - shown}% 0 0 0)` }}>
            ZOLT
          </span>
        </div>

        <div className="pl-status">
          <span>{canStart ? 'Fully charged' : 'Charging'}</span>
          <span className="pl-bar">
            <span className="pl-bar-fill" style={{ transform: `scaleX(${shown / 100})` }} />
          </span>
          <span className="tabular-nums">{String(shown).padStart(3, '0')}%</span>
        </div>

        <div className={`pl-cta ${canStart ? 'is-ready' : ''}`}>
          {canStart && (
            <>
              <MagneticButton onClick={onIgnite} className="btn-volt btn-lg" autoFocus ariaLabel="Ignite — enter the site">
                <BoltIcon className="h-5 w-5" />
                Ignite
              </MagneticButton>
              <p className="pl-hint">Sound on for the full charge</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
