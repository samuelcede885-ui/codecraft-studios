import type { Metadata, Viewport } from "next";
import { Anton, Inter, Lato, Oswald } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { AnalyticsClicks } from "@/components/analytics/AnalyticsClicks";

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

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } } : {}),
  title: { default: title, template: "%s | Fary Labs" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title,
    description: site.description,
    // Las imágenes de Open Graph necesitan URL absoluta: solo con dominio definido.
    ...(site.url ? { images: [{ url: "/projects/gramercy/thumb.webp", width: 1600, height: 900, alt: "Gramercy, concepto de e-commerce de Fary Labs" }] } : {}),
  },
  twitter: { card: "summary_large_image", title, description: site.description },
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
      </head>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
        <AnalyticsClicks />
      </body>
    </html>
  );
}
