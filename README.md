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

### Datos reales de Quanta
```bash
Q_USER=correo Q_PASS=contraseña node scripts/quanta-sync.cjs   # lee el portal (solo lectura) → private/quanta-raw.json
node scripts/quanta-import.cjs                                  # → private/quanta-data.js
QUANTA_DATA=private/quanta-data.js node scripts/build.mjs       # → private/quanta-ai.html
```
`private/` está excluida de git porque contiene datos personales.

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
- **Credenciales de Quanta**: `quanta-sync.cjs` pide la contraseña oculta y no la escribe en archivos; los datos personales quedan en `private/`, fuera de git.
- El bloqueo protege la pantalla; el enlace publicado de la app es privado.
