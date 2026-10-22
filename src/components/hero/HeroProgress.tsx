import type { Ref } from "react";
import { HERO_DURATION, heroStages, numberedStages } from "@/data/heroStages";

/**
 * Indicador "01 / 05" con barra continua y botón de pausa. El relleno de la barra lo escribe
 * HeroExperience directamente (currentTime / duration del video) a través de `fillRef`.
 */
export function HeroProgress({
  stage,
  paused,
  onToggle,
  fillRef,
}: {
  stage: number;
  paused: boolean;
  onToggle: () => void;
  fillRef: Ref<HTMLElement>;
}) {
  const n = Math.max(1, numberedStages.indexOf(heroStages[stage]) + 1);
  return (
    <div className="stage-ind">
      <span className={`stage-ind__num ${stage === 0 ? "is-idle" : ""}`} aria-hidden="true">
        <b>{String(n).padStart(2, "0")}</b> / {String(numberedStages.length).padStart(2, "0")}
      </span>
      <span className="stage-ind__bar" aria-hidden="true">
        <i className="stage-ind__fill" ref={fillRef} />
        {numberedStages.map((s) => (
          <i key={s.id} className="stage-ind__tick" style={{ left: `${(s.start / HERO_DURATION) * 100}%` }} />
        ))}
      </span>
      <button
        type="button"
        className="stage-ind__toggle"
        onClick={onToggle}
        aria-label={paused ? "Reproducir el recorrido" : "Pausar el recorrido"}
        aria-pressed={paused}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13M16 5.5v13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
