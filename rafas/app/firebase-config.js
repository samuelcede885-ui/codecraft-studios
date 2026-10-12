// Configuración de Firebase.
// 1. En la consola de Firebase: Configuración del proyecto › Tus apps › App web › "Configuración del SDK".
// 2. Copia el objeto firebaseConfig aquí abajo (no es secreto: va dentro de cualquier app web).
// Mientras FIREBASE_CONFIG sea null, la app funciona en "modo local" (pedidos solo en este navegador).
window.FIREBASE_CONFIG = null;
/* Ejemplo:
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123",
};
*/

// Clave para avisos push: Configuración del proyecto › Cloud Messaging › Certificados push web › "Generar par de claves".
window.FIREBASE_VAPID_KEY = "";

// Identificador del local dentro de la base de datos (permite varios restaurantes en el mismo proyecto).
window.STORE_ID = "rafas";

// Solo para pruebas en la computadora con el emulador de Firebase.
window.FIREBASE_EMULATORS = false;
