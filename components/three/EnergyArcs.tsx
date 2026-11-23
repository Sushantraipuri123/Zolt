'use client';
/* eslint-disable react-hooks/immutability --
   R3F idiom: line buffers and per-arc timers are mutated imperatively in useFrame.
   This project does not run the React Compiler. */

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, type InterleavedBufferAttribute } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { canFx, runtime } from '@/lib/runtime';

const ARC_COUNT = 8;
const SEGMENTS = 12;
const CAN_RADIUS = 0.46;
const HALF_HEIGHT = 1.0;

interface Arc {
  geo: LineGeometry;
  glow: Line2;
  core: Line2;
  pts: Float32Array;
  life: number;
  ttl: number;
  on: boolean;
}

/** Write a jagged bolt from the can wall outward into `pts` (can-local units). */
function buildBolt(pts: Float32Array) {
  const theta = Math.random() * Math.PI * 2;
  const h = (Math.random() * 2 - 1) * HALF_HEIGHT * 0.92;
  const reach = 0.45 + Math.random() * 0.95;
  const theta2 = theta + (Math.random() - 0.5) * 0.9;
  const h2 = h + (Math.random() - 0.5) * 1.1;

  const sx = Math.cos(theta) * CAN_RADIUS;
  const sz = Math.sin(theta) * CAN_RADIUS;
  const ex = Math.cos(theta2) * (CAN_RADIUS + reach);
  const ez = Math.sin(theta2) * (CAN_RADIUS + reach);

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const amp = Math.sin(Math.PI * t) * 0.16;
    pts[i * 3] = sx + (ex - sx) * t + (Math.random() - 0.5) * amp;
    pts[i * 3 + 1] = h + (h2 - h) * t + (Math.random() - 0.5) * amp * 1.4;
    pts[i * 3 + 2] = sz + (ez - sz) * t + (Math.random() - 0.5) * amp;
  }
}

/** Copy points into the existing segment buffer (no per-frame GPU buffer churn). */
function uploadSegments(geo: LineGeometry, pts: Float32Array) {
  const attr = geo.attributes.instanceStart as InterleavedBufferAttribute;
  const data = attr.data;
  const arr = data.array as Float32Array;
  for (let i = 0; i < SEGMENTS; i++) {
    const o = i * 6;
    arr[o] = pts[i * 3];
    arr[o + 1] = pts[i * 3 + 1];
    arr[o + 2] = pts[i * 3 + 2];
    arr[o + 3] = pts[i * 3 + 3];
    arr[o + 4] = pts[i * 3 + 4];
    arr[o + 5] = pts[i * 3 + 5];
  }
  data.needsUpdate = true;
}

/** Flickering electric discharges crawling off the can. Intensity = pose.arcs + flash impulse. */
export default function EnergyArcs() {
  const size = useThree((s) => s.size);

  const arcs = useMemo<Arc[]>(() => {
    return Array.from({ length: ARC_COUNT }, (_, i) => {
      const pts = new Float32Array((SEGMENTS + 1) * 3);
      buildBolt(pts);
      const geo = new LineGeometry();
      geo.setPositions(pts);
      const glowMat = new LineMaterial({
        color: i % 3 === 2 ? 0x7df9ff : 0xff7120,
        linewidth: 7,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      });
      const coreMat = new LineMaterial({
        color: 0xffffff,
        linewidth: 1.6,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      });
      const glow = new Line2(geo, glowMat);
      const core = new Line2(geo, coreMat);
      glow.frustumCulled = false;
      core.frustumCulled = false;
      glow.visible = core.visible = false;
      return { geo, glow, core, pts, life: 0, ttl: 0, on: false };
    });
  }, []);

  useEffect(() => {
    arcs.forEach((a) => {
      (a.glow.material as LineMaterial).resolution.set(size.width, size.height);
      (a.core.material as LineMaterial).resolution.set(size.width, size.height);
    });
  }, [arcs, size.width, size.height]);

  useEffect(
    () => () => {
      arcs.forEach((a) => {
        a.geo.dispose();
        (a.glow.material as LineMaterial).dispose();
        (a.core.material as LineMaterial).dispose();
      });
    },
    [arcs]
  );

  useFrame((_, rawDt) => {
    const dt = Math.min(Math.max(rawDt, 0), 1 / 20);
    const reduced = runtime.reducedMotion;
    const intensity = Math.min(1.5, canFx.arcs + runtime.flash) * canFx.alpha * (reduced ? 0 : 1);

    for (const a of arcs) {
      a.life += dt;
      if (a.life >= a.ttl) {
        a.life = 0;
        a.ttl = 0.045 + Math.random() * 0.13;
        a.on = Math.random() < intensity * 0.8;
        if (a.on) {
          buildBolt(a.pts);
          uploadSegments(a.geo, a.pts);
        }
      }
      const flicker = a.on ? Math.min(1, intensity) * (0.55 + Math.random() * 0.45) : 0;
      const visible = flicker > 0.01;
      a.glow.visible = a.core.visible = visible;
      if (visible) {
        (a.glow.material as LineMaterial).opacity = flicker * 0.5;
        (a.core.material as LineMaterial).opacity = flicker;
      }
    }
  });

  return (
    <group>
      {arcs.map((a, i) => (
        <group key={i}>
          <primitive object={a.glow} />
          <primitive object={a.core} />
        </group>
      ))}
    </group>
  );
}
