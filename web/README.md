# Frontend — Menú digital

HTML, CSS y JavaScript moderno (módulos ES) conectado a Supabase, sin build.

```
web/
├── admin.html                 Panel: acceso, alta de restaurante, productos, personalización
├── menu.html                  Catálogo público móvil  (menu.html?r=<slug>)
├── css/
│   ├── base.css               Tokens (--brand…), botones, utilidades
│   ├── admin.css              Estilos del panel
│   └── menu.css               Estilos del catálogo (mobile-first)
└── js/
    ├── config.js              ⚙️ URL y anon key de tu proyecto Supabase
    ├── services/
    │   ├── supabase.js        Cliente + traducción de errores
    │   ├── auth.js            Login / registro / logout del dueño
    │   └── api.js             Restaurantes, branding, categorías, productos, imágenes
    ├── components/            Piezas de UI reutilizables (funciones que devuelven nodos)
    ├── pages/                 Punto de entrada de cada página
    ├── theme.js               Aplica el color de marca como variables CSS
    └── utils.js               escapeHtml, formatPrice, html, …
```

## Configurar Supabase

1. Aplica la migración `supabase/migrations/20261013000000_menu_saas_schema.sql`
   (`supabase db push` o pégala en el SQL Editor).
2. Copia la **Project URL** y la **anon public key** (Project Settings → API)
   en `js/config.js`. La anon key es pública; la seguridad la imponen las
   políticas RLS.
3. En Authentication → Providers deja activado **Email**. Si exiges
   confirmación por email, el usuario verá "Revisa tu email" al registrarse.
4. Sirve la carpeta (los módulos ES no funcionan con `file://`):

   ```bash
   npx serve web        # o: python3 -m http.server -d web
   ```

5. Abre `admin.html`, crea tu cuenta y tu restaurante, añade platos y marca
   **Menú publicado** en Personalización. El menú público queda en
   `menu.html?r=<slug>`.

`supabase-js` se carga desde jsDelivr con versión fija (`@2.45.4`), sin npm.

## Flujo del panel

`admin.html` → sin sesión: acceso → sin restaurante: alta (el slug se genera
del nombre) → panel. Las imágenes se suben a
`restaurant-assets/<restaurant_id>/{products|logo}/<uuid>.<ext>`, la ruta que
exigen las políticas de Storage.

## Funciones de `api.js`

| Dato | Funciones |
|---|---|
| Nombres de platos, precios, imágenes | `getProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `uploadImage` |
| Color principal y logo | `getBranding`, `updateBranding`, `uploadImage(…, 'logo')` |
| Categorías | `getCategories`, `createCategory`, `deleteCategory` |
| Restaurante | `getRestaurantBySlug`, `getMyRestaurant`, `createRestaurant`, `updateRestaurant` |

Todas lanzan un `Error` con mensaje en español (y el `code` del error original)
cuando Supabase rechaza la operación. Los borrados comprueban que se eliminó
una fila, porque RLS filtra un `DELETE` ajeno sin devolver error.
