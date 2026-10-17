"use client";

import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "fary-intro-seen";
const MAX_MS = 9500;

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
 * Intro en vídeo del logo de Fary Labs antes de mostrar la web.
 * Se ve una vez por sesión; se omite con prefers-reduced-motion (ver script en layout.tsx).
 */
export function Preloader() {
  const [phase, setPhase] = useState<"play" | "leaving" | "done">("play");
  const video = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      finish(true);
      return;
    }
    document.documentElement.classList.add("intro-playing");
    // Si el navegador no permite reproducir el vídeo, no se bloquea la web.
    video.current?.play().catch(() => finish());
    const timer = window.setTimeout(() => finish(), MAX_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      <video
        ref={video}
        className="preloader__video"
        src="/projects/fary-intro.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => finish()}
      />
      <button type="button" className="preloader__skip" tabIndex={0} onClick={() => finish()}>
        Saltar intro
      </button>
    </div>
  );
}
