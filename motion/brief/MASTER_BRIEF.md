# FARY LABS — MOTION GRAPHICS MASTER BRIEF FOR CLAUDE CODE

## 0. Objetivo
Construir un sistema reusable de Motion Graphics para Fary Labs usando React + TypeScript + Remotion. Las referencias adjuntas deben estudiarse por su lenguaje visual —storytelling isométrico, cámara continua, tipografía cinética, UI flotante, iluminación y narrativa problema→sistema→resultado— pero NO copiarse literalmente.

La primera pieza será: **“Tu negocio no debería depender de ti.”**

---

## 1. Marca
Fary Labs trabaja en tres líneas:

### Web Craft
Webs, landings, sitios corporativos, e-commerce y experiencias digitales.

### App Craft
Apps, plataformas, dashboards y sistemas a medida.

### Agent Craft
Agentes IA, asistentes, automatizaciones e integraciones.

Personalidad visual: premium, minimalista, editorial, tecnológica, precisa, limpia, funcional y contemporánea.

---

## 2. Dirección visual
Universo isométrico nocturno original:
- ciudad digital oscura;
- edificios geométricos;
- calles, árboles y faroles;
- pantallas, terminales y teléfonos;
- dashboards y nodos;
- personajes minimalistas;
- líneas de datos;
- iluminación localizada.

Debe sentirse como “ver cómo funciona un negocio por dentro”.
No infantil. No gaming. No hiperrealista.

---

## 3. Paleta
BLACK = #101010
WHITE = #FFFFFF
LIGHT = #F3F3F3
GRAY = #8A8A8A
DARK_SURFACE = #171717
ACCENT = #19FF72
WARM_LIGHT = #D7A65A

El verde es acento audiovisual, no color principal. Usarlo solo para actividad, automatización, datos, conexiones, progreso, CTA y palabras clave.

---

## 4. Tipografía
Preferencia comunicación: Lato.
UI: Inter.
Fallback: sans-serif limpia.

Titulares:
- Bold/Black;
- 2–4 líneas máximo;
- una sola palabra protagonista por escena.

Ejemplo:
Tu negocio debería
TRABAJAR.

---

## 5. Motor técnico
Stack:
- React
- TypeScript
- Remotion

Estructura sugerida:

src/
  compositions/
    Reel01TuNegocioNoDeberiaDependerDeTi/
    Reel02MientrasDuermes/
    Reel03UnaPaginaBonitaNoBasta/
  components/
    IsometricWorld.tsx
    IsometricCamera.tsx
    Building.tsx
    Road.tsx
    StreetLight.tsx
    Tree.tsx
    DigitalPerson.tsx
    PhoneMockup.tsx
    BrowserMockup.tsx
    Dashboard.tsx
    FloatingLabel.tsx
    DataFlow.tsx
    KineticTitle.tsx
    HighlightWord.tsx
    CTAEndCard.tsx
    NotificationBubble.tsx
    ClockBadge.tsx
    SystemNode.tsx
    StatusCard.tsx
  data/
    reels.ts
  theme/
    fary.ts
  assets/
    fary-logo.*
    fary-symbol.*

---

## 6. Reglas de programación
Todas las animaciones dependen de:
- useCurrentFrame()
- useVideoConfig()

Usar:
- spring()
- interpolate()
- easing
- clamp

NO usar:
- setTimeout
- setInterval
- Date.now
- animaciones ligadas al tiempo real.

El render debe ser determinista.

---

## 7. Cámara
Crear IsometricCamera reusable con:
- x
- y
- scale
- rotation opcional
- focusTarget opcional

Lenguaje:
- zoom lento;
- paneos cortos;
- continuidad entre escenas;
- movimiento suave incluso en escenas “quietas”.

Evitar cortes agresivos, giros excesivos o look de videojuego.

---

## 8. Entradas
UI:
- opacity 0→1
- translateY 30→0
- scale .96→1
- stagger 3–6 frames

Salidas más breves.
No sobreanimar.

---

## 9. Tipografía cinética
Crear KineticTitle con:
- lines
- highlight
- eyebrow
- alignment
- position
- maxWidth

Crear HighlightWord:
- reveal;
- barra que crece;
- palabra destacada;
- transición consistente.

---

## 10. Iluminación
Componentes con estados active/inactive.

active:
- pantalla se enciende;
- brightness aumenta;
- glow sutil;
- DataFlow relacionado se activa.

Faroles: glow suave, sin pulsos exagerados.

---

## 11. DataFlow
Crear conexiones visuales:

CLIENTE → WEB → APP → AI → CRM → RESULTADO

Implementación preferida:
- SVG;
- strokeDashoffset;
- pulsos de luz;
- partículas mínimas.

El flujo debe explicar el proceso, no decorar.

---

## 12. PhoneMockup
Teléfono minimalista, no hiperrealista.
Debe aceptar contenido React:
- formularios;
- reservas;
- ecommerce;
- chat;
- confirmaciones;
- dashboards.

---

## 13. BrowserMockup
Debe permitir mostrar:
- home;
- servicio;
- producto;
- CTA;
- checkout;
- formulario;
- dashboard.

No copiar interfaces protegidas literalmente.

---

## 14. Safe areas
Formato 1080×1920, 30 fps, 9:16.
Evitar texto fundamental muy arriba, muy abajo o pegado a la derecha por UI de Reels.

---

# 15. REEL 01 — “Tu negocio no debería depender de ti”

Duración objetivo: 24–28 s.

## ESCENA 1 — Hook
0:00–0:03 | frames 0–90

Visual:
- ciudad nocturna;
- casi todo apagado;
- una oficina encendida;
- una persona trabajando.

Reloj:
11:47 PM

Texto:
Si tu negocio depende
de que estés ahí…

Highlight:
ahí

Cámara: zoom lento hacia la oficina.

## ESCENA 2 — Problema
0:03–0:06 | frames 90–180

Visual:
persona rodeada de chat, spreadsheet, email, calendario y notas.

Notificaciones:
“Nueva consulta”
“¿Tienen disponibilidad?”
“¿Cuánto cuesta?”
“Quiero reservar”

Texto:
Entonces no tienes
un SISTEMA.

Highlight:
SISTEMA

Notificaciones con stagger.

## ESCENA 3 — Fary conecta
0:06–0:09 | frames 180–270

Bajar intensidad de escena.
Aparece símbolo oficial Fary como nodo.
Salen tres conexiones:

WEB
APP
AI

Activarlas secuencialmente.

Eyebrow:
FARY LABS

Texto:
Lo conectamos.

## ESCENA 4 — Web Craft
0:09–0:13 | frames 270–390

Cámara va hacia un edificio.
Pantalla se activa.
BrowserMockup:
- home;
- servicio;
- CTA;
- usuario realiza acción.

Texto:
Tu web
ATRAE.

Highlight:
ATRAE

Label:
WEB CRAFT

## ESCENA 5 — App Craft
0:13–0:17 | frames 390–510

Línea luminosa viaja desde la web a una app.

Mostrar:
CLIENTES
PEDIDOS
RESERVAS
MÉTRICAS

Texto:
Tu sistema
ORGANIZA.

Highlight:
ORGANIZA

Label:
APP CRAFT

No inventar cifras.

## ESCENA 6 — Agent Craft
0:17–0:21 | frames 510–630

Mensajes entran desde:
Web
Email
Chat
Social

Llegan a nodo AI.

Mostrar:
✓ Consulta respondida
✓ Lead clasificado
✓ Reserva confirmada
✓ Seguimiento programado

Texto:
La IA
RESPONDE.

Highlight:
RESPONDE

Label:
AGENT CRAFT

## ESCENA 7 — Resultado
0:21–0:24 | frames 630–750

Cámara se aleja.
Ecosistema activo.
Flujo:
cliente → web → app → AI → datos

Volver a la oficina inicial:
está vacía.

Reloj:
12:03 AM

Texto:
Tu negocio sigue.

Luego:
Incluso
SIN TI.

Highlight:
SIN TI

## ESCENA FINAL
0:24–0:28 | frames 750–840 aprox.

Fondo #101010.
Aparece símbolo oficial Fary.
Luego wordmark completo.

Texto:
Web. Apps. AI.

Subtexto:
Diseñamos sistemas digitales que hacen avanzar negocios.

CTA:
Construyamos el tuyo →

Una línea DataFlow final atraviesa la composición y termina en el logo.

---

## 16. Voiceover sugerido
“Si tu negocio depende de que estés ahí,
entonces no tienes un sistema.

En Fary conectamos tu web,
tus aplicaciones
y la inteligencia artificial.

Tu web atrae.
Tu sistema organiza.
La inteligencia artificial responde.

Y mientras tú no estás,
tu negocio sigue funcionando.

Fary Labs.

Web. Apps. AI.”

No sintetizar voz sin autorización. Solo preparar markers.

---

## 17. SFX
Solo con assets autorizados:
- UI click;
- digital pulse;
- confirmation;
- soft whoosh;
- low ambient hum.

No usar música protegida.

---

## 18. Estrategia narrativa reusable
Cada Reel Fary debe seguir:

HOOK
↓
PROBLEMA
↓
SISTEMA
↓
DEMO
↓
RESULTADO
↓
CTA

Cada video cuenta una historia. No solo enseña una interfaz.

---

## 19. Serie de contenido
1. Tu negocio no debería depender de ti — ecosistema completo.
2. Mientras tú duermes — Agent Craft.
3. Una página bonita no basta — Web Craft.
4. Tu negocio está en cinco lugares — App Craft.
5. Esto no debería hacerlo una persona — automatización.
6. Un cliente acaba de entrar — lead flow.
7. Tu web debería trabajar — conversión.
8. Así se ve un negocio conectado — integraciones.
9. De WhatsApp a sistema — operaciones.
10. Lo que construimos en Fary Labs — showreel.

---

## 20. Hooks
- Tu negocio está perdiendo tiempo aquí.
- Esto no debería hacerlo una persona.
- Tu web debería trabajar.
- Un cliente acaba de entrar.
- Mientras tú duermes…
- Bonita. ¿Pero vende?
- Esto pasa en 3 segundos.
- Tienes un problema que no ves.
- Tu equipo hace esto todos los días.
- Una web puede hacer mucho más.

---

## 21. Reglas de marca

NO:
- inventar clientes;
- inventar cifras;
- inventar resultados;
- inventar tecnologías;
- copiar el escenario de referencia;
- copiar assets de referencia;
- usar demasiado verde;
- neón excesivo;
- estética gaming;
- blur excesivo;
- partículas gratuitas;
- sobreanimar;
- destacar más de una palabra por escena.

SÍ:
- mantener blanco/negro como identidad;
- usar el verde solo como señal;
- construir composición original;
- explicar con motion;
- mantener claridad móvil;
- usar la referencia solo como lenguaje visual.

---

## 22. QA obligatorio
Revisar visualmente:
frame 0
60
120
210
330
450
570
690
780
final

Comprobar:
- ortografía;
- uso correcto del logo;
- safe area;
- overflow;
- clipping;
- contraste;
- jerarquía;
- legibilidad móvil;
- continuidad de cámara;
- iluminación;
- timing;
- color;
- ausencia de claims falsos.

---

## 23. Orden de implementación

FASE 1
- theme;
- assets;
- IsometricWorld;
- IsometricCamera;
- typography;
- HighlightWord;
- lights;
- DataFlow.

FASE 2
- PhoneMockup;
- BrowserMockup;
- Dashboard;
- notifications;
- SystemNode;
- StatusCard.

FASE 3
- montar Reel01 completo.

FASE 4
- preview sin audio;
- revisión visual;
- ajuste de timing;
- render final.

---

## 24. Resultado esperado
La pieza debe demostrar que Fary Labs sabe diseñar, desarrollar y automatizar.

Narrativa visual:

CAOS MANUAL
↓
FARY CONECTA
↓
EL NEGOCIO FUNCIONA COMO SISTEMA

No quiero que el video “diga” que Fary sabe hacer tecnología.
Quiero que la propia calidad del Motion Graphics lo demuestre.

---

## 25. Instrucción final para Claude Code
Antes de modificar el proyecto:
1. Lee este documento completo.
2. Revisa todas las imágenes en `/references`.
3. Extrae lenguaje visual, no assets.
4. Usa solo el logo oficial Fary del repositorio.
5. Construye primero un preview completo sin audio.
6. No consideres terminado el Reel hasta revisar los frames de QA.
