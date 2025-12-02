import {
  StatisticCard,
  type TStatistic,
} from "@/components/cards/StatisticCard";
import type { TUserWallet } from "@/types/user-wallet.type";
import React from "react";

type UserWalletsStatisticsSectionProps = {
  data?: TUserWallet[];
  meta?: {
    total?: number;
    statistics?: {
      active?: number;
      expired?: number;
    };
  };
};

const UserWalletsStatisticsSection: React.FC<
  UserWalletsStatisticsSectionProps
> = ({ data, meta }) => {
  const total = meta?.total || data?.length || 0;
  const totalTokens = data?.reduce((sum, d) => sum + (d?.token || 0), 0) || 0;
  const activeWallets = meta?.statistics?.active || 0;
  const expiredWallets = meta?.statistics?.expired || 0;

  const statistics: TStatistic[] = [
    {
      value: total,
      title: "Total Wallets",
      subtitle: "Includes all wallets",
      description: "Overall count of user wallets in the system.",
      icon: "wallet",
    },
    {
      value: activeWallets,
      title: "Active Wallets",
      subtitle: "Currently active",
      description: "Wallets that are active and not expired.",
      icon: "check-circle",
    },
    {
      value: expiredWallets,
      title: "Expired Wallets",
      subtitle: "Expired",
      description: "Wallets that have expired.",
      icon: "clock",
    },
    {
      value: totalTokens,
      title: "Total Tokens",
      subtitle: "Across all wallets",
      description: "Sum of tokens in all wallets.",
      icon: "coins",
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

export default UserWalletsStatisticsSection;

