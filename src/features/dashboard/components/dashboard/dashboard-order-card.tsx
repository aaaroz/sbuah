import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { orderStatusMap } from "@/lib/data/order";

interface OrderCardProps {
  orderNumber: number;
  buyerName: string;
  phoneNumber: string;
  status: keyof typeof orderStatusMap;
  totalAmount: number;
  createdAt: Date;
}

export function OrderCard({
  orderNumber,
  buyerName,
  phoneNumber,
  status,
  totalAmount,
  createdAt,
}: OrderCardProps) {
  const statusConfig = orderStatusMap[status];

  return (
    <div className="hover:bg-accent flex items-center gap-4 rounded-lg p-2 transition-all duration-200 hover:shadow-xs">
      <Avatar className="h-9 w-9">
        <AvatarFallback>#{orderNumber}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm leading-none font-medium">{buyerName}</p>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>

          <p className="text-muted-foreground text-xs">
            {phoneNumber} ·{" "}
            {new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "short",
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
