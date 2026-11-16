# Quanta AI

Asistente académico móvil: sincroniza tareas de **Quanta**, genera borradores con IA para revisar
y prepara guías y simulacros de examen. Interfaz minimalista en Azul Eléctrico (`#2563EB`).

## Ejecutar
Sin dependencias ni compilación. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

### Versión de un solo archivo
```bash
node scripts/build.mjs   # genera dist/quanta-ai.html (se abre con doble clic, sin servidor)
```

### Datos de Quanta
La sincronización automática está **desactivada** (ver `SECURITY.md`, SEC-002): Quanta no ofrece una API oficial para terceros.
Para actualizar tus tareas usa **Perfil → Conexión con Quanta → Importar** con un calendario `.ics` o una copia `.json`, o añádelas con el botón +.
Los datos ya importados se empaquetan con `QUANTA_DATA=private/quanta-data.js node scripts/build.mjs` (`private/` está fuera de git).

### Pruebas
```bash
node scripts/build.mjs && node tests/security.test.cjs
```

## Estructura
```
index.html               Contenedor de la app
styles/app.css           Sistema de diseño (tokens, tarjetas, píldoras, navegación)
src/main.js              Router de pantallas y acciones
src/state/store.js       Estado global + persistencia (localStorage) + selectores
src/data/mock.js         Datos de demostración (materias, tareas, exámenes)
src/services/quanta.js   Conector de Quanta (simulado)
src/services/ai.js       Motor de IA (simulado): resolución y guías
src/components/          UI compartida (iconos, hoja inferior, toast) y barra de navegación
src/screens/             Inicio, Materias, Mis Tareas, Exámenes, Perfil y hojas modales
docs/ARQUITECTURA.md     Arquitectura del sistema y API prevista
scripts/build.mjs        Empaquetador sin dependencias → dist/quanta-ai.html
```

## Pantallas
- **Inicio**: saludo, sugerencia de estudio (tarjeta oscura), banner azul de tareas pendientes, métricas.
- **Mis Tareas**: filtros `Todas / Pendientes / Resueltas IA / Para Examen`, resolución simulada con IA.
- **Perfil**: métricas académicas, barra de preparación y configuración.
- Modo claro y oscuro automático según el sistema.
- Extra: **Materias**, **Exámenes** y botón central **+** para añadir tareas.

> La IA y Quanta están simulados en esta versión. Los borradores deben revisarse antes de entregarse.

## Seguridad
- **Bloqueo con PIN** (Perfil → Seguridad): el PIN no se guarda, solo un hash PBKDF2-SHA256 con sal aleatoria.
- **Bloqueo automático** al salir de la app y tras 2 minutos sin uso; los datos no se muestran mientras está bloqueada.
- **Límite de intentos**: tras 3 fallos espera 30 s, y el tiempo se duplica con cada fallo extra (persiste al recargar).
- **Borrado del dispositivo**: elimina marcas, ajustes y PIN guardados en el navegador.
- **Integración con Quanta**: sin acceso automatizado; solo importación manual validada. Informe completo en `SECURITY.md`.
- **Validación de datos**: todo lo que llega de archivos o del navegador se valida antes de mostrarse (`src/state/schema.js`).
- El bloqueo protege la pantalla; el enlace publicado de la app es privado.

## Estudiante Pro
Skill en `.claude/skills/estudiante-pro/` (Claude la usa al trabajar en este proyecto) e integrada en la app (`src/services/estudiante-pro.js`):
cada tarea recibe el formato escolar que corresponde (ensayo, laboratorio, prueba, oral, proyecto, portafolio, problemas…),
supuestos, estructura, qué personalizar, preguntas de defensa, lista de revisión de calidad y una petición lista para copiar en Claude.
No inventa datos, experiencias ni fuentes, y no promete evadir detectores de IA.
