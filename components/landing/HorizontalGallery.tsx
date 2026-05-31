'use client';

import { useRef, type ReactNode } from 'react';

/**
 * GSAP contract: parent `<section>` holds ref `horizontalGallery`.
 * `#horizontal-track`, `.hg-panel`, `.hg-title`, `.hg-desc`, `.hg-copy`, `.hg-features`, `.hg-feature-icon`, `.hg-parallax-slow`, `.hg-pattern`, `.hg-decor`
 */
function HgIconBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="hg-feature-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#ff7120]/50 bg-[#ff7120]/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:h-14 md:w-14"
      aria-hidden
    >
      <span className="flex h-5 w-5 items-center justify-center text-[#ff7120] md:h-6 md:w-6 [&>svg]:h-full [&>svg]:w-full">
        {children}
      </span>
    </div>
  );
}

function HgFeatureIcons({ variant }: { variant: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div
      className="hg-features mt-8 flex flex-wrap gap-2.5 md:gap-3"
      aria-hidden
    >
      {variant === 1 && (
        <>
          <HgIconBox>
            <svg viewBox="0 0 24 24" className="text-[#ff7120]" fill="currentColor" aria-hidden>
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" className="text-[#ff7120]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              <path d="M4 15s2-2 8-2 8 2 8 2M4 9s2 2 8 2 8-2 8-2" />
              <path d="M6 19h12" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" className="text-[#ff7120]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" className="text-[#ff7120]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </HgIconBox>
        </>
      )}
      {variant === 2 && (
        <>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="8" />
              <path d="M7 7l10 10" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.5L12 16.3 6.4 20.3l2.1-6.5L3 9.8h6.8L12 3z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M12 3c-4 4-6 7-6 10a6 6 0 0012 0c0-3-2-6-6-10z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <rect x="5" y="5" width="6" height="6" rx="1" />
              <rect x="13" y="5" width="6" height="6" rx="1" />
              <rect x="5" y="13" width="6" height="6" rx="1" />
              <rect x="13" y="13" width="6" height="6" rx="1" />
            </svg>
          </HgIconBox>
        </>
      )}
      {variant === 3 && (
        <>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <path d="M9 5c-2 2-3 5-3 8 0 4 2 7 5 8M15 5c2 2 3 5 3 8 0 4-2 7-5 8" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M4 14c2-4 4-6 8-6s6 2 8 6M4 10c2 4 4 6 8 6s6-2 8-6" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="8" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <circle cx="7" cy="10" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="14" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <path d="M8 10l8-2M9 11l5 5" />
            </svg>
          </HgIconBox>
        </>
      )}
      {variant === 4 && (
        <>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <rect x="6" y="7" width="12" height="10" rx="2" />
              <path d="M9 11h6M9 14h4" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-2 3-4 6-4 9a4 4 0 008 0c0-3-2-6-4-9z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M4 18l4-6 4 3 4-8 4 11H4z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </HgIconBox>
        </>
      )}
      {variant === 5 && (
        <>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <path d="M12 3c-3 4-5 7-5 10a5 5 0 0010 0c0-3-2-6-5-10z" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 8l8 8M16 8l-8 8" opacity="0.35" />
              <circle cx="12" cy="12" r="7" />
            </svg>
          </HgIconBox>
          <HgIconBox>
            <svg viewBox="0 0 24 24" fill="none" className="text-[#ff7120]" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </HgIconBox>
        </>
      )}
    </div>
  );
}

function HgPanelPattern() {
  return (
    <div
      className="hg-pattern pointer-events-none absolute inset-0 z-0 opacity-[0.055] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_1px,transparent_1.5px)] bg-[length:22px_22px] mix-blend-soft-light"
      aria-hidden
    />
  );
}

function HgPanelDecor({ variant }: { variant: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div
      className="hg-decor pointer-events-none absolute inset-0 z-[1] overflow-hidden hidden md:block"
      aria-hidden
    >
      {variant === 1 && (
        <>
          <div
            className="absolute right-[8%] top-[22%] h-3 w-40 -rotate-[38deg] rounded-full bg-[#ff7120]/20 shadow-[0_0_32px_rgba(255,113,32,0.25)] border border-[#ff7120]/30"
          />
          <div
            className="absolute right-[14%] top-[38%] h-2.5 w-28 -rotate-[38deg] rounded-full bg-[#ff7120]/12 border border-[#ff7120]/20"
          />
          <svg
            className="absolute right-[6%] bottom-[18%] h-24 w-24 text-[#ff7120]/35"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 32h40M36 18l16 14-16 14" />
          </svg>
        </>
      )}
      {variant === 2 && (
        <>
          <div
            className="absolute right-[10%] top-[26%] h-16 w-16 rotate-12 rounded-lg bg-[#ff7120]/15 border border-[#ff7120]/35 shadow-[0_0_40px_rgba(255,113,32,0.2)]"
          />
          <div
            className="absolute right-[22%] top-[44%] h-11 w-11 -rotate-[18deg] rounded-md bg-[#ff7120]/10 border border-[#ff7120]/25"
          />
          <svg
            className="absolute right-[8%] bottom-[22%] h-28 w-28 text-[#ff7120]/30"
            viewBox="0 0 56 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M28 6 L46 18 L46 38 L28 50 L10 38 L10 18 Z" />
            <path d="M28 6 L28 50 M10 18 L46 38 M46 18 L10 38" opacity="0.6" />
          </svg>
        </>
      )}
      {variant === 3 && (
        <>
          <svg
            className="absolute right-[12%] top-[24%] h-32 w-32 text-[#ff7120]/32"
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <circle cx="20" cy="24" r="5" fill="currentColor" fillOpacity="0.35" />
            <circle cx="56" cy="20" r="5" fill="currentColor" fillOpacity="0.35" />
            <circle cx="44" cy="56" r="5" fill="currentColor" fillOpacity="0.35" />
            <path d="M24 26 L52 22 M50 24 L46 52 M24 28 L42 52" opacity="0.85" />
          </svg>
          <div className="absolute right-[8%] bottom-[28%] h-2 w-20 rounded-full bg-[#ff7120]/15 border border-[#ff7120]/25 rotate-6" />
          <div className="absolute right-[6%] bottom-[20%] h-2 w-14 rounded-full bg-[#ff7120]/10 border border-[#ff7120]/18 -rotate-3" />
        </>
      )}
      {variant === 4 && (
        <>
          <div className="absolute right-[10%] top-[30%] flex flex-col gap-2.5 items-end">
            <div className="h-2.5 w-44 rounded-full bg-[#ff7120]/18 border border-[#ff7120]/28 shadow-[0_0_24px_rgba(255,113,32,0.15)]" />
            <div className="h-2.5 w-32 rounded-full bg-[#ff7120]/12 border border-[#ff7120]/22" />
            <div className="h-2.5 w-24 rounded-full bg-[#ff7120]/10 border border-[#ff7120]/18" />
          </div>
          <svg
            className="absolute right-[7%] bottom-[20%] h-20 w-20 text-[#ff7120]/28"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 24h32M24 8v32" opacity="0.5" />
            <rect x="14" y="14" width="20" height="20" rx="3" strokeDasharray="4 3" />
          </svg>
        </>
      )}
      {variant === 5 && (
        <>
          <svg
            className="absolute right-[11%] top-[28%] h-28 w-28 text-[#ff7120]/30"
            viewBox="0 0 72 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M36 14v44M14 36h44" />
            <circle cx="36" cy="36" r="10" strokeOpacity="0.5" />
            <path d="M52 20l8-6M52 52l8 6M20 52l-8 6M20 20l-8-6" strokeOpacity="0.4" />
          </svg>
          <div className="absolute right-[9%] bottom-[26%] h-14 w-14 rotate-45 border-2 border-[#ff7120]/25 bg-[#ff7120]/8 shadow-[0_0_28px_rgba(255,113,32,0.12)]" />
          <div className="absolute right-[20%] bottom-[18%] h-3 w-16 rounded-full bg-[#ff7120]/14 border border-[#ff7120]/22 -rotate-12" />
        </>
      )}
    </div>
  );
}

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div id="horizontal-gallery-wrapper" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none" />

      <div
        ref={containerRef}
        id="horizontal-track"
        className="flex w-[500vw] h-screen will-change-transform"
      >
        {/* Panel 1 — Pure velocity */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_55%_at_88%_42%,rgba(255,113,32,0.12),transparent_58%),linear-gradient(to_bottom_right,rgba(154,52,18,0.42),transparent_45%,#000000)] pointer-events-none will-change-transform"
            aria-hidden
          />
          <HgPanelPattern />
          <HgPanelDecor variant={1} />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_40px_rgba(0,0,0,0.65)]">
              PURE<br />
              VELOCITY.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Break the barrier. Instant kinetic energy designed to push your limits beyond the maximum threshold.
            </p>
            <HgFeatureIcons variant={1} />
          </div>
        </div>

        {/* Panel 2 — Zero sugar */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_48%,rgba(255,113,32,0.1),transparent_55%),linear-gradient(to_bottom_right,rgba(63,63,70,0.52),#000_55%,#000)] pointer-events-none will-change-transform"
            aria-hidden
          />
          <HgPanelPattern />
          <HgPanelDecor variant={2} />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_50px_rgba(0,0,0,0.7)]">
              <span className="hg-accent text-white">ZERO</span>
              <br />
              <span className="hg-accent text-[#ff7120] [text-shadow:0_0_28px_rgba(255,113,32,0.35)]">SUGAR.</span>
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Engineered without compromise. A crystalline molecular matrix that delivers pure kinetic surge without the metabolic crash.
            </p>
            <HgFeatureIcons variant={2} />
          </div>
        </div>

        {/* Panel 3 — Neural sync */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_48%_at_85%_40%,rgba(255,113,32,0.08),transparent_52%),linear-gradient(to_bottom_left,rgba(8,51,68,0.42),transparent_50%,#000)] pointer-events-none will-change-transform"
            aria-hidden
          />
          <HgPanelPattern />
          <HgPanelDecor variant={3} />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-[#00e5ff] text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_36px_rgba(0,229,255,0.25)]">
              NEURAL<br />
              SYNC.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              L-Theanine and adaptogens form a cognitive bridge, locking your mind into an impenetrable flow state. Absolute focus.
            </p>
            <HgFeatureIcons variant={3} />
          </div>
        </div>

        {/* Panel 4 — Kinetic drive */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 z-0 bg-[radial-gradient(ellipse_72%_52%_at_88%_52%,rgba(255,113,32,0.07),transparent_56%),linear-gradient(to_top_right,rgba(200,255,0,0.14),rgba(24,24,27,0.62)_50%,#000)] pointer-events-none will-change-transform"
            aria-hidden
          />
          <HgPanelPattern />
          <HgPanelDecor variant={4} />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_40px_rgba(0,0,0,0.65)]">
              KINETIC<br />
              DRIVE.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Sustained ATP signaling for long-range output—built for night sessions, long shifts, and deep work without the cliff.
            </p>
            <HgFeatureIcons variant={4} />
          </div>
        </div>

        {/* Panel 5 — Ionic matrix */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 z-0 bg-[radial-gradient(ellipse_68%_50%_at_86%_44%,rgba(255,113,32,0.09),transparent_54%),linear-gradient(to_top_left,rgba(6,78,59,0.4),rgba(24,24,27,0.48)_48%,#000)] pointer-events-none will-change-transform"
            aria-hidden
          />
          <HgPanelPattern />
          <HgPanelDecor variant={5} />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_48px_rgba(255,255,255,0.12)]">
              <span className="hg-accent text-[#00e5ff] [text-shadow:0_0_24px_rgba(0,229,255,0.35)]">IONIC</span>
              <br />
              <span className="hg-accent text-white">MATRIX.</span>
            </h3>
            <p className="hg-desc text-zinc-200 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              400mg Sodium Citrate. 150mg Potassium. Flawless cellular absorption for sustained endurance.
            </p>
            <HgFeatureIcons variant={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
