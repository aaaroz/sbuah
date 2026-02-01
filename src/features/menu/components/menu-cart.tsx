"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";

export const MenuCart = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const  items  = useCartStore((s) => s.items);
  return (
    <div
      data-open={isOpen}
      className="fixed bottom-0 left-0 z-50 w-full bg-rose-800 transition-all data-[open=false]:-bottom-20 data-[open=true]:scale-100 data-[open=true]:animate-in data-[open=false]:animate-out"
    >
      <div className="container relative p-5 text-white">
        <Link href="/menu/cart" className="flex items-center justify-between">
          <ShoppingBag size={36} />
          <h5>Buka Keranjang Kamu</h5>
          <span>{items.length} menu</span>
        </Link>
        <Button
          data-open={isOpen}
          className="absolute right-0 rounded-full p-0 transition-all duration-200 data-[open=false]:-top-12 data-[open=true]:-top-5 [&[data-open=false]>svg]:rotate-180"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            size={24}
            className="h-4 w-4 shrink-0 transition-transform duration-200"
          />
        </Button>
      </div>
    </div>
  );
};
