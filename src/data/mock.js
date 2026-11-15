// Datos de demostración. En producción llegan desde el conector de Quanta
// (ver src/services/quanta.js y docs/ARQUITECTURA.md).

const t = (id, subjectId, title, dueIn, status, forExam, instructions) =>
  ({ id, subjectId, title, dueIn, status, forExam, instructions, weight: 15 });

export const seed = {
  student: {
    name: 'Alex Rivera',
    email: 'alex.rivera@colegio.edu',
    studentId: 'ID 2024-0417',
    average: 9.8,
    performance: 98,
  },
  examMode: false,
  notifications: true,
  prep: 85, // % de preparación para el próximo examen

  subjects: [
    {
      id: 'mat', name: 'Matemáticas',
      outline: [
        ['Planteamiento', 'Se identifican los datos, la incógnita y la fórmula aplicable.'],
        ['Desarrollo', 'Se resuelve paso a paso, justificando cada transformación algebraica.'],
        ['Comprobación', 'Se sustituye el resultado en la expresión original para verificarlo.'],
      ],
      guide: {
        summary: 'Las funciones cuadráticas tienen la forma f(x) = ax² + bx + c. Su gráfica es una parábola cuyo vértice y raíces se obtienen con la fórmula general y el discriminante.',
        concepts: ['Discriminante: Δ = b² − 4ac', 'Vértice: x = −b / 2a', 'Factorización y raíces', 'Concavidad según el signo de a'],
        quiz: [
          { q: '¿Cuántas raíces reales tiene x² − 4x + 4 = 0?', options: ['Ninguna', 'Una (doble)', 'Dos distintas'], answer: 1 },
          { q: 'El vértice de f(x) = x² − 6x + 5 está en x =', options: ['3', '−3', '6'], answer: 0 },
        ],
      },
    },
    {
      id: 'his', name: 'Historia',
      outline: [
        ['Contexto', 'Se sitúa el hecho en su época y se describen sus antecedentes.'],
        ['Causas y desarrollo', 'Se explican las causas políticas, económicas y sociales, y los hechos principales.'],
        ['Consecuencias', 'Se analizan los efectos a corto y largo plazo con una conclusión propia.'],
      ],
      guide: {
        summary: 'La Revolución Francesa (1789–1799) puso fin al Antiguo Régimen. Nació de la crisis económica, la desigualdad estamental y las ideas ilustradas, y difundió los principios de libertad, igualdad y soberanía nacional.',
        concepts: ['Antiguo Régimen y sociedad estamental', 'Toma de la Bastilla (14 de julio de 1789)', 'Declaración de los Derechos del Hombre', 'Del Terror al Directorio'],
        quiz: [
          { q: '¿En qué año comenzó la Revolución Francesa?', options: ['1776', '1789', '1815'], answer: 1 },
          { q: '¿Qué documento proclamó la igualdad ante la ley?', options: ['Declaración de los Derechos del Hombre', 'Código Napoleónico', 'Edicto de Nantes'], answer: 0 },
        ],
      },
    },
    {
      id: 'fis', name: 'Física',
      outline: [
        ['Datos y diagrama', 'Se listan las magnitudes con sus unidades y se dibuja el diagrama de fuerzas.'],
        ['Aplicación de leyes', 'Se aplican las leyes de Newton o las ecuaciones de movimiento que correspondan.'],
        ['Resultado', 'Se expresa el resultado con unidades y cifras significativas correctas.'],
      ],
      guide: {
        summary: 'Las leyes de Newton relacionan fuerza y movimiento: inercia, F = m·a y acción-reacción. Con ellas se analiza cualquier sistema mecánico sencillo.',
        concepts: ['Primera ley: inercia', 'Segunda ley: F = m·a', 'Tercera ley: acción y reacción', 'Diagramas de cuerpo libre'],
        quiz: [
          { q: 'Una fuerza de 10 N sobre 2 kg produce una aceleración de:', options: ['20 m/s²', '5 m/s²', '0,2 m/s²'], answer: 1 },
          { q: 'Si la fuerza neta es cero, el cuerpo:', options: ['Siempre está en reposo', 'Mantiene su velocidad', 'Acelera'], answer: 1 },
        ],
      },
    },
    {
      id: 'len', name: 'Lengua',
      outline: [
        ['Tesis', 'Se presenta la idea central que defiende el texto.'],
        ['Argumentos', 'Se desarrollan los argumentos con citas y ejemplos de la obra.'],
        ['Cierre', 'Se retoma la tesis y se ofrece una valoración personal.'],
      ],
      guide: {
        summary: 'El comentario de texto identifica tema, estructura y recursos literarios, y los relaciona con la intención del autor y su contexto.',
        concepts: ['Tema e idea principal', 'Estructura interna y externa', 'Figuras retóricas', 'Valoración crítica'],
        quiz: [
          { q: '«Sus cabellos son oro» es una:', options: ['Metáfora', 'Hipérbole', 'Anáfora'], answer: 0 },
          { q: 'La estructura interna de un texto se refiere a:', options: ['Sus párrafos y estrofas', 'La organización de sus ideas', 'Su tipografía'], answer: 1 },
        ],
      },
    },
    {
      id: 'qui', name: 'Química',
      outline: [
        ['Ecuación', 'Se escribe y se balancea la ecuación química.'],
        ['Cálculo', 'Se convierten las cantidades a moles y se aplican las relaciones estequiométricas.'],
        ['Conclusión', 'Se indica el resultado y, si aplica, el reactivo limitante.'],
      ],
      guide: {
        summary: 'La estequiometría calcula las cantidades de reactivos y productos a partir de la ecuación balanceada, usando el mol como unidad de enlace.',
        concepts: ['Mol y masa molar', 'Balanceo de ecuaciones', 'Reactivo limitante', 'Rendimiento de reacción'],
        quiz: [
          { q: '¿Cuántos moles hay en 36 g de agua (18 g/mol)?', options: ['0,5', '2', '18'], answer: 1 },
          { q: 'El reactivo limitante es el que:', options: ['Sobra al final', 'Se consume primero', 'Tiene mayor masa'], answer: 1 },
        ],
      },
    },
  ],

  tasks: [
    t('t1', 'mat', 'Problemas de funciones cuadráticas', 1, 'pendiente', true, 'Resuelve los ejercicios 1 al 8 de la página 112 mostrando el procedimiento.'),
    t('t2', 'his', 'Ensayo: causas de la Revolución Francesa', 2, 'pendiente', true, 'Redacta un ensayo de 500 palabras sobre las causas y consecuencias.'),
    t('t3', 'qui', 'Informe de laboratorio: estequiometría', 4, 'pendiente', false, 'Entrega el informe con ecuación balanceada, cálculos y conclusión.'),
    t('t4', 'his', 'Ensayo Revolución Industrial', -2, 'resuelta', true, 'Ensayo de 400 palabras.'),
    t('t5', 'mat', 'Ecuaciones de segundo grado', -3, 'resuelta', true, 'Ejercicios 1 al 10.'),
    t('t6', 'fis', 'Problemas de leyes de Newton', -4, 'resuelta', true, 'Resuelve los cinco problemas del anexo.'),
    t('t7', 'len', 'Comentario de texto: Machado', -5, 'resuelta', false, 'Comenta el poema indicado.'),
    t('t8', 'qui', 'Balanceo de ecuaciones', -6, 'resuelta', true, 'Balancea las doce ecuaciones.'),
    t('t9', 'mat', 'Factorización de polinomios', -8, 'resuelta', false, 'Hoja de ejercicios 3.'),
    t('t10', 'fis', 'Cinemática: tiro parabólico', -9, 'resuelta', true, 'Problemas 4 al 9.'),
    t('t11', 'len', 'Resumen: La casa de Bernarda Alba', -11, 'resuelta', true, 'Resumen del primer acto.'),
    t('t12', 'his', 'Línea de tiempo: siglo XIX', -12, 'resuelta', false, 'Elabora una línea de tiempo.'),
    t('t13', 'qui', 'Tabla periódica: tendencias', -14, 'resuelta', false, 'Cuestionario de diez preguntas.'),
    t('t14', 'mat', 'Sistemas de ecuaciones', -15, 'resuelta', true, 'Ejercicios 1 al 6.'),
    t('t15', 'fis', 'Trabajo y energía', -17, 'resuelta', false, 'Problemas del capítulo 6.'),
  ],

  exams: [
    { id: 'e1', subjectId: 'mat', title: 'Examen parcial de Matemáticas', inDays: 5, topics: ['Ecuaciones de segundo grado', 'Funciones cuadráticas', 'Sistemas de ecuaciones'] },
    { id: 'e2', subjectId: 'his', title: 'Examen de Historia: revoluciones', inDays: 9, topics: ['Revolución Francesa', 'Revolución Industrial'] },
    { id: 'e3', subjectId: 'fis', title: 'Examen de Física: dinámica', inDays: 14, topics: ['Leyes de Newton', 'Trabajo y energía'] },
  ],
};
