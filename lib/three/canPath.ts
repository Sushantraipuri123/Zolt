import { ScrollTrigger } from '@/lib/gsap';

/**
 * Keyframed scroll path for the hero can.
 *
 * Instead of many overlapping tweens all writing to the same object, every
 * section declares *where the can should be* at a given scroll position.
 * Positions are resolved through ScrollTrigger (so pin spacing is always
 * accounted for and recomputed on refresh), and the can rig samples the path
 * each frame. Deterministic, reversible, and impossible to "fight".
 *
 * Units:
 *  - x, y: normalised viewport units (-1..1 = edge to edge at the can's depth)
 *  - scale: 1 ≈ can is 60% of the viewport height (clamped by width on mobile)
 *  - rot*: radians
 *  - glow / arcs / rings / alpha / idle: 0..1 effect levels
 */
export interface CanPose {
  x: number;
  y: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  glow: number;
  arcs: number;
  rings: number;
  alpha: number;
  /** How much idle float + pointer tilt applies. */
  idle: number;
}

export const POSE_KEYS = [
  'x',
  'y',
  'scale',
  'rotX',
  'rotY',
  'rotZ',
  'glow',
  'arcs',
  'rings',
  'alpha',
  'idle',
] as const;

const LAYOUT_KEYS = new Set<keyof CanPose>(['x', 'y', 'scale']);

export const DEFAULT_POSE: CanPose = {
  x: 0,
  y: 0,
  scale: 1,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  glow: 0.5,
  arcs: 0,
  rings: 0,
  alpha: 1,
  idle: 0,
};

export type PoseInput = Partial<CanPose>;

export interface CanKeyframe {
  /** Element selector whose ScrollTrigger `start` gives this keyframe's scroll position. */
  trigger?: string;
  start?: string;
  /** Alternative: compute the absolute scroll position (e.g. a fraction through a pin). */
  at?: () => number | null;
  pose: PoseInput;
  /**
   * Mobile layout (x / y / scale). On mobile, layout keys from `pose` are ignored
   * and held from the previous keyframe unless given here — rotation and FX
   * still come from `pose`.
   */
  mobile?: PoseInput;
}

interface Stop {
  y: number;
  pose: CanPose;
}

let stops: Stop[] = [];

export function registerCanPath(keyframes: CanKeyframe[], isMobile: () => boolean): () => void {
  const entries = keyframes.map((kf) => ({
    kf,
    st: kf.trigger
      ? ScrollTrigger.create({ trigger: kf.trigger, start: kf.start ?? 'top top' })
      : undefined,
  }));

  const rebuild = () => {
    const mobile = isMobile();
    let prev: CanPose = { ...DEFAULT_POSE };
    const next: Stop[] = [];

    for (const { kf, st } of entries) {
      const pose: CanPose = { ...prev };
      for (const k of POSE_KEYS) {
        const v = kf.pose[k];
        if (v === undefined) continue;
        if (mobile && LAYOUT_KEYS.has(k)) continue;
        pose[k] = v;
      }
      if (mobile && kf.mobile) Object.assign(pose, kf.mobile);
      prev = pose;

      const y = kf.at ? kf.at() : st ? st.start : null;
      if (y === null || !Number.isFinite(y)) continue;
      next.push({ y, pose });
    }

    next.sort((a, b) => a.y - b.y);
    stops = next;
  };

  rebuild();
  ScrollTrigger.addEventListener('refresh', rebuild);

  return () => {
    ScrollTrigger.removeEventListener('refresh', rebuild);
    entries.forEach((e) => e.st?.kill());
    stops = [];
  };
}

/** Smootherstep: zero velocity at every keyframe, so the can "lands" in each section. */
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export function sampleCanPath(scroll: number, out: CanPose): boolean {
  const n = stops.length;
  if (!n) return false;

  if (scroll <= stops[0].y) {
    Object.assign(out, stops[0].pose);
    return true;
  }
  if (scroll >= stops[n - 1].y) {
    Object.assign(out, stops[n - 1].pose);
    return true;
  }

  let i = 0;
  while (i < n - 2 && scroll >= stops[i + 1].y) i++;

  const a = stops[i];
  const b = stops[i + 1];
  const span = b.y - a.y;
  const t = span > 0 ? smoother((scroll - a.y) / span) : 1;

  for (const k of POSE_KEYS) out[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * t;
  return true;
}

/** Scroll position at `frac` (0..1) through the pinned ScrollTrigger with this id. */
export const pinPoint = (id: string, frac: number) => () => {
  const st = ScrollTrigger.getById(id);
  return st ? st.start + (st.end - st.start) * frac : null;
};
