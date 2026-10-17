/**
 * Recreación vectorial del símbolo de Fary Labs (flecha → con barra).
 * Es una aproximación a partir del brand board; sustituir por el SVG
 * original del logotipo cuando esté disponible.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <polygon points="6,0 33,0 71,50 44,50" />
      <polygon points="44,50 71,50 33,100 6,100" />
      <rect x="0" y="38" width="48" height="24" />
      <polygon points="76,0 100,0 100,46 76,46 76,40" />
      <polygon points="80,56 100,56 100,100 76,100 76,62" />
    </svg>
  );
}

export function Logo({ className, labs = true }: { className?: string; labs?: boolean }) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__word">
        Fary
        {labs && <span className="logo__labs">labs</span>}
      </span>
    </span>
  );
}
