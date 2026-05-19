import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PropertyForm } from "@/components/forms/PropertyForm";

export const metadata = { title: "Nueva propiedad · Admin", robots: { index: false } };

export default function NewPropertyPage() {
  return (
    <div className="p-8 lg:p-12">
      <Link href="/admin/propiedades" className="text-sm text-muted hover:text-fg inline-flex items-center gap-1 mb-4">
        <ChevronLeft size={14} aria-hidden /> Volver
      </Link>
      <h1 className="font-display text-3xl tracking-tight2 mb-8">Nueva propiedad</h1>
      <PropertyForm mode="create" />
    </div>
  );
}
