"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, cn } from "@/lib/utils";
import { useProductStore } from "@/lib/stores/product-store";

export const MenuFilter = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localSearchQuery, setLocalSearchQuery] = React.useState("");
  const params = useSearchParams();
  const setSelectedCategory = useProductStore.getState().setSelectedCategory;
  const setSearchQuery = useProductStore.getState().setSearchQuery;

  const searchCategory = params.get("category") ?? "all";
  const { data } = api.category.getAll.useQuery();

  const handleSearch = React.useCallback(() => {
    setSearchQuery(localSearchQuery);
  }, [localSearchQuery, setSearchQuery]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearchQuery.trim() === "") {
        setSearchQuery(null);
        return;
      }
      setSearchQuery(localSearchQuery.trim());
    }, 400); // 👈 debounce delay (ms)

    return () => clearTimeout(timeout);
  }, [localSearchQuery, setSearchQuery]);

  React.useEffect(() => {
    if (searchCategory && searchCategory !== "all") {
      const selectedCategory = data?.find(
        (category) => category.name === searchCategory,
      );
      if (selectedCategory) setSelectedCategory(selectedCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [searchCategory, data, setSelectedCategory]);

  return (
    <div className="flex flex-wrap justify-between gap-3">
      <div className="flex flex-nowrap gap-2 overflow-hidden overflow-x-auto max-md:w-full">
        <Button
          variant={
            searchCategory === "all" || !searchCategory ? "default" : "ghost"
          }
          className="font-semibold"
          asChild
        >
          <Link href={"?category=all"}>Semua</Link>
        </Button>
        {data?.map((category) => (
          <Button
            key={category.id}
            variant={
              searchCategory === category.name || !searchCategory
                ? "default"
                : "ghost"
            }
            className="font-semibold"
            asChild
          >
            <Link href={"?category=" + category.name}>{category.name}</Link>
          </Button>
        ))}
      </div>
      <div className="flex gap-2 max-md:w-full">
        <Input
          placeholder="Cari Menu"
          value={localSearchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setLocalSearchQuery(value);
          }}
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
          onClick={() => {
            if (isOpen) {
              setLocalSearchQuery("");
              setSearchQuery(null);
            }
            setIsOpen(!isOpen);
          }}
          className="shrink-0 max-md:hidden"
        >
          {isOpen ? <XIcon /> : <Search />}
        </Button>
      </div>
    </div>
  );
};
