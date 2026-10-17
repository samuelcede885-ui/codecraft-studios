import type { Project } from "@/data/projects";
import { Screen } from "../screens/Screens";
import { ArrowRight } from "../Icon";

/** Proyecto grande: imagen protagonista (revelada con clip-path al entrar) y una ficha mínima. */
export function ProjectCard({
  project,
  featured,
  onOpen,
}: {
  project: Project;
  featured?: boolean;
  onOpen: (p: Project) => void;
}) {
  return (
    <article className={`project ${featured ? "project--featured" : ""}`}>
      <a
        href={`#proyecto-${project.id}`}
        className="project__link"
        data-cursor="project"
        onClick={(e) => {
          e.preventDefault();
          onOpen(project);
        }}
      >
        <div className="project__media" data-clip>
          <div className="project__frame screen-frame" aria-hidden="true">
            <Screen id={project.screen} lazy />
          </div>
        </div>
        <div className="project__meta" data-reveal>
          <span className="project__cat">
            {project.category}
            {project.year && ` · ${project.year}`}
          </span>
          <h3 className="project__name">{project.name}</h3>
          <p className="project__line">{project.line}</p>
          <span className="project__cta link-arrow">
            Ver proyecto <ArrowRight className="btn__arrow" />
          </span>
        </div>
      </a>
    </article>
  );
}
