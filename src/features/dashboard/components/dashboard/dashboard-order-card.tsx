import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  buyerName: string;
  phoneNumber: string;
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  createdAt: Date;
}

const statusMap = {
  PENDING: { label: "Menunggu", variant: "secondary" },
  PAID: { label: "Dibayar", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "success" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
} as const;

export function OrderCard({
  buyerName,
  phoneNumber,
  status,
  totalAmount,
  createdAt,
}: OrderCardProps) {
  const initials = buyerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusConfig = statusMap[status];

  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg p-2 transition-all duration-200 hover:bg-accent hover:shadow-sm">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium leading-none">{buyerName}</p>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {phoneNumber} ·{" "}
            {new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            }).format(new Date(createdAt))}{" "}
            WIB
          </p>
        </div>

        <div className="font-medium">
          +
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(totalAmount)}
        </div>
      </div>
    </div>
  );
}
