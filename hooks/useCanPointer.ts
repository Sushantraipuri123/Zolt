'use client';

import { useEffect, useState } from 'react';

export interface PointerOffset {
  x: number;
  y: number;
}

export function useCanPointer(enabled = true) {
  const [pointer, setPointer] = useState<PointerOffset>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const mm = window.matchMedia('(min-width: 1024px)');
    if (!mm.matches) return;

    const onMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    const onLeave = () => setPointer({ x: 0, y: 0 });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  return pointer;
}
