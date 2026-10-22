"use client";

import { useEffect, useRef, useState } from "react";
import { CONCEPT_NOTE, coverOf, fullVideoOf, posterOf, projects, typeLabel, videoBase, type Project } from "@/data/projects";
import { track, trackAttrs } from "@/lib/analytics";
import { selectQuoteReference } from "@/lib/quote";
import { assetUrl } from "@/lib/assets";
import { ArrowRight } from "../Icon";

/**
 * Proyecto destacado, antes del catálogo: una pieza de campaña a sangre, no una tarjeta.
 * El recorrido completo se reproduce solo (sin sonido) cuando al menos la mitad está a la vista
 * y se pausa al salir; con movimiento reducido arranca pausado y lo controla el botón.
 * Sin video, la portada de campaña ocupa el mismo lugar.
 */
export function FeaturedProject() {
  const project: Project = projects.find((p) => p.featured) ?? projects[0];
  const href = `/proyectos/${project.slug}`;
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const src = fullVideoOf(project);
  const [paused, setPaused] = useState(false); // pausa elegida por la persona
  const pausedRef = useRef(false);
  const visible = useRef(false);

  // Medición: el destacado cuenta como visto con la mitad en pantalla (una vez).
  useEffect(() => {
    const el = media.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.5) return;
        track("featured_project_view", { project: project.slug });
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.slug]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pausedRef.current = true;
      setPaused(true);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.5;
        if (visible.current && !pausedRef.current) v.play().catch(() => undefined);
        else if (!e.isIntersecting || e.intersectionRatio < 0.2) v.pause();
      },
      { threshold: [0, 0.2, 0.5] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = video.current;
    if (!v) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) v.pause();
    else if (visible.current) v.play().catch(() => undefined);
  }


  return (
    <section id="portafolio" className="featured" aria-labelledby="destacado-title">
      <div className="featured__head container" data-reveal>
        <span className="eyebrow featured__eyebrow">Proyecto destacado</span>
        <span className="featured__status">{typeLabel(project)}</span>
      </div>
      <h2 id="destacado-title" className="featured__title container" data-reveal>
        {project.name}
      </h2>

      <div className="featured__media" ref={media}>
        {src ? (
          <>
            <video
              ref={video}
              className="featured__video"
              muted
              loop
              playsInline
              preload="metadata"
              poster={assetUrl(posterOf(project))}
              disablePictureInPicture
              disableRemotePlayback
              aria-label={`Recorrido por ${project.name}: ${project.description}`}
            >
              <source src={assetUrl(`${videoBase(src)}.webm`)} type="video/webm" />
              <source src={assetUrl(`${videoBase(src)}.mp4`)} type="video/mp4" />
            </video>
            <button
              type="button"
              className="featured__toggle"
              onClick={toggle}
              aria-label={paused ? "Reproducir recorrido" : "Pausar recorrido"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {paused ? <path d="M9 6.5v11l9-5.5z" fill="currentColor" /> : <path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor" />}
              </svg>
            </button>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes
          <img className="featured__video" src={assetUrl(coverOf(project))} alt={`Portada de ${project.name}`} width={1600} height={900} loading="lazy" decoding="async" />
        )}
      </div>

      <div className="featured__info container" data-reveal>
        <span className="featured__cat">{project.category}</span>
        <p className="featured__desc">{project.description}</p>
        <div className="featured__actions">
          <a href={href} className="btn btn--dark" {...trackAttrs("project_opened", { project: project.slug, from: "featured" })}>
            Explorar proyecto <ArrowRight className="btn__arrow" />
          </a>
          <a href="#cotizacion" className="btn btn--outline" onClick={() => selectQuoteReference(project.slug, "featured")}>
            Quiero algo así <ArrowRight className="btn__arrow" />
          </a>
        </div>
        {project.projectType === "concept" && <p className="featured__note">{CONCEPT_NOTE}</p>}
      </div>
    </section>
  );
}
