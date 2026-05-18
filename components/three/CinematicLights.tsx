'use client';

import { Environment, ContactShadows } from '@react-three/drei';

export default function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#8090ff" />
      <pointLight position={[0, -2, 3]} intensity={0.25} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.55} />
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.55}
        scale={3.5}
        blur={2.2}
        far={2.8}
      />
    </>
  );
}
