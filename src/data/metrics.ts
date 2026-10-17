/**
 * Resultados del estudio. Solo datos reales y verificables: mientras la lista esté vacía,
 * la sección de métricas queda deshabilitada. Ejemplo: { value: "+12", label: "Proyectos" }.
 */
export type Metric = { value: string; label: string };

export const metrics: Metric[] = [];
