# Mirador Propiedades — Documentación del Proyecto

> Documento técnico completo del sitio y panel de administración de **miradorpropiedades.cl**.  
> Actualizado: junio 2026.

---

## Tabla de contenidos

1. [Contexto del negocio](#1-contexto-del-negocio)
2. [Origen del proyecto](#2-origen-del-proyecto)
3. [URLs y accesos](#3-urls-y-accesos)
4. [Stack tecnológico](#4-stack-tecnológico)
5. [Infraestructura y servicios externos](#5-infraestructura-y-servicios-externos)
6. [Arquitectura de la aplicación](#6-arquitectura-de-la-aplicación)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Autenticación y seguridad](#8-autenticación-y-seguridad)
9. [Sitio público — funcionalidades](#9-sitio-público--funcionalidades)
10. [Panel de administración](#10-panel-de-administración)
11. [Subida de imágenes (R2)](#11-subida-de-imágenes-r2)
12. [Emails transaccionales (Resend)](#12-emails-transaccionales-resend)
13. [SEO y performance](#13-seo-y-performance)
14. [Variables de entorno](#14-variables-de-entorno)
15. [Setup local](#15-setup-local)
16. [Scripts disponibles](#16-scripts-disponibles)
17. [Decisiones técnicas relevantes](#17-decisiones-técnicas-relevantes)

---

## 1. Contexto del negocio

**Mirador Propiedades** es una corredora de propiedades boutique con base en la **Región de Los Lagos, Chile**. Opera principalmente en Frutillar, Llanquihue, Puerto Varas, Puerto Montt, Fresia y comunas aledañas.

El negocio lo lidera **Alejandra** (fundadora) junto a su equipo. Su propuesta de diferenciación es la atención personalizada y el conocimiento profundo del territorio: atienden pocas operaciones simultáneas para poder dedicar tiempo real a cada cliente, sin call centers ni procesos genéricos.

**Servicios que ofrecen:**
- Búsqueda de hogar (con pre-visita de cada inmueble)
- Venta de propiedades (tasación, marketing, fotografía, cierre legal)
- Arriendo y administración de inmuebles
- Tasación referencial con estudio comparativo de mercado
- Asesoría a inversionistas (parcelas, departamentos, locales en el sur)
- Acompañamiento legal (coordinación con abogados y notarías)

**Proceso de trabajo estándar:**
1. Conversación inicial — entender contexto y necesidad del cliente
2. Curaduría — filtrar catálogo y proponer opciones reales
3. Visitas y negociación — coordinación y representación del cliente
4. Cierre — coordinación de abogados, bancos y firma

---

## 2. Origen del proyecto

El sitio reemplazó un WordPress/portal genérico que no representaba la identidad boutique de la corredora ni permitía gestionar el catálogo de forma autónoma.

**Objetivos del reemplazo:**
- Identidad visual propia y editorial (no de plantilla)
- Panel de administración autónomo (sin depender de un webmaster para publicar propiedades)
- Gestión integrada de consultas/leads
- SEO técnico sólido desde la base (sitemap dinámico, metadatos por página, Open Graph)
- Stack moderno y mantenible a largo plazo

El proyecto fue desarrollado como encargo freelance para la corredora.

---

## 3. URLs y accesos

| Entorno | URL | Notas |
|---|---|---|
| Producción (sitio público) | https://www.miradorpropiedades.cl | Live y activo |
| Panel de administración | https://www.miradorpropiedades.cl/admin | Requiere login |
| CDN de imágenes | https://img.miradorpropiedades.cl | Cloudflare R2 con custom domain |
| Dev local (sitio) | http://localhost:3000 | |
| Dev local (admin) | http://localhost:3000/admin/login | |

---

## 4. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 15.1 |
| UI | React | 19 |
| Lenguaje | TypeScript | 5.6 |
| Estilos | Tailwind CSS | 3.4 |
| Componentes accesibles | Radix UI | — |
| ORM | Prisma | 5.22 |
| Base de datos | PostgreSQL vía Neon | — |
| Autenticación | Auth.js v5 | — |
| Almacenamiento de imágenes | Cloudflare R2 (S3-compatible) | — |
| Email transaccional | Resend | — |
| Mapas | react-leaflet + OpenStreetMap | — |
| Galería lightbox | yet-another-react-lightbox | — |
| Formularios | React Hook Form + Zod | — |
| Notificaciones | Sonner | — |
| Tipografía | Cormorant Garamond + Montserrat (Google Fonts) | — |
| Compresión de imágenes (cliente) | browser-image-compression | — |
| Slugs | slugify | — |

---

## 5. Infraestructura y servicios externos

### Vercel (hosting)
- Deploy automático desde el repositorio Git
- Build command: `npm run build` (incluye `prisma generate`)
- Variables de entorno configuradas en Settings → Environment Variables
- Restricción de 4 MB por request en route handlers (afecta límite de subida de imágenes)

### Neon (base de datos PostgreSQL)
- PostgreSQL serverless con branching
- Conexión vía `DATABASE_URL` (pooled connection recomendada para serverless)
- Migraciones gestionadas por Prisma Migrate

### Cloudflare R2 (almacenamiento de imágenes)
- Bucket S3-compatible para imágenes de propiedades
- Subdominio `img.miradorpropiedades.cl` configurado como Custom Domain del bucket (CNAME gestionado por Cloudflare)
- API Token con permisos `Object Read & Write`
- Las imágenes se comprimen en el cliente antes de subir (máx. 1600 px / 1 MB)
- Límite efectivo por archivo: 4 MB (restricción de Vercel)
- Formatos aceptados: JPEG, PNG, WebP, AVIF

### Resend (email)
- Emails transaccionales en HTML al recibir consultas de contacto
- Si `RESEND_API_KEY` no está configurada, el formulario igualmente guarda la consulta en base de datos pero no envía correo
- Templates HTML definidos en `src/lib/email.ts`

### DNS
- `miradorpropiedades.cl` → Vercel (A/CNAME configurado en Vercel Domains)
- `img.miradorpropiedades.cl` → Cloudflare R2 (CNAME gestionado desde Cloudflare DNS)

---

## 6. Arquitectura de la aplicación

```
d:\webMirador\
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Layout raíz: fuentes, Header, Footer, Toaster, NavigationProgress
│   │   ├── page.tsx                      # Home: Hero, FeaturedSection, ServicesTeaser, CTA
│   │   ├── loading.tsx                   # Skeleton de home
│   │   ├── not-found.tsx                 # Página 404 personalizada
│   │   ├── sitemap.ts                    # Sitemap dinámico (genera URLs de todas las propiedades)
│   │   ├── robots.ts                     # robots.txt dinámico
│   │   ├── propiedades/
│   │   │   ├── page.tsx                  # Catálogo con Suspense streaming
│   │   │   ├── PropertiesResults.tsx     # Resultados con filtros y paginación (Server Component)
│   │   │   ├── loading.tsx               # Skeleton del catálogo
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Ficha de propiedad (galería, mapa, formulario)
│   │   │       └── loading.tsx           # Skeleton de la ficha
│   │   ├── contacto/page.tsx             # Página de contacto con formulario
│   │   ├── servicios/page.tsx            # 6 servicios + proceso + CTA
│   │   ├── nosotras/page.tsx             # About: valores, cita, CTA
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # Auth.js handler
│   │   │   ├── contact/route.ts              # POST: guarda consulta en DB + envía email
│   │   │   └── admin/upload/route.ts         # POST: sube imagen a R2 (requiere sesión admin)
│   │   └── admin/
│   │       ├── layout.tsx                # Layout del admin (protegido)
│   │       ├── loading.tsx               # Skeleton del admin
│   │       ├── page.tsx                  # Dashboard: stats por estado + consultas recientes (7 días)
│   │       ├── login/page.tsx            # Formulario de login
│   │       ├── propiedades/
│   │       │   ├── page.tsx              # Listado de propiedades con estado
│   │       │   ├── actions.ts            # Server Actions: crear, editar, eliminar propiedad + resolver links de Maps
│   │       │   ├── nueva/page.tsx        # Formulario de nueva propiedad
│   │       │   └── [id]/page.tsx         # Formulario de edición de propiedad
│   │       └── inquiries/page.tsx        # Bandeja de consultas/leads
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.tsx                  # Hero con headline editorial
│   │   │   ├── SearchBar.tsx             # Búsqueda rápida (operación + tipo + ciudad)
│   │   │   ├── FeaturedGrid.tsx          # Grid de propiedades destacadas
│   │   │   ├── FeaturedSection.tsx       # Wrapper con Suspense para FeaturedGrid
│   │   │   └── ServicesTeaser.tsx        # Preview de servicios en el home
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx          # Tarjeta de propiedad en catálogo
│   │   │   ├── Filters.tsx               # Panel de filtros combinables (sincronizados en URL)
│   │   │   ├── Gallery.tsx               # Galería con lightbox (yet-another-react-lightbox)
│   │   │   ├── MapView.tsx               # Mapa de detalle (react-leaflet)
│   │   │   ├── PropertyDetailMap.tsx     # Wrapper del mapa en la ficha
│   │   │   ├── LocationPickerMap.tsx     # Mapa interactivo para elegir ubicación en el admin
│   │   │   ├── StatusBadge.tsx           # Badge de estado (DISPONIBLE, RESERVADA, etc.)
│   │   │   └── PriceTag.tsx              # Formateo de precio (CLP o UF)
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Navegación principal
│   │   │   └── Footer.tsx                # Footer con links y contacto
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx           # Formulario de contacto con honeypot y validación Zod
│   │   │   ├── PropertyForm.tsx          # Formulario completo de propiedad (crear/editar)
│   │   │   └── ImageDropzone.tsx         # Drag & drop con preview, compresión y subida a R2
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Logo.tsx
│   │       ├── Reveal.tsx                # Animación de entrada (IntersectionObserver)
│   │       ├── Skeleton.tsx              # Componente base de loading skeleton
│   │       └── NavigationProgress.tsx    # Barra de progreso de navegación entre páginas
│   ├── lib/
│   │   ├── auth.ts                       # NextAuth setup completo (handlers, helpers)
│   │   ├── auth.config.ts                # Configuración Edge-safe (sin imports de Node.js)
│   │   ├── prisma.ts                     # Singleton de Prisma client (evita múltiples instancias en dev)
│   │   ├── r2.ts                         # Cliente S3 para Cloudflare R2 (PutObjectCommand)
│   │   ├── validations.ts                # Schemas Zod: ContactFormSchema, PropertyFormSchema
│   │   ├── email.ts                      # Templates HTML y función sendEmail() con Resend
│   │   ├── formatters.ts                 # Formateo de moneda (CLP/UF), fechas, áreas (m²)
│   │   ├── maps.ts                       # parseLatLngFromMapsUrl(), isShortMapsLink()
│   │   ├── leaflet-icon.ts               # Fix para el ícono por defecto de Leaflet en Next.js
│   │   ├── utils.ts                      # Helpers genéricos (cn, etc.)
│   │   └── whatsapp.ts                   # Construcción de URLs de WhatsApp con mensaje pre-armado
│   ├── types/
│   │   └── property.ts                   # Tipos TypeScript derivados del schema Prisma
│   └── middleware.ts                     # Protección de rutas /admin/* (redirige a /admin/login si no hay sesión)
├── prisma/
│   ├── schema.prisma                     # Schema completo: Property, PropertyImage, Inquiry, AdminUser
│   ├── migrations/                       # Historial de migraciones SQL
│   └── seed.ts                           # 8 propiedades de ejemplo + 1 usuario admin
├── public/                               # Assets estáticos
├── .env.example                          # Template de variables de entorno
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Modelo de datos

```prisma
Property {
  id          String          -- CUID, clave primaria
  slug        String          -- URL-friendly, único (generado desde el título)
  title       String
  operation   Operation       -- VENTA | ARRIENDO
  type        PropertyType    -- CASA | DEPARTAMENTO | PARCELA | TERRENO | OFICINA
  status      PropertyStatus  -- DISPONIBLE | RESERVADA | ARRENDADA | VENDIDA
  price       Decimal(15,2)
  currency    Currency        -- CLP | UF
  city        String
  sector      String?         -- Barrio o sector dentro de la ciudad
  address     String?
  lat         Float?          -- Latitud (geocoordenadas)
  lng         Float?          -- Longitud (geocoordenadas)
  bedrooms    Int?
  bathrooms   Int?
  parking     Int?
  storage     Boolean         -- Bodega (sí/no)
  builtArea   Int?            -- Superficie construida (m²)
  landArea    Int?            -- Superficie terreno (m²)
  description String          -- Texto largo
  featured    Boolean         -- Aparece en el home
  images      PropertyImage[]
  inquiries   Inquiry[]
  createdAt   DateTime
  updatedAt   DateTime

  @@index([operation, type, city, status])  -- Índice compuesto para filtros del catálogo
  @@index([featured])
}

PropertyImage {
  id         String
  propertyId String   -- FK a Property (CASCADE delete)
  url        String   -- URL pública en R2
  alt        String
  order      Int      -- Orden de visualización

  @@index([propertyId, order])
}

Inquiry {
  id         String
  propertyId String?  -- FK opcional a Property (SET NULL si se elimina la propiedad)
  name       String
  email      String
  phone      String?
  message    String
  source     String   -- "contact" (desde el formulario general) o slug de la propiedad
  read       Boolean  -- Marcado como leído en el admin
  createdAt  DateTime

  @@index([createdAt])
  @@index([read])
}

AdminUser {
  id           String
  email        String   @unique
  passwordHash String   -- bcrypt
  name         String
  createdAt    DateTime
}
```

**Notas sobre el modelo:**
- Las imágenes se eliminan en cascada al borrar una propiedad (`onDelete: Cascade`)
- Las consultas mantienen registro histórico aunque se elimine la propiedad (`onDelete: SetNull`)
- El campo `source` en `Inquiry` permite distinguir consultas generales de las vinculadas a una propiedad específica
- Los slugs se generan automáticamente desde el título; si hay colisión, se agrega un sufijo alfanumérico de 4 caracteres basado en timestamp

---

## 8. Autenticación y seguridad

### Auth.js v5 (NextAuth)
- **Estrategia:** credentials (email + contraseña con bcrypt)
- **Sesión:** JWT (stateless, compatible con Edge Runtime de Vercel)
- **Split de configuración:** `auth.config.ts` solo importa módulos Edge-safe; `auth.ts` importa Prisma y bcrypt (no Edge)
- **Middleware:** `src/middleware.ts` protege todas las rutas `/admin/*` redirigiendo a `/admin/login` si no hay sesión válida

### Protección de endpoints
- La route `POST /api/admin/upload` verifica sesión con `auth()` antes de procesar cualquier archivo
- Los Server Actions (`actions.ts`) llaman a `requireAdmin()` como primera instrucción
- El formulario de contacto incluye un campo **honeypot** (campo oculto) para filtrar bots

### Gestión de usuarios admin
- Un solo modelo `AdminUser` con contraseña hasheada con bcrypt
- No hay registro público; los usuarios se crean via seed o directamente en la base de datos
- El seed acepta `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` como variables de entorno

---

## 9. Sitio público — funcionalidades

### Home (`/`)
- **Hero** con titular editorial y call-to-action principal
- **SearchBar** de búsqueda rápida: operación (venta/arriendo), tipo de propiedad, ciudad → redirige al catálogo con filtros preseleccionados
- **FeaturedSection** con las propiedades marcadas como `featured`, con Suspense streaming (muestra skeleton mientras carga)
- **ServicesTeaser** con vista previa de los servicios
- CTA final a la página de contacto

### Catálogo (`/propiedades`)
- Filtros combinables: operación, tipo, estado, ciudad, dormitorios mínimos, baños mínimos, precio máximo
- Los filtros se sincronizan en la URL (query params) → **los enlaces son compartibles y bookmarkables**
- Paginación
- Implementado con Suspense streaming: los filtros renderizan inmediatamente, los resultados aparecen con skeleton mientras cargan
- Ordenamiento: propiedades más recientes primero

### Ficha de propiedad (`/propiedades/[slug]`)
- Galería de imágenes con lightbox (yet-another-react-lightbox): navegación por teclado y swipe
- Mapa interactivo (react-leaflet + OpenStreetMap): centrado en las coordenadas de la propiedad con pin
- Formulario de contacto pre-completado con el nombre de la propiedad
- Link directo a WhatsApp con mensaje pre-armado incluyendo el nombre de la propiedad
- Badge de estado visible (DISPONIBLE / RESERVADA / ARRENDADA / VENDIDA)
- Precio formateado en CLP (con separador de miles) o UF

### Otras páginas
- `/contacto` — Formulario de contacto con campos: nombre, email, teléfono (opcional), mensaje. Honeypot incluido.
- `/servicios` — Descripción de los 6 servicios + proceso de trabajo en 4 pasos
- `/nosotras` — Historia, valores, cita de la fundadora y CTA
- `404` personalizado

### SEO técnico
- `sitemap.ts` dinámico: genera una URL por cada propiedad + todas las páginas estáticas
- `robots.ts` dinámico: permite indexación del sitio público, bloquea `/admin`
- Metadatos específicos por página (title, description, keywords, OpenGraph)
- `metadataBase` configurado con la URL de producción para OG correcto
- Fuentes optimizadas con `next/font` (sin FOUT)
- Imágenes con `next/image` (lazy loading, srcset automático)
- Skip-to-content para accesibilidad (`#contenido`)

---

## 10. Panel de administración

Acceso: `/admin/login` → autenticación con email y contraseña → JWT en cookie.

### Dashboard (`/admin`)
- Conteo de propiedades por estado (DISPONIBLE, RESERVADA, ARRENDADA, VENDIDA)
- Consultas recibidas en los últimos 7 días
- Accesos rápidos a las secciones principales

### Propiedades (`/admin/propiedades`)
- Listado de todas las propiedades con estado y fecha de creación
- Botón para crear nueva propiedad
- Al hacer clic en una propiedad → formulario de edición

### Crear / editar propiedad
El `PropertyForm` cubre todos los campos del modelo:
- Información básica: título, operación, tipo, estado, precio, moneda (CLP/UF)
- Ubicación:
  - Ciudad, sector, dirección (texto libre)
  - **Mapa interactivo**: pin movible para elegir coordenadas (`LocationPickerMap`)
  - **Link de Google Maps**: campo de texto que acepta URLs largas (`google.com/maps/place/...`) o cortas (`maps.app.goo.gl/...`). El Server Action `resolveMapsLink` sigue las redirecciones de los links cortos para extraer latitud y longitud
- Detalles: dormitorios, baños, estacionamientos, bodega, superficie construida, superficie terreno
- Descripción (textarea largo)
- Destacada en home (toggle)
- Imágenes: componente `ImageDropzone` con drag & drop, reordenamiento, preview y compresión automática

**Mutaciones:** todas las Server Actions revalidan las rutas afectadas (`/propiedades`, `/propiedades/[slug]`, `/`) para que el sitio público se actualice inmediatamente.

### Consultas (`/admin/inquiries`)
- Listado de todos los leads ordenados por fecha (más recientes primero)
- Datos visibles: nombre, email, teléfono, mensaje, propiedad asociada (si la hay), fecha
- Acción para marcar como leída
- Link directo a la propiedad asociada

---

## 11. Subida de imágenes (R2)

**Flujo completo:**

1. El usuario arrastra archivos al `ImageDropzone` o los selecciona desde el selector de archivos
2. El navegador comprime cada imagen a máximo 1600 px en el lado mayor y 1 MB de tamaño (`browser-image-compression`)
3. Se hace `POST /api/admin/upload` con el archivo comprimido (FormData)
4. El route handler verifica la sesión admin
5. Sube el objeto a R2 usando `PutObjectCommand` del SDK de S3
6. El nombre de archivo en R2 es `<uuid-v4>.<ext>` para evitar colisiones
7. Devuelve la URL pública: `https://img.miradorpropiedades.cl/<uuid>.<ext>`
8. La URL queda en el estado del formulario y se persiste en `PropertyImage.url` al guardar la propiedad

**Eliminación de imágenes:** al editar una propiedad, el update borra todas las `PropertyImage` existentes (`deleteMany: {}`) y las recrea en orden desde el formulario. Las imágenes huérfanas en R2 no se eliminan automáticamente (limpieza manual si es necesario).

---

## 12. Emails transaccionales (Resend)

Al recibir una consulta de contacto:
1. El formulario valida con Zod en el cliente y en el servidor
2. Se guarda una fila en `Inquiry`
3. Se envía un email al destinatario configurado en `CONTACT_EMAIL_TO`
4. El template HTML está en `src/lib/email.ts` e incluye: nombre, email, teléfono, mensaje y (si aplica) la propiedad de interés

Si `RESEND_API_KEY` no está configurada, el paso 3 falla silenciosamente: la consulta igual queda guardada en la base de datos.

---

## 13. SEO y performance

### Estrategia de rendering
- **Server Components por defecto** — los datos se obtienen en servidor, sin roundtrips adicionales al cliente
- **Suspense + streaming** — en el catálogo y en el home, el shell de la página llega inmediatamente y los resultados se transmiten progresivamente
- **Loading skeletons** — `loading.tsx` en cada ruta para mostrar estructura mientras carga el contenido

### Navegación
- `NavigationProgress` — barra de progreso visual durante la navegación entre páginas (implementación con `useRouter` y transiciones)
- Las transiciones de página son instantáneas desde el punto de vista del usuario gracias al prefetching de Next.js

### Tipografía
- **Montserrat** (sans-serif): textos del cuerpo, UI, labels
- **Cormorant Garamond** (serif editorial): títulos, displays, itálicas de acento
- Ambas fuentes cargadas con `next/font/google` (sin layout shift)

### Imágenes
- `next/image` en todas las imágenes estáticas y de propiedades
- Compresión automática en el cliente antes de subir a R2
- Las imágenes de R2 se sirven desde un subdominio propio (`img.miradorpropiedades.cl`)

---

## 14. Variables de entorno

Copiar `.env.example` como `.env` y completar:

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | ✓ | Connection string de PostgreSQL (Neon, Supabase, local, etc.) |
| `AUTH_SECRET` | ✓ | JWT secret — generar con `npx auth secret` |
| `AUTH_URL` | ✓ | URL pública del sitio (`http://localhost:3000` en dev, `https://www.miradorpropiedades.cl` en prod) |
| `RESEND_API_KEY` | — | Emails transaccionales. Sin esto el form guarda en DB pero no envía correo |
| `CONTACT_EMAIL_TO` | — | Destinatario de las consultas (email de la corredora) |
| `CONTACT_EMAIL_FROM` | — | Remitente configurado en Resend (`noreply@miradorpropiedades.cl` o similar) |
| `WHATSAPP_NUMBER` | — | Número en formato internacional sin `+` (ej: `56988040592`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | — | Igual que el anterior (se expone al cliente para los links de WhatsApp) |
| `R2_ACCOUNT_ID` | — | ID de cuenta Cloudflare |
| `R2_ACCESS_KEY_ID` | — | API Token R2 — permisos Read & Write |
| `R2_SECRET_ACCESS_KEY` | — | Secreto del API Token R2 |
| `R2_BUCKET_NAME` | — | Nombre del bucket en R2 |
| `R2_PUBLIC_URL` | — | URL base pública del bucket (`https://img.miradorpropiedades.cl`) |
| `NEXT_PUBLIC_SITE_URL` | — | URL pública del sitio (OG tags, links en emails). Sin esto usa el fallback hardcodeado. |
| `SEED_ADMIN_EMAIL` | — | Email del usuario admin inicial (solo en seed) |
| `SEED_ADMIN_PASSWORD` | — | Contraseña del usuario admin inicial (solo en seed) |

---

## 15. Setup local

### Requisitos previos
- Node.js 20+
- npm 10+
- PostgreSQL local (o cuenta en Neon/Supabase)

### Pasos

**1. Instalar dependencias**
```bash
npm install
```

**2. Configurar variables de entorno**
```bash
# macOS/Linux
cp .env.example .env

# PowerShell
Copy-Item .env.example .env
```

Editar `.env` con los valores correspondientes. Para desarrollo local solo son estrictamente necesarias `DATABASE_URL`, `AUTH_SECRET` y `AUTH_URL`.

**3. Crear tablas y ejecutar migraciones**
```bash
npx prisma migrate dev --name init
```

**4. Cargar datos de ejemplo**
```bash
npm run db:seed
```

El seed crea 8 propiedades de ejemplo y 1 usuario admin. Para usar credenciales propias:
```bash
# PowerShell
$env:SEED_ADMIN_EMAIL="admin@ejemplo.cl"; $env:SEED_ADMIN_PASSWORD="mi-clave"; npm run db:seed

# bash
SEED_ADMIN_EMAIL="admin@ejemplo.cl" SEED_ADMIN_PASSWORD="mi-clave" npm run db:seed
```

Si no se especifican, se usan los valores por defecto definidos en `prisma/seed.ts`.

**5. Iniciar el servidor de desarrollo**
```bash
npm run dev
```

- Sitio público → http://localhost:3000
- Panel admin → http://localhost:3000/admin/login

### Prisma Studio (opcional)
```bash
npm run db:studio
```
Abre una UI web para explorar y editar la base de datos directamente.

---

## 16. Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción (incluye `prisma generate` automáticamente) |
| `npm start` | Servidor de producción (requiere `npm run build` previo) |
| `npm run typecheck` | Verificación de tipos TypeScript sin compilar |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerar Prisma client (después de cambiar el schema) |
| `npm run db:migrate` | Crear y aplicar una nueva migración (entorno dev) |
| `npm run db:push` | Push directo del schema sin generar migración (iteración rápida en dev) |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:studio` | Abrir Prisma Studio |

---

## 17. Decisiones técnicas relevantes

### App Router + Server Components
Se eligió el App Router de Next.js 15 para aprovechar los Server Components: los datos de propiedades se obtienen directamente en servidor sin necesidad de SWR/React Query ni endpoints adicionales. Esto simplifica el stack y mejora el rendimiento inicial.

### Auth.js split config (Edge-safe)
El middleware de Next.js corre en Edge Runtime, que no soporta módulos como `bcrypt` o el cliente de Prisma. Se separó la configuración en dos archivos:
- `auth.config.ts` — importable en Edge (solo configuración, sin dependencias de Node.js)
- `auth.ts` — completo, con Prisma y bcrypt, para uso en Server Components y route handlers

### JWT en lugar de sesiones en base de datos
Se eligió JWT (stateless) para evitar una tabla de sesiones y mantener el sistema simple. El trade-off es que no se pueden invalidar tokens activos desde el servidor sin un mecanismo adicional (lista negra de JWTs). Para este caso de uso (un solo admin) el trade-off es aceptable.

### Cloudflare R2 en lugar de Vercel Blob o S3
R2 tiene egreso gratuito (no se cobra por transferencia de datos de salida), lo que lo hace económicamente conveniente para un sitio con muchas imágenes. Además, el CNAME personalizado (`img.miradorpropiedades.cl`) permite servir las imágenes desde el dominio propio sin costos de CDN adicionales.

### Resolución de links cortos de Google Maps
Los usuarios de móvil típicamente copian links cortos (`maps.app.goo.gl/...`). El Server Action `resolveMapsLink` sigue la redirección HTTP para obtener la URL larga y extraer las coordenadas con regex. Esto corre en servidor para evitar problemas de CORS.

### Revalidación on-demand en lugar de SSG
Las páginas de propiedades usan rendering dinámico con revalidación `on-demand` (vía `revalidatePath`) disparada por los Server Actions. Esto garantiza que el sitio público se actualice inmediatamente al publicar o editar una propiedad, sin tiempos de revalidación configurados.

### Suspense streaming en el catálogo
El catálogo de propiedades envuelve los resultados en `<Suspense>` con un skeleton. Esto permite que la URL y los filtros sean compartibles y se resuelvan en servidor, mientras que los resultados se transmiten progresivamente sin bloquear el renderizado inicial de la página.
