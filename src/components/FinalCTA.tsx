import { Logo } from "./Logo";
import { ArrowRight } from "./Icon";
import { QuoteWizard } from "./quote/QuoteWizard";
import { Channels } from "./Channels";

/** Cierre de la página: título protagonista, dos llamadas a la acción, formulario por pasos y canales. Sustituye al footer. */
export function FinalCTA() {
  return (
    <section id="contacto" className="final" aria-labelledby="final-title">
      <div className="container final__intro" data-reveal>
        <Logo className="logo--light final__logo" />
        <h2 id="final-title" className="final__title">
          Hagamos algo que valga la pena recordar.
        </h2>
        <div className="final__row">
          <p className="final__sub">Cuéntanos tu idea y construyamos lo próximo.</p>
          <div className="final__actions">
            <a href="#cotizacion" className="btn btn--light">
              Comenzar proyecto <ArrowRight className="btn__arrow" />
            </a>
            <a href="#catalogo" className="link-arrow final__link">
              Ver proyectos <ArrowRight className="btn__arrow" />
            </a>
          </div>
        </div>
      </div>

      <div className="container final__body">
        <QuoteWizard />
      </div>

      <Channels />
    </section>
  );
}
