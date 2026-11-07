import type { PhotoId } from './photos';

/**
 * Carta de Punkie's — estructura editable.
 *
 * Reglas:
 * - Solo productos que aparecen en el material entregado (Instagram + manual).
 * - `price: null` = precio por confirmar. La web lo muestra como "$ —" y el
 *   pedido lo marca "por confirmar"; nunca se inventa un número.
 * - `pendiente` lista lo que el cliente debe confirmar (también visible con ?revision).
 * - Para agregar un producto, copiar un bloque y completar los campos.
 */

export type CategoryId = 'hamburguesas' | 'papas' | 'bebidas' | 'especiales';

export interface Category {
  id: CategoryId;
  label: string;
  /** Mensaje cuando la categoría todavía no tiene productos cargados */
  emptyMessage: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'hamburguesas',
    label: 'Hamburguesas',
    emptyMessage: 'Las hamburguesas se están cargando.',
  },
  {
    id: 'papas',
    label: 'Papas y acompañantes',
    emptyMessage: 'Los acompañantes se están cargando.',
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emptyMessage: 'La lista de bebidas todavía no está cargada. Pregunta por ellas en el local.',
  },
  {
    id: 'especiales',
    label: 'Especiales',
    emptyMessage: 'No hay un especial activo ahora. Los anunciamos primero en Instagram.',
  },
];

export interface ProductChoice {
  id: string;
  label: string;
  /** USD. null = por confirmar */
  price: number | null;
  detail?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  ingredients?: string[];
  /** USD. null = por confirmar. Si hay opciones, manda el precio de la opción. */
  price: number | null;
  options?: { label: string; choices: ProductChoice[] };
  photos: PhotoId[];
  /** `terminado` = ya no se vende (se muestra solo como archivo, sin botón de pedido) */
  status: 'disponible' | 'terminado';
  /** Para especiales: texto con el que se anunció en Instagram */
  quote?: string;
  /** Etiqueta corta para especiales (ej. "Edición limitada · septiembre 2026") */
  badge?: string;
  /** De dónde sale la información del producto */
  source: string;
  /** Datos que faltan confirmar con Punkie's */
  pendiente: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'la-clasica',
    name: 'La Clásica',
    category: 'hamburguesas',
    description:
      'Pan brioche, dos patties smashed (150 g de carne), queso, pepinillos, cebolla, lechuga, mostaza y ketchup.',
    ingredients: [
      'Pan brioche',
      'Dos patties smashed (150 g de carne)',
      'Queso',
      'Pepinillos',
      'Cebolla',
      'Lechuga',
      'Mostaza',
      'Ketchup',
    ],
    price: null,
    options: {
      label: '¿Cómo la quieres?',
      choices: [
        { id: 'individual', label: 'Individual', price: null },
        { id: 'combo', label: 'En combo', price: null, detail: 'Qué incluye: por confirmar' },
      ],
    },
    photos: ['clasica-cerca', 'clasica-combo'],
    status: 'disponible',
    source: 'Instagram @punkiesburger, 28 jul 2026',
    pendiente: ['Precio individual', 'Precio del combo', 'Qué incluye el combo'],
  },
  {
    id: 'la-punkies',
    name: "La Punkie's",
    category: 'hamburguesas',
    description: "La de la casa, con salsa Punkie's.",
    price: null,
    photos: ['pan-brioche'],
    status: 'disponible',
    source: 'Manual de marca (maqueta de la web)',
    pendiente: ['Precio', 'Ingredientes completos', 'Foto propia del producto'],
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    category: 'hamburguesas',
    description: 'Simple o doble. Queso americano.',
    price: null,
    options: {
      label: 'Tamaño',
      choices: [
        { id: 'simple', label: 'Simple', price: null },
        { id: 'doble', label: 'Doble', price: null },
      ],
    },
    photos: ['plancha-guantes'],
    status: 'disponible',
    source: 'Manual de marca (maqueta de la web)',
    pendiente: ['Precio simple', 'Precio doble', 'Confirmar que la foto corresponde'],
  },
  {
    id: 'papas-sazonadas',
    name: 'Papas sazonadas',
    category: 'papas',
    description: 'Finas, crujientes, adictivas.',
    price: null,
    photos: ['papas-sazonadas'],
    status: 'disponible',
    source: 'Manual de marca (maqueta de la web)',
    pendiente: ['Precio', 'Tamaños disponibles'],
  },
  {
    id: 'papitas-con-helado',
    name: 'Papitas con helado',
    category: 'papas',
    description: 'Para los que lo hacían escondidos.',
    price: null,
    photos: [],
    status: 'disponible',
    source: 'Instagram @punkiesburger, 10 may 2026',
    pendiente: ['Precio', 'Foto del producto', 'Sabor del helado'],
  },
  {
    id: 'especial-septiembre',
    name: 'Especial de septiembre',
    category: 'especiales',
    description: 'Smash con papitas al hilo. Edición limitada.',
    price: null,
    photos: ['especial-septiembre'],
    status: 'terminado',
    badge: 'Edición limitada · sep 2026',
    quote: 'ya la probaste? que tal estaa?? aprovecha que le queda poco ;)',
    source: 'Instagram @punkiesburger, 9 sep 2026',
    pendiente: ['Nombre del especial', 'Confirmar que ya terminó'],
  },
];

export function productsBy(category: CategoryId, status: Product['status'] = 'disponible') {
  return PRODUCTS.filter((p) => p.category === category && p.status === status);
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function isOrderable(p: Product) {
  return p.status === 'disponible';
}
