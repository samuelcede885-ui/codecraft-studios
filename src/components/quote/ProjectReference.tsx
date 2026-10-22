import { projects, typeLabel, type Project } from "@/data/projects";
import { assetUrl } from "@/lib/assets";

const likes = ["Diseño", "Animaciones", "Estructura", "Experiencia móvil", "E-commerce", "Todo el concepto"];

/**
 * Paso "Tu referencia": si llegó un proyecto desde "Quiero una página como esta" se muestra
 * con su portada (sin obligar a elegirlo de nuevo); si no, se puede elegir uno o seguir sin él.
 * Con referencia, pregunta qué gustó (opcional, varias respuestas).
 */
export function ProjectReference({
  project,
  picking,
  onPick,
  onSelect,
}: {
  project?: Project;
  picking: boolean;
  onPick: (picking: boolean) => void;
  onSelect: (p?: Project) => void;
}) {
  return (
    <>
      {project && !picking ? (
        <div className="ref-card">
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img src={assetUrl(project.thumbnail)} alt="" width={1600} height={900} loading="lazy" decoding="async" />
          <div>
            <span className="ref-card__label">Tu referencia</span>
            <p className="ref-card__name">{project.name}</p>
            <span className="ref-card__cat">
              {project.category} · {typeLabel(project)}
            </span>
            <button type="button" className="ref-card__change" onClick={() => onPick(true)}>
              Cambiar referencia
            </button>
          </div>
        </div>
      ) : (
        <div className="choices" role="radiogroup" aria-label="Proyecto de referencia (opcional)">
          <label className="choice">
            <input type="radio" name="refpick" checked={!project} onChange={() => onSelect(undefined)} />
            <span>Sin referencia</span>
          </label>
          {projects.map((p) => (
            <label key={p.slug} className="choice">
              <input type="radio" name="refpick" checked={project?.slug === p.slug} onChange={() => onSelect(p)} />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      )}
      {project && (
        <div className="wizard__likes">
          <p className="wizard__q">¿Qué te gustó?</p>
          <div className="choices">
            {likes.map((l) => (
              <label key={l} className="choice">
                <input type="checkbox" name="liked" value={l} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
