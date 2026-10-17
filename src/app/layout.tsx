import type { Metadata, Viewport } from "next";
import { Anton, Inter_Tight, Oswald, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-brand", display: "swap" });
// Tipografías de la tienda Gramercy que se ve dentro de la laptop.
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-gm-display", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-gm-ui", display: "swap" });

// Antes del primer pintado: guarda el instante de inicio de la intro y la omite si ya se vio
// en esta sesión o si se pide menos movimiento.
const introScript = `window.__faryIntroT0=performance.now();try{if(sessionStorage.getItem("fary-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export const metadata: Metadata = {
  title: "Fary Labs — Transformamos ideas en productos digitales",
  description:
    "Estudio digital: desarrollo web, aplicaciones a medida y agentes de inteligencia artificial para empresas y emprendedores.",
};

export const viewport: Viewport = {
  themeColor: "#f3f3f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${sora.variable} ${anton.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        {/* Imágenes de la historia de la laptop: listas antes de que empiece la secuencia. */}
        <link rel="preload" as="image" href="/projects/gramercy-shoe-clean.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/projects/gramercy-shoe.webp" />
        <link rel="preload" as="image" href="/projects/gramercy-logo.webp" />
      </head>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
