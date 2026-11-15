// Motor de IA (SIMULADO).
// En producción, solveTask y buildGuide llaman al backend, que a su vez
// consulta el modelo de lenguaje con las instrucciones y adjuntos de Quanta.
// La clave del modelo nunca debe estar en el frontend.
import { subjectOf } from '../state/store.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const SOLVE_STEPS = [
  'Leyendo instrucciones de Quanta',
  'Analizando archivos adjuntos',
  'Redactando borrador',
  'Generando guía de estudio',
];

/** Genera un borrador para la tarea. onStep(i) avisa del paso en curso. */
export async function solveTask(task, onStep = () => {}) {
  for (let i = 0; i < SOLVE_STEPS.length; i++) {
    onStep(i);
    await wait(750);
  }
  onStep(SOLVE_STEPS.length);
  const subject = subjectOf(task.subjectId);
  return {
    intro: `Borrador para «${task.title}», siguiendo la instrucción del profesor: ${task.instructions}`,
    sections: subject.outline.map(([heading, body]) => ({ heading, body })),
  };
}

/** Guía de estudio de una materia: resumen, conceptos clave y simulacro. */
export function buildGuide(subjectId) {
  const subject = subjectOf(subjectId);
  return { subject: subject.name, ...subject.guide };
}
