"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { Logo } from "./Logo";
import { ArrowRight } from "./Icon";

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "pending" } | { kind: "sent" };

const { email, whatsapp, instagram } = site.contact;

/** Canales del cierre. Sin dato configurado se muestran como "próximamente", nunca con un enlace inventado. */
const channels = [
  { label: "Instagram", href: instagram ? `https://instagram.com/${instagram}` : "" },
  { label: "WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}` : "" },
  { label: "Email", href: email ? `mailto:${email}` : "" },
];

/** Cierre de la página: llamada a la acción, formulario de proyecto y canales. Sustituye al footer. */
export function FinalCTA() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus({ kind: "error", message: "Revisa los campos marcados." });
      return;
    }
    const data = new FormData(form);
    if (!email) {
      // Sin destino configurado no se simula un envío.
      setStatus({ kind: "pending" });
      return;
    }
    const body = [
      `Nombre: ${data.get("name")}`,
      `Empresa: ${data.get("company") || "-"}`,
      `Correo: ${data.get("email")}`,
      `Servicio: ${data.get("service")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `Nuevo proyecto — ${data.get("service")}`,
    )}&body=${encodeURIComponent(body)}`;
    setStatus({ kind: "sent" });
  }

  return (
    <section id="contacto" className="final" aria-labelledby="final-title">
      <div className="container final__intro" data-reveal>
        <Logo className="logo--light final__logo" />
        <h2 id="final-title" className="final__title">
          Hagamos algo que valga la pena recordar.
        </h2>
        <p className="final__sub">Cuéntanos tu idea y construyamos lo próximo.</p>
        <a href="#formulario" className="btn btn--light">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>

      <div className="container final__body">
        <form id="formulario" className="form" noValidate onSubmit={onSubmit} data-reveal aria-label="Cuéntanos tu proyecto">
          <div className="form__row">
            <label className="field">
              <span>Nombre</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label className="field">
              <span>
                Empresa <em>(opcional)</em>
              </span>
              <input name="company" autoComplete="organization" />
            </label>
          </div>
          <div className="form__row">
            <label className="field">
              <span>Correo electrónico</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>Servicio</span>
              <select name="service" required defaultValue="">
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                {services.map((s) => (
                  <option key={s.id} value={`${s.name} — ${s.kind}`}>
                    {s.name} — {s.kind}
                  </option>
                ))}
                <option value="Otro">Otro / aún no lo sé</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Descripción del proyecto</span>
            <textarea name="message" rows={4} required minLength={10} />
          </label>

          <div className="form__footer">
            <button type="submit" className="btn btn--light">
              Enviar solicitud <ArrowRight className="btn__arrow" />
            </button>
            <p className="form__status" role="status" aria-live="polite">
              {status.kind === "error" && status.message}
              {status.kind === "pending" &&
                "Gracias. El envío del formulario aún no está configurado: pronto publicaremos nuestros canales de contacto."}
              {status.kind === "sent" && "Abrimos tu correo con la solicitud lista para enviar."}
            </p>
          </div>
        </form>
      </div>

      <div className="container final__foot">
        <ul className="final__channels">
          {channels.map((c) =>
            c.href ? (
              <li key={c.label}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {c.label}
                </a>
              </li>
            ) : (
              <li key={c.label} className="is-pending">
                {c.label} <small>próximamente</small>
              </li>
            ),
          )}
        </ul>
        <p className="final__copy">© {new Date().getFullYear()} Fary Labs</p>
      </div>
    </section>
  );
}
