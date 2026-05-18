'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader as DreiLoader } from '@react-three/drei';
import CanScene from './CanScene';

interface CanCanvasProps {
  className?: string;
  onMount?: () => void;
}

export default function CanCanvas({ className = '', onMount }: CanCanvasProps) {
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
  }, []);

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
            <CanScene mobile={mobile} postFx={!mobile} />
          </Suspense>
        </Canvas>
      </div>
      <DreiLoader
        containerStyles={{
          background: '#030303',
          zIndex: 30,
        }}
        barStyles={{
          background: '#6b8cff',
          height: '1px',
        }}
        dataStyles={{
          color: '#737373',
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}
      />
    </>
  );
}
