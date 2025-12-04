import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";

interface MenuCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  imageUrl,
  title,
  description,
  price,
  rating,
  reviews,
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-1.5">
        <Image
          src={imageUrl}
          alt="sop-buah-menu"
          width={240}
          height={240}
          className="aspect-square max-h-40 w-full rounded-lg object-cover"
        />
        <div className="w-full space-y-2 text-left md:space-y-4">
          <CardTitle>{title}</CardTitle>
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
        <Button className="w-full">
          Tambah ke keranjang <ShoppingCart size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};
