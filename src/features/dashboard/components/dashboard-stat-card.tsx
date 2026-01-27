import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string;
  valueSuffix?: string;
  description: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export const DashboardStatCard = ({
  title,
  value,
  valueSuffix,
  description,
  icon,
  isLoading = false,
}: DashboardStatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-24" /> : title}
        </CardTitle>

        {isLoading ? <Skeleton className="size-6 rounded-full" /> : icon}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {value}

              {valueSuffix && (
                <span className="text-sm text-muted-foreground">
                  {valueSuffix}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
