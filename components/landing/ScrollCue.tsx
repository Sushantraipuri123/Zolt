'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ScrollCueProps {
  className?: string;
  /** Hero matches reference: mouse + "SCROLL TO EXPLORE" */
  variant?: 'default' | 'hero';
}

export default function ScrollCue({ className = '', variant = 'default' }: ScrollCueProps) {
  const reduceMotion = useReducedMotion();
  const isHero = variant === 'hero';

  return (
    <motion.div
      className={`scroll-cue pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:bottom-10 ${className}`}
      aria-hidden
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, 6, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 2.4,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }
      }
    >
      {isHero ? (
        <>
          <motion.svg
            className="h-9 w-5 text-white/90"
            viewBox="0 0 24 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="7" y="5" width="10" height="18" rx="5" />
            <circle cx="12" cy="10" r="1.2" fill="currentColor" stroke="none" />
            <path d="M12 26v8" strokeLinecap="round" />
          </motion.svg>
          <span className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#a0a0a0]">
            SCROLL TO EXPLORE
          </span>
        </>
      ) : (
        <>
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-muted">
            Scroll to activate
          </span>
          <motion.svg
            className="scroll-cue-chevron h-4 w-4 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </>
      )}
    </motion.div>
  );
}
