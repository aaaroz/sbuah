"use client";

import * as React from "react";

import { MenuCard } from "@/components/commons/menu-card";
import { useProductStore } from "@/lib/stores/product-store";
import { api } from "@/lib/utils/api";
import { CustomPagination } from "@/components/layouts/custom-pagination";
import { useSearchParams } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MenuSquareIcon } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

export const MenuWrapper = () => {
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const loading = useProductStore((state) => state.loading);
  const category = useProductStore((state) => state.selectedCategory);
  const searchQuery = useProductStore((state) => state.searchQuery);

  const setLoading = useProductStore.getState().setLoading;
  const setProducts = useProductStore.getState().setProducts;
  const setError = useProductStore.getState().setError;
  const setPagination = useProductStore.getState().setPagination;

  const searchParams = useSearchParams();
  const pageNumberLimit = 5;
  const currentPage = Number(searchParams?.get("page")) || 1;

  const totalPages = pagination?.totalPages ?? 1;

  const { data, isLoading, error } = api.product.getAll.useQuery({
    searchQuery: searchQuery ?? undefined,
    categoryId: category?.id,
    page: currentPage,
    limit: 6,
  });

  useIsomorphicLayoutEffect(() => {
    setLoading(isLoading);

    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      setProducts(data.items);
      setPagination(data.pagination);
    }
  }, [
    data,
    isLoading,
    error,
    setProducts,
    setPagination,
    setLoading,
    setError,
  ]);

  if (loading) {
    return <p className="py-10 text-center text-muted-foreground">Sabar..</p>;
  }
  if (products.length === 0) {
    return <EmptyMenu />;
  }

  return (
    <>
      {/* Grid of Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
          <MenuCard
            key={item.id}
            id={item.id}
            imageUrl={item.imageUrl!}
            name={item.name}
            description={item.description ?? ""}
            rating={item.stats?.avgRating ?? 0}
            reviews={item.stats?.reviewCount ?? 0}
            price={item.price}
          />
        ))}
      </div>

      {/* Pagination Component */}
      <CustomPagination
        currentPage={currentPage}
        lastPage={totalPages}
        pageNumberLimit={pageNumberLimit}
      />
    </>
  );
};

function EmptyMenu() {
  return (
    <Empty className="h-full bg-gradient-to-b from-muted/50 from-30% to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MenuSquareIcon />
        </EmptyMedia>
        <EmptyTitle>Menu Tidak Ditemukan</EmptyTitle>
        <EmptyDescription>
          Belum ada menu yang cocok. Coba kata kunci lain ya.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
