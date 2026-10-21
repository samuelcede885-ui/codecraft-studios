import { projects } from "@/data/projects";
import { ProjectTile } from "./ProjectTile";

/** Catálogo de proyectos (después del destacado). Los datos viven en data/projects.ts. */
export function Catalog() {
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
          <p className="catalog__lead">
            Encuentra una página, aplicación o experiencia que se parezca a lo que imaginas para tu marca.
          </p>
        </header>

        <ul className="catalog__grid">
          {projects.map((p, i) => (
            <ProjectTile key={p.slug} project={p} index={i + 1} />
          ))}
        </ul>
        <p className="catalog__note" data-reveal>
          Conceptos de diseño de Fary Labs. No son trabajos de clientes.
        </p>
      </div>
    </section>
  );
}
