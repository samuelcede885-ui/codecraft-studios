import { ArrowRight } from "../Icon";
import { ServiceAccordion } from "./ServiceAccordion";

export function Services() {
  return (
    <section id="servicios" className="section services" aria-labelledby="servicios-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <h2 id="servicios-title" className="section-title">
            Tres formas de
            <br />
            construir lo próximo.
          </h2>
        </header>

        <ServiceAccordion />

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
