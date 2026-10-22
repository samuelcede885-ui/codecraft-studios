"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";
import { Screen } from "./screens/Screens";
import { ArrowRight, Plus } from "./Icon";

function ServiceGlyph({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 64 64" className="service__glyph" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      {id === "web" && (
        <>
          <rect x="6" y="12" width="52" height="36" rx="3" />
          <path d="M6 20h52M22 56h20M32 48v8" />
        </>
      )}
      {id === "app" && (
        <>
          <rect x="8" y="8" width="22" height="22" rx="4" />
          <rect x="34" y="8" width="22" height="22" rx="4" />
          <rect x="8" y="34" width="22" height="22" rx="4" />
          <rect x="34" y="34" width="22" height="22" rx="11" />
        </>
      )}
      {id === "agent" && (
        <>
          <circle cx="32" cy="32" r="10" />
          <circle cx="32" cy="32" r="22" strokeDasharray="3 5" />
          <path d="M32 4v8M32 52v8M4 32h8M52 32h8" />
        </>
      )}
    </svg>
  );
}

/** Tres servicios en formato editorial; cada uno se expande para ver qué incluye y una vista previa. */
export function Services() {
  const [open, setOpen] = useState<string | null>(services[0].id);

  // En móvil empiezan todos cerrados: la sección ocupa menos y cada uno se abre al tocarlo.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setOpen(null);
  }, []);

  return (
    <section id="servicios" className="section services" aria-labelledby="servicios-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Servicios</span>
          <h2 id="servicios-title" className="section-title">
            Tres formas de
            <br />
            construir lo próximo.
          </h2>
        </header>

        <ol className="services__list">
          {services.map((s, i) => {
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
                    <span className="service__num">{String(i + 1).padStart(2, "0")}</span>
                    <ServiceGlyph id={s.id} />
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
                      <p>{s.detail}</p>
                      <ul className="service__includes">
                        {s.includes.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <a href="#contacto" className="service__cta">
                        Comenzar proyecto <ArrowRight className="btn__arrow" />
                      </a>
                    </div>
                    <div className="service__preview" aria-hidden="true">
                      <div className="screen-frame">
                        <Screen id={s.preview} lazy />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="cta-row" data-reveal>
          <p>¿No sabes cuál encaja con tu idea? Te ayudamos a definirlo.</p>
          <a href="#contacto" className="btn btn--dark">
            Comenzar proyecto <ArrowRight className="btn__arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
