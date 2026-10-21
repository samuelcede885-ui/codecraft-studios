"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { selectQuoteReference } from "@/lib/quote";
import { ArrowRight } from "../Icon";
import { assetUrl } from "@/lib/assets";

/** Solo un preview a la vez en toda la página. */
let playing: HTMLVideoElement | null = null;

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Proyecto del catálogo, al estilo de un canal de video: miniatura grande con botón de play.
 * Con ratón, al pasar por encima la miniatura se cambia por un preview en bucle (sin sonido)
 * y vuelve a la imagen al salir. En táctil no hay hover: solo miniatura y play.
 */
export function ProjectTile({ project, featured }: { project: Project; featured?: boolean }) {
  const { slug, name } = project;
  const href = `/proyectos/${slug}`;
  const media = useRef<HTMLAnchorElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false); // el <video> solo se crea al primer hover
  const [showing, setShowing] = useState(false);
  const hovering = useRef(false);

  function stop() {
    hovering.current = false;
    const v = video.current;
    setShowing(false);
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    if (playing === v) playing = null;
  }

  function start() {
    if (!canHover()) return;
    hovering.current = true;
    if (!armed) {
      setArmed(true);
      return; // el efecto de abajo arranca el video cuando exista
    }
    const v = video.current;
    if (!v) return;
    if (playing && playing !== v) playing.pause();
    playing = v;
    v.play().catch(() => undefined);
  }

  // Primer hover: el video acaba de montarse.
  useEffect(() => {
    if (armed && hovering.current) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  // Fuera de la vista, ningún preview sigue sonando a imagen.
  useEffect(() => {
    const el = media.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && stop(), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = project.previewVideo.replace(/\.mp4$/, "");

  return (
    <li className={`tile ${featured ? "tile--featured" : ""}`} data-reveal>
      <a
        ref={media}
        href={href}
        className={`tile__media ${showing ? "is-previewing" : ""}`}
        aria-label={`Ver proyecto ${name}`}
        data-cursor="project"
        onPointerEnter={start}
        onPointerLeave={stop}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
        <img className="tile__thumb" src={assetUrl(project.thumbnail)} alt="" width={960} height={540} loading="lazy" decoding="async" />
        {armed && (
          <video
            ref={video}
            className="tile__video"
            muted
            loop
            playsInline
            preload="metadata"
            poster={assetUrl(project.thumbnail)}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => hovering.current && setShowing(true)}
          >
            <source src={assetUrl(`${base}.webm`)} type="video/webm" />
            <source src={assetUrl(`${base}.mp4`)} type="video/mp4" />
          </video>
        )}
        <span className="tile__play" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 6.5v11l9-5.5z" fill="currentColor" />
          </svg>
        </span>
        <span className="tile__status">{project.status}</span>
      </a>
      <div className="tile__meta">
        <h3 className="tile__name">
          <a href={href}>{name}</a>
        </h3>
        <span className="tile__cat">
          {project.category}
          {project.year && ` · ${project.year}`}
        </span>
        <p className="tile__desc">{project.description}</p>
        {featured && (
          <ul className="tile__tags" aria-label="Etiquetas">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="tile__actions">
          <a href={href} className="link-arrow">
            Ver proyecto <ArrowRight className="btn__arrow" />
          </a>
          <a href="#cotizacion" className="tile__quote" onClick={() => selectQuoteReference(slug)}>
            Quiero una página como esta <ArrowRight className="btn__arrow" />
          </a>
        </div>
      </div>
    </li>
  );
}
