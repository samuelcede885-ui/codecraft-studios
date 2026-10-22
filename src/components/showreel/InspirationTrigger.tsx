"use client";

import { ArrowRight } from "../Icon";
import { SHOWREEL_EVENT } from "./InspirationShowreel";

/** Botón "Inspírame →": abre el showreel a pantalla completa. */
export function InspirationTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`btn btn--outline ${className}`}
      data-cursor="play"
      onClick={() => window.dispatchEvent(new Event(SHOWREEL_EVENT))}
    >
      Inspírame <ArrowRight className="btn__arrow" />
    </button>
  );
}
