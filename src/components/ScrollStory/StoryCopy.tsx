import type { StoryStep } from "@/data/storySteps";

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

/** Columna derecha (debajo de la laptop en móvil): metadata y mensaje. */
export function StepAside({ step, total }: { step: StoryStep; total: number }) {
  return (
    <div className="step-aside">
      <span className="step-aside__meta" data-item>
        <b>{step.id}</b> / {String(total).padStart(2, "0")} — {step.label}
      </span>
      <p className="step-aside__desc" data-item>
        {step.description}
      </p>
    </div>
  );
}

/** Número grande con máscara vertical: la columna 01…05 se desliza como un contador. */
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
