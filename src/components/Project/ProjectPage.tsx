import { projects, quoteHref, type Project } from "@/data/projects";
import { ArrowRight } from "../Icon";
import { Logo } from "../Logo";
import { Channels } from "../Channels";
import { ProjectVideo } from "./ProjectVideo";
import { assetUrl } from "@/lib/assets";

/** Ficha de proyecto: hero con el recorrido en video, qué se construyó, problema, servicios, tecnologías y galería. */
export function ProjectPage({ project: p }: { project: Project }) {
  const others = projects.filter((x) => x.slug !== p.slug);
  return (
    <>
      <section className="pj-hero" aria-labelledby="pj-title">
        <div className="container">
          <a href="/#portafolio" className="pj-back link-arrow">
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
          <div className="pj-hero__media">
            <ProjectVideo project={p} />
          </div>
        </div>
      </section>

      <section className="section pj-info" aria-label="Sobre el proyecto">
        <div className="container pj-info__grid">
          <div className="pj-block" data-reveal>
            <h2>Qué se construyó</h2>
            <p>{p.built}</p>
          </div>
          <div className="pj-block" data-reveal>
            <h2>Qué problema resolvía</h2>
            <p>{p.problem}</p>
          </div>
          <div className="pj-block" data-reveal>
            <h2>Servicios realizados</h2>
            <ul className="pj-list">
              {p.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="pj-block" data-reveal>
            <h2>Tecnologías</h2>
            <ul className="pj-list">
              {p.technologies.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section pj-gallery" aria-labelledby="pj-gallery-title">
        <div className="container">
          <h2 id="pj-gallery-title" className="section-title section-title--sm" data-reveal>
            Galería
          </h2>
          <div className={`pj-gallery__grid ${p.gallery.length === 1 ? "is-single" : ""}`}>
            {p.gallery.map((g, i) => (
              <figure key={g.src} className={`pj-shot ${i === 0 ? "pj-shot--wide" : ""}`} data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
                <img src={assetUrl(g.src)} alt={g.alt} width={1280} height={720} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
          <p className="catalog__note">Concepto de diseño de Fary Labs. No es un trabajo de cliente.</p>
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
