import type { ReactNode } from "react";

// Una sola carcasa de laptop en CSS. Nunca se desmonta ni se desplaza entre escenas:
// solo cambia lo que hay dentro de `.laptop-screen`, que recorta el contenido al borde exacto.
export default function Laptop({ children }: { children: ReactNode }) {
  return (
    <div className="laptop" data-laptop>
      <div className="laptop-lid">
        <span className="laptop-cam" aria-hidden="true" />
        <div className="laptop-screen">
          {children}
          <span className="laptop-glare" aria-hidden="true" />
        </div>
      </div>
      <div className="laptop-base" aria-hidden="true">
        <span className="laptop-notch" />
      </div>
      <span className="laptop-shadow" aria-hidden="true" />
    </div>
  );
}
