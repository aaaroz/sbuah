"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Minus, NotebookPen, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CartItem, useCartStore } from "@/lib/stores/cart-store";

type CartCardProps = {
  item: CartItem;
};

export const CartCard = ({ item }: CartCardProps) => {
  const updateQuantity = useCartStore.getState().updateQuantity;
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Card className="rounded-2xl bg-rose-950">
      <CardContent className="flex w-full flex-wrap items-center justify-between gap-3 p-3">
        <div className="flex gap-3 md:gap-6">
          <Image
            src={item.imageUrl ?? "/sop-buah-menu.webp"}
            alt={item.name}
            width={100}
            height={100}
            className="shrink-0 rounded-lg object-cover"
            unoptimized
          />

          <div className="flex flex-col justify-center gap-1.5 py-2 text-white">
            <CardTitle>{item.name}</CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              <span>Jumlah :</span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </Button>

                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "icon",
                    }),
                    "w-[46px] border-white bg-transparent text-center text-white",
                  )}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <CardDescription className="text-base font-semibold text-white">
              Rp {(item.price * item.quantity).toLocaleString("id")}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-col items-end justify-end gap-2 max-[450px]:w-full">
          <Button className="w-full shrink-0 bg-rose-900 hover:bg-rose-900/70 md:w-fit">
            <NotebookPen size={24} />
            <span className="hidden max-[450px]:inline md:inline">
              Tambah Catatan
            </span>
          </Button>

          <Button
            className="w-full shrink-0 bg-rose-900 hover:bg-rose-900/70 md:w-fit"
            onClick={() => removeItem(item.id)}
          >
            <Trash size={24} />
            <span className="hidden max-[450px]:inline md:inline">Hapus</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
