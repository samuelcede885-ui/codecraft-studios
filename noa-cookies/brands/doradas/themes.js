/**
 * Colores de Doradas y las cinco escenas del hero.
 *
 * No hay manual de marca: los valores se midieron en su perfil público (foto
 * de perfil, portada de la historia "Menú" y sus publicaciones), convertidos de
 * Display P3 —el espacio de color de las capturas de iPhone— a sRGB.
 */
export const palette = {
  chocolate: '#4B2D23', // fondo de su logo
  dorado: '#DEBA6C', // letras de su logo
  miel: '#E5B95C', // portada de la historia "Menú"
  arena: '#C9AF80', // fondo de su publicación "minimalista, no simple"
  crema: '#FAF6EE', // papel: el blanco de su menú, un punto más cálido
  espresso: '#2E1C15', // el chocolate de su logo, más profundo
}

const { chocolate, dorado, arena, crema, espresso } = palette

/** Fuente del titular gigante: se precarga para que no cambie de tamaño al llegar. */
export const preloadFont = 'archivo-black-latin-400-normal'

/** Ajustes de la versión para compartir como artefacto (npm run doradas:artifact). */
export const artifact = {
  title: 'Propuesta Doradas',
  file: 'propuesta-doradas.html',
  googleFonts:
    'https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Crimson+Pro:wght@400;500;600&display=swap',
  rootCss: [
    `--dr-chocolate: ${chocolate.toLowerCase()};`,
    `--dr-dorado: ${dorado.toLowerCase()};`,
    `--dr-arena: ${arena.toLowerCase()};`,
    `--dr-crema: ${crema.toLowerCase()};`,
    `--dr-espresso: ${espresso.toLowerCase()};`,
  ],
  /** Color del lienzo bajo la página: el del footer. */
  canvas: 'var(--accent)',
}

/**
 * bg: fondo de la escena · title: titular gigante detrás de la cookie
 * fg: texto de interfaz · label: etiqueta del nombre · cta: botón principal
 * sticker: precio (Doradas no publica precios: no se muestra)
 * logo (opcional): color de la marca en la cabecera
 *
 * Como su logo: dorado sobre chocolate, y chocolate sobre los tonos claros.
 */
export const heroThemes = {
  chocolate: {
    bg: chocolate, title: dorado, fg: crema, logo: dorado,
    labelBg: dorado, labelFg: chocolate,
    ctaBg: dorado, ctaFg: chocolate,
    stickerBg: dorado, stickerFg: chocolate,
  },
  dorado: {
    bg: dorado, title: chocolate, fg: chocolate, logo: chocolate,
    labelBg: chocolate, labelFg: crema,
    ctaBg: chocolate, ctaFg: crema,
    stickerBg: chocolate, stickerFg: dorado,
  },
  crema: {
    bg: crema, title: chocolate, fg: chocolate, logo: chocolate,
    labelBg: chocolate, labelFg: crema,
    ctaBg: chocolate, ctaFg: crema,
    stickerBg: dorado, stickerFg: chocolate,
  },
  arena: {
    bg: arena, title: chocolate, fg: chocolate, logo: chocolate,
    labelBg: chocolate, labelFg: crema,
    ctaBg: chocolate, ctaFg: crema,
    stickerBg: crema, stickerFg: chocolate,
  },
  espresso: {
    bg: espresso, title: arena, fg: crema, logo: dorado,
    labelBg: arena, labelFg: espresso,
    ctaBg: dorado, ctaFg: espresso,
    stickerBg: dorado, stickerFg: espresso,
  },
}
