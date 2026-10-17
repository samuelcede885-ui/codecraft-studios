"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { Logo, LogoMark } from "./Logo";
import { ArrowRight } from "./Icon";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggle.current?.focus();
  }, []);

  return (
    <>
      <header
        className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${
          active === "#contacto" && !open ? "is-dark" : ""
        }`}
      >
        <div className="header__inner">
          <a href="#inicio" className="header__logo" aria-label="Fary Labs, ir al inicio">
            <Logo className="header__firma" />
            <LogoMark className="header__mark" />
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
            ref={toggle}
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
      </header>
      {/* Fuera del header: su backdrop-filter limitaría un hijo fixed al tamaño del header. */}
      <MobileMenu open={open} onClose={close} />
    </>
  );
}
