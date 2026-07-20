import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/forms/PropertyForm";

export const metadata = { title: "Editar propiedad · Admin", robots: { index: false } };

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!property) notFound();

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/propiedades" className="text-sm text-muted hover:text-fg inline-flex items-center gap-1">
          <ChevronLeft size={14} aria-hidden /> Volver
        </Link>
        <Link href={`/propiedades/${property.slug}`} className="text-sm text-muted hover:text-fg inline-flex items-center gap-1" target="_blank">
          Ver en sitio público <ExternalLink size={14} aria-hidden />
        </Link>
      </div>

      <h1 className="font-display text-3xl tracking-tight2 mb-2">Editar propiedad</h1>
      <p className="text-sm text-muted mb-8">{property.title}</p>

      {sp.ok === "updated" && (
        <p className="mb-6 rounded border border-border bg-surface px-4 py-2 text-sm">Cambios guardados correctamente.</p>
      )}
      {sp.ok === "created" && (
        <p className="mb-6 rounded border border-border bg-surface px-4 py-2 text-sm">Propiedad creada correctamente.</p>
      )}

      <PropertyForm
        mode="edit"
        id={property.id}
        defaultValues={{
          title: property.title,
          operation: property.operation,
          type: property.type,
          status: property.status,
          price: Number(property.price),
          currency: property.currency,
          city: property.city,
          sector: property.sector ?? "",
          address: property.address ?? "",
          lat: property.lat ?? undefined,
          lng: property.lng ?? undefined,
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          parking: property.parking ?? undefined,
          storage: property.storage,
          builtArea: property.builtArea ?? undefined,
          landArea: property.landArea ?? undefined,
          description: property.description,
          featured: property.featured,
          videoUrl: property.videoUrl ?? "",
          images: property.images.map(({ url, alt }) => ({ url, alt })),
        }}
      />
    </div>
  );
}
