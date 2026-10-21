"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { selectQuoteReference } from "@/lib/quote";
import { assetUrl } from "@/lib/assets";
import { ArrowRight } from "../Icon";

/**
 * Preview en grande al tocar play (en táctil es la forma de verlo, sin hover ni autoplay en la rejilla).
 * Un único video, que solo se carga al abrir. Se cierra con Esc, con la X o tocando fuera.
 */
export function PreviewDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (project && !d.open) {
      d.showModal();
      window.dispatchEvent(new CustomEvent("fary:scroll-lock", { detail: true }));
    } else if (!project && d.open) d.close();
  }, [project]);

  function close() {
    window.dispatchEvent(new CustomEvent("fary:scroll-lock", { detail: false }));
    onClose();
  }

  const base = project?.previewVideo.replace(/\.mp4$/, "");

  return (
    <dialog
      ref={dialog}
      className="pv"
      aria-label={project ? `Preview de ${project.name}` : undefined}
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
      {project && (
        <div className="pv__inner">
          <div className="pv__media">
            <video
              key={project.slug}
              className="pv__video"
              autoPlay
              muted
              loop
              playsInline
              poster={assetUrl(project.thumbnail)}
              disablePictureInPicture
              aria-label={`Preview de ${project.name}`}
            >
              <source src={assetUrl(`${base}.webm`)} type="video/webm" />
              <source src={assetUrl(`${base}.mp4`)} type="video/mp4" />
            </video>
            <span className="pv__tag" aria-hidden="true">
              PREVIEW
            </span>
          </div>
          <div className="pv__bar">
            <div>
              <span className="pv__cat">{project.category}</span>
              <p className="pv__name">{project.name}</p>
            </div>
            <div className="pv__actions">
              <a href={`/proyectos/${project.slug}`} className="btn btn--light btn--sm">
                Ver proyecto <ArrowRight className="btn__arrow" />
              </a>
              <a
                href="#cotizacion"
                className="btn btn--sm pv__quote"
                onClick={(e) => {
                  e.preventDefault();
                  selectQuoteReference(project.slug);
                  dialog.current?.close();
                  // Con el fondo ya liberado, ir al formulario.
                  requestAnimationFrame(() => document.getElementById("cotizacion")?.scrollIntoView({ behavior: "smooth" }));
                }}
              >
                Quiero una página como esta <ArrowRight className="btn__arrow" />
              </a>
            </div>
          </div>
          <button type="button" className="pv__close" aria-label="Cerrar preview" onClick={() => dialog.current?.close()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}
