"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardCreditsFlow } from "@/types/dashboard.type";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type CreditsFlowChartProps = {
  data?: TDashboardCreditsFlow;
};

const chartConfig = {
  increase: {
    label: "Increase",
    color: "hsl(142, 76%, 36%)",
  },
  decrease: {
    label: "Decrease",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

const CreditsFlowChart: React.FC<CreditsFlowChartProps> = ({ data = [] }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
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
        <Line
          type="monotone"
          dataKey="increase"
          stroke="var(--color-increase)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="decrease"
          stroke="var(--color-decrease)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default CreditsFlowChart;
