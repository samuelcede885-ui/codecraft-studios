import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useUI } from '../../state/ui';
import { usePresence } from '../../hooks/usePresence';
import { CheckIcon, CloseIcon } from '../ui/Icons';

/** Aviso breve al agregar productos (role=status, no roba el foco). */
export function Toast() {
  const { toast, dismissToast } = useUI();
  const [current, setCurrent] = useState(toast);
  useEffect(() => {
    if (toast) setCurrent(toast);
  }, [toast]);
  const { mounted, shown } = usePresence(!!toast, 240);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+92px)] z-[60] flex justify-center px-3 lg:bottom-6" role="status" aria-live="polite">
      {mounted && current && (
        <div
          key={current.id}
          data-shown={shown && !!toast}
          className="toast pointer-events-auto flex max-w-[520px] items-center gap-3 rounded-[16px] border-2 border-crema/20 bg-tinta py-2 pl-3 pr-2 text-crema"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rojo">
            <CheckIcon width={18} height={18} />
          </span>
          <p className="text-[15px] font-semibold">{current.message}</p>
          {current.action && (
            <button
              type="button"
              onClick={() => {
                current.action!.onClick();
                dismissToast();
              }}
              className="ml-1 hidden min-h-10 shrink-0 rounded-full bg-crema px-4 text-[14px] font-extrabold text-tinta lg:block"
            >
              {current.action.label}
            </button>
          )}
          <button type="button" onClick={dismissToast} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-crema/70 hover:text-crema" aria-label="Cerrar aviso">
            <CloseIcon width={18} height={18} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
