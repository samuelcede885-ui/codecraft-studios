"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { assetUrl } from "@/lib/assets";

type Img = { src: string; alt: string };

/**
 * Comparación antes / después con una línea que se arrastra (ratón, dedo o teclado).
 * Usar solo con imágenes reales del proyecto: sin `before` y `after` no se renderiza nada.
 * En táctil el gesto vertical sigue desplazando la página; solo el horizontal mueve la línea.
 */
export function BeforeAfterComparison({ before, after, caption }: { before?: Img; after?: Img; caption?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  if (!before?.src || !after?.src) return null;

  function moveTo(clientX: number) {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }

  function down(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  }

  function key(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 2;
    const next = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, next)));
  }

  return (
    <figure className="ba">
      <div
        ref={box}
        className="ba__stage"
        style={{ "--ba": `${pos}%` } as React.CSSProperties}
        onPointerDown={down}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
        <img className="ba__img" src={assetUrl(after.src)} alt={after.alt} width={1600} height={900} loading="lazy" decoding="async" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
        <img className="ba__img ba__img--before" src={assetUrl(before.src)} alt={before.alt} width={1600} height={900} loading="lazy" decoding="async" draggable={false} />
        <span className="ba__tag ba__tag--before" aria-hidden="true">
          Antes
        </span>
        <span className="ba__tag ba__tag--after" aria-hidden="true">
          Después
        </span>
        <div
          className="ba__handle"
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes y después"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)} % antes`}
          onKeyDown={key}
        >
          <span className="ba__knob" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      {caption && <figcaption className="ba__caption">{caption}</figcaption>}
    </figure>
  );
}
