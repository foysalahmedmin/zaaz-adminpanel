import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TFeature } from "@/types/feature.type";
import React from "react";

type FeaturesStatisticsSectionProps = {
  data?: TFeature[];
  meta?: {
    total?: number;
    statistics?: {
      active?: number;
      inactive?: number;
      with_parent?: number;
    };
  };
};

const FeaturesStatisticsSection: React.FC<FeaturesStatisticsSectionProps> = ({
  data,
  meta,
}) => {
  const total = meta?.total || data?.length || 0;
  const totalActive = meta?.statistics?.active || 0;
  const totalInactive = meta?.statistics?.inactive || 0;
  const totalWithParent = meta?.statistics?.with_parent || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Features",
      subtitle: "Includes all features",
      description: "Overall count of features in the system.",
      icon: "zap",
    },
    {
      value: totalActive,
      title: "Active Features",
      subtitle: "Currently active",
      description: "Features that are active and available.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Features",
      subtitle: "Currently inactive",
      description: "Features that are disabled.",
      icon: "x-circle",
    },
    {
      value: totalWithParent,
      title: "Child Features",
      subtitle: "With parent",
      description: "Features that have a parent feature.",
      icon: "folder-tree",
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

export default FeaturesStatisticsSection;
