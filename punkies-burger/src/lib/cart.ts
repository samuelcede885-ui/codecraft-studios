import { getProduct, isOrderable, type Product } from '../data/menu';

export const MAX_QTY = 20;

export interface CartLine {
  key: string;
  productId: string;
  choiceId: string | null;
  qty: number;
}

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: 'add'; productId: string; choiceId: string | null; qty: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'hydrate'; state: CartState };

export const emptyCart: CartState = { lines: [] };

export function lineKey(productId: string, choiceId: string | null) {
  return choiceId ? `${productId}::${choiceId}` : productId;
}

const clampQty = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(n)));

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const product = getProduct(action.productId);
      if (!product || !isOrderable(product)) return state;
      if (product.options && !product.options.choices.some((c) => c.id === action.choiceId)) return state;
      const key = lineKey(action.productId, action.choiceId);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          lines: state.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + action.qty) || 1 } : l)),
        };
      }
      const qty = clampQty(action.qty);
      if (qty === 0) return state;
      return { lines: [...state.lines, { key, productId: action.productId, choiceId: action.choiceId, qty }] };
    }
    case 'setQty': {
      const qty = clampQty(action.qty);
      if (qty === 0) return { lines: state.lines.filter((l) => l.key !== action.key) };
      return { lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty } : l)) };
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case 'clear':
      return emptyCart;
    case 'hydrate':
      return sanitize(action.state);
    default:
      return state;
  }
}

/** Limpia un carrito guardado: descarta productos que ya no existen o no se venden. */
export function sanitize(raw: unknown): CartState {
  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as CartState).lines)) return emptyCart;
  const lines: CartLine[] = [];
  for (const l of (raw as CartState).lines) {
    if (!l || typeof l.productId !== 'string') continue;
    const product = getProduct(l.productId);
    if (!product || !isOrderable(product)) continue;
    const choiceId = typeof l.choiceId === 'string' ? l.choiceId : null;
    if (product.options && !product.options.choices.some((c) => c.id === choiceId)) continue;
    if (!product.options && choiceId) continue;
    const qty = clampQty(Number(l.qty));
    if (qty > 0) lines.push({ key: lineKey(product.id, choiceId), productId: product.id, choiceId, qty });
  }
  return { lines };
}

export interface ResolvedLine extends CartLine {
  product: Product;
  choiceLabel: string | null;
  unitPrice: number | null;
  lineTotal: number | null;
}

export function resolveLine(line: CartLine): ResolvedLine | null {
  const product = getProduct(line.productId);
  if (!product) return null;
  const choice = product.options?.choices.find((c) => c.id === line.choiceId) ?? null;
  const unitPrice = choice ? choice.price : product.price;
  return {
    ...line,
    product,
    choiceLabel: choice?.label ?? null,
    unitPrice,
    lineTotal: unitPrice === null ? null : Math.round(unitPrice * line.qty * 100) / 100,
  };
}

export interface CartSummary {
  lines: ResolvedLine[];
  itemCount: number;
  /** Suma de las líneas con precio confirmado */
  knownSubtotal: number;
  /** Líneas sin precio confirmado */
  pendingPriceLines: number;
  /** true solo si todas las líneas tienen precio */
  subtotalComplete: boolean;
}

export function summarize(state: CartState): CartSummary {
  const lines = state.lines.map(resolveLine).filter((l): l is ResolvedLine => l !== null);
  const knownSubtotal = Math.round(lines.reduce((s, l) => s + (l.lineTotal ?? 0), 0) * 100) / 100;
  const pendingPriceLines = lines.filter((l) => l.lineTotal === null).length;
  return {
    lines,
    itemCount: lines.reduce((s, l) => s + l.qty, 0),
    knownSubtotal,
    pendingPriceLines,
    subtotalComplete: pendingPriceLines === 0,
  };
}
