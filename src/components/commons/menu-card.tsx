import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { useRouter } from "next/navigation";

interface MenuCardProps {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  isHomePage?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  id,
  imageUrl,
  name,
  description,
  price,
  rating,
  reviews,
  isHomePage = false,
}) => {
  const router = useRouter();

  const addItem = useCartStore.getState().addItem;
  const updateQuantity = useCartStore.getState().updateQuantity;
  const removeItem = useCartStore.getState().removeItem;

  const cartItem = useCartStore((s) => s.items.find((item) => item.id === id));

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-1.5">
        <Image
          src={imageUrl}
          alt={name}
          width={240}
          height={240}
          className="aspect-square max-h-40 w-full rounded-lg object-cover"
        />

        <div className="w-full space-y-2 text-left md:space-y-4">
          <CardTitle>{name}</CardTitle>

          <CardDescription className="line-clamp-2 h-[40px]">
            {description}
          </CardDescription>

          <div className="flex justify-between">
            <span className="flex items-center gap-1.5 text-sm">
              <Star className="size-4" fill="yellow" color="yellow" />
              <h6 className="text-xs">{rating.toFixed(1)}</h6>
              <p className="text-xs">({reviews}+ reviews)</p>
            </span>

            <CardTitle>Rp {price.toLocaleString("id")}</CardTitle>
          </div>
        </div>

        {/* CTA */}
        {!cartItem ? (
          <Button
            className="w-full gap-2"
            onClick={() => {
              addItem({ id, name, price, imageUrl });
              if (isHomePage) router.push("/menu");
            }}
          >
            Tambah ke keranjang <ShoppingCart size={16} />
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                cartItem.quantity === 1
                  ? removeItem(id)
                  : updateQuantity(id, cartItem.quantity - 1)
              }
            >
              <Minus size={16} />
            </Button>

            <span className="min-w-[32px] text-center font-semibold">
              {cartItem.quantity}
            </span>

            <Button
              size="icon"
              variant="outline"
              onClick={() => updateQuantity(id, cartItem.quantity + 1)}
            >
              <Plus size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
