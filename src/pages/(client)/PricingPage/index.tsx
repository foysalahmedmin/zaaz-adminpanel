import { PricingCard } from "@/components/(pricing-page)/PricingCard";
import { Tabs, type TabValue } from "@/components/ui/Tabs";
import { useUserLocation } from "@/hooks/utils/useUserLocation";
import { fetchPublicPackages } from "@/services/package.service";
import { fetchPublicPlans } from "@/services/plan.service";
import type { TPackage } from "@/types/package.type";
import type { TPlan } from "@/types/plan.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const PricingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("all");

  // Use location hook
  const { isBangladesh } = useUserLocation();

  // Get plan from URL params
  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) {
      setSelectedPlanId(planParam);
    } else {
      setSelectedPlanId("all");
    }
  }, [searchParams]);

  // Fetch plans
  const { data: plansResponse, isLoading: plansLoading } = useQuery({
    queryKey: ["public-plans"],
    queryFn: () => fetchPublicPlans({ is_active: true, sort: "sequence" }),
  });

  const plans = plansResponse?.data || [];

  // Fetch packages with plan filter
  const {
    data: packagesResponse,
    isLoading: isPackagesLoading,
    isError: isPackagesError,
  } = useQuery({
    queryKey: ["public-packages", selectedPlanId],
    queryFn: () => {
      const query: Record<string, unknown> = {
        is_active: true,
        sort: "sequence",
      };
      if (selectedPlanId && selectedPlanId !== "all") {
        query.plans = selectedPlanId;
      }
      return fetchPublicPackages(query);
    },
  });

  const packages = packagesResponse?.data || [];

  const handlePlanChange = (value: TabValue) => {
    const planId = String(value);
    setSelectedPlanId(planId);
    if (planId === "all") {
      navigate("/client/pricing");
    } else {
      navigate(`/client/pricing?plan=${planId}`);
    }
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center py-6 lg:py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isPackagesError) {
    return (
      <div className="py-6 text-center lg:py-12">
        <p className="text-destructive">
          Failed to load packages. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="scroll-py-6 flex-col py-6 lg:space-y-12">
      <div className="text-primary-foreground">
        <div className="relative z-10">
          <div className="container mx-auto mb-6 max-w-4xl space-y-6 text-center">
            <h1 className="text-foreground text-4xl font-bold capitalize">
              Our pricing plan made simple
            </h1>
            <p className="text-foreground text-lg">
              Discover the right plan for your needs and take advantage of
              Shothik.ai's powerful tools. Whether you're just getting started
              or need advanced features for your business, we've got you
              covered.
            </p>
          </div>

          {/* Plan Tabs */}
          <div className="mb-6">
            {plans.length > 0 && (
              <div className="flex w-full items-center justify-center p-0.5">
                <Tabs
                  value={selectedPlanId || "all"}
                  onValueChange={handlePlanChange}
                  className="flex w-full items-center justify-center"
                >
                  <Tabs.List className="border-foreground/15 mx-auto inline-flex w-full max-w-md flex-wrap justify-center gap-1 rounded-full border bg-transparent">
                    <Tabs.Trigger value="all">All</Tabs.Trigger>
                    {plans.map((plan: TPlan) => (
                      <Tabs.Trigger key={plan._id} value={plan._id}>
                        {plan.name}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        {isPackagesLoading && (
          <div className="flex flex-1 items-center justify-center py-6">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {packages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No packages available at the moment.
            </p>
          </div>
        ) : (
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg: TPackage) => (
              <PricingCard
                key={pkg._id}
                package={pkg}
                selectedPlanId={selectedPlanId}
                isBangladesh={isBangladesh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
