'use client';

import { Sparkles } from '@react-three/drei';

interface Atmosphere3DProps {
  mobile?: boolean;
}

export default function Atmosphere3D({ mobile = false }: Atmosphere3DProps) {
  const count = mobile ? 20 : 44;
  const cyanCount = Math.floor(count * 0.85);
  const sparkCount = count - cyanCount;

  return (
    <>
      <fog attach="fog" args={['#020202', 5, 16]} />
      <Sparkles
        count={cyanCount}
        scale={[12, 8, 12]}
        size={mobile ? 1.1 : 1.6}
        speed={0.28}
        opacity={0.4}
        color="#00e5ff"
      />
      <Sparkles
        count={sparkCount}
        scale={[10, 6, 10]}
        size={mobile ? 0.9 : 1.2}
        speed={0.35}
        opacity={0.25}
        color="#c8ff00"
      />
    </>
  );
}
