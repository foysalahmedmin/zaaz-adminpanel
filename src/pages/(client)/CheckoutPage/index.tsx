import { PackageNotFoundView } from "@/components/(pricing-page)/(checkout-page)/PackageNotFoundView";
import { PackageSummaryCard } from "@/components/(pricing-page)/(checkout-page)/PackageSummaryCard";
import { PaymentFailedView } from "@/components/(pricing-page)/(checkout-page)/PaymentFailedView";
import { PaymentMethodCard } from "@/components/(pricing-page)/(checkout-page)/PaymentMethodCard";
import { PaymentSuccessView } from "@/components/(pricing-page)/(checkout-page)/PaymentSuccessView";
import { useCheckoutData } from "@/components/(pricing-page)/hooks/useCheckoutData";
import { Card } from "@/components/ui/Card";
import { ENV } from "@/config";
import { initiatePayment } from "@/services/payment-transaction.service";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "pending";

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package_id");
  const planIdFromQuery = searchParams.get("plan_id");

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentResult, setPaymentResult] = useState<{
    redirectUrl?: string;
    paymentUrl?: string;
    transactionId?: string;
  } | null>(null);

  // Use checkout data hook
  const {
    currentPackage,
    paymentMethods,
    availablePlans,
    selectedPlan,
    selectedPlanId,
    setSelectedPlanId,
    isBangladesh,
    locationLoading,
    packageLoading,
    methodsLoading,
  } = useCheckoutData(packageId, planIdFromQuery);

  // Auto-select payment method when location is determined
  useEffect(() => {
    if (
      !locationLoading &&
      isBangladesh !== null &&
      paymentMethods.length > 0 &&
      !selectedPaymentMethod
    ) {
      setSelectedPaymentMethod(paymentMethods[0]._id);
    }
  }, [locationLoading, isBangladesh, paymentMethods, selectedPaymentMethod]);

  // Payment initiation mutation
  const initiatePaymentMutation = useMutation({
    mutationFn: (payload: {
      package: string;
      plan: string;
      payment_method: string;
      return_url: string;
      cancel_url: string;
      customer_email?: string;
      customer_name?: string;
      customer_phone?: string;
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
    onError: (error: AxiosError<TErrorResponse>) => {
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
      (m) => m._id === selectedPaymentMethod,
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

    // Use direct frontend URLs (payment server will handle redirects)
    const baseUrl = ENV?.app_url || window.location.origin;
    // Ensure baseUrl doesn't have trailing slash
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const returnUrl = `${cleanBaseUrl}/client/checkout/success?package_id=${currentPackage._id}&plan_id=${selectedPlanId}`;
    const cancelUrl = `${cleanBaseUrl}/client/checkout/cancel?package_id=${currentPackage._id}&plan_id=${selectedPlanId}`;

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

  // Loading state
  if (packageLoading || methodsLoading || locationLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-6 lg:py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Package not found
  if (!currentPackage) {
    return <PackageNotFoundView />;
  }

  // Payment success
  if (paymentStatus === "success") {
    return (
      <PaymentSuccessView
        package={currentPackage}
        transactionId={paymentResult?.transactionId}
      />
    );
  }

  // Payment failed
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

  // Main checkout view
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col space-y-6 py-6 lg:py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold uppercase">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PackageSummaryCard
          package={currentPackage}
          availablePlans={availablePlans}
          selectedPlanId={selectedPlanId}
          selectedPlan={selectedPlan}
          onPlanSelect={setSelectedPlanId}
          isBangladesh={isBangladesh}
        />

        <PaymentMethodCard
          methods={paymentMethods}
          selectedMethodId={selectedPaymentMethod}
          selectedPlan={selectedPlan}
          isBangladesh={isBangladesh}
          onMethodSelect={setSelectedPaymentMethod}
          onPaymentInitiate={handlePaymentInitiation}
          isProcessing={
            paymentStatus === "processing" || initiatePaymentMutation.isPending
          }
          isDisabled={
            !selectedPaymentMethod ||
            !selectedPlan ||
            !selectedPlanId ||
            paymentStatus === "processing" ||
            initiatePaymentMutation.isPending
          }
        />
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

export default CheckoutPage;
