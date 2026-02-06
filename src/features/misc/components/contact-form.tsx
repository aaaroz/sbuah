"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(50, { message: "Nama maksimal 50 karakter" }),
  email: z.email({ message: "Email tidak valid" }),
  message: z
    .string({ error: "Pesan harus diisi!" })
    .min(10, { message: "Pesan minimal 10 karakter" })
    .max(1000, { message: "Pesan maksimal 1000 karakter" }),
});

type TFormContact = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const form = useForm<TFormContact>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (values: TFormContact) => {
    console.log(values);
  };

  return (
    <section className="rounded-2xl bg-[#40407C] p-9">
      <h1 className="pb-6 text-2xl font-bold text-white">
        Hubungi Kami Disini!
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          <div className="w-full space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-white">
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Nama anda ..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-white">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="apel@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="text-white">
                  <FormLabel>Pesan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis pesan ..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="bg-[#121257] hover:bg-[#121257]/60"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
