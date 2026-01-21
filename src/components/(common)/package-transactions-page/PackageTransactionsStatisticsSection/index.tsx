import { Card } from "@/components/ui/Card";
import { CreditCard, Gift, Package, TrendingUp } from "lucide-react";
import React from "react";

type PackageTransactionsStatisticsSectionProps = {
  data: any[];
  meta: any;
};

const PackageTransactionsStatisticsSection: React.FC<
  PackageTransactionsStatisticsSectionProps
> = ({ data, meta }) => {
  const statistics = meta?.statistics || {};

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex items-center gap-4 p-4">
        <div className="bg-primary/10 rounded-full p-3">
          <Package className="text-primary size-6" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total Assignments</p>
          <h3 className="text-2xl font-bold">{meta?.total || 0}</h3>
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-4">
        <div className="rounded-full bg-green-100 p-3">
          <CreditCard className="size-6 text-green-600" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">From Payments</p>
          <h3 className="text-2xl font-bold">{statistics.payment || 0}</h3>
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-4">
        <div className="rounded-full bg-purple-100 p-3">
          <Gift className="size-6 text-purple-600" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">From Bonus</p>
          <h3 className="text-2xl font-bold">{statistics.bonus || 0}</h3>
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-4">
        <div className="rounded-full bg-blue-100 p-3">
          <TrendingUp className="size-6 text-blue-600" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total Credits Added</p>
          <h3 className="text-2xl font-bold">
            {data.reduce((acc, curr) => acc + (curr.credits || 0), 0)}
          </h3>
        </div>
      </Card>
    </div>
  );
};

export default PackageTransactionsStatisticsSection;
