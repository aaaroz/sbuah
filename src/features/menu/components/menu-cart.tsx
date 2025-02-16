"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MenuCart = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <div
            data-open={isOpen}
            className="fixed z-50 left-0 bottom-0 data-[open=true]:scale-100 data-[open=false]:-bottom-20 transition-all data-[open=false]:animate-out data-[open=true]:animate-in w-full bg-rose-800"
        >
            <div className="relative container p-5 text-white">
                <Link href="/cart" className="flex justify-between items-center">
                    <ShoppingBag size={36} />
                    <h5>Checkout dan Bayar</h5>
                    <span>3 menu</span>
                </Link>
                <Button
                    data-open={isOpen}
                    className="absolute data-[open=false]:-top-12 data-[open=true]:-top-5 -right-0 rounded-full p-0 [&[data-open=false]>svg]:rotate-180"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronDown
                        size={24}
                        className="h-4 w-4 shrink-0 transition-transform duration-200"
                    />
                </Button>
            </div>
        </div>
    );
};
