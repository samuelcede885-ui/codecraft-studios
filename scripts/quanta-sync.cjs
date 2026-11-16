// DESACTIVADO (auditoría de seguridad SEC-002, ver SECURITY.md).
//
// Este script entraba al portal de estudiantes de Quanta con usuario y contraseña y
// leía su API privada. Quanta no publica una API ni un acceso OAuth para terceros y no
// hay una autorización verificable del proveedor ni del colegio para automatizarlo:
// tener cuenta de estudiante no equivale a permiso para extraer datos con un bot.
//
// Alternativas autorizadas:
//   1. Importar en la app (Perfil → Importar tareas) un calendario .ics que exportes tú.
//   2. Añadir tareas a mano con el botón +.
//   3. Si Quanta o el colegio aprueban una API oficial (idealmente OAuth con PKCE),
//      implementar la conexión sobre esa API con permisos de solo lectura.
//
// La versión anterior se conserva en el historial de git (commit eb826a5).
console.error('La sincronización automática con Quanta está desactivada. Lee SECURITY.md (SEC-002).');
process.exit(1);
