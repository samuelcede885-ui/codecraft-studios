// Asistente de agenda escolar (determinista, sin inventar datos).
// Responde preguntas fijas sobre evaluaciones y tareas usando las fechas ya guardadas.
// Zona horaria America/Caracas. Semana: lunes a domingo. No marca nada como entregado.
import { state, subjectOf } from '../state/store.js';

const TZ = 'America/Caracas';
const MAX = 7;

const ymdOf = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
export const todayYmd = () => ymdOf(new Date());
const addDays = (ymd, n) => { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dow = (ymd) => new Date(ymd + 'T12:00:00Z').getUTCDay(); // 0 domingo … 6 sábado
function weekBounds(ymd) { const mon = addDays(ymd, -((dow(ymd) + 6) % 7)); return [mon, addDays(mon, 6)]; }
const between = (ymd, a, b) => ymd >= a && ymd <= b;
const dueYmd = (iso) => (iso ? ymdOf(new Date(iso)) : null);
const human = (ymd) => new Date(ymd + 'T12:00:00Z').toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

// Fuente: correo de Quanta si estuviera conectado; aquí, la exportación histórica.
export function sourceInfo() {
  const date = state.importedAt || state.fetchedAt;
  return { kind: 'exportación', date: date ? date.slice(0, 10) : null };
}

function evalItem(e) {
  const ymd = dueYmd(e.due);
  const today = todayYmd();
  const hours = ymd ? (new Date(ymd + 'T00:00:00-04:00') - new Date(today + 'T00:00:00-04:00')) / 36e5 : null;
  return {
    ymd,
    name: e.title,
    subject: subjectOf(e.subjectId).name,
    weight: e.weight,
    teacher: e.teacher,
    category: e.category,
    type: 'evaluación',
    high: e.weight != null && e.weight >= 15,
    soon: hours != null && hours >= 0 && hours <= 48,
  };
}

const futureEvals = () => state.exams.map(evalItem).filter((x) => x.ymd && x.ymd >= todayYmd());

// Orden por prioridad: vence en 48 h, luego ≥15 %, luego por fecha.
const byPriority = (a, b) => (b.soon - a.soon) || (b.high - a.high) || a.ymd.localeCompare(b.ymd);

function pack(items) {
  const sorted = [...items].sort(byPriority);
  return { items: sorted.slice(0, MAX), more: Math.max(0, sorted.length - MAX), total: sorted.length };
}

function recommend(items) {
  if (!items.length) return 'No hay evaluaciones en ese periodo: aprovecha para adelantar prácticas y repasar lo más reciente.';
  const first = [...items].sort(byPriority)[0];
  const why = first.soon ? 'vence en menos de 48 horas' : first.high ? `vale ${first.weight}% de la nota` : 'es lo más próximo';
  return `Empieza por «${first.name}» de ${first.subject} (${human(first.ymd)}): ${why}.`;
}

// ---- Preguntas predeterminadas ----
export const QUESTIONS = [
  ['semana', '¿Qué tengo esta semana?'],
  ['manana', '¿Qué tengo mañana?'],
  ['altas', '¿Cuáles valen 15% o más?'],
  ['tareas', '¿Qué tareas debo hacer?'],
  ['prioridad', '¿Qué materias debo priorizar?'],
];

export function answer(id, { all = false } = {}) {
  const today = todayYmd();
  const src = sourceInfo();

  if (id === 'semana' || id === 'proxima') {
    const [mon, sun] = weekBounds(id === 'proxima' ? addDays(today, 7) : today);
    const found = futureEvals().filter((x) => between(x.ymd, mon, sun));
    const p = all ? { items: [...found].sort(byPriority), more: 0, total: found.length } : pack(found);
    return { headline: `Tienes ${found.length} ${found.length === 1 ? 'evaluación confirmada' : 'evaluaciones confirmadas'} para esta semana (${human(mon)} a ${human(sun)})`, ...p, recommendation: recommend(found), src };
  }
  if (id === 'manana') {
    const t = addDays(today, 1);
    const found = futureEvals().filter((x) => x.ymd === t);
    return { headline: `Para mañana (${human(t)}) tienes ${found.length} ${found.length === 1 ? 'evaluación' : 'evaluaciones'}`, ...pack(found), recommendation: recommend(found), src };
  }
  if (id === 'hoy') {
    const found = futureEvals().filter((x) => x.ymd === today);
    return { headline: `Hoy (${human(today)}) tienes ${found.length} ${found.length === 1 ? 'evaluación' : 'evaluaciones'}`, ...pack(found), recommendation: recommend(found), src };
  }
  if (id === 'altas') {
    const found = futureEvals().filter((x) => x.high);
    const p = all ? { items: [...found].sort(byPriority), more: 0, total: found.length } : pack(found);
    return { headline: `Tienes ${found.length} ${found.length === 1 ? 'evaluación' : 'evaluaciones'} que valen 15% o más próximamente`, ...p, recommendation: recommend(found), src };
  }
  if (id === 'tareas') {
    const items = state.tasks.filter((t) => t.status === 'pendiente' && t.kind !== 'evaluacion')
      .map((t) => ({ ymd: dueYmd(t.due), name: t.title, subject: subjectOf(t.subjectId).name, type: 'práctica', weight: t.weight, high: false, soon: false }));
    const withDate = items.filter((x) => x.ymd).sort((a, b) => a.ymd.localeCompare(b.ymd));
    const noDate = items.filter((x) => !x.ymd);
    const shown = all ? [...withDate, ...noDate] : [...withDate, ...noDate].slice(0, MAX);
    return {
      headline: `Tienes ${items.length} tareas pendientes (${withDate.length} con fecha, ${noDate.length} prácticas sin plazo)`,
      items: shown, more: all ? 0 : Math.max(0, items.length - shown.length), total: items.length,
      recommendation: withDate.length ? `Haz primero «${withDate[0].name}» de ${withDate[0].subject} (${human(withDate[0].ymd)}).` : 'Ninguna tiene fecha: avanza las prácticas de las materias con evaluación próxima.',
      src,
    };
  }
  if (id === 'prioridad') {
    const evs = futureEvals();
    const score = {};
    for (const e of evs) {
      const s = subjectOf(state.exams.find((x) => x.title === e.name && subjectOf(x.subjectId).name === e.subject)?.subjectId || '').name || e.subject;
      score[s] = score[s] || { subject: s, count: 0, nearest: e.ymd, high: 0 };
      score[s].count++;
      score[s].nearest = e.ymd < score[s].nearest ? e.ymd : score[s].nearest;
      if (e.high) score[s].high++;
    }
    const ranked = Object.values(score).sort((a, b) => (b.high - a.high) || a.nearest.localeCompare(b.nearest)).slice(0, 5);
    return {
      headline: `Materias a priorizar por evaluaciones próximas`,
      subjects: ranked.map((r) => ({ subject: r.subject, detail: `${r.count} evaluación${r.count === 1 ? '' : 'es'}, la más próxima ${human(r.nearest)}${r.high ? ` · ${r.high} de peso alto` : ''}` })),
      recommendation: ranked.length ? `Dedica más tiempo a ${ranked[0].subject}: tiene la evaluación de más peso o más cercana.` : 'No hay evaluaciones próximas registradas.',
      src,
    };
  }
  return { headline: 'No reconocí esa pregunta.', items: [], recommendation: '', src };
}
