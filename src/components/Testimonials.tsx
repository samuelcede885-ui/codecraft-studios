import { testimonialPlaceholders, testimonials } from "@/data/testimonials";

/**
 * Testimonios (máximo 3). Sin testimonios reales la sección no existe en producción;
 * en desarrollo se ven placeholders marcados para poder maquetar.
 */
export function Testimonials() {
  const isDev = process.env.NODE_ENV === "development";
  const placeholder = testimonials.length === 0;
  if (placeholder && !isDev) return null;
  const items = (placeholder ? testimonialPlaceholders : testimonials).slice(0, 3);

  return (
    <section className="section testimonials" aria-labelledby="testimonios-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Lo que dicen nuestros clientes</span>
          <h2 id="testimonios-title" className="section-title">
            Confianza que
            <br />
            se construye.
          </h2>
          {placeholder && <p className="dev-note">Placeholder de desarrollo — no se publica.</p>}
        </header>
        <ul className="testimonials__list">
          {items.map((t, i) => (
            <li key={i} className="testimonial" data-reveal>
              <blockquote>
                <p>“{t.quote}”</p>
              </blockquote>
              <span className="testimonial__name">{t.name}</span>
              <span className="testimonial__company">{t.company}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
