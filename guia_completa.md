# 🛍️ Guía Técnica Completa — Imagine & Stamp (PLANTILLA MAESTRA)
### Cómo se construyó, desplegó y cómo replicarlo para nuevos clientes (catálogos / menús / e-commerce)

> Esta guía es la **plantilla base**. Para un cliente nuevo se toma esta misma
> estructura (catálogo + carrito + panel de control) y solo se cambia el **diseño**
> (colores, fuentes, logo, textos) y las **credenciales** (Supabase, dominio).

---

## 📋 ÍNDICE
0. [Modo DEMO — Creación Rápida](#0-modo-demo--creación-rápida) ⚡ **empieza aquí si es un demo nuevo**
1. [Stack Tecnológico](#1-stack-tecnológico) *(producción)*
2. [Estructura del Proyecto](#2-estructura-del-proyecto) *(producción)*
3. [GitHub y Despliegue Automático](#3-github-y-despliegue-automático) *(producción)*
4. [Dominio Personalizado (Namecheap)](#4-dominio-personalizado-namecheap) *(producción)*
5. [Base de Datos — Supabase](#5-base-de-datos--supabase) *(producción)*
6. [Sistema de Diseño (colores y fuentes)](#6-sistema-de-diseño-colores-y-fuentes) *(producción)*
7. [Funcionalidades Clave](#7-funcionalidades-clave)
8. [Pagos: Transferencia y Tarjeta (Mercado Pago)](#8-pagos-transferencia-y-tarjeta-mercado-pago) *(producción)*
9. [Guía para Replicar el Modelo (Demo → Producción)](#9-guía-para-replicar-el-modelo-cliente-nuevo)
10. [Errores Comunes y Soluciones](#10-errores-comunes-y-soluciones)
11. [Costos del Modelo](#11-costos-del-modelo)
12. [Creación de Nuevos Módulos Internos (Demos)](#12-creación-de-nuevos-módulos-internos-demos)
13. [Módulo Opcional: Descargas Digitales](#13-módulo-opcional-descargas-digitales)
14. [Optimización de Imágenes y Ancho de Banda](#14-optimización-de-imágenes-y-ancho-de-banda-supabase)
15. [Reglas de Aislamiento para Nuevos Clientes](#15-reglas-de-aislamiento-para-nuevos-clientes)
16. [Proceso Creativo — Del Menú Impreso al Menú Digital](#16-proceso-creativo--del-menú-impreso-al-menú-digital)
17. [Creación de Flyers (Flayers Promocionales)](#17-creación-de-flyers-flayers-promocionales)

---

## 0. Modo DEMO — Creación Rápida

> ⚡ **Usa esta sección cuando el cliente solo mandó fotos/lista de su menú y quieres
> mostrarle una demo para aprobación.** Las secciones 1–8 marcadas *(producción)* — Supabase,
> repo nuevo, dominio propio, GitHub Actions, Mercado Pago — **no aplican todavía**. Eso
> se hace solo si el demo se aprueba y pasa a producción (sección 9). Todo demo vive como
> un módulo dentro del proyecto `imagine-and-stamp` que ya está desplegado, visible al
> instante en `https://imagineandstamp.site/#/nombre-cliente`, sin crear nada nuevo en
> GitHub, Supabase ni Namecheap.

### 0.0 Dos modalidades de demo

Hay **dos patrones** válidos para crear un demo. Elegí uno según el caso:

#### A. Demo estándar (RECOMENDADO) — copiar `_template/`

> Usar cuando: es un menú/catálogo típico, sin funciones especiales.

1. Copiar `src/modules/_template/` → renombrar a `src/modules/<cliente>/`
2. Editar `config.ts` con los datos reales
3. Editar `pages/TemplateMenu.tsx`: PRODUCTS, categorías, colores hex
4. Registrar ruta en App.tsx
5. Push

**Ventajas:** carrito de 2 pasos vía `useCartStore` (Zustand), footer de 3 columnas inline, buscador, categorías — todo consistente entre demos, menos código duplicado.

#### B. Demo premium / custom — archivo autónomo

> Usar cuando: el cliente necesita diseño muy distinto, funciones especiales (dark mode, selector de marca, Google Sheets) o el demo es tan custom que no conviene adaptar el template.

Tiene **su propio carrito hardcodeado** (`useState<CartItem[]>([])` en vez de `useCartStore`), su propio footer y su propia lógica. Ejemplo real: `src/modules/demo-menu/pages/DemoMenu.tsx` (1900 líneas, dark mode, 4 temas de color, Google Sheets opcional).

**Reglas para demos custom:**
- Carrito de 2 pasos obligatorio (igual que sección 7)
- Footer de 3 columnas obligatorio
- Sin Supabase, sin AdminPanel
- WhatsApp checkout
- Colores en hex directo, no tokens globales
- Registrar ruta igual que el estándar

### 0.1 Qué SÍ lleva un demo (ambos patrones)
- Array `PRODUCTS` **hardcodeado dentro del mismo archivo** (no `data/` aparte).
- Catálogo con categorías, buscador, **carrito de 2 pasos** y **footer de 3 columnas**
  (mismas reglas obligatorias de la sección 7).
- Checkout **solo por WhatsApp** — sin base de datos.
- Colores de marca **en hex directo en clases Tailwind** (`bg-[#E84C3D]`, `text-[#111111]`)
- Imágenes: `src/modules/<cliente>/assets/` o URLs externas.

### 0.2 Qué NO lleva un demo
- Supabase (tablas, Storage, Edge Functions) — sección 5.
- Panel de administración conectado a base de datos real (`AdminPanel.tsx`).
- Repo de GitHub propio, dominio propio, GitHub Actions — secciones 3–4.
- Mercado Pago — sección 8.

### 0.3 Checklist rápido (demo estándar)
1. [ ] Copiar `_template/` → renombrar a `<nombre-cliente>/`
2. [ ] Editar `config.ts` (nombre, WhatsApp, email, dirección, horarios, redes)
3. [ ] Editar `pages/TemplateMenu.tsx`: PRODUCTS, categorías, colores hex, textos
4. [ ] Registrar la ruta en `src/App.tsx`:
   ```tsx
   import NombreClienteMenu from './modules/nombre-cliente/pages/NombreClienteMenu';
   <Route path="/nombre-cliente" element={<ErrorBoundary><NombreClienteMenu /></ErrorBoundary>} />
   ```
5. [ ] `npm run dev` → push → `imagineandstamp.site/#/nombre-cliente`
6. [ ] Enviar link al cliente

### 0.4 Checklist rápido (demo premium / custom)
1. [ ] Crear `src/modules/<cliente>/pages/<Cliente>Menu.tsx` autónomo
2. [ ] Implementar carrito propio con `useState` + footer 3 cols inline
3. [ ] Colores en hex directo, datos del cliente en constantes
4. [ ] Registrar ruta en App.tsx (igual que estándar)
5. [ ] Push → enviar link

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **UI Framework** | React | 19.x | Construcción de la interfaz |
| **Lenguaje** | TypeScript | 5.8.x | Tipado seguro |
| **CSS** | Tailwind CSS | 4.x (via Vite plugin, con `@theme`) | Estilos utilitarios + design tokens |
| **Bundler** | Vite | 6.x | Compilación y dev server |
| **Iconos** | Lucide React | 0.546.x | Íconos vectoriales |
| **Animaciones** | Motion (ex Framer Motion) | 12.x | Transiciones fluidas |
| **Routing** | React Router (HashRouter) | 7.x | Navegación SPA sin servidor |
| **Base de datos** | Supabase (Postgres + Storage + Realtime) | 2.x | Backend de datos e imágenes |
| **Backend de pagos** | **Supabase Edge Functions** (Deno) | — | Donde vive el token secreto de Mercado Pago |
| **Pasarela de pago** | **Mercado Pago** (Checkout Pro) | — | Cobro con tarjeta |
| **Hosting** | GitHub Pages | — | Hosting gratuito |
| **Dominio** | Namecheap | — | Dominio personalizado |
| **CI/CD** | GitHub Actions | — | Despliegue automático |

### Dependencias clave en `package.json`
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.103.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

Scripts: `dev` (vite --port=3000), `build` (vite build), `preview`, `lint` (tsc --noEmit).

---

## 2. Estructura del Proyecto

```
imagine-and-stamp/
├── .github/workflows/deploy.yml   ← Despliegue automático a GitHub Pages
├── public/                         ← Archivos estáticos (Vite los copia a dist/)
│   ├── CNAME                       ← Dominio personalizado
│   ├── hero-imagine-stamp.png      ← Imagen principal (Hero)
│   ├── robots.txt / sitemap.xml    ← SEO
│   └── proveedora-san-luis/        ← Assets de demos (un dir por demo)
├── src/
│   ├── main.tsx                    ← Punto de entrada (monta <App/> + <MetaPixelInit/>)
│   ├── App.tsx                     ← Tienda principal + router (HashRouter)
│   ├── AdminPanel.tsx              ← Panel de control (admin) en /#/admin
│   ├── logo.png                    ← Logo del negocio
│   ├── index.css                   ← Design tokens (colores, fuentes) con @theme de Tailwind v4
│   ├── types.ts                    ← Tipos globales (Product, Category, SubMenu)
│   ├── vite-env.d.ts               ← Tipos de Vite (import.meta.env)
│   │
│   ├── lib/
│   │   ├── supabase.ts             ← Cliente de Supabase con fallback hardcodeado
│   │   ├── dynamicSupabase.ts      ← Cliente multi-proyecto (usa clientSelector)
│   │   └── imageCompression.ts     ← Compresión de imágenes antes de subir (Canvas API)
│   │
│   ├── config/
│   │   ├── siteConfig.template.ts   ← Tipo SiteConfig con todos los campos
│   │   ├── siteConfig.ts            ← Configuración de Imagine & Stamp
│   │   ├── clientSelector.ts        ← Selector multi-cliente Supabase
│   │   └── clients/
│   │       ├── imagineConfig.ts     ← Config de Imagine & Stamp
│   │       ├── laPatronaConfig.ts   ← Config de otro cliente
│   │       └── aguaDeCocoConfig.ts  ← Config de otro cliente
│   │
│   ├── store/
│   │   └── useCartStore.ts         ← Carrito global con Zustand (compartido por todos los módulos)
│   │
│   ├── components/
│   │   ├── MetaPixelInit.tsx       ← Inicialización del Meta Pixel (desde VITE_META_PIXEL_ID)
│   │   ├── ImageUploader.tsx       ← Subida de imágenes con compresión integrada
│   │   └── common/                 ← Componentes reutilizables por todos los módulos
│   │       ├── GlobalFooter.tsx     ← Footer de 3 columnas ⚠️ con defaults de Imagine & Stamp
│   │       ├── CartDrawer.tsx       ← Carrito lateral animado de 2 pasos
│   │       ├── CartButton.tsx       ← Botón flotante del carrito con contador
│   │       └── CategoryMenu.tsx     ← Menú de categorías con chips y badges
│   │
│   ├── modules/                    ← ⭐ Módulos de demo (un dir por cliente)
│   │   ├── _template/              ← Scaffold para nuevos demos (copiar y renombrar)
│   │   │   ├── pages/TemplateMenu.tsx
│   │   │   ├── components/
│   │   │   ├── assets/
│   │   │   └── config.ts
│   │   ├── demo-menu/              ← Demo de menú de hamburguesas
│   │   │   └── pages/DemoMenu.tsx
│   │   ├── etiquetas-escolares/    ← Catálogo de etiquetas escolares
│   │   │   ├── pages/CatalogoEtiquetas.tsx
│   │   │   ├── data/designs.ts
│   │   │   └── components/
│   │   └── <nuevo-cliente>/        ← Nuevo demo: copiar _template/ y personalizar
│   │       ├── pages/<Cliente>Menu.tsx
│   │       ├── assets/
│   │       └── config.ts
│   │
│   └── utils/
│       └── metaPixel.ts           ← Tracking de eventos (Pixel + Conversions API)
│
├── supabase/
│   └── functions/
│       ├── create-preference/      ← Edge Function de Mercado Pago
│       └── meta-capi/              ← Edge Function de Meta Conversions API
├── supabase-settings.sql           ← SQL de la tabla settings (datos bancarios)
├── INTEGRACION-PAGOS.md            ← Guía detallada de pagos
├── GUIA-MENUS-DIGITALES.md         ← Guía de diseño UX/UI para menús digitales
├── vite.config.ts
├── tsconfig.json                   ← excluye node_modules y supabase (código Deno)
└── package.json
```

### Archivos cruciales

**`src/store/useCartStore.ts`** — Carrito global con Zustand. Compartido por todos los módulos:
```typescript
// Estado global del carrito: items, paso (1=carrito, 2=datos), datos del cliente
// Métodos: addToCart, removeFromCart, updateQuantity, clearCart, setCartStep, etc.
export const useCartStore = create<CartStore>((set) => ({ ... }));
```

**`src/components/common/CartDrawer.tsx`** — Carrito lateral reutilizable. Recibe props: `bankInfo`, `whatsappNumber`, `businessName`. Lo importan App.tsx y cualquier módulo.

**`src/components/common/GlobalFooter.tsx`** — Footer de 3 columnas. ⚠️ Recibe todas las props explícitamente. Si no se pasan, muestra defaults de Imagine & Stamp.
```tsx
<GlobalFooter
  companyName="Nombre Cliente"
  description="..."
  whatsappNumber="521234567890"
  email="..."
  instagramUrl="..."
  facebookUrl="..."
  address="..."
  hours="..."
/>
```

**`src/lib/supabase.ts`** — Conecta React con Supabase (con fallback a credenciales fijas; la anon key es pública por diseño):
```typescript
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://XXXX.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGci...';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**`vite.config.ts`** — `base: './'` es **CRÍTICO** para GitHub Pages con dominio custom (rutas relativas).

**Rutas (`App.tsx`, HashRouter):**
- `/` → Tienda + catálogo + carrito (Imagine & Stamp)
- `/#/admin` → Panel de control
- `/#/demo-menu` → Demo de menú
- `/#/etiquetas-escolares` → Catálogo de etiquetas
- `/#/<nuevo-cliente>` → Nuevos módulos demo

---

## 3. GitHub y Despliegue Automático

### 3.1 Repositorio
1. [github.com](https://github.com) → **New Repository** → nombre `cliente-web`, **Público**.
2. Sin README ni .gitignore iniciales.

### 3.2 Subir el código
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 3.3 Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
> **Nota:** Cada `git push origin main` compila y publica automáticamente (~2-3 min).
> Si prefieres NO incrustar las credenciales en `supabase.ts`, agrega un bloque
> `env:` al paso de build con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` desde
> **Settings → Secrets and variables → Actions**.

### 3.4 Activar GitHub Pages
**Settings → Pages → Source:** Deploy from a branch → **Branch:** `gh-pages` / `/ (root)`.

---

## 4. Dominio Personalizado (Namecheap)

### 4.1 `public/CNAME` (una sola línea, sin extensión)
```
imagineandstamp.site
```

### 4.2 DNS en Namecheap (**Advanced DNS**)
| Tipo | Host | Valor | TTL |
|------|------|-------|-----|
| A | @ | `185.199.108.153` | Automatic |
| A | @ | `185.199.109.153` | Automatic |
| A | @ | `185.199.110.153` | Automatic |
| A | @ | `185.199.111.153` | Automatic |
| CNAME | www | `TU_USUARIO.github.io` | Automatic |

> Los cambios DNS tardan de minutos a 48h. Verifica en [whatsmydns.net](https://www.whatsmydns.net).

### 4.3 GitHub Pages → Custom domain: `imagineandstamp.site` + **Enforce HTTPS**.

---

## 5. Base de Datos — Supabase

### 5.1 Crear proyecto
[supabase.com](https://supabase.com) → **New Project** → guardar contraseña → región cercana.

### 5.2 Credenciales (**Settings → API**)
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 5.3 Crear las tablas (SQL Editor) — ⚠️ ESQUEMA ACTUALIZADO
```sql
-- ── CATEGORÍAS ───────────────────────────────────────────────
-- submenus es JSONB con formato [{ "name": "...", "children": ["...","..."] }]
-- (soporta subcategorías de 2 niveles)
CREATE TABLE categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  submenus   JSONB DEFAULT '[]',
  image_url  TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUCTOS ────────────────────────────────────────────────
CREATE TABLE products (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  category       TEXT,
  sub_category   TEXT,
  sub_category_2 TEXT,                 -- ← subcategoría de 2º nivel
  image          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── PEDIDOS ──────────────────────────────────────────────────
CREATE TABLE orders (
  id                TEXT PRIMARY KEY,
  customer_name     TEXT,
  customer_phone    TEXT,
  customer_city     TEXT,
  delivery_notes    TEXT,
  payment_method    TEXT,
  payment_reference TEXT,              -- ref. de transferencia o ID de Mercado Pago
  items             JSONB DEFAULT '[]',
  total_amount      NUMERIC DEFAULT 0,
  status            TEXT DEFAULT 'pending',  -- pending | in-process | delayed | delivered
  internal_notes    JSONB DEFAULT '[]',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── AJUSTES / DATOS BANCARIOS (transferencia) ────────────────
-- (también disponible en el archivo supabase-settings.sql)
CREATE TABLE settings (
  id              TEXT PRIMARY KEY,
  bank_name       TEXT,
  account_holder  TEXT,
  clabe           TEXT,
  account_number  TEXT,
  card_number     TEXT,
  instructions    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO settings (id) VALUES ('bank') ON CONFLICT (id) DO NOTHING;
```

### 5.4 Storage (imágenes)
**Storage → New bucket** → nombre `product-images` → **Public bucket: ✅**.

### 5.5 Políticas de Seguridad (RLS)
```sql
-- Lectura pública (tienda)
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON products   FOR SELECT USING (true);
CREATE POLICY "Public read" ON orders     FOR SELECT USING (true);
CREATE POLICY "Public read" ON settings   FOR SELECT USING (true);

-- Escritura anónima (panel admin sin auth formal — anon key)
CREATE POLICY "Anon write" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write" ON products   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write" ON orders     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write" ON settings   FOR ALL USING (true) WITH CHECK (true);

-- Storage
CREATE POLICY "Public storage read"   ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public storage insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
```
> Para producción seria, migrar el admin a Supabase Auth con un usuario real.

### 5.6 Keepalive — Prevenir pausa del proyecto Supabase (OBLIGATORIO)

> [!WARNING]
> **Supabase free tier pausa proyectos tras 1 semana sin actividad (sin requests a la API).**
> Cuando se pausa, la base de datos y Storage dejan de responder — la tienda se rompe.
> Esto ya pasó en la María Rooftop (Julio 2026) y se corrigió con este mecanismo.

**Solución: GitHub Actions workflow** que hace un `curl` a la REST API de Supabase cada 6 horas.

Crear `.github/workflows/keepalive.yml` con las credenciales del proyecto:

```yaml
name: Keepalive Supabase

on:
  schedule:
    - cron: '0 */6 * * *'       # cada 6 horas
  workflow_dispatch:              # también manual

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase REST API
        run: |
          curl -s -o /dev/null -w "%{http_code}" \
            "https://XXXX.supabase.co/rest/v1/products?select=id&limit=1" \
            -H "apikey: TU_ANON_KEY" \
            -H "Authorization: Bearer TU_ANON_KEY" \
            || echo "(ignorado: Supabase puede estar pausado, el ping igual cuenta)"
```

> **Alternativa sin GitHub:** usar [cron-job.org](https://cron-job.org) (gratis) con la misma URL y headers.
>
> *Implementado en: la-maria-rooftop (Julio 2026), amelie-patisserie (Agosto 2026), imagine-and-stamp (Agosto 2026, `.github/workflows/keepalive.yml` con secrets).*

---

## 6. Sistema de Diseño (colores y fuentes)

> 🎯 **Esta es la sección que más cambias por cliente.** Todo el branding vive en
> `src/index.css` usando el bloque `@theme` de **Tailwind v4** (NO es `:root` clásico).

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Inter:wght@100..900&display=swap');
@import "tailwindcss";

@theme {
  /* ── FUENTES ── */
  --font-headline: "Manrope", ui-sans-serif, system-ui, sans-serif;  /* títulos */
  --font-body:     "Inter", ui-sans-serif, system-ui, sans-serif;    /* texto */
  --font-label:    "Inter", ui-sans-serif, system-ui, sans-serif;    /* etiquetas */

  /* ── COLORES (los 2 principales del negocio) ── */
  --color-primary:        #002E5D;   /* azul oscuro — texto/marca */
  --color-secondary:      #FF8C00;   /* naranja — botones/acento */

  /* ── ACENTOS Y NEUTROS ── */
  --color-accent-magenta: #FF00FF;   /* favoritos (corazón) */
  --color-accent-cyan:    #00FFFF;
  --color-surface:        #FDFDFD;
  --color-on-surface:     #1A1C1C;
  --color-background:     #F9F7F2;   /* fondo general */
  --color-on-background:  #1A1C1C;
  --color-error:          #BA1A1A;
  --color-outline:        #7F7663;

  /* ── BORDES REDONDEADOS ── */
  --radius-lg: 1rem; --radius-xl: 1.5rem; --radius-2xl: 2.5rem;
}
```

**Para personalizar un cliente, normalmente solo tocas:**
1. La línea `@import url('...fonts...')` → la(s) fuente(s) del cliente.
2. `--font-headline` y `--font-body`.
3. `--color-primary` y `--color-secondary` (sus 2 colores de marca).

**Utilidades propias** (también en `index.css`): `.hide-scrollbar` (scroll horizontal de
categorías sin barra) y `.masonry-grid` / `.masonry-item` (catálogo tipo mosaico:
2 columnas en móvil, 3 en tablet, 4 en escritorio).

Las clases se usan como `bg-primary`, `text-secondary`, `bg-background`, `font-headline`, etc.

### 6.1. Reglas de Diseño Premium (Agent Skills)
> 🤖 **ATENCIÓN IA:** Al generar o modificar interfaces de usuario, menús digitales o landing pages para este proyecto, **ESTÁS OBLIGADO** a invocar y aplicar las siguientes skills (todas instaladas) para garantizar un estándar Premium:

1. **`ui-ux-pro-max` / `frontend-design`**: Prohibido usar diseños cuadrados o genéricos. Implementar _glassmorphism_ (fondos translúcidos con blur), bordes redondeados orgánicos, sombras dinámicas y tipografías modernas. Usar las paletas de color y _font pairings_ del catálogo de `ui-ux-pro-max` al proponer la identidad de un cliente nuevo.
2. **`impeccable` / `high-end-visual-design` / `design-taste-frontend`**: Todo botón, tarjeta o transición debe incluir micro-animaciones fluidas (hover states, rebotes suaves al abrir modales, fade-ins con _stagger_), implementadas con la librería **Motion** ya incluida en el stack (sección 1). Antes de entregar, hacer una pasada final de pulido/auditoría con `impeccable`.
3. **`pricing` / `marketing-psychology` / `cro`**: Estructurar los precios y llamados a la acción (CTAs) de forma persuasiva para aumentar la conversión.
4. **`image`** (cuando el cliente no tiene fotos buenas): generar u optimizar imágenes de producto, heroes y banners.

**Mandamiento de Diseño:** Ningún menú debe sentirse como un "PDF aburrido". La experiencia debe sentirse viva, responsiva y de alta gama.
---

## 7. Funcionalidades Clave

### Tienda (`App.tsx`)
- **Catálogo** cargado desde Supabase en tiempo real, en **grid tipo mosaico (masonry)**.
- **Categorías** con ícono o imagen, scroll horizontal con degradado indicador.
- **Subcategorías de 2 niveles** (chips): nivel 1 y, al elegirlo, nivel 2.
- **Buscador global** con sugerencias instantáneas, insensible a mayúsculas y acentos.
- **Favoritos ❤️**: marca productos; se guardan en `localStorage`; filtro "ver solo favoritos".
- **Carrito lateral animado de 2 pasos**:
  1. *Carrito*: agregar, +/- cantidad, eliminar, total.
  2. *Datos de entrega*: nombre, teléfono, **método de entrega (Recoger en local o Envío a domicilio)**, dirección (si aplica), **forma de pago** y notas.
- **REGLA OBLIGATORIA (Carrito de Compras):** En cualquier demo o proyecto, el carrito siempre debe ser de **2 pasos**. Nunca debe saltarse directamente al éxito; siempre debe solicitar primero los datos del cliente (Nombre, WhatsApp, Método de Entrega, Dirección, Forma de Pago).
  > ⚠️ **Al replicar un demo existente como plantilla, se copia la ESTRUCTURA y el
  > COMPORTAMIENTO del carrito, no solo el diseño visual.** Es decir, además de los
  > colores/estilos hay que mantener igual: el estado `cart`/`cartStep`/`customerInfo`
  > (con sus mismos campos: `name`, `phone`, `deliveryMethod`, `address`,
  > `paymentMethod`, `cashAmount`, `notes`), la lógica de transición entre paso 1 y 2, el
  > cálculo de `cartTotal`/`totalItems`, y la lógica condicional de `deliveryMethod`
  > (mostrar/ocultar el campo de dirección según "recoger" vs "domicilio") y de
  > `paymentMethod` (mostrar el campo de cambio en Efectivo, el recuadro bancario en
  > Transferencia). Si se cambia el rubro del negocio (ej. de restaurante a tienda de
  > ropa), la lógica de datos de entrega y forma de pago **no cambia**, solo el catálogo y
  > el diseño. No es válido "reinventar" el flujo del carrito por demo — debe comportarse
  > igual en todos, para que el panel admin y el soporte funcionen de forma predecible.
- **REGLA OBLIGATORIA (Limpieza del Carrito y Redirección en Móviles):** Al hacer clic en el botón de "Enviar WhatsApp" para finalizar el pedido:
  1. El sistema **DEBE** mostrar primero la pantalla de éxito (ej. `setCartStep(3)`).
  2. **CRÍTICO PARA MÓVILES:** Luego de un pequeño delay (`setTimeout` de 500ms), usar `window.location.href = ...` para abrir WhatsApp. **NUNCA usar `window.open(..., '_blank')` directamente**, ya que los navegadores integrados (Instagram/Facebook/TikTok) lo interpretan como un popup bloqueado y dejan una pantalla en blanco, impidiendo al cliente avanzar.
  3. Finalmente, limpiar el estado del carrito (`setCart([])`), vaciar los datos del cliente (`setCustomerInfo(...)`) y cerrar el panel/modal para evitar carritos "fantasma" si el usuario regresa atrás.
- **Formas de Pago y Detalles (UI Dinámica)**:
  - *Efectivo* → Mostrar campo para ingresar "Con cuánto vas a pagar" y calcular automáticamente el cambio a entregar.
  - *Transferencia* → Mostrar recuadro destacado con datos bancarios (Banco, Cuenta, CLABE, Titular).
  - *Tarjeta* → **Mercado Pago** (⚠️ opcional, complemento con costo extra).
- **Toast de confirmación** al agregar al carrito.
- Cada pedido se **guarda en Supabase** (tabla `orders`).
- Header con logo, redes sociales, buscador y carrito.
- **REGLA OBLIGATORIA (Footer de 3 Columnas):** Todo proyecto debe incluir un Footer estructurado en **tres columnas principales** (1. Logo y descripción, 2. Contacto, Teléfonos, Dirección y Horarios, 3. Redes Sociales y Promociones). En la parte inferior deben ir los derechos de autor, "Diseñado por IMAGINE & STAMP", los enlaces legales ("Aviso de Privacidad", "Términos de Servicio") y el candado de acceso al Admin.
  > ⚠️ **Todo el contenido de las 3 columnas (logo, descripción, teléfonos, dirección,
  > horarios, redes sociales) debe ser el del NEGOCIO DEL DEMO/CLIENTE, nunca el de
  > Imagine & Stamp.** Lo único que se queda fijo con los datos de Imagine & Stamp es la
  > línea de crédito "Diseñado por IMAGINE & STAMP" al pie — esa sí es la marca de la
  > agencia y no cambia. Si se usa el componente compartido `GlobalFooter.tsx`
  > (`src/components/common/GlobalFooter.tsx`), **hay que pasarle explícitamente todas las
  > props** (`companyName`, `description`, `whatsappNumber`, `email`, `instagramUrl`,
  > `facebookUrl`, `address`, `hours`) con los datos del cliente — sus valores por defecto
  > son los de Imagine & Stamp y se filtran si no se sobreescriben. La alternativa más
  > segura para un demo es construir el footer inline dentro del propio archivo del
  > módulo (como en `la-cazona` y `proveedora-san-luis`), igual que el resto del
  > branding — ver sección 0.
- Botón flotante de WhatsApp.

### Panel de Control (`AdminPanel.tsx`) — acceso en `/#/admin`
- **DISEÑO ESTÁNDAR OBLIGATORIO**: Todo panel debe llevar diseño "Dark Top-Nav" (fondo negro premium, barra de navegación superior, pestañas estilo *pill* iluminadas). ¡Que no quede simple!
- Contraseña maestra `MASTER_PASSWORD = '1212'` (⚠️ cambiar en producción).
- Pestañas completas (mínimo): **Inventario · Nuevo · Categorías · Cupones · Pedidos · Opiniones · Promo · Ajustes**.
- **Inventario**: lista, editar, eliminar productos + **Cambio de Precio Masivo** (por
  categoría / subcategoría / texto, con vista previa de productos afectados).
- **Nuevo**: alta de producto con subida de imagen a Storage (nombre sanitizado).
- **Categorías**: crear, renombrar, reordenar (↑↓ → sort_order), imagen tipo Instagram.
- **Cupones (NUEVO)**: gestión de códigos de descuento promocionales.
- **Pedidos**: pendientes/entregados, cambiar estatus, notas internas, referencia de pago.
- **Opiniones (NUEVO)**: gestión de reseñas de clientes.
- **Promo (NUEVO)**: activar/desactivar y configurar banners/modales promocionales.
- **Ajustes**: editar los datos bancarios para transferencia u otros parámetros.

---

## 8. Pagos: Transferencia y Tarjeta (Mercado Pago)

> Detalle paso a paso en **`INTEGRACION-PAGOS.md`**. Resumen:

> [!IMPORTANT]
> **Alcance del desarrollo base vs. complemento opcional:**
> - **Incluido en el desarrollo base:** catálogo + carrito + finalización por **WhatsApp**
>   y por **Transferencia** (datos bancarios). Esto es lo que recibe todo cliente.
> - **Pago con tarjeta (Mercado Pago) = COMPLEMENTO OPCIONAL CON COSTO EXTRA.** Solo se
>   implementa si el cliente lo pide y contrata ese servicio adicional (requiere su cuenta
>   de Mercado Pago, configurar la Edge Function y el secret, y soporte de pagos).
>   Mientras no se contrate, **no se incluye la opción "Tarjeta"** en el carrito.

### 8.1 Transferencia (incluida — sin comisión)
- Los datos viven en la tabla `settings` (fila `id='bank'`), editables desde
  **Admin → Ajustes**. Al elegir *Transferencia* en el carrito, se muestra un recuadro
  con Banco, Titular, CLABE, etc. y botones de **copiar**.

### 8.2 Tarjeta — Mercado Pago Checkout Pro  ⚠️ OPCIONAL (servicio extra)
> Solo agregar si el cliente contrata el complemento de pago con tarjeta. Para dejarlo
> fuera, basta con no mostrar la opción "Tarjeta" en el `<select>` de forma de pago del
> carrito (en `App.tsx`).

**Regla de oro:** el **Access Token es secreto** → va como *secret* en Supabase, NUNCA en
el frontend. Por eso se usa una **Edge Function** como backend.

**Componentes:**
1. **Secret** `MP_ACCESS_TOKEN` en Supabase (Edge Functions → Secrets). Prueba = `TEST-...`,
   producción = `APP_USR-...` (solo se cambia el valor para pasar a producción).
2. **Edge Function `create-preference`** (`supabase/functions/create-preference/index.ts`):
   recibe `{items, orderId, siteUrl}`, llama a la API de MP con el token y devuelve `init_point`.
   - Se despliega vía **Supabase Dashboard → Edge Functions → Via Editor** (sin CLI/Docker).
   - Maneja CORS, `external_reference = orderId`, `back_urls = SITIO/?pago=exito|error|pendiente`,
     y `auto_return:"approved"` **solo si no es localhost** (MP lo rechaza en local).
3. **Frontend** (`App.tsx` → `handleMercadoPagoCheckout`): crea el pedido (pending),
   invoca la función y redirige a `init_point`. Al volver, un `useEffect` lee la URL
   (`?pago=exito&status=approved&external_reference=...`), marca `payment_reference` y
   muestra un toast.

**REGLA OBLIGATORIA (Retorno Seguro de Mercado Pago)**: Para evitar la pérdida de pedidos tras pagar:
1. **NO vaciar el carrito** (`setCart([])`) antes de redirigir a Mercado Pago.
2. Al volver con éxito (`pago=exito`), mostrar la pantalla de éxito, pero **NO borrar** el enlace de WhatsApp guardado en `localStorage` de inmediato.
3. Forzar **redirección automática** a WhatsApp (`window.location.href`) tras un delay de ~1.5s.
4. El botón manual de "Enviar WhatsApp" en la UI debe limpiar el carrito y el `localStorage` **sólo al hacerle clic**.
5. Si el usuario intenta cerrar el modal de éxito sin enviar el WhatsApp, lanzar un `window.confirm` advirtiendo que el pedido aún no se envía. Limpiar el carrito solo si acepta.

**Patrón canónico (implementado en Tacos Chepe y Takero's CDMX):**
1. **Antes de redirigir a Mercado Pago**, armar el mensaje de WhatsApp COMPLETO y guardarlo en `localStorage` (p.ej. `tacoschepe_pending_whatsapp`), junto con los datos del cliente. NO abrirlo todavía.
2. **Al volver** con `pago=exito&status=approved`, leer ese mensaje del `localStorage` — **no reconstruirlo desde el carrito**, así sobrevive la recarga completa —, añadirle la confirmación `✅ PAGO EN LÍNEA CONFIRMADO · Folio MP: <id>`, actualizar `orders.payment_reference` y mostrar el modal "¡Pago Aprobado!".
3. El botón "Enviar Pedido por WhatsApp" del modal limpia el carrito y el `localStorage` **sólo en su `onClick`**.

**Pruebas:** token `TEST-...` + tarjetas de prueba (titular **APRO** = aprobado).

**Pendiente recomendado:** webhook `mp-webhook` (Edge Function con `verify_jwt=false` +
`service_role key`) para confirmar el pago aunque el cliente cierre la pestaña.

---

## 9. Guía para Replicar el Modelo (Cliente Nuevo)

### Paso 1 — Duplicar el código base
```bash
git clone https://github.com/renefgonzalez/imagine-stamp-web.git nombre-cliente
cd nombre-cliente
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/nuevo-repo-cliente.git
```

### Paso 2 — Personalizar el branding (diseño)
| Archivo | Qué cambiar |
|---------|------------|
| `src/index.css` | 🎨 Fuentes (`@import` + `--font-*`) y colores (`--color-primary`, `--color-secondary`) — **ver sección 6** |
| `src/logo.png` | Logo del cliente |
| `public/hero-*.png` | Imagen principal (Hero) — y actualizar el `src` en `App.tsx` |
| `public/CNAME` | Nuevo dominio |
| `package.json` → `homepage` | URL del nuevo dominio |
| `public/robots.txt` y `sitemap.xml` | URLs del nuevo dominio (SEO) |

### Paso 3 — Personalizar textos (buscar y reemplazar en `App.tsx`)
- `"Imagine & Stamp"` → nombre del cliente
- `"Personalizamos tus momentos más especiales..."` → descripción
- `"525650469993"` → WhatsApp del cliente
- `"imagineandstamp@gmail.com"` → correo
- URLs de Instagram / Facebook → redes del cliente
- Categorías por defecto (`DEFAULT_CATEGORIES` e `ICON_MAP`) → rubro del cliente

### Paso 4 — Supabase del cliente
1. Nuevo proyecto en supabase.com.
2. Ejecutar **todo** el SQL de la sección 5.3 (tablas) y 5.5 (RLS).
3. Crear bucket `product-images` público.
4. Copiar URL y anon key → ponerlas en `src/lib/supabase.ts` (o como Secrets de GitHub).

### Paso 5 — GitHub + Pages
1. Crear repo vacío y hacer push.
2. (Opcional) Secrets `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
3. Activar Pages (branch `gh-pages`).

### Paso 6 — Dominio (Namecheap) → sección 4.

### Paso 7 — Seguridad del admin
`src/AdminPanel.tsx` → `const MASTER_PASSWORD = '1212';` → cambiar por una contraseña fuerte.

### Paso 8 — Pagos
- **Transferencia (incluida):** ejecutar `supabase-settings.sql` y llenar datos en
  Admin → Ajustes.
- **Tarjeta / Mercado Pago (OPCIONAL — costo extra):** solo si el cliente contrata el
  complemento. Crear su cuenta de Mercado Pago, agregar el secret `MP_ACCESS_TOKEN` y
  desplegar la Edge Function `create-preference` (ver sección 8 e `INTEGRACION-PAGOS.md`).
  Si no lo contrata, **quitar la opción "Tarjeta"** del `<select>` de forma de pago en `App.tsx`.

---

## 10. Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| Pantalla blanca al compilar | Import faltante de lucide-react | Verificar todos los imports |
| Build falla en GitHub Actions | Faltan credenciales | Poner credenciales en `supabase.ts` o como Secrets |
| Imágenes no cargan tras desplegar | `base` incorrecto en vite.config | Debe ser `base: './'` |
| "Invalid key" al subir imagen | Nombre con espacios/ñ/acentos | Sanitizar: `normalize("NFD").replace(/[^a-z0-9.]/g,'-')` |
| Categorías sin orden | Falta `.order('sort_order')` | Agregarlo en las consultas de categorías |
| Dominio "Not Found" | DNS no propagado / CNAME mal | Verificar en whatsmydns.net; www → `usuario.github.io` |
| RLS bloquea el admin | Policies muy restrictivas | Policy `FOR ALL USING (true) WITH CHECK (true)` |
| `submenus` no guarda sub-niveles | Columna como `TEXT[]` | La columna debe ser **JSONB** (ver 5.3) |
| **`npx` falla en Windows** | La ruta contiene `&` (`IMAGINE&STAMP`) que corta el comando | Invocar el binario local: `& node ".\node_modules\vite\bin\vite.js" build` y `& node ".\node_modules\typescript\bin\tsc" --noEmit` |
| Mercado Pago rechaza la preferencia | `auto_return` con URL localhost | Solo enviar `auto_return` cuando NO es localhost |
| Botón "Pagar con Tarjeta" da error | Falta secret o Edge Function | Verificar `MP_ACCESS_TOKEN` y que `create-preference` esté desplegada |
| Edge Function responde "no encontrado" aunque el registro existe | `service_role` sin `GRANT` en la tabla (RLS no es lo único que bloquea) | `GRANT ALL ON TABLE tu_tabla TO service_role;` — RLS y GRANT son capas distintas |
| No se ve el error real de una Edge Function | El código atrapa cualquier error y devuelve un mensaje genérico | Agregar temporalmente `debug: error?.message` a la respuesta y probar con `curl` directo (ver 12.6), luego quitarlo |
| Un campo se borra solo al reeditar un producto/registro | El objeto `initial` del formulario de edición no incluye todos los campos de la entidad | Mapear **todos** los campos del tipo/interfaz en el `initial`, no solo los que se usaron al escribir el formulario la primera vez |
| Una imagen/logo se ve "vieja" o incorrecta después de subir un fix | Caché del navegador (no del servidor) | Verificar con `curl -I` que el archivo en el servidor ya es el correcto; probar en ventana de incógnito antes de asumir que el fix falló |
| Producto digital pagado con tarjeta nunca le llega el link al cliente | El `useEffect` de regreso de Mercado Pago solo muestra un toast genérico; nunca marca `digital_orders` como `paid` ni arma el link | Implementar el patrón de 12.10: guardar `pendingDigitalOrders`/`pendingWhatsappUrl` en `localStorage` antes de redirigir, y completarlo en el regreso |
| URL de archivo en hosting propio (cPanel) da 404 | Se incluyó `public_html` en la URL pública | `public_html` es la raíz del servidor, no va en la URL: `dominio.com/carpeta/archivo`, no `dominio.com/public_html/carpeta/archivo` |
| **WhatsApp no abre / Pantalla blanca en celular** al "Enviar Pedido" | Navegadores integrados (FB/IG) bloquean `window.open(..., '_blank')` al considerarlo popup malicioso | Usar `setCartStep(3)` primero, luego hacer `setTimeout` de 500ms y usar `window.location.href = ...` para la redirección. |

---

## 11. Costos del Modelo

| Servicio | Plan | Costo |
|---------|------|-------|
| GitHub + Pages | Free | $0/mes |
| Supabase (DB + Storage + Edge Functions) | Free tier | $0/mes (hasta 500MB DB, 1GB Storage) |
| Mercado Pago *(complemento opcional)* | Por transacción | comisión ~3–4% + IVA por venta con tarjeta |
| Namecheap | Dominio .site | ~$3–15 USD/año |
| **Total fijo** | | **~$3–15 USD/año** (+ comisión MP **solo si** se contrata el complemento de tarjeta) |

> 💼 **Comercial:** el pago con tarjeta (Mercado Pago) se cotiza como **servicio adicional**
> aparte del desarrollo del catálogo. Implica trabajo extra (Edge Function, configuración,
> pruebas y soporte de pagos), por lo que tiene un **costo de desarrollo extra** además de
> la comisión por transacción que cobra Mercado Pago.

> El free tier de Supabase es suficiente para negocios pequeños. Plan Pro: $25 USD/mes
> si crece (>500MB datos o mucho tráfico).

> Nota: un demo (sección 0) no tiene costo — vive dentro del repo, dominio y hosting que
> ya existen de `imagine-and-stamp`. Estos costos solo aplican cuando el cliente pasa a
> producción con su propio Supabase/dominio.

---

## 12. Creación de Nuevos Módulos Internos (Demos)

> Ver también la **sección 0** para el flujo rápido resumido — esta sección tiene el
> detalle completo de la arquitectura modular con los componentes compartidos reales.

### 12.1. Ubicación y estructura obligatoria

Todo módulo nuevo va dentro de `src/modules/<nombre-cliente>/` con esta estructura:

```
src/modules/<nombre-cliente>/
├── pages/
│   └── <NombreCliente>Menu.tsx   ← Página principal (productos, carrito, footer)
├── components/                   ← Solo si el módulo los necesita (componentes propios)
├── assets/                       ← Imágenes, logo, hero (TODAS aquí)
│   ├── logo.png
│   ├── hero-bg.jpg
│   └── producto-1.jpg
└── config.ts                     ← Colores, WhatsApp, redes, datos del negocio
```

### 12.2. El archivo config.ts (datos del cliente)

Cada módulo define su propia configuración — **sin tocar `src/config/siteConfig.ts` ni `src/index.css`**:

```typescript
// src/modules/<cliente>/config.ts
export const clientConfig = {
  businessName: 'Nombre del Negocio',
  description: 'Descripción corta para el footer',
  phone: '521234567890',            // WhatsApp
  email: 'cliente@email.com',
  address: 'Calle 123, Colonia, Ciudad',
  hours: 'Lun-Vie 9:00-18:00, Sáb 10:00-14:00',
  instagramUrl: 'https://instagram.com/...',
  facebookUrl: 'https://facebook.com/...',
  logo: require('./assets/logo.png'),

  // Paleta de colores (se usan como clases hex directas en el JSX)
  colors: {
    primary: '#1A1A1A',
    secondary: '#E84C3D',
    accent: '#FFB800',
    bg: '#FAFAFA',
    cardBg: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
  },

  // Fuentes (se importan en el propio archivo del módulo con <link> o @import)
  fonts: {
    headline: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
};
```

### 12.3. Componentes compartidos disponibles

El módulo puede (y debe) reutilizar estos componentes de `src/components/common/`:

| Componente | Import | Props obligatorias |
|---|---|---|
| **CartDrawer** | `../../../components/common/CartDrawer` | `isOpen, onClose, whatsappNumber, businessName, bankInfo` |
| **CartButton** | `../../../components/common/CartButton` | (ninguna — usa el store global) |
| **GlobalFooter** | `../../../components/common/GlobalFooter` | `companyName, description, whatsappNumber, email, instagramUrl, facebookUrl, address, hours` |
| **CategoryMenu** | `../../../components/common/CategoryMenu` | `isCategoryOpen, activeCategory, setActiveCategory, ...` |

> ⚠️ **GlobalFooter tiene defaults de Imagine & Stamp.** Si NO pasás todas las props,
> el footer muestra el teléfono/correo/dirección de Imagine & Stamp. Para demos, es más
> seguro construir el footer inline con los datos de `config.ts`.

### 12.4. Carrito: dos patrones válidos

#### A. Patrón estándar — `useCartStore` (Zustand) — RECOMENDADO

El módulo comparte el store global de `src/store/useCartStore.ts`. Esto asegura comportamiento
consistente en todos los demos (carrito de 2 pasos, métodos de entrega, formas de pago, limpieza):

```tsx
import { useCartStore } from '../../../store/useCartStore';

const { addToCart, cart, cartTotal, clearCart, isOpen, openCart, closeCart } = useCartStore();
```

Este es el patrón que usa `_template/`. El store maneja: agregar/quitar items, cantidades,
paso del carrito (1=items, 2=datos cliente), método de entrega, forma de pago, y datos del
cliente (`name, phone, deliveryMethod, address, paymentMethod, notes, cashAmount`).

#### B. Patrón premium / custom — carrito propio con `useState`

Para demos que requieren diseño o funciones muy distintas (ej. `demo-menu` con dark mode,
selector de marca, Google Sheets), el carrito se implementa localmente:

```tsx
const [cart, setCart] = useState<CartItem[]>([]);
const [cartStep, setCartStep] = useState(1);
```

**Reglas no negociables (aplica a AMBOS patrones):**
- Carrito de 2 pasos: paso 1 = items, paso 2 = datos del cliente, paso 3 = confirmación
- Los campos del cliente son: `name, phone, deliveryMethod, address, paymentMethod, notes`
- WhatsApp checkout: `window.location.href` (no `window.open`)
- Limpiar carrito al enviar el pedido
- Si se usa `GlobalFooter`, pasar todas las props explícitamente

### 12.5. Registrar la ruta

```tsx
// En src/App.tsx:
import NuevoClienteMenu from './modules/nuevo-cliente/pages/NuevoClienteMenu';

// Dentro de <Routes>:
<Route path="/nuevo-cliente" element={<ErrorBoundary><NuevoClienteMenu /></ErrorBoundary>} />
```

### 12.6. Usar el scaffold _template/

El directorio `src/modules/_template/` contiene un menú completo con carrito de 2 pasos,
footer de 3 columnas, buscador, categorías y WhatsApp checkout — todo hardcodeado, listo
para personalizar.

1. Copiar `_template/` → renombrar a `<nombre-cliente>/`
2. Editar `config.ts` con los datos reales del cliente
3. Editar `<TemplateMenu.tsx>`: reemplazar PRODUCTS, categorías, colores hex
4. Registrar ruta en App.tsx
5. `npm run dev` → revisar → push → desplegado automáticamente en `imagineandstamp.site/#/nombre-cliente`

---

## 13. Módulo Opcional: Descargas Digitales

> Este módulo permite vender productos digitales (archivos, vectores, plantillas, cursos, etc.) de manera segura, generando links únicos de descarga limitada que se activan únicamente cuando el administrador aprueba el pago.
>
> *Implementado y probado de punta a punta en dos proyectos: Sahumerio Sagrado (tabla
> separada `digital_products`) y Mundo Halloween (reutilizando la tabla de productos
> existente + columna `file_path` — más simple, recomendado si ya tienes un catálogo).*

### 13.1. Dos formas de modelar el producto digital

| Enfoque | Cuándo usarlo |
|---------|---------------|
| **A. Columna `file_path` en la tabla de productos existente** (recomendado) | Ya tienes una tabla `products`/`costumes` y solo quieres que algunos productos sean digitales. Un producto digital es una fila normal con `category = 'descargas-digitales'` y `file_path` = URL del archivo. |
| **B. Tabla `digital_products` separada** | El catálogo digital es independiente del físico, o quieres evitar tocar el esquema de productos existente. |

En ambos casos el archivo **NO se sube a Supabase Storage** (consume la cuota de 5GB del
free tier — ver sección 14). Se sube al **hosting propio (cPanel)** y `file_path` guarda
la URL completa externa.

**SQL — Enfoque A (agregar a una tabla de productos existente):**
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS file_path text;

-- Categoría reservada, fija, que el admin no puede borrar/editar (ver 12.2)
INSERT INTO categories (id, label, emoji, order_index)
VALUES ('descargas-digitales', 'Descargas Digitales', '💾', 999)
ON CONFLICT (id) DO NOTHING;
```

**SQL — tabla de pedidos digitales (igual en ambos enfoques):**
```sql
CREATE TABLE IF NOT EXISTS public.digital_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id bigint REFERENCES public.products(id) ON DELETE SET NULL,  -- products.id es BIGSERIAL, debe coincidir
  customer_name text NOT NULL,
  customer_phone text,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  download_token uuid NOT NULL DEFAULT gen_random_uuid(),
  download_count int NOT NULL DEFAULT 0,
  max_downloads int NOT NULL DEFAULT 1,
  internal_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS digital_orders_download_token_idx ON public.digital_orders(download_token);
```

**Permisos — RLS + GRANT (mismo modelo permisivo que el resto del proyecto):**
```sql
GRANT ALL ON TABLE public.digital_orders TO anon;
GRANT ALL ON TABLE public.digital_orders TO authenticated;
GRANT ALL ON TABLE public.digital_orders TO service_role;  -- ⚠️ ver 12.6, es el que casi siempre se olvida

ALTER TABLE public.digital_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read digital_orders"   ON public.digital_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert digital_orders" ON public.digital_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update digital_orders" ON public.digital_orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete digital_orders" ON public.digital_orders FOR DELETE USING (true);
```

### 13.2. Categoría bloqueada en el Admin (candado 🔒)

La categoría `descargas-digitales` **no debe poder editarse ni borrarse** desde el panel
(el flujo entero depende de ese id exacto). Patrón usado en la pestaña "Categorías":

```tsx
const DIGITAL_CATEGORY_ID = 'descargas-digitales';

{categories.map((cat, i) => {
  const isLockedCategory = cat.id === DIGITAL_CATEGORY_ID;
  return (
    // ...
    {isLockedCategory ? (
      <div title="La usa el módulo de Descargas Digitales — no se puede editar ni borrar.">
        <Lock size={14} />
      </div>
    ) : (
      /* botones normales de editar/borrar */
    )}
  );
})}
```

En el formulario de producto (alta/edición), cuando `category === DIGITAL_CATEGORY_ID`:
- Mostrar un campo extra **"URL del archivo en tu hosting"** (obligatorio).
- Ocultar/forzar los campos que no aplican a un archivo (tallas, tipo renta/venta → forzar `"Venta"`).
- Validar que no se guarde vacío antes de permitir el submit.

> ⚠️ **Bug real que ya nos pasó:** si el formulario de **edición** de un producto existente
> arma su estado inicial con un objeto que **no incluye todos los campos** de la entidad
> (por ejemplo, se olvida `file_path`, `rating`, `video_url`...), al reabrir para editar
> esos campos aparecen vacíos — y si le das "Guardar" sin darte cuenta, **se sobreescribe
> con vacío en la base de datos**. Regla: el objeto `initial` de cualquier formulario de
> edición debe mapear **absolutamente todos los campos** de la interfaz/tipo, no solo los
> que "se ocurren" al momento de escribirlo.

### 13.3. Flujo de Compra (Frontend)

1. Si el carrito es **100% productos digitales**, el método de entrega se fuerza
   automáticamente a `"Entrega digital"` (con un `useEffect` sobre el carrito) y el
   `<select>` de método de envío se reemplaza por un badge fijo no editable — no tiene
   sentido pedir dirección para un archivo.
2. Al confirmar el pedido, se inserta 1 fila en `digital_orders` **por cada producto
   digital del carrito** (`status: 'pending'`, `max_downloads: 1`). Supabase asigna el
   `download_token` (UUID) automáticamente.
3. Esto aplica igual en el flujo de WhatsApp y en el de Mercado Pago (en ambos, insertar
   los pedidos digitales justo después de crear el pedido "normal").

### 13.4. Panel Admin — Pedidos Digitales

Dentro de la misma pestaña de "Pedidos" (junto a los pedidos físicos), cada pedido
digital muestra: nombre, teléfono, producto, estatus, y estos botones:

- **"Marcar pagado y avisar"** → cambia `status` a `'paid'`, genera el link
  `https://tudominio.com/#/descarga-digital/{download_token}` y abre WhatsApp **al
  teléfono del cliente** (no al negocio) con el mensaje y el link ya redactados.
- **"Reenviar link"** → regenera el mismo link (por si se perdió) sin tocar el estatus.
- **Copiar link** — por si prefieres pegarlo tú manualmente en vez de vía WhatsApp.
- **Control +/- de `max_downloads`** — el tope nace en 1; el admin lo sube si el cliente
  tiene problemas para descargar. No se permite bajarlo por debajo de lo ya descargado.
- **Notas internas** — igual que en los pedidos físicos.

### 13.5. Edge Function `get-digital-download`

La entrega del archivo **nunca** debe exponer la URL directa del hosting sin validar —
por eso vive detrás de una Edge Function con `service_role` (bypassa RLS pero **sigue
necesitando el GRANT de tabla**, ver 12.6):

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@^2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const { token } = await req.json();

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: order } = await supabase.from('digital_orders')
    .select('id, status, download_count, max_downloads, product_id')
    .eq('download_token', token).single();

  if (!order) return json({ error: 'Pedido no encontrado' }, 404);
  if (order.status !== 'paid') return json({ error: 'Todavía no está pagado' }, 400);
  if (order.download_count >= order.max_downloads) return json({ error: 'Límite alcanzado' }, 400);

  const { data: product } = await supabase.from('products').select('file_path, name').eq('id', order.product_id).single();
  if (!product?.file_path) return json({ error: 'Archivo no disponible' }, 404);

  await supabase.from('digital_orders').update({ download_count: order.download_count + 1 }).eq('id', order.id);
  return json({ url: product.file_path, productName: product.name, remainingDownloads: order.max_downloads - (order.download_count + 1) });
});
```

- Se despliega igual que `create-preference`: **Dashboard → Edge Functions → Deploy new
  function → Via Editor** (sin CLI). Nombre exacto: `get-digital-download`.
- Dejar **"Verify JWT with legacy secret"** en su valor por default (ON) — el `anon key`
  que ya manda `supabase.functions.invoke(...)` automáticamente lo satisface, no hay que
  configurar nada especial ahí.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los inyecta Supabase solo, no son secrets
  manuales (a diferencia de `MP_ACCESS_TOKEN`).

### 13.6. ⚠️ El error más probable: "permission denied for table..."

Si al probar el link de descarga sale **"Pedido no encontrado"** aunque el pedido sí
existe en la tabla, el mensaje real casi siempre está enmascarado. Para diagnosticarlo,
llama a la función **directo con curl** (sin pasar por el frontend):

```bash
curl -s -X POST 'https://TU_PROYECTO.supabase.co/functions/v1/get-digital-download' \
  -H 'Authorization: Bearer TU_ANON_KEY' \
  -H 'apikey: TU_ANON_KEY' \
  -H 'Content-Type: application/json' \
  --data '{"token":"EL_TOKEN_DE_PRUEBA"}'
```

Si el JSON de vuelta trae `"debug":"permission denied for table digital_orders"` (agrega
temporalmente ese campo al `return json(...)` de error para verlo), la causa casi siempre
es que el `GRANT` **no incluyó `service_role`**:

```sql
GRANT ALL ON TABLE public.digital_orders TO service_role;
GRANT ALL ON TABLE public.products TO service_role;  -- o el nombre real de tu tabla de productos
```

`service_role` **bypassa RLS**, pero sigue necesitando el `GRANT` de tabla a nivel
Postgres — son dos capas distintas de permisos y es fácil olvidar la segunda.

### 13.7. Alojamiento del archivo en cPanel (no Supabase Storage)

1. Crea una carpeta dedicada, ej. `public_html/descargas/`.
2. Sube el archivo con un **nombre difícil de adivinar**
   (`kit-halloween-x7k29a.pdf`, no `kit1.pdf`) — la seguridad real de la descarga depende
   de que nadie adivine la URL directa del archivo, el token solo controla cuántas veces
   se usa el link "oficial".
3. Sube un `.htaccess` dentro de esa carpeta con `Options -Indexes` para que nadie pueda
   listar el contenido completo entrando a `tudominio.com/descargas/`.
4. **⚠️ Error común:** la URL pública **NO incluye `public_html`** — `public_html` es la
   carpeta raíz del servidor, no parte de la URL. Es `https://tudominio.com/descargas/archivo.pdf`,
   **no** `https://tudominio.com/public_html/descargas/archivo.pdf`.
5. Pega esa URL completa en el campo `file_path` del producto digital, en el admin.

### 13.8. Componente de Descarga (React)

Ruta en `App.tsx`:
```tsx
<Route path="/descarga-digital/:token" element={<DigitalDownload />} />
```
`DigitalDownload.tsx` toma el `:token` de la URL, llama a la Edge Function, y muestra:
estado de carga → botón "Descargar ahora" + descargas restantes (éxito), o un mensaje de
error amigable (token inválido, no pagado, límite alcanzado, archivo no disponible).

> Usa **assets del proyecto real** para el logo/branding de esta página (ej.
> `/logo-negocio.png` desde `public/`), no un logo importado de `src/` que pueda ser un
> remanente de otra plantilla — verifica visualmente antes de dar por bueno el diseño.

### 13.10. Entrega automática del link tras pago con tarjeta (patrón "modal post-pago")

> Sin esto, un pedido digital pagado con tarjeta se queda en `digital_orders.status =
> 'pending'` **para siempre** a menos que el admin entre manualmente al panel, encuentre
> ese pedido específico y le dé clic a "Marcar pagado y avisar" (12.4). Con este patrón,
> el cliente recibe su link **en pantalla, sin que el admin haga nada**, apenas Mercado
> Pago confirma el pago — 12.4 queda como respaldo manual (link perdido, reenvíos, etc.),
> ya no como el único camino.
>
> *Implementado primero en Sahumerio Sagrado; replicado sin cambios de fondo en Mundo
> Halloween (Julio 2026) — mismo mecanismo, solo cambia la paleta de colores del modal
> para que combine con la marca.*

**La idea central:** todo lo que se necesita para completar la entrega (a qué pedidos
digitales marcar como pagados, y el mensaje de WhatsApp para el comprobante) se prepara
y se guarda en `localStorage` **antes** de mandar al cliente a Mercado Pago. Cuando
Mercado Pago lo regresa con el pago aprobado, la página lee ese `localStorage`, termina
el trabajo, y lo borra. Esto evita dos problemas reales:
- Abrir WhatsApp *antes* de que el pago se confirme no tiene sentido (el pago puede
  rechazarse) y además, si se abre como popup automático al volver de una redirección
  (no de un clic real del usuario), **el navegador lo bloquea**.
- El componente se vuelve a montar desde cero al volver de Mercado Pago (es una
  navegación completa, no un cambio de ruta dentro de la SPA), así que cualquier estado
  en memoria (el carrito, los ids que se acaban de crear) se pierde si no se guarda en
  algún lado que sobreviva la recarga — de ahí `localStorage`.

**Paso 1 — Antes de redirigir a Mercado Pago** (dentro de `handleMercadoPagoCheckout`,
justo después de crear el pedido "normal" y los `digital_orders`):

```ts
// insertDigitalOrdersForCart DEBE devolver id + download_token —
// si el .insert(rows) no lleva .select('id, download_token'), Supabase
// no regresa nada y este flujo no tiene con qué armar el link después.
const digitalOrdersCreated = await insertDigitalOrdersForCart(cart, customer, 'pending');
if (digitalOrdersCreated.length > 0) {
  localStorage.setItem('pendingDigitalOrders', JSON.stringify(digitalOrdersCreated));
}

// Arma el mensaje de WhatsApp (va al número DEL NEGOCIO — el cliente lo
// manda para confirmar su pago, no es el link de descarga) y GUÁRDALO,
// no lo abras todavía.
localStorage.setItem('pendingWhatsappUrl', whatsappUrl);

window.location.href = data.init_point; // recién aquí se redirige
```

**Paso 2 — Al volver** (`?pago=exito&status=approved...`), dentro del `useEffect` que ya
lee esos query params (ver 12.3):

```ts
if (pago === 'exito' && status === 'approved') {
  const pendingDigitalOrders = localStorage.getItem('pendingDigitalOrders');
  if (pendingDigitalOrders) {
    const created = JSON.parse(pendingDigitalOrders);
    const ids = created.map(o => o.id);
    supabase.from('digital_orders').update({ status: 'paid' }).in('id', ids).then(() => {});
    setDigitalDownloadLinks(created.map(o =>
      `${window.location.origin}${window.location.pathname}#/descarga-digital/${o.download_token}`
    ));
    localStorage.removeItem('pendingDigitalOrders');
  }

  const savedWa = localStorage.getItem('pendingWhatsappUrl');
  if (savedWa) {
    setPendingWhatsappUrl(savedWa);
    setShowPostPaymentModal(true);       // el link de WhatsApp se abre solo al dar clic
    localStorage.removeItem('pendingWhatsappUrl');
  } else {
    setToastMessage('✅ ¡Pago aprobado!'); // pedido sin productos digitales: solo un toast
  }
}
```

**Paso 3 — El modal "¡Pago Aprobado!"** muestra, si `digitalDownloadLinks.length > 0`,
un botón de descarga por cada producto digital (va directo a la ruta
`/#/descarga-digital/:token` de 12.8, que ya funciona porque el pedido acaba de quedar
`paid`) **más** un botón "Enviar Comprobante" — y solo el `onClick` de ese botón hace
`window.open(pendingWhatsappUrl)`. Ese clic es el gesto real de usuario que el navegador
necesita para no bloquear el popup.

> ⚠️ El mensaje de WhatsApp de este flujo va al **número del negocio**, no al del
> cliente — es el cliente confirmando/mandando su comprobante, no la entrega del
> archivo. El archivo se entrega mostrándolo directamente en el modal. El botón
> "Marcar pagado y avisar" del admin (12.4) es un canal *distinto y manual*, que sí manda
> WhatsApp al teléfono del cliente con el link — útil como respaldo, no como flujo
> principal.

### 13.11. Checklist rápido de despliegue

1. [ ] SQL de la tabla de productos (columna `file_path`) + categoría reservada + tabla `digital_orders` + **los 3 GRANT (`anon`, `authenticated`, `service_role`)**.
2. [ ] Edge Function `get-digital-download` desplegada.
3. [ ] Candado en la categoría del admin + campo de URL en el formulario de producto.
4. [ ] Lógica de entrega digital automática en el carrito + inserción en `digital_orders`.
5. [ ] Sección de pedidos digitales en el admin (marcar pagado, reenviar link).
6. [ ] Ruta y componente `DigitalDownload`.
7. [ ] Patrón de entrega automática post-pago con tarjeta (12.10): `insertDigitalOrdersForCart`
   con `.select()`, `localStorage` de `pendingDigitalOrders`/`pendingWhatsappUrl`, y el
   modal "¡Pago Aprobado!" con el botón de descarga + "Enviar Comprobante".
8. [ ] Build (`npm run build`) subido a cPanel — recuerda que **cada vez que cambias
   frontend hay que regenerar `dist/` y volver a subirlo**, esto no se actualiza solo.
9. [ ] Probar con `curl` directo a la Edge Function antes de probar en navegador (más
   rápido para diagnosticar permisos/errores reales).
10. [ ] Si algo se ve "raro" después de subir un fix, probar en **ventana de incógnito**
    antes de asumir que el fix no funcionó — el caché del navegador engaña seguido.

---

## 14. Optimización de Imágenes y Ancho de Banda (Supabase)

> [!WARNING]
> **El ancho de banda de Supabase Storage en el plan gratuito está limitado a 5 GB mensuales.** Si un proyecto consume todo el límite, la base de datos y los servicios del proyecto se bloquearán hasta el siguiente ciclo de facturación.

Para evitar consumir excesivo ancho de banda al renderizar catálogos o menús con muchas imágenes, es **OBLIGATORIO** implementar las siguientes estrategias:

### Estrategia 1: Atributo `loading="lazy"` (OBLIGATORIO en todo producto)
Agregar `loading="lazy"` a **todas** las etiquetas `<img>` de productos (catálogo, favoritos, carrito). No aplica a logo, hero ni QR.

### Estrategia 2: Paginación "Ver más" de 10 en 10 (OBLIGATORIO)
Limitar productos renderizados inicialmente a 10, con botón "Ver más" manual (no scroll infinito). Reiniciar a 10 al cambiar categoría/búsqueda.

```tsx
const [visibleItems, setVisibleItems] = useState(10);
useEffect(() => { setVisibleItems(10); }, [activeCategory, searchQuery]);

{filteredProducts.slice(0, visibleItems).map(p => ( ... ))}

{visibleItems < filteredProducts.length && (
  <button onClick={() => setVisibleItems(prev => prev + 10)}>
    Ver más ({filteredProducts.length - visibleItems} restantes)
  </button>
)}
```

> Implementado y probado en: amelie-patisserie (Agosto 2026), Mundo Halloween (Julio 2026).

### Estrategia 3: Comprimir en el navegador ANTES de subir (OBLIGATORIO en todo admin)
Helper en `src/lib/imageCompression.ts` + componente `ImageUploader.tsx` con preview, stats de compresión, y callback al padre para subir a Supabase Storage. Comprime a JPEG (~70% calidad, 800px) con Canvas API. Si comprimir empeora el tamaño, se queda con el original.

```typescript
// Redimensiona a un ancho máximo y re-codifica a JPEG con calidad ~80-85%.
// Si comprimir no ayuda (ej. la imagen ya viene en WebP muy optimizado),
// se queda con el original — nunca "optimiza" para que pese más.
export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (err) {
    console.error('No se pudo comprimir la imagen, se sube el original:', err);
    return file;
  }
}
```

Uso (dentro del `uploadFile` que ya exista en el panel admin):
```typescript
const uploadFile = async (file: File) => {
  const compressed = await compressImage(file);  // ← única línea nueva
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${compressed.name.split('.').pop()}`;
  const { error } = await supabase.storage.from('productos').upload(fileName, compressed);
  // ...
};
```

**Referencia real (Mundo Halloween, Julio 2026):** con 1600px de ancho máximo y calidad
82%, una foto de 20MB bajó a ~950KB — pérdida de calidad imperceptible en el uso normal
del catálogo (grid de tarjetas, vista de producto), porque ninguna pantalla muestra la
imagen a más resolución de la que realmente pesa.

### Optimizar retroactivamente fotos que YA están subidas (catálogos existentes)

Si el catálogo ya tiene muchas fotos subidas antes de aplicar la Estrategia 3, **no
conviene recomprimir todo a ciegas** — muchas imágenes ya vienen en WebP (más eficiente
que JPEG) y forzarlas a JPEG las haría más pesadas, no menos. Proceso recomendado:

1. **Auditoría primero (solo lectura, sin tocar nada):** un script de Node con `sharp`
   descarga cada imagen, simula la compresión y compara tamaños, **sin subir ni guardar
   nada**. Reporta: peso total actual, peso estimado tras optimizar, y cuántas imágenes
   *de verdad* conviene reemplazar (aplicando la misma regla de "nunca empeorar").
2. **Ver el punto óptimo costo/beneficio por umbral de peso.** En la práctica (Mundo
   Halloween, 664 fotos): optimizar *todas* las candidatas daba 33% de ahorro, pero
   **optimizar solo las ≥400KB (34 fotos, el 5% del total) ya capturaba el 77% del
   ahorro total** — mucho menos riesgo tocando muchos menos archivos.
3. **Ejecutar el reemplazo real solo sobre ese subconjunto**, con estas reglas de
   seguridad no negociables:
   - Nunca borrar el archivo viejo del Storage (evita dejar un producto sin imagen si
     algo sale mal — el espacio ahorrado en Storage es secundario, lo importante es el
     ancho de banda).
   - Subir la versión comprimida como **archivo nuevo** (nunca sobreescribir el mismo
     path).
   - Verificar con un `HEAD` request que la nueva URL responde `200` **antes** de
     actualizar la fila en la base de datos.
   - Guardar un log JSON (`{productId, field, oldUrl, newUrl, tamaños}`) de cada cambio,
     para poder auditar o revertir manualmente (pegar `oldUrl` de vuelta) si hace falta.
4. **Verificar visualmente una muestra al final** (no solo confiar en los números) —
   descargar 2-3 de las imágenes reemplazadas y abrirlas, comparándolas contra el
   original, antes de dar el trabajo por terminado.

> 💡 Este mismo patrón (auditoría de solo-lectura → decidir alcance → ejecutar con
> verificación paso a paso → log de reversión) es reutilizable para cualquier migración
> masiva de datos en producción, no solo imágenes.

## 15. Reglas de Aislamiento para Nuevos Clientes

Cuando se solicite iniciar un nuevo cliente o módulo independiente a través del asistente de IA (Antigravity u otros), **siempre se debe incluir explícitamente la siguiente instrucción en el prompt**:

> *"Por favor, inicializa este módulo con variables de estado en blanco (null) y sin heredar ninguna configuración previa de proyectos existentes (como Supabase o variables de store globales)."*

Esto previene que el nuevo módulo herede conexiones activas de base de datos o estados globales del proyecto `imagine-and-stamp`, garantizando un lienzo completamente limpio.

---

## 16. Proceso Creativo — Del Menú Impreso al Menú Digital

> El cliente típico de Imagine & Stamp envía su menú **impreso o en PDF** con su diseño
> actual, colores, logo y marco. El trabajo no es solo "copiarlo a digital", sino
> traducirlo a una experiencia moderna con personalidad propia.

### 16.1. Checklist de recepción del cliente

Antes de escribir una línea de código, pedir al cliente:

| # | Qué pedir | Formato | Ejemplo |
|---|-----------|---------|---------|
| 1 | Logo | PNG o SVG con fondo transparente | `logo-taqueria.png` |
| 2 | Menú completo | PDF, foto o lista de texto | Precios actualizados, descripciones |
| 3 | Fotos de productos | JPG/PNG de buena calidad | Al menos 1 por categoría |
| 4 | Colores de marca | Hex o referencia visual | `#E84C3D` (rojo), `#1A1A1A` (negro) |
| 5 | Datos de contacto | Teléfono,WhatsApp, dirección, horarios | `55-1234-5678` |
| 6 | Redes sociales | URLs de Instagram, Facebook, TikTok | `instagram.com/lacazona` |
| 7 | Referencia visual | Foto del menú impreso actual | Para entender "el marco" |

### 16.2. Extraer la identidad visual

Del menú impreso y el logo se extraen 3 elementos:

1. **Paleta de colores (2 principales + 1 acento):**
   - Color primario → texto, fondos oscuros, nav
   - Color secundario → botones, CTAs, precios
   - Color acento → badges, favoritos, elementos destacados

2. **El "marco" o personalidad:**
   | Tipo | Señales visuales | Tratamiento digital |
   |------|-----------------|-------------------|
   | Rústico / Taquería | Llamas, madera, metal | Dark mode, rojos/ámbar, tipografía bold, sombras duras |
   | Elegante / Gourmet | Dorado, blanco, espacios | Fondos claros, serif, espaciado generoso, fotos grandes |
   | Fresco / Juvenil | Colores vibrantes, stickers | Glassmorphism, neón, animaciones, tipografía moderna |
   | Tradicional / Confianza | Tonos tierra, texturas | Fondos cálidos, fotos reales (no stock), estructura clara |

3. **Tipografía:** elegir fuente para títulos (bold/display) y otra para cuerpo/precios.

### 16.3. Propuesta de mejora (lo que el menú impreso NO tiene)

Sugerir al menos UNA de estas mejoras al cliente:

- **Animación de entrada:** productos con stagger reveal al hacer scroll
- **Destacados visuales:** badge "Más Vendido" / "Nuevo" con emoji + color
- **Categorías con íconos o fotos** en vez de solo texto
- **Buscador** para menús con más de 15 items
- **Modo oscuro** si el local es de noche (bares, antros)
- **QR flotante** para compartir el menú fácilmente
- **Combo sugerido:** sección de "Paquetes" o "Combos" con precio especial

### 16.4. Traducción a código (paso a paso)

Con el análisis visual hecho:

1. **Copiar `src/modules/_template/` → renombrar a `<nombre-cliente>/`**
2. **Editar `config.ts`:** colores hex, fuentes, datos de contacto
3. **Editar `<TemplateMenu.tsx>`:**
   - Reemplazar `PRODUCTS` con el menú real (precios + descripciones)
   - Reemplazar categorías (`DEFAULT_CATEGORIES`)
   - Encontrar y reemplazar todos los `bg-[#...]` y `text-[#...]` con la paleta nueva
   - Ajustar `fontFamily` en los estilos inline
   - Cambiar WhatsApp, Instagram, Facebook URLs
   - Cambiar textos del footer (nombre, descripción, dirección, horarios)
4. **Reemplazar imágenes** en `assets/` con las reales
5. **Registrar ruta** en `App.tsx`
6. **`npm run dev`** → revisar en móvil → ajustar → push

### 16.5. Checklist de entrega (antes de enviar al cliente)

- [ ] Todas las categorías tienen productos
- [ ] Los precios son correctos
- [ ] El footer muestra datos del negocio (NO de Imagine & Stamp)
- [ ] El WhatsApp abre con el número correcto
- [ ] Las imágenes cargan (probar en incógnito)
- [ ] El diseño se ve bien en móvil (375px de ancho)
- [ ] Los textos del checkout dicen el nombre del negocio
- [ ] Las redes sociales linkean correctamente
- [ ] El título de la página es el nombre del negocio
- [ ] SEO configurado en `index.html` (ver §16.6)

### 16.6. Configuración SEO (obligatorio al migrar a producción)

> Cuando una página demo se migra a su carpeta/proyecto real y se sube a un dominio, es **obligatorio** configurar el SEO en `index.html` ANTES de hacer `npm run build`. Esto asegura que al compartir la URL en WhatsApp, Instagram, Facebook o cualquier red social, se muestre una preview atractiva con título, descripción e imagen.

#### Plantilla base para `index.html`

```html
<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>NOMBRE DEL NEGOCIO | Tagline o propuesta de valor</title>
    <meta name="description" content="Descripción del negocio con keywords relevantes. Dirección y especialidades." />
    <meta name="keywords" content="keyword1, keyword2, keyword3, ciudad, comida, negocio" />
    <meta name="author" content="NOMBRE DEL NEGOCIO" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph (Facebook, WhatsApp, Instagram, Telegram) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="NOMBRE DEL NEGOCIO" />
    <meta property="og:title" content="NOMBRE DEL NEGOCIO | Tagline" />
    <meta property="og:description" content="Descripción corta atractiva. Horarios, ciudad." />
    <meta property="og:url" content="https://cliente.imagineandstamp.site/" />
    <meta property="og:image" content="URL_IMAGEN_1200x630" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="es_MX" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="NOMBRE DEL NEGOCIO | Tagline" />
    <meta name="twitter:description" content="Descripción corta atractiva." />
    <meta name="twitter:image" content="URL_IMAGEN_1200x630" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### Reglas obligatorias

1. **`lang="es-MX"`** en el `<html>`, no `"en"`.
2. **`<title>`** = `NOMBRE DEL NEGOCIO | Propuesta de valor` — incluir keywords de búsqueda y ciudad.
3. **`<meta description>`** = 1-2 frases con nombre, especialidades, ciudad y horarios. Máximo ~160 caracteres.
4. **`<meta keywords>`** = 5-10 términos separados por coma: productos, ciudad, tipo de comida.
5. **`og:image`** = Imagen 1200x630 px. Usar la misma imagen del hero del menú o la foto más representativa. Si se usa Unsplash, usar formato `?auto=format&fit=crop&w=1200&h=630&q=80`.
6. **`og:url`** = URL real del dominio (no `localhost` ni placeholder).
7. **`twitter:card`** = `summary_large_image` para que muestre la imagen grande.
8. **Logo/Favicon**: Si el logo es PNG, cambiar `<link rel="icon">` a `type="image/png" href="/logo.png"`. Si no hay PNG, mantener el SVG de Vite.

#### Referencia real — Takero's CDMX

```html
<title>TAKERO'S CDMX | Sabor auténtico de la CDMX en Cancún</title>
<meta name="description" content="TAKERO'S CDMX — Antojitos chilangos y sazón real. Tacos al pastor, suadero, tripa, gringas, alambres y más. Cancún, Quintana Roo. ¡Lleva o pide a domicilio!" />
<meta name="keywords" content="tacos CDMX en Cancún, tacos al pastor Cancún, gringas Cancún, tacos de suadero, tacos de tripa, antojitos chilangos, Takero's CDMX, comida mexicana Cancún" />
<meta property="og:image" content="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&h=630&q=80" />
```

#### Herramientas de verificación

Después de subir a producción, validar con:
- [Meta Tags Debugger](https://www.opengraph.xyz/) — pegar la URL y verificar preview
- [WhatsApp Sharing Debugger](https://developers.facebook.com/tools/debug/) — fuerza refresco de cache
- Compartir manualmente en un grupo de WhatsApp de prueba

---

## 17. Creación de Flyers (Flayers Promocionales)

> Cuando se solicite crear un "flayer" (flyer promocional) para un cliente, se debe construir un **archivo HTML standalone** (`qr-flyer.html`) + un **script de generación PDF** (`generate-pdf.cjs`). NO es un componente React — es HTML puro con Tailwind CDN para que Puppeteer lo renderice sin build.

**Ejemplos de referencia:**
- `C:\Users\RF\Documents\MisProyectosIA\tacos-chepe\qr-flyer.html` + `generate-pdf.cjs`
- `C:\Users\RF\Documents\MisProyectosIA\takeros-cdmx\qr-flyer.html` + `generate-pdf.cjs`

### 17.1. Estructura del Flyer (HTML standalone)

El HTML se escribe con Tailwind CDN + Google Fonts, sin dependencias de React ni build. Estructura fija:

1. **Hero Section (parte superior):**
   - `<div>` con `min-h-[300px]`, `flex flex-col items-center justify-center`
   - Imagen de fondo con clase `animate-kenburns` (animación Ken Burns de 20s)
   - Overlay con `bg-gradient-to-t` del color de fondo
   - **Badge** rotado -2° con color secundario de la marca
   - **Título** grande con efecto gradiente (CSS `background-clip: text`)
   - **QR Code** centrado: imagen generada por API `api.qrserver.com` con `size=350x350`, borde blanco `p-5`, sombra del color primario, `border-2`
   - **URL** debajo del QR en color primario

2. **Footer 3 columnas (parte inferior):**
   - `border-t-[6px]` del color primario
   - **Col 1 (izquierda):** Nombre/logo + descripción del negocio
   - **Col 2 (centro):** Contacto (📍 dirección, 📞 WhatsApp) + redes sociales (SVG inline de Instagram, Facebook, TikTok, WhatsApp — círculos `#27272a`)
   - **Col 3 (derecha):** Horarios con 🕐, días y hora
   - Las 3 columnas usan `display: flex; flex-direction: row; gap: 2.5rem` (NO grid de Tailwind, para compatibilidad con Puppeteer/Pdf)

3. **Bottom bar:**
   - `border-top: 2px solid #27272a`
   - Texto centrado: "Diseñado con 🔥 por Imagine & Stamp"

### 17.2. Reglas de diseño

| Regla | Detalle |
|-------|---------|
| **Layout** | `<body class="flex flex-col justify-between h-screen">` — el hero arriba, el footer abajo, sin scroll |
| **Colores** | Usar los hex de `config.ts`: primary en bordes/acentos, secondary en badges |
| **Fuente** | `Inter` via Google Fonts (`wght@400;500;700;900`) |
| **Fondo** | `bg-zinc-900` (igual que la app) o el `bg` de `config.ts` |
| **QR Code** | `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=URL&color=18181b&bgcolor=ffffff` |
| **Logo en footer** | Si el logo ya está deployado, usar URL absoluta con `onerror="this.style.display='none'"`. Si no, usar el nombre en texto |
| **Estilos inline** | Para layouts flex y dimensiones fijas usar `style=""` directo, no clases Tailwind — Puppeteer renderiza mejor inline |
| **Print** | `@media print { body { -webkit-print-color-adjust: exact; } }` |
| **Ken Burns** | `@keyframes kenburns { 0%{scale(1)} 50%{scale(1.1)} 100%{scale(1)} }` — 20s ease-in-out infinite alternate |

### 17.3. Script de generación PDF (`generate-pdf.cjs`)

Archivo CommonJS en la raíz del proyecto del cliente:

```js
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fileUrl = `file:///${path.resolve('qr-flyer.html').replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'nombre-cliente-flayer.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  await browser.close();
  console.log('PDF Generado exitosamente: nombre-cliente-flayer.pdf');
})();
```

**Para ejecutar:**
```bash
# Si Puppeteer ya tiene Chrome integrado:
node generate-pdf.cjs

# Si no (Windows con Chrome del sistema):
$env:PUPPETEER_EXECUTABLE_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
node generate-pdf.cjs
```

### 17.4. Checklist del flyer

- [ ] `qr-flyer.html` creado en la raíz del proyecto
- [ ] `generate-pdf.cjs` creado en la raíz del proyecto
- [ ] Hero: imagen de fondo, badge, título, QR code, URL
- [ ] Footer: 3 columnas con datos reales del cliente
- [ ] Bottom bar: crédito "Diseñado por Imagine & Stamp"
- [ ] Colores coinciden con `config.ts`
- [ ] QR apunta a la URL real del menú
- [ ] Redes sociales linkean correctamente
- [ ] PDF generado como `nombre-cliente-flayer.pdf`
- [ ] Puppeteer desinstalado después de generar (`npm uninstall puppeteer`)

---

*Última actualización: Agosto 2026 — Proyecto base: imagineandstamp.site*
*Base: catálogo, carrito de 2 pasos, favoritos, panel de control y datos bancarios (transferencia).*
*Complemento opcional con costo extra: pago con tarjeta vía Mercado Pago.*
*Módulo de Descargas Digitales (sección 13) probado y documentado de punta a punta en Sahumerio Sagrado y Mundo Halloween.*
*Keepalive Supabase (5.6) implementado en la-maria-rooftop y amelie-patisserie.*
*Compresión de imágenes + paginación 10x10 (sección 14) probado en amelie-patisserie y Mundo Halloween.*
