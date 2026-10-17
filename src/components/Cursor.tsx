"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Cursor de acompañamiento, solo en escritorio con ratón y sin movimiento reducido.
 * No sustituye al cursor del sistema: aparece únicamente como "Ver proyecto" sobre
 * los proyectos y como una flecha pequeña sobre los botones.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!node || !ok.matches) return;

    const x = gsap.quickTo(node, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(node, "y", { duration: 0.35, ease: "power3.out" });
    let state = "";

    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const next = t.closest('[data-cursor="project"]')
        ? "project"
        : t.closest(".btn, .link-arrow, .service__cta")
          ? "arrow"
          : "";
      if (next === state) return;
      state = next;
      node.dataset.state = next;
      node.classList.toggle("is-dark", !!t.closest(".final"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div className="cursor" ref={el} aria-hidden="true">
      <span className="cursor__label cursor__label--project">Ver proyecto</span>
      <span className="cursor__label cursor__label--arrow">→</span>
    </div>
  );
}
