import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ClipboardCheck,
  ClipboardCopy,
  ClipboardList,
  ClipboardX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrders } from "./orders-provider";
import { type orderStatusMap } from "@/lib/data/order";

type OrdersActionsProps = {
  orderId: string;
  status: keyof typeof orderStatusMap;
};
const iconClassName = "size-4";

export function OrdersActions({ orderId, status }: OrdersActionsProps) {
  const { setCurrentOrderId, setDialogOpen } = useOrders();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:border-border relative z-10 flex h-8 w-8 p-0 hover:border hover:bg-transparent data-[state=open]:border"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentOrderId(orderId);
            setDialogOpen("detail");
          }}
        >
          Lihat Detail
          <DropdownMenuShortcut className="opacity-100">
            <ClipboardList size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentOrderId(orderId);
            setDialogOpen("update");
          }}
          disabled={["COMPLETED", "CANCELLED"].includes(status)}
        >
          {status === "PENDING"
            ? "Terima Pesanan"
            : status === "ON_PROCESS"
              ? "Selesaikan"
              : "Selesai"}
          <DropdownMenuShortcut className="opacity-100">
            {status === "PENDING" ? (
              <ClipboardCopy className={iconClassName} />
            ) : status === "ON_PROCESS" ? (
              <ClipboardCheck className={iconClassName} />
            ) : (
              <ClipboardCheck className={iconClassName} />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            setCurrentOrderId(orderId);
            setDialogOpen("cancel");
          }}
          disabled={["COMPLETED", "CANCELLED"].includes(status)}
        >
          Batalkan
          <DropdownMenuShortcut className="opacity-100">
            <ClipboardX className={iconClassName} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
