import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import React from "react";

type PaymentTransactionsStatisticsSectionProps = {
  data?: TPaymentTransaction[];
  meta?: {
    total?: number;
    statistics?: {
      success?: number;
      pending?: number;
      failed?: number;
    };
  };
};

const PaymentTransactionsStatisticsSection: React.FC<
  PaymentTransactionsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalSuccess = meta?.statistics?.success || 0;
  const totalPending = meta?.statistics?.pending || 0;
  const totalFailed = meta?.statistics?.failed || 0;

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

