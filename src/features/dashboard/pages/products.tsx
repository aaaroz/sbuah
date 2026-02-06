import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";
import { ProductsPrimaryButtons } from "../components/products/products-primary-button";
import { ProductsTable } from "../components/products/products-table";
import { ProductsProvider } from "../components/products/products-provider";

const ProductsPage = () => {
  return (
    <ProductsProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Manage all your listed products in one place.
              </p>
            </div>
            <ProductsPrimaryButtons />
          </div>
          <ProductsTable />
        </Main>
      </DashboardPageLayout>
    </ProductsProvider>
  );
};

export default ProductsPage;
