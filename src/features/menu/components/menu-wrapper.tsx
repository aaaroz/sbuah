"use client";

import * as React from "react";

import { MenuCard } from "@/components/commons/menu-card";
import { useProductStore } from "@/lib/stores/product-store";
import { api } from "@/lib/utils/api";
import { CustomPagination } from "@/components/layouts/custom-pagination";
import { useSearchParams } from "next/navigation";

export const MenuWrapper = () => {
  const {
    products,
    pagination,
    loading,
    setLoading,
    setError,
    setProducts,
    setPagination,
  } = useProductStore();
  const searchParams = useSearchParams();
  const pageNumberLimit = 5;
  const currentPage = Number(searchParams?.get("page")) || 1;

  const totalPages = pagination?.totalPages ?? 1;

  const { data, isLoading, error } = api.product.getAll.useQuery({
    page: currentPage,
    limit: 5,
  });

  // Initial load
  React.useEffect(() => {
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
    return (
      <p className="py-10 text-center text-muted-foreground">Loading...</p>
    );
  }

  return (
    <>
      {/* Grid of Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
          <MenuCard
            key={item.id}
            imageUrl={item.imageUrl!}
            title={item.name}
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
