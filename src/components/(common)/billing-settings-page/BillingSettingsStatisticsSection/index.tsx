import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TBillingSetting } from "@/types/billing-setting.type";
import React from "react";

type BillingSettingsStatisticsSectionProps = {
  data?: TBillingSetting[];
  meta?: {
    total?: number;
  };
};

const BillingSettingsStatisticsSection: React.FC<
  BillingSettingsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Settings",
      subtitle: "All records",
      description: "Total number of billing settings.",
      icon: "settings",
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default BillingSettingsStatisticsSection;
