import React from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { api } from "@/lib/utils";
import { type Order } from "@/lib/types/order";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { OrdersDialogs } from "./orders-dialogs";
import { type orderStatusMap } from "@/lib/data/order";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";

type OrdersDialogType = "detail" | "update" | "cancel";

type OrdersContextType = {
  dialogOpen: OrdersDialogType | null;
  setDialogOpen: (str: OrdersDialogType | null) => void;

  currentOrder: Order | null;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order | null>>;

  currentOrderId: string;
  setCurrentOrderId: React.Dispatch<React.SetStateAction<string>>;

  updateOrderMutation: ReturnType<typeof api.order.update.useMutation>;

  isOrderLoading: boolean;
  handleUpdateStatus: (status: keyof typeof orderStatusMap) => void;
};

const OrdersContext = React.createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OrdersDialogType>(null);
  const [currentOrder, setCurrentOrder] = React.useState<Order | null>(null);
  const [currentOrderId, setCurrentOrderId] = React.useState<string>("");

  const trpcUtils = api.useUtils();

  const updateOrderMutation = api.order.update.useMutation({
    onSuccess: () => {
      void trpcUtils.order.getAll.invalidate();
      if (open !== null) {
        setOpen(null);
      }
    },
  });

  const { data, isLoading } = api.order.getOne.useQuery(
    {
      id: currentOrderId,
    },
    {
      enabled: !!open && currentOrderId !== "",
    },
  );

  const handleUpdateStatus = (status: keyof typeof orderStatusMap) => {
    if (!currentOrderId || !currentOrder) return;

    toast.promise(
      updateOrderMutation.mutateAsync({
        id: currentOrder.id,
        orderNumber: currentOrder.orderNumber,
        buyerName: currentOrder.buyerName,
        phoneNumber: currentOrder.phoneNumber,
        email: currentOrder.email,
        note: currentOrder.note,
        status: status,
        statusRank: currentOrder.statusRank,
        isPaid: currentOrder.isPaid,
        proofImageUrl: currentOrder.proofImageUrl,
        paymentMethod: currentOrder.paymentMethod,
        purchaseMethod: currentOrder.purchaseMethod,
        subtotal: Number(currentOrder.subtotal),
        totalAmount: Number(currentOrder.totalAmount),
      }),
      {
        loading: "Menyimpan Perubahan..",
        success: (data: {
          orderNumber: number;
          status: keyof typeof orderStatusMap;
        }) =>
          `Status pesanan "${data.orderNumber}" berhasil diubah menjadi ${data.status}.`,
        error: (err: unknown) => {
          console.error(err);

          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return "Gagal menyimpan pesanan.";
        },
      },
    );
  };

  useIsomorphicLayoutEffect(() => {
    if (data) {
      setCurrentOrder(data);
    }
  }, [data]);

  return (
    <OrdersContext.Provider
      value={{
        dialogOpen: open,
        setDialogOpen: setOpen,
        currentOrder,
        setCurrentOrder,
        currentOrderId,
        setCurrentOrderId,
        isOrderLoading: isLoading,
        updateOrderMutation,
        handleUpdateStatus,
      }}
    >
      {children}
      <OrdersDialogs />
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const productsContext = React.useContext(OrdersContext);

  if (!productsContext) {
    throw new Error("useOrders has to be used within <OrdersContextProvider>");
  }

  return productsContext;
};
