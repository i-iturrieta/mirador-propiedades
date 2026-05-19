"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError, Select } from "@/components/ui/Input";
import { propertyFormSchema, type PropertyFormInput } from "@/lib/validations";
import { createProperty, updateProperty, deleteProperty } from "@/app/admin/propiedades/actions";

type Props = {
  mode: "create" | "edit";
  id?: string;
  defaultValues?: Partial<PropertyFormInput>;
};

export function PropertyForm({ mode, id, defaultValues }: Props) {
  const [pending, startTransition] = useTransition();

  const { register, handleSubmit, control, formState } = useForm<PropertyFormInput>({
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

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Sector"><Input {...register("sector")} /></Field>
        <Field label="Dirección referencial"><Input {...register("address")} /></Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Latitud" error={formState.errors.lat?.message}>
          <Input type="number" step="0.000001" {...register("lat")} />
        </Field>
        <Field label="Longitud" error={formState.errors.lng?.message}>
          <Input type="number" step="0.000001" {...register("lng")} />
        </Field>
      </div>

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

      <Field label="Imágenes" error={formState.errors.images?.message as string | undefined}>
        <div className="grid gap-3">
          {images.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr,1fr,auto] gap-2">
              <Input placeholder="URL de la imagen" {...register(`images.${i}.url` as const)} />
              <Input placeholder="Texto alternativo" {...register(`images.${i}.alt` as const)} />
              <Button type="button" variant="outline" size="icon" onClick={() => images.remove(i)} aria-label="Eliminar imagen">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => images.append({ url: "", alt: "" })}>
            <Plus size={14} /> Agregar imagen
          </Button>
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
