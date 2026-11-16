# Integración autorizada con una plataforma escolar

## Decisión inicial

1. Identificar qué plataforma usa el colegio y quién controla el acceso; **no asumir** permisos por el mero hecho de disponer de usuario y contraseña.
2. Leer términos de uso, documentación oficial de API/SSO y condiciones que afecten a menores o datos educativos.
3. Pedir al propietario de la integración confirmar alcance autorizado. Nunca pedir credenciales en texto plano.
4. Si hay API oficial aprobada, diseñar sincronización limitada al titular y a las operaciones permitidas.
5. Si no existe una API oficial accesible o falta aprobación, diseñar una importación local de archivo oficial exportado por el estudiante, o introducir las tareas manualmente en un calendario/organizador propio.

## Patrón de arquitectura recomendado

```text
Estudiante -> App propia -> Backend propio -> Base de datos con control por usuario
                                   |
                                   +-> Modelo de IA (solo mínimos datos necesarios)
                                   |
                                   +-> API escolar DOCUMENTADA Y AUTORIZADA (opcional)

Alternativa sin API: Estudiante -> Archivo exportado voluntariamente -> Importador local -> App propia
```

- OAuth authorization code + PKCE si el proveedor lo ofrece y la aplicación cumple RFC 9700; RFC 10017 para apps basadas en navegador.
- Usar permisos (`scopes`) mínimos, consentimiento comprensible, revocación, expiración/rotación de tokens, límites de peticiones y almacenamiento protegido.
- No compartir contraseñas escolares con Claude ni reproducir cookies de navegador en una automatización.
- No sincronizar datos de otros alumnos, exámenes no publicados ni recursos fuera del permiso otorgado.
- **No escribir a la plataforma** (entregar tareas, responder quizzes, cambiar datos) salvo que exista autorización explícita para ese flujo, que el proveedor lo admita y que el usuario confirme cada acción relevante.
- Mantener eventos de auditoría propios para investigar fallos sin exponer contenidos sensibles; no borrar ni manipular logs del proveedor.

## Lo que la privacidad NO implica

El tráfico hacia un servicio externo puede quedar registrado por ese servicio (inicio de sesión, llamadas de API, horarios, volúmenes y otros metadatos). El cifrado TLS protege el contenido frente a terceros de la red, pero no hace invisible al cliente para el servidor al que se conecta. Una VPN o un proxy tampoco ofrecen una garantía de indetectabilidad. No diseñar técnicas de ocultación, evasión, suplantación o bypass de monitoreo.

## Alternativa funcional sin integración remota

Ofrecer módulos de calendario, recordatorios locales, importación manual de tareas, lectura de PDFs/CSV/ICS exportados legítimamente, planificación de estudio, explicación de contenidos, práctica con preguntas propias y revisión con fuentes. Etiquetar claramente datos «sincronizados» vs. «importados manualmente» y mostrar su fecha de actualización.
