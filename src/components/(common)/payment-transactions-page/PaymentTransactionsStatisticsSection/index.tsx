import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import React from "react";

type PaymentTransactionsStatisticsSectionProps = {
  data?: TPaymentTransaction[];
};

const PaymentTransactionsStatisticsSection: React.FC<
  PaymentTransactionsStatisticsSectionProps
> = ({ data }) => {
  const total = data?.length || 0;
  const totalSuccess =
    data?.filter((d) => d?.status === "success").length || 0;
  const totalPending =
    data?.filter((d) => d?.status === "pending").length || 0;
  const totalFailed =
    data?.filter((d) => d?.status === "failed").length || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Transactions",
      subtitle: "Includes all transactions",
      description: "Overall count of payment transactions.",
      icon: "credit-card",
    },
    {
      value: totalSuccess,
      title: "Successful",
      subtitle: "Completed payments",
      description: "Transactions that were completed successfully.",
      icon: "check-circle",
    },
    {
      value: totalPending,
      title: "Pending",
      subtitle: "Awaiting payment",
      description: "Transactions that are pending completion.",
      icon: "clock",
    },
    {
      value: totalFailed,
      title: "Failed",
      subtitle: "Unsuccessful payments",
      description: "Transactions that failed or were cancelled.",
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

export default PaymentTransactionsStatisticsSection;

