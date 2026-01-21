import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TFeaturePopup } from "@/types/feature-popup.type";
import React from "react";

type FeaturePopupsStatisticsSectionProps = {
  data?: TFeaturePopup[];
  meta?: {
    total?: number;
    statistics?: {
      active?: number;
      inactive?: number;
      single_time?: number;
      multi_time?: number;
    };
  };
};

const FeaturePopupsStatisticsSection: React.FC<
  FeaturePopupsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalActive = meta?.statistics?.active || 0;
  const totalInactive = meta?.statistics?.inactive || 0;
  const totalSingleTime = meta?.statistics?.single_time || 0;
  const totalMultiTime = meta?.statistics?.multi_time || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Popups",
      subtitle: "Includes all popups",
      description: "Overall count of feature popups in the system.",
      icon: "popup",
    },
    {
      value: totalActive,
      title: "Active Popups",
      subtitle: "Currently active",
      description: "Popups that are active and will be displayed.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Popups",
      subtitle: "Currently inactive",
      description: "Popups that are disabled.",
      icon: "x-circle",
    },
    {
      value: totalSingleTime,
      title: "Single-Time",
      subtitle: "Show once per session",
      description: "Popups that show only once per user session.",
      icon: "clock",
    },
    {
      value: totalMultiTime,
      title: "Multi-Time",
      subtitle: "Can show multiple times",
      description: "Popups that can be shown multiple times.",
      icon: "repeat",
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default FeaturePopupsStatisticsSection;

