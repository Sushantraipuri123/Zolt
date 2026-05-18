'use client';

import { Sparkles } from '@react-three/drei';

interface Atmosphere3DProps {
  mobile?: boolean;
}

export default function Atmosphere3D({ mobile = false }: Atmosphere3DProps) {
  return (
    <>
      <fog attach="fog" args={['#030303', 5, 16]} />
      <Sparkles
        count={mobile ? 22 : 48}
        scale={[12, 8, 12]}
        size={mobile ? 1.2 : 1.8}
        speed={0.22}
        opacity={0.35}
        color="#8ab4ff"
      />
    </>
  );
}
