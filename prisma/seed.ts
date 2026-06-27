import { PrismaClient, Operation, PropertyType, PropertyStatus, Currency } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

type SeedProperty = {
  title: string;
  operation: Operation;
  type: PropertyType;
  status?: PropertyStatus;
  price: number;
  currency: Currency;
  city: string;
  sector?: string;
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  storage?: boolean;
  builtArea?: number;
  landArea?: number;
  description: string;
  featured?: boolean;
  images: { url: string; alt: string }[];
};

const properties: SeedProperty[] = [
  {
    title: "Casa en parcela, Condominio Praderas de Frutillar",
    operation: Operation.VENTA,
    type: PropertyType.CASA,
    price: 10000,
    currency: Currency.UF,
    city: "Frutillar",
    sector: "Praderas de Frutillar",
    lat: -41.1247,
    lng: -73.0408,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    storage: true,
    builtArea: 176,
    landArea: 5000,
    featured: true,
    description:
      "Hermosa casa estilo campo en condominio cerrado. Construcción de 176 m² sobre parcela de 5.000 m² con bosque nativo, vista despejada y total privacidad. Living comedor con estufa a leña, cocina equipada, 4 dormitorios (master en suite), 3 baños y logia. Acceso pavimentado, agua de pozo profundo y luz trifásica.",
    images: [
      { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600", alt: "Frente de casa rural con techo a dos aguas en Frutillar" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600", alt: "Living comedor con ventanal y estufa a leña" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600", alt: "Cocina equipada en isla con mesón de madera" },
    ],
  },
  {
    title: "Propiedad en Fresia, Los Lagos",
    operation: Operation.VENTA,
    type: PropertyType.CASA,
    price: 210000000,
    currency: Currency.CLP,
    city: "Fresia",
    lat: -41.1372,
    lng: -73.4011,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    builtArea: 160,
    landArea: 7400,
    featured: true,
    description:
      "Excelente propiedad familiar en Fresia, 7.400 m² de terreno con frutales y huerta. Casa de 160 m² con tres dormitorios, dos baños, sala de estar con chimenea y galería vidriada con vista al campo. Bodega independiente y portón eléctrico.",
    images: [
      { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600", alt: "Casa rural blanca con jardín amplio" },
      { url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600", alt: "Galería vidriada con vista al campo" },
    ],
  },
  {
    title: "Condominio Alto Colonos, Frutillar",
    operation: Operation.VENTA,
    type: PropertyType.PARCELA,
    price: 3650,
    currency: Currency.UF,
    city: "Frutillar",
    sector: "Alto Colonos",
    lat: -41.1209,
    lng: -73.0512,
    landArea: 5000,
    featured: true,
    description:
      "Sitio de 5.000 m² en condominio Alto Colonos, una de las zonas más cotizadas de Frutillar. Acceso pavimentado, electrificación, deslindes plantados y reglamento interno que protege la plusvalía. Ideal para construir tu hogar de descanso o residencia permanente.",
    images: [
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600", alt: "Vista del terreno boscoso con cordillera al fondo" },
    ],
  },
  {
    title: "Casa amplia en Espacio Frutillar",
    operation: Operation.ARRIENDO,
    type: PropertyType.CASA,
    price: 1000000,
    currency: Currency.CLP,
    city: "Frutillar",
    sector: "Espacio Frutillar",
    lat: -41.1310,
    lng: -73.0438,
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    builtArea: 180,
    landArea: 5000,
    featured: true,
    description:
      "Casa familiar en arriendo anual en sector Espacio Frutillar. 4 dormitorios, 2 baños, living con doble altura y vista al volcán Osorno. Cocina equipada, calefacción central y patio con quincho.",
    images: [
      { url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1600", alt: "Living luminoso con doble altura y vista al volcán" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600", alt: "Patio con quincho y mesa de madera" },
    ],
  },
  {
    title: "Departamento Parque Ivian, Puerto Varas",
    operation: Operation.ARRIENDO,
    type: PropertyType.DEPARTAMENTO,
    status: PropertyStatus.ARRENDADA,
    price: 1300000,
    currency: Currency.CLP,
    city: "Puerto Varas",
    sector: "Parque Ivian",
    lat: -41.3206,
    lng: -72.9858,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    storage: true,
    builtArea: 110,
    description:
      "Departamento en arriendo en exclusivo edificio Parque Ivian de Puerto Varas. Vista al lago Llanquihue, 3 dormitorios, 3 baños, terraza, estacionamiento doble y bodega. Edificio con conserjería 24/7 y gimnasio.",
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600", alt: "Terraza con vista al lago Llanquihue" },
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600", alt: "Dormitorio principal con ventanal" },
    ],
  },
  {
    title: "Departamento en Llanquihue",
    operation: Operation.ARRIENDO,
    type: PropertyType.DEPARTAMENTO,
    status: PropertyStatus.ARRENDADA,
    price: 500000,
    currency: Currency.CLP,
    city: "Llanquihue",
    lat: -41.2589,
    lng: -73.0258,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    builtArea: 78,
    description:
      "Departamento céntrico de 3 dormitorios en Llanquihue. Excelente conectividad con Puerto Varas y Puerto Montt. Edificio nuevo, con ascensor y estacionamiento techado.",
    images: [
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600", alt: "Sala de estar moderna con ventanal" },
    ],
  },
  {
    title: "Terreno con vista al lago, Puerto Varas",
    operation: Operation.VENTA,
    type: PropertyType.TERRENO,
    price: 8500,
    currency: Currency.UF,
    city: "Puerto Varas",
    sector: "Camino a Ensenada",
    lat: -41.2997,
    lng: -72.9542,
    landArea: 10000,
    featured: false,
    description:
      "Espectacular terreno de 1 hectárea con vista panorámica al lago Llanquihue y volcán Osorno. A 12 km del centro de Puerto Varas por camino pavimentado. Apto para residencia o subdivisión.",
    images: [
      { url: "https://images.unsplash.com/photo-1487884701036-ab2db17f04b9?w=1600", alt: "Vista panorámica al lago Llanquihue y volcán Osorno" },
    ],
  },
  {
    title: "Oficina comercial en centro de Puerto Montt",
    operation: Operation.ARRIENDO,
    type: PropertyType.OFICINA,
    price: 650000,
    currency: Currency.CLP,
    city: "Puerto Montt",
    sector: "Centro",
    lat: -41.4693,
    lng: -72.9424,
    parking: 2,
    builtArea: 95,
    description:
      "Oficina de 95 m² en edificio corporativo del centro de Puerto Montt. Recepción, sala de reuniones, 3 boxes privados y kitchenette. Dos estacionamientos. Ideal estudio profesional o representación comercial.",
    images: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600", alt: "Sala de reuniones con mesa larga y ventanal urbano" },
    ],
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "alejandra@miradorpropiedades.cl";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD no está definida. Configúrala en .env antes de ejecutar el seed.",
    );
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Alejandra", passwordHash },
  });

  console.log(`Admin user ready (${adminEmail})`);

  for (const p of properties) {
    const slug = slugify(p.title, { lower: true, strict: true });
    const data = {
      slug,
      title: p.title,
      operation: p.operation,
      type: p.type,
      status: p.status ?? PropertyStatus.DISPONIBLE,
      price: p.price,
      currency: p.currency,
      city: p.city,
      sector: p.sector ?? null,
      lat: p.lat ?? null,
      lng: p.lng ?? null,
      bedrooms: p.bedrooms ?? null,
      bathrooms: p.bathrooms ?? null,
      parking: p.parking ?? null,
      storage: p.storage ?? false,
      builtArea: p.builtArea ?? null,
      landArea: p.landArea ?? null,
      description: p.description,
      featured: p.featured ?? false,
    };

    await prisma.property.upsert({
      where: { slug },
      update: {
        ...data,
        images: {
          deleteMany: {},
          create: p.images.map((img, i) => ({ url: img.url, alt: img.alt, order: i })),
        },
      },
      create: {
        ...data,
        images: { create: p.images.map((img, i) => ({ url: img.url, alt: img.alt, order: i })) },
      },
    });
  }

  console.log(`Seeded ${properties.length} properties.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
