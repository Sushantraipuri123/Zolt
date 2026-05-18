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
}

export default function CanScene({ mobile = false, postFx = true }: CanSceneProps) {
  const canRig = useRef<Group>(null);
  const rimPoint = useRef<PointLight>(null);
  const rimSpot = useRef<SpotLight>(null);
  const { camera } = useThree();
  const pointer = useCanPointer(!mobile);
  const reducedMotion = usePrefersReducedMotion();
  const idlePhase = useRef(0);

  useFrame((state, delta) => {
    lerpScrollDisplay(reducedMotion ? 1 : 0.1);

    const rig = canRig.current;
    if (!rig) return;

    idlePhase.current += delta;
    const t = idlePhase.current;
    const idleWeight = MathUtils.clamp(1 - scrollDisplay.progress * 1.4, 0, 1);

    const floatY = Math.sin(t * 0.9) * 0.06 * idleWeight;
    const floatX = Math.sin(t * 0.55) * 0.02 * idleWeight;
    const idleRotY = Math.sin(t * 0.35) * 0.06 * idleWeight;
    const idleRotX = Math.sin(t * 0.5) * 0.04 * idleWeight;

    const parallaxX = pointer.x * 0.12 * idleWeight;
    const parallaxY = -pointer.y * 0.08 * idleWeight;

    const c = scrollDisplay.can;
    rig.position.set(
      c.x + floatX,
      c.y + floatY,
      c.z
    );
    rig.rotation.set(
      c.rotX + idleRotX + parallaxY,
      c.rotY + idleRotY + parallaxX,
      c.rotZ
    );
    rig.scale.setScalar(c.scale);

    const cam = scrollDisplay.camera;
    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(cam.targetX, cam.targetY, cam.targetZ);
    camera.updateProjectionMatrix();

    const rim = scrollDisplay.rimIntensity;
    if (rimPoint.current) rimPoint.current.intensity = 0.9 * rim;
    if (rimSpot.current) rimSpot.current.intensity = 1.1 * rim;
  });

  return (
    <>
      <CinematicLights />
      <pointLight
        ref={rimPoint}
        position={[-2.5, 1.5, 2]}
        intensity={0.9}
        color="#6b8cff"
        distance={12}
      />
      <spotLight
        ref={rimSpot}
        position={[3, 4, 1]}
        angle={0.35}
        penumbra={0.8}
        intensity={1.1}
        color="#a8c4ff"
      />
      <Atmosphere3D mobile={mobile} />

      <CanModel groupRef={canRig} />
      <PostEffects enabled={postFx && !mobile && !reducedMotion} />
    </>
  );
}
