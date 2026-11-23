'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide, type Mesh, type MeshBasicMaterial } from 'three';
import { canFx, runtime } from '@/lib/runtime';
import { radialTexture } from './textures';

/**
 * Halo glow behind the can and a shockwave ring that fires on every flash impulse. Lives inside the can's anchor group, so it
 * inherits position + scale but not the can's spin.
 */
export default function EnergyAura() {
  const halo = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const shock = useRef<Mesh>(null);
  const shockState = useRef({ t: 1, lastFlash: 0 });
  const time = useRef(0);

  const haloTex = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(255,200,140,0.95)'],
        [0.16, 'rgba(255,113,32,0.6)'],
        [0.42, 'rgba(255,61,0,0.16)'],
        [1, 'rgba(255,61,0,0)'],
      ]),
    []
  );
  const coreTex = useMemo(
    () =>
      radialTexture([
        [0, 'rgba(255,255,255,0.9)'],
        [0.3, 'rgba(180,240,255,0.35)'],
        [1, 'rgba(120,220,255,0)'],
      ]),
    []
  );

  useEffect(
    () => () => {
      haloTex.dispose();
      coreTex.dispose();
    },
    [haloTex, coreTex]
  );

  useFrame((_, rawDt) => {
    const dt = Math.min(Math.max(rawDt, 0), 1 / 20);
    time.current += dt;
    const t = time.current;
    const a = canFx.alpha;
    const flash = runtime.flash;
    const breathe = 1 + Math.sin(t * 2.1) * 0.06 * (runtime.reducedMotion ? 0 : 1);

    if (halo.current) {
      const m = halo.current.material as MeshBasicMaterial;
      m.opacity = Math.min(1, (canFx.glow * 0.55 + flash * 0.5) * a);
      halo.current.scale.setScalar(3.4 * breathe * (1 + flash * 0.25));
    }
    if (core.current) {
      const m = core.current.material as MeshBasicMaterial;
      m.opacity = Math.min(1, (canFx.glow * 0.22 + flash * 0.6) * a);
    }

    // Shockwave: restart whenever a new flash spike arrives.
    const s = shockState.current;
    if (flash > s.lastFlash + 0.2 && flash > 0.4) s.t = 0;
    s.lastFlash = flash;
    if (shock.current) {
      s.t = Math.min(1, s.t + dt * 1.25);
      const e = 1 - Math.pow(1 - s.t, 3);
      shock.current.scale.setScalar(0.9 + e * 5);
      const m = shock.current.material as MeshBasicMaterial;
      m.opacity = (1 - s.t) * 0.85 * a;
      shock.current.visible = s.t < 1 && !runtime.reducedMotion;
    }
  });

  return (
    <group>
      <mesh ref={halo} position={[0, 0, -0.9]} renderOrder={-2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={haloTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={core} position={[0, 0, -0.7]} scale={2} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={coreTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={shock} visible={false}>
        <ringGeometry args={[0.97, 1, 128]} />
        <meshBasicMaterial
          color="#ffb070"
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
