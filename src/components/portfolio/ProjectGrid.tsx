"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { ProjectCard } from "./ProjectCard";
import { ProjectPreviewDialog } from "./ProjectPreviewDialog";
import { FILTER_EVENT, ProjectFilters, type ActiveFilter } from "./ProjectFilters";
import { InspirationTrigger } from "../showreel/InspirationTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

type Active = ActiveFilter;

/**
 * Catálogo de proyectos (después del destacado). Los datos viven en data/projects.ts.
 * Los filtros reordenan la rejilla sin recargar: las fichas se desplazan a su nuevo lugar (Flip),
 * las que salen se desvanecen y la altura de la rejilla se ajusta con suavidad.
 */
export function ProjectGrid() {
  const [active, setActive] = useState<Active>("all");
  const [preview, setPreview] = useState<Project | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<{ state: Flip.FlipState; height: number } | null>(null);

  function choose(id: Active, from: "filters" | "categories" = "filters") {
    const g = grid.current;
    if (id === active || !g) return;
    track("project_filter_used", { filter: id, from });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      flip.current = { state: Flip.getState(g.querySelectorAll(".tile")), height: g.offsetHeight };
    setActive(id);
  }

  useLayoutEffect(() => {
    const g = grid.current;
    const f = flip.current;
    flip.current = null;
    if (!g || !f) return;
    gsap.fromTo(g, { height: f.height }, { height: g.offsetHeight, duration: 0.6, ease: "power3.inOut", clearProps: "height" });
    Flip.from(f.state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25, ease: "power1.out" }),
      onComplete: () => {
        // Fichas que llegaron a la vista sin haber hecho su aparición de scroll.
        const unseen = [...g.querySelectorAll<HTMLElement>(".tile:not([hidden])")].filter((t) => getComputedStyle(t).visibility === "hidden");
        if (unseen.length) gsap.to(unseen, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" });
        ScrollTrigger.refresh();
      },
    });
  }, [active]);

  // Las fichas que reaparecen sin animación (movimiento reducido) deben verse.
  useEffect(() => {
    grid.current?.querySelectorAll<HTMLElement>(".tile:not([hidden])").forEach((t) => {
      if (getComputedStyle(t).visibility === "hidden" && t.getBoundingClientRect().top < innerHeight) gsap.set(t, { autoAlpha: 1, y: 0 });
    });
  }, [active]);

  // Este efecto vuelve a suscribirse en cada cambio para que choose() lea el filtro actual.
  useEffect(() => {
    const on = (e: Event) => choose((e as CustomEvent<Active>).detail, "categories");
    window.addEventListener(FILTER_EVENT, on);
    return () => window.removeEventListener(FILTER_EVENT, on);
  });

  const visible = projects.filter((p) => active === "all" || p.filters.includes(active));

  return (
    <section id="catalogo" className="section catalog" aria-labelledby="catalogo-title">
      <div className="container">
        <header className="section-head catalog__head" data-reveal>
          <div>
            <span className="eyebrow">Portafolio</span>
            <h2 id="catalogo-title" className="section-title">
              Explora lo que
              <br />
              hemos construido.
            </h2>
          </div>
          <div className="catalog__aside">
            <p className="catalog__lead">
              Encuentra una página, aplicación o experiencia que se parezca a lo que imaginas para tu marca.
            </p>
            <InspirationTrigger className="catalog__inspire" />
          </div>
        </header>

        <ProjectFilters active={active} onChoose={(id) => choose(id)} />
        <p className="sr-only" aria-live="polite">
          {visible.length === 1 ? "1 proyecto" : `${visible.length} proyectos`}
        </p>

        <ul className="catalog__grid" ref={grid}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i + 1}
              hidden={!visible.includes(p)}
              shifted={visible.indexOf(p) % 2 === 1}
              onPlay={setPreview}
            />
          ))}
        </ul>
        {projects.some((p) => p.projectType === "concept") && (
          <p className="catalog__note" data-reveal>
            Los proyectos marcados como Concepto son conceptos de diseño de Fary Labs. No son trabajos de clientes.
          </p>
        )}
      </div>
      <ProjectPreviewDialog project={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
