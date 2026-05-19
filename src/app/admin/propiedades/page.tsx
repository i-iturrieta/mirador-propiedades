import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, labelOperation, labelStatus, labelType } from "@/lib/formatters";

export const metadata = { title: "Propiedades · Admin", robots: { index: false } };

export default async function AdminPropertiesPage() {
  const properties = await prisma.property
    .findMany({ orderBy: { updatedAt: "desc" }, include: { _count: { select: { inquiries: true } } } })
    .catch(() => []);

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight2">Propiedades</h1>
          <p className="text-muted mt-1">{properties.length} en total.</p>
        </div>
        <Link href="/admin/propiedades/nueva" className="inline-flex items-center gap-2 h-10 px-4 rounded bg-fg text-bg hover:bg-fg/85 text-sm">
          <Plus size={14} /> Nueva propiedad
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
              <th className="py-3 pr-4">Título</th>
              <th className="py-3 pr-4">Operación</th>
              <th className="py-3 pr-4">Tipo</th>
              <th className="py-3 pr-4">Precio</th>
              <th className="py-3 pr-4">Estado</th>
              <th className="py-3 pr-4">Consultas</th>
              <th className="py-3 pr-4 sr-only">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/propiedades/${p.id}`} className="hover:underline font-medium">
                    {p.title}
                  </Link>
                  <div className="text-xs text-muted mt-0.5">{p.city}{p.sector ? ` · ${p.sector}` : ""}</div>
                </td>
                <td className="py-3 pr-4">{labelOperation(p.operation)}</td>
                <td className="py-3 pr-4">{labelType(p.type)}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{formatPrice(p.price.toString(), p.currency)}</td>
                <td className="py-3 pr-4">{labelStatus(p.status)}</td>
                <td className="py-3 pr-4">{p._count.inquiries}</td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/propiedades/${p.id}`} className="inline-flex items-center gap-1 text-muted hover:text-fg">
                    <Pencil size={14} aria-hidden /> Editar
                  </Link>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-muted">Aún no hay propiedades publicadas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
