import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { type OrderFormValues } from "@/lib/schemas/order/order-schema";
import { useOrders } from "./orders-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { orderStatusMap } from "@/lib/data/order";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { OrdersItemsCard } from "./orders-items-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type OrderMutateFormProps = {
  form: UseFormReturn<OrderFormValues>;
};

export function OrdersMutateForm({ form }: OrderMutateFormProps) {
  const proofImageUrl = form.watch("proofImageUrl");
  const status = form.watch("status");
  const statusConfig = orderStatusMap[status ?? "PENDING"];
  const { currentOrder } = useOrders();

  const handleConfirmPayment = () => {
    form.setValue("isPaid", true);
    toast.info(
      "Pembayaran telah ditandai sebagai sudah dibayar, silahkan simpan perubahan.",
    );
  };
  return (
    <>
      <div className="mb-4 flex w-full flex-col items-center justify-center">
        <Avatar className="size-16">
          <AvatarFallback className="text-foreground border text-xl font-bold">
            #{form.watch("orderNumber")}
          </AvatarFallback>
        </Avatar>
      </div>
      <Form {...form}>
        <form className={cn("grid gap-3")}>
          {/* Buyer Name */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Nama Pembeli</FieldLabel>
            <Input {...form.register("buyerName")} readOnly />
          </Field>

          {/* Phone */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>No. Telepon</FieldLabel>
            <Input {...form.register("phoneNumber")} readOnly />
          </Field>

          {/* Email */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Email</FieldLabel>
            <Input type="email" {...form.register("email")} readOnly />
          </Field>

          {/* Note */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Catatan</FieldLabel>
            <Textarea {...form.register("note")} readOnly />
          </Field>

          {/* Status */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Status</FieldLabel>
            <Badge
              variant={statusConfig?.variant ?? "outline"}
              className="w-fit"
            >
              {statusConfig.label}
            </Badge>
          </Field>

          {/* Proof Image */}
          <Field>
            <FieldLabel>Bukti Pembayaran</FieldLabel>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
              {proofImageUrl ? (
                <Image
                  src={proofImageUrl}
                  alt="Proof of payment"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  <span>Belum menyertakan bukti pembayaran.</span>
                </div>
              )}
            </div>
            {!form.watch("isPaid") && !proofImageUrl && (
              <Button type="button" onClick={handleConfirmPayment}>
                Konfirmasi Pembayaran
              </Button>
            )}
          </Field>

          {/* Payment Method */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Metode Pembayaran</FieldLabel>
            <Input {...form.register("paymentMethod")} />
          </Field>

          {/* Purchase Method */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Metode Pembelian</FieldLabel>
            <Input {...form.register("purchaseMethod")} />
          </Field>

          {/* Subtotal */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Subtotal</FieldLabel>
            <span className="flex w-full justify-end">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(currentOrder?.subtotal) ?? 0)}
            </span>
          </Field>

          {/* Total */}
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Total Pembayaran</FieldLabel>
            <span className="flex w-full justify-end">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(currentOrder?.totalAmount) ?? 0)}
            </span>
          </Field>

          {/* Items (read-only) */}
          {currentOrder?.items?.length ? (
            <Field>
              <FieldLabel>Menu Pesanan</FieldLabel>
              <div className="text-muted-foreground space-y-2 text-sm">
                {currentOrder.items.map((item, i) => (
                  <OrdersItemsCard
                    key={i}
                    item={{ ...item, price: Number(item.price) }}
                  />
                ))}
              </div>
            </Field>
          ) : null}
        </form>
      </Form>
    </>
  );
}
