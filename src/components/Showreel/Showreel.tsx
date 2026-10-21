"use client";

import { useEffect, useRef, useState } from "react";
import { getProject, typeLabel } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { ArrowRight } from "../Icon";

/**
 * "Inspírame": showreel a pantalla completa (~17 s) que recorre los proyectos con clips cortos
 * de sus previews y frases grandes entre medio, y termina con una llamada a empezar.
 * - Los videos solo existen mientras está abierto, y cada uno se carga justo antes de su turno.
 * - El ritmo lo marcan temporizadores por paso: si un video falla, se ve su portada y el
 *   showreel sigue igual.
 * - Esc, la X o "Cerrar" lo cierran.
 */
type Step = { kind: "clip"; slug: string; from: number; dur: number } | { kind: "phrase"; text: string; dur: number } | { kind: "end" };

const steps: Step[] = [
  { kind: "clip", slug: "gramercy", from: 1, dur: 3 },
  { kind: "phrase", text: "Diseñamos.", dur: 1.4 },
  { kind: "clip", slug: "panel-de-metricas", from: 1.5, dur: 3 },
  { kind: "phrase", text: "Construimos.", dur: 1.4 },
  { kind: "clip", slug: "asistente-de-reservas", from: 2, dur: 3 },
  { kind: "phrase", text: "Automatizamos.", dur: 1.4 },
  { kind: "clip", slug: "norte-estudio", from: 1, dur: 2.6 },
  { kind: "phrase", text: "Hacemos que funcione.", dur: 1.8 },
  { kind: "end" },
];
const clips = steps.flatMap((s, i) => (s.kind === "clip" ? [{ ...s, index: i }] : []));
const timed = steps.filter((s) => s.kind !== "end") as Exclude<Step, { kind: "end" }>[];

export const SHOWREEL_EVENT = "fary:showreel";

export function Showreel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const videos = useRef<Record<string, HTMLVideoElement | null>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0); // cambia al repetir, para reiniciar las barras

  // Se abre desde cualquier botón con el evento.
  useEffect(() => {
    const on = () => {
      setStep(0);
      setRun((r) => r + 1);
      setOpen(true);
    };
    window.addEventListener(SHOWREEL_EVENT, on);
    return () => window.removeEventListener(SHOWREEL_EVENT, on);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      window.dispatchEvent(new CustomEvent("fary:scroll-lock", { detail: true }));
    }
    if (!open && d.open) d.close();
  }, [open]);

  // Cada paso: arranca su clip (desde su segundo), deja listo el siguiente y programa el avance.
  useEffect(() => {
    if (!open) return;
    const s = steps[step];
    Object.values(videos.current).forEach((v) => v && !v.paused && v.pause());
    if (s.kind === "clip") {
      const v = videos.current[s.slug];
      if (v) {
        const seek = () => {
          v.currentTime = s.from;
          v.play().catch(() => undefined);
        };
        if (v.readyState >= 1) seek();
        else {
          v.preload = "auto";
          v.addEventListener("loadedmetadata", seek, { once: true });
          v.load();
        }
      }
    }
    const next = clips.find((c) => c.index > step);
    const nv = next && videos.current[next.slug];
    if (nv && nv.readyState === 0 && nv.preload !== "auto") {
      nv.preload = "auto";
      nv.load();
    }
    if (s.kind === "end") return;
    const t = window.setTimeout(() => setStep((i) => i + 1), s.dur * 1000);
    return () => window.clearTimeout(t);
  }, [open, step, run]);

  function onClose() {
    Object.values(videos.current).forEach((v) => v?.pause());
    window.dispatchEvent(new CustomEvent("fary:scroll-lock", { detail: false }));
    setOpen(false);
  }

  const current = steps[step];

  return (
    <dialog ref={dialog} className="sr" aria-label="Showreel de Fary Labs" onClose={onClose}>
      {open && (
        <>
          <div className="sr__progress" aria-hidden="true">
            {timed.map((s, i) => (
              <span key={`${run}-${i}`} className={i < step ? "is-done" : i === step ? "is-now" : ""}>
                <i style={i === step ? { animationDuration: `${s.dur}s` } : undefined} />
              </span>
            ))}
          </div>

          {clips.map((c) => {
            const p = getProject(c.slug);
            if (!p) return null;
            const base = p.previewVideo.replace(/\.mp4$/, "");
            const active = current.kind === "clip" && current.slug === c.slug;
            return (
              <figure key={c.slug} className="sr__clip" data-active={active || undefined}>
                {/* Portada debajo: se ve mientras el clip carga o si falla. */}
                {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
                <img className="sr__cover" src={assetUrl(p.thumbnail)} alt="" width={1600} height={900} decoding="async" />
                <video
                  onPlaying={(e) => e.currentTarget.classList.add("is-ready")}
                  ref={(el) => {
                    videos.current[c.slug] = el;
                  }}
                  muted
                  playsInline
                  preload={c.index === 0 ? "auto" : "none"}
                  poster={assetUrl(p.thumbnail)}
                  disablePictureInPicture
                  aria-hidden="true"
                >
                  <source src={assetUrl(`${base}.webm`)} type="video/webm" />
                  <source src={assetUrl(`${base}.mp4`)} type="video/mp4" />
                </video>
                <figcaption className="sr__caption">
                  <b>{p.name}</b> {p.category} · {typeLabel(p)}
                </figcaption>
              </figure>
            );
          })}

          {steps.map((s, i) =>
            s.kind === "phrase" ? (
              <p key={s.text} className="sr__phrase" data-active={i === step || undefined}>
                {s.text}
              </p>
            ) : null,
          )}

          <div className="sr__end" data-active={current.kind === "end" || undefined}>
            <p className="sr__end-title">¿Qué construimos contigo?</p>
            <div className="sr__end-actions">
              <a
                href="#contacto"
                className="btn btn--light"
                onClick={(e) => {
                  e.preventDefault();
                  dialog.current?.close();
                  requestAnimationFrame(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }));
                }}
              >
                Comenzar proyecto <ArrowRight className="btn__arrow" />
              </a>
              <button
                type="button"
                className="sr__again"
                onClick={() => {
                  setStep(0);
                  setRun((r) => r + 1);
                }}
              >
                Ver de nuevo
              </button>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {current.kind === "phrase" ? current.text : current.kind === "end" ? "¿Qué construimos contigo?" : ""}
          </p>

          <button type="button" className="sr__close" aria-label="Cerrar showreel" onClick={() => dialog.current?.close()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
    </dialog>
  );
}
