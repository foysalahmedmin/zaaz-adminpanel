"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardUserGrowth } from "@/types/dashboard.type";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type UserGrowthChartProps = {
  data?: TDashboardUserGrowth;
};

const chartConfig = {
  count: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data = [] }) => {
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
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
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
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default UserGrowthChart;

