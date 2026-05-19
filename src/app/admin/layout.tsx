import Link from "next/link";
import { LogOut, Home, Building2, Inbox } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Admin · Mirador Propiedades", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-bg-tint">
      {session?.user && (
        <aside className="w-64 shrink-0 border-r border-border bg-bg hidden md:flex flex-col">
          <div className="px-6 py-7 border-b border-border">
            <Logo size="sm" />
            <p className="mt-4 text-xs text-muted truncate">{session.user.email}</p>
          </div>
          <nav className="p-3 flex-1 space-y-1 text-sm">
            <AdminLink href="/admin" icon={<Home size={15} strokeWidth={1.5} />}>Dashboard</AdminLink>
            <AdminLink href="/admin/propiedades" icon={<Building2 size={15} strokeWidth={1.5} />}>Propiedades</AdminLink>
            <AdminLink href="/admin/inquiries" icon={<Inbox size={15} strokeWidth={1.5} />}>Consultas</AdminLink>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="p-4 border-t border-border"
          >
            <button className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors">
              <LogOut size={14} strokeWidth={1.5} /> Cerrar sesión
            </button>
          </form>
        </aside>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function AdminLink({
  href, icon, children,
}: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-bg-tint text-fg/85 hover:text-fg transition-colors"
    >
      {icon} <span>{children}</span>
    </Link>
  );
}
