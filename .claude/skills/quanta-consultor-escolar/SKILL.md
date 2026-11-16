---
name: quanta-consultor-escolar
description: Mejorar el agente de preguntas y respuestas dentro de una aplicación escolar llamada Quanta AI, construida con Claude y HTML/JavaScript. Usar cuando se solicite consultar evaluaciones, tareas pendientes, checkpoints, porcentajes, fechas de entrega y asignaturas con preguntas genéricas en español, sin Gmail, usando datos obtenidos de Quanta mediante acceso permitido o importaciones verificables. Auditar el código existente, conservar su diseño y funcionalidades, implementar una fuente de información de solo lectura y respuestas trazables, y probar el resultado.
---

# Quanta Consultor Escolar

## Propósito

Convertir el módulo actual «Agente de estudio» de Quanta AI en un chat funcional, integrado en la misma aplicación y accesible mediante preguntas libres: «¿Qué tengo esta semana?», «¿Qué tareas debo hacer?», «¿Tengo checkpoints que valen 15 %?». No requerir al estudiante pegar prompts en Claude para cada consulta. No usar Gmail como fuente de datos.

## Regla fundamental sobre Quanta y la cuenta

- La cuenta personal del estudiante no equivale a permiso para automatizar la extracción del servicio. Consultar primero las reglas aplicables de Quanta y cualquier permiso del colegio.
- Preferir un mecanismo oficialmente autorizado: API de lectura, exportación ofrecida por Quanta, o integración autorizada expresamente.
- Cuando esté permitido leer Quanta en un navegador asistido por Claude, utilizar una sesión visible que haya iniciado **el usuario**, con acceso a sus propios cursos, en modo **solo lectura**. Detenerse y solicitar que el usuario complete en el propio sitio los pasos de autenticación. No recibir contraseñas, códigos MFA o cookies a través del chat; no capturarlos ni guardarlos en HTML.
- No saltarse CAPTCHA, medidas de acceso, políticas técnicas ni restricciones de Quanta. No programar extracción o navegación en segundo plano sin autorización. Si no existe permiso de integración, usar importación explícita de un archivo propio y etiquetar los resultados como datos importados.
- Una Skill por sí sola no inicia sesiones, otorga permisos, configura conectores ni proporciona acceso permanente a Quanta. No afirmar que el chat de la web puede entrar en Quanta simplemente porque Claude en Chrome puede leer una pestaña autenticada.
- No enviar, editar, completar ni marcar como entregadas tareas o evaluaciones en Quanta. No ocultar actividad ni suplantar al estudiante.

## Leer los archivos complementarios

1. Leer [references/ARQUITECTURA.md](references/ARQUITECTURA.md) para seleccionar el método de acceso, distinguir Claude en el navegador del agente dentro de la web y definir la implementación por etapas.
2. Leer [references/CONTRATO_DATOS.md](references/CONTRATO_DATOS.md) para el esquema, procedencia, sincronización, normalización de fechas y clasificación.
3. Leer [references/PRUEBAS.md](references/PRUEBAS.md) para comprobar casos de preguntas y prevenir falsas promesas.
4. Consultar [assets/INSTRUCCION_PARA_CLAUDE.md](assets/INSTRUCCION_PARA_CLAUDE.md) como encargo breve reutilizable del propietario de la aplicación.

## Flujo obligatorio de trabajo sobre la aplicación

### 1. Inspeccionar antes de editar

- Recibir el **proyecto actual** o el HTML real. Localizar servicios de datos, estados, vistas, botones y rutas. No suponer que el archivo antiguo es idéntico al actual.
- Si el proyecto corresponde a `Quanta_AI_Agente_Estudio.html`, inspeccionar especialmente `src/screens/agent.js`, `src/services/daily-agent.js`, `src/services/server-agent.js`, `src/services/ai.js`, `src/state/store.js` y el router de acciones; se encuentran embebidos como módulos en el HTML compilado.
- Reconocer que en esa versión las fichas locales son aproximaciones y el backend local requiere una API externa. No presentar datos de prueba como sincronización real.
- Guardar copia de seguridad antes de cambiar y escribir el inventario de funciones que no deben romperse: inicio, materias, tareas, exámenes, modal de estudio, PIN, navegación inferior, colores, modo claro/oscuro y ajustes.

### 2. Implementar consultas en lenguaje natural

- Añadir un campo de texto y un historial corto en la vista existente del agente, sin rehacer la interfaz.
- Proponer accesos rápidos no obligatorios: «Esta semana», «Pendientes», «Exámenes», «Checkpoints ≥15 %».
- Resolver localmente las preguntas de agenda por filtros deterministas (tiempo, materia, estado, tipo, porcentaje), de forma rápida y gratuita. Integrar un modelo de IA en el backend solo cuando sea necesario interpretar peticiones complejas; nunca enviar claves del modelo al navegador.
- Tratar como información distinta: tareas de práctica, evaluaciones, exámenes, checkpoints, trabajos, calificaciones y entregas. No inventar estados.
- Para consultas relativas de tiempo, usar `America/Caracas` como zona horaria escolar por defecto, configurable por el usuario. Semana = lunes a domingo; «mañana» = día siguiente en esa zona.
- Responder en español venezolano sencillo y claro: primero la respuesta; después, materia, fecha y peso si constan; finalmente indicar cuándo se comprobó la fuente.
- Si no hay tareas comprobadas, decir «No encuentro tareas en los datos disponibles»; no decir «No tienes tareas» como certeza.
- Si falta la fecha o el porcentaje, decir «No especificado». No inventar tareas, notas, plazos o avisos.

### 3. Conectar la fuente de datos

- Implementar un adaptador `QuantaReadOnlyProvider` solo sobre un método de acceso autorizado. Una sesión del navegador utilizada por Claude para consultar Quanta es distinta de un acceso persistente del backend de Quanta AI.
- Si el navegador asistido por Claude está habilitado y autorizado, permitir que Claude **consulte a petición del usuario** secciones relevantes de Quanta (panel, tareas, evaluaciones) sin efectuar envíos; mostrar un resumen al usuario. Para llevar esa información a la app, utilizar un flujo de importación/actualización aprobado y explícito, sin exponer credenciales.
- Si la plataforma permite exportación, incorporar importación de CSV/JSON u otro formato provisto por el usuario, con validación y previsualización antes de sustituir datos locales.
- Si no se puede conectar directamente, mantener el chat disponible con datos importados, mostrar «Última actualización» y ofrecer «Actualizar datos» con instrucciones factibles. No fingir conectividad.

### 4. Seguridad y preservación

- No incluir nombres completos, emails, identificadores escolares, contraseñas, cookies ni tokens de sesión en el código cliente, prompts, registros de depuración o capturas compartidas.
- Respetar el principio de mínimo privilegio y lectura únicamente. No enviar información de otros estudiantes o docentes a proveedores de IA.
- Reutilizar componentes y paleta. No eliminar módulos. El PIN local no debe presentarse como sustituto de autenticación de servidor.
- Separar los datos de demo de los reales y etiquetar su procedencia. Persistir únicamente lo necesario.

### 5. Verificar y entregar

- Ejecutar la matriz de pruebas de `references/PRUEBAS.md`, incluyendo fecha de cambio de semana, tareas sin fecha y valor del 15 % exacto.
- Entregar código actualizado y diff/registro de cambios. Documentar qué está operativo de verdad y qué requiere sesión, autorización, despliegue o credenciales fuera del código.
- No declarar «conectado a Quanta», «sincronización diaria activa» o «Chat con IA real» sin una prueba de extremo a extremo que lo demuestre.

## Formato de respuesta del agente dentro de Quanta AI

**[Resumen de la consulta]**

- **Materia y tarea:** [valor disponible].
- **Fecha:** [fecha local o no especificada].
- **Ponderación:** [porcentaje o no especificado].
- **Estado:** [estado comprobado o desconocido].

*Fuente: [Quanta autorizado o archivo importado] · Actualizado: [fecha/hora verificable].*

Para varias tareas, compactar en una lista ordenada por fecha. No hacer preguntas de aclaración si la consulta se puede resolver con los datos existentes.
