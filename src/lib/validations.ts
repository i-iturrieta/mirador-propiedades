import { z } from "zod";
import { parseVideoUrl } from "@/lib/video";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Indica tu nombre").max(80),
  email: z.string().email("Email inválido"),
  phone: z.string().max(30).optional().or(z.literal("")),
  message: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(2000),
  propertyId: z.string().cuid().optional().nullable(),
  propertyTitle: z.string().optional().nullable(),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const propertyFormSchema = z.object({
  title: z.string().min(5).max(160),
  operation: z.enum(["VENTA", "ARRIENDO"]),
  type: z.enum(["CASA", "DEPARTAMENTO", "PARCELA", "TERRENO", "OFICINA", "COMERCIAL"]),
  status: z.enum(["DISPONIBLE", "RESERVADA", "ARRENDADA", "VENDIDA"]),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  currency: z.enum(["CLP", "UF"]),
  city: z.string().min(2).max(80),
  sector: z.string().max(120).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
  bedrooms: z.coerce.number().int().min(0).max(20).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).max(20).optional().nullable(),
  parking: z.coerce.number().int().min(0).max(20).optional().nullable(),
  storage: z.coerce.boolean().default(false),
  builtArea: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  landArea: z.coerce.number().int().min(0).max(10000000).optional().nullable(),
  description: z.string().min(20).max(5000),
  featured: z.coerce.boolean().default(false),
  videoUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || parseVideoUrl(v) !== null, {
      message: "Pega un enlace válido de YouTube o Vimeo",
    }),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().min(3, "El texto alternativo es obligatorio para accesibilidad"),
      }),
    )
    .min(1, "Sube al menos una imagen"),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;
