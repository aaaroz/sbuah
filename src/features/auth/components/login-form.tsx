"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/utils/auth-client";
import { useRouter } from "next/navigation";

const authSchema = z.object({
  username: z
    .string({ error: "Username tidak boleh kosong!" })
    .min(3, "Username minimal 3 karakter atau lebih!")
    .max(25, "Username maksimal 25 karakter!"),
  password: z
    .string({ error: "Password tidak boleh kosong!" })
    .min(8, "Password minimal 8 karakter atau lebih!")
    .max(25, "Password tidak boleh melebihi 25 karakter!"),
});

type TAuthForm = z.infer<typeof authSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);
  const form = useForm<TAuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: TAuthForm) => {
    const { data, error } = await signIn.username(
      {
        username: values.username,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: (_) => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );

    console.log({ data, error });
  };

  // const onSignUp = async () => {
  //   const { data, error } = await signUp.email(
  //     {
  //       email: "zoldyckramdanz@gmail.com",
  //       password: "admin@123",
  //       username: "admin",
  //       name: "Administrator",
  //       callbackURL: "/dashboard",
  //     },
  //     {
  //       onError: (ctx) => {
  //         alert(ctx.error.message);
  //       },
  //     },
  //   );
  //   console.log({ data, error });
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="text-foreground">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Username anda..."
                    className="bg-rose-950"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-foreground">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isVisible ? "password" : "text"}
                      placeholder="*******"
                      className="bg-rose-950"
                    />
                    <span
                      className="absolute right-4 top-2.5 cursor-pointer"
                      onClick={() => setIsVisible((prev) => !prev)}
                    >
                      {isVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>

        {/* <Button */}
        {/*   type="button" */}
        {/*   className="w-full" */}
        {/*   onClick={onSignUp} */}
        {/*   variant="outline" */}
        {/* > */}
        {/*   SignUp */}
        {/* </Button> */}
        <p className="text-center text-xs md:text-sm">
          Amankan akun admin sebaik mungkin, jangan sampai ada orang yang tau ya
          :D
        </p>
      </form>
    </Form>
  );
};
