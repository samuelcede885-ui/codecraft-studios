"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/config/site";

const labels: Record<string, string> = { ver: "Ver", play: "Play" };

/**
 * Cursor contextual muy sutil, solo con ratón: sobre un elemento con data-cursor="ver" | "play"
 * aparece un círculo con la palabra. El cursor del sistema no se oculta nunca.
 * Se desactiva con site.contextCursor = false, en táctil y con movimiento reducido.
 */
export function ContextCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok =
      site.contextCursor &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    const el = dot.current;
    if (!enabled || !el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let current = "";
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const next = target ? (labels[target.dataset.cursor ?? ""] ?? "") : "";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const leave = () => {
      current = "";
      setLabel("");
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={dot} className={`ctx-cursor ${label ? "is-on" : ""}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
