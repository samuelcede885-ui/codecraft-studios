import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePresence } from '../../hooks/usePresence';
import { cx } from '../../lib/cx';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

let openCount = 0;

function lockPage(lock: boolean) {
  const root = document.getElementById('root');
  openCount += lock ? 1 : -1;
  const locked = openCount > 0;
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (root) root.inert = locked;
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Texto accesible del diálogo (si no hay título visible referenciado) */
  label?: string;
  labelledBy?: string;
  /** center = ficha de producto · right = carrito · top = menú móvil */
  placement: 'center' | 'right' | 'top';
  className?: string;
  children: ReactNode;
  initialFocus?: React.RefObject<HTMLElement | null>;
}

/** Diálogo modal accesible: portal, foco atrapado, Escape, bloqueo de scroll y foco devuelto al cerrar. */
export function Overlay({ open, onClose, label, labelledBy, placement, className, children, initialFocus }: OverlayProps) {
  const { mounted, shown } = usePresence(open, 340);
  if (!mounted) return null;
  return createPortal(
    <OverlayInner shown={shown} onClose={onClose} label={label} labelledBy={labelledBy} placement={placement} className={className} initialFocus={initialFocus}>
      {children}
    </OverlayInner>,
    document.body,
  );
}

function OverlayInner({ shown, onClose, label, labelledBy, placement, className, children, initialFocus }: Omit<OverlayProps, 'open'> & { shown: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  const fallbackId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    lockPage(true);
    const focusTarget = initialFocus?.current ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panel.current;
    requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockPage(false);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [initialFocus]);

  return (
    <div
      data-shown={shown}
      className={cx('ov fixed inset-0 z-50 flex', placement === 'center' && 'items-end justify-center md:items-center md:p-6', placement === 'right' && 'justify-end', placement === 'top' && 'items-start')}
    >
      <div className="ov-backdrop absolute inset-0 bg-tinta/70" onClick={() => onCloseRef.current()} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy ?? (label ? undefined : fallbackId)}
        tabIndex={-1}
        data-placement={placement}
        className={cx('ov-panel relative outline-none', className)}
      >
        {children}
      </div>
    </div>
  );
}
