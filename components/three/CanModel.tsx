'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import type { Material, Mesh, MeshStandardMaterial } from 'three';

const MODEL_URL = '/zoltcan3d.glb';
useGLTF.preload(MODEL_URL);

/** Normalised can height in world units (the rig scales relative to this). */
export const CAN_HEIGHT = 2.2;

interface CanModelProps {
  materialsRef: React.RefObject<Material[]>;
  onReady?: () => void;
}

export default function CanModel({ materialsRef, onReady }: CanModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = CAN_HEIGHT / (size.y || 1);
    clone.scale.setScalar(s);
    clone.position.copy(center).multiplyScalar(-s);
    return clone;
  }, [scene]);

  useEffect(() => {
    const mats: Material[] = [];
    model.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((mat) => {
        const m = mat as MeshStandardMaterial;
        if (m.isMeshStandardMaterial) {
          m.metalness = Math.min(m.metalness + 0.15, 1);
          m.roughness = Math.max(m.roughness - 0.08, 0.12);
          m.envMapIntensity = 1.6;
        }
        if (!mats.includes(mat)) mats.push(mat);
      });
    });
    materialsRef.current = mats;
    onReady?.();
  }, [model, materialsRef, onReady]);

  return <primitive object={model} />;
}
