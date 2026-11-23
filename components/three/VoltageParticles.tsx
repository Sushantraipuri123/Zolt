'use client';
/* eslint-disable react-hooks/immutability, react-hooks/purity --
   R3F idiom: buffers are created once (random layout) and mutated imperatively in
   useFrame. This project does not run the React Compiler. */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  type PointsMaterial,
} from 'three';
import { runtime } from '@/lib/runtime';
import { radialTexture } from './textures';

const PALETTE = ['#ff7120', '#ffb070', '#ffffff', '#7df9ff'];

/**
 * Charged dust filling the scene. Drifts upward at idle and rushes past
 * (against the scroll direction) when the user scrolls fast — speed you can feel.
 */
export default function VoltageParticles({ count }: { count: number }) {
  const mat = useRef<PointsMaterial>(null);

  const { geo, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const c = new Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -8 + Math.random() * 10;
      speeds[i] = 0.4 + Math.random() * 1.2;
      c.set(PALETTE[i % PALETTE.length]);
      const dim = 0.35 + Math.random() * 0.65;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    const geo = new BufferGeometry();
    const pos = new BufferAttribute(positions, 3);
    pos.setUsage(DynamicDrawUsage);
    geo.setAttribute('position', pos);
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    return { geo, speeds };
  }, [count]);

  const tex = useMemo(
    () =>
      radialTexture(
        [
          [0, 'rgba(255,255,255,1)'],
          [0.3, 'rgba(255,255,255,0.55)'],
          [1, 'rgba(255,255,255,0)'],
        ],
        64
      ),
    []
  );

  useEffect(
    () => () => {
      geo.dispose();
      tex.dispose();
    },
    [geo, tex]
  );

  useFrame((_, rawDt) => {
    if (runtime.reducedMotion) return;
    const dt = Math.min(Math.max(rawDt, 0), 1 / 20);
    const v = runtime.velocity;
    const rise = 0.16 + v * 7.5;
    const attr = geo.attributes.position as BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      arr[iy] += rise * speeds[i] * dt;
      if (arr[iy] > 5) arr[iy] -= 10;
      else if (arr[iy] < -5) arr[iy] += 10;
    }
    attr.needsUpdate = true;
    if (mat.current) mat.current.size = 0.05 + Math.min(Math.abs(v), 1) * 0.06;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        ref={mat}
        map={tex}
        size={0.05}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}
