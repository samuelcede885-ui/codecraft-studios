"use client";

import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/assets";

/**
 * Video de un capítulo del case study: reproducción automática, sin sonido, en bucle y sin controles.
 * Solo corre a la vista. Con movimiento reducido no arranca solo: se muestran los controles.
 * `src` es la ruta sin extensión (hay .webm y .mp4).
 */
export function ProjectVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) v.controls = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={video}
      className="pj-video"
      muted
      loop
      playsInline
      preload="metadata"
      poster={assetUrl(poster)}
      disablePictureInPicture
      aria-label={label}
    >
      <source src={assetUrl(`${src}.webm`)} type="video/webm" />
      <source src={assetUrl(`${src}.mp4`)} type="video/mp4" />
    </video>
  );
}
