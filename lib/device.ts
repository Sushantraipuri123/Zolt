/**
 * Phones and tablets: narrow screens or touch as the main input. These get
 * shorter pinned sections and a lighter 3D scene; desktop stays as designed.
 */
export const COMPACT_QUERY = '(max-width: 1023px), (pointer: coarse)';

export function isCompact(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches;
}

/**
 * How much of the desktop pin length a phone gets. A phone screen is short and
 * a swipe moves it far less than a mouse wheel moves a desktop page, so the
 * desktop lengths took 3–5 swipes per section. About half keeps every
 * animation but lets a section finish in one or two swipes.
 */
export const COMPACT_PIN_SCALE = 0.5;

/** ScrollTrigger `end` for a pinned section: `pct` of the viewport on desktop, shorter on phones. */
export const pinEnd = (pct: number) => () =>
  `+=${isCompact() ? Math.round(pct * COMPACT_PIN_SCALE) : pct}%`;

/** Scale a pixel pin distance the same way. */
export const pinDistance = (px: number) => (isCompact() ? px * COMPACT_PIN_SCALE : px);
