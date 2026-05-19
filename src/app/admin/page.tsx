import Link from "next/link";
import { Building2, Inbox, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard · Admin", robots: { index: false } };

export default async function AdminDashboard() {
  const [counts, recentInquiries] = await Promise.all([
    prisma.property.groupBy({ by: ["status"], _count: { _all: true } }).catch(() => []),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { property: { select: { title: true, slug: true } } } }).catch(() => []),
  ]);

  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c._count._all])) as Record<string, number>;
  const total = counts.reduce((acc, c) => acc + c._count._all, 0);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = await prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }).catch(() => 0);

  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <h1 className="font-display text-3xl tracking-tight2">Dashboard</h1>
      <p className="text-muted mt-1">Resumen del estado del sitio.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Disponibles" value={byStatus.DISPONIBLE ?? 0} icon={<Building2 size={16} aria-hidden />} />
        <Stat label="Reservadas" value={byStatus.RESERVADA ?? 0} icon={<Building2 size={16} aria-hidden />} />
        <Stat label="Cerradas" value={(byStatus.VENDIDA ?? 0) + (byStatus.ARRENDADA ?? 0)} icon={<BarChart3 size={16} aria-hidden />} />
        <Stat label="Consultas 7d" value={recentCount} icon={<Inbox size={16} aria-hidden />} />
      </div>

      <p className="mt-2 text-xs text-muted">Total propiedades: {total}</p>

      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl">Últimas consultas</h2>
          <Link href="/admin/inquiries" className="text-sm hover:underline">Ver todas</Link>
        </div>
        <ul className="divide-y divide-border border border-border rounded">
          {recentInquiries.length === 0 && (
            <li className="p-4 text-sm text-muted">Sin consultas todavía.</li>
          )}
          {recentInquiries.map((q) => (
            <li key={q.id} className="p-4 grid md:grid-cols-[1fr,auto] gap-2">
              <div>
                <p className="font-medium">{q.name} <span className="text-muted font-normal">— {q.email}</span></p>
                {q.property && (
                  <p className="text-xs text-muted mt-0.5">
                    Sobre <Link href={`/propiedades/${q.property.slug}`} className="underline">{q.property.title}</Link>
                  </p>
                )}
                <p className="mt-1 text-sm text-pretty line-clamp-2">{q.message}</p>
              </div>
              <time className="text-xs text-muted self-start">{new Date(q.createdAt).toLocaleString("es-CL")}</time>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/propiedades/nueva" className="inline-flex items-center h-10 px-4 rounded bg-fg text-bg hover:bg-fg/85 text-sm">Nueva propiedad</Link>
          <Link href="/admin/propiedades" className="inline-flex items-center h-10 px-4 rounded border border-fg hover:bg-fg hover:text-bg text-sm">Gestionar propiedades</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded border border-border bg-bg p-4">
      <p className="text-xs uppercase tracking-wide text-muted inline-flex items-center gap-1.5">{icon} {label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
