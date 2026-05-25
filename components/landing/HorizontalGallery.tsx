'use client';

import { useRef } from 'react';

/**
 * GSAP contract: parent `<section>` holds ref `horizontalGallery`.
 * `#horizontal-track`, `.hg-panel`, `.hg-title`, `.hg-desc`, `.hg-copy`, `.hg-parallax-slow`
 */
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
            className="hg-parallax-slow absolute inset-0 bg-gradient-to-br from-orange-950/30 via-transparent to-black pointer-events-none will-change-transform"
            aria-hidden
          />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_40px_rgba(0,0,0,0.65)]">
              PURE<br />
              VELOCITY.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Break the barrier. Instant kinetic energy designed to push your limits beyond the maximum threshold.
            </p>
          </div>
        </div>

        {/* Panel 2 — Zero sugar */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 bg-gradient-to-br from-zinc-800/45 via-black to-black pointer-events-none will-change-transform"
            aria-hidden
          />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_50px_rgba(0,0,0,0.7)]">
              <span className="hg-accent text-white">ZERO</span>
              <br />
              <span className="hg-accent text-[#ff7120] [text-shadow:0_0_28px_rgba(255,113,32,0.35)]">SUGAR.</span>
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Engineered without compromise. A crystalline molecular matrix that delivers pure kinetic surge without the metabolic crash.
            </p>
          </div>
        </div>

        {/* Panel 3 — Neural sync */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 bg-gradient-to-bl from-cyan-950/35 via-transparent to-black pointer-events-none will-change-transform"
            aria-hidden
          />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-[#00e5ff] text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_36px_rgba(0,229,255,0.25)]">
              NEURAL<br />
              SYNC.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              L-Theanine and adaptogens form a cognitive bridge, locking your mind into an impenetrable flow state. Absolute focus.
            </p>
          </div>
        </div>

        {/* Panel 4 — Kinetic drive */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 bg-gradient-to-tr from-[#c8ff00]/12 via-zinc-950/55 to-black pointer-events-none will-change-transform"
            aria-hidden
          />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_40px_rgba(0,0,0,0.65)]">
              KINETIC<br />
              DRIVE.
            </h3>
            <p className="hg-desc text-zinc-300 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              Sustained ATP signaling for long-range output—built for night sessions, long shifts, and deep work without the cliff.
            </p>
          </div>
        </div>

        {/* Panel 5 — Ionic matrix */}
        <div className="hg-panel w-screen h-screen shrink-0 flex flex-col justify-center items-start px-8 md:px-32 relative overflow-hidden">
          <div
            className="hg-parallax-slow absolute inset-0 bg-gradient-to-tl from-emerald-900/35 via-zinc-950/40 to-black pointer-events-none will-change-transform"
            aria-hidden
          />
          <div className="hg-copy relative z-10 w-full md:max-w-xl overflow-visible">
            <h3 className="hg-title text-white text-[10vw] md:text-8xl font-outfit font-black uppercase tracking-tighter leading-[0.88] mb-6 md:mb-8 [text-shadow:0_0_48px_rgba(255,255,255,0.12)]">
              <span className="hg-accent text-[#00e5ff] [text-shadow:0_0_24px_rgba(0,229,255,0.35)]">IONIC</span>
              <br />
              <span className="hg-accent text-white">MATRIX.</span>
            </h3>
            <p className="hg-desc text-zinc-200 max-w-md md:max-w-lg text-sm md:text-lg font-light leading-relaxed">
              400mg Sodium Citrate. 150mg Potassium. Flawless cellular absorption for sustained endurance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
