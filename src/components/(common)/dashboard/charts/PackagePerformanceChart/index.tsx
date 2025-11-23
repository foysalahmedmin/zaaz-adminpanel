"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardPackagePerformance } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type PackagePerformanceChartProps = {
  data?: TDashboardPackagePerformance;
};

const chartConfig = {
  purchase_count: {
    label: "Purchases",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const PackagePerformanceChart: React.FC<PackagePerformanceChartProps> = ({
  data = [],
}) => {
  const chartData = data.map((item) => ({
    name: item.package_name,
    purchase_count: item.purchase_count,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={-45}
          textAnchor="end"
          height={80}
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
        <Bar
          dataKey="purchase_count"
          fill="var(--color-purchase_count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default PackagePerformanceChart;

