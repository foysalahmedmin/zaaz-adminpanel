import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TCreditsProfit } from "@/types/credits-profit.type";
import type { TMeta } from "@/types/response.type";
import React from "react";

type CreditsProfitsStatisticsSectionProps = {
  data?: TCreditsProfit[];
  meta?: TMeta;
};

const CreditsProfitsStatisticsSection: React.FC<
  CreditsProfitsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const activeCount =
    meta?.statistics?.active ||
    data?.filter((d) => d?.is_active === true).length ||
    0;
  const inactiveCount =
    meta?.statistics?.inactive ||
    data?.filter((d) => d?.is_active === false).length ||
    0;
  const avgPercentage =
    data && data.length > 0
      ? data.reduce((sum, d) => sum + (d?.percentage || 0), 0) / data.length
      : 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Profits",
      subtitle: "Includes all profit settings",
      description: "Overall count of credits profit settings.",
      icon: "percent",
    },
    {
      value: activeCount,
      title: "Active Profits",
      subtitle: "Currently active",
      description: "Profit settings that are active.",
      icon: "check-circle",
    },
    {
      value: inactiveCount,
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

export default CreditsProfitsStatisticsSection;
