import type { ReactNode } from "react";

/** Capítulo del case study: rótulo numerado, título corto, una frase y el visual a lo ancho. */
export function CaseStudySection({
  id,
  number,
  label,
  title,
  text,
  className = "",
  children,
}: {
  id: string;
  number?: number;
  label: string;
  title: string;
  text?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`pj-chapter ${className}`} aria-labelledby={`pj-${id}`}>
      <div className="container">
        <header className="pj-chapter__head" data-reveal>
          <span className="pj-label">
            {number !== undefined && <b>{String(number).padStart(2, "0")}</b>} {label}
          </span>
          <h2 id={`pj-${id}`} className="pj-chapter__title">
            {title}
          </h2>
          {text && <p className="pj-chapter__text">{text}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
