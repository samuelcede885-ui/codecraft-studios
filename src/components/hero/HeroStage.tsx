import { heroStages } from "@/data/heroStages";

const state = (i: number, stage: number) => (i === stage ? "active" : i < stage ? "past" : "next");

/**
 * Textos del hero sincronizados con el video. Todos los paneles se apilan en la misma celda,
 * así que cambiar de etapa nunca mueve la laptop.
 * - lead: titular grande (la apertura es el h1 de la página).
 * - aside: eyebrow y descripción de la etapa.
 */
export function HeroStage({ side, stage }: { side: "lead" | "aside"; stage: number }) {
  return (
    <div className="hero-panels">
      {heroStages.map((s, i) => (
        <div
          className="hero-panel"
          key={s.title}
          data-state={state(i, stage)}
          aria-hidden={side === "lead" && i === 0 ? undefined : i !== stage}
        >
          {side === "lead" ? (
            i === 0 ? (
              <>
                <span className="hero-copy__rule" />
                <h1 className="hero-copy__title">{s.title}</h1>
                <p className="hero-copy__sub">{s.description}</p>
              </>
            ) : (
              <h2 className="step-lead__title">{s.title}</h2>
            )
          ) : (
            <>
              <span className="hero-aside__eyebrow">{i === 0 ? "En pantalla" : s.eyebrow}</span>
              <p className="hero-aside__desc">
                {i === 0 ? "Gramercy, un concepto de e-commerce diseñado por Fary Labs." : s.description}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export { state as stageState };
