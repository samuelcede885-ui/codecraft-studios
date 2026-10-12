# Publicar Burger Shack con Firebase (Fase 1)

Con esto la tienda y la app del dueño quedan en internet, conectadas: un cliente pide desde su teléfono y le llega al dueño al instante, con el comprobante, aunque estén en ciudades distintas.

Tiempo estimado: 1 hora la primera vez.

## Qué queda funcionando

- **Tienda** en `https://TU-PROYECTO.web.app` (o tu dominio).
- **App del dueño** en `https://TU-PROYECTO.web.app/#panel`, instalable en el teléfono.
- **Inicio de sesión:** el dueño y cada empleado entran con su correo; cada uno tiene un rol (dueño, administrador, caja, cocina, delivery).
- **Seguridad:** el servidor calcula precios, stock e IGTF. Un cliente no puede cambiar precios, ver pedidos ajenos ni crear pedidos falsos.
- **Comprobantes** guardados aparte y privados: solo los ven el cliente que los subió y el equipo.
- **Avisos push** al teléfono del dueño aunque la app esté cerrada.
- **Tasa BCV automática** tres veces al día.

## 1. Crear el proyecto de Firebase

1. Entra a <https://console.firebase.google.com> con una cuenta de Google (mejor una del negocio).
2. **Agregar proyecto** → nombre, por ejemplo `burgershack-pedidos`. Google Analytics: puedes desactivarlo.
3. Abajo a la izquierda, cambia el plan a **Blaze (pago por uso)**. Las funciones del servidor y el almacenamiento de comprobantes lo exigen. Tiene una capa gratuita amplia: un restaurante pequeño normalmente paga 0 $ o muy poco.
   - Pon una **alerta de presupuesto** (por ejemplo 5 $) en Google Cloud › Facturación › Presupuestos, para que te avise si algo sube.

## 2. Activar los servicios

En el menú de la izquierda:

| Servicio | Qué hacer |
|---|---|
| **Authentication** | Comenzar › Método de acceso › activa **Correo electrónico/contraseña** y **Anónimo** (este último es para los clientes, que no necesitan crear cuenta). |
| **Firestore Database** | Crear base de datos › modo **producción** › ubicación `nam5 (us-central)`. |
| **Storage** | Comenzar › modo **producción** › misma ubicación. |
| **Cloud Messaging** | Configuración del proyecto (⚙️) › Cloud Messaging › *Certificados push web* › **Generar par de claves**. Copia la clave. |

## 3. Poner la configuración en la app

1. Configuración del proyecto (⚙️) › General › *Tus apps* › ícono **`</>`** (web) › nombre `burgershack` › Registrar.
2. Copia el objeto `firebaseConfig` que aparece.
3. Abre `burgershack/app/firebase-config.js` y reemplaza `window.FIREBASE_CONFIG = null;` por lo que copiaste:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "burgershack-pedidos.firebaseapp.com",
     projectId: "burgershack-pedidos",
     storageBucket: "burgershack-pedidos.firebasestorage.app",
     messagingSenderId: "...",
     appId: "...",
   };
   window.FIREBASE_VAPID_KEY = "la-clave-del-paso-2";
   ```

4. En `burgershack/.firebaserc`, cambia `PON-AQUI-EL-ID-DE-TU-PROYECTO` por el ID de tu proyecto (por ejemplo `burgershack-pedidos`).

## 4. Publicar

Necesitas una computadora con [Node.js 22](https://nodejs.org) instalado. En una terminal:

```bash
npm install -g firebase-tools
firebase login
cd burgershack/functions
npm install
cd ..
firebase deploy
```

La primera vez, `firebase deploy` te pide un **SETUP_CODE**: inventa un código secreto (por ejemplo `shack-2026-xK9`) y guárdalo. Es la llave para crear la cuenta del dueño.

Al terminar te muestra la dirección: `https://burgershack-pedidos.web.app`.

## 5. Crear la cuenta del dueño

1. Abre `https://burgershack-pedidos.web.app/#panel` en el teléfono del dueño.
2. Toca **Primera vez: crear cuenta del dueño**.
3. Escribe su correo, una contraseña y el SETUP_CODE del paso anterior.
4. Listo: queda como dueño. Nadie más puede volver a hacerlo, ni siquiera con el código.

Después, en **Más › Ajustes**:

- **Datos de pago** (Pago Móvil, transferencia, Zelle, Binance) que verán los clientes.
- **Zonas de delivery** y su costo.
- **Tasa BCV automática**: actívala y toca *Actualizar*.
- **IGTF**: actívalo si te corresponde (confírmalo con tu contador).
- **Equipo**: agrega a caja, cocina y delivery con su correo y una contraseña temporal.
- **Más › Inventario**: pon el stock de cada producto.
- **Alertas**: toca *Activar notificaciones* y acepta el permiso, para que suene aunque la app esté cerrada.

## 6. Instalar la app en el teléfono

- **Android (Chrome):** Más › Ajustes › *Instalar app*, o menú ⋮ › *Instalar app*.
- **iPhone (Safari):** Compartir › *Agregar a inicio*. En iPhone los avisos con la app cerrada funcionan desde iOS 16.4, solo con la app instalada así.

## 7. Dominio propio (opcional)

Compra el dominio (por ejemplo `pedidosburgershack.com`) y en Firebase › **Hosting › Agregar dominio personalizado** sigue los pasos. El certificado `https://` es gratis y automático.

## 8. Publicar cambios después

1. Haz el cambio.
2. Sube el número de `CACHE` en `app/sw.js` (`burgershack-panel-v2`, `v7`…).
3. `firebase deploy` (o `firebase deploy --only hosting` si solo cambió la página).

## Probar en la computadora sin publicar

Con el emulador de Firebase (necesita Java):

```bash
cd burgershack
echo "SETUP_CODE=prueba-1234" > functions/.env.local
firebase emulators:start --project demo-burgershack
```

Y en `app/firebase-config.js` pon una configuración de prueba con `projectId: "demo-burgershack"` y `window.FIREBASE_EMULATORS = true;`. Abre `http://127.0.0.1:5000`.

Pruebas de la lógica de pedidos (precios, stock, IGTF, horario, tasa BCV):

```bash
cd burgershack/functions && npm test
```

## Qué hace cada archivo

| Archivo | Qué es |
|---|---|
| `app/` | La tienda y la app del dueño (lo que se publica). |
| `app/firebase-config.js` | La configuración de tu proyecto. |
| `functions/index.js` | El servidor: crear pedidos, devolver stock al cancelar, avisos push, tasa BCV, equipo. |
| `functions/lib/order.js` | Las reglas del pedido: precios, stock, IGTF, horario. |
| `firestore.rules`, `storage.rules` | Quién puede ver y cambiar qué. |
| `firebase.json` | Cómo se publica todo. |
