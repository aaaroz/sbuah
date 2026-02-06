import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

export const AboutCTA = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-700 px-6 py-8 text-white">
      <h2 className="text-lg font-bold md:text-xl">
        Tunggu Apalagi? Pesan Sekarang Juga!
      </h2>
      <Button className="hover:bg-rose-600/80" asChild>
        <Link href="/menu">Pesan Sekarang!</Link>
      </Button>
    </div>
  );
};
