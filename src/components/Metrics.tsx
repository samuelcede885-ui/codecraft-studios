import { metrics } from "@/data/metrics";

/** Resultados del estudio. Deshabilitada mientras no haya datos reales en data/metrics.ts. */
export function Metrics() {
  if (metrics.length === 0) return null;
  return (
    <section className="section metrics" aria-label="Resultados">
      <div className="container">
        <span className="eyebrow" data-reveal>
          Resultados
        </span>
        <dl className="metrics__list">
          {metrics.map((m) => (
            <div key={m.label} className="metric" data-reveal>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
