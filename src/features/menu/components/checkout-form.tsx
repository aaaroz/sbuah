"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckoutDetail } from "./checkout-detail";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MessageCircleWarning } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/lib/stores/cart-store";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { type orderCreateSchema } from "@/lib/schemas/order/order-schema";
import { useRouter } from "next/router";

export const checkoutSchema = z
  .object({
    name: z
      .string({ error: "Nama harus diisi!" })
      .min(3, { message: "Nama minimal 3 karakter" })
      .max(50, { message: "Nama maksimal 50 karakter" }),

    telephone: z
      .string({ error: "Nomor telepon harus diisi!" })
      .min(10, { message: "Nomor telepon minimal 10 digit" }),

    email: z.email({ message: "Email tidak valid" }).optional(),

    message: z.string().optional(),

    termsOfService: z
      .boolean({
        error: "Anda harus menyetujui syarat dan ketentuan S'BUAH!",
      })
      .refine((val) => val === true, {
        message: "Anda harus menyetujui syarat dan ketentuan S'BUAH!",
      }),
    saveForNextOrder: z.boolean().optional(),

    paymentMethod: z.enum(["cash", "transfer"], {
      error: "Silahkan pilih metode pembayaran!",
    }),
    buyingMethod: z.enum(["delivery", "pickup"], {
      error: "Silahkan pilih metode pengiriman!",
    }),

    address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.buyingMethod === "delivery") {
      if (!data.address || data.address.trim().length < 10) {
        ctx.addIssue({
          path: ["address"],
          message: "Alamat wajib diisi minimal 10 karakter untuk pengiriman",
          code: "custom",
        });
      }
    }
  });

type TCheckoutForm = z.infer<typeof checkoutSchema>;

type InputOrderPayload = z.infer<typeof orderCreateSchema>;

const ONGKIR = 2000;
const STORAGE_KEY = "checkout_draft";

const saveCheckoutDraft = (payload: InputOrderPayload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const getCheckoutDraft = (): InputOrderPayload | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as InputOrderPayload) : null;
};

export const CheckoutForm = () => {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore.getState().clearCart;
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const createOrderMutation = api.order.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Pemesanan berhasil!");
    },
  });

  const form = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
  });

  const isDelivery = form.watch("buyingMethod") === "delivery";

  const onSubmit = async (values: TCheckoutForm) => {
    const shippingCost = isDelivery ? ONGKIR : 0;

    const payload: InputOrderPayload = {
      buyerName: values.name,
      phoneNumber: values.telephone,
      paymentMethod: values.paymentMethod === "cash" ? "CASH" : "TRANSFER",
      purchaseMethod: values.buyingMethod === "pickup" ? "PICK_UP" : "DELIVERY",
      subtotal: totalPrice,
      totalAmount: totalPrice + shippingCost,
      email: values.email,
      note: values.message,
      address: values.address,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        note: item.note,
      })),
    };

    const createOrderPromise = createOrderMutation.mutateAsync(payload);

    toast.promise(createOrderPromise, {
      loading: "Mengirimkan pesanan...",
      success:
        "Pesananmu sudah terkirim. Kamu akan dialihkan ke halaman detail pesanan.",
      error: "Gagal membuat pesanan.",
    });

    try {
      const res = await createOrderPromise;

      if (values.saveForNextOrder) {
        saveCheckoutDraft(payload);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      setTimeout(() => {
        clearCart();
        void router.push(`/order/${res.id}`);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const draft = getCheckoutDraft();
    if (!draft) return;

    form.reset({
      name: draft.buyerName,
      telephone: draft.phoneNumber,
      email: draft.email ?? "",
      message: draft.note ?? "",
      paymentMethod: draft.paymentMethod === "CASH" ? "cash" : "transfer",
      buyingMethod: draft.purchaseMethod === "PICK_UP" ? "pickup" : "delivery",
      address: draft.purchaseMethod === "DELIVERY" ? draft.address : undefined,
      saveForNextOrder: true,
    });
  }, [form]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          <div className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    Nama
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Nama anda ..."
                      className="bg-rose-950 text-white placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    No.Telp/WhatsApp
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="08123xxxxx"
                      className="bg-rose-950 text-white placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormDescription className="text-primary flex text-xs">
                    <MessageCircleWarning size={16} className="mr-2 shrink-0" />{" "}
                    Masukkan nomor telepon/WA aktif, agar kami dapat dengan
                    mudah untuk menghubungi Anda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    Email <span>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="apple@example.com"
                      className="bg-rose-950 text-white placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    Pesan/Note <span>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={8}
                      placeholder="Saya mau pesanannya diambil jam 5 sore, jus nya gapake susu..."
                      className="bg-rose-950 text-white placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CheckoutDetail items={cartItems} />
          </div>
          <div className="flex w-full flex-col gap-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    Metode Pembayaran
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Cash
                          <FormDescription className="text-primary text-xs font-normal">
                            *Bayar ditempat/Outlet (warung Sop Buah Ibu Popon)
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="transfer" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Transfer
                          <FormDescription className="text-primary text-xs font-normal">
                            *Bayar menggunakan uang digital / Qris / Bank /
                            E-Wallet lainnya
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buyingMethod"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-semibold">
                    Metode Pembelian
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="pickup" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Pick Up
                          <FormDescription className="text-primary text-xs font-normal">
                            *Jemput pesanan di outlet (warung Sop Buah Ibu
                            Popon)
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="delivery" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Delivery
                          <FormDescription className="text-primary text-xs font-normal">
                            *Pesanan diantar ke alamat anda (khusus wilayah
                            cipeundeuy/cirata)
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isDelivery ? (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Alamat Lengkap
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder="Jl.prapatan cirata rt/rw 01/01 no. 01, dekat puskesmas, dan ciri disekitarnya..."
                        className="bg-rose-950 text-white placeholder:text-white/70"
                      />
                    </FormControl>
                    <FormDescription className="text-primary flex text-xs">
                      <MessageCircleWarning
                        size={16}
                        className="mr-2 shrink-0"
                      />
                      Harap memasukkan alamat lengkap, agar kami dapat
                      mengirimkan pesanan ke alamat anda sesuai alamat!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Rincian Pembayaran</h1>
              <Separator />
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-sm font-medium md:text-base">Subtotal:</h2>
                <h1 className="text-base font-bold md:text-xl">
                  Rp {totalPrice.toLocaleString("id")}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-sm font-medium md:text-base">Ongkir:</h2>
                <h1 className="text-base font-bold md:text-xl">
                  Rp {(isDelivery ? ONGKIR : 0).toLocaleString("id")}
                </h1>
              </div>
              <Separator />
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-base font-semibold md:text-xl">
                  Total yang harus dibayar :
                </h2>
                <h1 className="text-base font-bold md:text-2xl">
                  Rp{" "}
                  {(totalPrice + (isDelivery ? ONGKIR : 0)).toLocaleString(
                    "id",
                  )}
                </h1>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6">
              <FormField
                control={form.control}
                name="termsOfService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Saya menyetujui{" "}
                        <Link
                          href="/terms-of-services"
                          target="_blank"
                          className="font-semibold hover:underline"
                        >
                          Syarat dan Ketentuan
                        </Link>{" "}
                        pembelian melalui website S{"'"}BUAH
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="saveForNextOrder"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-medium">
                      Simpan untuk pesanan berikutnya
                    </FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex w-full gap-2">
                <Link href={"/menu/cart"}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full cursor-pointer"
                  >
                    Ubah Pesanan
                  </Button>
                </Link>
                <Button type="submit" className="w-full cursor-pointer">
                  Bayar Sekarang
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
