import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import React from "react";

type RecycleBinStatisticsSectionProps = {
  statistics: {
    features: number;
    featureEndpoints: number;
    packages: number;
    creditsProfits: number;
    users: number;
  };
  total: number;
};

const RecycleBinStatisticsSection: React.FC<
  RecycleBinStatisticsSectionProps
> = ({ statistics, total }) => {
  const stats: TStatistic[] = [
    {
      value: total,
      title: "Total Deleted",
      subtitle: "All soft-deleted items",
      description: "Total count of all soft-deleted items across all modules.",
      icon: "trash",
    },
    {
      value: statistics.features,
      title: "Deleted Features",
      subtitle: "Features in recycle bin",
      description: "Soft-deleted features that can be restored.",
      icon: "layout-template",
    },
    {
      value: statistics.packages,
      title: "Deleted Packages",
      subtitle: "Packages in recycle bin",
      description: "Soft-deleted packages that can be restored.",
      icon: "package",
    },
    {
      value: statistics.users,
      title: "Deleted Users",
      subtitle: "Users in recycle bin",
      description: "Soft-deleted users that can be restored.",
      icon: "users",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default RecycleBinStatisticsSection;
