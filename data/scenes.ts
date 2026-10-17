import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Bot,
  Code,
  Layers,
  LayoutTemplate,
  Monitor,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  PenTool,
  Plug,
  Rocket,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export type ScreenId = "greenade" | "simply-milk" | "syntha-6" | "depthfield" | "dashboard";

// Cómo entra la pantalla de esta escena: subida suave, cortinilla lateral, fundido o máscara.
export type ScreenTransition = "rise" | "wipe" | "fade" | "mask";

export type Feature = { icon: LucideIcon; label: string };

export type Scene = {
  id: "s1" | "s2" | "s3" | "s4" | "s5";
  number: string;
  project: string;
  screen: ScreenId;
  // Ruta en /public de la captura original del proyecto. Si se define, sustituye a la pantalla demo.
  image?: string;
  imageAlt: string;
  accent: string;
  transition: ScreenTransition;
  title: string;
  description?: string;
  features: Feature[];
  cta?: { label: string };
  // Los proyectos aún no confirmados como trabajo de Fary Labs se marcan como demo.
  isDemo: boolean;
};

export const hero = {
  title: "Transformamos ideas en productos digitales.",
  description: "Diseño, desarrollo y automatización para llevar tu negocio al siguiente nivel.",
  cta: "Comenzar proyecto",
  sideTitle: "Ideas que cobran vida.",
  sideFeatures: [
    { icon: Target, label: "Estrategia" },
    { icon: PenTool, label: "Diseño" },
    { icon: Code, label: "Desarrollo" },
    { icon: TrendingUp, label: "Resultados" },
  ] satisfies Feature[],
};

export const scenes: Scene[] = [
  {
    id: "s1",
    number: "01",
    project: "GREENADE",
    screen: "greenade",
    imageAlt: "Web demo de GREENADE: granada verde y titular «GREENADE!» sobre fondo verde",
    accent: "#3fae2a",
    transition: "rise",
    title: "Diseño web que impacta.",
    description: "Creamos experiencias digitales modernas y enfocadas en resultados.",
    features: [
      { icon: Monitor, label: "Sitios web profesionales" },
      { icon: LayoutTemplate, label: "Landing pages" },
      { icon: ShoppingBag, label: "E-commerce" },
    ],
    isDemo: true,
  },
  {
    id: "s2",
    number: "02",
    project: "SIMPLY MILK",
    screen: "simply-milk",
    imageAlt: "Web demo de SIMPLY MILK: botella de leche orgánica junto a cocos",
    accent: "#7fb0cf",
    transition: "rise",
    title: "Diseños que cuentan historias.",
    description: "Convertimos conceptos en experiencias digitales reales y funcionales.",
    features: [
      { icon: Palette, label: "Identidad visual" },
      { icon: MousePointerClick, label: "Experiencias interactivas" },
      { icon: Smartphone, label: "Diseño responsive" },
    ],
    isDemo: true,
  },
  {
    id: "s3",
    number: "03",
    project: "SYNTHA-6",
    screen: "syntha-6",
    imageAlt: "Web demo de SYNTHA-6: tienda de proteínas con panel rojo y tarjetas de producto",
    accent: "#e1251b",
    transition: "wipe",
    title: "Experiencias digitales a medida.",
    description: "Convertimos tus ideas en aplicaciones funcionales, escalables y fáciles de usar.",
    features: [
      { icon: AppWindow, label: "Aplicaciones web" },
      { icon: Layers, label: "Plataformas digitales" },
      { icon: PanelsTopLeft, label: "Interfaces personalizadas" },
    ],
    isDemo: true,
  },
  {
    id: "s4",
    number: "04",
    project: "DEPTHFIELD",
    screen: "depthfield",
    imageAlt: "Web demo de DEPTHFIELD: silueta frente a un sol rojo y la palabra «FORM»",
    accent: "#ff3b1f",
    transition: "fade",
    title: "Tecnología que impulsa.",
    description: "Integramos inteligencia artificial y automatizaciones en tu negocio.",
    features: [
      { icon: Bot, label: "Automatización con IA" },
      { icon: Plug, label: "Integraciones" },
      { icon: Sparkles, label: "Soluciones inteligentes" },
    ],
    isDemo: true,
  },
  {
    id: "s5",
    number: "05",
    project: "FARY DASHBOARD",
    screen: "dashboard",
    imageAlt: "Dashboard conceptual de Fary Labs con métricas de ejemplo",
    accent: "#3b6cf6",
    transition: "mask",
    title: "Construimos el futuro digital.",
    description: "Diseñamos soluciones que generan crecimiento y métricas que importan.",
    features: [
      { icon: PenTool, label: "Diseño" },
      { icon: Code, label: "Desarrollo" },
      { icon: Rocket, label: "Innovación" },
    ],
    cta: { label: "Comenzar proyecto" },
    isDemo: false,
  },
];
