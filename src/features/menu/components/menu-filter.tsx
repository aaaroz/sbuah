"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = ["Semua Kategori", "Aneka Jus", "Cappucino Cincau"];

export const MenuFilter = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const params = useSearchParams();
    const searchCategory = params.get("category");
    return (
        <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={
                            searchCategory === category ||
                                (category === "Semua Kategori" && !searchCategory)
                                ? "default"
                                : "ghost"
                        }
                        className="font-semibold"
                        asChild
                    >
                        <Link href={"?category=" + category}>{category}</Link>
                    </Button>
                ))}
            </div>
            <div className="flex gap-2">
                <Input placeholder="Cari Menu" className={cn("border-rose-950", isOpen ? "scale-100 animate-in duration-200" : "scale-0")} />
                <Button
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="shrink-0"
                >
                    <Search />
                </Button>
            </div>
        </div>
    );
};
