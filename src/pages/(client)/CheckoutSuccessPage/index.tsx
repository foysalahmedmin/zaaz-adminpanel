import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchPublicPackages } from "@/services/package.service";
import { fetchPaymentTransactionStatus } from "@/services/payment-transaction.service";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, CreditCard, Loader2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

// Extend Window interface for analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>,
    ) => void;
    fbq?: (
      command: string,
      eventName: string,
      params?: Record<string, any>,
    ) => void;
    analytics?: {
      track: (eventName: string, params?: Record<string, any>) => void;
    };
  }
}

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package_id");
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [showRetryButton, setShowRetryButton] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number;
    currency: string;
    paymentMethodName?: string;
  } | null>(null);
  const analyticsTracked = useRef<boolean>(false);

  // Get transaction ID from URL params (payment server redirect adds transaction_id)
  // transaction_id should be the payment transaction document _id (MongoDB ObjectId)
  // Fallback to sessionStorage if not in URL
  const transactionId =
    searchParams.get("transaction_id") ||
    (typeof window !== "undefined"
      ? window.sessionStorage.getItem("pending_transaction_id")
      : null);

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

  // Poll for payment status until webhook processes
  const pollPaymentStatus = async () => {
    if (!transactionId) {
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setShowRetryButton(false);

    const maxAttempts = 10; // 10 attempts = 30 seconds (3s interval)
    const interval = 3000; // 3 seconds between attempts

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const statusResponse =
          await fetchPaymentTransactionStatus(transactionId);

        if (statusResponse.data?.status === "success") {
          // Webhook processed successfully
          setIsVerifying(false);
          setShowRetryButton(false);

          // Store payment details for display
          if (statusResponse.data) {
            setPaymentDetails({
              amount: statusResponse.data.amount || 0,
              currency: statusResponse.data.currency || "USD",
              paymentMethodName: statusResponse.data.payment_method_name,
            });
          }

          // Track conversion event (analytics)
          if (
            typeof window !== "undefined" &&
            !analyticsTracked.current &&
            statusResponse.data
          ) {
            analyticsTracked.current = true;

            // Google Analytics 4 (gtag)
            if (
              typeof window !== "undefined" &&
              typeof window.gtag === "function"
            ) {
              window.gtag("event", "purchase", {
                transaction_id: transactionId,
                value: statusResponse.data.amount,
                currency: statusResponse.data.currency,
                items: packageData
                  ? [
                      {
                        item_id: packageData._id,
                        item_name: packageData.name,
                        price: statusResponse.data.amount,
                        quantity: 1,
                      },
                    ]
                  : [],
              });
            }

            // Facebook Pixel (fbq)
            if (
              typeof window !== "undefined" &&
              typeof window.fbq === "function"
            ) {
              window.fbq("track", "Purchase", {
                value: statusResponse.data.amount,
                currency: statusResponse.data.currency,
                content_ids: packageData ? [packageData._id] : [],
                content_name: packageData?.name,
              });
            }

            // Custom analytics event
            if (
              typeof window !== "undefined" &&
              window.analytics !== undefined
            ) {
              try {
                window.analytics.track("Payment Successful", {
                  transaction_id: transactionId,
                  amount: statusResponse.data.amount,
                  currency: statusResponse.data.currency,
                  payment_method: statusResponse.data.payment_method_name,
                  package_id: packageId,
                });
              } catch {
                // Analytics might not be available, ignore
              }
            }
          }

          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("pending_transaction_id");
          }
          return;
        }

        if (statusResponse.data?.status === "failed") {
          // Payment failed - redirect to cancel_url
          setIsVerifying(false);
          setShowRetryButton(false);
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("pending_transaction_id");
          }

          const cancelUrl = statusResponse.data?.cancel_url;

          if (cancelUrl) {
            // Extract relative path from cancel_url (remove domain)
            try {
              const url = new URL(cancelUrl);
              const relativePath = url.pathname + url.search + url.hash;
              navigate(relativePath);
              return;
            } catch {
              // If URL parsing fails, try to extract path manually
              const urlMatch = cancelUrl.match(/\/\/[^/]+(\/.*)/);
              const relativePath = urlMatch?.[1];
              if (relativePath) {
                navigate(relativePath);
                return;
              }
              // If extraction fails, use cancelUrl as-is (might be relative)
              navigate(cancelUrl);
              return;
            }
          }

          // Fallback: show error and redirect to pricing page
          toast.error("Payment failed. Please try again.");
          navigate("/client/pricing");
          return;
        }

        // Still pending, wait and retry
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        // Continue polling on error (might be temporary)
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }
    }

    // Timeout - webhook might be delayed
    setIsVerifying(false);
    setShowRetryButton(true);
    toast.warning(
      "Payment is being processed. Please check back in a few moments or click retry to check again.",
    );
  };

  useEffect(() => {
    pollPaymentStatus();
  }, [transactionId]);

  if (isVerifying) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6 py-12">
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

  if (showRetryButton) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6 py-12">
        <Card>
          <Card.Content className="space-y-4 py-12 text-center">
            <Loader2 className="text-primary mx-auto h-16 w-16 animate-spin" />
            <h2 className="text-2xl font-bold">Processing Payment...</h2>
            <p className="text-muted-foreground">
              Your payment is being processed. This may take a few moments.
            </p>
            <Button onClick={pollPaymentStatus} className="mt-4">
              Check Payment Status Again
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 py-12">
      <Card className="border-green-600/50 bg-green-600/5">
        <Card.Content className="space-y-4 py-12 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-3xl font-bold text-green-500">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-background/50 mx-auto mt-4 max-w-md space-y-2 rounded-lg p-4 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-semibold">
                  {paymentDetails.amount.toLocaleString(undefined, {
                    minimumFractionDigits:
                      paymentDetails.amount % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {paymentDetails.currency}
                </span>
              </div>
              {paymentDetails.paymentMethodName && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Payment Method:
                  </span>
                  <span className="font-semibold">
                    {paymentDetails.paymentMethodName}
                  </span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">
                    {transactionId.slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          )}

          {!paymentDetails && transactionId && (
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
            <div className="space-y-1">
              <h4 className="font-semibold">{packageData.name}</h4>
              {packageData.description && (
                <p className="text-muted-foreground text-sm">
                  {packageData.description}
                </p>
              )}
            </div>
            {packageData.plans && packageData.plans.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Purchased Plan:</h4>
                {packageData.plans
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
                {packageData.plans
                  .filter((pp) => pp.is_initial)
                  .map((pp) => (
                    <div key={pp._id} className="flex justify-between">
                      <span className="text-muted-foreground">Credits:</span>
                      <span className="font-semibold">{pp.credits}</span>
                    </div>
                  ))}
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/client/profile">
          <Button asChild size="lg">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </Link>
        <Button asChild variant="outline" size="lg">
          <Link to="/client/pricing">Browse More Packages</Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
