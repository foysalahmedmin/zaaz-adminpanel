"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardRevenueData } from "@/types/dashboard.type";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type RevenueChartProps = {
  data?: TDashboardRevenueData;
};

const chartConfig = {
  USD: {
    label: "USD",
    color: "hsl(var(--chart-1))",
  },
  BDT: {
    label: "BDT",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const RevenueChart: React.FC<RevenueChartProps> = ({ data = [] }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
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
          dataKey="USD"
          stackId="1"
          stroke="var(--color-USD)"
          fill="var(--color-USD)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="BDT"
          stackId="1"
          stroke="var(--color-BDT)"
          fill="var(--color-BDT)"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default RevenueChart;

