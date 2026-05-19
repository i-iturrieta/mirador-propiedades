# Mirador Propiedades · Rediseño

Sitio público + panel de administración para [miradorpropiedades.cl](https://www.miradorpropiedades.cl/), construido con Next.js, Prisma y Tailwind.

## Stack

- **Next.js 15** (App Router) + **React 19** + TypeScript
- **Tailwind CSS** + componentes propios con Radix UI
- **PostgreSQL** + **Prisma ORM**
- **Auth.js v5** (credentials provider con bcrypt)
- **Resend** para emails transaccionales + deep links a WhatsApp
- **react-leaflet** + OpenStreetMap para mapas
- **yet-another-react-lightbox** para la galería de propiedad

## Estructura

```
src/
├── app/
│   ├── (público) page.tsx, propiedades/, servicios/, nosotras/, contacto/
│   ├── api/contact/, api/auth/[...nextauth]/
│   ├── admin/ (protegido por middleware)
│   ├── sitemap.ts, robots.ts, not-found.tsx
├── components/
│   ├── home/      (Hero, SearchBar, FeaturedGrid, ServicesTeaser)
│   ├── property/  (PropertyCard, Filters, Gallery, MapView, StatusBadge, PriceTag)
│   ├── layout/    (Header, Footer)
│   ├── forms/     (ContactForm, PropertyForm)
│   └── ui/        (Button, Input, Badge)
├── lib/           (prisma, auth, validations, formatters, whatsapp, email, utils)
├── types/
└── middleware.ts
prisma/
├── schema.prisma
└── seed.ts
```

## Setup

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```powershell
Copy-Item .env.example .env
```

Mínimo necesario para correr en local:

- `DATABASE_URL` — Postgres local o de **Neon** ([neon.tech](https://neon.tech), free tier suficiente).
- `AUTH_SECRET` — generar con `npx auth secret`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — número en formato internacional sin `+`.

Opcionales:

- `RESEND_API_KEY` — para enviar los emails de contacto. Sin esto el formulario sigue funcionando (guarda en DB) pero no envía correo.
- `CLOUDINARY_*` — para subir imágenes desde el admin (alternativa: pegar URLs externas).

### 3. Base de datos

```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

El seed crea:

- 8 propiedades de ejemplo (transcritas del sitio actual + adicionales)
- 1 usuario administrador: `alejandra@miradorpropiedades.cl` / `MiradorAdmin2025!`

Cámbialos en producción a través de:

```powershell
$env:SEED_ADMIN_EMAIL="otro@email.cl"; $env:SEED_ADMIN_PASSWORD="..."; npx prisma db seed
```

### 4. Dev server

```powershell
npm run dev
```

→ http://localhost:3000 (público)
→ http://localhost:3000/admin/login (admin)

## Scripts útiles

- `npm run dev` — Dev server
- `npm run build` — Build de producción
- `npm run typecheck` — Solo TypeScript
- `npm run db:studio` — UI de Prisma Studio
- `npm run db:push` — Push schema sin migración (rápido para iterar)
- `npm run db:migrate` — Migración versionada
- `npm run db:seed` — Cargar datos de ejemplo

## Mejoras de UX respecto al sitio original

| Problema original | Solución en el rediseño |
|---|---|
| "Dormitorios: -13" en un listado | Validación `min(0)` con zod en el form de admin + tipos Prisma. |
| CTAs planos sin distinción | Botón primario (negro), outline (borde) y un único acento verde para WhatsApp. |
| Texto truncado "Seguir leyendo…" | Hero conciso + sección dedicada `/nosotras`. |
| Filtros sin URL state | Estado de filtros sincronizado con `searchParams` → enlaces compartibles. |
| Sin mapa interactivo | `react-leaflet` con marcador y popup por propiedad. |
| Estados "ARRENDADA/VENDIDA" mezclados | `StatusBadge` siempre visible; filtro "Disponibles" activo por defecto. |
| Gestión opaca de propiedades | Panel `/admin` con CRUD, bandeja de consultas y dashboard. |
| Accesibilidad insuficiente | `alt` obligatorio en imágenes, foco visible, skip link, navegación con teclado. |

## Despliegue

Recomendado: **Vercel + Neon Postgres**.

1. Conectar el repo a Vercel.
2. Configurar todas las variables de `.env.example` en Vercel.
3. En el build command incluir `prisma generate` (ya viene en `npm run build`).
4. Primer deploy: ejecutar manualmente `npx prisma migrate deploy` desde la consola de Neon o como step de CI.

## Próximos pasos sugeridos

- Conectar `next-cloudinary` para uploads desde el admin sin pegar URLs.
- OG images dinámicas por propiedad con `opengraph-image.tsx`.
- i18n ES/EN si se valida demanda extranjera.
- Integración a Portal Inmobiliario / Yapo vía feed XML.
