import { chapterLabels, projects, quoteHref, type Project, type Visual } from "@/data/projects";
import { ArrowRight } from "../Icon";
import { Logo } from "../Logo";
import { Channels } from "../Channels";
import { ProjectVideo } from "./ProjectVideo";
import { assetUrl } from "@/lib/assets";

function VisualBlock({ v }: { v: Visual }) {
  switch (v.kind) {
    case "video":
      return (
        <figure className="pj-visual" data-media>
          <ProjectVideo src={v.src} poster={v.poster} label={v.label} />
        </figure>
      );
    case "image":
      return (
        <figure className="pj-visual" data-media>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img src={assetUrl(v.src)} alt={v.alt} width={1280} height={720} loading="lazy" decoding="async" />
        </figure>
      );
    case "flow":
      return (
        <ol className="pj-flow" data-media>
          {v.steps.map((s, i) => (
            <li key={s}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      );
  }
}

/**
 * Case study como relato visual: hero con la portada, el reto en pocas líneas, capítulos
 * (experiencia, producto, conversión, sistema) donde la imagen manda, y lo que permite la solución.
 * Las imágenes aparecen con un recorte que se abre (ScrollEffects, [data-media]).
 */
export function ProjectPage({ project: p }: { project: Project }) {
  const others = projects.filter((x) => x.slug !== p.slug);
  const { story } = p;
  return (
    <>
      <section className="pj-hero" aria-labelledby="pj-title">
        <div className="container">
          <a href="/#catalogo" className="pj-back link-arrow">
            <ArrowRight className="btn__arrow pj-back__icon" /> Volver al portafolio
          </a>
          <div className="pj-hero__head">
            <div>
              <span className="pj-hero__cat">
                {p.category} · {p.status}
                {p.year && ` · ${p.year}`}
              </span>
              <h1 id="pj-title" className="pj-hero__title">
                {p.name}
              </h1>
              <p className="pj-hero__lead">{p.description}</p>
            </div>
            <a href={quoteHref(p.slug)} className="btn btn--dark">
              Quiero una página como esta <ArrowRight className="btn__arrow" />
            </a>
          </div>
        </div>
        <figure className="pj-hero__media" data-media>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img src={assetUrl(p.thumbnail)} alt={`Portada del concepto ${p.name}`} width={1600} height={900} decoding="async" fetchPriority="high" />
        </figure>
      </section>

      <section className="pj-challenge" aria-labelledby="pj-challenge-title">
        <div className="container pj-split">
          <div data-reveal>
            <span className="pj-label">El reto</span>
            <h2 id="pj-challenge-title" className="sr-only">
              El reto
            </h2>
          </div>
          <div className="pj-challenge__text" data-reveal>
            {story.challenge.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {story.chapters.map((c, i) => (
        <section key={c.key} className={`pj-chapter pj-chapter--${c.key}`} aria-labelledby={`pj-${c.key}`}>
          <div className="container">
            <header className="pj-chapter__head" data-reveal>
              <span className="pj-label">
                <b>{String(i + 1).padStart(2, "0")}</b> {chapterLabels[c.key]}
              </span>
              <h2 id={`pj-${c.key}`} className="pj-chapter__title">
                {c.title}
              </h2>
              <p className="pj-chapter__text">{c.text}</p>
            </header>
            <div className={`pj-visuals ${c.visuals.length > 1 ? "is-pair" : ""}`}>
              {c.visuals.map((v, j) => (
                <VisualBlock key={j} v={v} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="pj-result" aria-labelledby="pj-result-title">
        <div className="container pj-split">
          <div data-reveal>
            <span className="pj-label">Resultado</span>
          </div>
          <div data-reveal>
            <h2 id="pj-result-title" className="pj-result__text">
              {story.result.join(" ")}
            </h2>
            <dl className="pj-credits">
              <div>
                <dt>Servicios</dt>
                <dd>{p.services.join(" · ")}</dd>
              </div>
              <div>
                <dt>Tecnologías</dt>
                <dd>{p.technologies.join(" · ")}</dd>
              </div>
            </dl>
            <p className="catalog__note">Concepto de diseño de Fary Labs. No es un trabajo de cliente, por eso no mostramos métricas.</p>
          </div>
        </div>
      </section>

      <section className="final pj-close" aria-labelledby="pj-close-title">
        <div className="container final__intro" data-reveal>
          <Logo className="logo--light final__logo" />
          <h2 id="pj-close-title" className="final__title">
            ¿Te imaginas algo así para tu marca?
          </h2>
          <p className="final__sub">Usaremos {p.name} como referencia para crear una solución original para ti.</p>
          <a href={quoteHref(p.slug)} className="btn btn--light">
            Quiero una página como esta <ArrowRight className="btn__arrow" />
          </a>
        </div>
        <nav className="container pj-more" aria-label="Más proyectos">
          <span>Más proyectos</span>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/proyectos/${o.slug}`} className="link-arrow">
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
