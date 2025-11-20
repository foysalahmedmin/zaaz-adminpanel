import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchPublicPackages } from "@/services/package.service";
import type { TPackage } from "@/types/package.type";
import { useQuery } from "@tanstack/react-query";
import { XCircle, User } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const CheckoutCancelPage = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package_id");

  // Fetch package details if packageId is provided
  const { data: packageResponse } = useQuery({
    queryKey: ["public-package", packageId],
    queryFn: () => {
      if (!packageId) throw new Error("Package ID is required");
      return fetchPublicPackages({ _id: packageId, is_active: true });
    },
    enabled: !!packageId,
  });

  const packageData = packageResponse?.data?.[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-destructive/50 bg-destructive/5">
        <Card.Content className="py-12 text-center space-y-4">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-3xl font-bold">Payment Cancelled</h2>
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </Card.Content>
      </Card>

      {packageData && (
        <Card>
          <Card.Header>
            <h3 className="text-xl font-semibold">Package Details</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div>
              <h4 className="font-semibold">{packageData.name}</h4>
              {packageData.description && (
                <p className="text-muted-foreground text-sm">
                  {packageData.description}
                </p>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {packageData && (
          <Button asChild size="lg">
            <Link
              to={`/client/checkout?packageId=${packageData._id}`}
              state={{ package: packageData }}
            >
              Try Again
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <Link to="/client/pricing">Back to Pricing</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/client/profile">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;

