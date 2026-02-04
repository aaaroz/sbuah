import { OrdersDetailDialog } from "./orders-detail-dialog";
import { useOrders } from "./orders-provider";
import { OrdersUpdateStatusDialog } from "./orders-update-status-dialog";

export function OrdersDialogs() {
  const {
    dialogOpen: open,
    setDialogOpen: setOpen,
    currentOrderId,
  } = useOrders();
  return (
    <>
      {currentOrderId && (
        <>
          <OrdersDetailDialog
            key="orders-detail"
            open={open === "detail"}
            onOpenChange={() => setOpen("detail")}
          />

          <OrdersUpdateStatusDialog
            key="orders-update-status"
            open={open === "update"}
            onOpenChange={() => setOpen("update")}
          />

          <OrdersUpdateStatusDialog
            key="orders-cancel-status"
            open={open === "cancel"}
            onOpenChange={() => setOpen("cancel")}
          />
        </>
      )}
    </>
  );
}
