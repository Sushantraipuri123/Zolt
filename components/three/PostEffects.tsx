'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { scrollDisplay } from '@/lib/three/scrollState';

interface PostEffectsProps {
  enabled?: boolean;
}

export default function PostEffects({ enabled = true }: PostEffectsProps) {
  return null;
}
