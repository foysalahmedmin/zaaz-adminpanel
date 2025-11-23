"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardPaymentMethod } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type PaymentMethodChartProps = {
  data?: TDashboardPaymentMethod;
};

const chartConfig = {
  transaction_count: {
    label: "Transactions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  data = [],
}) => {
  const chartData = data.map((item) => ({
    name: item.method_name,
    transaction_count: item.transaction_count,
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
          dataKey="transaction_count"
          fill="var(--color-transaction_count)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default PaymentMethodChart;

