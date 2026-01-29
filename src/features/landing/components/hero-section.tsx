import * as React from "react";
import Image from "next/image";
import { Lemon } from "next/font/google";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

const lemon = Lemon({ weight: "400", subsets: ["latin"] });

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container overflow-hidden rounded-2xl">
      <div className="relative flex flex-col items-center gap-14 rounded-2xl bg-rose-950 pt-16 text-white">
        <Logo
          variant="secondary"
          className="relative z-30 h-auto w-auto max-w-32"
        />
        <div className="relative z-20 flex flex-col justify-center gap-8 text-white md:gap-10">
          <h1
            className={cn(lemon.className, "text-center text-3xl md:text-6xl")}
          >
            HILANGKAN HAUSMU!
          </h1>
          <p className="mx-auto px-10 text-center text-sm opacity-90 md:px-24 md:text-lg">
            Nikmati es buah segar dengan kombinasi buah-buahan pilihan, Pesan
            sekarang untuk merasakan kelezatan dan segarnya dari berbagai macam
            es buah terbaik kami!
          </p>
          <div className="flex justify-center">
            <Button className="px-10 py-5" asChild>
              <Link href="/menu">Pesan Sekarang!</Link>
            </Button>
          </div>
        </div>
        <Image
          src="/hero-image.png"
          alt="hero-section"
          width={600}
          height={600}
          className="relative z-20 h-auto min-h-60 w-auto max-w-full object-cover object-center md:h-auto"
          priority
        />
        <WaveSVG fill={theme === "light" ? "#F8F8F8" : "#180C0E"} />
      </div>
    </section>
  );
};

const WaveSVG = ({ fill }: { fill?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="absolute bottom-0 right-0 z-10 w-full scale-105 object-fill"
    >
      <path
        fill={fill}
        fillOpacity="1"
        d="M0,256L34.3,240C68.6,224,137,192,206,202.7C274.3,213,343,267,411,277.3C480,288,549,256,617,213.3C685.7,171,754,117,823,85.3C891.4,53,960,43,1029,64C1097.1,85,1166,139,1234,149.3C1302.9,160,1371,128,1406,112L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
      ></path>
    </svg>
  );
};
