import { Card } from "@/components/ui/Card";
import type { TPackagePlan } from "@/types/package-plan.type";
import React from "react";

type PackagePlansStatisticsSectionProps = {
  data: TPackagePlan[];
};

const PackagePlansStatisticsSection: React.FC<
  PackagePlansStatisticsSectionProps
> = ({ data }) => {
  const totalPackagePlans = data.length;
  const activePackagePlans = data.filter((pp) => pp.is_active).length;
  const inactivePackagePlans = totalPackagePlans - activePackagePlans;
  const initialPlans = data.filter((pp) => pp.is_initial).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Total Package Plans
            </p>
            <p className="text-3xl font-bold">{totalPackagePlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Active Plans</p>
            <p className="text-3xl font-bold text-green-600">
              {activePackagePlans}
            </p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Inactive Plans</p>
            <p className="text-3xl font-bold text-red-600">
              {inactivePackagePlans}
            </p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Initial Plans</p>
            <p className="text-3xl font-bold text-blue-600">{initialPlans}</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PackagePlansStatisticsSection;

