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
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { OrdersActions } from "./orders-actions";

const MAX_VISIBLE_ITEMS = 4;

interface OrderCardProps {
  orderId: string;
  orderNumber: number;
  buyerName: string;
  phoneNumber: string;
  totalAmount: number;
  status: keyof typeof orderStatusMap;
  isPaid: boolean;
  createdAt: Date;
  items: {
    id: string;
    name: string;
    quantity: number;
    imageUrl: string | null;
  }[];
}

export const OrdersCard = ({
  orderId,
  phoneNumber,
  orderNumber,
  buyerName,
  totalAmount,
  status,
  createdAt,
  items,
}: OrderCardProps) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const statusConfig = orderStatusMap[status];
  const handleToogleList = () => {
    setIsListOpen((prev) => !prev);
  };

  return (
    <li className="hover:border-foreground-50 bg-background relative z-10 flex h-fit flex-col gap-4 rounded-lg border p-4 hover:shadow-md">
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

        <OrdersActions orderId={orderId} status={status} />
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 justify-between">
        <div className="relative flex flex-col gap-1">
          <div className="flex items-center-safe gap-1">
            <span className="text-muted-foreground text-sm">
              Menu Pesanan :
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="data-[state=open]:bg-muted flex size-6 p-0"
                  title="Buka list pesanan"
                  onClick={handleToogleList}
                >
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-all duration-100",
                      isListOpen ? "rotate-180" : "rotate-0",
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isListOpen ? "Tutup" : "Buka"} list pesanan.
              </TooltipContent>
            </Tooltip>
          </div>

          {items.length > 0 && (
            <>
              {isListOpen ? (
                <div className="faded-bottom-small flex max-h-36 w-full overflow-auto p-1">
                  <ol className="space-y-1">
                    {items.slice(0, MAX_VISIBLE_ITEMS).map((item, index) => (
                      <li key={item.id} className="flex gap-1 text-sm">
                        <span>{index + 1}.</span>
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <AvatarGroup>
                  {items.slice(0, MAX_VISIBLE_ITEMS).map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger className="cursor-default">
                        <Avatar className="border-border border bg-white grayscale transition hover:grayscale-0">
                          <AvatarImage
                            src={item.imageUrl ?? ""}
                            alt={item.name}
                          />
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
            </>
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
