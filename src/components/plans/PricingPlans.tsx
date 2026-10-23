"use client";

import { useState } from "react";
import { planLines, plans, usd, type Plan, type PlanLine } from "@/data/plans";
import { selectQuotePlan } from "@/lib/quote";
import { ArrowRight } from "../Icon";

/**
 * Planes por línea de servicio (Web, App, Agentes y Packs) con su precio de partida.
 * "Elegir este plan" lleva al formulario con el plan y el tipo de proyecto ya elegidos.
 */
export function PricingPlans() {
  const [line, setLine] = useState<PlanLine>("web");
  return (
    <section id="planes" className="section plans" aria-labelledby="planes-title">
      <div className="container">
        <header className="section-head plans__head" data-reveal>
          <span className="eyebrow">Planes</span>
          <h2 id="planes-title" className="section-title">
            Elige por dónde
            <br />
            empezar.
          </h2>
          <p className="plans__lead">Precios de partida en dólares. Confirmamos el alcance y el precio final contigo antes de empezar.</p>
        </header>

        <div className="plans__tabs" role="tablist" aria-label="Líneas de servicio" data-reveal>
          {planLines.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              id={`plan-tab-${l.id}`}
              aria-selected={line === l.id}
              aria-controls="plan-panel"
              className="plans__tab"
              onClick={() => setLine(l.id)}
            >
              <b>{l.label}</b>
              <span>{l.title}</span>
            </button>
          ))}
        </div>

        <ul id="plan-panel" className="plans__grid" role="tabpanel" aria-labelledby={`plan-tab-${line}`}>
          {plans[line].map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </ul>

        <p className="plans__note">
          Pago del 50 % al iniciar y 50 % contra entrega. El mantenimiento mensual es opcional e incluye alojamiento, copias de seguridad y horas de ajustes según
          el plan.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan: p }: { plan: Plan }) {
  return (
    <li className="plan">
      <div className="plan__top">
        <span className="plan__kind">{p.kind}</span>
        <h3 className="plan__name">{p.name}</h3>
        <p className="plan__price">
          <span>Desde</span> <b>{usd(p.price)}</b>
          {p.regular && <s aria-label={`Por separado ${usd(p.regular)}`}>{usd(p.regular)}</s>}
        </p>
        {p.regular && <span className="plan__save">Ahorras {usd(p.regular - p.price)}</span>}
        {p.monthly && <span className="plan__monthly">Mantenimiento opcional: {usd(p.monthly)}/mes</span>}
      </div>
      <ul className="plan__includes">
        {p.includes.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {p.forWhom && <p className="plan__for">{p.forWhom}</p>}
      {p.support && <p className="plan__support">{p.support}</p>}
      <a href="#cotizacion" className="btn btn--light plan__cta" onClick={() => selectQuotePlan(p)}>
        Elegir este plan <ArrowRight className="btn__arrow" />
      </a>
    </li>
  );
}
