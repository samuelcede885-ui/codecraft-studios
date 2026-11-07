import { MAX_QTY } from '../../lib/cart';
import { MinusIcon, PlusIcon } from '../ui/Icons';
import { cx } from '../../lib/cx';

export function QtyStepper({ value, onChange, label, min = 1, size = 'md' }: { value: number; onChange: (n: number) => void; label: string; min?: number; size?: 'sm' | 'md' }) {
  const btn = cx('grid place-items-center rounded-full border-2 border-tinta transition-colors hover:bg-tinta hover:text-crema disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-current', size === 'sm' ? 'h-10 w-10' : 'h-12 w-12');
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={value <= 1 && min === 0 ? `Quitar ${label}` : `Restar uno`}>
        <MinusIcon width={18} height={18} />
      </button>
      <output className={cx('min-w-[2ch] text-center font-mono font-bold', size === 'sm' ? 'text-[16px]' : 'text-[19px]')} aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Sumar uno">
        <PlusIcon width={18} height={18} />
      </button>
    </div>
  );
}
