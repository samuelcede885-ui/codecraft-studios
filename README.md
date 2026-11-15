# Quanta AI

Asistente académico móvil: sincroniza tareas de **Quanta**, genera borradores con IA para revisar
y prepara guías y simulacros de examen. Interfaz minimalista en Azul Eléctrico (`#2563EB`).

## Ejecutar
Sin dependencias ni compilación. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
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
```

## Pantallas
- **Inicio**: saludo, sugerencia de estudio (tarjeta oscura), banner azul de tareas pendientes, métricas.
- **Mis Tareas**: filtros `Todas / Pendientes / Resueltas IA / Para Examen`, resolución simulada con IA.
- **Perfil**: métricas académicas, barra de preparación y configuración.
- Extra: **Materias**, **Exámenes** y botón central **+** para añadir tareas.

> La IA y Quanta están simulados en esta versión. Los borradores deben revisarse antes de entregarse.
