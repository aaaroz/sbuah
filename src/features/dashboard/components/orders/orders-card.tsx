import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orderStatusMap } from "@/lib/data/order";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ClipboardList, File, FileText } from "lucide-react";

const MAX_VISIBLE_ITEMS = 4;

interface OrderCardProps {
  orderNumber: number;
  buyerName: string;
  phoneNumber: string;
  totalAmount: number;
  status: keyof typeof orderStatusMap;
  createdAt: Date;
  items: {
    id: string;
    name: string;
    quantity: number;
    imageUrl: string | null;
  }[];
}

export const OrdersCard = ({
  phoneNumber,
  orderNumber,
  buyerName,
  totalAmount,
  status,
  createdAt,
  items,
}: OrderCardProps) => {
  const statusConfig = orderStatusMap[status];

  return (
    <li className="hover:bg-muted/50 flex flex-col gap-4 rounded-lg border p-4 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Order #{orderNumber}</h2>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">
              {buyerName} - {phoneNumber}
            </span>

            <p className="text-muted-foreground text-xs">
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
        </div>

        <Button
          variant="outline"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <ClipboardList className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">
            {items.length > 0 ? "Menu pesanan:" : "Tidak ada menu pesanan."}
          </span>

          {items.length > 0 && (
            <AvatarGroup>
              {items.slice(0, MAX_VISIBLE_ITEMS).map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger className="cursor-default">
                    <Avatar className="border border-black bg-white grayscale transition hover:grayscale-0">
                      <AvatarImage src={item.imageUrl ?? ""} alt={item.name} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                  </TooltipContent>
                </Tooltip>
              ))}

              {items.length > MAX_VISIBLE_ITEMS && (
                <AvatarGroupCount>
                  +{items.length - MAX_VISIBLE_ITEMS}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          )}
        </div>
        <div className="flex w-full items-end justify-end font-medium">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(totalAmount)}
        </div>
      </div>
    </li>
  );
};
