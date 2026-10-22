import { CONCEPT_NOTE, coverOf, quoteHref, typeLabel, type Project } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { trackAttrs } from "@/lib/analytics";
import { ArrowRight } from "../Icon";
import { withBase } from "@/lib/paths";

/** Hero del case study: nombre, categoría, descripción, CTA y la portada de campaña a lo ancho. */
export function CaseStudyHero({ project: p }: { project: Project }) {
  return (
    <section className="pj-hero" aria-labelledby="pj-title">
      <div className="container">
        <a href={withBase("/#catalogo")} className="pj-back link-arrow">
          <ArrowRight className="btn__arrow pj-back__icon" /> Volver al portafolio
        </a>
        <div className="pj-hero__head">
          <div>
            <span className="pj-hero__cat">
              {p.category} · {typeLabel(p)}
              {p.year && ` · ${p.year}`}
            </span>
            <h1 id="pj-title" className="pj-hero__title">
              {p.name}
            </h1>
            <p className="pj-hero__lead">{p.description}</p>
            {p.projectType === "concept" && <p className="pj-concept">{CONCEPT_NOTE}</p>}
          </div>
          <div className="pj-hero__actions">
            <a href={quoteHref(p.slug)} className="btn btn--dark" {...trackAttrs("project_quote_clicked", { project: p.slug, from: "case_study" })}>
              Quiero una página como esta <ArrowRight className="btn__arrow" />
            </a>
            {p.publicUrl && (
              <a href={p.publicUrl} className="link-arrow" target="_blank" rel="noopener noreferrer">
                Ver sitio publicado <ArrowRight className="btn__arrow" />
              </a>
            )}
          </div>
        </div>
      </div>
      <figure className="pj-hero__media" data-media>
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
        <img src={assetUrl(coverOf(p))} alt={`Portada de ${p.name}`} width={1600} height={900} decoding="async" fetchPriority="high" />
      </figure>
    </section>
  );
}
