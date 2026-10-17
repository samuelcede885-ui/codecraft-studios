"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { ArrowRight } from "./Icon";
import { lockScroll } from "@/lib/scroll";

/** Menú móvil a pantalla completa: fondo blanco, opciones que entran desde abajo con un stagger ligero. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: (restoreFocus?: boolean) => void }) {
  const panel = useRef<HTMLDivElement>(null);

  /** Cierra y navega cuando el scroll ya está liberado (con el fondo bloqueado no hay desplazamiento). */
  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    onClose(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: "auto" })),
    );
  }

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    // Foco a la primera opción al abrir; Escape cierra y devuelve el foco al botón.
    const first = panel.current?.querySelector<HTMLElement>("a");
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        // Mantiene el foco dentro del menú mientras está abierto.
        const items = [...panel.current.querySelectorAll<HTMLElement>("a")];
        const toggle = document.querySelector<HTMLElement>(".header__toggle");
        const ring = toggle ? [toggle, ...items] : items;
        const i = ring.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          ring[ring.length - 1].focus();
        } else if (!e.shiftKey && i === ring.length - 1) {
          e.preventDefault();
          ring[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panel}
      className={`mobile-menu ${open ? "is-open" : ""}`}
      aria-label="Menú"
      inert={!open}
    >
      <nav aria-label="Móvil">
        <ol className="mobile-menu__list">
          {site.nav.map((n, i) => (
            <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
              <a href={n.href} onClick={(e) => go(e, n.href)}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mobile-menu__foot" style={{ "--i": site.nav.length } as React.CSSProperties}>
        <a href="#contacto" className="btn btn--dark" onClick={(e) => go(e, "#contacto")}>
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>
    </div>
  );
}
