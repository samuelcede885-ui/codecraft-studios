/** Indicador lateral de progreso (escritorio) y aviso de scroll del hero. */
export function StoryProgress({ total }: { total: number }) {
  return (
    <>
      <div className="stage__hint" aria-hidden="true">
        <span className="stage__mouse" />
        Scroll
      </div>
      <div className="stage__progress" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-dot />
        ))}
      </div>
    </>
  );
}
