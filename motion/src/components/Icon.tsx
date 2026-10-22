/** Iconos lineales propios (SVG): no dependen de emojis ni de glifos de la fuente. */
export type IconName = "chat" | "email" | "web" | "social" | "calendar" | "sheet" | "notes" | "check" | "arrow";

export function Icon({ name, size = 28, color = "currentColor", stroke = 2.4 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {name === "chat" && <path {...p} d="M4 5h16v11H9l-5 4z" />}
      {name === "email" && (
        <>
          <rect {...p} x={3} y={5} width={18} height={14} rx={2} />
          <path {...p} d="M3.5 6.5 12 13l8.5-6.5" />
        </>
      )}
      {name === "web" && (
        <>
          <circle {...p} cx={12} cy={12} r={9} />
          <path {...p} d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
        </>
      )}
      {name === "social" && (
        <>
          <circle {...p} cx={12} cy={12} r={3.6} />
          <path {...p} d="M15.6 12v1.6a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.4 6.9" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect {...p} x={3.5} y={5} width={17} height={15} rx={2} />
          <path {...p} d="M3.5 10h17M8 3v4M16 3v4" />
        </>
      )}
      {name === "sheet" && (
        <>
          <rect {...p} x={3.5} y={4} width={17} height={16} rx={2} />
          <path {...p} d="M3.5 9.5h17M3.5 15h17M10 4v16" />
        </>
      )}
      {name === "notes" && <path {...p} d="M5 19l1-4L16 5l3 3L9 18zM14 7l3 3" />}
      {name === "check" && <path {...p} d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === "arrow" && <path {...p} d="M4 12h15M13 6l6 6-6 6" />}
    </svg>
  );
}
