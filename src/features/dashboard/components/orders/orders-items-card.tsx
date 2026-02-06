import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface OrderItemsCardProps {
  item: {
    id: string;
    note: string | null;
    name: string;
    productId: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    orderId: string;
  };
}

export const OrdersItemsCard = ({ item }: OrderItemsCardProps) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const handleToogleList = () => {
    setIsListOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Avatar className="border">
            <AvatarImage src={item.imageUrl ?? ""} alt={item.name} />
            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{item.name}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
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
              {isListOpen ? "Tutup" : "Buka"} note pesanan.
            </TooltipContent>
          </Tooltip>
        </div>
        <span>x{item.quantity}</span>
      </div>
      {isListOpen && (
        <div
          className={cn(
            "faded-bottom-small flex max-h-36 w-full overflow-auto p-1",
            !item.note && "text-muted-foreground",
          )}
        >
          <span className="w-full text-sm">
            {item.note ?? "Tidak ada note"}
          </span>
        </div>
      )}
    </div>
  );
};
