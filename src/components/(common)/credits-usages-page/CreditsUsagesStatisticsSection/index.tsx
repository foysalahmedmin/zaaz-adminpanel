import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TCreditsUsage } from "@/types/credits-usage.type";
import React from "react";

type TCreditsUsagesStatisticsSectionProps = {
  data?: TCreditsUsage[];
  meta?: {
    total?: number;
    statistics?: {
      total_cost_credits: number;
      total_profit: number;
      total_rounding: number;
      total_credits: number;
      total_price: number;
      total_input_tokens: number;
      total_output_tokens: number;
    };
  };
};

const CreditsUsagesStatisticsSection: React.FC<
  TCreditsUsagesStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalCost = meta?.statistics?.total_cost_credits || 0;
  const totalProfit = meta?.statistics?.total_profit || 0;
  const totalCredits = meta?.statistics?.total_credits || 0;
  const totalPrice = meta?.statistics?.total_price || 0;
  const totalTokens =
    (meta?.statistics?.total_input_tokens || 0) +
    (meta?.statistics?.total_output_tokens || 0);

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Usages",
      subtitle: "Includes all logged usages",
      description: "Overall count of AI feature usages.",
      icon: "activity",
    },
    {
      value: totalTokens.toLocaleString(),
      title: "Total Tokens",
      subtitle: "Input + Output",
      description: "Combined token consumption across all usages.",
      icon: "cpu",
    },
    {
      value: totalCredits.toFixed(2),
      title: "Total Credits",
      subtitle: "Sum of all charges",
      description: "Total credits deducted from all users.",
      icon: "wallet",
    },
    {
      value: totalCost.toFixed(2),
      title: "Production Cost",
      subtitle: "Credits base cost",
      description: "Total credits cost before profit application.",
      icon: "banknote",
    },
    {
      value: totalProfit.toFixed(2),
      title: "Total Profit",
      subtitle: "Margin focus",
      description: "Direct profit from percentage.",
      icon: "trending-up",
    },
    {
      value: (meta?.statistics?.total_rounding || 0).toFixed(2),
      title: "Rounding Surplus",
      subtitle: "Extra from ceil",
      description: "Accumulated rounding credits.",
      icon: "plus-circle",
    },
    {
      value: `$${totalPrice.toFixed(4)}`,
      title: "Total Value",
      subtitle: "Revenue in USD",
      description: "Total equivalent dollar value of usage.",
      icon: "dollar-sign",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default CreditsUsagesStatisticsSection;
