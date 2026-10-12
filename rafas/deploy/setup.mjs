// Configura el proyecto de Firebase desde cero (se puede correr muchas veces sin romper nada).
// Lo ejecuta GitHub Actions con la cuenta de servicio guardada en el secreto FIREBASE_SERVICE_ACCOUNT.
// Escribe: app/firebase-config.js, functions/.env y la sección "storage" de firebase.json.
import { GoogleAuth } from "google-auth-library";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sa = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));
const P = sa.project_id;
const STORE_ID = process.env.STORE_ID || "rafas";
const BUCKET = `${P}-comprobantes`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log(`• ${m}`);

const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/firebase"] });
const client = await auth.getClient();

async function api(method, url, data, okStatus = []) {
  try {
    const r = await client.request({ url, method, data, headers: { "x-goog-user-project": P } });
    return r.data;
  } catch (e) {
    const status = e.response?.status;
    if (okStatus.includes(status)) return { __status: status };
    const msg = e.response?.data?.error?.message || e.message;
    throw new Error(`${method} ${url} → ${status}: ${msg}`);
  }
}
async function waitOp(base, op) {
  for (let i = 0; op && op.name && !op.done && i < 120; i++) { await sleep(3000); op = await api("GET", base + op.name); }
  if (op?.error) throw new Error(`Operación falló: ${JSON.stringify(op.error)}`);
  return op?.response;
}

// 0. Plan Blaze
const billing = await api("GET", `https://cloudbilling.googleapis.com/v1/projects/${P}/billingInfo`, undefined, [403]);
if (billing.__status === 403) log("No pude leer la facturación (sin permiso); sigo.");
else if (!billing.billingEnabled) {
  console.error(`\n✖ El proyecto ${P} no tiene el plan Blaze (facturación) activo. Actívalo en la consola de Firebase y vuelve a correr.`);
  process.exit(1);
} else log("Plan Blaze activo");

// 1. Servicios
const services = [
  "firebase.googleapis.com", "firestore.googleapis.com", "firebaserules.googleapis.com", "firebasestorage.googleapis.com",
  "storage.googleapis.com", "firebasehosting.googleapis.com", "identitytoolkit.googleapis.com", "cloudfunctions.googleapis.com",
  "cloudbuild.googleapis.com", "artifactregistry.googleapis.com", "run.googleapis.com", "eventarc.googleapis.com",
  "pubsub.googleapis.com", "cloudscheduler.googleapis.com", "fcm.googleapis.com", "fcmregistrations.googleapis.com",
  "firebaseinstallations.googleapis.com", "cloudresourcemanager.googleapis.com", "iam.googleapis.com", "cloudbilling.googleapis.com",
];
await waitOp("https://serviceusage.googleapis.com/v1/", await api("POST", `https://serviceusage.googleapis.com/v1/projects/${P}/services:batchEnable`, { serviceIds: services }));
log("Servicios activados");

// 2. Proyecto Firebase
const added = await api("POST", `https://firebase.googleapis.com/v1beta1/projects/${P}:addFirebase`, {}, [409, 400]);
if (!added.__status) await waitOp("https://firebase.googleapis.com/v1beta1/", added);
log("Firebase activo en el proyecto");

// 3. Base de datos
const db = await api("GET", `https://firestore.googleapis.com/v1/projects/${P}/databases/(default)`, undefined, [404]);
if (db.__status === 404) {
  await waitOp("https://firestore.googleapis.com/v1/", await api("POST", `https://firestore.googleapis.com/v1/projects/${P}/databases?databaseId=(default)`, { locationId: "nam5", type: "FIRESTORE_NATIVE" }));
  log("Base de datos creada (nam5)");
} else log("Base de datos ya existía");

// 4. Almacenamiento de comprobantes
const b = await api("GET", `https://storage.googleapis.com/storage/v1/b/${BUCKET}`, undefined, [404]);
if (b.__status === 404) {
  await api("POST", `https://storage.googleapis.com/storage/v1/b?project=${P}`, { name: BUCKET, location: "US-CENTRAL1", iamConfiguration: { uniformBucketLevelAccess: { enabled: true } } });
  log(`Carpeta de comprobantes creada (${BUCKET})`);
} else log("Carpeta de comprobantes ya existía");
await api("POST", `https://firebasestorage.googleapis.com/v1beta/projects/${P}/buckets/${BUCKET}:addFirebase`, {}, [409]);
log("Carpeta conectada a Firebase");

// 5. Inicio de sesión: correo/contraseña y anónimo
let cfg = await api("GET", `https://identitytoolkit.googleapis.com/admin/v2/projects/${P}/config`, undefined, [404, 400]);
if (cfg.__status) {
  await api("POST", `https://identitytoolkit.googleapis.com/v2/projects/${P}/identityPlatform:initializeAuth`, {}, [409, 400]);
  await sleep(3000);
}
await api("PATCH", `https://identitytoolkit.googleapis.com/admin/v2/projects/${P}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired,signIn.anonymous.enabled`, {
  signIn: { email: { enabled: true, passwordRequired: true }, anonymous: { enabled: true } },
});
log("Inicio de sesión activado (correo y anónimo)");

// 6. App web y su configuración
const list = await api("GET", `https://firebase.googleapis.com/v1beta1/projects/${P}/webApps`);
let app = (list.apps || []).find((a) => a.displayName === "rafas" && a.state !== "DELETED");
if (!app) {
  app = await waitOp("https://firebase.googleapis.com/v1beta1/", await api("POST", `https://firebase.googleapis.com/v1beta1/projects/${P}/webApps`, { displayName: "rafas" }));
  log("App web registrada");
}
const web = await api("GET", `https://firebase.googleapis.com/v1beta1/projects/${P}/webApps/${app.appId}/config`);
const firebaseConfig = {
  apiKey: web.apiKey,
  authDomain: web.authDomain || `${P}.firebaseapp.com`,
  projectId: P,
  storageBucket: BUCKET,
  messagingSenderId: web.messagingSenderId,
  appId: web.appId,
};
fs.writeFileSync(path.join(root, "app/firebase-config.js"),
  `// Generado automáticamente al publicar (rafas/deploy/setup.mjs). No lo edites a mano.\n` +
  `window.FIREBASE_CONFIG = ${JSON.stringify(firebaseConfig, null, 2)};\n` +
  `window.FIREBASE_VAPID_KEY = ${JSON.stringify(process.env.FIREBASE_VAPID_KEY || "")};\n` +
  `window.STORE_ID = ${JSON.stringify(STORE_ID)};\n` +
  `window.FIREBASE_EMULATORS = false;\n`);
log("Configuración de la app escrita");

// 7. Archivos para el despliegue
if (!process.env.SETUP_CODE) { console.error("✖ Falta el secreto SETUP_CODE en GitHub."); process.exit(1); }
fs.writeFileSync(path.join(root, "functions/.env"), `SETUP_CODE=${process.env.SETUP_CODE}\nRECEIPTS_BUCKET=${BUCKET}\n`);
const fj = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
fj.storage = [{ bucket: BUCKET, rules: "storage.rules" }];
fs.writeFileSync(path.join(root, "firebase.json"), JSON.stringify(fj, null, 2));
fs.writeFileSync(path.join(process.env.GITHUB_ENV || "/dev/null"), `PROJECT_ID=${P}\n`, { flag: "a" });
log(`Listo para publicar en https://${P}.web.app`);
