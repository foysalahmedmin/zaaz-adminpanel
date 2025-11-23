import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import React from "react";

type TokenTransactionsStatisticsSectionProps = {
  data?: TTokenTransaction[];
};

const TokenTransactionsStatisticsSection: React.FC<
  TokenTransactionsStatisticsSectionProps
> = ({ data }) => {
  const total = data?.length || 0;
  const totalIncrease = data?.filter((d) => d?.type === "increase").length || 0;
  const totalDecrease = data?.filter((d) => d?.type === "decrease").length || 0;
  const totalTokens = data?.reduce((sum, d) => sum + (d?.token || 0), 0) || 0;

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
      value: totalTokens,
      title: "Total Tokens",
      subtitle: "Across all transactions",
      description: "Sum of tokens in all transactions.",
      icon: "wallet",
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
