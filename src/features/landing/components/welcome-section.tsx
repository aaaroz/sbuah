import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { api, cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MenuCard } from "@/components/commons/menu-card";

type Props = {
  className?: string;
};

export const WelcomeSection = ({ className }: Props) => {
  const products = api.product.getAll.useQuery({ page: 1, limit: 20 });
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
          {products.data?.items.map(
            ({ imageUrl, name, description, stats, id, price }) => (
              <CarouselItem
                key={id}
                className="-pl-1.5 basis-1/2 p-1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6"
              >
                <MenuCard
                  id={id}
                  imageUrl={imageUrl ?? "/sop-buah-menu.webp"}
                  name={name}
                  description={description ?? "Minuman segar manis!"}
                  rating={stats?.avgRating ?? 0}
                  reviews={stats?.reviewCount ?? 0}
                  price={price}
                  isHomePage
                />
              </CarouselItem>
            ),
          )}
        </CarouselContent>
      </Carousel>
    </>
  );
};
