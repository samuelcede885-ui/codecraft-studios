import { forwardRef } from "react";

/** Laptop realista en CSS. El contenido de la pantalla se pasa como children. */
export const Laptop = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  function Laptop({ children, className }, ref) {
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
