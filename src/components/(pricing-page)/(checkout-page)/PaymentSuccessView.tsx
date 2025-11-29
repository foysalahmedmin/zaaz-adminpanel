import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TPackage } from "@/types/package.type";
import { CheckCircle, User } from "lucide-react";
import { Link } from "react-router";

type PaymentSuccessViewProps = {
  package: TPackage;
  transactionId?: string;
};

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  package: pkg,
  transactionId,
}) => {
  return (
    <div className="container mx-auto max-w-2xl space-y-6 py-6 lg:py-12">
      <Card className="border-green-500/50 bg-green-500/5">
        <Card.Content className="space-y-4 py-6 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-3xl font-bold text-green-500">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>
          {transactionId && (
            <p className="text-muted-foreground text-sm">
              Transaction ID: {transactionId}
            </p>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="text-xl font-semibold">Package Details</h3>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <h4 className="font-semibold">{pkg.name}</h4>
            <p className="text-muted-foreground text-sm">{pkg.description}</p>
          </div>
          {pkg.plans && pkg.plans.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Purchased Plan:</h4>
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

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/client/profile">
          <Button asChild size="lg">
            <User className="h-4 w-4" />
            View Profile
          </Button>
        </Link>

        <Link to="/client/pricing">
          <Button asChild variant="outline" size="lg">
            Browse More Packages
          </Button>
        </Link>
      </div>
    </div>
  );
};


