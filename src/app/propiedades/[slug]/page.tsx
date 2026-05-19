import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble, Bath, Car, Box, Ruler, Trees, MapPin, ArrowLeft, ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Gallery } from "@/components/property/Gallery";
import { PropertyDetailMap } from "@/components/property/PropertyDetailMap";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PriceTag } from "@/components/property/PriceTag";
import { StatusBadge } from "@/components/property/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { formatArea, formatNumber, labelOperation, labelType } from "@/lib/formatters";

export const revalidate = 300;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
    });
    if (!property) return { title: "Propiedad no encontrada" };
    return {
      title: property.title,
      description: property.description.slice(0, 160),
      openGraph: {
        title: property.title,
        description: property.description.slice(0, 160),
        images: property.images[0] ? [property.images[0].url] : undefined,
      },
    };
  } catch {
    return { title: "Propiedad" };
  }
}

export default async function PropertyDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const property = await prisma.property
    .findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    })
    .catch((e) => {
      console.warn("[detalle] DB unavailable", e);
      return null;
    });

  if (!property) notFound();

  const similar = await prisma.property
    .findMany({
      where: {
        id: { not: property.id },
        type: property.type,
        status: { in: ["DISPONIBLE", "RESERVADA"] },
      },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
    .catch(() => []);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.miradorpropiedades.cl";
  const propertyUrl = `${siteUrl}/propiedades/${property.slug}`;

  return (
    <>
      {/* Breadcrumb + back */}
      <div className="pt-28 lg:pt-36 pb-6 border-b border-border bg-bg-tint">
        <div className="container-ultra flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Migas de pan" className="text-xs tracking-[0.18em] uppercase text-muted flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-fg transition-colors">Inicio</Link>
            <ChevronRight size={12} strokeWidth={1.5} className="text-muted-2" />
            <Link href="/propiedades" className="hover:text-fg transition-colors">Propiedades</Link>
            <ChevronRight size={12} strokeWidth={1.5} className="text-muted-2" />
            <span className="text-fg max-w-[24ch] truncate normal-case tracking-normal">
              {property.title}
            </span>
          </nav>
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-muted hover:text-fg transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} className="transition-transform duration-500 ease-out group-hover:-translate-x-0.5" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <div className="container-ultra py-8 lg:py-10">
        <Gallery images={property.images} title={property.title} />
      </div>

      {/* Title + price strip */}
      <div className="container-ultra pb-12">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" size="md">{labelOperation(property.operation)}</Badge>
            <Badge variant="muted" size="md">{labelType(property.type)}</Badge>
            <StatusBadge status={property.status} />
          </div>

          <div className="mt-8 grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="display-lg text-balance">{property.title}</h1>
              <p className="mt-4 inline-flex items-center gap-2 text-muted text-base">
                <MapPin size={14} strokeWidth={1.5} aria-hidden />
                {property.city}
                {property.sector ? ` · ${property.sector}` : ""}
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <PriceTag
                price={property.price.toString()}
                currency={property.currency}
                size="lg"
                withLabel
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Main detail grid */}
      <div className="container-ultra pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            {/* Specs row */}
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 border-y border-border py-8 lg:py-10">
                <Spec icon={<BedDouble size={18} strokeWidth={1.5} />} label="Dormitorios" value={formatNumber(property.bedrooms)} />
                <Spec icon={<Bath size={18} strokeWidth={1.5} />} label="Baños" value={formatNumber(property.bathrooms)} />
                <Spec icon={<Car size={18} strokeWidth={1.5} />} label="Estacionamientos" value={formatNumber(property.parking)} />
                <Spec icon={<Ruler size={18} strokeWidth={1.5} />} label="Construidos" value={formatArea(property.builtArea)} />
                <Spec icon={<Trees size={18} strokeWidth={1.5} />} label="Terreno" value={formatArea(property.landArea)} />
                <Spec icon={<Box size={18} strokeWidth={1.5} />} label="Bodega" value={property.storage ? "Sí" : "No"} />
              </div>
            </Reveal>

            <Reveal>
              <section aria-labelledby="descripcion-heading" className="mt-14">
                <p className="eyebrow">La propiedad</p>
                <h2 id="descripcion-heading" className="mt-6 display-md text-balance">
                  Sobre <span className="display-italic">este lugar</span>
                </h2>
                <div className="mt-8 max-w-prose text-pretty whitespace-pre-line text-fg/85 text-base lg:text-lg leading-relaxed">
                  {property.description}
                </div>
              </section>
            </Reveal>

            {property.lat != null && property.lng != null && (
              <Reveal>
                <section aria-labelledby="ubicacion-heading" className="mt-16 lg:mt-20">
                  <p className="eyebrow">Ubicación</p>
                  <h2 id="ubicacion-heading" className="mt-6 display-md">Dónde está</h2>
                  <p className="mt-3 text-muted max-w-prose">
                    Ubicación referencial. Los detalles exactos se comparten al coordinar la visita.
                  </p>
                  <div className="mt-6 overflow-hidden rounded-sm border border-border">
                    <PropertyDetailMap lat={property.lat} lng={property.lng} label={property.title} />
                  </div>
                </section>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="bg-bg-tint border border-border p-7 lg:p-8 rounded-sm">
                <p className="eyebrow">Consultar</p>
                <h2 className="mt-4 font-display text-2xl lg:text-3xl tracking-tight2 text-balance">
                  ¿Te interesa? <br />
                  <span className="display-italic">Conversemos.</span>
                </h2>
                <p className="text-sm text-muted mt-3">
                  Te responde directamente la corredora, en menos de un día hábil.
                </p>
                <div className="mt-7">
                  <ContactForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyUrl={propertyUrl}
                    compact
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section
          className="border-t border-border py-20 lg:py-28"
          aria-labelledby="similar-heading"
        >
          <div className="container-ultra">
            <Reveal>
              <p className="eyebrow">También podrían interesarte</p>
              <h2
                id="similar-heading"
                className="mt-6 display-md text-balance"
              >
                Propiedades <span className="display-italic">similares</span>
              </h2>
            </Reveal>
            <Reveal stagger className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-16">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div>
      <div className="text-muted">{icon}</div>
      <dt className="mt-3 text-[10px] tracking-[0.22em] uppercase text-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl lg:text-2xl tracking-tight2">{value}</dd>
    </div>
  );
}
