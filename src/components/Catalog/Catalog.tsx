import { projects } from "@/data/projects";
import { ProjectTile } from "./ProjectTile";

/** Catálogo de proyectos (justo después del hero). Los datos viven en data/projects.ts. */
export function Catalog() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);
  return (
    <section id="portafolio" className="section catalog" aria-labelledby="portafolio-title">
      <div className="container">
        <header className="section-head catalog__head" data-reveal>
          <span className="eyebrow">Portafolio</span>
          <h2 id="portafolio-title" className="section-title">
            Explora lo que
            <br />
            hemos construido.
          </h2>
          <p className="catalog__lead">Encuentra una página que se parezca a lo que imaginas para tu marca.</p>
        </header>

        <ul className="catalog__grid">
          <ProjectTile project={featured} featured />
          {rest.map((p) => (
            <ProjectTile key={p.slug} project={p} />
          ))}
        </ul>
        <p className="catalog__note" data-reveal>
          Conceptos de diseño de Fary Labs. No son trabajos de clientes.
        </p>
      </div>
    </section>
  );
}
