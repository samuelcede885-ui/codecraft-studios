// Bloqueo con PIN de la app en este dispositivo.
// El PIN nunca se guarda: solo un hash PBKDF2 (SHA-256, 150 000 iteraciones) con sal aleatoria.
// Protege la pantalla frente a quien tome el teléfono; el enlace de la app ya es privado.

const KEY = 'quanta-ai-lock';
const ITER = 150000;
const AUTO_MS = 2 * 60 * 1000; // bloqueo por inactividad

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch { return false; } };

let cfg = read();
let locked = Boolean(cfg.hash);
let lastActive = Date.now();

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)));

async function derive(pin, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITER }, base, 256));
}

// Comparación en tiempo constante
const same = (a, b) => a.length === b.length && [...a].reduce((d, c, i) => d | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;

export const supported = () => Boolean(globalThis.crypto?.subtle);
export const hasPin = () => Boolean(cfg.hash);
export const isLocked = () => locked && hasPin();
export const autoLockOn = () => cfg.autoLock !== false;
export const validPin = (pin) => /^\d{4,8}$/.test(pin);

export function lock() { if (hasPin()) locked = true; }
export function touch() { lastActive = Date.now(); }
export const idleTooLong = () => hasPin() && !locked && Date.now() - lastActive > AUTO_MS;

/** Segundos que faltan para poder intentar de nuevo tras varios fallos. */
export function waitSeconds() {
  return Math.max(0, Math.ceil(((cfg.until || 0) - Date.now()) / 1000));
}

export async function setPin(pin) {
  if (!supported()) throw new Error('Este navegador no permite cifrar el PIN.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  cfg = { ...cfg, salt: hex(salt), hash: await derive(pin, salt), fails: 0, until: 0 };
  if (!write(cfg)) { cfg = read(); throw new Error('Este navegador no deja guardar el PIN (modo privado o datos bloqueados).'); }
  locked = false;
}

/** Comprueba el PIN. Tras 3 fallos espera 30 s, y el tiempo se duplica con cada fallo extra. */
export async function unlock(pin) {
  if (waitSeconds() > 0) return { ok: false, wait: waitSeconds() };
  const ok = same(await derive(pin, unhex(cfg.salt)), cfg.hash);
  if (ok) {
    cfg = { ...cfg, fails: 0, until: 0 };
    locked = false;
    touch();
  } else {
    const fails = (cfg.fails || 0) + 1;
    cfg = { ...cfg, fails, until: fails >= 3 ? Date.now() + 30000 * 2 ** (fails - 3) : 0 };
  }
  write(cfg);
  return { ok, wait: waitSeconds(), fails: cfg.fails };
}

export async function removePin(pin) {
  const r = await unlock(pin);
  if (!r.ok) return r;
  cfg = { autoLock: cfg.autoLock };
  write(cfg);
  return r;
}

export function setAutoLock(on) { cfg = { ...cfg, autoLock: on }; write(cfg); }

/** Borra de este dispositivo todo lo que guarda la app, PIN incluido. */
export function wipeDevice() {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('quanta-ai')) localStorage.removeItem(k);
    sessionStorage.clear();
  } catch { /* sin almacenamiento */ }
  cfg = {};
  locked = false;
}
