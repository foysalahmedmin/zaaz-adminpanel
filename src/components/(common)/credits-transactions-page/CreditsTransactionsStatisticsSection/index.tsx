import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import React from "react";

type TCreditsTransactionsStatisticsSectionProps = {
  data?: TCreditsTransaction[];
  meta?: {
    total?: number;
    statistics?: {
      increase?: number;
      decrease?: number;
      from_payment?: number;
      from_bonus?: number;
    };
  };
};

const CreditsTransactionsStatisticsSection: React.FC<
  TCreditsTransactionsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalIncrease = meta?.statistics?.increase || 0;
  const totalDecrease = meta?.statistics?.decrease || 0;
  const fromPayment = meta?.statistics?.from_payment || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Transactions",
      subtitle: "Includes all transactions",
      description: "Overall count of credits transactions.",
      icon: "coins",
    },
    {
      value: totalIncrease,
      title: "Increases",
      subtitle: "Credits additions",
      description: "Transactions that increased credits balance.",
      icon: "arrow-up",
    },
    {
      value: totalDecrease,
      title: "Decreases",
      subtitle: "Credits deductions",
      description: "Transactions that decreased credits balance.",
      icon: "arrow-down",
    },
    {
      value: fromPayment,
      title: "From Payment",
      subtitle: "Payment-based increases",
      description: "Number of increases from payment transactions.",
      icon: "credit-card",
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

export default CreditsTransactionsStatisticsSection;
