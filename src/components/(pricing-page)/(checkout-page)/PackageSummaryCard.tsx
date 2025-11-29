import { Card } from "@/components/ui/Card";
import type { TPackage } from "@/types/package.type";
import React from "react";
import {
  getPlanDuration,
  getPlanId,
  getPlanName,
} from "../utils/plan.utils";
import { getPriceDisplay } from "../utils/price.utils";

type PackageSummaryCardProps = {
  package: TPackage;
  availablePlans: any[];
  selectedPlanId: string;
  selectedPlan: any;
  onPlanSelect: (planId: string) => void;
  isBangladesh: boolean | null;
};

export const PackageSummaryCard: React.FC<PackageSummaryCardProps> = ({
  package: pkg,
  availablePlans,
  selectedPlanId,
  selectedPlan,
  onPlanSelect,
  isBangladesh,
}) => {
  return (
    <Card className="flex flex-col">
      <Card.Header className="border-b">
        <h2 className="text-xl font-semibold">Package Summary</h2>
      </Card.Header>
      <Card.Content className="flex flex-1 flex-col space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-muted-foreground text-sm">{pkg.description}</p>
          )}
        </div>

        {/* Plan Selection */}
        <div>
          {availablePlans.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Select Plan:</div>
              <div className="space-y-2">
                {availablePlans.map((pp: any) => {
                  const plan = pp.plan;
                  const planId = getPlanId(plan);
                  const planName = getPlanName(plan);
                  const planDuration = getPlanDuration(plan);
                  const isSelected = selectedPlanId === planId;
                  const inputId = `plan-${planId || pp._id}`;
                  const priceDisplay = getPriceDisplay(pp.price, isBangladesh);

                  return (
                    <label
                      key={planId || pp._id}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <input
                        hidden
                        type="radio"
                        id={inputId}
                        name="plan"
                        value={planId}
                        checked={isSelected}
                        onChange={(e) => onPlanSelect(e.target.value)}
                        className="mt-1"
                        aria-label={`Select ${planName} plan`}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {planName} ({planDuration} days)
                              </span>
                              {pp.is_initial && (
                                <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                                  Initial
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {pp.token} tokens
                            </div>
                          </div>
                          <div className="mt-1 text-sm font-medium">
                            {priceDisplay.mode === "BOTH" ? (
                              <>
                                <span className="font-semibold">
                                  {priceDisplay.primary}
                                </span>
                                {" / "}
                                <span>{priceDisplay.secondary}</span>
                              </>
                            ) : (
                              <span className="font-semibold">
                                {priceDisplay.primary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Plan Details */}
        <div className="mt-auto">
          {selectedPlan && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-semibold">
                  {getPlanName(selectedPlan.plan)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tokens:</span>
                <span className="font-semibold">{selectedPlan.token}</span>
              </div>
              {getPlanDuration(selectedPlan.plan) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">
                    {getPlanDuration(selectedPlan.plan)} days
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Price:</span>
                <div className="text-right">
                  {(() => {
                    const priceDisplay = getPriceDisplay(
                      selectedPlan.price,
                      isBangladesh,
                    );
                    return priceDisplay.mode === "BOTH" ? (
                      <>
                        <div className="font-semibold">
                          {priceDisplay.primary}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {priceDisplay.secondary}
                        </div>
                      </>
                    ) : (
                      <div className="font-semibold">
                        {priceDisplay.primary}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

