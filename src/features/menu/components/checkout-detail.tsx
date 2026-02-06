import * as React from "react";
import { CheckoutCard } from "./checkout-card";
import { type CartItem } from "@/lib/stores/cart-store";

type Props = {
  items: CartItem[];
};

export const CheckoutDetail = ({ items }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-base font-semibold">Rincian Pembelian</h1>
      {items.map((item) => (
        <CheckoutCard key={item.id} {...item} />
      ))}
    </div>
  );
};
