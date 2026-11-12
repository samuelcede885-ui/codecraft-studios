/**
 * Paleta oficial (HEX exactos del manual de marca) y las cinco escenas del hero.
 * Cada cookie ocupa uno de los cinco colores de NOA: no se usan colores fuera
 * del manual.
 */
export const palette = {
  orange: '#F2B052', // NOA Orange — color principal
  navy: '#112951', // Midnight Navy — contraste y tipografía
  butter: '#F2BB40', // Butter — acento
  choco: '#5A3A22', // Choco — acento
  dough: '#FFF6E8', // Dough — fondo
}

const { orange, navy, butter, choco, dough } = palette

/** Fuente del titular gigante: se precarga para que no cambie de tamaño al llegar. */
export const preloadFont = 'oswald-latin-wght-normal'

/** Ajustes de la versión para compartir como artefacto (npm run build:artifact). */
export const artifact = {
  title: 'Propuesta NOA Cookies',
  file: 'propuesta-noa-cookies.html',
  googleFonts: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Poppins:wght@400;500;600&display=swap',
  /** Paleta y fuentes al inicio de la página (allí las fuentes las sirve Google). */
  rootCss: [
    `--color-noa-orange: ${orange.toLowerCase()};`,
    `--color-navy: ${navy.toLowerCase()};`,
    `--color-butter: ${butter.toLowerCase()};`,
    `--color-choco: ${choco.toLowerCase()};`,
    `--color-dough: ${dough.toLowerCase()};`,
    '--color-danger: #b3261e;',
    '--font-display: "Oswald", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;',
    '--font-sans: "Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;',
  ],
  /** Color del lienzo bajo la página: el del footer, para que el final no muestre otro tono. */
  canvas: 'var(--accent)',
}

/**
 * bg: fondo de la escena · title: titular gigante detrás de la cookie
 * fg: texto de interfaz · label: etiqueta del nombre · cta: botón principal
 * sticker: precio
 */
export const heroThemes = {
  navy: {
    bg: navy, title: orange, fg: dough,
    labelBg: orange, labelFg: navy,
    ctaBg: orange, ctaFg: navy,
    stickerBg: butter, stickerFg: navy,
  },
  orange: {
    bg: orange, title: dough, fg: navy,
    labelBg: navy, labelFg: dough,
    ctaBg: navy, ctaFg: dough,
    stickerBg: navy, stickerFg: butter,
  },
  butter: {
    bg: butter, title: navy, fg: navy,
    labelBg: navy, labelFg: dough,
    ctaBg: navy, ctaFg: dough,
    stickerBg: navy, stickerFg: butter,
  },
  choco: {
    bg: choco, title: butter, fg: dough,
    labelBg: butter, labelFg: navy,
    ctaBg: orange, ctaFg: navy,
    stickerBg: butter, stickerFg: navy,
  },
  dough: {
    bg: dough, title: orange, fg: navy,
    labelBg: navy, labelFg: dough,
    ctaBg: navy, ctaFg: dough,
    stickerBg: navy, stickerFg: butter,
  },
}
