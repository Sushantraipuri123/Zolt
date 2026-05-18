'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader as DreiLoader } from '@react-three/drei';
import CanScene from './CanScene';

interface CanCanvasProps {
  className?: string;
  onMount?: () => void;
  rotate?: boolean;
  setRotate?: (val: boolean) => void;
}

export default function CanCanvas({ className = '', onMount, rotate, setRotate }: CanCanvasProps) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <>
      <div
        className={`can-canvas pointer-events-none fixed inset-0 z-20 opacity-0 ${className}`}
        aria-hidden
      >
        <Canvas
          dpr={mobile ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0.2, 5.2], fov: 35, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <CanScene mobile={mobile} postFx={!mobile} rotate={rotate} setRotate={setRotate} />
          </Suspense>
        </Canvas>
      </div>
      <DreiLoader
        containerStyles={{
          background: '#020202',
          zIndex: 30,
        }}
        barStyles={{
          background: 'linear-gradient(90deg, #4d7cff, #00e5ff)',
          height: '2px',
        }}
        dataStyles={{
          color: '#6b6b6b',
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
        }}
        dataInterpolation={(p) => `CHARGING ${Math.round(p)}%`}
      />
    </>
  );
}
