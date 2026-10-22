import gsap from "gsap";
import { heroStages } from "@/data/heroStages";
import type { ScreenId } from "@/data/screens";
import { enterScreen, gm } from "./screenMotion";

/*
 * Líneas de tiempo de las "bobinas": una navegación simulada por las pantallas HTML,
 * con un cursor que se mueve y hace clic. Se graban a video (scripts/record-reels.mjs)
 * y también se reproducen en vivo como respaldo si un video no puede cargarse.
 * Todas empiezan y terminan en el mismo fotograma, para que el video haga loop sin salto.
 */

export type ReelId = "gramercy" | "panel-de-metricas" | "asistente-de-reservas" | "norte-estudio";

/** Pantallas que monta cada bobina, en orden de capa. */
export const reelScreens: Record<ReelId, ScreenId[]> = {
  gramercy: ["home", "product", "cart", "payment", "dashboard"],
  "panel-de-metricas": ["dashboard"],
  "asistente-de-reservas": ["agent"],
  "norte-estudio": ["studio"],
};

type Ctx = {
  root: HTMLElement;
  layers: HTMLElement[];
  cursor: HTMLElement;
  tl: gsap.core.Timeline;
};

/** Centro de un elemento en % de la bobina (para colocar el cursor). */
function point(root: HTMLElement, el: Element | null | undefined, fx = 0.5, fy = 0.5) {
  if (!el) return { left: "50%", top: "50%" };
  const r = root.getBoundingClientRect();
  const b = el.getBoundingClientRect();
  return {
    left: `${(((b.left + b.width * fx - r.left) / r.width) * 100).toFixed(2)}%`,
    top: `${(((b.top + b.height * fy - r.top) / r.height) * 100).toFixed(2)}%`,
  };
}

function move({ cursor, tl }: Ctx, to: { left: string; top: string }, at: number, dur = 0.7) {
  tl.to(cursor, { ...to, duration: dur, ease: "power2.inOut" }, at);
}

/** Clic: el cursor se hunde un instante y el objetivo responde. */
function click({ cursor, tl }: Ctx, at: number, target?: Element | null) {
  tl.to(cursor, { scale: 0.82, duration: 0.09, ease: "power2.out", yoyo: true, repeat: 1 }, at);
  if (target) tl.to(target, { scale: 0.95, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, at);
}

/** Duración del cambio de página. */
const SWAP = 0.45;

/**
 * Cambio de página, como en una navegación real: la pantalla nueva entra deslizándose y ya opaca
 * por encima, mientras la anterior sigue visible debajo hasta quedar cubierta. Así nunca hay
 * fotogramas lavados (dos pantallas medio transparentes) ni dos pantallas mezcladas.
 */
function swap({ tl, layers }: Ctx, from: number, to: number, at: number) {
  slideIn(tl, layers[to], layers[from], at);
}

function slideIn(tl: gsap.core.Timeline, incoming: HTMLElement, outgoing: HTMLElement, at: number) {
  tl.set(incoming, { zIndex: 3 }, at)
    .set(outgoing, { zIndex: 2 }, at)
    .fromTo(
      incoming,
      { autoAlpha: 1, xPercent: 7, scale: 1 },
      // autoAlpha también en el destino: al saltar en la línea de tiempo (fotos fijas, loop) la
      // pantalla queda visible en cualquier punto posterior.
      { autoAlpha: 1, xPercent: 0, scale: 1, duration: SWAP, ease: "power3.out", immediateRender: false },
      at,
    )
    // Sombra de profundidad mínima en la pantalla que queda debajo, sin desvanecerla.
    .fromTo(outgoing, { xPercent: 0 }, { xPercent: -3, duration: SWAP, ease: "power3.out", immediateRender: false }, at)
    .set(outgoing, { autoAlpha: 0, xPercent: 0, zIndex: 1 }, at + SWAP)
    .set(incoming, { zIndex: 2 }, at + SWAP);
}

const START = { left: "78%", top: "74%" };

function gramercy(ctx: Ctx) {
  const { root, layers, tl } = ctx;
  const [home, product, cart, payment, dashboard] = layers;
  const t = Object.fromEntries(heroStages.filter((s) => s.id).map((s) => [s.screen, s])) as Record<
    string,
    (typeof heroStages)[number]
  >;
  const q = (el: HTMLElement, sel: string) => el.querySelector(sel);

  // Puntos medidos antes de animar nada.
  const order = point(root, q(home, ".gm-home__order"));
  const plus = point(root, q(product, ".gm-qty"), 0.85);
  const addToCart = point(root, q(product, ".gm-product__cta"));
  const sizes = product && cart ? cart.querySelectorAll(".gm-sizes > span") : [];
  const size41 = point(root, sizes[4]);
  const address = point(root, q(cart, ".gm-address"), 0.4);
  const pay = point(root, q(cart, ".gm-cart__pay"));
  const pagoMovil = point(root, q(payment, ".gm-method"), 0.3);
  const chartA = point(root, q(dashboard, ".sc-dash__card"), 0.7, 0.7);
  const chartB = point(root, dashboard.querySelectorAll(".sc-dash__card")[1], 0.6, 0.6);

  // Apertura (0–3 s): hay movimiento desde el primer fotograma, para que el video "arranque"
  // justo al terminar la intro: la portada se acerca despacio, el zueco empieza a respirar y
  // el cursor ya se desplaza. Todo parte del mismo estado en que termina el loop.
  tl.fromTo(home, { scale: 1 }, { scale: 1.035, duration: t.home.end - 0.3, ease: "sine.inOut", immediateRender: false }, 0);
  tl.to(gm(home, "shoe"), { yPercent: -2.5, scale: 1.02, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
  move(ctx, { left: "62%", top: "58%" }, 0, 1.4);
  move(ctx, { left: "70%", top: "66%" }, 1.6, 1.2);

  // 01 Concepto: el cursor va a ORDER NOW y entra a la ficha.
  move(ctx, order, t.home.start + 2.6, 0.9);
  click(ctx, t.home.end - 0.55, q(home, ".gm-home__order"));
  swap(ctx, 0, 1, t.home.end - 0.3);

  // 02 Producto: entra la ficha (panel, stock, cantidad, pulso de ADD TO CART).
  enterScreen(tl, product, t.home.end - 0.3);
  move(ctx, plus, t.product.start + 0.5, 0.8);
  click(ctx, t.product.start + 1.3);
  move(ctx, addToCart, t.product.start + 2.4, 0.9);
  click(ctx, t.product.end - 0.55, q(product, ".gm-product__cta"));
  swap(ctx, 1, 2, t.product.end - 0.3);

  // 03 Conversión: talla 41, dirección escrita y PAGAR.
  enterScreen(tl, cart, t.product.end - 0.3);
  move(ctx, size41, t.cart.start + 0.05, 0.5);
  click(ctx, t.cart.start + 0.6);
  move(ctx, address, t.cart.start + 1.2, 0.7);
  move(ctx, pay, t.cart.start + 3.3, 0.8);
  click(ctx, t.cart.end - 0.55, q(cart, ".gm-cart__pay"));
  swap(ctx, 2, 3, t.cart.end - 0.3);

  // 04 Tecnología: los métodos entran, se resaltan en secuencia y se elige Pago Móvil.
  enterScreen(tl, payment, t.cart.end - 0.3);
  move(ctx, pagoMovil, t.payment.start + 1.9, 0.8);
  click(ctx, t.payment.start + 2.8);
  const hl = gm(payment, "hl")[0];
  if (hl) tl.to(hl, { opacity: 1, duration: 0.15, ease: "none" }, t.payment.start + 2.85);
  swap(ctx, 3, 4, t.payment.end - 0.3);

  // 05 Resultados: las gráficas se dibujan y el cursor las recorre.
  enterScreen(tl, dashboard, t.payment.end - 0.3);
  move(ctx, chartA, t.dashboard.start + 1.2, 1.1);
  move(ctx, chartB, t.dashboard.start + 2.8, 1.1);

  // Vuelta a la portada con el mismo cambio de página: termina en el mismo fotograma que el
  // inicio, para que el loop no salte.
  const back = t.dashboard.end - 0.8;
  tl.set(home, { scale: 1 }, back);
  slideIn(tl, home, dashboard, back);
  move(ctx, START, back - 0.1, 0.8);
  tl.set({}, {}, t.dashboard.end);
}

/** Fundido de salida al final de una bobina corta, para que el loop vuelva al inicio limpio. */
function fadeOutAll(tl: gsap.core.Timeline, els: Element[], at: number) {
  tl.to(els, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, at);
}

function panel(ctx: Ctx) {
  const { root, tl } = ctx;
  const screen = ctx.layers[0];
  const lines = gm(screen, "line");
  const bars = gm(screen, "bar");
  const side = [...screen.querySelectorAll<HTMLElement>(".sc-dash__side > span:not(.sc-dash__brand)")];
  const cards = [...screen.querySelectorAll<HTMLElement>(".sc-dash__card")];
  const analytics = point(root, side[1], 0.4);
  tl.fromTo(cards, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.2)
    .fromTo(lines, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.12, ease: "power2.out" }, 0.5)
    .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.03, ease: "power2.out", transformOrigin: "50% 100%" }, 0.6);
  move(ctx, analytics, 2.2, 0.9);
  click(ctx, 3.2, side[1]);
  tl.set(side[0], { className: "" }, 3.25).set(side[1], { className: "is-on" }, 3.25);
  tl.to(lines, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.3, ease: "power2.in" }, 3.3).to(
    lines,
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, stagger: 0.1, ease: "power2.out" },
    3.65,
  );
  move(ctx, point(root, cards[1], 0.6, 0.6), 4.6, 1);
  move(ctx, START, 6.9, 0.9);
  fadeOutAll(tl, cards, 7.3);
  tl.set(side[1], { className: "" }, 7.8).set(side[0], { className: "is-on" }, 7.8).set({}, {}, 8);
}

function agent(ctx: Ctx) {
  const { root, tl } = ctx;
  const screen = ctx.layers[0];
  const msgs = [...screen.querySelectorAll<HTMLElement>(".sc-agent__msgs p")];
  const steps = [...screen.querySelectorAll<HTMLElement>(".sc-agent__flow > span")];
  const input = screen.querySelector<HTMLElement>(".sc-agent__input");
  tl.set([...msgs, ...steps], { autoAlpha: 0 }, 0);
  const times = [0.5, 1.6, 3.0, 4.1];
  msgs.forEach((m, i) => tl.fromTo(m, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, times[i]));
  steps.forEach((s, i) => tl.fromTo(s, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" }, times[i] + 0.35));
  move(ctx, point(root, input, 0.3), 2.1, 0.7);
  click(ctx, 2.85, input);
  move(ctx, point(root, steps[3], 0.4), 4.9, 0.9);
  move(ctx, START, 6.6, 0.9);
  fadeOutAll(tl, [...msgs, ...steps], 7.3);
  tl.set({}, {}, 8);
}

function studio(ctx: Ctx) {
  const { root, tl } = ctx;
  const screen = ctx.layers[0];
  const shapes = [...screen.querySelectorAll<HTMLElement>(".sc-studio__shapes i")];
  const claim = screen.querySelector<HTMLElement>(".sc-studio__claim");
  const title = screen.querySelector<HTMLElement>(".sc-studio__title");
  const nav = [...screen.querySelectorAll<HTMLElement>(".sc-studio__nav span")];
  tl.fromTo(shapes, { yPercent: 100 }, { yPercent: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, 0.3)
    .fromTo(title, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0.6)
    .fromTo(claim, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 1.2);
  move(ctx, point(root, nav[0]), 2.6, 0.8);
  click(ctx, 3.5, nav[0]);
  tl.to(shapes, { yPercent: -6, duration: 1.6, stagger: 0.1, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3.7);
  move(ctx, START, 6.4, 0.9);
  fadeOutAll(tl, [...shapes, claim!, title!].filter(Boolean), 7.3);
  tl.set({}, {}, 8);
}

const builders: Record<ReelId, (ctx: Ctx) => void> = {
  gramercy,
  "panel-de-metricas": panel,
  "asistente-de-reservas": agent,
  "norte-estudio": studio,
};

/** Construye la línea de tiempo (pausada) de una bobina montada en `root`. */
export function buildReel(id: ReelId, root: HTMLElement) {
  const layers = [...root.querySelectorAll<HTMLElement>("[data-reel-layer]")];
  const cursor = root.querySelector<HTMLElement>("[data-reel-cursor]")!;
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  gsap.set(layers, { autoAlpha: (i: number) => (i === 0 ? 1 : 0), zIndex: (i: number) => (i === 0 ? 2 : 1) });
  gsap.set(cursor, { ...START, xPercent: -18, yPercent: -10, scale: 1 });
  builders[id]({ root, layers, cursor, tl });
  return tl;
}
