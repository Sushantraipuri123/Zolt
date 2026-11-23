'use client';

import 'lenis/dist/lenis.css';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { runtime } from '@/lib/runtime';
import { initSmoothScroll, lockScroll } from '@/lib/scroll/smoothScroll';
import { registerCanPath } from '@/lib/three/canPath';
import { buildCanKeyframes } from '@/lib/three/canKeyframes';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import Preloader from '@/components/ui/Preloader';
import Nav from '@/components/ui/Nav';
import ChargeMeter from '@/components/ui/ChargeMeter';
import Cursor from '@/components/ui/Cursor';
import Hero from '@/components/sections/Hero';
import PulseMarquee from '@/components/sections/PulseMarquee';
import Manifesto from '@/components/sections/Manifesto';
import InsideCan from '@/components/sections/InsideCan';
import ChargeMoment from '@/components/sections/ChargeMoment';
import Arena from '@/components/sections/Arena';
import Formula from '@/components/sections/Formula';
import EnergyCoreGallery from '@/components/sections/EnergyCoreGallery';
import FinalCharge from '@/components/sections/FinalCharge';

const CanCanvas = dynamic(() => import('@/components/three/CanCanvas'), { ssr: false });

/**
 * Orchestrator. Order matters: every section registers its own pinned
 * ScrollTriggers (in DOM order, as children), and only then — in this parent
 * effect, which runs after the children's — do we register the can path and
 * the chapter meter, so all positions account for pin spacing.
 */
export default function LandingPage() {
  const reduced = usePrefersReducedMotion();
  const [modelReady, setModelReady] = useState(false);
  const [ignited, setIgnited] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const flashEl = useRef<HTMLDivElement>(null);

  const handleReady = useCallback(() => setModelReady(true), []);

  useEffect(() => {
    runtime.reducedMotion = reduced;
  }, [reduced]);

  // Start at the top, locked behind the preloader; preload the ignition sound.
  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    lockScroll();
    const a = new Audio('/horror.mp3');
    a.preload = 'auto';
    a.volume = 0.6;
    audio.current = a;
    return () => a.pause();
  }, []);

  useEffect(() => initSmoothScroll({ smooth: !reduced }), [reduced]);

  // Pointer → runtime (normalised), and the global flash overlay driven by runtime.flash.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      runtime.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      runtime.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);

    const el = flashEl.current;
    const setOpacity = el ? gsap.quickSetter(el, 'opacity') : null;
    let last = 0;
    const tick = () => {
      const f = runtime.reducedMotion ? 0 : Math.min(1, runtime.flash) * 0.28;
      if (Math.abs(f - last) > 0.003) {
        last = f;
        setOpacity?.(f);
      }
    };
    gsap.ticker.add(tick);

    // Fonts and late images change layout; re-measure every trigger once they land.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
    };
  }, []);

  useGSAP(() =>
    registerCanPath(buildCanKeyframes(), () => window.matchMedia('(max-width: 1023px)').matches)
  );

  const ignite = useCallback(() => {
    if (ignited) return;
    audio.current?.play().catch(() => {});
    setIgnited(true);
  }, [ignited]);

  return (
    <>
      <Preloader ready={modelReady} ignited={ignited} onIgnite={ignite} reduced={reduced} />
      <CanCanvas onReady={handleReady} />
      <Nav />

      <main className="relative">
        <Hero ignited={ignited} reduced={reduced} />
        <PulseMarquee />
        <Manifesto />
        <InsideCan />
        <ChargeMoment />
        <Arena />
        <Formula />
        <EnergyCoreGallery />
        <FinalCharge />
      </main>

      <ChargeMeter />
      <Cursor />
      <div className="grain" aria-hidden />
      <div ref={flashEl} className="flash-overlay" aria-hidden />
    </>
  );
}
