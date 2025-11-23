"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardTransactionStatus } from "@/types/dashboard.type";
import { Cell, Pie, PieChart } from "recharts";

type TransactionStatusChartProps = {
  data?: TDashboardTransactionStatus;
};

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(142, 76%, 36%)",
  },
  pending: {
    label: "Pending",
    color: "hsl(45, 93%, 47%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
  refunded: {
    label: "Refunded",
    color: "hsl(24, 95%, 53%)",
  },
} satisfies ChartConfig;

const COLORS = {
  success: "hsl(142, 76%, 36%)",
  pending: "hsl(45, 93%, 47%)",
  failed: "hsl(0, 84%, 60%)",
  refunded: "hsl(24, 95%, 53%)",
};

const TransactionStatusChart: React.FC<TransactionStatusChartProps> = ({
  data = [],
}) => {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                COLORS[entry.name as keyof typeof COLORS] ||
                "hsl(var(--muted))"
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default TransactionStatusChart;

