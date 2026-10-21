"use client";

import { useEffect, useState } from "react";
import type gsap from "gsap";
import { Reel } from "./Reel";
import { reelScreens, type ReelId } from "./reels";
import { Cover, coverIds, type CoverId } from "../covers/Covers";

declare global {
  interface Window {
    /** Línea de tiempo de la bobina, para que el script de grabación la recorra. */
    __reel?: gsap.core.Timeline;
  }
}

/**
 * Ocupa toda la ventana (16:9) con la bobina indicada en ?reel=… y la deja pausada,
 * o con la portada de ?cover=… (scripts/record-covers.mjs).
 */
export function RecordStage() {
  const [id, setId] = useState<ReelId | null>(null);
  const [cover, setCover] = useState<CoverId | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = q.get("cover") as CoverId | null;
    if (c && coverIds.includes(c)) setCover(c);
    else {
      const r = q.get("reel") as ReelId | null;
      setId(r && r in reelScreens ? r : "gramercy");
    }
    document.documentElement.classList.add("intro-seen", "is-recording");
  }, []);

  if (cover)
    return (
      <div className="cover--stage" data-cover-ready>
        <Cover slug={cover} />
      </div>
    );
  if (!id) return null;
  return <Reel id={id} mode="record" className="reel--stage" onReady={(tl) => (window.__reel = tl)} />;
}
