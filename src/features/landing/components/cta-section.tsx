import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <div className="container relative flex w-full flex-col rounded-2xl bg-[#E51975] px-6 pt-8 text-white md:pb-8">
      <div className="space-y-3">
        <h1 className="text-lg font-bold md:w-3/5 md:text-2xl">
          UDAH SIAP UNTUK MENDAPATKAN KESEGARAN TIADA TARA?
        </h1>
        <p className="w-3/4 text-xs md:text-sm">
          Pesan minuman favoritmu dengan mudah sekarang juga!
        </p>
        <Button className="bg-[#40407C] px-4 hover:bg-[#40407C]/80" asChild>
          <Link href="/menu">Pesan Sekarang!</Link>
        </Button>
      </div>
      <div className="flex justify-center md:justify-end">
        <Image
          src="/cta-image.png"
          alt="cta-image"
          width={250}
          height={250}
          className="bottom-0 h-auto w-72 md:absolute"
        />
      </div>
    </div>
  );
};
