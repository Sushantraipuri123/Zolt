'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3 } from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';

useGLTF.preload('/zoltcan3d.glb');

interface CanModelProps {
  groupRef: React.RefObject<Group | null>;
}

const TARGET_HEIGHT = 2.2;

export default function CanModel({ groupRef }: CanModelProps) {
  const { scene } = useGLTF('/zoltcan3d.glb');

  const centered = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    const scale = TARGET_HEIGHT / (size.y || 1);
    clone.scale.setScalar(scale);
    return clone;
  }, [scene]);

  useEffect(() => {
    centered.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if ((mat as MeshStandardMaterial).isMeshStandardMaterial) {
            const m = mat as MeshStandardMaterial;
            m.metalness = Math.min(m.metalness + 0.12, 1);
            m.roughness = Math.max(m.roughness - 0.06, 0.14);
            m.envMapIntensity = 1.5;
            // Condensation read: clearcoat exists on physical-like materials at runtime; TS omits it on MeshStandardMaterial in some @types versions.
            const mExt = m as MeshStandardMaterial & {
              clearcoat?: number;
              clearcoatRoughness?: number;
            };
            mExt.clearcoat = Math.min((mExt.clearcoat ?? 0) + 0.22, 0.55);
            mExt.clearcoatRoughness = Math.max((mExt.clearcoatRoughness ?? 0.35) * 0.85, 0.12);
          }
        });
      }
    });
  }, [centered]);

  return (
    <group ref={groupRef}>
      <primitive object={centered} />
    </group>
  );
}
