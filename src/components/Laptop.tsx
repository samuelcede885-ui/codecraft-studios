import { forwardRef } from "react";

/**
 * Laptop realista en CSS. El contenido de la pantalla se pasa como children;
 * `overlay` se dibuja encima de la pantalla sin recortarse (etiquetas, puntos).
 */
export const Laptop = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; overlay?: React.ReactNode }
>(function Laptop({ children, className, overlay }, ref) {
  return (
    <div ref={ref} className={`laptop ${className ?? ""}`}>
      <div className="laptop__lid">
        <span className="laptop__camera" aria-hidden="true" />
        <div className="laptop__screen">{children}</div>
        <span className="laptop__glare" aria-hidden="true" />
        {overlay && <div className="laptop__overlay">{overlay}</div>}
      </div>
      <div className="laptop__base" aria-hidden="true">
        <span className="laptop__notch" />
      </div>
      <div className="laptop__shadow" aria-hidden="true" />
    </div>
  );
});
