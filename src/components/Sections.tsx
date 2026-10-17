import { portfolio, processSteps, services } from "@/data/content";
import { Screen } from "./screens/Screens";
import { ArrowRight } from "./Icon";

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

export function Services() {
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
          {services.map((s, i) => (
            <li key={s.id} className="service" data-reveal>
              <span className="service__num">{String(i + 1).padStart(2, "0")}</span>
              <ServiceGlyph id={s.id} />
              <div className="service__name">
                <h3>{s.name}</h3>
                <span>{s.kind}</span>
              </div>
              <p className="service__desc">{s.description}</p>
              <ul className="service__tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href="#contacto" className="service__link" aria-label={`Solicitar ${s.name}`}>
                <ArrowRight />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Portfolio() {
  return (
    <section id="portafolio" className="section portfolio" aria-labelledby="portafolio-title">
      <div className="container">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <span className="eyebrow">Portafolio</span>
            <h2 id="portafolio-title" className="section-title">
              Diseño que
              <br />
              se recuerda.
            </h2>
          </div>
          <p className="section-note">
            Referencias visuales que inspiran nuestra dirección de diseño. No son trabajos realizados por Fary Labs.
          </p>
        </header>

        <div className="portfolio__grid">
          {portfolio.map((p, i) => (
            <article key={p.screen} className={`work work--${i % 4}`} data-reveal>
              <a href="#contacto" className="work__link" aria-label={`${p.name}: quiero un proyecto así`}>
                <div className="work__frame">
                  <div className="work__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="work__screen">
                    <Screen id={p.screen} lazy />
                  </div>
                </div>
                <div className="work__meta">
                  <div>
                    <h3>{p.name}</h3>
                    <span>
                      {p.type} · Referencia
                    </span>
                  </div>
                  <p>{p.description}</p>
                  <span className="work__cta">
                    Quiero algo así <ArrowRight className="btn__arrow" />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="proceso" className="section process" aria-labelledby="proceso-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Proceso</span>
          <h2 id="proceso-title" className="section-title">
            Así trabajamos
            <br />
            contigo.
          </h2>
        </header>

        <div className="process__track">
          <span className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
          </span>
          <ol className="process__steps">
            {processSteps.map((s) => (
              <li key={s.number} className="process__step" data-reveal>
                <span className="process__dot" aria-hidden="true" />
                <span className="process__num">{s.number}.</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
