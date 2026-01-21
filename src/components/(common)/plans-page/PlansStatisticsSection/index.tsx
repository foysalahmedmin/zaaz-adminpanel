import { Card } from "@/components/ui/Card";
import type { TPlan } from "@/types/plan.type";
import type { TMeta } from "@/types/response.type";
import React from "react";

type PlansStatisticsSectionProps = {
  data: TPlan[];
  meta?: TMeta;
};

const PlansStatisticsSection: React.FC<PlansStatisticsSectionProps> = ({
  data = [],
  meta,
}) => {
  const totalPlans = meta?.total || data.length || 0;
  const activePlans =
    meta?.statistics?.active || data.filter((p) => p.is_active).length || 0;
  const inactivePlans =
    meta?.statistics?.inactive ||
    totalPlans -
      (meta?.statistics?.active || data.filter((p) => p.is_active).length) ||
    0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Total Plans</p>
            <p className="text-3xl font-bold">{totalPlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Active Plans</p>
            <p className="text-3xl font-bold">{activePlans}</p>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Inactive Plans</p>
            <p className="text-3xl font-bold">{inactivePlans}</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PlansStatisticsSection;
