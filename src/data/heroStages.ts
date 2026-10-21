import type { ScreenId } from "./screens";

/**
 * Etapas del hero, en segundos del video que se reproduce dentro de la laptop
 * (public/projects/gramercy/full.mp4). Es la única fuente de los tiempos: la bobina
 * que graba el video (src/components/reel) y los textos sincronizados leen de aquí.
 * Si se cambia un tiempo, hay que volver a grabar el video (scripts/record-reels.mjs).
 */
export type HeroStage = {
  /** "" en la etapa de apertura (sin número). */
  id: string;
  start: number;
  end: number;
  /** Pantalla de Gramercy que muestra el video en esta etapa. */
  screen: ScreenId;
  eyebrow: string;
  title: string;
  description: string;
};

export const heroStages: HeroStage[] = [
  {
    id: "",
    start: 0,
    end: 3,
    screen: "home",
    eyebrow: "",
    title: "Transformamos ideas en productos digitales.",
    description: "Diseño, desarrollo y automatización para que la tecnología impulse tu negocio.",
  },
  {
    id: "01",
    start: 3,
    end: 7.6,
    screen: "home",
    eyebrow: "Concepto",
    title: "Ideas que cobran vida.",
    description: "Convertimos ideas en experiencias digitales claras y memorables.",
  },
  {
    id: "02",
    start: 7.6,
    end: 12.6,
    screen: "product",
    eyebrow: "Producto",
    title: "Diseño que convierte.",
    description: "Interfaces pensadas para destacar el producto y facilitar la decisión.",
  },
  {
    id: "03",
    start: 12.6,
    end: 17.6,
    screen: "cart",
    eyebrow: "Conversión",
    title: "Interfaces creadas para vender.",
    description: "Experiencias de compra simples, rápidas y sin fricción.",
  },
  {
    id: "04",
    start: 17.6,
    end: 22.4,
    screen: "payment",
    eyebrow: "Tecnología",
    title: "Tecnología que hace que todo funcione.",
    description: "Pagos, integraciones y automatización trabajando juntos.",
  },
  {
    id: "05",
    start: 22.4,
    end: 28.2,
    screen: "dashboard",
    eyebrow: "Resultados",
    title: "Datos que impulsan decisiones.",
    description: "Soluciones diseñadas para medir, aprender y crecer.",
  },
];

/** Duración total del video del hero. */
export const HERO_DURATION = heroStages[heroStages.length - 1].end;

/** Etapas numeradas (01–05), para el indicador. */
export const numberedStages = heroStages.filter((s) => s.id);

/** Etapa visible en un instante del video. */
export function stageAt(t: number) {
  const i = heroStages.findIndex((s) => t >= s.start && t < s.end);
  return i === -1 ? heroStages.length - 1 : i;
}
