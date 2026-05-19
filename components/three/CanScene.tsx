'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, PointLight, SpotLight } from 'three';
import CanModel from './CanModel';
import CinematicLights from './CinematicLights';
import Atmosphere3D from './Atmosphere3D';
import PostEffects from './PostEffects';
import { lerpScrollDisplay, scrollDisplay } from '@/lib/three/scrollState';
import { useCanPointer } from '@/hooks/useCanPointer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CanSceneProps {
  mobile?: boolean;
  postFx?: boolean;
  rotate?: boolean;
  setRotate?: (val: boolean) => void;
}

export default function CanScene({ mobile = false, postFx = true, rotate = false, setRotate }: CanSceneProps) {
  const canRig = useRef<Group>(null);
  const rimPoint = useRef<PointLight>(null);
  const rimSpot = useRef<SpotLight>(null);
  const { camera } = useThree();
  const pointer = useCanPointer(!mobile);
  const reducedMotion = usePrefersReducedMotion();
  const idlePhase = useRef(0);
  const spinAccumulator = useRef(0);
  
  // Custom click rotation states
  const clickSpin = useRef(0);
  const isSpinning = useRef(false);

  // Smooth interactive mouse references for high-fidelity inertia
  const smoothMouseX = useRef(0);
  const smoothMouseY = useRef(0);

  useFrame((state, delta) => {
    lerpScrollDisplay(reducedMotion ? 1 : 0.1);

    const rig = canRig.current;
    if (!rig) return;

    // Handle interactive 360-degree click rotation
    if (rotate && !isSpinning.current) {
      isSpinning.current = true;
      clickSpin.current = 0;
    }

    if (isSpinning.current) {
      const spinSpeed = (2 * Math.PI) / 1.0; // 360 degrees in 1.0 seconds
      clickSpin.current += spinSpeed * delta;
      if (clickSpin.current >= 2 * Math.PI) {
        clickSpin.current = 0;
        isSpinning.current = false;
        setRotate?.(false);
      }
    }

    idlePhase.current += delta;
    const t = idlePhase.current;
    const progress = scrollDisplay.progress;
    const idleWeight = MathUtils.clamp(1 - progress * 1.2, 0, 1);

    const floatY = Math.sin(t * 1.1) * 0.035 * idleWeight;
    const floatX = Math.sin(t * 0.7) * 0.015 * idleWeight;
    const idleRotX = Math.sin(t * 0.6) * 0.025 * idleWeight;

    if (idleWeight > 0.02) {
      spinAccumulator.current += delta * scrollDisplay.idleSpinY * idleWeight;
    } else {
      spinAccumulator.current *= 0.92;
    }

    // Ultra-smooth lerping of mouse pointer coordinates for inertia tracking
    smoothMouseX.current = MathUtils.lerp(smoothMouseX.current, pointer.x, 0.08);
    smoothMouseY.current = MathUtils.lerp(smoothMouseY.current, pointer.y, 0.08);

    const activeMouseX = smoothMouseX.current * idleWeight;
    const activeMouseY = smoothMouseY.current * idleWeight;

    // High-fidelity interactive tilting, panning, and rotations in the Hero section
    const mouseRotY = activeMouseX * 0.7;   // Up to ~40 degrees left/right horizontal tilt
    const mouseRotX = -activeMouseY * 0.35; // Up to ~20 degrees up/down vertical tilt
    const mousePosX = activeMouseX * 0.15;   // Subtle premium translation on X
    const mousePosY = -activeMouseY * 0.1;   // Subtle premium translation on Y

    const idleSpin = idleWeight > 0.02 ? spinAccumulator.current : 0;

    const c = scrollDisplay.can;
    const pulse = scrollDisplay.energyPulse;

    rig.position.set(c.x + floatX + mousePosX, c.y + floatY + mousePosY, c.z);
    rig.rotation.set(
      c.rotX + idleRotX + mouseRotX,
      c.rotY + idleSpin + mouseRotY + clickSpin.current,
      c.rotZ
    );
    rig.scale.setScalar(c.scale);

    const cam = scrollDisplay.camera;
    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(cam.targetX, cam.targetY, cam.targetZ);
    camera.updateProjectionMatrix();

    const rim = scrollDisplay.rimIntensity * (1 + pulse * 0.4);
    if (rimPoint.current) rimPoint.current.intensity = 0.85 * rim;
    if (rimSpot.current) rimSpot.current.intensity = 1.0 * rim;
  });

  return (
    <>
      <CinematicLights />
      <pointLight
        ref={rimPoint}
        position={[-2.5, 1.5, 2]}
        intensity={0.85}
        color="#00e5ff"
        distance={12}
      />
      <spotLight
        ref={rimSpot}
        position={[3, 4, 1]}
        angle={0.35}
        penumbra={0.8}
        intensity={1.0}
        color="#6eb4ff"
      />
      <Atmosphere3D mobile={mobile} />
      <CanModel groupRef={canRig} />
      <PostEffects enabled={postFx && !mobile && !reducedMotion} />
    </>
  );
}
