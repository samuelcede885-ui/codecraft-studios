import { useEffect, useRef } from 'react';

/**
 * Aparición progresiva: marca data-visible="true" cuando el elemento entra en pantalla.
 * Sin IntersectionObserver (o con reduced-motion) el contenido queda visible de inmediato.
 */
export function useReveal<T extends HTMLElement>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.matches('.reveal') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => (t.dataset.visible = 'true'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.visible = 'true';
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}
