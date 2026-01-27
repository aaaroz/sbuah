import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import DashboardPageLayout from "@/components/layouts/dashboard-page-layout";
import AppHeader from "@/components/layouts/app-header";
import { Search } from "@/components/commons/search";
import { ProfileDropdown } from "@/components/commons/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "@/components/layouts/main";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "../components/dashboard-overview";
import { RecentOrders } from "../components/dashboard-recent-order";
import { DashboardStatCard } from "../components/dashboard-stat-card";
import { api } from "@/lib/utils/api";

const DashboardPage = () => {
  const { data, isLoading } = api.dashboard.getStats.useQuery();

  return (
    <DashboardPageLayout>
      <HeadMetaData
        title="Dashboard"
        metaDescription="Ringkasan performa toko Anda, mencakup pendapatan, total penjualan, pesanan terbaru, jumlah ulasan, dan total pesanan."
      />
      <AppHeader>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </AppHeader>
      <Main fixed>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan performa toko Anda, mencakup pendapatan, total penjualan,
            pesanan terbaru, jumlah ulasan, dan total pesanan.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard
              title="Total Pendapatan"
              value={`Rp${data?.revenue.value.toLocaleString("id-ID")}`}
              description={`${data?.revenue.change.toFixed(1)}% dibanding bulan lalu`}
              isLoading={isLoading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />

            <DashboardStatCard
              title="Total Penjualan"
              value={`${data?.sales.value.toLocaleString("id-ID")}`}
              valueSuffix=" Penjualan"
              description={`${data?.sales.change.toFixed(1)}% dibanding bulan lalu`}
              isLoading={isLoading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              }
            />

            <DashboardStatCard
              title="Total Ulasan"
              value={`${data?.reviews.value.toLocaleString("id-ID")}`}
              valueSuffix=" Ulasan"
              description={`${data?.reviews.change.toFixed(1)}% dibanding bulan lalu`}
              isLoading={isLoading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              }
            />

            <DashboardStatCard
              title="Rating"
              value={`${data?.rating.value.toFixed(1)}/`}
              valueSuffix="5.0"
              description={`${data?.rating.change.toFixed(1)}% dibanding bulan lalu`}
              isLoading={isLoading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Ringkasan Penjualan</CardTitle>
              </CardHeader>
              <CardContent className="ps-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Penjualan Terbaru</CardTitle>
                <CardDescription>
                  Anda mencatat 265 penjualan bulan ini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentOrders />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </DashboardPageLayout>
  );
};

export default DashboardPage;
