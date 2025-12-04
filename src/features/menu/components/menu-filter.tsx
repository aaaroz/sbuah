"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = ["Semua Kategori", "Aneka Jus", "Cappucino Cincau"];

export const MenuFilter = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useSearchParams();
  const searchCategory = params.get("category");
  const handleSearch = React.useCallback(() => {
    console.log("Search");
  }, []);

  return (
    <div className="flex flex-wrap justify-between gap-3">
      <div className="flex flex-nowrap gap-2 overflow-hidden overflow-x-auto max-md:w-full">
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
      <div className="flex gap-2 max-md:w-full">
        <Input
          placeholder="Cari Menu"
          className={cn(
            "border-rose-950",
            isOpen ? "scale-100 duration-200 animate-in" : "scale-0",
            "max-md:w-full max-md:scale-100",
          )}
        />
        <Button
          size="icon"
          onClick={handleSearch}
          className="hidden shrink-0 max-md:inline-flex"
        >
          <Search />
        </Button>
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 max-md:hidden"
        >
          {isOpen ? <XIcon /> : <Search />}
        </Button>
      </div>
    </div>
  );
};
