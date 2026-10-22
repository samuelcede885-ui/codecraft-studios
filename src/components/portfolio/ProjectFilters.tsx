import { filters, projects, type FilterId } from "@/data/projects";

export type ActiveFilter = FilterId | "all";

/** Elegir filtro desde otra sección (ProjectCategories): detail = { filter }. */
export const FILTER_EVENT = "fary:filter";

/** Solo los filtros con proyectos. */
const available = filters.filter((f) => f.id === "all" || projects.some((p) => p.filters.includes(f.id)));
const count = (id: ActiveFilter) => (id === "all" ? projects.length : projects.filter((p) => p.filters.includes(id)).length);

/** Píldoras de filtro con contador; la activa en negro. */
export function ProjectFilters({ active, onChoose }: { active: ActiveFilter; onChoose: (id: ActiveFilter) => void }) {
  return (
    <div className="catalog__filters" role="group" aria-label="Filtrar proyectos" data-reveal>
      {available.map((f) => (
        <button key={f.id} type="button" className="chip" aria-pressed={active === f.id} onClick={() => onChoose(f.id)}>
          {f.label}
          <span className="chip__count">{count(f.id)}</span>
        </button>
      ))}
    </div>
  );
}
