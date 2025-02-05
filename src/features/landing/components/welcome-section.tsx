import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type Props = {
  className?: string;
};

export const WelcomeSection = ({ className }: Props) => {
  return (
    <>
      <div
        className={cn(
          "container flex flex-col gap-8 text-left text-xl font-bold text-rose-950 dark:text-foreground md:gap-11 md:text-3xl",
          className,
        )}
      >
        <h1>
          Bosan dengan hari yang Panas? Dinginkan Hari-mu dengan{" "}
          <strong>S&apos;BUAH!</strong> 🥤🍉 Pesan Sekarang, Nikmati Sensasi
          Segar yang Tak Terlupakan!
        </h1>
      </div>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
      >
        <CarouselContent className="-ml-1.5">
          {Array.from({ length: 7 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="-pl-1.5 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-1.5">
                    <Image
                      src="/sop-buah-menu.webp"
                      alt="sop-buah-menu"
                      width={240}
                      height={240}
                      className="aspect-square max-h-40 w-full rounded-lg object-cover"
                    />
                    <div className="space-y-1.5 text-center">
                      <CardTitle>Sop Buah Spesial</CardTitle>
                      <CardDescription className="text-justify">
                        Campuran buah-buahan yang di mix dengan susu
                        menghasilkan rasa yang manis dan segar
                      </CardDescription>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5 text-sm">
                          <Star
                            className="size-5"
                            fill="yellow"
                            color="yellow"
                          />
                          <h6>4,9</h6>
                          <p className="text-xs">(10 reviews)</p>
                        </span>
                        <CardTitle>Rp 10.000</CardTitle>
                      </div>
                    </div>
                    <Button className="w-full">Tambah</Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};
