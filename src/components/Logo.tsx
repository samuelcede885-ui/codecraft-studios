import { FARY_PATHS, FIRMA_VIEWBOX, LABS_PATHS, MARK_PATHS, MARK_VIEWBOX } from "./brandPaths";

/**
 * Isotipo oficial (flecha direccional del Manual de Marca v1.1).
 * Para espacios pequeños; tamaño mínimo orientativo 24 px.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/**
 * Firma completa: símbolo + "Fary" + "labs" bajo la F y la A. Es un único dibujo,
 * así que la relación entre las piezas nunca cambia. Tamaño mínimo orientativo 180 px de ancho.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={FIRMA_VIEWBOX}
      className={`logo ${className ?? ""}`}
      role="img"
      aria-label="Fary Labs"
      fill="currentColor"
      fillRule="evenodd"
    >
      <g className="logo__mark">
        {MARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g className="logo__word">
        {FARY_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {LABS_PATHS.map((d, i) => (
          <path key={`l${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
