import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { TMeta } from "@/types/response.type";
import React from "react";

type PaymentMethodsStatisticsSectionProps = {
  data?: TPaymentMethod[];
  meta?: TMeta;
};

const PaymentMethodsStatisticsSection: React.FC<
  PaymentMethodsStatisticsSectionProps
> = ({ data = [], meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalActive =
    meta?.statistics?.active ||
    data?.filter((d) => d?.is_active === true).length ||
    0;
  const totalInactive = meta?.statistics?.inactive || total - totalActive || 0;
  const totalTest =
    meta?.statistics?.test ||
    data?.filter((d) => d?.is_test === true).length ||
    0;
  const totalUSD =
    meta?.statistics?.usd ||
    data?.filter((d) => d?.currency === "USD").length ||
    0;
  const totalBDT =
    meta?.statistics?.bdt ||
    data?.filter((d) => d?.currency === "BDT").length ||
    0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Payment Methods",
      subtitle: "Includes all methods",
      description: "Overall count of payment methods in the system.",
      icon: "credit-card",
    },
    {
      value: totalActive,
      title: "Active Methods",
      subtitle: "Currently active",
      description: "Payment methods that are active and available.",
      icon: "check-circle",
    },
    {
      value: totalInactive,
      title: "Inactive Methods",
      subtitle: "Currently inactive",
      description: "Payment methods that are disabled.",
      icon: "x-circle",
    },
    {
      value: totalTest,
      title: "Test Mode",
      subtitle: "In test mode",
      description: "Payment methods configured for testing.",
      icon: "flask",
    },
    {
      value: totalUSD,
      title: "USD Methods",
      subtitle: "USD currency",
      description: "Payment methods supporting USD currency.",
      icon: "dollar-sign",
    },
    {
      value: totalBDT,
      title: "BDT Methods",
      subtitle: "BDT currency",
      description: "Payment methods supporting BDT currency.",
      icon: "coins",
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default PaymentMethodsStatisticsSection;
