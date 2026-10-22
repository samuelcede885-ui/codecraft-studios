/* eslint-disable @next/next/no-img-element -- se capturan a imagen; no pasan por el optimizador */
import type { ReactNode } from "react";
import { getProject } from "@/data/projects";
import type { ScreenId } from "@/data/screens";
import { Screen } from "../screens/Screens";

/**
 * Portadas del catálogo. Cada concepto tiene su propia composición (color, tipografía y ritmo de su
 * marca) con su mensaje y la pantalla real del producto. Se diseñan aquí en HTML y
 * scripts/record-covers.mjs las captura a public/projects/<slug>/thumb.webp.
 * Todo se mide en cqw (1cqw = 1 % del ancho), así que la portada se ve igual a cualquier tamaño.
 */
export type CoverId = "g-talent" | "gaba" | "gramercy" | "panel-de-metricas" | "asistente-de-reservas" | "norte-estudio";
export const coverIds: CoverId[] = ["g-talent", "gaba", "gramercy", "panel-de-metricas", "asistente-de-reservas", "norte-estudio"];

/** Ventana con la pantalla HTML de un concepto o, en trabajos reales, una captura del sitio. */
function Device({ id, shot, className = "" }: { id?: ScreenId; shot?: string; className?: string }) {
  return (
    <div className={`cv-device ${className}`}>
      <div className="cv-device__bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="cv-device__screen">
        {shot ? <img className="cv-device__shot" src={shot} alt="" /> : id && <Screen id={id} />}
      </div>
    </div>
  );
}

function Headline({ text = "", className }: { text?: string; className: string }) {
  return (
    <p className={className}>
      {text.split("\n").map((line) => (
        <span key={line}>{line}</span>
      ))}
    </p>
  );
}

function Frame({ slug, className, children }: { slug: CoverId; className: string; children: ReactNode }) {
  const p = getProject(slug)!;
  return (
    <div className={`cover ${className}`}>
      <div className="cv-meta">
        <span className="cv-meta__name">{p.name}</span>
        <span className="cv-meta__cat">{p.category}</span>
      </div>
      {children}
    </div>
  );
}

export function Cover({ slug }: { slug: CoverId }) {
  const p = getProject(slug)!;
  switch (slug) {
    case "g-talent":
      return (
        <Frame slug={slug} className="cv-gt">
          <img className="cv-gt__logo" src="/projects/g-talent-wordmark.webp" alt="" />
          <Headline text={p.headline} className="cv-gt__msg" />
          <Device shot="/projects/g-talent/gallery-1.webp" className="cv-gt__device" />
          <img className="cv-gt__iso" src="/projects/g-talent-isotipo.webp" alt="" />
        </Frame>
      );
    case "gaba":
      return (
        <Frame slug={slug} className="cv-gaba">
          <Headline text={p.headline} className="cv-gaba__msg" />
          <Device shot="/projects/gaba/gallery-1.webp" className="cv-gaba__device" />
          <span className="cv-gaba__star" aria-hidden="true" />
        </Frame>
      );
    case "gramercy":
      return (
        <Frame slug={slug} className="cv-gm">
          <img className="cv-gm__logo" src="/projects/gramercy-logo.webp" alt="" />
          <Headline text={p.headline} className="cv-gm__msg" />
          <Device id="cart" className="cv-gm__device" />
          <img className="cv-gm__shoe" src="/projects/gramercy-shoe-clean.webp" alt="" />
        </Frame>
      );
    case "panel-de-metricas":
      return (
        <Frame slug={slug} className="cv-dash">
          <Headline text={p.headline} className="cv-dash__msg" />
          <Device id="dashboard" className="cv-dash__device" />
        </Frame>
      );
    case "asistente-de-reservas":
      return (
        <Frame slug={slug} className="cv-agent">
          <Headline text={p.headline} className="cv-agent__msg" />
          <Device id="agent" className="cv-agent__device" />
          <div className="cv-agent__bubbles" aria-hidden="true">
            <span className="cv-bubble cv-bubble--out">¿Tienen disponibilidad el sábado?</span>
            <span className="cv-bubble cv-bubble--in">
              <b>✓</b> Reserva confirmada · Sábado 12:30
            </span>
          </div>
        </Frame>
      );
    case "norte-estudio":
      return (
        <Frame slug={slug} className="cv-norte">
          <div className="cv-norte__blocks" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <Headline text={p.headline} className="cv-norte__msg" />
          <Device id="studio" className="cv-norte__device" />
        </Frame>
      );
  }
}
