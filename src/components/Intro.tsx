"use client";

import { useEffect, useRef, useState } from "react";
import { FARY_PATHS, FIRMA_VIEWBOX, LABS_PATHS, MARK_PATHS } from "./brandPaths";

const SEEN_KEY = "fary-intro-seen";
/** Momento en que empieza la transición hacia la página y fin total de la intro (ms). */
const REVEAL_AT = 2200;
const END_AT = 2700;

declare global {
  interface Window {
    __faryIntroDone?: boolean;
    /** performance.now() cuando el navegador pintó la intro (lo fija el script del <head>). */
    __faryIntroT0?: number;
  }
}

/** Avisa al resto de la página (entrada del hero, scroll suave) de que ya puede arrancar. */
function announceDone() {
  if (window.__faryIntroDone) return;
  window.__faryIntroDone = true;
  document.documentElement.classList.remove("intro-playing");
  window.dispatchEvent(new Event("fary:intro-done"));
}

/**
 * Intro de marca (≈2,7 s): fondo negro → las piezas del símbolo avanzan en la dirección de la flecha
 * → "Fary" → "labs" → la página. Usa la firma oficial del manual, sin contornos ni efectos.
 * La coreografía vive en CSS (intro.css) para empezar en el primer pintado, sin esperar a JS.
 * Se ve una vez por sesión y se omite con prefers-reduced-motion (script del <head> en layout.tsx).
 */
export function Intro() {
  const [phase, setPhase] = useState<"play" | "skip" | "done">("play");
  const finished = useRef(false);
  // Si el visor vuelve a montar el nodo, las animaciones CSS continúan desde donde iban.
  const offset = typeof window === "undefined" ? 0 : (window.__faryIntroT0 ?? 0) - performance.now();

  function finish(skip = false) {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    announceDone();
    if (skip) {
      setPhase("skip");
      window.setTimeout(() => setPhase("done"), 320);
    } else {
      setPhase("done");
    }
  }

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      announceDone();
      setPhase("done");
      return;
    }
    document.documentElement.classList.add("intro-playing");
    const elapsed = performance.now() - (window.__faryIntroT0 ?? 0);
    const reveal = window.setTimeout(announceDone, Math.max(0, REVEAL_AT - elapsed));
    const end = window.setTimeout(() => finish(), Math.max(0, END_AT - elapsed));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish(true);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(end);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`intro ${phase === "skip" ? "is-skipping" : ""}`}
      style={{ "--intro-offset": `${Math.min(0, offset)}ms` } as React.CSSProperties}
      suppressHydrationWarning
    >
      <svg className="intro__logo" viewBox={FIRMA_VIEWBOX} role="img" aria-label="Fary Labs" fill="#fff" fillRule="evenodd">
        {MARK_PATHS.map((d, i) => (
          <path key={`m${i}`} className="intro__piece" d={d} style={{ "--i": i } as React.CSSProperties} />
        ))}
        {FARY_PATHS.map((d, i) => (
          <path key={`f${i}`} className="intro__letter" d={d} style={{ "--i": i } as React.CSSProperties} />
        ))}
        {LABS_PATHS.map((d, i) => (
          <path key={`l${i}`} className="intro__labs" d={d} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </svg>
      <button type="button" className="intro__skip" onClick={() => finish(true)}>
        Saltar intro
      </button>
    </div>
  );
}
