import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Ingresar · Admin", robots: { index: false } };

async function signInAction(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/admin/login?error=${error.type}`);
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const session = await auth();
  const sp = await searchParams;
  const callback = sp.callbackUrl;
  const safeCallback =
    callback && callback.startsWith("/") && !callback.startsWith("//")
      ? callback
      : "/admin";
  if (session?.user) redirect(safeCallback);

  return (
    <div className="min-h-screen grid place-items-center bg-bg-tint px-4 py-12">
      <div className="w-full max-w-md bg-bg border border-border rounded-sm p-10 shadow-soft">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>
        <h1 className="mt-8 font-display text-3xl tracking-tight2 text-center">
          Acceso administradoras
        </h1>
        <p className="text-sm text-muted mt-2 text-center">
          Ingresa tus credenciales para gestionar el sitio.
        </p>

        <form action={signInAction} className="mt-10 grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {sp.error && (
            <p className="text-sm text-accent">Credenciales inválidas. Intenta de nuevo.</p>
          )}
          <button
            type="submit"
            className="group mt-2 inline-flex items-center justify-center gap-3 h-12 px-6 bg-fg text-bg hover:bg-ink text-sm tracking-wide rounded-sm transition-colors duration-500"
          >
            Ingresar
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:translate-x-0.5"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
