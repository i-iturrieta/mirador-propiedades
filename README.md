# Mirador Propiedades

Sitio público y panel de administración para [miradorpropiedades.cl](https://www.miradorpropiedades.cl) — corredora boutique en Los Lagos, Chile. Construido con Next.js 15 App Router, Prisma y Tailwind CSS.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15.1 (App Router) + React 19 + TypeScript 5.6 |
| Estilos | Tailwind CSS 3.4 + Radix UI (primitivos accesibles) |
| Base de datos | PostgreSQL vía [Neon](https://neon.tech) + Prisma ORM 5.22 |
| Autenticación | Auth.js v5 — credentials (email + bcrypt), JWT, middleware Edge-compatible |
| Almacenamiento | Cloudflare R2 (S3-compatible) — imágenes servidas desde `img.miradorpropiedades.cl` |
| Email | [Resend](https://resend.com) — emails transaccionales en HTML |
| Mapas | react-leaflet + OpenStreetMap |
| Galería | yet-another-react-lightbox |
| Formularios | React Hook Form + Zod |
| Notificaciones | Sonner (toasts) |

---

## Arquitectura

```
src/
├── app/
│   ├── page.tsx                        # Home (hero, featured, servicios, CTA)
│   ├── propiedades/
│   │   ├── page.tsx                    # Catálogo con filtros y paginación
│   │   └── [slug]/page.tsx             # Ficha de propiedad (galería, mapa, contacto)
│   ├── contacto/page.tsx
│   ├── servicios/page.tsx
│   ├── nosotras/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # Auth.js handler
│   │   ├── contact/route.ts            # Formulario de contacto → DB + email
│   │   └── admin/upload/route.ts       # Subida de imágenes a R2 (admin only)
│   ├── admin/                          # Panel protegido por middleware
│   │   ├── page.tsx                    # Dashboard (stats + consultas recientes)
│   │   ├── propiedades/                # CRUD de propiedades + server actions
│   │   ├── inquiries/page.tsx          # Bandeja de consultas / leads
│   │   └── login/page.tsx
│   ├── sitemap.ts                      # Sitemap dinámico (SEO)
│   └── robots.ts
├── components/
│   ├── home/      (Hero, SearchBar, FeaturedGrid, ServicesTeaser)
│   ├── property/  (PropertyCard, Filters, Gallery, MapView, StatusBadge, PriceTag)
│   ├── layout/    (Header, Footer)
│   ├── forms/     (ContactForm, PropertyForm, ImageDropzone)
│   └── ui/        (Button, Input, Badge, Logo, Reveal)
├── lib/
│   ├── auth.ts / auth.config.ts        # NextAuth setup (Edge-safe split)
│   ├── prisma.ts                       # Singleton de Prisma client
│   ├── r2.ts                           # Cliente S3 para Cloudflare R2
│   ├── validations.ts                  # Schemas Zod (contact + property)
│   ├── email.ts                        # Templates HTML para Resend
│   ├── formatters.ts                   # Moneda, fechas, áreas
│   └── utils.ts / whatsapp.ts
├── types/
└── middleware.ts                       # Protección de rutas /admin/*
prisma/
├── schema.prisma
├── migrations/
└── seed.ts                             # 8 propiedades + 1 usuario admin
```

---

## Modelo de datos

```prisma
Property        (id, slug, title, operation, type, status, price, currency,
                 city, sector, address, lat, lng, bedrooms, bathrooms,
                 parking, storage, builtArea, landArea, description, featured)
  └── PropertyImage  (id, url, alt, order)
  └── Inquiry        (id, name, email, phone, message, source, read)

AdminUser       (id, email, passwordHash, name)
```

**Enums:** `Operation` (VENTA / ARRIENDO) · `PropertyType` (CASA / DEPARTAMENTO / PARCELA / TERRENO / OFICINA) · `PropertyStatus` (DISPONIBLE / RESERVADA / ARRENDADA / VENDIDA) · `Currency` (CLP / UF)

---

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env   # macOS/Linux
Copy-Item .env.example .env   # PowerShell
```

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | ✓ | Conexión PostgreSQL (Neon, Supabase, local) |
| `AUTH_SECRET` | ✓ | JWT secret — generar con `npx auth secret` |
| `AUTH_URL` | ✓ | URL pública del sitio (p.ej. `http://localhost:3000`) |
| `RESEND_API_KEY` | — | Emails transaccionales. Sin esto el form guarda en DB pero no envía correo. |
| `CONTACT_EMAIL_TO` | — | Destino de las consultas |
| `CONTACT_EMAIL_FROM` | — | Remitente de las consultas |
| `WHATSAPP_NUMBER` | — | Número en formato internacional sin `+` (p.ej. `56988040592`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | — | Igual que el anterior (expuesto al cliente) |
| `R2_ACCOUNT_ID` | — | ID de cuenta Cloudflare (requerido para subir imágenes) |
| `R2_ACCESS_KEY_ID` | — | API Token R2 — Read & Write |
| `R2_SECRET_ACCESS_KEY` | — | API Token R2 — secreto |
| `R2_BUCKET_NAME` | — | Nombre del bucket R2 |
| `R2_PUBLIC_URL` | — | URL base pública del bucket (p.ej. `https://img.miradorpropiedades.cl`) |
| `NEXT_PUBLIC_SITE_URL` | — | URL pública del sitio (OG tags, links en emails) |

### 3. Base de datos

```bash
npx prisma migrate dev --name init   # Crea tablas y ejecuta migraciones
npm run db:seed                      # Carga 8 propiedades + usuario admin
```

El seed crea el usuario admin con email/contraseña configurables vía env:

```bash
# PowerShell
$env:SEED_ADMIN_EMAIL="otro@email.cl"; $env:SEED_ADMIN_PASSWORD="..."; npm run db:seed

# bash
SEED_ADMIN_EMAIL="otro@email.cl" SEED_ADMIN_PASSWORD="..." npm run db:seed
```

Si no se especifican, usa los valores por defecto del archivo `prisma/seed.ts`.

### 4. Dev server

```bash
npm run dev
```

- Sitio público → http://localhost:3000  
- Panel admin → http://localhost:3000/admin/login

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Dev server con hot reload |
| `npm run build` | Build de producción (incluye `prisma generate`) |
| `npm start` | Servidor de producción |
| `npm run typecheck` | Chequeo TypeScript sin compilar |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerar Prisma client |
| `npm run db:migrate` | Crear y aplicar migración (dev) |
| `npm run db:push` | Push directo del schema sin migración (iteración rápida) |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:studio` | Abrir Prisma Studio (UI de base de datos) |

---

## Subida de imágenes (Cloudflare R2)

El admin incluye un componente drag & drop que sube las imágenes directamente al bucket R2:

1. El archivo se comprime en el navegador (máx. 1600 px / 1 MB) vía `browser-image-compression`.
2. Se envía a `POST /api/admin/upload` (requiere sesión admin).
3. El servidor sube el objeto a R2 con `PutObjectCommand` (S3-compatible).
4. La URL pública resultante (`https://img.miradorpropiedades.cl/<uuid>.<ext>`) queda guardada en `PropertyImage.url`.

**Formatos aceptados:** JPEG · PNG · WebP · AVIF  
**Límite por archivo:** 4 MB (restricción del route handler en Vercel)

Para configurar R2: crear un bucket, generar un API Token con permisos `Object Read & Write`, conectar el subdominio como Custom Domain y completar las variables `R2_*` en Vercel.

---

## Despliegue (Vercel + Neon)

1. Conectar el repositorio a Vercel.
2. Agregar todas las variables de `.env.example` en **Settings → Environment Variables**.
3. El build command ya incluye `prisma generate` (`npm run build`).
4. En el primer deploy, ejecutar la migración en la base de datos de producción:
   ```bash
   npx prisma migrate deploy
   ```
5. Configurar el bucket R2 y las variables `R2_*` según la sección anterior.

**DNS:** `miradorpropiedades.cl` → Vercel · `img.miradorpropiedades.cl` → Cloudflare R2 (CNAME gestionado por Cloudflare)

---

## Funcionalidades del panel admin

| Sección | Capacidades |
|---|---|
| Dashboard | Stats de propiedades por estado, consultas de los últimos 7 días |
| Propiedades | Crear · editar · eliminar · marcar como destacada · ubicación por enlace de Google Maps o pin movible en mapa |
| Imágenes | Drag & drop múltiple con preview, compresión automática, almacenamiento en R2 |
| Consultas | Bandeja de leads con detalle de propiedad asociada, marcar como leída |

Todas las mutaciones revalidan automáticamente las páginas públicas afectadas.

---

## Funcionalidades del sitio público

- **Catálogo** con filtros combinables (operación, tipo, estado, ciudad, dormitorios, baños, precio) sincronizados en la URL → enlaces compartibles.
- **Ficha de propiedad** con galería lightbox, mapa interactivo y formulario de contacto pre-completado.
- **Formulario de contacto** con protección honeypot, persistencia en DB y notificación por email.
- **SEO** — sitemap dinámico, robots.txt, metadatos y Open Graph por página.
- **Links directos** a WhatsApp desde cualquier propiedad o la página de contacto.
