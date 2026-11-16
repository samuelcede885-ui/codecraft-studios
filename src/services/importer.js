// Importación manual de tareas: alternativa autorizada a la sincronización automática.
// Acepta un calendario .ics exportado por el propio estudiante o una copia .json de esta app.
// Todo se valida con sanitize() antes de entrar al estado.
import { state, replaceState } from '../state/store.js';
import { sanitize } from '../state/schema.js';

export const MAX_BYTES = 1024 * 1024;
const MAX_EVENTS = 500;

// RFC 5545: desplegar líneas plegadas y leer propiedades simples.
function unfold(text) { return text.replace(/\r?\n[ \t]/g, ''); }
const unescapeIcs = (v) => v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');

function icsDate(v) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/.exec(v || '');
  if (!m) return null;
  const [, y, mo, d, h = '12', mi = '00', s = '00', z] = m;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}${z ? 'Z' : '-04:00'}`;
}

export function parseIcs(text) {
  const events = [];
  for (const block of unfold(text).split('BEGIN:VEVENT').slice(1, MAX_EVENTS + 1)) {
    const body = block.split('END:VEVENT')[0];
    const get = (name) => {
      const m = new RegExp(`^${name}(?:;[^:\\n]*)?:(.*)$`, 'mi').exec(body);
      return m ? unescapeIcs(m[1].trim()) : '';
    };
    const summary = get('SUMMARY');
    if (!summary) continue;
    events.push({ summary, description: get('DESCRIPTION'), categories: get('CATEGORIES'), start: icsDate(get('DTSTART')) || icsDate(get('DUE')) });
  }
  return events;
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
let seq = 0;
const newId = () => `imp-${Date.now().toString(36)}-${(seq++).toString(36)}`;

/** Lee el archivo y devuelve un resumen. Lanza Error con un mensaje claro si no es válido. */
export async function importFile(file) {
  if (!file) throw new Error('No elegiste ningún archivo.');
  if (file.size > MAX_BYTES) throw new Error('El archivo pesa más de 1 MB.');
  const text = await file.text();
  const name = file.name.toLowerCase();

  if (name.endsWith('.json')) {
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('El archivo .json no tiene un formato válido.'); }
    const clean = sanitize({ ...data, source: 'importado', importedAt: new Date().toISOString() });
    if (!clean.subjects.length) throw new Error('El archivo no contiene materias de esta app.');
    replaceState(clean);
    return `${clean.subjects.length} materias y ${clean.tasks.length} tareas importadas`;
  }

  if (name.endsWith('.ics') || /BEGIN:VCALENDAR/.test(text)) {
    const events = parseIcs(text);
    if (!events.length) throw new Error('El calendario no tiene eventos con título.');
    const next = structuredClone(state);
    let other = next.subjects.find((s) => s.id === 'importadas');
    let added = 0;
    for (const ev of events) {
      const hay = norm(`${ev.summary} ${ev.categories} ${ev.description}`);
      let subject = next.subjects.find((s) => s.id !== 'importadas' && hay.includes(norm(s.name)));
      if (!subject) {
        if (!other) { other = { id: 'importadas', name: 'Importadas', teacher: '', modules: [] }; next.subjects.push(other); }
        subject = other;
      }
      const dup = next.tasks.some((t) => t.title === ev.summary && t.subjectId === subject.id && (t.due || '').slice(0, 10) === (ev.start || '').slice(0, 10));
      if (dup) continue;
      next.tasks.push({
        id: newId(), kind: 'importada', subjectId: subject.id, title: ev.summary, due: ev.start,
        status: 'pendiente', forExam: /prueba|examen|test|evaluaci/i.test(ev.summary), weight: null,
        instructions: ev.description || 'Importada desde tu calendario.', unit: '',
      });
      added++;
    }
    next.importedAt = new Date().toISOString();
    replaceState(next);
    return added ? `${added} tareas importadas del calendario` : 'Todas las tareas del calendario ya estaban en la app';
  }

  throw new Error('Usa un archivo de calendario (.ics) o una copia de esta app (.json).');
}
