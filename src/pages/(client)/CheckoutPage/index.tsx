import Loader from "@/components/partials/Loader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ENV } from "@/config";
import { fetchPublicPackages } from "@/services/package.service";
import { fetchPublicPaymentMethods } from "@/services/payment-method.service";
import { initiatePayment } from "@/services/payment-transaction.service";
import type { TPackage } from "@/types/package.type";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  Check,
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

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "pending";

const CheckoutPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package_id");
  const planIdFromQuery = searchParams.get("plan_id");
  const packageData = (location.state as {
    package?: TPackage;
    initialPlan?: any;
  })?.package;
  const initialPlanFromState = (location.state as {
    initialPlan?: any;
  })?.initialPlan;

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
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

  // Determine initial plan - filter only active plans
  const allPlans = currentPackage?.plans || [];
  const availablePlans = allPlans.filter((pp: any) => pp.is_active !== false);
  const initialPlan =
    initialPlanFromState ||
    availablePlans.find((pp: any) => pp.is_initial) ||
    availablePlans[0];

  // Set selected plan on mount
  useEffect(() => {
    if (planIdFromQuery) {
      setSelectedPlanId(planIdFromQuery);
    } else if (initialPlan) {
      const planId =
        typeof initialPlan.plan === "object"
          ? initialPlan.plan?._id
          : initialPlan.plan;
      if (planId) {
        setSelectedPlanId(planId);
      }
    }
  }, [planIdFromQuery, initialPlan]);

  // Get selected plan details
  const selectedPlan = availablePlans.find((pp: any) => {
    const planId =
      typeof pp.plan === "object" ? pp.plan?._id : pp.plan;
    return planId === selectedPlanId;
  }) || initialPlan;

  // Payment initiation mutation
  const initiatePaymentMutation = useMutation({
    mutationFn: (payload: {
      package: string;
      plan: string;
      payment_method: string;
      return_url: string;
      cancel_url: string;
    }) => initiatePayment(payload),
    onSuccess: (data) => {
      const response = data?.data;
      if (response) {
        const transaction = response.payment_transaction;
        const transactionId = transaction?._id;

        // Store transaction ID in sessionStorage for success page
        if (transactionId) {
          sessionStorage.setItem("pending_transaction_id", transactionId);
        }

        setPaymentResult({
          redirectUrl: response.redirect_url,
          paymentUrl: response.payment_url,
          transactionId: transactionId,
        });

        // Auto-redirect if URL is available
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
          setPaymentStatus("processing");
        } else if (response.payment_url) {
          window.location.href = response.payment_url;
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
        error.response?.data?.message ||
          "Failed to initiate payment. Please try again.",
      );
    },
  });

  const handlePaymentInitiation = () => {
    if (!currentPackage || !selectedPaymentMethod || !selectedPlanId) {
      toast.error("Please select a payment method and plan");
      return;
    }

    const selectedMethod = paymentMethods.find(
      (m: TPaymentMethod) => m._id === selectedPaymentMethod,
    );

    if (!selectedMethod) {
      toast.error("Invalid payment method selected");
      return;
    }

    if (!selectedPlan) {
      toast.error("Invalid plan selected");
      return;
    }

    setPaymentStatus("processing");

    const returnUrl = `${ENV?.app_url || window.location.origin}/client/checkout/success?package_id=${currentPackage._id}&transaction_id=`;
    const cancelUrl = `${ENV?.app_url || window.location.origin}/client/checkout/cancel?package_id=${currentPackage._id}`;

    // Backend expects: package, plan, payment_method, return_url, cancel_url
    // Optional: customer_email, customer_name, customer_phone
    initiatePaymentMutation.mutate({
      package: currentPackage._id,
      plan: selectedPlanId,
      payment_method: selectedPaymentMethod,
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
      <div className="space-y-4 py-12 text-center">
        <XCircle className="text-destructive mx-auto h-12 w-12" />
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <p className="text-muted-foreground">
          The package you're looking for doesn't exist or is no longer
          available.
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
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Package Summary */}
        <Card>
          <Card.Header className="border-b">
            <h2 className="text-xl font-semibold">Package Summary</h2>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{currentPackage.name}</h3>
              {currentPackage.description && (
                <p className="text-muted-foreground text-sm">
                  {currentPackage.description}
                </p>
              )}
            </div>

            {/* Plan Selection */}
            {availablePlans.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Plan:</label>
                <div className="space-y-2">
                  {availablePlans.map((pp: any) => {
                    const plan = pp.plan;
                    const planId =
                      typeof plan === "object" ? plan?._id : plan;
                    const planName =
                      typeof plan === "object" ? plan?.name : "N/A";
                    const planDuration =
                      typeof plan === "object" ? plan?.duration : 0;
                    const isSelected = selectedPlanId === planId;
                    return (
                      <label
                        key={planId || pp._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={planId}
                          checked={isSelected}
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{planName}</span>
                            {pp.is_initial && (
                              <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                                Initial
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {planDuration} days • {pp.token} tokens
                          </div>
                          <div className="mt-1 text-sm font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(pp.price?.USD || 0)}{" "}
                            /{" "}
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "BDT",
                            }).format(pp.price?.BDT || 0)}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Plan Details */}
            {selectedPlan && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-semibold">
                    {typeof selectedPlan.plan === "object"
                      ? selectedPlan.plan?.name
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens:</span>
                  <span className="font-semibold">{selectedPlan.token}</span>
                </div>
                {typeof selectedPlan.plan === "object" &&
                  selectedPlan.plan?.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">
                        {selectedPlan.plan.duration} days
                      </span>
                    </div>
                  )}
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Price:</span>
                  <div className="text-right">
                    <div className="font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedPlan.price?.USD || 0)}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "BDT",
                      }).format(selectedPlan.price?.BDT || 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Features */}
            {currentPackage.features && currentPackage.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="space-y-1">
                  {currentPackage.features.map((feature, index) => {
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
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <Card.Header className="border-b">
            <h2 className="text-xl font-semibold">Select Payment Method</h2>
          </Card.Header>
          <Card.Content className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No payment methods available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method: TPaymentMethod) => (
                  <label
                    key={method._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      selectedPaymentMethod === method._id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } `}
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
                        <p className="text-muted-foreground mt-1 text-sm">
                          {method.description}
                        </p>
                      )}
                      {method.is_test && (
                        <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          Test Mode
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedPaymentMethod && selectedPlan && (
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>
                      {(() => {
                        const selectedMethod = paymentMethods.find(
                          (m: TPaymentMethod) =>
                            m._id === selectedPaymentMethod,
                        );
                        if (!selectedMethod || !selectedPlan) return "";
                        const amount =
                          selectedMethod.currency === "USD"
                            ? selectedPlan.price.USD
                            : selectedPlan.price.BDT;
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
                !selectedPlan ||
                !selectedPlanId ||
                paymentStatus === "processing" ||
                initiatePaymentMutation.isPending
              }
              className="w-full"
              size="lg"
            >
              {paymentStatus === "processing" ||
              initiatePaymentMutation.isPending ? (
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
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
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
      <Card className="border-green-500/50 bg-green-500/5">
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
            <Wallet className="text-primary h-5 w-5" />
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
          <Link to="/client/pricing">Browse More Packages</Link>
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
                <p className="text-muted-foreground text-sm">
                  {pkg.description}
                </p>
              )}
            </div>
            {pkg.content && (
              <div className="prose">
                <div
                  dangerouslySetInnerHTML={{
                    __html: pkg.content || "",
                  }}
                />
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="#" onClick={onRetry}>
          <Button size="lg">Try Again</Button>
        </Link>

        {pkg && (
          <Link
            to={`/client/checkout?package_id=${pkg._id}`}
            state={{ package: pkg }}
          >
            <Button variant="outline" size="lg">
              Retry with Same Package
            </Button>
          </Link>
        )}

        <Link to="/client/pricing">
          <Button variant="outline" size="lg">
            Back to Pricing
          </Button>
        </Link>

        <Link to="/client/profile">
          <Button variant="outline" size="lg">
            <User className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
