import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";
import { CategoriesViews } from "../components/categories-views";
import { CategoriesPrimaryButtons } from "../components/categories-primary-buttons";

const CategoriesPage = () => {
  return (
    <DashboardPageLayout>
      <HeadMetaData
        title="Categories"
        metaDescription="Manage all your product categories in one place."
      />
      <AppHeader>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </AppHeader>
      <Main fixed className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage all your product categories in one place.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesViews />
      </Main>
    </DashboardPageLayout>
  );
};

export default CategoriesPage;
