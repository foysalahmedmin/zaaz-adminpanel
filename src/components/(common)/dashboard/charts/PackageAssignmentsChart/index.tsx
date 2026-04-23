"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardPackageAssignments } from "@/types/dashboard.type";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type PackageAssignmentsChartProps = {
  data?: TDashboardPackageAssignments;
};

const chartConfig = {
  count: {
    label: "Assignments",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const PackageAssignmentsChart: React.FC<PackageAssignmentsChartProps> = ({
  data = [],
}) => {
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
        No package assignment data for this period
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-count)"
          fill="var(--color-count)"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PackageAssignmentsChart;
