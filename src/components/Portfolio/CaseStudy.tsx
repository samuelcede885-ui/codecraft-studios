"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { lockScroll } from "@/lib/scroll";
import { Screen } from "../screens/Screens";
import { ArrowRight } from "../Icon";

/**
 * Caso de estudio editorial a pantalla completa (diálogo nativo: foco atrapado y Escape).
 * Hero visual, ficha (cliente, servicio, industria, año) y Problema / Solución / Resultado.
 */
export function CaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d || !project) return;
    d.showModal();
    d.scrollTop = 0;
    lockScroll(true);
    return () => {
      lockScroll(false);
      if (d.open) d.close();
    };
  }, [project]);

  function startProject(e: React.MouseEvent) {
    e.preventDefault();
    onClose();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.querySelector("#contacto")?.scrollIntoView({ behavior: "auto" })),
    );
  }

  const p = project;
  const facts = p
    ? [
        ["Cliente", p.facts.client],
        ["Servicio", p.facts.service],
        ["Industria", p.facts.industry],
        ...(p.facts.year ? [["Año", p.facts.year]] : []),
      ]
    : [];

  return (
    <dialog
      ref={dialog}
      className="case"
      aria-labelledby="case-title"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      data-lenis-prevent
    >
      {p && (
        <article className="case__inner" key={p.id}>
          <div className="case__bar">
            <span>Caso de estudio · Concepto</span>
            <button type="button" className="case__close" onClick={onClose} aria-label="Cerrar caso de estudio">
              Cerrar <span aria-hidden="true">✕</span>
            </button>
          </div>

          <header className="case__hero container">
            <span className="eyebrow">{p.category}</span>
            <h2 id="case-title" className="case__title">
              {p.name}
            </h2>
            <p className="case__lead">{p.line}</p>
          </header>

          <div className="case__visual container">
            <div className="screen-frame case__frame" aria-hidden="true">
              <Screen id={p.screen} />
            </div>
          </div>

          <dl className="case__facts container">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="case__sections container">
            {p.sections.map((s, i) => (
              <section key={s.title} className="case__section">
                <div className="case__text">
                  <span className="case__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                {s.screen && (
                  <div className="screen-frame case__frame" aria-hidden="true">
                    <Screen id={s.screen} />
                  </div>
                )}
              </section>
            ))}
          </div>

          <footer className="case__foot container">
            <p>¿Quieres algo así para tu negocio?</p>
            <a href="#contacto" className="btn btn--dark" onClick={startProject}>
              Comenzar proyecto <ArrowRight className="btn__arrow" />
            </a>
          </footer>
        </article>
      )}
    </dialog>
  );
}
