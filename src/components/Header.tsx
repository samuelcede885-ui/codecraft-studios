"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { ArrowRight } from "./Icon";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = site.nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${
        active === "#contacto" && !open ? "is-dark" : ""
      }`}
    >
      <div className="header__inner">
        <a href="#inicio" className="header__logo" aria-label="Fary Labs, ir al inicio">
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Principal">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} aria-current={active === n.href ? "true" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>

        <a href="#contacto" className="btn btn--dark btn--sm header__cta">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Móvil">
          {site.nav.map((n, i) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contacto" className="btn btn--dark" onClick={() => setOpen(false)}>
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>
    </header>
  );
}
