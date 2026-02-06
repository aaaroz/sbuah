import { api } from "@/lib/utils/api";
import { OrderCard } from "./dashboard-order-card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentOrders() {
  const { data, isLoading } = api.dashboard.getRecentOrders.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-md" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Belum ada pesanan terbaru.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((order) => (
        <OrderCard
          key={order.id}
          orderNumber={order.orderNumber}
          buyerName={order.buyerName}
          phoneNumber={order.phoneNumber}
          status={order.status}
          totalAmount={Number(order.totalAmount)}
          createdAt={order.createdAt}
        />
      ))}
    </div>
  );
}
