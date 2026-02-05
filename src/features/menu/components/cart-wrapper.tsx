import * as React from "react";
import { CartCard } from "./cart-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type CartItem, useCartStore } from "@/lib/stores/cart-store";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MenuSquareIcon, ShoppingBag } from "lucide-react";
import { CartNoteDialog } from "./cart-note-dialog";

export const CartWrapper = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<CartItem | null>(
    null,
  );
  const items = useCartStore((s) => s.items);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) return <EmptyCart />;
  return (
    <>
      <div className="flex w-full flex-col gap-6">
        {items.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            setIsDialogOpen={setIsDialogOpen}
            setSelectedProduct={setSelectedProduct}
          />
        ))}

        <div className="flex w-full flex-wrap items-center justify-between gap-3 text-xl font-bold md:text-2xl">
          <h2>Subtotal : Rp {totalPrice.toLocaleString("id")}</h2>
          <Button className="w-full px-8 md:w-auto" asChild>
            <Link href="/menu/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
      <CartNoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productId={selectedProduct?.id ?? ""}
        productName={selectedProduct?.name ?? ""}
      />
    </>
  );
};

function EmptyCart() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBag />
        </EmptyMedia>
        <EmptyTitle>Keranjang Kosong</EmptyTitle>
        <EmptyDescription>
          Kamu belum memilih menu apa pun. Yuk pilih menu dulu.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="default" asChild>
          <Link href="/menu">
            <MenuSquareIcon />
            Pilih menu
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
