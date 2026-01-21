import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TAiModel } from "@/types/ai-model.type";
import React from "react";

type AiModelsStatisticsSectionProps = {
  data?: TAiModel[];
  meta?: {
    total?: number;
  };
};

const AiModelsStatisticsSection: React.FC<AiModelsStatisticsSectionProps> = ({
  data,
  meta,
}) => {
  const total = meta?.total || data?.length || 0;
  // Note: Backend might not return statistics breakdown in meta unless implemented.
  // Assuming frontend can calculate from data if paginated? No, pagination means we only see a slice.
  // For now I'll just show Total. If I want active/inactive, I need backend to support it in meta or fetch separate stats.
  // Package service returns stats in meta. I will assume my backend doesn't yet, so I'll stick to total for now,
  // OR I can quickly update backend service to include stats.
  // Package service used `AppAggregationQuery` which doesn't automatically give active/inactive stats unless `execute` is called with filters.
  // In `ai-model.service.ts` I just called `execute()`.

  // I'll stick to Total for now to be safe, or just render 0 for others.

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total AI Models",
      subtitle: "All models",
      description: "Total number of AI models.",
      icon: "cpu",
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

export default AiModelsStatisticsSection;
