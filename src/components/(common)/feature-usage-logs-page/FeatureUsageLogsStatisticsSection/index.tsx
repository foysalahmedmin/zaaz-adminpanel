import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import React from "react";

type FeatureUsageLogsStatisticsSectionProps = {
  data?: unknown[];
  meta?: {
    total?: number;
    statistics?: {
      success?: number;
      failed?: number;
    };
  };
};

const FeatureUsageLogsStatisticsSection: React.FC<
  FeatureUsageLogsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalSuccess = meta?.statistics?.success || 0;
  const totalFailed = meta?.statistics?.failed || 0;

  const statsList: { item: TStatistic; className?: string }[] = [
    {
      item: {
        value: total,
        title: "Total Usage Logs",
        subtitle: "All API calls",
        description: "Total number of feature usage records logged.",
        icon: "file-text",
      },
    },
    {
      item: {
        value: totalSuccess,
        title: "Success Calls",
        subtitle: "Completed successfully",
        description: "Number of successful API transactions.",
        icon: "check-circle",
      },
      className: "[--accent:green]",
    },
    {
      item: {
        value: totalFailed,
        title: "Failed Calls",
        subtitle: "Error responses",
        description: "Number of failed API transactions.",
        icon: "x-circle",
      },
      className: "[--accent:red]",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
      {statsList.map((stat, index) => (
        <StatisticCard
          key={index}
          item={stat.item}
          className={stat.className}
        />
      ))}
    </div>
  );
};

export default FeatureUsageLogsStatisticsSection;
