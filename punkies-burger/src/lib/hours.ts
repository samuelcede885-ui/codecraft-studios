import type { HoursRange, Weekday } from '../config/site';

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Hora local de Caracas (o la zona indicada) para una fecha dada. */
export function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')) as Weekday;
  return { weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "21:00" → "9 p. m." */
export function formatHour(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'p. m.' : 'a. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

export function getOpenStatus(date: Date, hours: readonly HoursRange[], timeZone: string): OpenStatus {
  const { weekday, minutes } = zonedParts(date, timeZone);
  const today = hours.find((r) => r.days.includes(weekday));
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, label: `Abierto ahora · hasta las ${formatHour(today.close)}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { open: false, label: `Cerrado · abre hoy a las ${formatHour(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const day = ((weekday + i) % 7) as Weekday;
    const next = hours.find((r) => r.days.includes(day));
    if (next) {
      const when = i === 1 ? 'mañana' : `el ${DAY_NAMES[day]}`;
      return { open: false, label: `Cerrado · abre ${when} a las ${formatHour(next.open)}` };
    }
  }
  return { open: false, label: 'Cerrado' };
}
