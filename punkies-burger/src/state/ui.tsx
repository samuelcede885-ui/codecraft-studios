import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { OrderMode } from '../config/site';

export type CartStep = 'pedido' | 'datos' | 'revisar';

interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface UIContextValue {
  productId: string | null;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  cartOpen: boolean;
  cartStep: CartStep;
  setCartStep: (s: CartStep) => void;
  openCart: (step?: CartStep) => void;
  closeCart: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  preferredMode: OrderMode;
  setPreferredMode: (m: OrderMode) => void;
  toast: Toast | null;
  showToast: (message: string, action?: Toast['action']) => void;
  dismissToast: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>('pedido');
  const [menuOpen, setMenuOpen] = useState(false);
  const [preferredMode, setPreferredMode] = useState<OrderMode>('delivery');
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const dismissToast = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, action?: Toast['action']) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, action });
    timer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  const openCart = useCallback(
    (step: CartStep = 'pedido') => {
      window.clearTimeout(timer.current);
      setToast(null);
      setCartStep(step);
      setCartOpen(true);
    },
    [],
  );

  const value = useMemo<UIContextValue>(
    () => ({
      productId,
      openProduct: (id) => {
        dismissToast();
        setProductId(id);
      },
      closeProduct: () => setProductId(null),
      cartOpen,
      cartStep,
      setCartStep,
      openCart,
      closeCart: () => setCartOpen(false),
      menuOpen,
      setMenuOpen,
      preferredMode,
      setPreferredMode,
      toast,
      showToast,
      dismissToast,
    }),
    [productId, cartOpen, cartStep, openCart, menuOpen, preferredMode, toast, showToast, dismissToast],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de UIProvider');
  return ctx;
}
