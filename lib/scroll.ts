import type Lenis from "lenis";

// Pequeño store compartido entre el showcase (que conoce la línea de tiempo),
// el scroll suave (Lenis) y la navegación (que necesita saltar a una escena).

type Resolver = (target: string) => number | null;
type Listener = () => void;

let lenis: Lenis | null = null;
let resolver: Resolver | null = null;
let active = "hero";
const listeners = new Set<Listener>();

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function setTargetResolver(fn: Resolver | null) {
  resolver = fn;
}

export function setActiveSection(id: string) {
  if (id === active) return;
  active = id;
  listeners.forEach((l) => l());
}

export function subscribeActiveSection(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getActiveSection = () => active;
export const getServerActiveSection = () => "hero";

export function scrollToTarget(target: string) {
  let y = resolver?.(target) ?? null;
  if (y === null) {
    const el = document.getElementById(target);
    if (!el) return false;
    y = el.getBoundingClientRect().top + window.scrollY;
  }
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.6 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  return true;
}
