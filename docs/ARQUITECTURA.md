# Arquitectura técnica — Mirador Propiedades

> Referencia profunda de implementación. Para la visión general, el stack y la puesta en marcha, ver el [README](../README.md).
> Última revisión: septiembre 2026 · Corresponde al estado del código en `main`.

---

## Tabla de contenidos

1. [Principios de diseño](#1-principios-de-diseño)
2. [Mapa de rutas](#2-mapa-de-rutas)
3. [Capa de datos](#3-capa-de-datos)
4. [Renderizado, caché y revalidación](#4-renderizado-caché-y-revalidación)
5. [Autenticación y autorización](#5-autenticación-y-autorización)
6. [Server Actions](#6-server-actions)
7. [Route handlers](#7-route-handlers)
8. [Validación con Zod](#8-validación-con-zod)
9. [Subida y entrega de imágenes](#9-subida-y-entrega-de-imágenes)
10. [Geolocalización](#10-geolocalización)
11. [Video](#11-video)
12. [Email transaccional](#12-email-transaccional)
13. [Sistema de diseño](#13-sistema-de-diseño)
14. [Componentes cliente](#14-componentes-cliente)
15. [Estrategia de resiliencia](#15-estrategia-de-resiliencia)
16. [Convenciones de código](#16-convenciones-de-código)
17. [Decisiones de arquitectura (ADR)](#17-decisiones-de-arquitectura-adr)
18. [Evolución sugerida](#18-evolución-sugerida)

---

## 1. Principios de diseño

Cinco reglas que explican la mayoría de las decisiones del código:

1. **El servidor es el lugar por defecto.** Un componente solo lleva `"use client"` si necesita estado, efectos o eventos del navegador. No existe capa de fetching en cliente ni endpoints internos para leer datos: los Server Components consultan Prisma directamente.
2. **La URL es el estado.** Filtros, orden y paginación viven en `searchParams`. No hay estado global ni store: cualquier vista del catálogo es reproducible con un enlace.
3. **Una sola fuente de verdad por concepto.** El esquema Prisma define los tipos; los esquemas Zod definen las reglas de validación en ambos lados; `lib/` centraliza comunas, redes, WhatsApp y formateo.
4. **Nunca romper la página por un fallo de datos.** Toda consulta a Postgres está envuelta en `try/catch` con un fallback razonable y un log con contexto.
5. **Percepción de velocidad por encima de completitud instantánea.** Shell inmediato, esqueletos que replican la maquetación final, streaming del contenido pesado y carga diferida de todo lo de terceros.

---

## 2. Mapa de rutas

### Públicas

| Ruta | Archivo | Tipo | Datos |
|---|---|---|---|
| `/` | `app/page.tsx` | RSC · ISR 300s | `getPropertyCities()` + `FeaturedSection` en `<Suspense>` |
| `/propiedades` | `app/propiedades/page.tsx` | RSC dinámico | Shell estático + `PropertiesResults` en `<Suspense>` |
| `/propiedades/[slug]` | `app/propiedades/[slug]/page.tsx` | RSC · ISR 300s | Propiedad + imágenes + similares |
| `/servicios` | `app/servicios/page.tsx` | Estática | — |
| `/nosotros` | `app/nosotros/page.tsx` | Estática | `/nosotras` redirige aquí (301, en `next.config.ts`) |
| `/contacto` | `app/contacto/page.tsx` | Estática | — |
| `/sitemap.xml` | `app/sitemap.ts` | RSC · 3600s | Slugs y `updatedAt` de propiedades visibles |
| `/robots.txt` | `app/robots.ts` | Estática | — |
| `*` | `app/not-found.tsx` | Estática | — |

### Privadas (`/admin`)

| Ruta | Archivo | Datos |
|---|---|---|
| `/admin/login` | `admin/login/page.tsx` | Server Action `signInAction` |
| `/admin` | `admin/page.tsx` | `groupBy` por estado, 5 consultas recientes, conteo de 7 días |
| `/admin/propiedades` | `admin/propiedades/page.tsx` | Listado con `_count.inquiries` |
| `/admin/propiedades/nueva` | `admin/propiedades/nueva/page.tsx` | Formulario en modo `create` |
| `/admin/propiedades/[id]` | `admin/propiedades/[id]/page.tsx` | Formulario en modo `edit` + banner de confirmación por `?ok=` |
| `/admin/inquiries` | `admin/inquiries/page.tsx` | Todas las consultas con su propiedad |

`admin/layout.tsx` renderiza la barra lateral solo si hay sesión y expone el cierre de sesión como Server Action inline. `Header` y `Footer` se auto-ocultan cuando `pathname` empieza por `/admin`, de modo que el panel no arrastra el cromo del sitio público.

### API

| Endpoint | Runtime | Autorización |
|---|---|---|
| `POST /api/contact` | Node | Pública (honeypot + validación) |
| `POST /api/admin/upload` | Node (forzado) | `auth()` obligatoria |
| `GET/POST /api/auth/[...nextauth]` | Node (forzado) | Auth.js |

> Los dos handlers que tocan bcrypt o el SDK de S3 declaran `export const runtime = "nodejs"` explícitamente para evitar que Next intente promoverlos a Edge.

---

## 3. Capa de datos

### 3.1 Cliente Prisma

`src/lib/prisma.ts` mantiene una instancia única en `globalThis` fuera de producción, para que el hot reload de Next no abra una conexión nueva por recompilación. En desarrollo registra `error` y `warn`; en producción, solo `error`.

### 3.2 Consulta del catálogo

`PropertiesResults` traduce los `searchParams` a un `Prisma.PropertyWhereInput` mediante `buildWhere()`:

| Parámetro URL | Campo | Operador |
|---|---|---|
| `op` | `operation` | igualdad (solo `VENTA`/`ARRIENDO`) |
| `tipo` | `type` | igualdad |
| `estado` | `status` | igualdad; **si se omite**, `status IN (DISPONIBLE, RESERVADA)`. Ya no se expone en la interfaz |
| `comuna` | `city` | igualdad |
| `dorms` | `bedrooms` | `gte`. Ya no se expone en la interfaz |
| `banos` | `bathrooms` | `gte`. Ya no se expone en la interfaz |
| `precioMin` / `precioMax` | `price` | `gte` / `lte` |
| `orden` | — | `price asc` · `price desc` · `createdAt desc` (por defecto) |
| `pagina` | — | `skip = (n-1) * 12`, `take = 12` |

El conteo total, la página de resultados y la lista de comunas se resuelven en un único `Promise.all`. Las tarjetas solo traen la primera imagen (`take: 1`), no toda la galería.

> El default de estado de `buildWhere()` está deliberadamente alineado con el de `getPropertyCities()`: ambos filtran `DISPONIBLE`/`RESERVADA`, de modo que el selector de comunas nunca ofrece una comuna sin resultados visibles.

### 3.3 Consulta de la ficha

```ts
const getProperty = cache((slug: string) =>
  prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  }),
);
```

`cache()` de React deduplica la llamada dentro de la misma request: `generateMetadata` y el componente de página comparten un solo `SELECT`. Las propiedades similares se consultan aparte (mismo `type`, estado visible, excluyendo la actual, `take: 3`) con `.catch(() => [])` para que un fallo en ese bloque secundario no tumbe la ficha.

### 3.4 Frontera servidor → cliente

`Property.price` es `Decimal` (instancia de `decimal.js`), tipo no serializable como prop de un Client Component. El tipo `PropertyCardData` codifica esa restricción:

```ts
export type PropertyCardData = Omit<PropertyWithImages, "price"> & { price: string };
```

Cada punto que pasa una propiedad a `PropertyCard` hace `{ ...p, price: p.price.toString() }`. Es una conversión explícita y localizada, en lugar de un serializador mágico.

---

## 4. Renderizado, caché y revalidación

### Segmentos con ISR

```ts
// app/page.tsx y app/propiedades/[slug]/page.tsx
export const revalidate = 300;   // 5 minutos

// app/sitemap.ts
export const revalidate = 3600;  // 1 hora
```

El TTL es el suelo, no el mecanismo principal: la frescura real la garantiza la revalidación on-demand disparada por las Server Actions.

```ts
revalidatePath("/propiedades");
revalidatePath(`/propiedades/${property.slug}`);
revalidatePath("/");
```

### Streaming y esqueletos

Hay dos niveles complementarios:

- **`loading.tsx` por ruta** — se muestra durante la navegación, antes de que el servidor empiece a responder. Existen en la raíz, `/propiedades`, `/propiedades/[slug]` y `/admin` (este último neutro, para que el esqueleto de marketing de la raíz no se filtre en el panel).
- **`<Suspense>` interno** — parte de la página se pinta al instante y el bloque dependiente de datos llega después. `/propiedades` lo usa con `key={JSON.stringify(sp)}` para que un cambio de filtros vuelva a mostrar el esqueleto en lugar de congelar los resultados anteriores.

Los esqueletos de `ui/Skeleton.tsx` replican la maquetación real (aspecto 4/5, caption, meta strip) para que no haya salto perceptible al llegar el contenido.

---

## 5. Autenticación y autorización

### 5.1 División Edge / Node

| Archivo | Importa | Se usa en |
|---|---|---|
| `lib/auth.config.ts` | Solo tipos de `next-auth` | `middleware.ts` (Edge Runtime) |
| `lib/auth.ts` | `auth.config` + Prisma + bcrypt + Zod | Server Components, Server Actions, route handlers |

El middleware de Next corre en Edge, donde no existen las APIs de Node que necesitan bcrypt y el motor de Prisma. Mantener la configuración base libre de esas dependencias es lo que permite proteger `/admin/*` en el borde sin bundlear el ORM.

### 5.2 Callback `authorized`

```ts
authorized({ auth, request }) {
  const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
  const isOnLogin = request.nextUrl.pathname.startsWith("/admin/login");
  if (isOnLogin) return true;
  if (isOnAdmin) return !!auth?.user;
  return true;
}
```

El matcher del middleware es `["/admin/:path*"]`, de modo que el sitio público no paga el costo de la comprobación.

### 5.3 Provider de credenciales

`authorize()` valida la forma de las credenciales con Zod antes de tocar la base de datos, busca el `AdminUser` por email y compara con `bcrypt.compare`. Devuelve `null` en todos los caminos de fallo — mismo resultado para email inexistente y contraseña incorrecta, sin filtrar cuál de los dos falló.

### 5.4 Defensa en profundidad

El middleware no es la única barrera. Cada Server Action empieza por:

```ts
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}
```

y `POST /api/admin/upload` verifica la sesión antes incluso de leer el `FormData`. Un fallo de configuración del matcher no abriría el CRUD.

### 5.5 Login

`signInAction` es una Server Action inline en la página de login. Captura `AuthError` y redirige a `?error=<tipo>` para mostrar un mensaje genérico. El `callbackUrl` recibido se sanea antes de usarse:

```ts
const safeCallback =
  callback && callback.startsWith("/") && !callback.startsWith("//")
    ? callback
    : "/admin";
```

Esto cierra el vector de *open redirect* (`//evil.com` es una URL protocolo-relativa válida).

---

## 6. Server Actions

Definidas en `app/admin/propiedades/actions.ts` con `"use server"` a nivel de módulo.

| Acción | Responsabilidad |
|---|---|
| `createProperty(input)` | Valida con Zod, genera slug único, crea propiedad + imágenes anidadas, revalida y redirige a `?ok=created` |
| `updateProperty(id, input)` | Valida, reemplaza el set de imágenes (`deleteMany` + `create`), revalida y redirige a `?ok=updated` |
| `deleteProperty(id)` | Elimina (las imágenes caen por cascade), revalida y redirige al listado |
| `resolveMapsLink(url)` | Extrae coordenadas de un enlace de Google Maps, resolviendo redirecciones de enlaces cortos |

**Generación de slug:**

```ts
let slug = slugify(parsed.title, { lower: true, strict: true });
const existing = await prisma.property.findUnique({ where: { slug } });
if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
```

No es atómico frente a una colisión simultánea, pero con un único administrador el riesgo es despreciable y el `@unique` de la base de datos actúa como red final.

**Reemplazo de imágenes.** El update borra todas las filas de `PropertyImage` y las recrea desde el formulario. La ventaja es que el orden y el contenido siempre reflejan exactamente lo que se ve en el formulario; el costo es que los objetos ya subidos a R2 quedan huérfanos si se quitan de la lista (ver deuda técnica en el README).

---

## 7. Route handlers

### `POST /api/contact`

Secuencia: parseo defensivo del JSON → validación Zod → chequeo de honeypot → persistencia → resolución de la URL de la propiedad → envío del email.

Puntos de diseño:

- El honeypot responde `{ ok: true }` sin efectos. Un bot no aprende nada del rechazo.
- Si la escritura en base de datos falla, **el flujo continúa** hacia el email: perder el registro es malo, perder el lead es peor.
- `source` se deriva en servidor (`propertyId ? "property" : "contact"`), no se acepta del cliente.

### `POST /api/admin/upload`

Validaciones en orden: sesión → `FormData` parseable → el campo es un `File` → MIME en la allow-list → tamaño ≤ 4 MB. La extensión se deriva del MIME declarado a través de un mapa cerrado, nunca del nombre del archivo subido:

```ts
const EXT_BY_TYPE = {
  "image/jpeg": "jpg", "image/png": "png",
  "image/webp": "webp", "image/avif": "avif",
};
const key = `properties/${crypto.randomUUID()}.${ext}`;
```

Devuelve `{ url }` con la URL pública ya construida, de forma que el cliente nunca necesita conocer la estructura del bucket.

---

## 8. Validación con Zod

`src/lib/validations.ts` es la única definición de reglas, consumida por React Hook Form (`zodResolver`) y por el servidor.

### `contactFormSchema`

| Campo | Reglas |
|---|---|
| `name` | 2–80 caracteres |
| `email` | formato email |
| `phone` | opcional, ≤ 30 |
| `message` | 10–2000 caracteres |
| `propertyId` | CUID opcional |
| `website` | honeypot: longitud máxima **0** |

### `propertyFormSchema`

| Campo | Reglas |
|---|---|
| `title` | 5–160 |
| `operation` / `type` / `status` / `currency` | enums cerrados, espejo del esquema Prisma |
| `price` | numérico positivo (coerción desde string del formulario) |
| `city` | 2–80 · `sector` ≤ 120 · `address` ≤ 200 |
| `lat` / `lng` | rangos geográficos válidos, opcionales |
| `bedrooms` / `bathrooms` / `parking` | entero 0–20 |
| `builtArea` | entero 0–100 000 · `landArea` 0–10 000 000 |
| `description` | 20–5000 |
| `videoUrl` | opcional; se normaliza a `null` si viene vacío y se rechaza si `parseVideoUrl()` no lo reconoce |
| `images` | al menos una; cada una con `url` válida y `alt` de ≥ 3 caracteres |

El `alt` obligatorio es una decisión de accesibilidad aplicada por el tipo: no es posible publicar una propiedad con imágenes sin descripción.

---

## 9. Subida y entrega de imágenes

### Cliente

`ImageDropzone` acepta múltiples archivos, mantiene un contador de subidas en curso y comprime cada imagen con `browser-image-compression` (`maxSizeMB: 1`, `maxWidthOrHeight: 1600`, web worker). Si la compresión falla, hace *fallback* al archivo original en lugar de abortar. Los errores se notifican por toast, archivo por archivo, sin interrumpir el resto del lote.

### Servidor

`lib/r2.ts` construye un `S3Client` apuntando al endpoint de R2 (`https://<account>.r2.cloudflarestorage.com`, `region: "auto"`) y lo cachea en `globalThis` fuera de producción. `requireEnv()` lanza un error explícito con el nombre de la variable faltante — un fallo de configuración se diagnostica en un vistazo.

### Entrega

Las URLs se sirven desde `img.miradorpropiedades.cl`, declarado en `remotePatterns`. `next/image` genera `srcset` y formatos modernos automáticamente, con `sizes` explícitos por breakpoint en cada uso.

---

## 10. Geolocalización

`src/lib/maps.ts` extrae `{ lat, lng }` probando patrones en orden de precisión decreciente:

| Orden | Patrón | Ejemplo |
|---|---|---|
| 1 | `!3d<lat>!4d<lng>` | coordenadas exactas del lugar dentro de la URL larga |
| 2 | `@<lat>,<lng>` | centro de la vista del mapa |
| 3 | `?q=` · `query=` · `ll=` · `center=` · `destination=` | parámetros de consulta |
| 4 | `<lat>, <lng>` | par pegado directamente en el campo |

El primero que coincide gana, y el resultado se valida contra los rangos geográficos reales antes de devolverse.

Los enlaces cortos (`maps.app.goo.gl`, `goo.gl`, `g.co`) no contienen coordenadas: la Server Action `resolveMapsLink` hace `fetch(url, { redirect: "follow" })` y parsea la **URL final**. Corre en servidor por dos razones: evita CORS y no expone el patrón de navegación del administrador.

En la interfaz, las tres vías conviven y escriben sobre el mismo par de campos: enlace pegado (se dispara en `onPaste` y `onBlur`), clic o arrastre del pin en `LocationPickerMap`, y edición manual dentro de un `<details>` colapsado. El mapa se centra por defecto en la Región de Los Lagos cuando aún no hay coordenadas.

---

## 11. Video

`src/lib/video.ts` normaliza enlaces a `{ provider, id, embedUrl }`:

| Origen | Formatos soportados |
|---|---|
| YouTube | `youtube.com/watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/`, `youtube-nocookie.com` |
| Vimeo | `vimeo.com/<id>`, `vimeo.com/<id>/<hash>` (privados), `player.vimeo.com/video/<id>?h=` |

Los IDs se validan por forma (11 caracteres alfanuméricos en YouTube; 6–12 dígitos en Vimeo) y los subdominios `www.`/`m.` se normalizan. El `embedUrl` de YouTube usa siempre `youtube-nocookie.com` con `rel=0`.

`VideoEmbed` implementa el patrón **facade**: renderiza la portada de la propiedad con un botón de play y solo monta el `iframe` tras el clic. Esto evita cargar el reproductor de terceros (varios cientos de KB y múltiples conexiones) en cada visita a la ficha, que es donde más pesa el rendimiento móvil.

---

## 12. Email transaccional

`lib/email.ts` construye una plantilla HTML inline (sin CSS externo, por compatibilidad con clientes de correo) y la envía con Resend.

- El asunto incluye el título de la propiedad cuando la consulta viene de una ficha.
- `replyTo` apunta al email del consultante: responder desde la bandeja escribe directamente al cliente.
- **Todos** los campos interpolados pasan por un escapador de `& < > " '`.
- Si no hay `RESEND_API_KEY`, la función registra un aviso y devuelve `{ ok: false, reason: "no-api-key" }` sin lanzar: el flujo de la consulta no se interrumpe.

---

## 13. Sistema de diseño

### Tokens

Declarados en `:root` dentro de `app/globals.css` y mapeados a Tailwind en `tailwind.config.ts`, de modo que `bg-surface` o `text-muted` resuelven a variables CSS y no a valores literales.

| Grupo | Tokens |
|---|---|
| Superficies | `--bg` `--bg-tint` `--surface` `--surface-2` `--night` `--night-2` |
| Texto | `--fg` `--ink` `--muted` `--muted-2` |
| Bordes | `--border` `--border-strong` |
| Acento | `--accent` `#c8102e` · `--accent-hover` |
| Sombras | `--shadow-soft` `--shadow-elev` `--shadow-float` |
| Easing | `--ease-out-quart` `--ease-in-out-quart` |

### Tipografía

Dos familias cargadas con `next/font/google` como variables CSS: **Cormorant Garamond** (`--font-cormorant`, display, con itálicas) y **Montserrat** (`--font-montserrat`, sans). Los `h1–h4` heredan la display por defecto desde la capa `base`.

Las clases `display-xl/lg/md` usan `clamp()` para escalar de forma fluida y activan `hyphens: auto` + `overflow-wrap: break-word`: con `lang="es-CL"` en el documento, una palabra larga como «Acompañamiento» se parte en sílabas en vez de desbordar en pantallas estrechas.

### Utilidades

`eyebrow` (antetítulo en versalitas con filete previo), `link-underline` (subrayado que se retrae desde el lado opuesto al entrar), `img-zoom` (escala 1.05 en 1200 ms), `img-skeleton` (shimmer), `card-loading-bar`, `reveal` / `reveal-stagger`, `marquee-track`, `noise-overlay`, `hero-overlay`, y los contenedores `container-tight` (5xl), `container-wide` (1320 px) y `container-ultra` (1480 px).

### Detalles deliberados

- `body { overflow-x: clip }` en lugar de `hidden`: recorta desbordes horizontales **sin** crear un contenedor de scroll, por lo que `position: sticky` sigue funcionando en los descendientes (la columna de contacto de la ficha depende de ello).
- `*:focus-visible` define un outline global explícito; `*:focus:not(:focus-visible)` lo suprime solo para el foco por puntero.
- Overrides de `.leaflet-container` para que los mapas hereden la tipografía y las sombras del sistema.

---

## 14. Componentes cliente

Inventario completo de islas interactivas (`"use client"`) y por qué lo son:

| Componente | Motivo |
|---|---|
| `Header` | Menú móvil, bloqueo de scroll, ruta activa |
| `Footer` | Se oculta en `/admin` según `pathname` |
| `NavigationProgress` | Listener global de clics + `usePathname`/`useSearchParams` |
| `Reveal` | `IntersectionObserver` |
| `HeroCarousel` | Temporizador de autoavance |
| `SearchBar` | Estado del formulario y navegación programática |
| `Filters` | Estado de filtros, `useTransition`, drawer móvil |
| `PropertyCard` | Feedback visual de carga al hacer clic |
| `Gallery` | Estado del lightbox |
| `VideoEmbed` | Montaje diferido del `iframe` |
| `MapView`, `LocationPickerMap`, `PropertyDetailMap` | Leaflet requiere `window` (importados con `ssr: false`) |
| `ContactForm`, `PropertyForm`, `ImageDropzone` | React Hook Form, subidas, toasts |

### `NavigationProgress`

Implementación propia sin dependencias. Escucha clics en **fase de captura** sobre `document`, descarta modificadores, `target="_blank"`, `download`, enlaces externos y navegaciones a la misma URL; entonces inicia una barra que avanza asintóticamente hasta el 90 %. El cambio de `pathname`/`searchParams` la completa y la oculta. Esto da feedback inmediato incluso en rutas estáticas que no tienen `loading.tsx`.

### `Reveal`

`IntersectionObserver` con `threshold: 0.12` y `rootMargin: "0px 0px -60px 0px"`, que se desconecta tras la primera intersección. El escalonado de hijos (`reveal-stagger`) se resuelve íntegramente en CSS con `transition-delay` por `nth-child`, sin un observer por elemento. Bajo `prefers-reduced-motion: reduce`, el CSS deja los elementos visibles sin transición.

### `Filters`

Mantiene un estado local sincronizado con `useSearchParams` y escribe cada cambio con `router.replace(..., { scroll: false })` dentro de `useTransition`, de modo que el indicador «Actualizando…» aparece mientras el servidor recalcula sin bloquear la interfaz. Los valores por defecto (`orden=recientes`) se omiten de la URL para mantenerla limpia.

---

## 15. Estrategia de resiliencia

| Punto de fallo | Comportamiento |
|---|---|
| Postgres caído — home | `getFeatured()` devuelve `[]`; la sección de destacadas simplemente no se renderiza |
| Postgres caído — comunas | `getPropertyCities()` devuelve `[]`; los selectores quedan sin opciones pero el buscador sigue en pie |
| Postgres caído — catálogo | Mensaje explicativo en lugar de la grilla, con el resto de la página intacto |
| Postgres caído — ficha | `notFound()` en vez de error 500 |
| Postgres caído — sitemap | Devuelve solo las entradas estáticas |
| Postgres caído — admin | Cada consulta tiene `.catch(() => [])`; el panel carga vacío |
| Escritura de consulta falla | Se intenta el envío del email igualmente |
| Resend sin API key | Se registra un aviso; la consulta ya está persistida |
| `NEXT_PUBLIC_SITE_URL` inválida | `safeUrl()` cae al dominio de producción y avisa por log |
| Variables de R2 ausentes | Error explícito nombrando la variable faltante |
| Compresión de imagen falla | Se sube el archivo original |
| Enlace de Maps irreconocible | Toast con instrucción concreta; el pin sigue disponible |

El patrón común es: **degradar la funcionalidad afectada, preservar el resto de la página y dejar rastro en los logs con un prefijo identificable** (`[home]`, `[/propiedades]`, `[sitemap]`, `[api/contact]`, `[getPropertyCities]`).

---

## 16. Convenciones de código

- **Idioma.** Interfaz, contenido y comentarios en español; identificadores de código en inglés. Los valores de enum van en español y en mayúsculas (`VENTA`, `DISPONIBLE`) porque son vocabulario del negocio; su traducción a etiquetas visibles vive en `lib/formatters.ts`.
- **Rutas públicas en español** (`/propiedades`, `/contacto`) y parámetros de búsqueda también (`?comuna=`, `?dorms=`), por SEO y legibilidad.
- **Imports** con el alias `@/*`; nunca rutas relativas que suban más de un nivel.
- **Componentes** exportados con nombre (`export function X`), salvo los que requieren `dynamic import`, que usan `export default`.
- **Tipos derivados**, no duplicados: todo lo del dominio se construye sobre los tipos generados por Prisma.
- **Comentarios de intención.** Los bloques no obvios explican *por qué* existen (el split de Auth.js, `overflow-x: clip`, el facade de video, la conversión de `Decimal`), no *qué* hacen.
- **Sin `any`.** `strict: true` y tipado explícito en las fronteras.

---

## 17. Decisiones de arquitectura (ADR)

### ADR-01 · App Router con Server Components

**Contexto.** El sitio es mayoritariamente contenido leído desde base de datos, con islas interactivas acotadas.
**Decisión.** App Router de Next.js 15 con RSC por defecto.
**Consecuencias.** Se elimina la necesidad de React Query/SWR y de una API interna de lectura; menos JavaScript en el cliente y datos siempre frescos en el primer render. A cambio, hay que ser explícito en la frontera servidor→cliente (el caso de `Decimal`) y elegir conscientemente qué se marca como `"use client"`.

### ADR-02 · Configuración de Auth.js dividida

**Contexto.** El middleware corre en Edge Runtime, incompatible con bcrypt y con el motor de Prisma.
**Decisión.** Separar `auth.config.ts` (Edge-safe) de `auth.ts` (completo).
**Consecuencias.** Se puede proteger `/admin/*` en el borde sin bundlear el ORM. El costo es mantener dos archivos y recordar cuál importar en cada contexto.

### ADR-03 · Sesiones JWT en lugar de sesiones en base de datos

**Contexto.** Un único usuario administrador; despliegue serverless.
**Decisión.** Estrategia `jwt`, sin adaptador de base de datos.
**Consecuencias.** Sin tabla de sesiones, sin consulta extra por request y compatible con Edge. A cambio, no se puede revocar una sesión activa desde el servidor. Aceptable con un solo administrador; si crece el equipo, corresponde migrar a sesiones persistidas.

### ADR-04 · Cloudflare R2 en lugar de Vercel Blob o S3

**Contexto.** Sitio con muchas imágenes grandes y presupuesto acotado.
**Decisión.** R2 con dominio propio (`img.miradorpropiedades.cl`).
**Consecuencias.** Egreso gratuito y API S3-compatible (SDK estándar, sin lock-in). El límite de 4 MB por request de los route handlers de Vercel se compensa con compresión en el cliente. Pendiente: recolección de objetos huérfanos.

### ADR-05 · Estado de filtros en la URL

**Contexto.** Buscar propiedades es una acción que la gente comparte por WhatsApp y guarda en marcadores.
**Decisión.** Todo el estado del catálogo vive en `searchParams`; los filtros escriben con `router.replace`.
**Consecuencias.** Enlaces compartibles, botón atrás funcional y renderizado en servidor de cualquier combinación. A cambio, cada cambio de filtro implica un round-trip al servidor, mitigado con `useTransition` y `<Suspense>`.

### ADR-06 · Revalidación on-demand en lugar de SSG puro

**Contexto.** La corredora publica y edita propiedades directamente; esperar un TTL sería inaceptable.
**Decisión.** ISR con TTL amplio + `revalidatePath` desde las Server Actions.
**Consecuencias.** El sitio público refleja los cambios de inmediato, conservando el rendimiento de contenido cacheado.

### ADR-07 · Facade para el reproductor de video

**Contexto.** Cargar el `iframe` de YouTube en cada ficha penaliza fuertemente el rendimiento móvil.
**Decisión.** Mostrar la portada con botón de play y montar el `iframe` solo tras el clic.
**Consecuencias.** La ficha no paga el costo del reproductor de terceros salvo cuando alguien quiere verlo. Requiere un clic adicional para reproducir.

### ADR-08 · Resolución de enlaces cortos de Maps en servidor

**Contexto.** Desde el móvil, Google Maps entrega enlaces `maps.app.goo.gl` que no contienen coordenadas.
**Decisión.** Una Server Action sigue la redirección y parsea la URL final.
**Consecuencias.** El flujo del admin es «pegar y listo», sin problemas de CORS y sin exponer la navegación del administrador. Depende de que Google mantenga el formato de sus URLs largas, por eso hay cuatro patrones de respaldo y siempre queda el pin manual.

### ADR-09 · Validación compartida con Zod

**Contexto.** Formularios complejos que deben validarse en ambos lados sin divergir.
**Decisión.** Un único módulo de esquemas consumido por RHF y por el servidor.
**Consecuencias.** Imposible que las reglas se desincronicen; los tipos de TypeScript se infieren de los mismos esquemas.

---

## 18. Evolución sugerida

Orden aproximado por relación valor/esfuerzo:

1. **Cerrar el ciclo de las consultas** — acción de marcar como leída, filtro por estado y contador de no leídas en la barra lateral. El campo `read` ya existe.
2. **Recolección de imágenes huérfanas** — comparar las claves del bucket contra `PropertyImage.url` y emitir `DeleteObjectCommand` para las no referenciadas, ya sea en el update o como tarea programada.
3. **Tests de las funciones puras** — `lib/maps.ts`, `lib/video.ts`, `lib/formatters.ts` y `lib/validations.ts` son deterministas y concentran la lógica más delicada.
4. **Reordenamiento de imágenes por arrastre** en el formulario de propiedad.
5. **Completar los filtros** — búsqueda por texto y rango de superficie, ya declarados en `PropertyFilterParams`; llevar los campos de precio a la barra de escritorio y añadir `COMERCIAL` al selector móvil.
6. **Datos estructurados** — JSON-LD `RealEstateListing` en la ficha, para resultados enriquecidos en buscadores.
7. **Servir los iconos de Leaflet localmente** en lugar de desde `unpkg.com`.
8. **Reemplazar la fotografía de stock** de las secciones editoriales por material propio.
9. **Limpiar dependencias sin uso** (`@auth/prisma-adapter` y los cuatro paquetes Radix inactivos).
10. **Analítica de conversión** — medir qué propiedades generan consultas, aprovechando que `Inquiry` ya guarda `propertyId` y `source`.
