import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  test?: number;
};

export const CheckoutCard = (props: Props) => {
  return (
    <Card className="w-full bg-rose-950">
      <CardContent className="p-1 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Image
            alt="sop-buah"
            src="/sop-buah-menu.webp"
            width={50}
            height={50}
            className="max-h-20 w-auto shrink-0 rounded-md"
          />
          <div className="flex flex-col justify-center text-white">
            <CardTitle className="text-base md:text-lg">
              Sop Buah Special
            </CardTitle>
            <span className="text-xs">Jumlah : 1</span>
          </div>
          <CardDescription className="text-sm font-semibold text-white">
            Rp 10.000,-
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
