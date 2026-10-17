import type { IconName } from "@/data/content";

const paths: Record<IconName, React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  pen: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />,
  code: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  cursor: <path d="M5 3l14 7-6 2-2 6L5 3z" />,
  cart: (
    <>
      <path d="M3 4h2l2.5 11h11L21 7H7" />
      <circle cx="9" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </>
  ),
  app: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7z" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />,
  plug: <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </>
  ),
  scale: <path d="M4 20l16-16M14 4h6v6M4 14v6h6" />,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
