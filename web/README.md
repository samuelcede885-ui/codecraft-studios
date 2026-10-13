# Frontend — Menú digital

HTML, CSS y JavaScript moderno (módulos ES), sin dependencias ni build.

```
web/
├── admin.html                 Panel administrativo (productos + personalización)
├── menu.html                  Catálogo público móvil  (menu.html?r=<slug>)
├── css/
│   ├── base.css               Tokens (--brand…), botones, utilidades
│   ├── admin.css              Estilos del panel
│   └── menu.css               Estilos del catálogo (mobile-first)
└── js/
    ├── services/
    │   ├── api.js             ⚠️ PLACEHOLDERS de base de datos — conectar aquí
    │   └── mock-data.js       Datos de ejemplo (borrar al conectar)
    ├── components/            Piezas de UI reutilizables (funciones que devuelven nodos)
    ├── pages/                 Punto de entrada de cada página
    ├── theme.js               Aplica el color de marca como variables CSS
    └── utils.js               escapeHtml, formatPrice, html, …
```

## Ejecutar

Los módulos ES no funcionan con `file://`, así que hay que servir la carpeta:

```bash
npx serve web        # o: python3 -m http.server -d web
```

## Conectar la base de datos

Solo hay que editar `js/services/api.js`. Cada función tiene un `// TODO` con
la consulta Supabase equivalente y devuelve objetos con la forma de las tablas
de `supabase/migrations/`:

| Dato | Funciones |
|---|---|
| Nombres de platos, precios, imágenes | `getProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `uploadImage` |
| Color principal y logo | `getBranding`, `updateBranding`, `uploadImage(…, 'logo')` |
| Categorías | `getCategories`, `createCategory`, `deleteCategory` |
| Restaurante | `getRestaurantBySlug`, `getMyRestaurant`, `updateRestaurant` |

El color principal se aplica con `applyBranding()` (`js/theme.js`), que
establece `--brand` y calcula automáticamente un color de texto legible encima.
