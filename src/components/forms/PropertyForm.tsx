"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError, Select } from "@/components/ui/Input";
import { ImageDropzone } from "@/components/forms/ImageDropzone";
import { propertyFormSchema, type PropertyFormInput } from "@/lib/validations";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  resolveMapsLink,
} from "@/app/admin/propiedades/actions";

const LocationPickerMap = dynamic(
  () => import("@/components/property/LocationPickerMap"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 img-skeleton rounded" aria-hidden />,
  },
);

type Props = {
  mode: "create" | "edit";
  id?: string;
  defaultValues?: Partial<PropertyFormInput>;
};

export function PropertyForm({ mode, id, defaultValues }: Props) {
  const [pending, startTransition] = useTransition();
  const [mapsLink, setMapsLink] = useState("");
  const [resolvingLink, setResolvingLink] = useState(false);

  const { register, handleSubmit, control, formState, watch, setValue } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      operation: "VENTA",
      type: "CASA",
      status: "DISPONIBLE",
      currency: "CLP",
      storage: false,
      featured: false,
      images: [],
      ...defaultValues,
    },
  });

  const images = useFieldArray({ control, name: "images" });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        if (mode === "create") await createProperty(data);
        else if (id) await updateProperty(id, data);
      } catch (e) {
        toast.error("No pudimos guardar", {
          description: e instanceof Error ? e.message : "Revisa los datos.",
        });
      }
    });
  });

  const onDelete = () => {
    if (!id) return;
    if (!confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    startTransition(async () => {
      try {
        await deleteProperty(id);
      } catch (e) {
        toast.error("No pudimos eliminar", {
          description: e instanceof Error ? e.message : undefined,
        });
      }
    });
  };

  const setCoords = (lat: number, lng: number) => {
    setValue("lat", lat, { shouldValidate: true, shouldDirty: true });
    setValue("lng", lng, { shouldValidate: true, shouldDirty: true });
  };

  const handleMapsLink = (value: string) => {
    const url = value.trim();
    if (!url) return;
    setResolvingLink(true);
    startTransition(async () => {
      try {
        const coords = await resolveMapsLink(url);
        if (coords) {
          setCoords(coords.lat, coords.lng);
          toast.success("Ubicación tomada del enlace");
        } else {
          toast.error("No pudimos leer ese enlace", {
            description: "Pega el enlace completo de Google Maps o mueve el pin en el mapa.",
          });
        }
      } finally {
        setResolvingLink(false);
      }
    });
  };

  const toNum = (v: unknown): number | null => {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : null;
  };
  const lat = toNum(watch("lat"));
  const lng = toNum(watch("lng"));

  return (
    <form onSubmit={onSubmit} className="grid gap-6 max-w-3xl">
      <Field label="Título" error={formState.errors.title?.message}>
        <Input {...register("title")} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Operación">
          <Select {...register("operation")}>
            <option value="VENTA">Venta</option>
            <option value="ARRIENDO">Arriendo</option>
          </Select>
        </Field>
        <Field label="Tipo">
          <Select {...register("type")}>
            <option value="CASA">Casa</option>
            <option value="DEPARTAMENTO">Departamento</option>
            <option value="PARCELA">Parcela</option>
            <option value="TERRENO">Terreno</option>
            <option value="OFICINA">Oficina</option>
            <option value="COMERCIAL">Comercial</option>
          </Select>
        </Field>
        <Field label="Estado">
          <Select {...register("status")}>
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVADA">Reservada</option>
            <option value="VENDIDA">Vendida</option>
            <option value="ARRENDADA">Arrendada</option>
          </Select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Precio" error={formState.errors.price?.message}>
          <Input type="number" step="0.01" min="0" {...register("price")} />
        </Field>
        <Field label="Moneda">
          <Select {...register("currency")}>
            <option value="CLP">CLP</option>
            <option value="UF">UF</option>
          </Select>
        </Field>
        <Field label="Comuna" error={formState.errors.city?.message}>
          <Input {...register("city")} />
        </Field>
      </div>

      <Field label="Sector"><Input {...register("sector")} /></Field>

      <fieldset className="grid gap-4 border-t border-border pt-6">
        <legend className="text-[11px] tracking-[0.22em] uppercase font-medium text-muted">
          Ubicación
        </legend>

        <Field label="Dirección">
          <Input placeholder="Calle, número, comuna" {...register("address")} />
        </Field>

        <Field label="O pega un enlace de Google Maps">
          <Input
            type="url"
            inputMode="url"
            placeholder="https://maps.app.goo.gl/…"
            value={mapsLink}
            disabled={resolvingLink}
            onChange={(e) => setMapsLink(e.target.value)}
            onBlur={(e) => handleMapsLink(e.target.value)}
            onPaste={(e) => handleMapsLink(e.clipboardData.getData("text"))}
          />
        </Field>

        <div className="relative h-[360px] rounded overflow-hidden border border-border">
          <LocationPickerMap lat={lat} lng={lng} onChange={setCoords} />
        </div>

        <p className="text-xs text-muted">
          Haz click o arrastra el pin para ajustar la ubicación.{" "}
          {lat != null && lng != null ? (
            <span className="text-fg">
              {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
            </span>
          ) : (
            <span>Sin coordenadas todavía.</span>
          )}
        </p>

        <details className="text-sm">
          <summary className="cursor-pointer text-muted hover:text-fg">
            Ajustar coordenadas manualmente
          </summary>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <Field label="Latitud" error={formState.errors.lat?.message}>
              <Input type="number" step="0.000001" {...register("lat")} />
            </Field>
            <Field label="Longitud" error={formState.errors.lng?.message}>
              <Input type="number" step="0.000001" {...register("lng")} />
            </Field>
          </div>
        </details>
      </fieldset>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Dormitorios" error={formState.errors.bedrooms?.message}>
          <Input type="number" min="0" max="20" {...register("bedrooms")} />
        </Field>
        <Field label="Baños" error={formState.errors.bathrooms?.message}>
          <Input type="number" min="0" max="20" {...register("bathrooms")} />
        </Field>
        <Field label="Estacionamientos" error={formState.errors.parking?.message}>
          <Input type="number" min="0" max="20" {...register("parking")} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="m² construidos"><Input type="number" min="0" {...register("builtArea")} /></Field>
        <Field label="m² terreno"><Input type="number" min="0" {...register("landArea")} /></Field>
        <Field label="Bodega">
          <label className="inline-flex items-center gap-2 h-11">
            <input type="checkbox" {...register("storage")} /> <span>Incluye bodega</span>
          </label>
        </Field>
      </div>

      <Field label="Descripción" error={formState.errors.description?.message}>
        <Textarea rows={8} {...register("description")} />
      </Field>

      <Field label="Video (YouTube o Vimeo) — opcional" error={formState.errors.videoUrl?.message}>
        <Input
          type="url"
          inputMode="url"
          placeholder="https://youtu.be/… o https://vimeo.com/…"
          {...register("videoUrl")}
        />
      </Field>

      <Field label="Imágenes" error={formState.errors.images?.message as string | undefined}>
        <div className="grid gap-3">
          <ImageDropzone
            disabled={pending}
            onUploaded={(url) => images.append({ url, alt: "" })}
          />
          {images.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[64px,1fr,auto] items-start gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded bg-fg/[0.04]">
                {field.url && (
                  <Image src={field.url} alt={field.alt || ""} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <input type="hidden" {...register(`images.${i}.url` as const)} />
              <div>
                <Input placeholder="Texto alternativo" {...register(`images.${i}.alt` as const)} />
                <FieldError>{formState.errors.images?.[i]?.alt?.message}</FieldError>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => images.remove(i)} aria-label="Eliminar imagen">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Destacada en home">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("featured")} /> <span>Mostrar en la portada</span>
        </label>
      </Field>

      <div className="flex gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : mode === "create" ? "Crear propiedad" : "Guardar cambios"}
        </Button>
        {mode === "edit" && (
          <Button type="button" variant="outline" onClick={onDelete}>Eliminar</Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}
