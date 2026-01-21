import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormControl } from "@/components/ui/FormControl";
import { fetchPackages } from "@/services/package.service";
import { fetchPlans } from "@/services/plan.service";
import type { TPackage } from "@/types/package.type";
import type { TPlan } from "@/types/plan.type";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";

type PackagePlansFilterSectionProps = {
  gte: string;
  setGte: (value: string) => void;
  lte: string;
  setLte: (value: string) => void;
  isActive: string;
  setIsActive: (value: string) => void;
  plan: string;
  setPlan: (value: string) => void;
  pkg: string;
  setPkg: (value: string) => void;
  onReset: () => void;
};

const PackagePlansFilterSection: React.FC<PackagePlansFilterSectionProps> = ({
  gte,
  setGte,
  lte,
  setLte,
  isActive,
  setIsActive,
  plan,
  setPlan,
  pkg,
  setPkg,
  onReset,
}) => {
  const { data: plansData } = useQuery({
    queryKey: ["plans", "all"],
    queryFn: () => fetchPlans({ limit: 100, sort: "sequence" }),
  });

  const { data: packagesData } = useQuery({
    queryKey: ["packages", "all"],
    queryFn: () => fetchPackages({ limit: 100, sort: "sequence" }),
  });

  return (
    <Card>
      <Card.Header className="border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1 md:col-span-2">
            <FormControl.Label>Date Range (From - To)</FormControl.Label>
            <div className="border-input focus-within:ring-accent flex w-full items-center gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <DatePicker
                value={gte}
                onChange={(e) => setGte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="From"
              />
              <div className="bg-muted text-muted-foreground border-input flex h-9 shrink-0 items-center border-x px-2">
                <span className="font-mono text-[10px] font-bold">TO</span>
              </div>
              <DatePicker
                value={lte}
                onChange={(e) => setLte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="To"
              />
            </div>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Plan</FormControl.Label>
            <FormControl
              as="select"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="h-9"
            >
              <option value="">All Plans</option>
              {plansData?.data?.map((p: TPlan) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </FormControl>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Package</FormControl.Label>
            <FormControl
              as="select"
              value={pkg}
              onChange={(e) => setPkg(e.target.value)}
              className="h-9"
            >
              <option value="">All Packages</option>
              {packagesData?.data?.map((p: TPackage) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </FormControl>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Status</FormControl.Label>
            <FormControl
              as="select"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="h-9"
            >
              <option value="">All Status</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </FormControl>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PackagePlansFilterSection;
