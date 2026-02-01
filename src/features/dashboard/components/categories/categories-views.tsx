"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Loader2,
  PlusIcon,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "@/lib/utils";
import { CategoriesActions } from "./categories-actions";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const MAX_VISIBLE_PRODUCTS = 7;

export const CategoriesViews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const { data: categories = [], isLoading } =
    api.category.getAllWithProducts.useQuery({ sort });

  const filteredApps = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  return (
    <>
      <div className="flex items-end justify-between sm:my-4 sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Cari kategori..."
            className="h-9 w-40 lg:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as "asc" | "desc")}
        >
          <SelectTrigger className="w-16">
            <SelectValue>
              <SlidersHorizontal size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="asc">
              <div className="flex items-center gap-4">
                <ArrowUpAZ size={16} />
                <span>Ascending</span>
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-4">
                <ArrowDownAZ size={16} />
                <span>Descending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="shadow-xs" />

      <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <li className="flex items-center justify-center gap-2 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">
            <Loader2 className="animate-spin" />
            Sabar yaa…
          </li>
        ) : filteredApps.length === 0 ? (
          <li className="flex items-center justify-center gap-2 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">
            Upps kategori kosong..
          </li>
        ) : (
          filteredApps.map((category) => (
            <li
              key={category.id}
              className="flex flex-col gap-4 rounded-lg border p-4 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{category.name}</h2>
                <CategoriesActions category={category} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  {category.products.length > 0
                    ? "Produk yang ada di kategori ini:"
                    : "Belum ada produk untuk kategori ini."}
                </span>

                {category.products.length > 0 ? (
                  <AvatarGroup>
                    {category.products
                      .slice(0, MAX_VISIBLE_PRODUCTS)
                      .map((product) => (
                        <Tooltip key={product.id}>
                          <TooltipTrigger className="cursor-default">
                            <Avatar
                              size="lg"
                              className="border border-black bg-white grayscale transition hover:grayscale-0"
                            >
                              <AvatarImage
                                src={product.imageUrl ?? ""}
                                alt={product.name}
                              />
                              <AvatarFallback>
                                {product.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={8}>
                            <span>{product.name}</span>
                          </TooltipContent>
                        </Tooltip>
                      ))}

                    {category.products.length > MAX_VISIBLE_PRODUCTS && (
                      <AvatarGroupCount className="size-10">
                        +{category.products.length - MAX_VISIBLE_PRODUCTS}
                      </AvatarGroupCount>
                    )}
                  </AvatarGroup>
                ) : (
                  <AvatarGroup>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href="/dashboard/products">
                          <AvatarGroupCount className="size-10">
                            <PlusIcon />
                          </AvatarGroupCount>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        Tambahkan produk ke kategori ini.
                      </TooltipContent>
                    </Tooltip>
                  </AvatarGroup>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
};
