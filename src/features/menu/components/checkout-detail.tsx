import * as React from "react";
import { CheckoutCard } from "./checkout-card";

type Props = {
  delete?: string;
};

export const CheckoutDetail = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-base font-semibold">Rincian Pembelian</h1>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <CheckoutCard key={index} />
        ))}
      <div className="mt-3 flex flex-wrap items-center justify-between">
        <h2 className="text-base font-semibold md:text-lg">
          Total yang harus dibayar :
        </h2>
        <h1 className="text-base font-bold md:text-xl">Rp 30.000,-</h1>
      </div>
    </div>
  );
};
