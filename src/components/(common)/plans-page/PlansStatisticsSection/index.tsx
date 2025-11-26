import { Card } from "@/components/ui/Card";
import type { TPlan } from "@/types/plan.type";
import React from "react";

type PlansStatisticsSectionProps = {
  data: TPlan[];
};

const PlansStatisticsSection: React.FC<PlansStatisticsSectionProps> = ({
  data,
}) => {
  const totalPlans = data.length;
  const activePlans = data.filter((p) => p.is_active).length;
  const inactivePlans = totalPlans - activePlans;

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
