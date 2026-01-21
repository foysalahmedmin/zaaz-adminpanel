import { Card } from "@/components/ui/Card";
import type { TPackagePlan } from "@/types/package-plan.type";
import type { TMeta } from "@/types/response.type";
import React from "react";

type PackagePlansStatisticsSectionProps = {
  data: TPackagePlan[];
  meta?: TMeta;
};

const PackagePlansStatisticsSection: React.FC<
  PackagePlansStatisticsSectionProps
> = ({ data = [], meta }) => {
  const totalPackagePlans = meta?.total || data.length || 0;
  const activePackagePlans =
    meta?.statistics?.active || data.filter((pp) => pp.is_active).length || 0;
  const inactivePackagePlans =
    meta?.statistics?.inactive || totalPackagePlans - activePackagePlans || 0;
  const initialPlans =
    meta?.statistics?.initial || data.filter((pp) => pp.is_initial).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Total Package Plans</p>
            <p className="text-3xl font-bold">{totalPackagePlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Active Plans</p>
            <p className="text-3xl font-bold">{activePackagePlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Inactive Plans</p>
            <p className="text-3xl font-bold">{inactivePackagePlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Initial Plans</p>
            <p className="text-3xl font-bold">{initialPlans}</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PackagePlansStatisticsSection;
