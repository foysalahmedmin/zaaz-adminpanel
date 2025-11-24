import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchPublicPackages } from "@/services/package.service";
import type { TPackage } from "@/types/package.type";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const PricingPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-packages"],
    queryFn: () => fetchPublicPackages({ is_active: true }),
  });

  const packages = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">
          Failed to load packages. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Choose Your Package</h1>
        <p className="text-muted-foreground text-lg">
          Select the perfect package for your needs
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No packages available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg: TPackage) => (
            <PricingCard key={pkg._id} package={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

type PricingCardProps = {
  package: TPackage;
};

const PricingCard: React.FC<PricingCardProps> = ({ package: pkg }) => {
  // Get initial plan (first plan with is_initial=true, or first plan)
  const initialPlan = pkg.plans?.find((pp) => pp.is_initial) || pkg.plans?.[0];

  if (!initialPlan) {
    return (
      <Card className="flex flex-col">
        <Card.Header className="border-b pb-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{pkg.name}</h3>
            {pkg.description && (
              <p className="text-muted-foreground text-sm">{pkg.description}</p>
            )}
          </div>
        </Card.Header>
        <Card.Content className="flex-1 space-y-6 py-6">
          <p className="text-muted-foreground text-sm">
            No plans available for this package.
          </p>
        </Card.Content>
      </Card>
    );
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get all active plans
  const activePlans = pkg.plans?.filter((pp: any) => pp.is_active) || [];

  return (
    <Card className="flex flex-col">
      <Card.Header className="border-b pb-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-muted-foreground text-sm">{pkg.description}</p>
          )}
        </div>
      </Card.Header>
      <Card.Content className="flex-1 space-y-6 py-6">
        {/* All Plans Pricing */}
        <div className="space-y-3">
          {activePlans.length > 0 ? (
            activePlans.map((pp: any, index: number) => {
              const plan = pp.plan;
              const planName =
                typeof plan === "object" && plan?.name ? plan.name : "N/A";
              const planDuration =
                typeof plan === "object" && plan?.duration ? plan.duration : 0;
              const hasDiscount =
                pp.previous_price &&
                (pp.previous_price.USD > pp.price.USD ||
                  pp.previous_price.BDT > pp.price.BDT);

              return (
                <div
                  key={pp._id || index}
                  className={`space-y-2 rounded-lg border p-3 ${
                    pp.is_initial ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {planName} ({planDuration} days)
                      </p>
                      {pp.is_initial && (
                        <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                          Initial
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatPrice(pp.price.USD, "USD")} /{" "}
                        {formatPrice(pp.price.BDT, "BDT")}
                      </p>
                      {hasDiscount && pp.previous_price && (
                        <p className="text-muted-foreground text-xs line-through">
                          {formatPrice(pp.previous_price.USD, "USD")} /{" "}
                          {formatPrice(pp.previous_price.BDT, "BDT")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {pp.token} tokens
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">
              No plans available
            </p>
          )}
        </div>

        {/* Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Features:</h4>
            <ul className="space-y-1">
              {pkg.features.map((feature, index) => {
                // Handle both string and object formats
                const featureName =
                  typeof feature === "string"
                    ? feature
                    : (feature as any)?.name || "Feature";
                const featureId =
                  typeof feature === "string"
                    ? feature
                    : (feature as any)?._id || index;

                return (
                  <li
                    key={featureId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="text-primary h-4 w-4 flex-shrink-0" />
                    <span>{featureName}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Card.Content>
      <Card.Footer>
        {initialPlan && initialPlan.plan && (
          <Link
            to={`/client/checkout?package_id=${pkg._id}&plan_id=${
              typeof initialPlan.plan === "object"
                ? initialPlan.plan._id
                : initialPlan.plan
            }`}
            state={{ package: pkg, initialPlan }}
            className="w-full"
          >
            <Button size="lg" className="w-full">
              <ShoppingCart className="size-5" />
              Checkout
            </Button>
          </Link>
        )}
      </Card.Footer>
    </Card>
  );
};

export default PricingPage;
