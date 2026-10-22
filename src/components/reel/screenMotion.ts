import type gsap from "gsap";

type TL = gsap.core.Timeline;

export const gm = (root: Element, name: string) => [...root.querySelectorAll<HTMLElement>(`[data-gm="${name}"]`)];

/**
 * Lo que ocurre dentro de cada pantalla de Gramercy al aparecer, recreado del vídeo de la app.
 * Todo cabe en ~1,4 unidades de la línea de tiempo para terminar antes del siguiente paso.
 * `at` es la posición absoluta en la línea de tiempo.
 */
export function enterScreen(tl: TL, screen: HTMLElement, at: number) {
  const shoe = gm(screen, "shoe");
  const panel = gm(screen, "panel");
  const items = gm(screen, "item");

  // El zueco se asienta y el panel sube como una hoja; su contenido entra escalonado.
  // El zueco ya es visible al entrar la página (solo se asienta), para que nunca se vea vacía.
  if (panel.length) {
    tl.fromTo(shoe, { yPercent: -3, scale: 0.98 }, { yPercent: 0, scale: 1, duration: 0.6, ease: "power3.out" }, at)
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: "power3.out" }, at + 0.1)
      .fromTo(items, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }, at + 0.35);
  }

  // Ficha: la barra de stock se llena y la cantidad sube de 1 a 3, como al pulsar "+".
  const fill = gm(screen, "fill");
  const qty = gm(screen, "qty")[0];
  if (fill.length) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, at + 0.55);
  if (qty) {
    const q = { v: 1 };
    tl.fromTo(
      q,
      { v: 1 },
      { v: 3, duration: 0.5, ease: "steps(2)", onUpdate: () => (qty.textContent = String(Math.round(q.v))) },
      at + 0.8,
    );
  }

  // Carrito: entra la columna, aviso de "agregado", la talla pasa de 42 a 41 y se escribe la dirección.
  const left = gm(screen, "left");
  if (left.length) {
    tl.fromTo(left, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }, at);
    const toast = gm(screen, "toast");
    tl.fromTo(toast, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, at + 0.5).to(
      toast,
      { autoAlpha: 0, y: -4, duration: 0.2 },
      at + 1.05,
    );
    const sizes = gm(screen, "size");
    const pick = { i: 5 };
    tl.fromTo(
      pick,
      { i: 5 },
      {
        i: 4,
        duration: 0.2,
        ease: "steps(1)",
        onUpdate: () => sizes.forEach((el, n) => el.classList.toggle("is-on", n === Math.round(pick.i))),
      },
      at + 0.6,
    );
    const typed = gm(screen, "typed")[0];
    if (typed) {
      const text = typed.dataset.text ?? "";
      const t = { n: 0 };
      tl.fromTo(
        t,
        { n: 0 },
        { n: text.length, duration: 0.55, ease: "none", onUpdate: () => (typed.textContent = text.slice(0, Math.round(t.n))) },
        at + 0.6,
      );
    }
  }

  // Producto: "ADD TO CART" se destaca una vez, con un pulso mínimo.
  const cta = gm(screen, "cta");
  if (cta.length)
    tl.fromTo(cta, { scale: 1 }, { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, at + 1.05);

  // Pago: los métodos entran uno tras otro y después se resaltan en secuencia.
  const rows = gm(screen, "row");
  if (rows.length) {
    tl.fromTo(rows, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power3.out" }, at + 0.45);
    gm(screen, "hl").forEach((hl, i) => {
      const t = at + 0.85 + i * 0.2;
      tl.fromTo(hl, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, t).to(
        hl,
        { opacity: 0, duration: 0.12, ease: "none" },
        t + 0.2,
      );
    });
  }

  // Panel: las líneas se dibujan y las barras crecen.
  const lines = gm(screen, "line");
  if (lines.length) {
    // Las líneas se "dibujan" de izquierda a derecha con un recorte (el trazo no se deforma).
    tl.fromTo(
      lines,
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, stagger: 0.1, ease: "power2.out" },
      at + 0.2,
    );
    tl.fromTo(
      gm(screen, "bar"),
      { scaleY: 0 },
      { scaleY: 1, duration: 0.5, stagger: 0.03, ease: "power2.out", transformOrigin: "50% 100%" },
      at + 0.25,
    );
  }
}
