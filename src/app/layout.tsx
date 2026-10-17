import type { Metadata, Viewport } from "next";
import { Inter_Tight, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  title: "Fary Labs — Transformamos ideas en productos digitales",
  description:
    "Estudio digital: desarrollo web, aplicaciones a medida y agentes de inteligencia artificial para empresas y emprendedores.",
};

export const viewport: Viewport = {
  themeColor: "#f4f4f5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
