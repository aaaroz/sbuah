import * as React from "react";
import { CartCard } from "./cart-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CartWrapper = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      {Array(3)
        .fill(0)
        .map((item: number) => (
          <CartCard key={item} />
        ))}

      <div className="flex w-full flex-wrap items-center justify-between gap-3 text-xl font-bold md:text-2xl">
        <h2>Total : Rp 30.000,-</h2>
        <Button className="w-full px-8 md:w-auto" asChild>
          <Link href="/menu/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
};
