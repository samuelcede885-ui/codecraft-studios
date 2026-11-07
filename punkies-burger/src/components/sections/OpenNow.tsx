import { useEffect, useState } from 'react';
import { site } from '../../config/site';
import { getOpenStatus, type OpenStatus } from '../../lib/hours';
import { cx } from '../../lib/cx';

/** Estado abierto/cerrado calculado con la hora de Caracas y el horario configurado. */
export function OpenNow({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date(), site.hours, site.timeZone));
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, []);
  if (!status) return null;
  return (
    <p className={cx('inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-bold', status.open ? 'bg-tinta text-crema' : 'border-2 border-tinta', className)} role="status">
      <span className={cx('h-2.5 w-2.5 rounded-full', status.open ? 'bg-amarillo' : 'bg-rojo')} aria-hidden="true" />
      {status.label}
    </p>
  );
}
