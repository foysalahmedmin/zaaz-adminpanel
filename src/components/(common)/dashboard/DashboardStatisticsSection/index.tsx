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

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);

  const trend = (t?: { type: "up" | "down" | "neutral"; percentage: number }) =>
    t
      ? {
          type: t.type,
          value: `${t.percentage.toFixed(1)}%`,
          label: "vs last month",
        }
      : undefined;

  const statistics: TStatistic[] = [
    {
      value: fmtUsd(data.monthly_revenue.total_usd_equivalent),
      title: "Monthly Revenue",
      subtitle: `$${fmt(data.monthly_revenue.USD)} USD · ৳${fmt(data.monthly_revenue.BDT)} BDT`,
      description: "Revenue from completed payments this month",
      icon: "dollar-sign",
      trend: trend(data.trends.revenue),
    },
    {
      value: fmt(data.total_users),
      title: "Total Users",
      subtitle: "Non-blocked registered users",
      description: "Cumulative active user count",
      icon: "users",
      trend: trend(data.trends.users),
    },
    {
      value: fmt(data.total_payment_transactions),
      title: "Payment Transactions",
      subtitle: "All payment attempts",
      description: "Total payment transactions across all gateways",
      icon: "credit-card",
      trend: trend(data.trends.payment_transactions),
    },
    {
      value: fmt(data.total_package_assignments),
      title: "Package Assignments",
      subtitle: "Total package subscriptions",
      description: "Total times a package was assigned to a user",
      icon: "package",
      trend: trend(data.trends.package_assignments),
    },
    {
      value: fmt(data.monthly_credits_consumed),
      title: "Credits Consumed",
      subtitle: "Used this month",
      description: "Credits spent on features this calendar month",
      icon: "zap",
      trend: trend(data.trends.credits_consumed),
    },
    {
      value: fmt(data.total_credits_in_circulation),
      title: "Credits in Circulation",
      subtitle: "Across all wallets",
      description: "Total unspent credits held by all users",
      icon: "coins",
    },
    {
      value: fmt(data.active_subscriptions),
      title: "Active Subscriptions",
      subtitle: "Live subscriptions",
      description: "Users currently on an active subscription plan",
      icon: "repeat",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statistics.map((item, index) => (
        <StatisticCard key={index} item={item} />
      ))}
    </div>
  );
};

export default DashboardStatisticsSection;
