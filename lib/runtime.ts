/**
 * Shared, mutable per-frame state. Written by the scroll ticker / pointer
 * listeners / intro timeline and read inside R3F `useFrame` and GSAP tickers.
 * Never put this in React state — it changes every frame.
 */
export const runtime = {
  /** Smoothed scroll velocity, normalised to roughly -1..1 (positive = scrolling down). */
  velocity: 0,
  /** Last non-trivial scroll direction. */
  direction: 1 as 1 | -1,
  /** Pointer position, -1..1 from viewport centre (desktop only). */
  pointerX: 0,
  pointerY: 0,
  /** Lightning impulse 0..~1.5, decays every frame. Drives arcs, halo, rim lights, DOM flash. */
  flash: 0,
  /** Pending spin impulse from "tap the can". Consumed by the can rig. */
  kick: 0,
  reducedMotion: false,
};

/**
 * Intro offsets layered on top of the scroll path. Owned exclusively by the
 * hero intro timeline, so it can never fight the scroll choreography.
 * y is in normalised viewport units (1 = half the viewport height).
 */
export const canIntro = {
  y: -1.7,
  spin: -Math.PI * 4,
  scale: 0.6,
  alpha: 0,
};

/** Effect levels the can rig publishes each frame for the FX components. */
export const canFx = {
  glow: 0,
  arcs: 0,
  rings: 0,
  alpha: 0,
};

export function triggerFlash(amount = 1) {
  runtime.flash = Math.max(runtime.flash, amount);
}

export function kickCan(amount = 1) {
  runtime.kick += amount;
  triggerFlash(0.55);
}
