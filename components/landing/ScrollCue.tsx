'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ScrollCueProps {
  className?: string;
}

export default function ScrollCue({ className = '' }: ScrollCueProps) {
  const reduceMotion = useReducedMotion();

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
    </motion.div>
  );
}
