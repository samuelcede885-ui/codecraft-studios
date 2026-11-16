# Lista de verificación de seguridad (auditoría práctica)

Clasificar cada requisito como PASA / FALLA / NO VERIFICADO / NO APLICA. Identificar la prueba concreta para cada caso. No confundir un hallazgo heurístico con una vulnerabilidad demostrada.

## P0 - Críticos / antes de publicar

- [ ] Ningún secreto real (API key, contraseña, cookie, refresh token, certificado) figura en frontend, repositorio, logs ni chat con IA. Si se filtró, **revocar/rotar** y evaluar impacto, no solo borrar el texto.
- [ ] Cada endpoint de negocio verifica sesión y permisos en el **servidor**, incluidas consultas por ID, exportaciones, archivos y mutaciones. Hacer pruebas de acceso entre dos alumnos ficticios.
- [ ] El acceso a datos académicos se limita al usuario autorizado (y, cuando aplique, a docentes/tutores con derecho de acceso). Revisar IDOR/BOLA, reglas RLS y claves con privilegios elevados.
- [ ] No hay acciones sobre sistema escolar externo sin canal oficial, permisos aplicables y autenticación legítima.
- [ ] La IA no puede enviar tareas, alterar calificaciones, crear cuentas ni leer datos de terceros por instrucciones contenidas en documentos externos.
- [ ] Todo el tráfico de autenticación y datos privados se realiza mediante HTTPS/TLS válidos; sin bypass de verificación de certificados.

## P1 - Altos

- [ ] Contraseñas gestionadas por proveedor fiable o hash resistente (Argon2id cuando corresponda); nunca texto plano.
- [ ] Cookies/sesiones con HttpOnly, Secure, SameSite apropiado; controles de CSRF para rutas que dependan de cookies; expiración y cierre de sesión.
- [ ] Prevención de login abusivo y límites por usuario/IP según riesgo, sin bloquear indiscriminadamente a alumnos.
- [ ] Validación de entradas en servidor; consultas parametrizadas; codificación de salida; no renderizar HTML arbitrario sin sanitizar ni una justificación revisada.
- [ ] CORS con orígenes exactos necesarios, jamás comodín junto a credenciales.
- [ ] Protección ante SSRF: solicitudes salientes a destinos permitidos y validados, sin usar URLs arbitrarias suministradas por usuarios o por el modelo.
- [ ] Gestión de dependencias: lockfile, actualizaciones selectivas, herramientas de análisis de dependencias y comprobación de cambios incompatibles.
- [ ] Usuarios con permisos mínimos; claves técnicas sin alcance administrativo para operaciones corrientes.
- [ ] Copias de seguridad cifradas y restauración probada con datos ficticios.

## P2 - Medios / resiliencia y UX

- [ ] Cabeceras y políticas por contexto: CSP, HSTS, referrer-policy, frame-ancestors y políticas de caché para datos personales.
- [ ] Logs mínimos de seguridad: quién accedió, cuándo, resultado, operación, ID de correlación; sin contraseñas, tokens o contenido completo de trabajos/expedientes.
- [ ] Alertas por fallos de autenticación inusuales y acciones privilegiadas; acceso a registros restringido y retención proporcional.
- [ ] Prevención de pérdida de datos: exportación/borrado, tiempo de retención y procedimiento para solicitudes de privacidad.
- [ ] Políticas de proveedores de IA, almacenamiento y hosting revisadas; región y transferencias de datos personales evaluadas según ley aplicable.
- [ ] Consentimientos y avisos de privacidad claros para estudiantes y, cuando proceda, padres/tutores o institución.
- [ ] Rutas de error no revelan stack traces, variables de entorno ni IDs internos sensibles.
- [ ] Pruebas de regresión de UX y rendimiento móvil después de cambios de seguridad.

## Controles vinculados a OWASP API Top 10 2023

| Riesgo | Prueba defensiva |
|---|---|
| API1 BOLA | Dos alumnos de prueba: el alumno A nunca puede leer/modificar el objeto de B |
| API2 Authentication | Las llamadas sin token o con sesión expirada reciben rechazo consistente |
| API3 Property-level authorization | Campos internos o privados no aparecen en respuestas públicas |
| API4 Resource consumption | Rate limits, timeouts, límites de payload y cuotas de inferencia IA |
| API5 Function-level authorization | Un estudiante no puede ejecutar funciones administrativas |
| API6 Sensitive business flows | Acciones sensibles requieren autorización y revisión humana |
| API7 SSRF | El backend no sigue URL externas arbitrarias procedentes de entradas del usuario o IA |
| API8 Misconfiguration | Entornos de desarrollo desactivados, headers y CORS restringidos |
| API9 Inventory | Lista de endpoints documentada y actualizada; retirados los no usados |
| API10 Unsafe APIs | Validar esquema de respuestas de terceros; fallar de modo seguro |

## Pruebas permitidas

Usar solo pruebas unitarias, de integración, inspección estática y QA con cuentas y recursos propios o un entorno autorizado. Si solo se dispone de la URL del colegio, no sondearla. Si hay duda de autorización, proponer checklist de revisión humana, no probar contra producción.
