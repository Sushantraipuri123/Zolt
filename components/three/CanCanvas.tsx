'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import type { DirectionalLight } from 'three';
import CanRig from './CanRig';
import VoltageParticles from './VoltageParticles';
import { gsap } from '@/lib/gsap';
import { canFx, runtime } from '@/lib/runtime';
import { isCompact } from '@/lib/device';

/** Renders R3F from gsap.ticker so Lenis → ScrollTrigger → 3D all share one frame. */
function TickerDriver() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    const tick = (time: number) => advance(time, true);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);
  return null;
}

function StageLights() {
  const rimWarm = useRef<DirectionalLight>(null);
  const rimCool = useRef<DirectionalLight>(null);

  useFrame(() => {
    const g = canFx.glow + runtime.flash * 1.4;
    if (rimWarm.current) rimWarm.current.intensity = 1.4 + g * 3.4;
    if (rimCool.current) rimCool.current.intensity = 0.7 + g * 1.3;
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[2.5, 4, 6]} intensity={1.35} color="#fff6ee" />
      <directionalLight ref={rimWarm} position={[-5, 2, -4]} intensity={2} color="#ff7120" />
      <directionalLight ref={rimCool} position={[5, 1.5, -3]} intensity={1} color="#8fefff" />
      {/* Studio reflections built from light-formers: no HDR download, brand-coloured highlights. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 4, 3]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={7} color="#ff7120" position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[6, 2.4, 1]} />
        <Lightformer form="rect" intensity={3} color="#9fefff" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, -3, 4]} rotation-x={-Math.PI / 2} scale={[8, 1, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, -6]} scale={5} />
      </Environment>
    </>
  );
}

interface CanCanvasProps {
  onReady?: () => void;
}

export default function CanCanvas({ onReady }: CanCanvasProps) {
  // Decided once at mount, so rotating a tablet doesn't rebuild the scene.
  const [compact] = useState(isCompact);
  const [degraded, setDegraded] = useState(false);
  // Phones already have dense pixels; 1.25 looks the same at a fraction of the fill cost.
  const maxDpr = degraded ? 1 : compact ? 1.25 : 1.75;

  return (
    <div className="can-canvas pointer-events-none fixed inset-0 z-20" aria-hidden>
      <Canvas
        frameloop="never"
        dpr={[1, maxDpr]}
        camera={{ position: [0, 0, 8], fov: 30, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <TickerDriver />
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <StageLights />
        <VoltageParticles count={compact ? 140 : 620} />
        <Suspense fallback={null}>
          <CanRig onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
