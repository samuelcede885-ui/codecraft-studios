/**
 * Colores de Pookies y las cinco escenas del hero.
 *
 * No hay manual de marca: los valores se midieron en su perfil público (foto
 * de perfil, menús y las cinco portadas de sus historias destacadas),
 * convertidos de Display P3 —el espacio de color de las capturas de iPhone— a
 * sRGB. Son una buena aproximación; se ajustan cuando la marca dé los suyos.
 */
export const palette = {
  red: '#E90133', // fondo de su foto de perfil y palabra "Pookies" del menú
  pink: '#FEACD4', // letras de su logo sobre rojo
  yellow: '#FDE502', // portada de la historia "reviews"
  blue: '#0085FF', // portada de la historia "menu"
  green: '#00D628', // portada de la historia "payments"
  ink: '#323939', // gris de "MENÚ" y de los precios
  paper: '#F0F0F0', // gris claro del fondo de sus menús
  white: '#FFFFFF',
}

const { red, pink, yellow, green, ink, white } = palette
/** Su azul, un punto más profundo para que el texto blanco pase de 4,5:1 de contraste. */
const deepBlue = '#0072E6'

/** Fuente del titular gigante: se precarga para que no cambie de tamaño al llegar. */
export const preloadFont = 'dynapuff-latin-700-normal'

/** Ajustes de la versión para compartir como artefacto (npm run pookies:artifact). */
export const artifact = {
  title: 'Propuesta Pookies',
  file: 'propuesta-pookies.html',
  googleFonts: 'https://fonts.googleapis.com/css2?family=Anton&family=DynaPuff:wght@700&family=Poppins:wght@400;500;600&display=swap',
  rootCss: [
    `--pk-red: ${red.toLowerCase()};`,
    `--pk-pink: ${pink.toLowerCase()};`,
    `--pk-yellow: ${yellow.toLowerCase()};`,
    `--pk-blue: ${palette.blue.toLowerCase()};`,
    `--pk-green: ${green.toLowerCase()};`,
    `--pk-ink: ${ink.toLowerCase()};`,
    `--pk-paper: ${palette.paper.toLowerCase()};`,
  ],
  /** Color del lienzo bajo la página: el del footer. */
  canvas: 'var(--accent)',
}

/**
 * bg: fondo de la escena · title: titular gigante detrás de la cookie
 * fg: texto de interfaz · label: etiqueta del nombre · cta: botón principal
 * sticker: precio · logo (opcional): color de la marca en la cabecera
 *
 * Cada cookie va sobre el color que más la separa del fondo y de su titular.
 */
export const heroThemes = {
  red: {
    bg: red, title: pink, fg: white,
    labelBg: white, labelFg: red,
    ctaBg: white, ctaFg: red,
    stickerBg: yellow, stickerFg: ink,
  },
  blue: {
    bg: deepBlue, title: white, fg: white,
    labelBg: yellow, labelFg: ink,
    ctaBg: yellow, ctaFg: ink,
    stickerBg: white, stickerFg: ink,
  },
  pink: {
    bg: pink, title: red, fg: ink, logo: red,
    labelBg: red, labelFg: white,
    ctaBg: red, ctaFg: white,
    stickerBg: white, stickerFg: red,
  },
  yellow: {
    bg: yellow, title: red, fg: ink, logo: red,
    labelBg: red, labelFg: white,
    ctaBg: red, ctaFg: white,
    stickerBg: ink, stickerFg: yellow,
  },
  green: {
    bg: green, title: white, fg: ink,
    labelBg: ink, labelFg: white,
    ctaBg: ink, ctaFg: white,
    stickerBg: pink, stickerFg: ink,
  },
}
