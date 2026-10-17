import { processSteps } from "@/data/process";

/** Cuatro pasos: en horizontal en escritorio y en vertical en móvil, con una línea que avanza con el scroll. */
export function Process() {
  return (
    <section id="proceso" className="section process" aria-labelledby="proceso-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Cómo trabajamos</span>
          <h2 id="proceso-title" className="section-title">
            De la idea
            <br />
            al lanzamiento.
          </h2>
        </header>

        <div className="process__track">
          <span className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
          </span>
          <ol className="process__steps">
            {processSteps.map((s) => (
              <li key={s.number} className="process__step" data-reveal>
                <span className="process__dot" aria-hidden="true" />
                <span className="process__num">{s.number}</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
