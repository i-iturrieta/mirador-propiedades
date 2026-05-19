"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations";
import { buildWhatsAppUrl, propertyInquiryMessage } from "@/lib/whatsapp";

type Props = {
  propertyId?: string;
  propertyTitle?: string;
  propertyUrl?: string;
  compact?: boolean;
};

export function ContactForm({
  propertyId,
  propertyTitle,
  propertyUrl,
  compact,
}: Props) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: propertyTitle
        ? `Hola, me interesa la propiedad "${propertyTitle}". Quisiera más información.`
        : "",
      propertyId,
      propertyTitle,
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Error al enviar el mensaje");

      toast.success("Mensaje enviado", {
        description: "Te responderemos lo antes posible.",
      });
      setSubmitted(true);
      reset({
        name: "",
        email: "",
        phone: "",
        message: "",
        propertyId,
        propertyTitle,
        website: "",
      });
    } catch (e) {
      toast.error("No pudimos enviar el mensaje", {
        description: e instanceof Error ? e.message : "Intenta nuevamente.",
      });
    }
  });

  const waUrl =
    propertyTitle && propertyUrl
      ? buildWhatsAppUrl(propertyInquiryMessage({ title: propertyTitle, url: propertyUrl }))
      : buildWhatsAppUrl("Hola, me gustaría recibir asesoría inmobiliaria.");

  return (
    <form onSubmit={onSubmit} className="grid gap-7" noValidate aria-live="polite">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
      />
      <input type="hidden" {...register("propertyId")} />
      <input type="hidden" {...register("propertyTitle")} />

      <div className={compact ? "grid gap-7" : "grid sm:grid-cols-2 gap-7"}>
        <Field>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            autoComplete="name"
            {...register("name")}
            aria-invalid={!!formState.errors.name}
          />
          <FieldError>{formState.errors.name?.message}</FieldError>
        </Field>
        <Field>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!formState.errors.email}
          />
          <FieldError>{formState.errors.email?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <Label htmlFor="phone">
          Teléfono <span className="text-muted-2 normal-case tracking-normal">(opcional)</span>
        </Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        <FieldError>{formState.errors.phone?.message}</FieldError>
      </Field>

      <Field>
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          rows={5}
          {...register("message")}
          aria-invalid={!!formState.errors.message}
        />
        <FieldError>{formState.errors.message?.message}</FieldError>
      </Field>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={formState.isSubmitting || submitted}
          className="group flex-1 inline-flex items-center justify-center gap-3 h-14 px-6 bg-fg text-bg hover:bg-ink text-sm tracking-wide rounded-sm transition-colors duration-500 disabled:opacity-60 disabled:pointer-events-none"
        >
          {formState.isSubmitting ? "Enviando…" : submitted ? "Mensaje enviado" : "Enviar mensaje"}
          {!submitted && (
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:translate-x-0.5"
            />
          )}
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex-1 inline-flex items-center justify-center gap-3 h-14 px-6 bg-[#25D366] text-white hover:bg-[#1ebe5b] text-sm tracking-wide rounded-sm transition-colors duration-500"
        >
          <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
          WhatsApp
        </a>
      </div>
      <p className="text-xs text-muted leading-relaxed">
        Al enviar aceptas que tus datos sean usados únicamente para responder esta consulta.
      </p>
    </form>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}
