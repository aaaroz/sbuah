import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";

const DashboardPage = () => {
  return (
    <DashboardPageLayout>
      <HeadMetaData
        title="Dashboard"
        metaDescription="Overview of your store: revenue, total sales, recent orders, total reviews, and total orders."
      />
      <AppHeader>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </AppHeader>
      <Main fixed>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store: revenue, total sales, recent orders, total
            reviews, and total orders.
          </p>
        </div>
      </Main>
    </DashboardPageLayout>
  );
};

export default DashboardPage;
