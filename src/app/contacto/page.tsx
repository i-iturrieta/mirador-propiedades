import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Instagram } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappDisplay, buildWhatsAppUrl } from "@/lib/whatsapp";
import { CONTACT_EMAIL, CONTACT_PHONE_HREF } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cuéntanos qué necesitas. Atendemos por teléfono, WhatsApp y email en el sur de Chile.",
};

export default function ContactPage() {
  const waUrl = buildWhatsAppUrl(
    "Hola, me gustaría conversar sobre asesoría inmobiliaria.",
  );

  return (
    <>
      <header className="pt-32 lg:pt-44 pb-12 lg:pb-16 bg-bg-tint border-b border-border">
        <div className="container-ultra">
          <Reveal>
            <p className="eyebrow">Contacto</p>
            <h1 className="mt-6 display-xl text-balance max-w-3xl">
              Cuéntanos <br />
              <span className="display-italic">qué necesitas.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      <section className="container-ultra pt-20 lg:pt-28 pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="text-muted max-w-prose text-pretty text-base lg:text-lg leading-relaxed">
              Respondemos en menos de un día hábil. Si prefieres, escríbenos directo por WhatsApp y
              coordinamos una llamada.
            </p>

            {/* El correo va inmediatamente debajo del número telefónico */}
            <ul className="mt-12 space-y-7">
              <ContactItem
                icon={<Phone size={16} strokeWidth={1.5} />}
                label="Teléfono"
                value={whatsappDisplay}
                href={CONTACT_PHONE_HREF}
              />
              <ContactItem
                icon={<Mail size={16} strokeWidth={1.5} />}
                label="Email"
                value={CONTACT_EMAIL}
                href={`mailto:${CONTACT_EMAIL}`}
              />
              <ContactItem
                icon={<MessageCircle size={16} strokeWidth={1.5} />}
                label="WhatsApp"
                value="Coordina una llamada"
                href={waUrl}
                external
              />
              <ContactItem
                icon={<Instagram size={16} strokeWidth={1.5} />}
                label="Instagram"
                value="@miradorpropiedades"
                href="https://www.instagram.com/miradorpropiedades/"
                external
              />
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={150}>
            <div className="bg-bg-tint border border-border p-8 lg:p-12 rounded-sm">
              <p className="eyebrow">Formulario</p>
              <h2 className="mt-4 font-display text-3xl lg:text-4xl tracking-tight2">
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-muted mt-2">
                Los campos marcados con * son obligatorios.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon, label, value, href, external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted group-hover:border-fg group-hover:text-fg transition-colors duration-500 rounded-sm">
        {icon}
      </span>
      <span className="block">
        <span className="block text-[10px] tracking-[0.22em] uppercase text-muted">{label}</span>
        <span className="block mt-1 text-fg">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group inline-flex items-start gap-4 transition-colors"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className="inline-flex items-start gap-4">{content}</li>
  );
}
