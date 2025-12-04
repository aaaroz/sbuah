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

const checkoutSchema = z.object({
  name: z
    .string({ error: "Nama harus diisi!" })
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(50, { message: "Nama maksimal 50 karakter" }),
  telephone: z
    .string({ error: "Nomor telepon harus diisi!" })
    .min(10, { message: "Nomor telepon kurang dari 10 digit" }),
  email: z.email({ message: "Email tidak valid" }).optional(),
  message: z.string().optional(),
  termsOfService: z.boolean().refine((val) => val, {
    message: "Anda harus menyetujui syarat dan ketentuan S'BUAH!",
  }),
  paymentMethod: z.enum(["cash", "transfer"], {
    error: "Silahkan pilih metode pembayaran!",
  }),
  buyingMethod: z.enum(["delivery", "pickup"], {
    error: "Silahkan pilih metode pengiriman!",
  }),
  address: z
    .string({ error: "Alamat harus diisi!" })
    .min(10, { message: "Alamat minimal 10 karakter atau lebih" })
    .optional()
    .refine((val) => val, {
      message: "Alamat harus diisi!",
    }),
});

type TCheckoutForm = z.infer<typeof checkoutSchema>;

export const CheckoutForm = () => {
  const form = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
  });

  const onSubmit = (values: TCheckoutForm) => {
    console.log(values);
  };

  const isDelivery = form.watch("buyingMethod") === "delivery";

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
                <FormItem>
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
                <FormItem>
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
                  <FormDescription className="flex text-xs text-secondary">
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
                <FormItem>
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
                <FormItem>
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
          </div>
          <div className="flex w-full flex-col gap-6">
            <CheckoutDetail />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    Metode Pembayaran
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Cash
                          <FormDescription className="text-xs font-normal text-secondary">
                            *Bayar ditempat/Outlet (warung Sop Buah Ibu Popon)
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="transfer" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Transfer
                          <FormDescription className="text-xs font-normal text-secondary">
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
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    Metode Pembelian
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pickup" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Pick Up
                          <FormDescription className="text-xs font-normal text-secondary">
                            *Jemput pesanan di outlet (warung Sop Buah Ibu
                            Popon)
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="delivery" />
                        </FormControl>
                        <FormLabel className="font-semibold">
                          Delivery
                          <FormDescription className="text-xs font-normal text-secondary">
                            *Pesanan diantar ke alamat anda
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
                    <FormDescription className="flex text-xs text-secondary">
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
          </div>
          <div className="flex w-full flex-col gap-6">
            <FormField
              control={form.control}
              name="termsOfService"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
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
                        href="/terms-of-service"
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
            <Button type="submit">Bayar Sekarang</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
