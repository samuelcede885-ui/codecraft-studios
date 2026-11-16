# Ciberseguridad App Escolar - Skill para Claude

Skill defensiva para auditar y mejorar una aplicación educativa con IA. No conecta ni modifica ningún sistema escolar por sí misma.

## Instalar en Claude

1. En Claude, abrir Customize > Skills.
2. Elegir + > Create skill > Upload a skill (si esa función está disponible en el plan).
3. Subir el archivo ZIP de esta carpeta y activarla.
4. Compartir con Claude el código de la **aplicación propia**, sin incluir credenciales, secretos ni información privada de estudiantes.

## Ejemplo de instrucción

> Usa Ciberseguridad App Escolar para auditar mi aplicación. Examina el código que te adjunto y prioriza vulnerabilidades reales según OWASP. Corrige lo que sea seguro modificar sin cambiar el diseño ni romper funcionalidades. Mi plataforma escolar solo puede integrarse mediante APIs documentadas que tenga permiso para usar; si no hay API aprobada, implementa importación manual. Ejecuta pruebas locales y detalla qué verificaste y qué quedó pendiente.

## Material incluido

- `SKILL.md`: flujo operativo y límites de seguridad.
- `references/`: listas de control, privacidad de IA, integraciones permitidas, formato de reporte y fuentes oficiales.
- `scripts/audit_local.py`: comprobaciones locales **solo lectura** de patrones de riesgo, sin peticiones de red y sin imprimir valores sensibles.

La Skill no constituye una auditoría certificada. Es una guía de trabajo para Claude; las mejoras concretas requieren acceso legítimo al código y prueba de funcionamiento.
