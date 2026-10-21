"use client";

import { useEffect, useState } from "react";
import type gsap from "gsap";
import { Reel } from "./Reel";
import { reelScreens, type ReelId } from "./reels";

declare global {
  interface Window {
    /** Línea de tiempo de la bobina, para que el script de grabación la recorra. */
    __reel?: gsap.core.Timeline;
  }
}

/** Ocupa toda la ventana (16:9) con la bobina indicada en ?reel=… y la deja pausada. */
export function RecordStage() {
  const [id, setId] = useState<ReelId | null>(null);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("reel") as ReelId | null;
    setId(r && r in reelScreens ? r : "gramercy");
    document.documentElement.classList.add("intro-seen", "is-recording");
  }, []);

  if (!id) return null;
  return <Reel id={id} mode="record" className="reel--stage" onReady={(tl) => (window.__reel = tl)} />;
}
