/**
 * Ilustración automática para platos sin foto (o cuya foto no carga).
 *
 * Busca palabras clave en el nombre del plato y en el de su categoría, de modo
 * que cualquier producto —de cualquier tipo de restaurante— tenga una imagen
 * acorde: 🍕 para pizzas, 🍰 para postres, 🥤 para bebidas, etc. Cada tipo trae
 * un tono (hue HSL) para el fondo degradado del marcador.
 */

/**
 * [emoji, tono, palabras clave] — el orden importa: lo más específico primero.
 * Las claves coinciden como palabra completa (admiten plural -s/-es), así que
 * "fresas" no se confunde con "res" ni "postres" con "res".
 */
const FOOD_TYPES = [
  ['🍕', 20, ['pizza', 'margarita', 'diavola', 'calzone', 'pepperoni', 'cuatro quesos']],
  ['🍝', 35, ['pasta', 'spaghetti', 'espagueti', 'carbonara', 'lasana', 'lasagna', 'fettuccine', 'ravioli', 'gnocchi', 'noquis', 'macarron', 'tallarin', 'penne', 'risotto']],
  ['🍣', 350, ['sushi', 'maki', 'nigiri', 'sashimi', 'roll', 'temaki']],
  ['🍜', 25, ['ramen', 'sopa', 'caldo', 'crema de', 'consome', 'pho', 'udon']],
  ['🌮', 40, ['taco', 'burrito', 'quesadilla', 'enchilada', 'nacho', 'fajita', 'tostada']],
  ['🍔', 30, ['hamburguesa', 'burger', 'sandwich', 'hot dog', 'perro caliente']],
  ['🥩', 5, ['carne', 'res', 'filete', 'bife', 'churrasco', 'parrilla', 'asado', 'costilla', 'cerdo', 'lomo', 'steak', 'chuleta', 'platos? fuertes?', 'principal', 'principales', 'segundos']],
  ['🍗', 30, ['pollo', 'alita', 'wings', 'pechuga', 'nuggets']],
  ['🦐', 10, ['marisco', 'camaron', 'gamba', 'langosta', 'pulpo', 'calamar', 'ceviche', 'mejillon', 'ostra']],
  ['🐟', 200, ['pescado', 'salmon', 'atun', 'merluza', 'trucha', 'corvina', 'bacalao']],
  ['🥗', 100, ['ensalada', 'salad', 'vegano', 'vegetal', 'verdura', 'bowl', 'cesar']],
  ['🍳', 45, ['desayuno', 'huevo', 'omelet', 'omelette', 'brunch', 'waffle', 'hotcake']],
  ['🥟', 30, ['empanada', 'dumpling', 'gyoza', 'arepa', 'pupusa', 'tamal']],
  ['🧀', 48, ['queso', 'burrata', 'provoleta', 'tabla', 'fondue']],
  ['🥖', 38, ['pan', 'bruschetta', 'focaccia', 'baguette', 'entrada', 'aperitivo', 'antipasto', 'tapa', 'picoteo']],
  ['🍟', 45, ['papas fritas', 'patatas', 'fries', 'acompanamiento', 'guarnicion']],
  ['🍨', 300, ['helado', 'gelato', 'sorbete', 'nieve']],
  ['🍰', 330, ['postre', 'tarta', 'pastel', 'torta', 'cheesecake', 'tiramisu', 'brownie', 'flan', 'dulce', 'mousse', 'cake', 'panna cotta', 'fresa']],
  ['🍩', 320, ['dona', 'donut', 'churro', 'galleta', 'cookie', 'crepa', 'crepe', 'panqueque', 'pancake']],
  ['☕', 25, ['cafe', 'coffee', 'espresso', 'capuchino', 'cappuccino', 'latte', 'americano', 'mocca', 'te', 'infusion']],
  ['🍷', 340, ['vino', 'wine', 'cava', 'champagne', 'sangria']],
  ['🍺', 42, ['cerveza', 'beer', 'ipa', 'lager', 'stout', 'chela']],
  ['🍹', 170, ['coctel', 'cocktail', 'mojito', 'pina colada', 'daiquiri', 'trago', 'licor']],
  ['🥤', 190, ['bebida', 'refresco', 'soda', 'gaseosa', 'jugo', 'zumo', 'limonada', 'batido', 'smoothie', 'malteada', 'agua']],
];

const DRINKS = new Set(['☕', '🍷', '🍺', '🍹', '🥤']);
const DEFAULT_FOOD = { emoji: '🍽️', hue: 28 };

const PATTERNS = FOOD_TYPES.map(([emoji, hue, words]) => ({
  emoji,
  hue,
  re: new RegExp(`(^|[^a-z])(${words.join('|')})(s|es)?(?![a-z])`),
}));

/** Minúsculas y sin tildes, para comparar "Lasaña" con "lasana". */
const normalize = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** @returns {{ emoji: string, hue: number } | undefined} */
function match(text) {
  const t = normalize(text);
  const found = PATTERNS.find(({ re }) => re.test(t));
  return found && { emoji: found.emoji, hue: found.hue };
}

/**
 * @param {{ name: string }} product
 * @param {string} [categoryName]
 * @returns {{ emoji: string, hue: number }}
 */
export function foodVisual(product, categoryName = '') {
  const byName = match(product.name);
  const byCategory = match(categoryName);
  // En una categoría de bebidas manda la categoría, salvo que el nombre también
  // sea una bebida: un cóctel "Margarita" no debe mostrarse como pizza.
  if (byCategory && DRINKS.has(byCategory.emoji) && !(byName && DRINKS.has(byName.emoji))) {
    return byCategory;
  }
  return byName ?? byCategory ?? DEFAULT_FOOD;
}

/** Emoji para una categoría (pestañas y títulos de sección). */
export function categoryEmoji(categoryName) {
  return match(categoryName)?.emoji ?? DEFAULT_FOOD.emoji;
}

/** Marcador ilustrado: un bloque con el emoji sobre un degradado del tono del plato. */
export function foodPlaceholder(className, visual) {
  const el = document.createElement('div');
  el.className = `${className} food-ph`;
  el.style.setProperty('--food-hue', String(visual.hue));
  el.setAttribute('aria-hidden', 'true');
  el.textContent = visual.emoji;
  return el;
}
