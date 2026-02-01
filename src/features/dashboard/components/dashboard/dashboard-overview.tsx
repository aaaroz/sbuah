import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/utils/api";
import { formatRupiahShort } from "@/lib/utils/format-rupiah-short";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function Overview() {
  const { data, isLoading } = api.dashboard.getOverview.useQuery();

  const chartConfig = {
    total: {
      label: "Pendapatan Bulanan",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full px-2">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction="ltr"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatRupiahShort}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

const OverviewSkeleton = () => {
  return (
    <div className="flex h-[350px] w-full items-end gap-3 px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-full"
          style={{
            height: `${Math.random() * 60 + 40}%`,
          }}
        />
      ))}
    </div>
  );
};
