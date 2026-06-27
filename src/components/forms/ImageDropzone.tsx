"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
};

type Props = {
  onUploaded: (url: string) => void;
  disabled?: boolean;
};

const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
};

export function ImageDropzone({ onUploaded, disabled }: Props) {
  const [uploading, setUploading] = useState(0);

  const onDrop = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        setUploading((n) => n + 1);
        try {
          const compressed = await imageCompression(file, COMPRESSION_OPTIONS).catch(
            () => file, // fall back to the original if compression fails
          );
          const body = new FormData();
          body.append("file", compressed, file.name);
          const res = await fetch("/api/admin/upload", { method: "POST", body });
          const data = (await res.json().catch(() => ({}))) as {
            url?: string;
            error?: string;
          };
          if (!res.ok || !data.url) {
            throw new Error(data.error ?? "No se pudo subir la imagen");
          }
          onUploaded(data.url);
        } catch (e) {
          toast.error(`Error al subir ${file.name}`, {
            description: e instanceof Error ? e.message : undefined,
          });
        } finally {
          setUploading((n) => n - 1);
        }
      }
    },
    [onUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    multiple: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted transition-colors cursor-pointer",
        isDragActive && "border-fg bg-fg/[0.03]",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <input {...getInputProps()} />
      {uploading > 0 ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Subiendo {uploading} {uploading === 1 ? "imagen" : "imágenes"}…</span>
        </>
      ) : (
        <>
          <UploadCloud size={20} />
          <span>
            {isDragActive
              ? "Suelta las imágenes aquí"
              : "Arrastra imágenes o haz clic para seleccionar"}
          </span>
          <span className="text-xs text-muted-2">JPG, PNG, WebP o AVIF · máx. 4 MB c/u</span>
        </>
      )}
    </div>
  );
}
