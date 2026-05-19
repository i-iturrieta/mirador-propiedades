import type { PropertyStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { labelStatus } from "@/lib/formatters";

export function StatusBadge({ status }: { status: PropertyStatus }) {
  const variant =
    status === "DISPONIBLE" ? "neutral" :
    status === "RESERVADA" ? "muted" :
    "danger";

  return <Badge variant={variant}>{labelStatus(status)}</Badge>;
}
