# Auditoría de seguridad — Quanta AI

Realizada con la skill `ciberseguridad-app-escolar` (`.claude/skills/`), referencias OWASP ASVS 5.0.0,
API Security Top 10 2023 y Top 10 for LLM Applications 2025. Fecha: 2026-11-16.

## Resumen técnico

- **Stack confirmado:** frontend estático (HTML, CSS y JavaScript con módulos ES), sin dependencias npm; empaquetador propio (`scripts/build.mjs`). Publicación como artefacto privado de claude.ai. **No hay backend, base de datos, cuentas de usuario ni API de IA conectada.**
- **Revisado:** todo el código del repositorio, historial de git, scripts de integración, datos locales en `private/` y la configuración de red de la sesión.
- **Hallazgos:** 1 crítico, 1 alto, 2 medios y 2 bajos. 4 corregidos y 2 que dependen del usuario.
- **Integración escolar:** **sustituida por importación manual.** Quanta no ofrece una API oficial para terceros y no hay autorización verificable.
- **Se conservan:** el diseño, la navegación, Estudiante Pro, el bloqueo con PIN y los datos ya importados.

## Matriz de hallazgos

| ID | Severidad | Evidencia | Riesgo | Acción | Estado | Prueba |
|---|---|---|---|---|---|---|
| SEC-001 | Crítica | Contraseñas de Quanta escritas en el chat de desarrollo (no en el repositorio) | Cualquiera con acceso al historial del chat puede entrar a la cuenta del alumno | Cambiar la contraseña en Quanta. Verificado: no figura en archivos ni en git | **Pendiente del usuario** | Búsqueda en el historial de git: 0 coincidencias |
| SEC-002 | Alta | `scripts/quanta-sync.cjs` (versión eb826a5–abc7ef7) | Automatiza el inicio de sesión y lee una API privada de Quanta sin autorización del proveedor ni del colegio. Además, manejaba la contraseña del alumno | Script desactivado; importación manual `.ics`/`.json` en la app; hosts de Quanta propuestos para retirar de la red | Corregido | `quanta-sync` termina con código 1 |
| SEC-003 | Media | `src/screens/*.js`: identificadores y números externos insertados en HTML sin validar (p. ej. `tasks.js:28-29`, `home.js:64`) | Datos de Quanta o un `localStorage` manipulado ejecutaban código en la app (reproducido en abc7ef7) | `src/state/schema.js` valida todos los datos (ids con formato seguro, números reales, textos acotados) al cargar, importar y restaurar | Corregido | Inyección reproducida antes; bloqueada después |
| SEC-004 | Media | Petición para Claude con títulos copiados de Quanta | Inyección de instrucciones a través del contenido escolar | Los títulos van entre comillas, marcados como datos; la petición no incluye nombre ni correo | Corregido | Pruebas de privacidad IA |
| SEC-005 | Baja | `index.html` sin políticas de seguridad | Sin límite para cargar o enviar recursos | CSP estricta (`connect-src 'none'`, `default-src 'none'`) y `no-referrer` | Corregido | La app funciona sin violaciones de CSP; `fetch` externo bloqueado |
| SEC-006 | Baja | Datos personales incrustados en `private/quanta-ai.html`; el PIN solo bloquea la interfaz | Quien tenga el archivo o el teléfono desbloqueado y conocimientos técnicos puede leer los datos | El enlace es privado; `private/` está fuera de git. Se recomienda borrar `private/quanta-raw.json` (volcado completo) | Riesgo residual documentado | — |

Falsos positivos del script heurístico: `$$eval` en `quanta-sync.cjs` (método de Playwright, no `eval`). Las asignaciones a `innerHTML` en `main.js` y `ui.js` se revisaron: el contenido variable se escapa con `esc()` o pasa por la validación de esquema.

## Controles OWASP aplicados

| Control | Estado |
|---|---|
| API1/API5 Autorización por objeto o función | No aplica: no hay backend ni varios usuarios. Cada navegador solo ve sus propios datos |
| API2 Autenticación | Sin cuentas propias. Bloqueo local con PIN (PBKDF2-SHA256, 150 000 iteraciones, sal aleatoria, comparación en tiempo constante, espera creciente) |
| API4 Consumo de recursos | Importación limitada a 1 MB y 500 eventos; textos y listas acotados |
| API6 Flujos sensibles | La app no escribe en Quanta: no entrega, no responde quizzes y no marca nada |
| API7 SSRF | No hay peticiones salientes desde la app (CSP `connect-src 'none'` en desarrollo) |
| API10 Uso inseguro de APIs | Validación de esquema de todos los datos externos |
| LLM01 Inyección de prompts | El contenido escolar se marca como datos; la IA no ejecuta acciones externas |
| Integridad académica | Estudiante Pro: no inventa datos ni promete evadir detectores |

## Cambios realizados

- `src/state/schema.js` (nuevo) y `src/state/store.js`: validación al cargar, importar y reiniciar. Sin impacto visual. Para revertir: `git revert`.
- `src/services/importer.js` (nuevo), `src/screens/sheets.js` y `src/main.js`: importación `.ics`/`.json` en Perfil → Conexión con Quanta.
- `scripts/quanta-sync.cjs`: desactivado. El código anterior queda en el historial (commit eb826a5).
- `src/screens/profile.js`: la etiqueta pasa de «Quanta Sync Activo» a «Quanta · datos importados», que es lo cierto.
- `src/services/estudiante-pro.js`: aislamiento de contenido externo en la petición para la IA.
- `index.html`: CSP y política de referrer.
- `tests/security.test.cjs` (nuevo): 24 pruebas con datos sintéticos.

## Pruebas

`node scripts/build.mjs && QUANTA_HTML=private/quanta-ai.html node tests/security.test.cjs` → **24 pasan, 0 fallan** (2026-11-16).
Comprobado también: la inyección se ejecutaba en la versión anterior (abc7ef7) y no en la actual.

**No ejecutadas, por no aplicar o por falta de autorización:** pruebas contra Quanta (sin permiso del proveedor), acceso cruzado entre alumnos, sesiones de servidor, CSRF, CORS y límites de peticiones del servidor (no hay backend).

## Pendiente

1. **SEC-001:** cambiar la contraseña de Quanta.
2. Borrar `private/quanta-raw.json` si ya no se necesita (minimización de datos).
3. Retirar `somosquanta.com`, `www.somosquanta.com` y `student.somosquanta.com` de la red permitida del entorno.
4. Si se añade un backend o una IA real: autenticación en el servidor, secretos fuera del frontend, cuotas y registro de acciones sin datos personales.
5. Integración futura solo con una API oficial de Quanta y autorización del colegio (OAuth con PKCE, permisos mínimos de lectura, revocación y borrado).

## Criterios de aceptación

1. Se conserva la experiencia visual y funcional legítima: **sí** (las pruebas recorren todas las pantallas).
2. No hay secretos en el frontend ni en el repositorio: **sí**. Credenciales expuestas en el chat: **pendiente de rotar**.
3. Cada usuario accede solo a sus datos: **no aplica** (app local de un solo usuario).
4. El proveedor escolar solo se conecta por canales oficiales: **sí** (sincronización no autorizada desactivada).
5. La IA no realiza acciones externas: **sí**.
6. No se afirman pruebas no realizadas: **sí** (ver la lista de no ejecutadas).
