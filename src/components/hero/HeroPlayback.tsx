/**
 * Control discreto de pausa del recorrido del hero (el video se mueve solo: siempre debe poder
 * detenerse). Sin contador ni barra de progreso.
 */
export function HeroPlayback({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <div className="stage-ind">
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
