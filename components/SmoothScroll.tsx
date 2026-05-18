'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, type ReactNode } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: ReactNode;
}

function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
