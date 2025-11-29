import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenTransaction } from "@/services/token-transaction.service";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import type { ErrorResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Coins,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const TokenTransactionsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const transaction = (location.state as {
    transaction?: TTokenTransaction;
  })?.transaction;

  const { isViewModalOpen } = useSelector(
    (state: RootState) => state.tokenTransactionsPage,
  );

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["token-transaction", id],
    queryFn: () => fetchTokenTransaction(id || ""),
    enabled: !!id,
  });

  const currentTransaction = data?.data || transaction;

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

  // Safely extract decrease_source (could be object or string)
  let decreaseSourceText: string | null = null;
  if (currentTransaction.decrease_source) {
    if (typeof currentTransaction.decrease_source === "string") {
      decreaseSourceText = currentTransaction.decrease_source;
    } else if (
      typeof currentTransaction.decrease_source === "object" &&
      currentTransaction.decrease_source !== null
    ) {
      const sourceObj = currentTransaction.decrease_source as Record<
        string,
        unknown
      >;
      decreaseSourceText =
        (sourceObj.name as string) ||
        (sourceObj.endpoint as string) ||
        (sourceObj._id as string) ||
        "N/A";
    }
  }

  const planName =
    typeof currentTransaction.plan === "object" && currentTransaction.plan
      ? (currentTransaction.plan as any).name
      : currentTransaction.plan || "N/A";

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Token Transaction Details"
          description="View token transaction information"
          slot={<Coins />}
        />

        {/* Transaction Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Transaction Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div
                    className={cn(
                      "border-border flex h-24 w-24 items-center justify-center rounded-full border-4",
                      currentTransaction.type === "increase"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600",
                    )}
                  >
                    {currentTransaction.type === "increase" ? (
                      <ArrowUp className="h-12 w-12" />
                    ) : (
                      <ArrowDown className="h-12 w-12" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3
                      className={cn(
                        "text-2xl font-bold",
                        currentTransaction.type === "increase"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {currentTransaction.type === "increase" ? "+" : "-"}
                      {currentTransaction.token} tokens
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      {currentTransaction.type === "increase"
                        ? "Token Increase"
                        : "Token Decrease"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium capitalize flex items-center gap-2",
                        currentTransaction.type === "increase"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      )}
                    >
                      {currentTransaction.type === "increase" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      {currentTransaction.type}
                    </span>
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
                  <div className="text-muted-foreground mb-1 text-sm">Type</div>
                  <div className="text-foreground text-sm capitalize">
                    {currentTransaction.type}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Token Amount
                  </div>
                  <div
                    className={cn(
                      "text-xl font-bold",
                      currentTransaction.type === "increase"
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {currentTransaction.type === "increase" ? "+" : "-"}
                    {currentTransaction.token}
                  </div>
                </div>
                {currentTransaction.increase_source && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Increase Source
                    </div>
                    <div className="text-foreground text-sm capitalize">
                      {currentTransaction.increase_source}
                    </div>
                  </div>
                )}
                {decreaseSourceText && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Feature Endpoint
                    </div>
                    <div className="text-foreground flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      {decreaseSourceText}
                    </div>
                  </div>
                )}
                {currentTransaction.payment_transaction && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Payment Transaction
                    </div>
                    <div className="text-foreground flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-mono text-xs">
                        {typeof currentTransaction.payment_transaction ===
                        "string"
                          ? currentTransaction.payment_transaction
                          : (currentTransaction.payment_transaction as any)
                              ._id || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {planName !== "N/A" && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">Plan</div>
                    <div className="text-foreground text-sm">{planName}</div>
                  </div>
                )}
                {currentTransaction.user && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">User</div>
                    <div className="text-foreground flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="font-mono text-xs">
                        {typeof currentTransaction.user === "string"
                          ? currentTransaction.user
                          : (currentTransaction.user as any)._id ||
                            (currentTransaction.user as any).email ||
                            "N/A"}
                      </span>
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
        <TokenTransactionViewModal
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

export default TokenTransactionsDetailsPage;
