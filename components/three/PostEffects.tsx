'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

interface PostEffectsProps {
  enabled?: boolean;
}

export default function PostEffects({ enabled = true }: PostEffectsProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.82}
        luminanceSmoothing={0.9}
        intensity={0.35}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.12} darkness={0.65} />
    </EffectComposer>
  );
}
