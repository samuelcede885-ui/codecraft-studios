"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";
import { Screen } from "../screens/Screens";
import { ArrowRight, Plus } from "../Icon";

/**
 * Acordeón editorial: solo un servicio abierto a la vez. La descripción vive en la cabecera
 * (no se repite al abrir); el cuerpo muestra capacidades, CTA y una vista previa grande.
 */
export function ServiceAccordion() {
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <ol className="services__list">
      {services.map((s) => {
        const isOpen = open === s.id;
        return (
          <li key={s.id} className={`service ${isOpen ? "is-open" : ""}`} data-reveal>
            <h3 className="service__heading">
              <button
                type="button"
                className="service__head"
                id={`service-${s.id}-head`}
                aria-expanded={isOpen}
                aria-controls={`service-${s.id}-body`}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span className="service__name">
                  <b>{s.name}</b>
                  <span>{s.kind}</span>
                </span>
                <span className="service__desc">{s.description}</span>
                <span className="service__toggle" aria-hidden="true">
                  <Plus />
                </span>
              </button>
            </h3>
            <div
              className="service__body"
              id={`service-${s.id}-body`}
              role="region"
              aria-labelledby={`service-${s.id}-head`}
              inert={!isOpen}
              onTransitionEnd={(e) => e.propertyName === "grid-template-rows" && ScrollTrigger.refresh()}
            >
              <div className="service__inner">
                <div className="service__detail">
                  <ul className="service__includes" aria-label={`Qué incluye ${s.name}`}>
                    {s.includes.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <a href="#contacto" className="btn btn--dark service__cta">
                    Comenzar proyecto <ArrowRight className="btn__arrow" />
                  </a>
                </div>
                <div className="service__preview" aria-hidden="true">
                  <div className="screen-frame" data-ui>
                    <Screen id={s.preview} lazy />
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
