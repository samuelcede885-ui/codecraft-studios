"use client";

import { projects, type FilterId } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { FILTER_EVENT } from "./ProjectFilters";
import { ArrowRight } from "../Icon";

const options: { title: string; kind: string; filter: FilterId }[] = [
  { title: "Una marca que venda", kind: "E-commerce", filter: "ecommerce" },
  { title: "Una empresa que se vea más grande", kind: "Web corporativa", filter: "web" },
  { title: "Una idea que funcione", kind: "Aplicación", filter: "apps" },
  { title: "Un negocio que trabaje automáticamente", kind: "Agentes IA", filter: "ia" },
];

/**
 * Navegación por intención, después del catálogo: cuatro renglones grandes, como un índice editorial.
 * Cada uno filtra el portafolio y vuelve a él. Con ratón asoma la portada de un proyecto relacionado.
 */
export function ProjectCategories() {
  return (
    <section className="section build" aria-labelledby="build-title">
      <div className="container">
        <header className="build__head" data-reveal>
          <span className="eyebrow">Por dónde empezar</span>
          <h2 id="build-title" className="section-title">
            ¿Qué quieres construir?
          </h2>
        </header>
        <ol className="build__list">
          {options.map((o, i) => {
            const related = projects.filter((p) => p.filters.includes(o.filter));
            // Portada que asoma: el proyecto cuyo tipo principal es este.
            const peek = related.find((p) => p.filters[0] === o.filter) ?? related[0];
            return (
              <li key={o.filter} data-reveal>
                <a
                  href="#catalogo"
                  className="build__row"
                  data-cursor="ver"
                  onClick={() => window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: o.filter }))}
                >
                  <span className="build__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="build__title">{o.title}</span>
                  <span className="build__kind">
                    {o.kind}
                    <small>{related.length === 1 ? "1 proyecto" : `${related.length} proyectos`}</small>
                  </span>
                  <span className="build__go" aria-hidden="true">
                    <ArrowRight className="btn__arrow" />
                  </span>
                  {peek && (
                    // eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes
                    <img className="build__peek" src={assetUrl(peek.thumbnail)} alt="" width={1600} height={900} loading="lazy" decoding="async" />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
