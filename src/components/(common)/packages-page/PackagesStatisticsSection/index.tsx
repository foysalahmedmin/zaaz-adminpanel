import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TPackage } from "@/types/package.type";
import React from "react";

type PackagesStatisticsSectionProps = {
  data?: TPackage[];
};

const PackagesStatisticsSection: React.FC<PackagesStatisticsSectionProps> = ({
  data,
}) => {
  const total = data?.length || 0;
  const totalActive =
    data?.filter((d) => d?.is_active === true).length || 0;
  const totalInactive =
    data?.filter((d) => d?.is_active === false).length || 0;
  const totalTokens = data?.reduce((sum, d) => sum + (d?.token || 0), 0) || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Packages",
      subtitle: "Includes all packages",
      description: "Overall count of packages in the system.",
      icon: "package",
    },
    {
      value: totalActive,
      title: "Active Packages",
      subtitle: "Currently active",
      description: "Packages that are active and available.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Packages",
      subtitle: "Currently inactive",
      description: "Packages that are disabled.",
      icon: "x-circle",
    },
    {
      value: totalTokens,
      title: "Total Tokens",
      subtitle: "Across all packages",
      description: "Sum of tokens in all packages.",
      icon: "coins",
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

export default PackagesStatisticsSection;

