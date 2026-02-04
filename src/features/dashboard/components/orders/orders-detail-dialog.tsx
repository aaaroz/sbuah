import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOrders } from "./orders-provider";
import {
  type OrderFormValues,
  orderUpdateSchema,
} from "@/lib/schemas/order/order-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrdersMutateForm } from "./orders-mutate-form";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { Badge } from "@/components/ui/badge";

type OrdersDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function OrdersDetailDialog({
  open,
  onOpenChange,
}: OrdersDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { currentOrder: order, updateOrderMutation } = useOrders();
  const isUpdate = !!order;
  const content = {
    title: "Detail Pesanan",
    description:
      "Rincian pesanan, control pesanan dan pembayaran. Klik simpan untuk menyimpan perubahan.",
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: order
      ? {
          id: order.id,
          orderNumber: order.orderNumber,
          buyerName: order.buyerName,
          phoneNumber: order.phoneNumber,
          email: order.email,
          note: order.note,
          status: order.status,
          statusRank: order.statusRank,
          isPaid: order.isPaid,
          proofImageUrl: order.proofImageUrl,
          paymentMethod: order.paymentMethod,
          purchaseMethod: order.purchaseMethod,
          subtotal: Number(order.subtotal),
          totalAmount: Number(order.totalAmount),
        }
      : undefined,
  });

  async function onSubmit(values: OrderFormValues) {
    try {
      if (
        !order ||
        updateOrderMutation.isPending ||
        updateOrderMutation.isPending
      )
        return;

      const payload = {
        id: order.id,
        orderNumber: order.orderNumber,
        buyerName: order.buyerName,
        phoneNumber: order.phoneNumber,
        email: order.email,
        note: order.note,
        status: order.status,
        statusRank: order.statusRank,
        isPaid: values.isPaid,
        proofImageUrl: order.proofImageUrl,
        paymentMethod: order.paymentMethod,
        purchaseMethod: order.purchaseMethod,
        subtotal: Number(order.subtotal),
        totalAmount: Number(order.totalAmount),
      };

      toast.promise(updateOrderMutation.mutateAsync(payload), {
        loading: "Menyimpan perubahan...",
        success: (data) => `Pesanan #${data.orderNumber} berhasil  disimpan.`,
        error: "Gagal menyimpan perubahan.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      form.reset();
      onOpenChange(false);
    }
  }

  useIsomorphicLayoutEffect(() => {
    if (!order) return;

    form.reset({
      id: order.id,
      orderNumber: order.orderNumber,
      buyerName: order.buyerName,
      phoneNumber: order.phoneNumber,
      email: order.email,
      note: order.note,
      status: order.status,
      statusRank: order.statusRank,
      isPaid: order.isPaid,
      proofImageUrl: order.proofImageUrl,
      paymentMethod: order.paymentMethod,
      purchaseMethod: order.purchaseMethod,
      subtotal: Number(order.subtotal),
      totalAmount: Number(order.totalAmount),
    });
  }, [order, form]);

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          form.reset();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex gap-2">
              <DialogTitle>{content.title}</DialogTitle>
              <Badge
                variant={form.watch("isPaid") === true ? "success" : "warning"}
              >
                {form.watch("isPaid") === true
                  ? "Sudah Dibayar"
                  : "Belum Dibayar"}
              </Badge>
            </div>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
            <OrdersMutateForm form={form} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={
                form.formState.isSubmitting ||
                form.watch("isPaid") === order?.isPaid
              }
            >
              {isUpdate ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex gap-2">
            <DialogTitle>{content.title}</DialogTitle>
            <Badge
              variant={form.watch("isPaid") === true ? "success" : "warning"}
            >
              {form.watch("isPaid") === true
                ? "Sudah Dibayar"
                : "Belum Dibayar"}
            </Badge>
          </div>
          <DrawerDescription>{content.description}</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar mx-4 max-h-[70vh] overflow-y-auto px-4">
          <OrdersMutateForm form={form} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            type="submit"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={
              form.formState.isSubmitting ||
              form.watch("isPaid") === order?.isPaid
            }
          >
            {isUpdate ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
