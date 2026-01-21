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
      free?: number;
      paid?: number;
    };
  };
};

const UserWalletsStatisticsSection: React.FC<
  UserWalletsStatisticsSectionProps
> = ({ meta }) => {
  const total = meta?.total || 0;
  const activeWallets = meta?.statistics?.active || 0;
  const freeWallets = meta?.statistics?.free || 0;
  const paidWallets = meta?.statistics?.paid || 0;

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
      value: freeWallets,
      title: "Free Wallets",
      subtitle: "Free tier users",
      description: "Wallets currently on the free tier.",
      icon: "gift",
    },
    {
      value: paidWallets,
      title: "Paid Wallets",
      subtitle: "Premium users",
      description: "Wallets currently on a paid plan.",
      icon: "crown",
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
