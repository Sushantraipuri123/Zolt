'use client';

import { Environment, ContactShadows } from '@react-three/drei';

export default function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.5}
        color="#f5f8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#00e5ff" />
      <pointLight position={[0, -2, 3]} intensity={0.2} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.6} />
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.6}
        scale={3}
        blur={1.8}
        far={2.5}
      />
    </>
  );
}
