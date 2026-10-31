import type { ScreenId } from "./screens";

/**
 * Etapas del hero, en segundos del video que se reproduce dentro de la laptop: el recorrido por
 * Bunzo Burgers, concepto de restaurante (public/projects/bunzo/hero.*, scripts/record-hero-bunzo.mjs).
 * Es la única fuente de los tiempos: los textos sincronizados leen de aquí, y la bobina de Gramercy
 * (src/components/reel, portafolio) reutiliza los mismos tiempos con sus pantallas (`screen`).
 * Si se cambia un tiempo, hay que volver a grabar ambos videos.
 */
export type HeroStage = {
  /** "" en la etapa de apertura (sin número). */
  id: string;
  start: number;
  end: number;
  /** Pantalla de Gramercy en su bobina del portafolio (mismos tiempos). */
  screen: ScreenId;
  eyebrow: string;
  /** Etiqueta editorial discreta sobre la laptop ("" en la apertura). */
  tag: string;
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
    tag: "",
    title: "Transformamos ideas en productos digitales.",
    description: "Diseño, desarrollo y automatización para que la tecnología impulse tu negocio.",
  },
  {
    id: "01",
    start: 3,
    end: 7.6,
    screen: "home",
    eyebrow: "Concepto",
    tag: "Idea → Experience",
    title: "Ideas que cobran vida.",
    description: "Convertimos ideas en experiencias digitales claras y memorables.",
  },
  {
    id: "02",
    start: 7.6,
    end: 12.6,
    screen: "product",
    eyebrow: "Producto",
    tag: "UI / UX",
    title: "Diseño que convierte.",
    description: "Interfaces pensadas para destacar el producto y facilitar la decisión.",
  },
  {
    id: "03",
    start: 12.6,
    end: 17.6,
    screen: "cart",
    eyebrow: "Conversión",
    tag: "Commerce",
    title: "Interfaces creadas para vender.",
    description: "Experiencias de compra simples, rápidas y sin fricción.",
  },
  {
    id: "04",
    start: 17.6,
    end: 22.4,
    screen: "payment",
    eyebrow: "Experiencia",
    tag: "Motion",
    title: "Experiencias que se sienten vivas.",
    description: "Animación, ritmo y detalle al servicio de tu producto.",
  },
  {
    id: "05",
    start: 22.4,
    end: 28.2,
    screen: "dashboard",
    eyebrow: "Marca",
    tag: "Brand",
    title: "Marcas que se quedan en la memoria.",
    description: "Identidad, contenido y llamadas a la acción claras para tu negocio.",
  },
];

/**
 * Velocidad de reproducción del recorrido en el hero (1,5 = vuelta de ~19 s; el video ligero va a
 * 20 fps para verse a 30 fps a esta velocidad).
 * Los tiempos de arriba siguen en segundos del video, así que la sincronía no cambia.
 */
export const HERO_SPEED = 1.5;

/** Duración total del video del hero. */
export const HERO_DURATION = heroStages[heroStages.length - 1].end;

/** Etapas numeradas (01–05), para el indicador. */
export const numberedStages = heroStages.filter((s) => s.id);

/** Etapa visible en un instante del video. */
export function stageAt(t: number) {
  const i = heroStages.findIndex((s) => t >= s.start && t < s.end);
  return i === -1 ? heroStages.length - 1 : i;
}
