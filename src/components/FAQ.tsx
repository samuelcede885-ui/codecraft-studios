"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faq } from "@/data/faq";
import { Plus } from "./Icon";

/** Preguntas frecuentes en acordeón (una abierta a la vez). Textos en data/faq.ts. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 id="faq-title" className="section-title section-title--md">
            Lo que suelen
            <br />
            preguntarnos.
          </h2>
        </header>
        <ul className="faq__list">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={`faq__item ${isOpen ? "is-open" : ""}`} data-reveal>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    id={`faq-${i}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.question}
                    <span className="faq__icon" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>
                </h3>
                <div
                  className="faq__a"
                  id={`faq-${i}-a`}
                  role="region"
                  aria-labelledby={`faq-${i}-q`}
                  inert={!isOpen}
                  onTransitionEnd={(e) => e.propertyName === "grid-template-rows" && ScrollTrigger.refresh()}
                >
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
