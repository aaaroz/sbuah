import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { type CartItem } from "@/lib/stores/cart-store";

export const CheckoutCard = ({
  id,
  imageUrl,
  name,
  quantity,
  price,
  note,
}: CartItem) => {
  return (
    <Card className="w-full bg-rose-950">
      <CardContent className="flex flex-row items-center justify-between p-1 px-4">
        <div>
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Image
              alt={name}
              src={imageUrl ?? "/sop-buah-menu.webp"}
              width={50}
              height={50}
              className="size-20 shrink-0 rounded-md bg-white"
            />
            <div className="flex flex-col justify-center text-white">
              <CardTitle className="text-base md:text-lg">{name}</CardTitle>
              <span className="text-muted-foreground text-xs">
                Jumlah : {quantity}
              </span>
              <span className="text-muted-foreground text-xs">
                Catatan : {note ?? "-"}
              </span>
            </div>
          </div>
        </div>
        <CardDescription className="text-xl font-semibold text-white">
          Rp {price.toLocaleString("id-ID")}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
