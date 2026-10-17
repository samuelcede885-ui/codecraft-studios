"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navItems } from "@/data/site";
import {
  getActiveSection,
  getServerActiveSection,
  scrollToTarget,
  subscribeActiveSection,
} from "@/lib/scroll";

// Qué elemento del menú se marca para cada etiqueta de la línea de tiempo.
const activeNav: Record<string, string> = {
  hero: "hero",
  s1: "s1",
  s2: "s2",
  s3: "s2",
  s4: "s4",
  s5: "s4",
  contacto: "contacto",
};

export default function Header() {
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, getServerActiveSection);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToTarget(target)) e.preventDefault();
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-white/75 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <a href="#inicio" onClick={go("hero")} aria-label="Fary Labs, ir al inicio">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-10 text-[0.92rem] font-medium">
            {navItems.map((item) => {
              const isActive = activeNav[active] === item.target;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={go(item.target)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-black after:transition-transform after:duration-500 ${
                      isActive ? "text-black after:scale-x-100" : "text-neutral-500 hover:text-black after:scale-x-0"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contacto" onClick={go("contacto")} className="btn-dark hidden sm:inline-flex">
            Comenzar proyecto <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-black/10 bg-white/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Principal móvil"
        hidden={!open}
        className="border-t border-black/5 px-5 pb-6 pt-2 sm:px-8 lg:hidden"
      >
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={go(item.target)}
                className="block border-b border-black/5 py-4 text-lg font-semibold tracking-tight"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contacto" onClick={go("contacto")} className="btn-dark mt-5 w-full justify-center sm:hidden">
          Comenzar proyecto <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
