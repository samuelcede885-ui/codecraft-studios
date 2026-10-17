"use client";

import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { CaseStudy } from "./CaseStudy";
import { ProjectCard } from "./ProjectCard";

/** Trabajo seleccionado: proyectos grandes y visuales; cada uno abre su caso de estudio. */
export function Portfolio() {
  const [selected, setSelected] = useState<Project | null>(null);

  // Enlace directo a un caso: #proyecto-gramercy.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#proyecto-", "");
      const p = projects.find((x) => `#proyecto-${x.id}` === window.location.hash);
      if (p && id) setSelected(p);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function open(p: Project) {
    history.replaceState(null, "", `#proyecto-${p.id}`);
    setSelected(p);
  }
  function close() {
    history.replaceState(null, "", "#proyectos");
    setSelected(null);
  }

  const [featured, ...rest] = projects;

  return (
    <section id="proyectos" className="section portfolio" aria-labelledby="proyectos-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Trabajo seleccionado</span>
          <h2 id="proyectos-title" className="section-title">
            Diseño que
            <br />
            se recuerda.
          </h2>
        </header>

        <ProjectCard project={featured} featured onOpen={open} />
        <div className="projects">
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={open} />
          ))}
        </div>
        <p className="projects__note" data-reveal>
          Conceptos de diseño de Fary Labs. No son trabajos de clientes.
        </p>
      </div>
      <CaseStudy project={selected} onClose={close} />
    </section>
  );
}
