import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const QuestionSection = () => {
  return (
    <div className="container grid grid-cols-1 gap-8 text-white md:grid-cols-2">
      <div className="flex w-full flex-col justify-between gap-6 rounded-2xl bg-[#E51975] px-6 pt-8">
        <div className="space-y-3">
          <h1 className="text-lg font-bold md:text-2xl">Apa Itu S{"'"}BUAH?</h1>
          <p className="text-sm md:text-base">
            S{"'"}BUAH adalah platform yang menyediakan beberapa macam minuman
            buah-buahan, dengan S{"'"}BUAH kalian bisa memesan menu dari warung
            SOP BUAH IBU POPON, dengan cara yang praktis dan tanpa antri.
          </p>
        </div>
        <Image
          src="/dragon-fruit.png"
          alt="dragon-fruit"
          width={100}
          height={100}
          className="h-auto w-36"
        />
      </div>
      <div className="flex w-full flex-col justify-between gap-6 rounded-2xl bg-[#40407C] px-6 pt-8">
        <div className="space-y-3">
          <h1 className="text-lg font-bold md:text-2xl">Cara Pesan Mudah!</h1>
          <ul className="ml-4 list-outside list-decimal text-sm md:text-base">
            <li>Buka website S&apos;BUAH</li>
            <li>Pergi ke halaman menu dan pilih varian minuman favoritmu</li>
            <li>Tambahkan ke keranjang dan lakukan pembayaran</li>
            <li>Tunggu beberapa saat dan pesanan siap dinikmati</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <Image
            src="/grape-fruit.png"
            alt="grape-fruit"
            width={250}
            height={250}
            className="h-auto w-48"
          />
        </div>
      </div>
      <div className="relative flex w-full flex-col justify-between gap-6 rounded-2xl bg-rose-950 px-6 pt-8 md:col-span-2 md:pb-8">
        <div className="space-y-3 md:space-y-6">
          <h1 className="text-lg font-bold md:text-2xl">Punya Pertanyaan?</h1>
          <p className="w-3/4 text-sm">
            Cari jawaban dari pertanyaanmu dibawah sini atau hubungi kami via
            contact.
          </p>
          <Button size="sm" className="px-4">
            Pelajari Lebih Lanjut
          </Button>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/orange-fruit.png"
            alt="orange-fruit"
            width={250}
            height={250}
            className="bottom-0 h-auto w-48 md:absolute"
          />
        </div>
      </div>
    </div>
  );
};
