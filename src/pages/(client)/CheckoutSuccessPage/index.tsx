import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchPublicPackages } from "@/services/package.service";
import { verifyPayment } from "@/services/payment-transaction.service";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "react-toastify";

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package_id");
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  // Get transaction ID from sessionStorage (set during payment initiation)
  // or from URL params (if gateway provides it)
  const transactionId =
    searchParams.get("transaction_id") ||
    sessionStorage.getItem("pending_transaction_id");

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

  // Verify payment if transactionId is provided
  useEffect(() => {
    if (transactionId) {
      verifyPayment(transactionId)
        .then(() => {
          setIsVerifying(false);
          // Clear sessionStorage after successful verification
          sessionStorage.removeItem("pending_transaction_id");
        })
        .catch(() => {
          setIsVerifying(false);
          toast.error("Failed to verify payment. Please contact support.");
        });
    } else {
      setIsVerifying(false);
    }
  }, [transactionId]);

  if (isVerifying) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <Card.Content className="space-y-4 py-12 text-center">
            <Loader2 className="text-primary mx-auto h-16 w-16 animate-spin" />
            <h2 className="text-2xl font-bold">Verifying Payment...</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your payment.
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-green-600/50 bg-green-600/5">
        <Card.Content className="space-y-4 py-12 text-center">
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

      {packageData && (
        <Card>
          <Card.Header className="border-b">
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
            <div className="flex items-center gap-2">
              <Wallet className="text-primary h-5 w-5" />
              <span className="font-semibold">{packageData.token} Tokens</span>
            </div>
          </Card.Content>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/client/profile">
          <Button asChild size="lg">
            <User className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
        <Link to="/client/pricing">
          <Button asChild size="lg" variant="outline">
            Browse More Packages
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
