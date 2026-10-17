"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/config/site";
import { ArrowRight } from "./Icon";

/**
 * Contacto flotante discreto: un círculo negro pequeño que se abre en "Hablemos por WhatsApp →".
 * Solo existe cuando hay un número real configurado.
 */
export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  if (!site.contact.whatsapp) return null;

  return (
    <div className={`wa-float ${open ? "is-open" : ""}`}>
      <a
        className="wa-float__link"
        href={whatsappLink("Hola, Fary Labs. Quiero comenzar un proyecto.")}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
      >
        Hablemos por WhatsApp <ArrowRight className="btn__arrow" />
      </a>
      <button
        type="button"
        className="wa-float__btn"
        aria-expanded={open}
        aria-label={open ? "Cerrar contacto por WhatsApp" : "Contacto por WhatsApp"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm0 16.4a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.7.7-2.6-.2-.3A7.4 7.4 0 1 1 12 19.4zm4-5.5c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.9 3.4c1.4.6 2 .7 2.7.6a2.3 2.3 0 0 0 1.5-1.1 1.9 1.9 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
        </svg>
      </button>
    </div>
  );
}
