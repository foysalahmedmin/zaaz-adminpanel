"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardFeaturePerformance } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type FeaturePerformanceChartProps = {
  data?: TDashboardFeaturePerformance;
};

const chartConfig = {
  usage_count: {
    label: "Usage Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const FeaturePerformanceChart: React.FC<FeaturePerformanceChartProps> = ({
  data = [],
}) => {
  const chartData = data.map((item) => ({
    name: item.feature_name,
    usage_count: item.usage_count,
    total_tokens_used: item.total_tokens_used,
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
          dataKey="usage_count"
          fill="var(--color-usage_count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default FeaturePerformanceChart;
