import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TTokenProfit } from "@/types/token-profit.type";
import React from "react";

type TokenProfitsStatisticsSectionProps = {
  data?: TTokenProfit[];
};

const TokenProfitsStatisticsSection: React.FC<
  TokenProfitsStatisticsSectionProps
> = ({ data }) => {
  const total = data?.length || 0;
  const totalActive =
    data?.filter((d) => d?.is_active === true).length || 0;
  const totalInactive =
    data?.filter((d) => d?.is_active === false).length || 0;
  const avgPercentage =
    data && data.length > 0
      ? data.reduce((sum, d) => sum + (d?.percentage || 0), 0) / data.length
      : 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Profits",
      subtitle: "Includes all profit settings",
      description: "Overall count of token profit settings.",
      icon: "percent",
    },
    {
      value: totalActive,
      title: "Active Profits",
      subtitle: "Currently active",
      description: "Profit settings that are active.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Profits",
      subtitle: "Currently inactive",
      description: "Profit settings that are disabled.",
      icon: "x-circle",
    },
    {
      value: avgPercentage.toFixed(2),
      title: "Average Percentage",
      subtitle: "Across all profits",
      description: "Average profit percentage across all settings.",
      icon: "trending-up",
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default TokenProfitsStatisticsSection;

