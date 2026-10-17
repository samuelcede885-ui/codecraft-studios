/** Símbolo oficial de Fary Labs (flecha diagonal), trazado a partir del logo original. */
const MARK_POINTS =
  "191,188 484,188 803,516 803,188 1051,188 1051,744 863,921 1062,921 908,1065 370,1065 567,879 191,879 191,639 575,639 191,251";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="191 188 871 877"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <polygon points={MARK_POINTS} />
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
