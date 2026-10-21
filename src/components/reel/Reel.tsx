"use client";

import { useEffect, useRef } from "react";
import type gsap from "gsap";
import { Screen } from "../screens/Screens";
import { buildReel, reelScreens, type ReelId } from "./reels";

/**
 * Bobina: pantallas HTML apiladas en 16:9 con un cursor que navega por ellas.
 * - `record`: queda pausada para que el script de grabación avance fotograma a fotograma.
 * - `live`: se reproduce en bucle (respaldo cuando un video no puede cargarse).
 * `onReady` recibe la línea de tiempo: su tiempo es la fuente de verdad en ambos casos.
 */
export function Reel({
  id,
  mode = "live",
  className,
  onReady,
}: {
  id: ReelId;
  mode?: "live" | "record";
  className?: string;
  onReady?: (tl: gsap.core.Timeline) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;
    // Espera a que las imágenes de las pantallas estén listas: las posiciones del cursor se miden sobre ellas.
    const imgs = [...el.querySelectorAll("img")];
    Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)))).then(() => {
      if (cancelled) return;
      tl = buildReel(id, el);
      if (mode === "live") tl.repeat(-1).play();
      ready.current?.(tl);
    });
    return () => {
      cancelled = true;
      tl?.revert();
    };
  }, [id, mode]);

  return (
    <div ref={root} className={`reel ${className ?? ""}`} data-record={mode === "record" || undefined} aria-hidden="true">
      {reelScreens[id].map((s, i) => (
        <div className="reel__layer" data-reel-layer key={`${s}-${i}`}>
          <Screen id={s} />
        </div>
      ))}
      <span className="reel__cursor" data-reel-cursor>
        <svg viewBox="0 0 24 24">
          <path d="M5 2.5v17.2l4.4-4.2 2.9 6.6 3-1.3-2.9-6.5H18L5 2.5z" fill="#090a0b" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
