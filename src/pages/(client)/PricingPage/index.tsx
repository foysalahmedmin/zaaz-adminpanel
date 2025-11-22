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
  const hasDiscount =
    pkg.price_previous &&
    (pkg.price_previous.USD > pkg.price.USD ||
      pkg.price_previous.BDT > pkg.price.BDT);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {formatPrice(pkg.price.USD, "USD")}
            </span>
            <span className="text-muted-foreground text-sm">USD</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {formatPrice(pkg.price.BDT, "BDT")}
            </span>
            <span className="text-muted-foreground text-sm">BDT</span>
          </div>
          {hasDiscount && pkg.price_previous && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm line-through">
                {formatPrice(pkg.price_previous.USD, "USD")} /{" "}
                {formatPrice(pkg.price_previous.BDT, "BDT")}
              </span>
              <span className="bg-destructive/10 text-destructive rounded-full px-2 py-1 text-xs font-medium">
                Save{" "}
                {Math.round(
                  ((pkg.price_previous.USD - pkg.price.USD) /
                    pkg.price_previous.USD) *
                    100,
                )}
                %
              </span>
            </div>
          )}
        </div>

        {/* Tokens */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{pkg.token}</span>
            <span className="text-muted-foreground">Tokens</span>
          </div>
          {pkg.duration && (
            <p className="text-muted-foreground text-sm">
              Valid for {pkg.duration} days
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
        <Link
          to={`/client/checkout?package_id=${pkg._id}`}
          state={{ package: pkg }}
          className="w-full"
        >
          <Button size="lg" className="w-full">
            <ShoppingCart className="size-5" />
            Checkout
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default PricingPage;
