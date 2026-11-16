// Convierte private/quanta-raw.json (salida de quanta-sync.cjs) en los datos de la app:
// private/quanta-data.js, con la misma forma que src/data/mock.js.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'private');
const raw = JSON.parse(fs.readFileSync(path.join(dir, 'quanta-raw.json'), 'utf8'));

const ok = (re) => raw.responses.filter((r) => r.status === 200 && re.test(r.url.split('?')[0])).map((r) => r.body);
const first = (re) => ok(re)[0];
const titleCase = (s) => s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, sp, c) => sp + c.toUpperCase());
const shortName = (s) => s.replace(/\s*—\s*[A-Z]$/, '').replace(/\s+(\d\w*\.?|Cuarto|Tercer)\s+Año$/i, '').trim();
const cleanUnit = (s) => s.replace(/\s+\d\w*\s+año$/i, '').replace(/^Clase\.\s*/, '').trim();

// Perfil y progreso
const profile = first(/student\/profile$/);
const gam = first(/students\/me\/gamification$/) || {};
const first1 = titleCase(profile.first_name.split(' ')[0]);
const last1 = titleCase(profile.last_name.split(' ')[0]);

// Cursos y su estructura (unidades → lecciones y puntos de práctica)
const courses = first(/lms\/my-courses$/).items;
const structures = new Map(ok(/my-courses\/[^/]+\/structure$/).map((s) => [s.course.id, s]));

const subjects = [];
const tasks = [];
for (const c of courses) {
  const st = structures.get(c.course_id);
  const modules = (st?.modules || [])
    .filter((m) => m.items.length)
    .map((m) => ({
      title: cleanUnit(m.title),
      lessons: m.items.filter((i) => i.item_type === 'lesson').map((i) => i.title),
    }));
  subjects.push({
    id: c.course_id,
    name: shortName(c.subject_name || c.course_title),
    teacher: c.instructor_name,
    progress: c.progress_percentage || 0,
    totalItems: c.total_items,
    completedItems: c.completed_items,
    modules,
  });
  for (const m of st?.modules || []) {
    const lessons = m.items.filter((i) => i.item_type === 'lesson').map((i) => i.title);
    for (const it of m.items.filter((i) => i.item_type === 'formative_checkpoint')) {
      const stage = it.title.replace(/^Punto de práctica:\s*/, '').split(' — ')[0];
      tasks.push({
        id: it.id,
        kind: 'practica',
        subjectId: c.course_id,
        title: `Punto de práctica: ${stage}`,
        unit: cleanUnit(m.title),
        due: null,
        minutes: it.estimated_duration_minutes,
        status: (c.completed_items || 0) >= c.total_items && c.total_items ? 'resuelta' : 'pendiente',
        forExam: false,
        weight: null,
        instructions: `Punto de práctica de la unidad «${cleanUnit(m.title)}». Lecciones relacionadas: ${lessons.join('; ')}.`,
      });
    }
  }
}

// Evaluaciones del plan de evaluación (calendario)
const events = new Map();
for (const b of ok(/calendar\/unified$/)) for (const e of b.events) events.set(e.id, e);
const all = [...events.values()];
const exams = all
  .filter((e) => e.event_type === 'eval_plan_entry')
  .map((e) => ({ ...e, lms_course_id: e.lms_course_id || e.metadata?.course_id }))
  .filter((e) => courses.some((c) => c.course_id === e.lms_course_id))
  .map((e) => ({
    id: e.id,
    subjectId: e.lms_course_id,
    title: e.title,
    category: e.metadata?.category_name || '',
    description: e.description || '',
    due: e.start_date,
    weight: e.metadata?.weight ?? null,
    maxScore: e.metadata?.max_score ?? 20,
    teacher: e.metadata?.teacher_name || '',
  }))
  .sort((a, b) => a.due.localeCompare(b.due));

for (const e of exams) {
  const s = subjects.find((x) => x.id === e.subjectId);
  tasks.push({
    id: e.id,
    kind: 'evaluacion',
    subjectId: e.subjectId,
    title: e.title,
    unit: s?.modules.at(-1)?.title || '',
    due: e.due,
    status: 'pendiente',
    forExam: true,
    weight: e.weight,
    instructions: `${e.title}${e.description ? ` (${e.description})` : ''} · ${e.category} · vale ${e.weight}% de la nota, sobre ${e.maxScore} puntos.`,
  });
}

const schoolEvents = all
  .filter((e) => e.event_type === 'school_event')
  .map((e) => ({ title: e.title, date: e.start_date }));

// Anuncios de los profesores
const notes = (first(/notifications$/)?.notifications || [])
  .filter((n) => /anuncio/i.test(n.title))
  .map((n) => ({ title: n.title, message: n.message.trim(), date: n.created_at }));

const seed = {
  source: 'quanta',
  version: raw.fetchedAt,
  fetchedAt: raw.fetchedAt,
  student: {
    name: `${first1} ${last1}`,
    fullName: `${titleCase(profile.first_name)} ${titleCase(profile.last_name)}`,
    email: profile.email,
    studentId: '4to Año · Sección A',
    school: 'Colegio El Peñón',
    xp: gam.xp ?? 0,
    level: gam.level ?? 1,
    streak: gam.streak ?? 0,
    average: null,
  },
  examMode: false,
  notifications: true,
  subjects,
  tasks,
  exams,
  schoolEvents,
  announcements: notes,
};

fs.writeFileSync(path.join(dir, 'quanta-data.js'), `// Generado por scripts/quanta-import.cjs a partir de Quanta (${raw.fetchedAt}). No subir a git.\nexport const seed = ${JSON.stringify(seed, null, 2)};\n`);
console.log(`${subjects.length} materias · ${exams.length} evaluaciones · ${tasks.length - exams.length} puntos de práctica · ${notes.length} anuncios`);
