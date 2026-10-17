import type { StoryStep } from "@/data/storySteps";
import { Icon } from "../Icon";

/** Columna izquierda (arriba en móvil): etapa y título. El número vive aparte, en StoryNumber. */
export function StepLead({ step }: { step: StoryStep }) {
  return (
    <div className="step-lead">
      <span className="step-lead__phase" data-item>
        {step.phase}
      </span>
      <h2 className="step-lead__title" data-item>
        {step.title}
      </h2>
    </div>
  );
}

/** Columna derecha (debajo de la laptop en móvil): metadata, mensaje y etiquetas. */
export function StepAside({ step, total }: { step: StoryStep; total: number }) {
  return (
    <div className="step-aside">
      <span className="step-aside__meta" data-item>
        <b>{step.id}</b> / {String(total).padStart(2, "0")} — {step.label}
      </span>
      <p className="step-aside__desc" data-item>
        {step.description}
      </p>
      <ul className="step-aside__tags" aria-label="Incluye">
        {step.tags.map((t) => (
          <li key={t.label} data-item>
            <Icon name={t.icon} className="step-aside__icon" />
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Número grande con máscara vertical: la columna 01…05 se desliza dentro de una ventana de una línea. */
export function StoryNumber({ steps }: { steps: StoryStep[] }) {
  return (
    <div className="story-num" aria-hidden="true">
      <span className="story-num__col">
        {steps.map((s) => (
          <span key={s.id}>{s.id}</span>
        ))}
      </span>
    </div>
  );
}
