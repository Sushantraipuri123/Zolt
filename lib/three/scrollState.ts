/** GSAP writes targets; R3F useFrame lerps toward these values */
export const scrollState = {
  progress: 0,
  can: {
    x: 0.8,
    y: 0.1,
    z: 0,
    rotX: 0.08,
    rotY: -0.2,
    rotZ: 0,
    scale: 1,
  },
  camera: {
    x: 0,
    y: 0.2,
    z: 5.2,
    targetX: 0.6,
    targetY: 0,
    targetZ: 0,
  },
  rimIntensity: 1.2,
};

export const scrollDisplay = {
  progress: 0,
  can: { ...scrollState.can },
  camera: { ...scrollState.camera },
  rimIntensity: scrollState.rimIntensity,
};

export function lerpScrollDisplay(factor: number) {
  const t = 1 - Math.pow(1 - factor, 3);
  scrollDisplay.progress += (scrollState.progress - scrollDisplay.progress) * t;
  scrollDisplay.rimIntensity +=
    (scrollState.rimIntensity - scrollDisplay.rimIntensity) * t;

  (['x', 'y', 'z', 'rotX', 'rotY', 'rotZ', 'scale'] as const).forEach((k) => {
    scrollDisplay.can[k] += (scrollState.can[k] - scrollDisplay.can[k]) * t;
  });

  (['x', 'y', 'z', 'targetX', 'targetY', 'targetZ'] as const).forEach((k) => {
    scrollDisplay.camera[k] += (scrollState.camera[k] - scrollDisplay.camera[k]) * t;
  });
}
