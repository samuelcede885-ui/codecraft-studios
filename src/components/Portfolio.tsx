import { featuredProject, moreProjects, type Project } from "@/data/projects";
import { Screen } from "./screens/Screens";
import { ArrowRight } from "./Icon";

function Work({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <article className={`work ${featured ? "work--featured" : ""}`} data-reveal>
      <a href={project.href} className="work__link">
        <div className="work__frame" aria-hidden="true">
          <div className="work__bar">
            <i />
            <i />
            <i />
          </div>
          <div className="work__screen screen-frame">
            <Screen id={project.screen} lazy />
          </div>
        </div>
        <div className="work__meta">
          <h3>{project.name}</h3>
          <span className="work__cat">
            {project.category} / {project.status}
          </span>
          <p>{project.line}</p>
          <span className="work__cta">
            {project.cta} <ArrowRight className="btn__arrow" />
          </span>
        </div>
      </a>
    </article>
  );
}

export function Portfolio() {
  return (
    <section id="portafolio" className="section portfolio" aria-labelledby="portafolio-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Portafolio</span>
          <h2 id="portafolio-title" className="section-title">
            Diseño que
            <br />
            se recuerda.
          </h2>
        </header>

        <Work project={featuredProject} featured />

        <div className="more-projects">
          <h3 className="more-projects__title" data-reveal>
            Más proyectos
          </h3>
          <div className="more-projects__grid">
            {moreProjects.map((p) => (
              <Work key={p.id} project={p} />
            ))}
          </div>
          <p className="more-projects__note" data-reveal>
            Conceptos de diseño de Fary Labs. No son trabajos de clientes.
          </p>
        </div>
      </div>
    </section>
  );
}
