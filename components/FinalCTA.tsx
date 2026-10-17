import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { contactHref, site } from "@/data/site";

// Elemento 3D discreto: chevrón metálico construido con gradientes en SVG.
function ChromeArrow() {
  return (
    <svg viewBox="0 0 320 300" className="chrome-arrow" aria-hidden="true">
      <defs>
        <linearGradient id="chrome-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="0.35" stopColor="#8a8a8a" />
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#5a5a5a" />
          <stop offset="1" stopColor="#d6d6d6" />
        </linearGradient>
        <linearGradient id="chrome-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="0.5" stopColor="#9a9a9a" />
          <stop offset="1" stopColor="#1c1c1c" />
        </linearGradient>
      </defs>
      <path d="M40 40h90l120 110-120 110H40l120-110z" fill="url(#chrome-b)" transform="translate(16 18)" />
      <path d="M40 40h90l120 110-120 110H40l120-110z" fill="url(#chrome-a)" />
      <path d="M130 40l120 110-120 110" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_40%,rgba(255,255,255,0.12),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-32">
        <div>
          <Logo tone="light" />
          <span className="mt-12 block h-px w-12 bg-white/40" />
          <h2 className="mt-6 max-w-[14ch] text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-balance">
            ¿Listo para crear lo próximo?
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg text-white/65">
            Hablemos de tu idea y convirtámosla en realidad.
          </p>
          <a href={contactHref} className="btn-light mt-10">
            Comenzar proyecto <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <ChromeArrow />
      </div>
      <footer className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 px-5 py-6 text-sm text-white/45 sm:flex-row sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <a href={contactHref} className="hover:text-white">
            {site.contactEmail}
          </a>
        </div>
      </footer>
    </section>
  );
}
