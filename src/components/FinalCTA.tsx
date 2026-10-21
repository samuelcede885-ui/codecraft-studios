import { Logo } from "./Logo";
import { ArrowRight } from "./Icon";
import { QuoteForm } from "./QuoteForm";
import { Channels } from "./Channels";

/** Cierre de la página: llamada a la acción, formulario de cotización y canales. Sustituye al footer. */
export function FinalCTA() {
  return (
    <section id="contacto" className="final" aria-labelledby="final-title">
      <div className="container final__intro" data-reveal>
        <Logo className="logo--light final__logo" />
        <h2 id="final-title" className="final__title">
          Hagamos algo que valga la pena recordar.
        </h2>
        <p className="final__sub">Cuéntanos tu idea y construyamos lo próximo.</p>
        <a href="#cotizacion" className="btn btn--light">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>

      <div className="container final__body">
        <QuoteForm />
      </div>

      <Channels />
    </section>
  );
}
