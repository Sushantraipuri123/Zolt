'use client';

import { Environment } from '@react-three/drei';

export default function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.5}
        color="#f5f8ff"
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#00e5ff" />
      <pointLight position={[0, -2, 3]} intensity={0.2} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.6} />
    </>
  );
}
