import { site } from "@/data/site";

type Props = { tone?: "dark" | "light"; className?: string };

// Logo provisional que imita el de referencia (doble chevrón + «Fary labs»).
// Se sustituye automáticamente cuando se define `site.logoSrc`.
export default function Logo({ tone = "dark", className = "" }: Props) {
  const src = tone === "light" ? site.logoSrcOnDark ?? site.logoSrc : site.logoSrc;
  if (src) {
    return <img src={src} alt={site.name} className={`h-9 w-auto ${className}`} />;
  }

  const ink = tone === "light" ? "#ffffff" : "#0a0a0a";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label={site.name} role="img">
      <svg viewBox="0 0 48 40" className="h-8 w-auto" aria-hidden="true">
        <path d="M0 0h13l13 20-13 20H0l13-20z" fill={ink} />
        <path d="M18 0h13l13 20-13 20H18l13-20z" fill={ink} opacity="0.9" />
      </svg>
      <span className="flex flex-col leading-none" style={{ color: ink }}>
        <span className="text-[1.55rem] font-extrabold tracking-[-0.04em]">Fary</span>
        <span className="mt-0.5 flex items-center gap-1 self-end text-[0.62rem] font-medium tracking-[0.18em]">
          <span className="h-px w-5" style={{ background: ink }} />
          labs
        </span>
      </span>
    </span>
  );
}
