"use client";
import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";
import { ProductsPrimaryButtons } from "../components/products-primary-button";
import { useRouter } from "next/router";
import { ProductsForm } from "../components/products-form";
import { api } from "@/lib/utils";

const PAGE_CONTENT = {
  ADD: {
    title: "Tambah Produk",
    description: "Buat produk baru untuk ditampilkan di etalase Anda.",
  },
  EDIT: {
    title: "Edit Product",
    description: "Ubah produk untuk ditampilkan di etalase Anda.",
  },
};
const ProductsFormPage = () => {
  const router = useRouter();

  const {
    query: { id },
  } = router;

  const { data } = api.product.getOne.useQuery(
    { id: id as string },
    {
      enabled: id !== "new",
    },
  );
  return (
    <DashboardPageLayout>
      <HeadMetaData
        title="Products"
        metaDescription="Manage all your listed products in one place."
      />
      <AppHeader>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </AppHeader>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {id === "new" ? PAGE_CONTENT.ADD.title : PAGE_CONTENT.EDIT.title}
            </h1>
            <p className="text-muted-foreground">
              {id === "new"
                ? PAGE_CONTENT.ADD.description
                : PAGE_CONTENT.EDIT.description}
            </p>
          </div>
          <ProductsPrimaryButtons isFormPage />
        </div>
        <ProductsForm
          mode={id === "new" ? "create" : "edit"}
          initialData={{
            id: data?.id ?? "",
            name: data?.name,
            description: data?.description,
            price: data?.price,
            imageUrl: data?.imageUrl,
            categoryId: data?.categoryId,
          }}
        />
      </Main>
    </DashboardPageLayout>
  );
};

export default ProductsFormPage;
