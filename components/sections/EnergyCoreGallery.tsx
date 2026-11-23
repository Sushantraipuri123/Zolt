'use client';

import React, { useCallback, useRef, useState } from 'react';

function unsplashUrl(photoId: string, w: number) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Curated adventure / sports — distinct Unsplash `photo-*` ids; Picsum fallback covers removed/blocked assets. */
const ADVENTURE = {
  peaks: {
    photoId: 'photo-1464822759023-fed622ff2c3b',
    alt: 'Alpine ridge above clouds',
    seed: 'zolt-alpine',
  },
  surf: {
    photoId: 'photo-1502680390469-be75c86b636f',
    alt: 'Surfer inside a barrel wave',
    seed: 'zolt-surf',
  },
  climb: {
    photoId: 'photo-1526304640581-d334cdbbf45e',
    alt: 'Outdoor balance and movement on a summit',
    seed: 'zolt-climb',
  },
  run: {
    photoId: 'photo-1476480862126-209bfaa8edc8',
    alt: 'Runner on an outdoor track',
    seed: 'zolt-run',
  },
  gym: {
    photoId: 'photo-1571902943202-507ec2618e8f',
    alt: 'Swimming pool lanes — endurance training',
    seed: 'zolt-gym',
  },
  trail: {
    photoId: 'photo-1483721310020-03333e577078',
    alt: 'Running shoes ready for a trail session',
    seed: 'zolt-trail',
  },
  kayak: {
    photoId: 'photo-1544551763-46a013bb70d5',
    alt: 'Kayak on turquoise water',
    seed: 'zolt-kayak',
  },
  skydive: {
    photoId: 'photo-1505142468610-359e7d316be0',
    alt: 'Skydiver above clouds',
    seed: 'zolt-skydive',
  },
  mtb: {
    photoId: 'photo-1571068316344-75bc76f77890',
    alt: 'Mountain biking and outdoor motion',
    seed: 'zolt-mtb',
  },
  parallax: {
    photoId: 'photo-1506905925346-21bda4d32df4',
    alt: 'Mountain summit above a sea of clouds',
    seed: 'zolt-parallax',
  },
  nightRun: {
    photoId: 'photo-1517836357463-d25dfeac3438',
    alt: 'Night run in the city with stadium lights',
    seed: 'zolt-night-run',
  },
  snowboard: {
    photoId: 'photo-1551698618-1dfe5d97d224',
    alt: 'Snowboarder carving powder',
    seed: 'zolt-snow',
  },
  cliff: {
    photoId: 'photo-1526778548025-fa2f459cd5c1',
    alt: 'Coastal cliff and ocean',
    seed: 'zolt-cliff',
  },
  stadium: {
    photoId: 'photo-1461896836934-ffe607ba8211',
    alt: 'Outdoor stadium and floodlights',
    seed: 'zolt-stadium',
  },
  row: {
    photoId: 'photo-1540497077202-7c8a3999166f',
    alt: 'Crew rowing at sunrise',
    seed: 'zolt-row',
  },
  boulder: {
    photoId: 'photo-1544367567-0f2fcb009e0b',
    alt: 'Athlete stretching before effort',
    seed: 'zolt-stretch',
  },
} as const;

function picsumFallback(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`;
}

function AdventureImg({
  photoId,
  w,
  alt,
  seed,
  className,
  sizes,
}: {
  photoId: string;
  w: number;
  alt: string;
  seed: string;
  className?: string;
  sizes?: string;
}) {
  const primary = unsplashUrl(photoId, w);
  const [src, setSrc] = useState(primary);
  const usedFallback = useRef(false);

  const onError = useCallback(() => {
    if (usedFallback.current) return;
    usedFallback.current = true;
    setSrc(picsumFallback(seed));
  }, [seed]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
    />
  );
}

function GridImg({ shot }: { shot: (typeof ADVENTURE)[keyof typeof ADVENTURE] }) {
  return (
    <div className="ecg-grid-image">
      <AdventureImg
        photoId={shot.photoId}
        w={1200}
        alt={shot.alt}
        seed={shot.seed}
        sizes="(max-width: 1023px) 100vw, 33vw"
      />
    </div>
  );
}

function PinImg({ shot }: { shot: (typeof ADVENTURE)[keyof typeof ADVENTURE] }) {
  return (
    <div className="ecg-pin-box">
      <AdventureImg
        photoId={shot.photoId}
        w={1200}
        alt={shot.alt}
        seed={shot.seed}
        className="ecg-pin-image"
      />
    </div>
  );
}

export default function EnergyCoreGallery() {
  const px = ADVENTURE.parallax;

  return (
    <div className="ecg-inner relative w-full bg-[#030303] text-white">
      <div className="pointer-events-none absolute inset-0 z-[1] bg-radial-vignette opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 0), linear-gradient(180deg, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: 'min(3rem, 8vw) min(3rem, 8vw)',
        }}
        aria-hidden
      />

      <header className="relative z-[2] px-6 pt-20 pb-10 md:px-12 md:pt-28 md:pb-14 max-w-5xl">
        <p className="font-space-grotesk text-[10px] font-black tracking-[0.35em] text-[var(--accent)] uppercase mb-4">
          Core sequence // Scroll
        </p>
        <h2
          className="font-outfit text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]"
          style={{ fontFamily: 'var(--font-orbitron), var(--font-outfit), sans-serif' }}
        >
          ENERGY
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#ffb300] to-[var(--accent-cyan)]">
            {' '}
            DEPTH
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-sm md:text-base text-zinc-500 font-light leading-relaxed">
          A scroll-native gallery: macro grid, parallax compression, and dual-axis drift—built for Lenis + ScrollTrigger.
        </p>
      </header>

      <div className="ecg-grid-section relative z-[2] w-full overflow-visible">
        <div className="ecg-grid-layout">
          <div className="ecg-column ecg-column-1">
            <div className="ecg-column-content">
              <GridImg shot={ADVENTURE.peaks} />
              <GridImg shot={ADVENTURE.surf} />
              <GridImg shot={ADVENTURE.climb} />
            </div>
          </div>
          <div className="ecg-column ecg-column-2">
            <div className="ecg-column-content">
              <GridImg shot={ADVENTURE.run} />
              <GridImg shot={ADVENTURE.gym} />
              <GridImg shot={ADVENTURE.trail} />
            </div>
          </div>
          <div className="ecg-column ecg-column-3">
            <div className="ecg-column-content">
              <GridImg shot={ADVENTURE.kayak} />
              <GridImg shot={ADVENTURE.skydive} />
              <GridImg shot={ADVENTURE.mtb} />
            </div>
          </div>
        </div>
      </div>

      <div className="ecg-spacer" aria-hidden />

      <section className="ecg-parallax-section relative z-[2] w-full overflow-hidden px-4 md:px-8">
        <AdventureImg
          photoId={px.photoId}
          w={1920}
          alt={px.alt}
          seed={px.seed}
          className="ecg-parallax-image"
          sizes="100vw"
        />
      </section>

      <div className="ecg-spacer" aria-hidden />

      <div className="ecg-pin-section relative z-[2] w-full overflow-hidden">
        <div className="ecg-pin-content ecg-pin-content-1">
          <PinImg shot={ADVENTURE.nightRun} />
          <PinImg shot={ADVENTURE.snowboard} />
          <PinImg shot={ADVENTURE.cliff} />
        </div>
        <div className="ecg-pin-content ecg-pin-content-2">
          <PinImg shot={ADVENTURE.stadium} />
          <PinImg shot={ADVENTURE.row} />
          <PinImg shot={ADVENTURE.boulder} />
        </div>
      </div>

      <div className="ecg-spacer ecg-spacer--tall flex items-center justify-center text-center text-zinc-600 text-xs md:text-sm font-space-grotesk tracking-widest uppercase px-6">
        Flow state unlocked
      </div>
    </div>
  );
}
