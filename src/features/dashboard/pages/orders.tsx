import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";
import { OrdersViews } from "../components/orders/orders-views";
import { OrdersProvider } from "../components/orders/orders-provider";

const OrdersPage = () => {
  return (
    <OrdersProvider>
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
        <Main fixed className="relative">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage your orders here.</p>
          </div>
          <OrdersViews />
        </Main>
      </DashboardPageLayout>
    </OrdersProvider>
  );
};

export default OrdersPage;
