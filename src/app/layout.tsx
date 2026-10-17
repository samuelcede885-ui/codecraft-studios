import type { Metadata, Viewport } from "next";
import { Anton, Inter, Lato, Oswald } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

// Tipografías de marca: Lato en pesos altos para titulares e Inter para texto e interfaces.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-display", display: "swap" });
// Tipografías de la tienda Gramercy que se ve dentro de la laptop.
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-gm-display", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-gm-ui", display: "swap" });

// Antes del primer pintado: guarda el instante de inicio de la intro y la omite si ya se vio
// en esta sesión o si se pide menos movimiento.
const introScript = `window.__faryIntroT0=performance.now();try{if(sessionStorage.getItem("fary-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

const title = "Fary Labs — Transformamos ideas en productos digitales";

// Canonical, imagen social absoluta y sitemap dependen del dominio (NEXT_PUBLIC_SITE_URL).
export const metadata: Metadata = {
  title,
  description: site.description,
  applicationName: "Fary Labs",
  ...(site.url && { metadataBase: new URL(site.url), alternates: { canonical: "/" } }),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Fary Labs",
    title,
    description: site.description,
    ...(site.url && { url: "/", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Fary Labs" }] }),
  },
  twitter: {
    card: site.url ? "summary_large_image" : "summary",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${lato.variable} ${anton.variable} ${oswald.variable}`}
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
