import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const to = process.env.CONTACT_EMAIL_TO ?? "alejandra@miradorpropiedades.cl";
const from = process.env.CONTACT_EMAIL_FROM ?? "contacto@miradorpropiedades.cl";

export async function sendInquiryEmail(opts: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  propertyTitle?: string | null;
  propertyUrl?: string | null;
}) {
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured; skipping send.");
    return { ok: false, reason: "no-api-key" as const };
  }

  const resend = new Resend(apiKey);
  const subject = opts.propertyTitle
    ? `Nueva consulta · ${opts.propertyTitle}`
    : "Nueva consulta desde el sitio";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0a0a0a;line-height:1.6;">
      <h2 style="margin:0 0 16px;font-weight:500;">Nueva consulta</h2>
      ${opts.propertyTitle ? `<p><strong>Propiedad:</strong> ${escape(opts.propertyTitle)}${opts.propertyUrl ? ` (<a href="${opts.propertyUrl}">ver</a>)` : ""}</p>` : ""}
      <p><strong>Nombre:</strong> ${escape(opts.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escape(opts.email)}">${escape(opts.email)}</a></p>
      ${opts.phone ? `<p><strong>Teléfono:</strong> ${escape(opts.phone)}</p>` : ""}
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-wrap;border-left:2px solid #e5e5e5;padding-left:12px;">${escape(opts.message)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to,
    replyTo: opts.email,
    subject,
    html,
  });

  return { ok: !result.error, reason: result.error?.message };
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
