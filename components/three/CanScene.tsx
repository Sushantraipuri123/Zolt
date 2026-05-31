'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  DataTexture,
  Group,
  LinearFilter,
  MathUtils,
  Mesh,
  PointLight,
  RGBAFormat,
  SpotLight,
} from 'three';
import type { Material } from 'three';
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

/** Soft radial alpha for floor shadow (blurred falloff, no hard circle edge). */
function createFloorShadowDataTexture(size = 256): DataTexture {
  const data = new Uint8Array(size * size * 4);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const R = size * 0.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.min(1, Math.hypot(x - cx, y - cy) / R);
      const a = Math.floor(215 * Math.pow(1 - d, 2.65));
      const i = (y * size + x) * 4;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = a;
    }
  }
  const tex = new DataTexture(data, size, size, RGBAFormat);
  tex.needsUpdate = true;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

export default function CanScene({ mobile = false, postFx = true, rotate = false, setRotate }: CanSceneProps) {
  const canRig = useRef<Group>(null);
  const floorShadow = useRef<Mesh>(null);
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

  const floorShadowMap = useMemo(() => createFloorShadowDataTexture(256), []);
  useEffect(() => {
    return () => {
      floorShadowMap.dispose();
    };
  }, [floorShadowMap]);

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

    const floatBoost =
      1 +
      Math.max(0, 0.22 * (1 - Math.min(1, progress * 18))) * (mobile ? 0 : 1) * (reducedMotion ? 0 : 1);
    const floatY = Math.sin(t * 1.1) * 0.042 * idleWeight * floatBoost;
    const floatX = Math.sin(t * 0.7) * 0.02 * idleWeight * floatBoost;
    const idleRotX = Math.sin(t * 0.6) * 0.032 * idleWeight;

    if (idleWeight > 0.02) {
      spinAccumulator.current += delta * scrollDisplay.idleSpinY * idleWeight;
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

    const idleSpin = spinAccumulator.current;

    const c = scrollDisplay.can;
    const pulse = scrollDisplay.energyPulse;

    rig.position.set(c.x + floatX + mousePosX, c.y + floatY + mousePosY, c.z);
    rig.rotation.set(
      c.rotX + idleRotX + mouseRotX,
      c.rotY + idleSpin + mouseRotY + clickSpin.current,
      c.rotZ
    );
    rig.scale.setScalar(c.scale);

    const canAlpha = scrollDisplay.canAlpha;
    const canFullyHidden = canAlpha < 0.002;
    rig.visible = !canFullyHidden;
    if (!canFullyHidden) {
      rig.traverse((child) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const m = mat as Material;
          if (!m.userData._scrollCanAlphaBaseSaved) {
            m.userData._scrollCanAlphaBaseSaved = true;
            m.userData._scrollCanAlphaBase = m.opacity;
          }
          const base =
            typeof m.userData._scrollCanAlphaBase === 'number' ? m.userData._scrollCanAlphaBase : 1;
          m.transparent = canAlpha < 0.998 || base < 0.998;
          m.opacity = base * canAlpha;
        });
      });
    }

    const shadowMesh = floorShadow.current;
    if (shadowMesh) {
      shadowMesh.visible = !canFullyHidden;
      // Can bottom ~1.1 * scale below rig center; extra offset = visible float gap before shadow
      const canBottom = 1.1 * c.scale;
      const floatGap = 0.16 * c.scale;
      const shadowY = rig.position.y - canBottom - floatGap;
      shadowMesh.position.set(rig.position.x, shadowY, rig.position.z);
      shadowMesh.rotation.set(-Math.PI / 2, 0, 0);
      const r = 0.78 * c.scale;
      shadowMesh.scale.set(r, r, 1);
      const sm = shadowMesh.material as Material;
      sm.transparent = true;
      sm.opacity = canAlpha;
    }

    const cam = scrollDisplay.camera;
    const tunnelCamStability = MathUtils.smoothstep(0.1, 1, canAlpha);
    const idleCamWeight = MathUtils.clamp(1 - progress * 1.15, 0, 1) * tunnelCamStability;
    const camDriftX = Math.sin(t * 0.35) * 0.018 * idleCamWeight + Math.sin(t * 0.11) * 0.006 * idleCamWeight;
    const camDriftY = Math.cos(t * 0.28) * 0.012 * idleCamWeight;
    const camDriftZ = Math.sin(t * 0.19) * 0.022 * idleCamWeight;
    camera.position.set(cam.x + camDriftX, cam.y + camDriftY, cam.z + camDriftZ);

    const lookMicroX = Math.sin(t * 0.42) * 0.012 * idleCamWeight;
    const lookMicroY = Math.cos(t * 0.33) * 0.01 * idleCamWeight;
    camera.lookAt(cam.targetX + lookMicroX, cam.targetY + lookMicroY, cam.targetZ);
    camera.updateProjectionMatrix();

    const rim = scrollDisplay.rimIntensity * (1 + pulse * 0.4);
    const breath = 1 + Math.sin(t * 0.72) * 0.07 + Math.sin(t * 0.31) * 0.04;
    const rarePulse = Math.pow(Math.max(0, Math.sin(t * 0.095)), 9) * 0.28;
    const scrollReact = 1 + Math.min(scrollDisplay.velocity, 1) * 0.22;
    const rimMod = rim * breath * (1 + rarePulse) * scrollReact;
    if (rimPoint.current) rimPoint.current.intensity = 0.85 * rimMod;
    if (rimSpot.current) rimSpot.current.intensity = 1.0 * rimMod * (0.96 + Math.sin(t * 0.55) * 0.05);

    const rimOrbit = idleWeight * (reducedMotion ? 0 : 1) * (mobile ? 0.35 : 1);
    if (rimPoint.current) {
      rimPoint.current.position.set(
        -2.5 + Math.sin(t * 0.44) * 0.62 * rimOrbit,
        1.45 + Math.cos(t * 0.36) * 0.28 * rimOrbit,
        2.1 + Math.cos(t * 0.41) * 0.48 * rimOrbit
      );
    }
    if (rimSpot.current) {
      rimSpot.current.position.set(
        3.05 + Math.cos(t * 0.31) * 0.72 * rimOrbit,
        3.85 + Math.sin(t * 0.27) * 0.38 * rimOrbit,
        1.15 + Math.sin(t * 0.39) * 0.52 * rimOrbit
      );
    }
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
      <mesh ref={floorShadow} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[2, 2, 1, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          map={floorShadowMap}
          transparent
          opacity={1}
          depthWrite={false}
          depthTest
          toneMapped={false}
        />
      </mesh>
      <CanModel groupRef={canRig} />
      <PostEffects enabled={postFx && !mobile && !reducedMotion} />
    </>
  );
}
