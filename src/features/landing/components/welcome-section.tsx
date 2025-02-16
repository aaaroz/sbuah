import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
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
                            className="-pl-1.5 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/6 p-1"
                        >
                            <MenuCard
                                imageUrl="/sop-buah-menu.webp"
                                title='Sop Buah Spesial'
                                description="Campuran buah-buahan yang di mix dengan susu menghasilkan rasa yang manis dan segar"
                                rating={5}
                                reviews={99}
                                price={10000} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </>
    );
};
