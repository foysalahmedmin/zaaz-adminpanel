import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TPackage } from "@/types/package.type";
import { User, XCircle } from "lucide-react";
import { Link } from "react-router";

type PaymentFailedViewProps = {
  package: TPackage;
  onRetry: () => void;
};

export const PaymentFailedView: React.FC<PaymentFailedViewProps> = ({
  package: pkg,
  onRetry,
}) => {
  return (
    <div className="container mx-auto max-w-2xl space-y-6 py-12">
      <Card className="border-destructive/50 bg-destructive/5">
        <Card.Content className="space-y-4 py-12 text-center">
          <XCircle className="text-destructive mx-auto h-16 w-16" />
          <h2 className="text-3xl font-bold">Payment Failed</h2>
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again.
          </p>
        </Card.Content>
      </Card>

      {pkg && (
        <Card>
          <Card.Header className="border-b">
            <h3 className="text-xl font-semibold">Package Details</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold">{pkg.name}</h4>
              {pkg.description && (
                <p className="text-muted-foreground text-sm">{pkg.description}</p>
              )}
            </div>
            {pkg.plans && pkg.plans.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Selected Plan:</h4>
                {pkg.plans
                  .filter((pp) => pp.is_initial)
                  .map((pp) => (
                    <div key={pp._id} className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-semibold">
                        {typeof pp.plan === "object" && pp.plan?.name
                          ? `${pp.plan.name} (${pp.plan.duration || 0} days)`
                          : "N/A"}
                      </span>
                    </div>
                  ))}
                {pkg.plans
                  .filter((pp) => pp.is_initial)
                  .map((pp) => (
                    <div key={pp._id} className="flex justify-between">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="font-semibold">{pp.token}</span>
                    </div>
                  ))}
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onRetry} size="lg">
          Try Again
        </Button>
        {pkg && (
          <Button asChild variant="outline" size="lg">
            <Link
              to={`/client/checkout?package_id=${pkg._id}`}
              state={{ package: pkg }}
            >
              Retry with Same Package
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <Link to="/client/pricing">Back to Pricing</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/client/profile">
            <User className="h-4 w-4" />
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};


