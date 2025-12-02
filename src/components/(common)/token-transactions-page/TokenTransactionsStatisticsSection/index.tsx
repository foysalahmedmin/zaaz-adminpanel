import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import React from "react";

type TokenTransactionsStatisticsSectionProps = {
  data?: TTokenTransaction[];
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

const TokenTransactionsStatisticsSection: React.FC<
  TokenTransactionsStatisticsSectionProps
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
      description: "Overall count of token transactions.",
      icon: "coins",
    },
    {
      value: totalIncrease,
      title: "Increases",
      subtitle: "Token additions",
      description: "Transactions that increased token balance.",
      icon: "arrow-up",
    },
    {
      value: totalDecrease,
      title: "Decreases",
      subtitle: "Token deductions",
      description: "Transactions that decreased token balance.",
      icon: "arrow-down",
    },
    {
      value: fromPayment,
      title: "From Payment",
      subtitle: "Payment-based increases",
      description: "Token increases from payment transactions.",
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

export default TokenTransactionsStatisticsSection;
