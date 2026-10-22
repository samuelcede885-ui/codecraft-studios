"use client";

import { useEffect, useRef } from "react";
import { typeLabel, type Project } from "@/data/projects";
import { selectQuoteReference } from "@/lib/quote";
import { trackAttrs } from "@/lib/analytics";
import { ArrowRight } from "../Icon";
import { ProjectPreviewVideo } from "./ProjectPreviewVideo";

/**
 * Preview en grande al tocar play (en táctil es la forma de verlo, sin hover ni autoplay en la rejilla).
 * Un único video, que solo se carga al abrir. Se cierra con Esc, con la X o tocando fuera.
 */
export function ProjectPreviewDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
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
            <ProjectPreviewVideo key={project.slug} project={project} context="dialog" className="pv__video" autoPlay preload="auto" />
            <span className="pv__tag" aria-hidden="true">
              PREVIEW
            </span>
          </div>
          <div className="pv__bar">
            <div>
              <span className="pv__cat">
                {project.category} · {typeLabel(project)}
              </span>
              <p className="pv__name">{project.name}</p>
            </div>
            <div className="pv__actions">
              <a
                href={`/proyectos/${project.slug}`}
                className="btn btn--light btn--sm"
                {...trackAttrs("project_opened", { project: project.slug, from: "preview" })}
              >
                Ver proyecto <ArrowRight className="btn__arrow" />
              </a>
              <a
                href="#cotizacion"
                className="btn btn--sm pv__quote"
                onClick={(e) => {
                  e.preventDefault();
                  selectQuoteReference(project.slug, "preview");
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
