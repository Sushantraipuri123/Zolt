'use client';

import { useRef } from 'react';
import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Fog } from 'three';

interface Atmosphere3DProps {
  mobile?: boolean;
}

export default function Atmosphere3D({ mobile = false }: Atmosphere3DProps) {
  const fogRef = useRef<Fog | null>(null);

  useFrame(({ clock }) => {
    const fog = fogRef.current;
    if (!fog || mobile) return;
    const w = Math.sin(clock.elapsedTime * 0.12) * 0.35 + Math.sin(clock.elapsedTime * 0.05) * 0.2;
    fog.near = 4.6 + w * 0.4;
    fog.far = 15.5 + w * 0.25;
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={['#020202', 5, 16]} />
      <Sparkles
        count={mobile ? 18 : 40}
        scale={[12, 8, 12]}
        size={mobile ? 1.0 : 1.45}
        speed={0.22}
        opacity={0.38}
        color="#00e5ff"
      />
      <Sparkles
        count={mobile ? 14 : 32}
        scale={[10, 6, 10]}
        size={mobile ? 0.85 : 1.15}
        speed={0.3}
        opacity={0.22}
        color="#c8ff00"
      />
      {/* Micro dust — very slow, deep field */}
      <Sparkles
        count={mobile ? 10 : 28}
        scale={[14, 9, 14]}
        size={mobile ? 0.45 : 0.65}
        speed={0.06}
        opacity={0.12}
        color="#e8f4ff"
      />
    </>
  );
}
