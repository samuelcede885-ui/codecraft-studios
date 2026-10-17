"use client";

import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "fary-intro-seen";
const INTRO_MS = 8000;
const MAX_MS = 11000;

declare global {
  interface Window {
    __faryIntroDone?: boolean;
  }
}

/** Avisa al resto de la página (animación del hero, scroll suave) de que la intro terminó. */
function announceDone() {
  window.__faryIntroDone = true;
  document.documentElement.classList.remove("intro-playing");
  window.dispatchEvent(new Event("fary:intro-done"));
}

/**
 * Intro animada del logo de Fary Labs antes de mostrar la web (WebP animado de 8 s,
 * generado desde el vídeo original: funciona también donde no se permite <video>).
 * Se ve una vez por sesión; se omite con prefers-reduced-motion (ver script en layout.tsx).
 */
export function Preloader() {
  const [phase, setPhase] = useState<"play" | "leaving" | "done">("play");
  const img = useRef<HTMLImageElement>(null);
  const endTimer = useRef<number | undefined>(undefined);
  const finished = useRef(false);

  function finish(immediate = false) {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    announceDone();
    if (immediate) {
      setPhase("done");
    } else {
      setPhase("leaving");
      window.setTimeout(() => setPhase("done"), 700);
    }
  }

  /** La animación dura 8 s desde que la imagen se muestra (o se vuelve a montar). */
  function startClock() {
    window.clearTimeout(endTimer.current);
    endTimer.current = window.setTimeout(() => finish(), INTRO_MS);
  }

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      finish(true);
      return;
    }
    document.documentElement.classList.add("intro-playing");
    // La imagen puede haber cargado antes de que React tome el control.
    if (img.current?.complete && img.current.naturalWidth > 0) startClock();
    const timer = window.setTimeout(() => finish(), MAX_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(endTimer.current);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- animación, no foto */}
      <img
        className="preloader__video"
        src="/projects/fary-intro.webp"
        alt=""
        width={1280}
        height={720}
        ref={img}
        onLoad={startClock}
        onError={() => finish()}
      />
      <button type="button" className="preloader__skip" tabIndex={0} onClick={() => finish()}>
        Saltar intro
      </button>
    </div>
  );
}
