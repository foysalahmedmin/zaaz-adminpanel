import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import Loader from "@/components/partials/Loader";
import { fetchPublicPaymentMethods } from "@/services/payment-method.service";
import { fetchPublicPackages } from "@/services/package.service";
import { initiatePayment } from "@/services/payment-transaction.service";
import type { TPackage } from "@/types/package.type";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { ErrorResponse } from "@/types/response.type";
import { ENV } from "@/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import useUser from "@/hooks/states/useUser";

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "pending";

const CheckoutPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("packageId");
  const packageData = (location.state as { package?: TPackage })?.package;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentResult, setPaymentResult] = useState<{
    redirectUrl?: string;
    paymentUrl?: string;
    transactionId?: string;
  } | null>(null);

  // Fetch package if not in state
  const { data: packageResponse, isLoading: packageLoading } = useQuery({
    queryKey: ["public-package", packageId],
    queryFn: () => {
      if (!packageId) throw new Error("Package ID is required");
      return fetchPublicPackages({ _id: packageId, is_active: true });
    },
    enabled: !!packageId && !packageData,
  });

  // Fetch payment methods
  const { data: paymentMethodsResponse, isLoading: methodsLoading } = useQuery({
    queryKey: ["public-payment-methods"],
    queryFn: () => fetchPublicPaymentMethods({ is_active: true }),
  });

  const currentPackage = packageData || packageResponse?.data?.[0];
  const paymentMethods = paymentMethodsResponse?.data || [];

  // Payment initiation mutation
  const initiatePaymentMutation = useMutation({
    mutationFn: (payload: {
      package: string;
      payment_method: string;
      currency: "USD" | "BDT";
      return_url: string;
      cancel_url: string;
    }) => initiatePayment(payload),
    onSuccess: (data) => {
      const response = data?.data;
      if (response) {
        const transaction = response.paymentTransaction || response;
        setPaymentResult({
          redirectUrl: response.redirectUrl,
          paymentUrl: response.paymentUrl,
          transactionId: transaction?._id || transaction?._id,
        });

        // Auto-redirect if URL is available
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
          setPaymentStatus("processing");
        } else if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
          setPaymentStatus("processing");
        } else {
          setPaymentStatus("pending");
          toast.success("Payment initiated successfully!");
        }
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setPaymentStatus("failed");
      toast.error(
        error.response?.data?.message || "Failed to initiate payment. Please try again.",
      );
    },
  });

  const handlePaymentInitiation = () => {
    if (!currentPackage || !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const selectedMethod = paymentMethods.find(
      (m: TPaymentMethod) => m._id === selectedPaymentMethod,
    );

    if (!selectedMethod) {
      toast.error("Invalid payment method selected");
      return;
    }

    setPaymentStatus("processing");

    const returnUrl = `${ENV?.app_url || window.location.origin}/client/checkout/success`;
    const cancelUrl = `${ENV?.app_url || window.location.origin}/client/checkout/cancel`;

    initiatePaymentMutation.mutate({
      package: currentPackage._id,
      payment_method: selectedPaymentMethod,
      currency: selectedMethod.currency,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });
  };

  // Check URL params for payment status
  useEffect(() => {
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id");

    if (status === "success" && transactionId) {
      setPaymentStatus("success");
      setPaymentResult({ transactionId });
    } else if (status === "cancel" || status === "failed") {
      setPaymentStatus("failed");
    }
  }, [searchParams]);

  if (packageLoading || methodsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className="text-center py-12 space-y-4">
        <XCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <p className="text-muted-foreground">
          The package you're looking for doesn't exist or is no longer available.
        </p>
        <Button asChild>
          <Link to="/client/pricing">Back to Pricing</Link>
        </Button>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <PaymentSuccessView
        package={currentPackage}
        transactionId={paymentResult?.transactionId}
      />
    );
  }

  if (paymentStatus === "failed") {
    return (
      <PaymentFailedView
        package={currentPackage}
        onRetry={() => {
          setPaymentStatus("idle");
          setPaymentResult(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Package Summary */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Package Summary</h2>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{currentPackage.name}</h3>
              {currentPackage.description && (
                <p className="text-muted-foreground text-sm">{currentPackage.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tokens:</span>
                <span className="font-semibold">{currentPackage.token}</span>
              </div>
              {currentPackage.duration && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{currentPackage.duration} days</span>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Select Payment Method</h2>
          </Card.Header>
          <Card.Content className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No payment methods available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method: TPaymentMethod) => (
                  <label
                    key={method._id}
                    className={`
                      flex items-center gap-3 p-4 border rounded-lg cursor-pointer
                      transition-colors
                      ${
                        selectedPaymentMethod === method._id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method._id}
                      checked={selectedPaymentMethod === method._id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{method.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {method.currency}
                        </span>
                      </div>
                      {method.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {method.description}
                        </p>
                      )}
                      {method.is_test && (
                        <span className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs font-medium mt-1 inline-block">
                          Test Mode
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedPaymentMethod && (
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>
                      {(() => {
                        const selectedMethod = paymentMethods.find(
                          (m: TPaymentMethod) => m._id === selectedPaymentMethod,
                        );
                        if (!selectedMethod) return "";
                        const amount =
                          selectedMethod.currency === "USD"
                            ? currentPackage.price.USD
                            : currentPackage.price.BDT;
                        return new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: selectedMethod.currency,
                        }).format(amount);
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handlePaymentInitiation}
              disabled={
                !selectedPaymentMethod ||
                paymentStatus === "processing" ||
                initiatePaymentMutation.isPending
              }
              className="w-full"
              size="lg"
            >
              {paymentStatus === "processing" || initiatePaymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </Card.Footer>
        </Card>
      </div>

      {paymentStatus === "pending" && paymentResult && (
        <Card className="bg-muted">
          <Card.Content className="py-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm">
                Payment is being processed. Please wait...
              </p>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

type PaymentSuccessViewProps = {
  package: TPackage;
  transactionId?: string;
};

const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  package: pkg,
  transactionId,
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <Card.Content className="py-12 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-100">
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
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-semibold">{pkg.token} Tokens</span>
          </div>
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link to="/client/profile">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/client/pricing">
            Browse More Packages
          </Link>
        </Button>
      </div>
    </div>
  );
};

type PaymentFailedViewProps = {
  package: TPackage;
  onRetry: () => void;
};

const PaymentFailedView: React.FC<PaymentFailedViewProps> = ({
  package: pkg,
  onRetry,
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-destructive/50 bg-destructive/5">
        <Card.Content className="py-12 text-center space-y-4">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-3xl font-bold">Payment Failed</h2>
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again.
          </p>
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onRetry} size="lg">
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/client/pricing">
            Back to Pricing
          </Link>
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

export default CheckoutPage;

