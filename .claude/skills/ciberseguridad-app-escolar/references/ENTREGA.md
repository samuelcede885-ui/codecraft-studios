# Formato de entrega y definición de calidad

## Resumen técnico (máximo 10 líneas)

- Stack confirmado / no verificado
- Entornos revisados
- Qué pudo inspeccionarse realmente
- Número de hallazgos por severidad
- Cambios aplicados y funcionalidades conservadas
- Integración escolar: autorizada, no verificada o sustituida por importación manual

## Matriz de seguridad

| ID | Severidad | Evidencia/archivo | Riesgo | Acción | Estado | Prueba |
|---|---|---|---|---|---|---|
| SEC-001 | Alta | ruta:línea | Describir hallazgo real | Cambio concreto | Corregido/Pendiente | Ejecutada/No ejecutada |

No atribuir severidad crítica si no existe una ruta realista de explotación; usar hipótesis explícitas para riesgos no verificados.

## Cambios propuestos o realizados

Para cada modificación indicar: archivo(s), problema, cambio mínimo, impacto UX, migración de datos si aplica, riesgos residuales y forma de revertir.

## Plan de pruebas

- Unitarias e integración locales, permisos cruzados, sesiones, importación de archivos, aislamiento de datos de IA.
- Resultados reales con comando y fecha cuando se ejecutaron.
- Limitaciones (faltan credenciales de prueba no sensibles, backend no disponible, integración sin autorización, etc.).
- Antes de despliegue: copia, plan rollback, revisión de variables de entorno, verificación en staging propio.

## Criterios de aceptación

1. La app conserva la experiencia visual y funcional legítima.
2. Ningún secreto aparece en frontend o repositorio; credenciales expuestas se revocan.
3. Cada usuario accede únicamente a sus datos mediante controles backend.
4. El proveedor escolar solo se conecta mediante canales oficiales y autorizados.
5. La IA no puede realizar acciones externas de alto impacto sin permisos y revisión humana.
6. No se afirma haber realizado pruebas ni actualizaciones que no se hicieron.
