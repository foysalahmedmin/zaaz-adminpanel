import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TFeature } from "@/types/feature.type";
import React from "react";

type FeaturesStatisticsSectionProps = {
  data?: TFeature[];
};

const FeaturesStatisticsSection: React.FC<FeaturesStatisticsSectionProps> = ({
  data,
}) => {
  const total = data?.length || 0;
  const totalActive =
    data?.filter((d) => d?.is_active === true).length || 0;
  const totalInactive =
    data?.filter((d) => d?.is_active === false).length || 0;
  const totalWithParent =
    data?.filter((d) => d?.parent).length || 0;

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

