# Quanta Consultor Escolar — Skill para Claude

Skill de implementación y auditoría para mejorar las preguntas naturales en la aplicación Quanta AI.

**Alcance:** chat de consultas sobre agenda escolar con datos verificables, procedentes de una fuente de Quanta expresamente autorizada o un archivo aportado por el estudiante. Sin Gmail, automatización furtiva ni envíos a Quanta.

## Uso

1. Importa el ZIP de la Skill en Claude (cuando tu plan admita Skills).
2. Adjunta el código actual de Quanta AI, idealmente el proyecto original y no solo capturas.
3. Copia el encargo de `assets/INSTRUCCION_PARA_CLAUDE.md`.
4. Si deseas ver páginas de Quanta, inicia sesión tú mismo en un navegador con Claude y confirma que el acceso asistido esté permitido. No pegues credenciales en el chat.
5. Comprueba las pruebas de `references/PRUEBAS.md` antes de publicar cambios.

**Advertencia:** una Skill no otorga acceso a una cuenta ni crea conectividad de backend. La lectura directa requiere herramientas de navegador compatibles y autorización o una API/exportación permitida. Se recomienda no incrustar datos privados en HTML público.
