'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type Group, type Material, type PerspectiveCamera } from 'three';
import CanModel, { CAN_HEIGHT } from './CanModel';
import EnergyArcs from './EnergyArcs';
import EnergyAura from './EnergyAura';
import { DEFAULT_POSE, POSE_KEYS, sampleCanPath, type CanPose } from '@/lib/three/canPath';
import { canFx, canIntro, runtime } from '@/lib/runtime';

const TAU = Math.PI * 2;
/** Approximate can diameter in world units at CAN_HEIGHT. */
const CAN_WIDTH = 0.92;

interface PhysicsState {
  spin: number;
  spinV: number;
  lean: number;
  leanV: number;
  pitch: number;
  mx: number;
  my: number;
  t: number;
}

/**
 * Drives the can from the scroll path (lib/three/canPath) and layers physics on top:
 *  - scroll velocity spins the can and leans it into the motion;
 *  - when scrolling stops, a spring settles the spin on the nearest full turn,
 *    so every section's art-directed pose is always reached exactly;
 *  - idle float + pointer tilt where the pose allows it.
 */
export default function CanRig({ onReady }: { onReady?: () => void }) {
  const anchor = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  const materials = useRef<Material[]>([]);
  const lastAlpha = useRef(-1);
  const target = useRef<CanPose>({ ...DEFAULT_POSE });
  const current = useRef<CanPose | null>(null);
  const phys = useRef<PhysicsState>({ spin: 0, spinV: 0, lean: 0, leanV: 0, pitch: 0, mx: 0, my: 0, t: 0 });

  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    if (!(dt > 0) || !anchor.current || !spinner.current) return;

    sampleCanPath(window.scrollY, target.current);
    if (!current.current) current.current = { ...target.current };
    const c = current.current;
    const tg = target.current;
    const reduced = runtime.reducedMotion;

    // Frame-rate independent easing toward the path (Lenis already smooths scroll).
    const lambda = reduced ? 18 : 7.5;
    for (const k of POSE_KEYS) c[k] = MathUtils.damp(c[k], tg[k], lambda, dt);

    // ---- physics -------------------------------------------------------
    const p = phys.current;
    p.t += dt;
    const v = reduced ? 0 : runtime.velocity;

    if (runtime.kick) {
      p.spinV += runtime.kick * 16;
      runtime.kick = 0;
    }

    const moving = MathUtils.smoothstep(Math.abs(v), 0.02, 0.15);
    const snapTo = Math.round(p.spin / TAU) * TAU;
    const spinAcc = v * 42 - p.spinV * 3 - (1 - moving) * 20 * (p.spin - snapTo);
    p.spinV += spinAcc * dt;
    p.spin += p.spinV * dt;

    const leanAcc = (-v * 0.5 - p.lean) * 70 - p.leanV * 10;
    p.leanV += leanAcc * dt;
    p.lean += p.leanV * dt;
    p.pitch = MathUtils.damp(p.pitch, v * 0.2, 6, dt);

    p.mx = MathUtils.damp(p.mx, runtime.pointerX, 4, dt);
    p.my = MathUtils.damp(p.my, runtime.pointerY, 4, dt);

    // ---- viewport-relative placement ------------------------------------
    const dist = camera.position.z;
    const visH = 2 * Math.tan(MathUtils.degToRad(camera.fov) / 2) * dist;
    const visW = visH * (size.width / Math.max(size.height, 1));
    const unit = Math.min((0.6 * visH) / CAN_HEIGHT, (0.62 * visW) / CAN_WIDTH);

    const idle = reduced ? 0 : c.idle;
    const floatY = Math.sin(p.t * 1.3) * 0.02 * idle;

    anchor.current.position.set(
      (c.x * visW) / 2,
      ((c.y + canIntro.y + floatY - v * 0.05) * visH) / 2,
      0
    );
    anchor.current.scale.setScalar(Math.max(0.0001, c.scale * unit * canIntro.scale));

    spinner.current.rotation.set(
      c.rotX + p.pitch + p.my * 0.22 * idle + Math.sin(p.t * 0.7) * 0.03 * idle,
      c.rotY + p.spin + canIntro.spin + p.mx * 0.5 * idle + Math.sin(p.t * 0.45) * 0.1 * idle,
      c.rotZ + p.lean
    );

    // ---- opacity -------------------------------------------------------
    const alpha = MathUtils.clamp(c.alpha * canIntro.alpha, 0, 1);
    anchor.current.visible = alpha > 0.01;
    if (Math.abs(alpha - lastAlpha.current) > 0.002) {
      lastAlpha.current = alpha;
      const opaque = alpha > 0.995;
      for (const m of materials.current) {
        m.transparent = !opaque;
        m.opacity = alpha;
        m.depthWrite = alpha > 0.4;
      }
    }

    canFx.glow = c.glow;
    canFx.arcs = c.arcs;
    canFx.rings = c.rings;
    canFx.alpha = alpha;
  });

  return (
    <group ref={anchor}>
      <EnergyAura />
      <EnergyArcs />
      <group ref={spinner} rotation-order="XZY">
        <CanModel materialsRef={materials} onReady={onReady} />
      </group>
    </group>
  );
}
