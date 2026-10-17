"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll suave con Lenis sincronizado con el ticker de GSAP, para que la
 * secuencia fija avance sin saltos. En táctil se mantiene el scroll nativo
 * y con prefers-reduced-motion no se activa.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: 0 },
    });
    const raf = (time: number) => lenis.raf(time * 1000);

    // Durante la intro el scroll queda quieto; se libera al terminar.
    const resume = () => lenis.start();
    if (!window.__faryIntroDone && !document.documentElement.classList.contains("intro-seen")) lenis.stop();
    window.addEventListener("fary:intro-done", resume);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("fary:intro-done", resume);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
