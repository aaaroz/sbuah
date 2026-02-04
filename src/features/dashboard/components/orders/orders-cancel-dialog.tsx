import { ConfirmDialog } from "@/components/commons/confirm-dialog";
import { useOrders } from "./orders-provider";

interface OrdersCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrdersCancelDialog({
  open,
  onOpenChange,
}: OrdersCancelDialogProps) {
  const { currentOrder, handleUpdateStatus } = useOrders();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Batalkan Pesanan"
      desc={`Apakah anda yakin untuk membatalkan pesanan no #${currentOrder?.orderNumber} ?`}
      confirmText="Batalkan"
      destructive
      handleConfirm={() => {
        handleUpdateStatus("CANCELLED");
      }}
      className="sm:max-w-sm"
    />
  );
}
