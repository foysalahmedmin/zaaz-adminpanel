"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardTransactionStatus } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type TransactionStatusChartProps = {
  data?: TDashboardTransactionStatus;
};

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const TransactionStatusChart: React.FC<TransactionStatusChartProps> = ({
  data = [],
}) => {
  const chartData = data.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: item.count,
    percentage: item.percentage,
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
          dataKey="count"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default TransactionStatusChart;

