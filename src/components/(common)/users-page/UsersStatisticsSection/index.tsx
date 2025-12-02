import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TUser } from "@/types/user.type";
import React from "react";

type UsersStatisticsSectionProps = {
  data?: TUser[];
  meta?: {
    total?: number;
    statistics?: {
      "in-progress"?: number;
      blocked?: number;
      admin?: number;
    };
  };
};

const UsersStatisticsSection: React.FC<UsersStatisticsSectionProps> = ({
  data,
  meta,
}) => {
  const total = meta?.total || data?.length || 0;
  const totalAuthor = meta?.statistics?.admin || 0;
  const totalActive = meta?.statistics?.["in-progress"] || 0;
  const totalInactive = meta?.statistics?.blocked || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Categories",
      subtitle: "Includes all categories",
      description: "Overall count of categories in the system.",
      icon: "folder-open",
    },
    {
      value: totalAuthor,
      title: "Featured Categories",
      subtitle: "Highlighted selection",
      description: "Special categories marked as featured for promotion.",
      icon: "edit2",
    },
    {
      value: totalActive,
      title: "Active Categories",
      subtitle: "Currently active",
      description: "Categories that are active and visible to users.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Categories",
      subtitle: "Currently inactive",
      description: "Categories that are disabled or hidden from users.",
      icon: "x-circle",
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

export default UsersStatisticsSection;
