import { ConfirmDialog } from "@/components/commons/confirm-dialog";
import { useOrders } from "./orders-provider";

interface OrdersUpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrdersUpdateStatusDialog({
  open,
  onOpenChange,
}: OrdersUpdateStatusDialogProps) {
  const { currentOrder, handleUpdateStatus } = useOrders();
  const descMap = {
    PENDING: "Terima pesanan ini?",
    ON_PROCESS: "Selesaikan pesanan ini?",
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ubah Status Pesanan"
      desc={descMap[currentOrder?.status as keyof typeof descMap]}
      confirmText="Simpan perubahan"
      destructive
      handleConfirm={() =>
        handleUpdateStatus(
          (currentOrder?.status as keyof typeof descMap) === "PENDING"
            ? "ON_PROCESS"
            : "COMPLETED",
        )
      }
      className="sm:max-w-sm"
    />
  );
}
