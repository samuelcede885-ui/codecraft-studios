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

/**
 * bg: fondo de la escena · title: titular gigante detrás de la cookie
 * fg: texto de interfaz · label: etiqueta del nombre · cta: botón principal
 * sticker: precio · logoRing: aro del logo (el manual lo pide blanco sobre amarillo)
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
    logoRing: dough,
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
