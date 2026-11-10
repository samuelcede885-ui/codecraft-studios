const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  left: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  right: <path d="M9.5 5.5L16 12l-6.5 6.5" />,
  bag: (
    <>
      <path d="M5.5 8.5h13l-1 11h-11z" />
      <path d="M9 8.5V7a3 3 0 016 0v1.5" />
    </>
  ),
  info: (
    <>
      <path d="M12 11v6" />
      <path d="M12 7.2v.1" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7.5h14M10 7.5V5.5h4v2M7 7.5l.8 11h8.4l.8-11" />
    </>
  ),
}

/** Iconos de trazo propios (24 px, trazo redondo). Siempre decorativos: el texto va en el botón. */
export function Icon({ name, size = 24, strokeWidth = 2.2, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
