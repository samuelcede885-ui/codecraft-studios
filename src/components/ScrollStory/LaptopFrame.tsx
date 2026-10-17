import { forwardRef } from "react";

/**
 * Carcasa de laptop en CSS. Es siempre la misma durante toda la historia:
 * solo cambia lo que hay dentro de la pantalla (children), que recorta su contenido.
 */
export const LaptopFrame = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  function LaptopFrame({ children, className }, ref) {
    return (
      <div ref={ref} className={`laptop ${className ?? ""}`}>
        <div className="laptop__lid">
          <span className="laptop__camera" aria-hidden="true" />
          <div className="laptop__screen">{children}</div>
          <span className="laptop__glare" aria-hidden="true" />
        </div>
        <div className="laptop__base" aria-hidden="true">
          <span className="laptop__notch" />
        </div>
        <div className="laptop__shadow" aria-hidden="true" />
      </div>
    );
  },
);
