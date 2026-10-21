"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { assetUrl } from "@/lib/assets";

/**
 * Recorrido del proyecto en grande: reproducción automática, sin sonido, en bucle y sin controles.
 * Se pausa fuera de la vista. Con movimiento reducido no arranca solo: el visitante decide.
 */
export function ProjectVideo({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);
  const base = project.fullVideo.replace(/\.mp4$/, "");
  const poster = project.fullVideo.includes("/full.") ? project.thumbnail.replace("thumb.webp", "poster.webp") : project.thumbnail;

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) v.controls = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) v.play().catch(() => undefined);
      else v.pause();
    }, { threshold: 0.2 });
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
      aria-label={`Recorrido por ${project.name}`}
    >
      <source src={assetUrl(`${base}.webm`)} type="video/webm" />
      <source src={assetUrl(`${base}.mp4`)} type="video/mp4" />
    </video>
  );
}
