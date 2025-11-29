import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransaction } from "@/services/payment-transaction.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { ErrorResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  Package,
  User,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const PaymentTransactionsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const transaction = (location.state as {
    transaction?: TPaymentTransaction;
  })?.transaction;

  const { isViewModalOpen } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-transaction", id],
    queryFn: () => fetchPaymentTransaction(id || ""),
    enabled: !!id,
  });

  const currentTransaction = data?.data || transaction;

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-500/10 text-green-600 dark:text-green-400",
      pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      failed: "bg-red-500/10 text-red-600 dark:text-red-400",
      refunded: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">
            Error loading transaction
          </h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<ErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentTransaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Transaction not found</h2>
        </div>
      </div>
    );
  }

  const packageName =
    typeof currentTransaction.package === "object" &&
    currentTransaction.package
      ? (currentTransaction.package as any).name
      : currentTransaction.package || "N/A";

  const planName =
    typeof currentTransaction.plan === "object" && currentTransaction.plan
      ? (currentTransaction.plan as any).name
      : currentTransaction.plan || "N/A";

  const paymentMethodName =
    typeof currentTransaction.payment_method === "object" &&
    currentTransaction.payment_method
      ? (currentTransaction.payment_method as any).name
      : currentTransaction.payment_method || "N/A";

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Payment Transaction Details"
          description="View payment transaction information"
          slot={<CreditCard />}
        />

        {/* Transaction Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Transaction Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="border-border bg-primary/10 text-primary flex h-24 w-24 items-center justify-center rounded-full border-4">
                    <CreditCard className="h-12 w-12" />
                  </div>
                  <div
                    className={cn(
                      "absolute -right-1 -bottom-1 rounded-full p-1",
                      getStatusColor(currentTransaction.status),
                    )}
                  >
                    {getStatusIcon(currentTransaction.status)}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      {currentTransaction.currency === "USD" ? "$" : "৳"}
                      {currentTransaction.amount}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {currentTransaction.gateway_transaction_id}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium capitalize flex items-center gap-2",
                        getStatusColor(currentTransaction.status),
                      )}
                    >
                      {getStatusIcon(currentTransaction.status)}
                      {currentTransaction.status}
                    </span>
                    {currentTransaction.currency && (
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-3 py-1 text-sm font-medium uppercase">
                        {currentTransaction.currency}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Transaction Details Card */}
        <Card>
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Transaction Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Transaction ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentTransaction._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Gateway Transaction ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentTransaction.gateway_transaction_id}
                  </div>
                </div>
                {currentTransaction.gateway_session_id && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Gateway Session ID
                    </div>
                    <div className="text-foreground font-mono text-sm">
                      {currentTransaction.gateway_session_id}
                    </div>
                  </div>
                )}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Status</div>
                  <div className="text-foreground text-sm capitalize">
                    {currentTransaction.status}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Amount</div>
                  <div className="text-foreground text-xl font-bold">
                    {currentTransaction.currency === "USD" ? "$" : "৳"}
                    {currentTransaction.amount}
                  </div>
                </div>
                {currentTransaction.gateway_fee && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Gateway Fee
                    </div>
                    <div className="text-foreground text-sm">
                      {currentTransaction.currency === "USD" ? "$" : "৳"}
                      {currentTransaction.gateway_fee}
                    </div>
                  </div>
                )}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Payment Method
                  </div>
                  <div className="text-foreground flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4" />
                    {paymentMethodName}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Package</div>
                  <div className="text-foreground flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    {packageName}
                  </div>
                </div>
                {planName !== "N/A" && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">Plan</div>
                    <div className="text-foreground text-sm">{planName}</div>
                  </div>
                )}
                {currentTransaction.customer_name && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Customer Name
                    </div>
                    <div className="text-foreground flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      {currentTransaction.customer_name}
                    </div>
                  </div>
                )}
                {currentTransaction.customer_email && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Customer Email
                    </div>
                    <div className="text-foreground text-sm">
                      {currentTransaction.customer_email}
                    </div>
                  </div>
                )}
                {currentTransaction.gateway_status && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Gateway Status
                    </div>
                    <div className="text-foreground text-sm">
                      {currentTransaction.gateway_status}
                    </div>
                  </div>
                )}
                {currentTransaction.paid_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">Paid At</div>
                    <div className="text-foreground text-sm">
                      {new Date(currentTransaction.paid_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentTransaction.failed_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Failed At
                    </div>
                    <div className="text-foreground text-sm text-red-600">
                      {new Date(currentTransaction.failed_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentTransaction.failure_reason && (
                  <div className="bg-muted rounded-lg p-4 col-span-2">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Failure Reason
                    </div>
                    <div className="text-foreground text-sm text-red-600">
                      {currentTransaction.failure_reason}
                    </div>
                  </div>
                )}
                {currentTransaction.refund_id && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Refund ID
                    </div>
                    <div className="text-foreground font-mono text-sm">
                      {currentTransaction.refund_id}
                    </div>
                  </div>
                )}
                {currentTransaction.refunded_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Refunded At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentTransaction.refunded_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentTransaction.created_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Created At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentTransaction.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentTransaction.updated_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Updated At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentTransaction.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Modals */}
        <PaymentTransactionViewModal
          default={currentTransaction}
          isOpen={isViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openViewModal(currentTransaction)
                : closeViewModal(),
            )
          }
        />
      </div>
    </div>
  );
};

export default PaymentTransactionsDetailsPage;
