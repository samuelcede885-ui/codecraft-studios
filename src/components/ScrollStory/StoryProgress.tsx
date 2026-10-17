import type { StoryStep } from "@/data/storySteps";

/**
 * Indicador de progreso 01–05, deliberadamente discreto: en escritorio una línea vertical
 * con los números; en móvil, cinco segmentos finos. El estado activo lo marca ScrollStory.
 */
export function StoryProgress({ steps }: { steps: StoryStep[] }) {
  return (
    <>
      <div className="stage__hint" aria-hidden="true">
        <span className="stage__mouse" />
        Scroll
      </div>
      <div className="story-progress" aria-hidden="true">
        <span className="story-progress__track">
          <span className="story-progress__fill" />
        </span>
        <ol>
          {steps.map((s) => (
            <li key={s.id} data-dot>
              <span>{s.id}</span>
              <i />
            </li>
          ))}
        </ol>
      </div>
      <div className="story-bar" aria-hidden="true">
        {steps.map((s) => (
          <span key={s.id} data-seg />
        ))}
      </div>
    </>
  );
}
