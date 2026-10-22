"use client";

import { forwardRef, useRef } from "react";
import { videoBase, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { assetUrl } from "@/lib/assets";

type Props = {
  project: Project;
  /** Dónde se reproduce, para la medición. */
  context: "hover" | "dialog";
  className?: string;
  autoPlay?: boolean;
  preload?: "none" | "metadata" | "auto";
  /** Póster: por defecto, la portada del catálogo. */
  poster?: string;
  onPlaying?: () => void;
};

/**
 * Preview corto de un proyecto: sin sonido, en bucle, sin controles, WebM con respaldo MP4.
 * Mide project_preview_started al empezar y project_preview_completed al completar una vuelta;
 * volver al inicio (currentTime = 0) abre una nueva sesión de medición.
 */
export const ProjectPreviewVideo = forwardRef<HTMLVideoElement, Props>(function ProjectPreviewVideo(
  { project, context, className, autoPlay, preload = "metadata", poster, onPlaying },
  ref,
) {
  const started = useRef(false);
  const done = useRef(false);
  const last = useRef(0);
  if (!project.previewVideo) return null;
  const base = videoBase(project.previewVideo);
  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      autoPlay={autoPlay}
      preload={preload}
      poster={assetUrl(poster ?? project.thumbnail)}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden={context === "hover" ? true : undefined}
      aria-label={context === "dialog" ? `Preview de ${project.name}` : undefined}
      tabIndex={-1}
      onPlaying={() => {
        if (!started.current) {
          started.current = true;
          track("project_preview_started", { project: project.slug, context });
        }
        onPlaying?.();
      }}
      onTimeUpdate={(e) => {
        const t = e.currentTarget.currentTime;
        // En bucle no hay "ended": una vuelta completa es cuando el tiempo retrocede.
        if (started.current && !done.current && t + 0.5 < last.current) {
          done.current = true;
          track("project_preview_completed", { project: project.slug, context });
        }
        last.current = t;
      }}
      onSeeked={(e) => {
        if (e.currentTarget.currentTime === 0) {
          started.current = false;
          done.current = false;
          last.current = 0;
        }
      }}
    >
      <source src={assetUrl(`${base}.webm`)} type="video/webm" />
      <source src={assetUrl(`${base}.mp4`)} type="video/mp4" />
    </video>
  );
});
