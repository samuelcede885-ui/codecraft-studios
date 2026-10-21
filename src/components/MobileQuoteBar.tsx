"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "./Icon";

const KEY = "fary-quote-bar-closed";

/**
 * Barra inferior en móvil: "¿Te gustó alguno? Cotizar →". Aparece después de haber visto
 * unas dos fichas del catálogo, se esconde mientras el formulario o el cierre están a la vista
 * y se puede cerrar (no vuelve en la sesión). Mientras se muestra, la página reserva su
 * altura abajo para no tapar contenido.
 */
export function MobileQuoteBar() {
  const [seen, setSeen] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    setClosed(dismissed);
    const mobile = window.matchMedia("(max-width: 767px)");
    if (dismissed) return;

    const viewed = new Set<Element>();
    const tiles = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && viewed.add(e.target));
        if (viewed.size >= 2 && mobile.matches) {
          setSeen(true);
          tiles.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll(".tile").forEach((t) => tiles.observe(t));

    const contact = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0 });
    const target = document.getElementById("contacto");
    if (target) contact.observe(target);

    return () => {
      tiles.disconnect();
      contact.disconnect();
    };
  }, []);

  const visible = seen && !closed && !atContact;

  useEffect(() => {
    document.documentElement.classList.toggle("has-quote-bar", visible);
  }, [visible]);

  function close() {
    setClosed(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  return (
    <div className={`qbar ${visible ? "is-on" : ""}`} role="region" aria-label="Cotizar un proyecto" aria-hidden={!visible} inert={!visible}>
      <p className="qbar__text">¿Te gustó alguno?</p>
      <a href="#cotizacion" className="btn btn--light btn--sm">
        Cotizar <ArrowRight className="btn__arrow" />
      </a>
      <button type="button" className="qbar__close" aria-label="Cerrar" onClick={close}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
