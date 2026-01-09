import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";

const OrdersPage = () => {
  return (
    <DashboardPageLayout>
      <HeadMetaData
        title="Orders"
        metaDescription="Manage all your listed products in one place."
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
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your orders in a single table.
          </p>
        </div>
      </Main>
    </DashboardPageLayout>
  );
};

export default OrdersPage;
