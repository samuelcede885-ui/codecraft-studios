import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { cartReducer, emptyCart, summarize, type CartAction, type CartState, type CartSummary } from '../lib/cart';

const STORAGE_KEY = 'punkies:pedido:v1';

interface CartContextValue {
  state: CartState;
  summary: CartSummary;
  dispatch: (a: CartAction) => void;
  add: (productId: string, choiceId: string | null, qty?: number) => void;
  /** Cambia cada vez que se agrega algo (para animar el contador) */
  addedTick: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyCart;
  } catch {
    return emptyCart;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart, () => cartReducer(emptyCart, { type: 'hydrate', state: readStored() }));
  const [addedTick, setAddedTick] = useState(0);

  useEffect(() => {
    try {
      if (state.lines.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible (modo privado): el carrito sigue funcionando en memoria */
    }
  }, [state]);

  // Sincroniza el carrito entre pestañas abiertas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        dispatch({ type: 'hydrate', state: e.newValue ? JSON.parse(e.newValue) : emptyCart });
      } catch {
        /* valor corrupto en otra pestaña: se ignora */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((productId: string, choiceId: string | null, qty = 1) => {
    dispatch({ type: 'add', productId, choiceId, qty });
    setAddedTick((t) => t + 1);
  }, []);

  const summary = useMemo(() => summarize(state), [state]);
  const value = useMemo(() => ({ state, summary, dispatch, add, addedTick }), [state, summary, add, addedTick]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
