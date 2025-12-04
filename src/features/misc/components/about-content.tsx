import * as React from "react";
import Image from "next/image";

export const AboutContent = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
      <div className="space-y-3 text-rose-950 dark:text-foreground">
        <h1 className="text-xl font-bold md:text-3xl">
          Tentang <strong>S{"'"}BUAH</strong>
        </h1>
        <p className="text-sm">
          S{"'"}BUAH adalah platform yang menyediakan beberapa macam minuman
          buah-buahan, dengan S{"'"}BUAH kalian bisa memesan menu dari warung
          SOP BUAH IBU POPON, dengan cara yang praktis dan tanpa antri.
        </p>
        <p className="text-sm">
          Warung SOP BUAH IBU POPON ini telah berdiri sejak 10 tahun yang lalu.
        </p>
      </div>
      <div className="flex w-full justify-center rounded-2xl bg-rose-950">
        <Image
          src="/hero-image-sm.png"
          alt="hero-image-small"
          width={250}
          height={250}
          className="h-52 w-auto"
        />
      </div>
    </div>
  );
};
