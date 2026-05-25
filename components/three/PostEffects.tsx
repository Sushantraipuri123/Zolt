'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { scrollDisplay } from '@/lib/three/scrollState';

interface PostEffectsProps {
  enabled?: boolean;
}

export default function PostEffects({ enabled = true }: PostEffectsProps) {
  const chromaticRef = useRef<any>(null);
  const bloomRef = useRef<any>(null);
  const dofRef = useRef<any>(null);
  
  // Use a stable Vector2 for offset updates to avoid GC churn
  const caOffset = useRef(new Vector2(0, 0));

  useFrame(() => {
    if (!enabled) return;
    
    // Read directly from the lerped GSAP display state
    const vel = scrollDisplay.velocity;
    
    // 1. Dynamic Chromatic Aberration based on scroll speed
    if (chromaticRef.current) {
      // Scale aberration intensely during fast scrolls
      caOffset.current.set(vel * 0.012, vel * 0.012);
      chromaticRef.current.offset = caOffset.current;
    }
    
    // 2. Velocity-Spiked Bloom
    if (bloomRef.current) {
      // Base bloom plus a bright surge when moving fast
      bloomRef.current.intensity = scrollDisplay.bloomIntensity + (vel * 1.2);
    }
    
    // 3. Dynamic Depth of Field Motion Blur
    if (dofRef.current) {
      // Blur the can slightly when moving extremely fast (cinematic motion blur illusion)
      dofRef.current.bokehScale = vel * 6.0;
    }
  });

  if (!enabled) return null;

  return null;
}
