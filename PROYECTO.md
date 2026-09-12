# Mirador Propiedades — Dossier del proyecto

> Contexto de negocio, alcance, servicios contratados e historial del proyecto.
> La documentación técnica vive en el [README](README.md), en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) y en [docs/OPERACION.md](docs/OPERACION.md).
> Última revisión: septiembre 2026.

---

## Tabla de contenidos

1. [Contexto del negocio](#1-contexto-del-negocio)
2. [Origen del proyecto](#2-origen-del-proyecto)
3. [Alcance entregado](#3-alcance-entregado)
4. [URLs y accesos](#4-urls-y-accesos)
5. [Servicios contratados](#5-servicios-contratados)
6. [Identidad y contenidos](#6-identidad-y-contenidos)
7. [Historial de desarrollo](#7-historial-de-desarrollo)
8. [Estado actual y próximos pasos](#8-estado-actual-y-próximos-pasos)
9. [Índice de documentación](#9-índice-de-documentación)

---

## 1. Contexto del negocio

**Mirador Propiedades** es una corredora de propiedades boutique en el **sur de Chile**. Opera principalmente en Frutillar, Llanquihue, Puerto Varas, Puerto Montt, Valdivia, Fresia y Los Muermos. Por decisión de la dueña, el sitio ya no nombra regiones: acotar el territorio puede generar sesgo en quienes buscan fuera de ese límite.

El negocio lo lidera **Alejandra** (fundadora) junto a su equipo. Su diferenciación es la atención personalizada y el conocimiento profundo del territorio: atienden pocas operaciones simultáneas para dedicar tiempo real a cada cliente, sin call centers ni procesos genéricos. Cada propiedad se visita antes de publicarse.

**Servicios que ofrecen** (reflejados en `/servicios`):

1. Búsqueda de hogar, con visita previa de cada inmueble
2. Venta de propiedades: evaluación comercial, marketing, fotografía y cierre legal
3. Arriendo y administración de inmuebles
4. Evaluación comercial con estudio comparativo de mercado (la corredora **no** realiza tasaciones)
5. Asesoría a inversionistas (parcelas, departamentos, locales)
6. Acompañamiento legal, coordinando abogados y notarías

**Proceso de trabajo estándar** (reflejado en el sitio):

1. **Conversación inicial** — entender el contexto y la necesidad
2. **Curaduría** — filtrar el catálogo y proponer opciones reales
3. **Visitas y negociación** — coordinación y representación del cliente
4. **Cierre** — coordinación de abogados, bancos y firma

**Canales de contacto:** email `info@miradorpropiedades.cl` · teléfono y WhatsApp `+56 9 8804 0592` · Instagram, Facebook y TikTok como `@miradorpropiedades`.

---

## 2. Origen del proyecto

El sitio reemplazó un portal genérico que no representaba la identidad boutique de la corredora ni permitía gestionar el catálogo de forma autónoma.

**Objetivos del reemplazo:**

- Identidad visual propia y editorial, no de plantilla
- Panel de administración autónomo: publicar sin depender de un desarrollador
- Gestión integrada de consultas y leads
- SEO técnico sólido desde la base: sitemap dinámico, metadatos por página, Open Graph
- Stack moderno y mantenible a largo plazo

Desarrollado como encargo freelance para la corredora.

---

## 3. Alcance entregado

| Bloque | Estado |
|---|---|
| Sitio público completo (home, catálogo, ficha, servicios, nosotros, contacto, 404) | ✅ En producción |
| Buscador y filtros con estado en la URL | ✅ |
| Galería con lightbox | ✅ |
| Video de recorrido (YouTube / Vimeo) | ✅ |
| Mapa de ubicación referencial | ✅ |
| Captación de leads: formulario + WhatsApp + email transaccional | ✅ |
| Panel de administración con CRUD completo | ✅ |
| Subida de imágenes con compresión y almacenamiento propio | ✅ |
| Geolocalización asistida por enlace de Google Maps o pin | ✅ |
| Bandeja de consultas | ✅ Listado; sin gestión de estado leído/no leído |
| SEO técnico (sitemap, robots, metadatos, OG) | ✅ |
| Accesibilidad (skip-link, foco visible, alt obligatorio, reduced-motion) | ✅ |
| Fotografía propia en secciones editoriales | ⏳ Parcial: el hero usa imagen real; home y servicios aún con stock |
| Analítica de conversión | ⏳ No implementada |
| Suite de tests automatizados | ⏳ No implementada |

El detalle funcional exhaustivo está en el [README, sección 3](README.md#3-funcionalidades); las limitaciones conocidas, en la [sección 17](README.md#17-limitaciones-conocidas-y-deuda-técnica).

---

## 4. URLs y accesos

| Entorno | URL | Notas |
|---|---|---|
| Producción — sitio | https://www.miradorpropiedades.cl | Live |
| Producción — admin | https://www.miradorpropiedades.cl/admin | Requiere login; `noindex` |
| CDN de imágenes | https://img.miradorpropiedades.cl | Cloudflare R2 con dominio propio |
| Local — sitio | http://localhost:3000 | |
| Local — admin | http://localhost:3000/admin/login | |

Las credenciales de administración y las API keys **no se documentan en el repositorio**. Se gestionan en el panel de variables de entorno de Vercel y en el gestor de contraseñas del cliente. El procedimiento de rotación está en [docs/OPERACION.md, sección 6](docs/OPERACION.md#6-rotación-de-credenciales).

---

## 5. Servicios contratados

| Servicio | Función | Consideraciones de costo |
|---|---|---|
| **Vercel** | Hosting, CDN y build de la aplicación | Plan Hobby suficiente para el tráfico actual. Límite de 4 MB por request en route handlers, que condiciona el tope de subida de imágenes |
| **Neon** | PostgreSQL serverless | Puede suspender la base por inactividad en el plan gratuito: la primera visita tras un período largo sin tráfico es más lenta |
| **Cloudflare R2** | Almacenamiento de imágenes | Elegido por **egreso gratuito**: servir muchas fotos no genera costo de transferencia |
| **Resend** | Email transaccional de consultas | Requiere dominio verificado (SPF/DKIM) |
| **Cloudflare DNS** | Gestión de dominio | `miradorpropiedades.cl` → Vercel · `img.` → R2 |
| **OpenStreetMap** | Tiles de mapas | Sin cuenta ni costo |

Ninguno de estos servicios está acoplado de forma irreversible: R2 usa la API S3 estándar, la base es PostgreSQL puro con migraciones versionadas y la app puede desplegarse en cualquier host con soporte de Node.

---

## 6. Identidad y contenidos

**Paleta.** Negro tinta, marfil y un rojo de acento (`#c8102e`) tomado del techo del logotipo.

**Tipografía.** Cormorant Garamond para titulares (con cursivas de acento) y Montserrat para cuerpo e interfaz.

**Tono editorial.** Textos en primera persona plural, frases cortas, sin jerga inmobiliaria genérica. Los titulares combinan una línea recta y una en cursiva («Conocemos el sur *porque vivimos aquí*»), patrón que se repite en todo el sitio.

**Material de referencia.** La carpeta `referencias/` conserva la guía de estilo y los logotipos originales entregados por el cliente.

**Cifras publicadas en el home:** retiradas en septiembre de 2026 a pedido de la dueña. La franja incluía "6 comunas de cobertura", que restringía la percepción del área de trabajo.

**Fotografía pendiente.** El home y `/servicios` aún usan imágenes de Unsplash como marcador. El componente `HeroCarousel` ya está preparado para rotar entre 3 y 5 fotografías propias; hoy muestra una sola imagen real. En `/nosotros` se retiró la foto de stock: ahora se muestra un placeholder explícito ("Foto pendiente") en vez de una imagen genérica, a la espera de la foto real de la corredora.

---

## 7. Historial de desarrollo

| Fecha | Hito |
|---|---|
| 2026-05-19 | Versión 1: sitio público completo, panel de administración, modelo de datos y despliegue inicial |
| 2026-05-19 | Rediseño de la tarjeta de propiedad: legibilidad del título, línea de acento en hover y feedback de carga al hacer clic |
| 2026-06-27 | Subida de imágenes por *drag & drop* a Cloudflare R2 desde el admin |
| 2026-06-27 | Separación de la configuración de Auth.js para compatibilidad con Edge Runtime |
| 2026-06-27 | Ubicación con mapa interactivo y resolución de enlaces de Google Maps |
| 2026-06-27 | Navegación instantánea: esqueletos de carga, streaming con Suspense y barra de progreso |
| 2026-06-27 | Endurecimiento del repositorio para publicación (secretos fuera del control de versiones, seed sin contraseña por defecto) |
| 2026-07-06 | Nuevo tipo de propiedad `COMERCIAL` |
| 2026-07-18 | Carrusel de portada, comunas dinámicas en los buscadores y enlaces a redes sociales |
| 2026-07-19 | Soporte de video de recorrido (YouTube y Vimeo) con carga diferida |
| 2026-08-10 | Reescritura de la documentación: README profesional + documentación técnica y de operación |
| 2026-09-12 | `/nosotras`: se retira la foto de stock de Unsplash y se reemplaza por un placeholder explícito ("Foto pendiente") mientras se recibe la fotografía real de la corredora |
| 2026-09-12 | Ronda de ajustes pedida por la dueña: logo más grande; correo bajo el teléfono en el header; botón flotante de WhatsApp; `/nosotras` pasa a `/nosotros` (con redirección permanente); catálogo sin encabezado editorial y sin filtros de dormitorios, baños ni estado; selectores de tipo y comuna más grandes; "tasación referencial" pasa a "evaluación comercial"; se retiran la franja de cifras, el bloque "Conocemos el sur", las tarjetas del teaser de servicios y las secciones "Lo que defendemos", "Nuestra filosofía" y el CTA "Conversemos" |

---

## 8. Estado actual y próximos pasos

El sitio está **en producción y operativo**. La corredora publica y edita el catálogo de forma autónoma, y las consultas llegan tanto a la bandeja del panel como al correo.

**Prioridades sugeridas**, en orden de valor por esfuerzo:

1. Cerrar el ciclo de consultas en el panel: marcar como leída, filtrar y ver el contador de pendientes.
2. Reemplazar la fotografía de stock por material propio y activar el carrusel con varias imágenes.
3. Limpieza de imágenes huérfanas en R2.
4. Datos estructurados JSON-LD en las fichas para resultados enriquecidos en Google.
5. Analítica de conversión: qué propiedades generan consultas (los datos ya se guardan en `Inquiry`).

El detalle técnico de cada punto está en [docs/ARQUITECTURA.md, sección 18](docs/ARQUITECTURA.md#18-evolución-sugerida).

---

## 9. Índice de documentación

| Documento | Para qué |
|---|---|
| [README.md](README.md) | Visión general, stack, arquitectura, modelo de datos, seguridad, puesta en marcha y despliegue |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Referencia técnica profunda: flujos, contratos de módulos, decisiones de arquitectura |
| [docs/OPERACION.md](docs/OPERACION.md) | Runbook: despliegue, migraciones, credenciales, respaldos, incidencias y guía de uso del panel |
| **PROYECTO.md** (este documento) | Contexto de negocio, alcance, servicios contratados e historial |
