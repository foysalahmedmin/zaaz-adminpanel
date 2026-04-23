"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/Chart";
import type { TDashboardAiModelUsage } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type AiModelUsageChartProps = {
  data?: TDashboardAiModelUsage;
};

const chartConfig = {
  usage_count: {
    label: "Calls",
    color: "hsl(var(--chart-1))",
  },
  total_credits_charged: {
    label: "Credits",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const AiModelUsageChart: React.FC<AiModelUsageChartProps> = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.model_name,
    provider: item.provider,
    usage_count: item.usage_count,
    total_credits_charged: item.total_credits_charged,
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
        No AI model usage data yet
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={-30}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          yAxisId="calls"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.toLocaleString()}
          width={50}
        />
        <YAxis
          yAxisId="credits"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.toLocaleString()}
          width={60}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          yAxisId="calls"
          dataKey="usage_count"
          fill="var(--color-usage_count)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="credits"
          dataKey="total_credits_charged"
          fill="var(--color-total_credits_charged)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default AiModelUsageChart;
