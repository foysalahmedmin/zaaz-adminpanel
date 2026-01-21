import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TDashboardStatistics } from "@/types/dashboard.type";
import React from "react";

type DashboardStatisticsSectionProps = {
  data?: TDashboardStatistics;
};

const DashboardStatisticsSection: React.FC<DashboardStatisticsSectionProps> = ({
  data,
}) => {
  if (!data) return null;

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const statistics: TStatistic[] = [
    {
      value: formatCurrency(data.total_revenue.total_usd_equivalent),
      title: "Total Revenue",
      subtitle: "All successful payments",
      description: "Total revenue from all completed transactions",
      icon: "dollar-sign",
      trend: data.trends.revenue
        ? {
            type: data.trends.revenue.type,
            value: `${data.trends.revenue.percentage.toFixed(1)}%`,
            label: "vs last month",
          }
        : undefined,
    },
    {
      value: formatNumber(data.total_users),
      title: "Total Users",
      subtitle: "Active users",
      description: "Total number of active users in the system",
      icon: "users",
      trend: data.trends.users
        ? {
            type: data.trends.users.type,
            value: `${data.trends.users.percentage.toFixed(1)}%`,
            label: "vs last month",
          }
        : undefined,
    },
    {
      value: formatNumber(data.total_transactions),
      title: "Total Transactions",
      subtitle: "All transactions",
      description: "Total number of payment transactions",
      icon: "credit-card",
      trend: data.trends.transactions
        ? {
            type: data.trends.transactions.type,
            value: `${data.trends.transactions.percentage.toFixed(1)}%`,
            label: "vs last month",
          }
        : undefined,
    },
    {
      value: formatNumber(data.total_credits),
      title: "Total Credits",
      subtitle: "In circulation",
      description: "Total credits across all user wallets",
      icon: "coins",
      trend: data.trends.credits
        ? {
            type: data.trends.credits.type,
            value: `${data.trends.credits.percentage.toFixed(1)}%`,
            label: "vs last month",
          }
        : undefined,
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

export default DashboardStatisticsSection;
