// Motor de IA (SIMULADO).
// Con datos de Quanta no se inventan respuestas: se arma un plan de trabajo con las
// lecciones reales de la unidad. La resolución con un modelo de lenguaje real
// necesita el backend descrito en docs/ARQUITECTURA.md (la clave nunca va en el frontend).
import { subjectOf } from '../state/store.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const SOLVE_STEPS = [
  'Leyendo la actividad de Quanta',
  'Buscando las lecciones de la unidad',
  'Armando el plan de trabajo',
  'Preparando la guía de estudio',
];

const unitOf = (subject, task) =>
  subject.modules?.find((m) => m.title === task.unit) || subject.modules?.at(-1);

/** Devuelve { intro, sections } para revisar. onStep(i) avisa del paso en curso. */
export async function solveTask(task, onStep = () => {}) {
  for (let i = 0; i < SOLVE_STEPS.length; i++) {
    onStep(i);
    await wait(650);
  }
  onStep(SOLVE_STEPS.length);
  const subject = subjectOf(task.subjectId);

  if (subject.outline) {
    return {
      kind: 'borrador',
      intro: `Borrador para «${task.title}», siguiendo la instrucción del profesor: ${task.instructions}`,
      sections: subject.outline.map(([heading, body]) => ({ heading, body })),
    };
  }

  const unit = unitOf(subject, task);
  const lessons = (unit?.lessons || []).filter((l) => !/vocabulario/i.test(l));
  const sections = [
    { heading: 'Qué repasar', body: lessons.length ? lessons.join(' · ') : 'Las lecciones más recientes del curso.' },
    task.kind === 'evaluacion'
      ? { heading: 'Cómo prepararla', body: `${task.instructions} Repasa una lección por día, haz los puntos de práctica de la unidad y anota tus dudas para ${subject.teacher || 'tu profesor'}.` }
      : { heading: 'Cómo hacerlo', body: 'Abre primero la lección relacionada en Quanta, toma nota de los conceptos clave y luego responde el punto de práctica sin consultar, para medir lo que sabes.' },
    { heading: 'Vocabulario', body: 'Repasa la lección «Vocabulario de la clase» de esta unidad antes de empezar.' },
  ];
  return {
    kind: 'plan',
    intro: `Plan para «${task.title}» de ${subject.name}${unit ? `, unidad «${unit.title}»` : ''}.`,
    sections,
  };
}

/** Guía de estudio de una materia: resumen, temas clave y simulacro (si existe). */
export function buildGuide(subjectId) {
  const s = subjectOf(subjectId);
  if (s.guide) return { subject: s.name, ...s.guide };
  const units = s.modules || [];
  const last = units.at(-1);
  return {
    subject: s.name,
    summary: units.length
      ? `${s.name}${s.teacher ? ` con ${s.teacher}` : ''}. Unidades publicadas en Quanta: ${units.map((u) => u.title).join('; ')}.`
      : `${s.name} todavía no tiene contenido publicado en Quanta.`,
    concepts: last ? last.lessons.filter((l) => !/vocabulario/i.test(l)) : [],
    conceptsTitle: last ? `Lecciones de «${last.title}»` : 'Temas clave',
    quiz: [],
  };
}
