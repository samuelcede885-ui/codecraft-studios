// Validación de esquema de los datos (OWASP API10: no confiar en datos de terceros).
// Todo lo que llega de Quanta, de archivos importados o de localStorage pasa por aquí
// antes de mostrarse: identificadores con formato seguro, números reales y textos acotados.

const ID = /^[A-Za-z0-9_-]{1,80}$/;
export const isId = (v) => typeof v === 'string' && ID.test(v);
const str = (v, max = 600) => (v == null ? '' : String(v)).slice(0, max);
const num = (v, min = -1e6, max = 1e6) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};
const date = (v) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v.slice(0, 40) : null);
const bool = (v) => v === true;
const arr = (v, max = 500) => (Array.isArray(v) ? v.slice(0, max) : []);
const oneOf = (v, list, d) => (list.includes(v) ? v : d);

function subject(s) {
  if (!s || !isId(s.id)) return null;
  const out = {
    id: s.id,
    name: str(s.name, 120) || 'Materia',
    teacher: str(s.teacher, 120),
    progress: num(s.progress, 0, 100) ?? 0,
    totalItems: num(s.totalItems, 0, 10000),
    completedItems: num(s.completedItems, 0, 10000),
    modules: arr(s.modules, 50).map((m) => ({ title: str(m?.title, 200), lessons: arr(m?.lessons, 60).map((l) => str(l, 200)) })),
  };
  if (Array.isArray(s.outline)) out.outline = arr(s.outline, 10).map((p) => [str(p?.[0], 120), str(p?.[1], 600)]);
  if (s.guide) {
    out.guide = {
      summary: str(s.guide.summary, 1200),
      concepts: arr(s.guide.concepts, 20).map((c) => str(c, 200)),
      quiz: arr(s.guide.quiz, 20).map((q) => ({
        q: str(q?.q, 300),
        options: arr(q?.options, 6).map((o) => str(o, 200)),
        answer: num(q?.answer, 0, 5) ?? 0,
      })),
    };
  }
  return out;
}

function task(t, subjectIds) {
  if (!t || !isId(t.id) || !subjectIds.has(t.subjectId)) return null;
  return {
    id: t.id,
    kind: oneOf(t.kind, ['practica', 'evaluacion', 'manual', 'importada'], 'manual'),
    subjectId: t.subjectId,
    title: str(t.title, 200) || 'Tarea',
    unit: str(t.unit, 200),
    due: date(t.due),
    dueIn: num(t.dueIn, -3650, 3650),
    minutes: num(t.minutes, 0, 1000),
    status: oneOf(t.status, ['pendiente', 'resuelta'], 'pendiente'),
    forExam: bool(t.forExam),
    weight: num(t.weight, 0, 100),
    instructions: str(t.instructions, 1500),
  };
}

function exam(e, subjectIds) {
  if (!e || !isId(e.id) || !subjectIds.has(e.subjectId)) return null;
  const out = {
    id: e.id,
    subjectId: e.subjectId,
    title: str(e.title, 200) || 'Evaluación',
    category: str(e.category, 120),
    description: str(e.description, 300),
    due: date(e.due),
    inDays: num(e.inDays, -3650, 3650),
    weight: num(e.weight, 0, 100),
    maxScore: num(e.maxScore, 0, 1000),
    teacher: str(e.teacher, 120),
  };
  if (Array.isArray(e.topics)) out.topics = arr(e.topics, 20).map((x) => str(x, 200));
  return out;
}

/** Devuelve una copia saneada del estado completo. */
export function sanitize(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const subjects = arr(s.subjects, 60).map(subject).filter(Boolean);
  const ids = new Set(subjects.map((x) => x.id));
  const st = s.student || {};
  const checks = {};
  for (const [k, v] of Object.entries(s.checks || {})) if (isId(k)) checks[k] = arr(v, 10).map(bool);
  const agent = sanitizeAgent(s.agent);
  return {
    source: oneOf(s.source, ['demo', 'quanta', 'importado'], 'demo'),
    version: str(s.version, 60) || '1',
    fetchedAt: date(s.fetchedAt),
    importedAt: date(s.importedAt),
    lastSync: num(s.lastSync, 0, 1e15),
    student: {
      name: str(st.name, 80) || 'Estudiante',
      fullName: str(st.fullName, 160),
      email: str(st.email, 160),
      studentId: str(st.studentId, 80),
      school: str(st.school, 160),
      xp: num(st.xp, 0, 1e7),
      level: num(st.level, 0, 1000),
      streak: num(st.streak, 0, 10000),
      average: num(st.average, 0, 20),
      performance: num(st.performance, 0, 100),
    },
    examMode: bool(s.examMode),
    notifications: s.notifications !== false,
    prep: num(s.prep, 0, 100),
    subjects,
    tasks: arr(s.tasks, 2000).map((t) => task(t, ids)).filter(Boolean),
    exams: arr(s.exams, 500).map((e) => exam(e, ids)).filter(Boolean),
    announcements: arr(s.announcements, 50).map((n) => ({ title: str(n?.title, 200), message: str(n?.message, 2000), date: date(n?.date) })),
    checks,
    agent,
  };
}

function sanitizeAgent(a) {
  const out = { lastRunDay: null, drafts: {} };
  if (!a || typeof a !== 'object') return out;
  out.lastRunDay = typeof a.lastRunDay === 'string' ? a.lastRunDay.slice(0, 20) : null;
  const drafts = a.drafts && typeof a.drafts === 'object' ? a.drafts : {};
  let n = 0;
  for (const [k, d] of Object.entries(drafts)) {
    if (!isId(k) || !d || typeof d !== 'object' || n >= 500) continue;
    n++;
    out.drafts[k] = {
      taskId: isId(d.taskId) ? d.taskId : k,
      title: str(d.title, 200),
      subject: str(d.subject, 120),
      kind: oneOf(d.kind, ['practica', 'evaluacion', 'manual', 'importada'], 'manual'),
      isAssessment: bool(d.isAssessment),
      status: oneOf(d.status, ['new', 'drafting', 'ready_for_review', 'needs_input', 'failed', 'reviewed'], 'ready_for_review'),
      hash: str(d.hash, 40),
      body: str(d.body, 8000),
      prompt: str(d.prompt, 4000),
      needsInput: arr(d.needsInput, 20).map((x) => str(x, 200)),
      createdAt: date(d.createdAt),
      reviewedAt: date(d.reviewedAt),
    };
  }
  return out;
}
