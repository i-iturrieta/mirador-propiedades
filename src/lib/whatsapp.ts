const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "56988040592";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function propertyInquiryMessage(opts: {
  title: string;
  url: string;
}): string {
  return `Hola, vi en el sitio la propiedad "${opts.title}" y me gustaría recibir más información.\n\n${opts.url}`;
}

export const whatsappNumber = number;
export const whatsappDisplay = `+${number.slice(0, 2)} ${number.slice(2, 3)} ${number.slice(3, 7)} ${number.slice(7)}`;
