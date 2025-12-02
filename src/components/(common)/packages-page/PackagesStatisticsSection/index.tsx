import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TPackage } from "@/types/package.type";
import React from "react";

type PackagesStatisticsSectionProps = {
  data?: TPackage[];
  meta?: {
    total?: number;
    statistics?: {
      active?: number;
      inactive?: number;
      initial?: number;
    };
  };
};

const PackagesStatisticsSection: React.FC<PackagesStatisticsSectionProps> = ({
  data,
  meta,
}) => {
  const total = meta?.total || data?.length || 0;
  const totalActive = meta?.statistics?.active || 0;
  const totalInactive = meta?.statistics?.inactive || 0;
  const totalInitial = meta?.statistics?.initial || 0;

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
      value: totalInitial,
      title: "Initial Packages",
      subtitle: "Default packages",
      description: "Packages marked as initial/default.",
      icon: "star",
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
