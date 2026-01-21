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
      title: "Total Users",
      subtitle: "All registered users",
      description: "Overall count of users in the system.",
      icon: "users",
    },
    {
      value: totalAuthor,
      title: "Admins & Authors",
      subtitle: "Privileged accounts",
      description: "Count of users with administrative or author roles.",
      icon: "shield-check",
    },
    {
      value: totalActive,
      title: "In-Progress",
      subtitle: "Active users",
      description: "Users who are currently active in the system.",
      icon: "user-check",
    },
    {
      value: totalInactive,
      title: "Blocked",
      subtitle: "Restricted accounts",
      description: "Users who are currently blocked from access.",
      icon: "user-x",
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
