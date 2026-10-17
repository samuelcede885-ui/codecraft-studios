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

    // Inercia corta: suaviza la rueda sin dejar la página "atrasada" respecto al gesto.
    const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 0.9, anchors: { offset: 0 } });
    const raf = (time: number) => lenis.raf(time * 1000);

    // Durante la intro el scroll queda quieto; se libera al terminar.
    const resume = () => lenis.start();
    if (!window.__faryIntroDone && !document.documentElement.classList.contains("intro-seen")) lenis.stop();
    window.addEventListener("fary:intro-done", resume);
    // Menú móvil abierto: el fondo no se desplaza.
    const onLock = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
    window.addEventListener("fary:scroll-lock", onLock);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("fary:intro-done", resume);
      window.removeEventListener("fary:scroll-lock", onLock);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
