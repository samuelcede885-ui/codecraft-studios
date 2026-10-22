import { CONCEPT_NOTE, chapterLabels, projects, quoteHref, type Project } from "@/data/projects";
import { trackAttrs } from "@/lib/analytics";
import { ArrowRight } from "../Icon";
import { Logo } from "../Logo";
import { Channels } from "../Channels";
import { TrackView } from "../analytics/TrackView";
import { BeforeAfterComparison } from "./BeforeAfterComparison";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudySection } from "./CaseStudySection";
import { ProjectGallery } from "./ProjectGallery";

/**
 * Case study como relato visual: hero con la portada, el reto en pocas líneas, capítulos
 * (experiencia, producto, conversión, sistema) donde la imagen manda, y lo que permite la solución.
 * Cada bloque sin datos (reto, solución, antes/después, capítulos, resultado, créditos) no se muestra.
 */
export function CaseStudy({ project: p }: { project: Project }) {
  const others = projects.filter((x) => x.slug !== p.slug);
  const chapters = p.chapters ?? [];
  // Sin capítulos, la galería del proyecto hace de capítulo visual.
  const gallery = !chapters.length && p.gallery?.length ? p.gallery : [];
  return (
    <>
      <TrackView event="project_opened" props={{ project: p.slug, type: p.projectType }} />
      <CaseStudyHero project={p} />

      {(p.challenge?.length || p.solution) && (
        <section className="pj-challenge" aria-labelledby="pj-challenge-title">
          <div className="container pj-split">
            <div data-reveal>
              <span className="pj-label">El reto</span>
              <h2 id="pj-challenge-title" className="sr-only">
                El reto
              </h2>
            </div>
            <div className="pj-challenge__text" data-reveal>
              {p.challenge?.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {p.solution && (
                <div className="pj-solution">
                  <span className="pj-label">La solución</span>
                  <p>{p.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {p.beforeAfter && (
        <section className="pj-chapter pj-ba" aria-label="Antes y después">
          <div className="container">
            <BeforeAfterComparison {...p.beforeAfter} />
          </div>
        </section>
      )}

      {chapters.map((c, i) => (
        <CaseStudySection
          key={c.key}
          id={c.key}
          number={i + 1}
          label={chapterLabels[c.key]}
          title={c.title}
          text={c.text}
          className={`pj-chapter--${c.key}`}
        >
          <ProjectGallery visuals={c.visuals} />
        </CaseStudySection>
      ))}

      {gallery.length > 0 && (
        <CaseStudySection id="galeria" label="Galería" title={p.name}>
          <ProjectGallery visuals={gallery.map((g) => ({ kind: "image" as const, ...g }))} />
        </CaseStudySection>
      )}

      {(p.result?.length || p.services?.length || p.technologies?.length || p.industry) && (
        <section className="pj-result" aria-labelledby="pj-result-title">
          <div className="container pj-split">
            <div data-reveal>
              <span className="pj-label">Resultado</span>
            </div>
            <div data-reveal>
              <h2 id="pj-result-title" className={p.result?.length ? "pj-result__text" : "sr-only"}>
                {p.result?.length ? p.result.join(" ") : `Sobre ${p.name}`}
              </h2>
              <dl className="pj-credits">
                {p.industry && (
                  <div>
                    <dt>Industria</dt>
                    <dd>{p.industry}</dd>
                  </div>
                )}
                {p.services?.length ? (
                  <div>
                    <dt>Servicios</dt>
                    <dd>{p.services.join(" · ")}</dd>
                  </div>
                ) : null}
                {p.technologies?.length ? (
                  <div>
                    <dt>Tecnologías</dt>
                    <dd>{p.technologies.join(" · ")}</dd>
                  </div>
                ) : null}
              </dl>
              {p.projectType === "concept" && <p className="catalog__note">{CONCEPT_NOTE}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="final pj-close" aria-labelledby="pj-close-title">
        <div className="container final__intro" data-reveal>
          <Logo className="logo--light final__logo" />
          <h2 id="pj-close-title" className="final__title">
            ¿Te imaginas algo así para tu marca?
          </h2>
          <p className="final__sub">Usaremos {p.name} como referencia para crear una solución original para ti.</p>
          <a href={quoteHref(p.slug)} className="btn btn--light" {...trackAttrs("project_quote_clicked", { project: p.slug, from: "case_study_close" })}>
            Quiero una página como esta <ArrowRight className="btn__arrow" />
          </a>
        </div>
        <nav className="container pj-more" aria-label="Más proyectos">
          <span>Más proyectos</span>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/proyectos/${o.slug}`} className="link-arrow" {...trackAttrs("project_opened", { project: o.slug, from: "case_study_more" })}>
                  {o.name} <ArrowRight className="btn__arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Channels />
      </section>
    </>
  );
}
