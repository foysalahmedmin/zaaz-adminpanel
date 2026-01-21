import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import React from "react";

type CouponsStatisticsSectionProps = {
  meta?: {
    total?: number;
    statistics?: Record<string, number>;
  };
};

const CouponsStatisticsSection: React.FC<CouponsStatisticsSectionProps> = ({
  meta,
}) => {
  const total = meta?.total || 0;
  const activeCount = meta?.statistics?.active || 0;
  const expiredCount = meta?.statistics?.expired || 0;
  const totalUsage = meta?.statistics?.total_usage || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Coupons",
      subtitle: "Includes all coupons",
      description: "Overall count of coupons in the system.",
      icon: "ticket",
    },
    {
      value: activeCount,
      title: "Active Coupons",
      subtitle: "Currently active",
      description: "Coupons that are active and available.",
      icon: "check-circle",
    },
    {
      value: expiredCount,
      title: "Expired Coupons",
      subtitle: "Past validity date",
      description: "Coupons that have reached their expiry date.",
      icon: "calendar-x",
    },
    {
      value: totalUsage,
      title: "Total Usage",
      subtitle: "Redemption count",
      description: "Total times coupons have been used.",
      icon: "shopping-bag",
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

export default CouponsStatisticsSection;
