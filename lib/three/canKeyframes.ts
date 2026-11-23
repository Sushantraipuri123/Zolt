import type { CanKeyframe } from './canPath';
import { pinPoint } from './canPath';

const T = Math.PI * 2;
/** Yaw that presents the can's front graphic to camera. */
const B = -0.35;

/**
 * The can's journey through the story — one place to art-direct the whole page.
 * Each section "lands" the can in a pose; between keyframes it travels with a
 * smootherstep curve. Spins are cumulative turns so it always rotates forward.
 */
export function buildCanKeyframes(): CanKeyframe[] {
  return [
    // 01 IGNITION — centre stage in front of the giant ZOLT letters.
    {
      trigger: '#home',
      start: 'top top',
      pose: { x: 0, y: -0.02, scale: 1, rotX: 0.06, rotY: B, rotZ: 0, glow: 0.75, arcs: 0.35, rings: 1, alpha: 1, idle: 1 },
      mobile: { x: 0, y: 0.3, scale: 0.62 },
    },

    // 02 PULSE — whips through the crossing marquee bands.
    {
      trigger: '#pulse',
      start: 'center center',
      pose: { x: 0.04, y: 0, scale: 0.8, rotX: 0.35, rotY: B + T, rotZ: -0.5, glow: 1, arcs: 0.75, rings: 0, idle: 0 },
      mobile: { x: 0, y: 0, scale: 0.55 },
    },

    // 03 MANIFESTO — parks right of the statement, slowly turning while you read.
    {
      at: pinPoint('about-pin', 0),
      pose: { x: 0.56, y: -0.06, scale: 0.9, rotX: 0.1, rotY: B + T + 0.45, rotZ: 0.1, glow: 0.45, arcs: 0.12, idle: 0.45 },
      mobile: { x: 0.52, y: 0.68, scale: 0.3 },
    },
    {
      at: pinPoint('about-pin', 1),
      pose: { y: 0.02, rotY: B + T + 1.7, rotZ: 0.04 },
    },

    // 04 INSIDE THE CAN — switches sides on every panel (copy alternates L/R).
    {
      at: pinPoint('inside-pin', 0.02),
      pose: { x: 0.46, y: -0.02, scale: 0.92, rotX: 0.08, rotY: B + 2 * T, rotZ: -0.12, glow: 0.6, arcs: 0.3, rings: 0, idle: 0.3 },
      mobile: { x: 0, y: 0.48, scale: 0.46 },
    },
    {
      at: pinPoint('inside-pin', 0.34),
      pose: { x: -0.46, rotY: B + 3 * T - 0.5, rotZ: 0.14, glow: 0.4, arcs: 0.08 },
    },
    {
      at: pinPoint('inside-pin', 0.67),
      pose: { x: 0.46, rotY: B + 4 * T + 0.45, rotZ: -0.1, glow: 0.5, arcs: 0.15 },
    },
    {
      at: pinPoint('inside-pin', 0.98),
      pose: { x: -0.46, rotY: B + 5 * T, rotZ: 0.12, glow: 0.65, arcs: 0.3 },
    },

    // 05 OVERLOAD — centre, then overcharges: huge, spinning, full arcs, flash at ~72%.
    {
      at: pinPoint('charge-pin', 0),
      pose: { x: 0, y: 0, scale: 0.55, rotX: 0.05, rotY: B + 6 * T, rotZ: 0, glow: 0.5, arcs: 0.35, rings: 0.5, idle: 0 },
      mobile: { x: 0, y: 0.05, scale: 0.4 },
    },
    {
      at: pinPoint('charge-pin', 0.72),
      pose: { scale: 1.32, rotX: 0.12, rotY: B + 9 * T, glow: 1, arcs: 1, rings: 1 },
      mobile: { scale: 0.85 },
    },
    {
      at: pinPoint('charge-pin', 1),
      pose: { scale: 1.12, rotX: 0.04, rotY: B + 9 * T + 0.25, glow: 0.85, arcs: 0.6, rings: 0.8 },
      mobile: { scale: 0.75 },
    },

    // 06 ARENA — right of "Altitude", flips across the lightning wipe to left of "Iron".
    {
      at: pinPoint('arena-pin', 0),
      pose: { x: 0.5, y: -0.04, scale: 0.86, rotX: 0.06, rotY: B + 10 * T, rotZ: -0.14, glow: 0.5, arcs: 0.2, rings: 0, idle: 0.25 },
      mobile: { x: 0, y: 0.5, scale: 0.42 },
    },
    {
      at: pinPoint('arena-pin', 0.38),
      pose: { rotY: B + 10 * T + 0.4 },
    },
    {
      at: pinPoint('arena-pin', 0.72),
      pose: { x: -0.5, rotY: B + 12 * T - 0.4, rotZ: 0.16, glow: 0.65, arcs: 0.35 },
    },
    {
      at: pinPoint('arena-pin', 1),
      pose: { rotY: B + 12 * T - 0.1 },
    },

    // 07 FORMULA — dead centre, one slow inspection turn while callouts draw in.
    {
      at: pinPoint('formula-pin', 0),
      pose: { x: 0, y: -0.04, scale: 0.92, rotX: 0.04, rotY: B + 13 * T, rotZ: 0, glow: 0.6, arcs: 0.18, rings: 0.75, idle: 0.25 },
      mobile: { x: 0, y: 0.28, scale: 0.44 },
    },
    {
      at: pinPoint('formula-pin', 1),
      pose: { rotY: B + 14 * T },
    },

    // 08 GALLERY — blasts off upward and out.
    {
      trigger: '#energy-core',
      start: 'top 70%',
      pose: { x: 0, y: 1.6, scale: 0.5, rotX: 0.3, rotY: B + 15 * T, rotZ: 0.2, glow: 0, arcs: 0.8, rings: 0, alpha: 0, idle: 0 },
      mobile: { x: 0, y: 1.6, scale: 0.35 },
    },

    // 09 YOUR TURN — drops back in from below and lands next to the pre-order.
    {
      trigger: '#final',
      start: 'top bottom',
      pose: { x: -0.46, y: -1.6, scale: 0.9, rotX: 0.1, rotY: B + 16 * T, rotZ: 0, glow: 0.3, arcs: 0.6, alpha: 0 },
      mobile: { x: 0, y: -1.6, scale: 0.5 },
    },
    {
      trigger: '#final',
      start: 'top top',
      pose: { x: -0.46, y: -0.02, scale: 1.02, rotX: 0.06, rotY: B + 17 * T, rotZ: 0, glow: 0.9, arcs: 0.45, rings: 1, alpha: 1, idle: 0.8 },
      mobile: { x: 0, y: 0.5, scale: 0.44 },
    },
    {
      trigger: '#footer',
      start: 'top bottom',
      pose: { rotY: B + 17 * T + 0.3 },
    },
    // …and rockets away as the footer arrives.
    {
      trigger: '#footer',
      start: 'top 30%',
      pose: { y: 1.7, scale: 0.7, rotY: B + 18 * T, arcs: 1, alpha: 0, idle: 0 },
      mobile: { y: 1.7, scale: 0.4 },
    },
  ];
}
