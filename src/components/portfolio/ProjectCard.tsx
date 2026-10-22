"use client";

import { useEffect, useRef, useState } from "react";
import { typeLabel, type Project } from "@/data/projects";
import { selectQuoteReference } from "@/lib/quote";
import { trackAttrs } from "@/lib/analytics";
import { ArrowRight } from "../Icon";
import { assetUrl } from "@/lib/assets";
import { ProjectPreviewVideo } from "./ProjectPreviewVideo";

/** Solo un preview a la vez en toda la página. */
let playing: HTMLVideoElement | null = null;

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const clock = (s: number) => {
  const t = Math.max(0, Math.ceil(s));
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

type Props = {
  project: Project;
  index: number;
  /** Fuera del filtro activo: se oculta (el catálogo anima la salida). */
  hidden: boolean;
  /** Segunda columna de la rejilla editorial: va desplazada hacia abajo. */
  shifted: boolean;
  /** Botón de play: abre el preview en grande (en táctil es la única forma de verlo). */
  onPlay: (p: Project) => void;
};

/**
 * Proyecto del catálogo, al estilo de un canal de video: portada diseñada con botón de play.
 * Con ratón, al pasar por encima la portada se cambia por un preview real en bucle (sin sonido),
 * con una etiqueta PREVIEW y el tiempo restante, y vuelve a la portada al salir.
 * En táctil no hay hover ni videos automáticos: portada, play (abre el preview), nombre y categoría.
 */
export function ProjectCard({ project, index, hidden, shifted, onPlay }: Props) {
  const { slug, name } = project;
  const href = `/proyectos/${slug}`;
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false); // el <video> se crea al primer hover
  const [showing, setShowing] = useState(false);
  const hovering = useRef(false);
  const time = useRef<HTMLTimeElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  // Mientras suena el preview: tiempo restante y línea de progreso, leídos del propio video.
  function tick() {
    const v = video.current;
    if (v && v.duration) {
      if (time.current) time.current.textContent = clock(v.duration - v.currentTime);
      if (bar.current) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    }
    raf.current = requestAnimationFrame(tick);
  }

  function stop() {
    hovering.current = false;
    const v = video.current;
    setShowing(false);
    cancelAnimationFrame(raf.current);
    if (bar.current) bar.current.style.transform = "scaleX(0)";
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    if (playing === v) playing = null;
  }

  const hasPreview = !!project.previewVideo;

  function start() {
    if (!hasPreview) return;
    // Con movimiento reducido no hay previews automáticos: el botón play sigue disponible.
    if (!canHover() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

  // Al salir del filtro, el preview se detiene.
  useEffect(() => {
    if (hidden) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  // El <video> se crea solo al primer hover (los previews pesan ~100 KB y arrancan enseguida):
  // al cargar o recorrer la página no se descarga ninguno. Fuera de la vista, ninguno sigue en marcha.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && stop(), { threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className="tile" data-reveal data-flip-id={slug} hidden={hidden} data-shift={shifted || undefined}>
      <div
        ref={frame}
        className={`tile__media ${showing ? "is-previewing" : ""}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && start()}
        onPointerLeave={(e) => e.pointerType === "mouse" && stop()}
      >
        <a href={href} className="tile__link" aria-label={`Ver proyecto ${name}`} data-cursor="ver" tabIndex={-1} {...trackAttrs("project_opened", { project: slug, from: "card" })}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img className="tile__thumb" src={assetUrl(project.thumbnail)} alt="" width={1600} height={900} loading="lazy" decoding="async" />
          {armed && (
            <ProjectPreviewVideo
              ref={video}
              project={project}
              context="hover"
              className="tile__video"
              onPlaying={() => {
                if (!hovering.current) return;
                setShowing(true);
                cancelAnimationFrame(raf.current);
                tick();
              }}
            />
          )}
        </a>
        {hasPreview && (
          <button type="button" className="tile__play" data-cursor="play" aria-label={`Ver preview de ${name}`} onClick={() => onPlay(project)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6.5v11l9-5.5z" fill="currentColor" />
            </svg>
          </button>
        )}
        <span className="tile__status">{typeLabel(project)}</span>
        <span className="tile__live" aria-hidden="true">
          PREVIEW <time ref={time}>00:00</time>
        </span>
        <span className="tile__progress" ref={bar} aria-hidden="true" />
      </div>
      <div className="tile__meta">
        <div className="tile__top">
          <span className="tile__index">{String(index).padStart(2, "0")}</span>
          <span className="tile__cat">
            {project.category}
            {project.year && ` · ${project.year}`}
          </span>
        </div>
        <h3 className="tile__name">
          <a href={href} {...trackAttrs("project_opened", { project: slug, from: "card" })}>
            {name}
          </a>
        </h3>
        <p className="tile__desc">{project.description}</p>
        <div className="tile__actions">
          <a href={href} className="link-arrow" {...trackAttrs("project_opened", { project: slug, from: "card" })}>
            Ver proyecto <ArrowRight className="btn__arrow" />
          </a>
          <a href="#cotizacion" className="tile__quote" onClick={() => selectQuoteReference(slug, "card")}>
            Quiero una página como esta <ArrowRight className="btn__arrow" />
          </a>
        </div>
      </div>
    </li>
  );
}
