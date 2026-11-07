import { useEffect, useState } from 'react';

/**
 * Presencia con salida animada sin librerías: monta al abrir, marca `shown`
 * un frame después (para que la transición CSS arranque) y desmonta al terminar
 * la salida. Con reduced-motion desmonta de inmediato.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setShown(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setMounted(false), reduce ? 0 : exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);

  return { mounted, shown };
}
