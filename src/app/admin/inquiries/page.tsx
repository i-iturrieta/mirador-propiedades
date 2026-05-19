import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Consultas · Admin", robots: { index: false } };

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry
    .findMany({
      orderBy: { createdAt: "desc" },
      include: { property: { select: { title: true, slug: true } } },
    })
    .catch(() => []);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-3xl tracking-tight2">Consultas</h1>
      <p className="text-muted mt-1">Listado completo de mensajes recibidos.</p>

      <ul className="mt-10 divide-y divide-border border border-border rounded">
        {inquiries.length === 0 && (
          <li className="p-6 text-sm text-muted text-center">Sin consultas recibidas todavía.</li>
        )}
        {inquiries.map((q) => (
          <li key={q.id} className="p-5 grid md:grid-cols-[1fr,260px] gap-4">
            <div>
              <p className="font-medium">
                {q.name}
                <span className="text-muted font-normal"> — </span>
                <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a>
                {q.phone && <span className="text-muted font-normal"> · <a href={`tel:${q.phone}`} className="hover:underline">{q.phone}</a></span>}
              </p>
              {q.property && (
                <p className="text-xs text-muted mt-1">
                  Sobre <Link href={`/propiedades/${q.property.slug}`} className="underline">{q.property.title}</Link>
                </p>
              )}
              <p className="mt-3 text-sm whitespace-pre-line text-pretty">{q.message}</p>
            </div>
            <div className="text-xs text-muted md:text-right">
              <time>{new Date(q.createdAt).toLocaleString("es-CL")}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
