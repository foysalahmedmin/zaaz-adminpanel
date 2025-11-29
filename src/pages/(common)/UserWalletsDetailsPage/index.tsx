import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import {
  closeViewModal as closePaymentViewModal,
  openViewModal as openPaymentViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import {
  closeViewModal as closeTokenViewModal,
  openViewModal as openTokenViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import { fetchTokenTransactions } from "@/services/token-transaction.service";
import { fetchUserWalletById } from "@/services/user-wallet.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { ErrorResponse } from "@/types/response.type";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  Coins,
  CreditCard,
  Package,
  User,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const UserWalletsDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

  const wallet = (location.state as { wallet?: any })?.wallet;

  // Fetch wallet data
  const {
    data: walletResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-wallet", id],
    queryFn: () => fetchUserWalletById(id || ""),
    enabled: !!id,
  });

  const currentWallet = walletResponse?.data || wallet;
  
  // Extract user ID from wallet (wallet.user can be object or string)
  const userId =
    typeof currentWallet?.user === "object" && currentWallet?.user
      ? (currentWallet.user as any)._id
      : currentWallet?.user;

  // Fetch payment transactions (admin endpoint) - filtered by user ID
  const { data: paymentTransactionsResponse } = useQuery({
    queryKey: ["payment-transactions", "user", userId],
    queryFn: () =>
      fetchPaymentTransactions({
        user: userId,
        sort: "-created_at",
        limit: 10,
      }),
    enabled: !!userId,
  });

  const paymentTransactions = paymentTransactionsResponse?.data || [];

  // Fetch token transactions (admin endpoint) - filtered by user ID
  const { data: tokenTransactionsResponse } = useQuery({
    queryKey: ["token-transactions", "user", userId],
    queryFn: () =>
      fetchTokenTransactions({
        user: userId,
        sort: "-created_at",
        limit: 10,
      }),
    enabled: !!userId,
  });

  const tokenTransactions = tokenTransactionsResponse?.data || [];

  const {
    isViewModalOpen: isPaymentViewModalOpen,
    selectedPaymentTransaction,
  } = useSelector((state: RootState) => state.paymentTransactionsPage);
  const { isViewModalOpen: isTokenViewModalOpen, selectedTokenTransaction } =
    useSelector((state: RootState) => state.tokenTransactionsPage);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading wallet</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<ErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentWallet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Wallet not found</h2>
        </div>
      </div>
    );
  }

  const userName =
    typeof currentWallet.user === "object" && currentWallet.user
      ? (currentWallet.user as any).name ||
        (currentWallet.user as any).email ||
        "N/A"
      : "N/A";

  const userEmail =
    typeof currentWallet.user === "object" && currentWallet.user
      ? (currentWallet.user as any).email || "N/A"
      : "N/A";

  const packageName =
    typeof currentWallet.package === "object" && currentWallet.package
      ? (currentWallet.package as any).name
      : currentWallet.package || "N/A";

  const planName =
    typeof currentWallet.plan === "object" && currentWallet.plan
      ? (currentWallet.plan as any).name
      : currentWallet.plan || "N/A";

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Wallet Details"
          description="View wallet information and transactions"
          slot={<Wallet />}
        />

        {/* Wallet Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Wallet Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="border-border bg-primary/10 text-primary flex h-24 w-24 items-center justify-center rounded-full border-4">
                    <Wallet className="h-12 w-12" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      Wallet #{currentWallet._id.slice(-8)}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {userName}
                    </p>
                    {userEmail !== "N/A" && (
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        {userEmail}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="text-muted-foreground text-xs">Tokens</div>
                      <div className="text-foreground text-xl font-bold">
                        {currentWallet.token || 0}
                      </div>
                    </div>
                    {packageName !== "N/A" && (
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="text-muted-foreground text-xs">
                          Package
                        </div>
                        <div className="text-foreground text-sm font-semibold">
                          {packageName}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Wallet Details Card */}
        <Card>
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Wallet Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Wallet ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentWallet._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    User ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {userId || "N/A"}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Package
                  </div>
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
                {currentWallet.expires_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Expires At
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        new Date(currentWallet.expires_at) < new Date()
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {new Date(currentWallet.expires_at).toLocaleString()}
                      {new Date(currentWallet.expires_at) < new Date() &&
                        " (Expired)"}
                    </div>
                  </div>
                )}
                {currentWallet.created_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Created At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentWallet.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentWallet.updated_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Updated At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentWallet.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Transactions Card */}
        <Card>
          <Card.Header className="border-b">
            <h2 className="text-foreground text-xl font-semibold">
              Transactions
            </h2>
          </Card.Header>
          <Card.Content className="p-6">
            <Tabs defaultValue="payments">
              <Tabs.List>
                <Tabs.Trigger
                  className="flex items-center gap-2"
                  value="payments"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Transactions
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex items-center gap-2"
                  value="tokens"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Token Transactions
                  </div>
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content>
                <Tabs.Item value="payments">
                  <div className="mt-4 space-y-4">
                    {paymentTransactions.length === 0 ? (
                      <div className="text-muted-foreground py-8 text-center">
                        No payment transactions found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {paymentTransactions.map(
                          (transaction: TPaymentTransaction) => (
                            <div
                              key={transaction._id}
                              className="border-border hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                              onClick={() =>
                                dispatch(openPaymentViewModal(transaction))
                              }
                            >
                              <div>
                                <p className="font-semibold">
                                  {transaction.currency === "USD" ? "$" : "৳"}
                                  {transaction.amount}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {transaction.gateway_transaction_id}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                                    transaction.status === "success"
                                      ? "bg-green-100 text-green-800"
                                      : transaction.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {transaction.status}
                                </span>
                                {transaction.created_at && (
                                  <p className="text-muted-foreground mt-1 text-xs">
                                    {new Date(
                                      transaction.created_at,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </Tabs.Item>
                <Tabs.Item value="tokens">
                  <div className="mt-4 space-y-4">
                    {tokenTransactions.length === 0 ? (
                      <div className="text-muted-foreground py-8 text-center">
                        No token transactions found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tokenTransactions.map(
                          (transaction: TTokenTransaction) => {
                            // Safely extract decrease_source (could be object or string)
                            let decreaseSourceText: string | null = null;
                            if (transaction.decrease_source) {
                              if (
                                typeof transaction.decrease_source === "string"
                              ) {
                                decreaseSourceText = transaction.decrease_source;
                              } else if (
                                typeof transaction.decrease_source === "object" &&
                                transaction.decrease_source !== null
                              ) {
                                const sourceObj = transaction
                                  .decrease_source as Record<string, unknown>;
                                decreaseSourceText =
                                  (sourceObj.name as string) ||
                                  (sourceObj.endpoint as string) ||
                                  (sourceObj._id as string) ||
                                  "N/A";
                              }
                            }

                            return (
                              <div
                                key={transaction._id}
                                className="border-border hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                                onClick={() =>
                                  dispatch(openTokenViewModal(transaction))
                                }
                              >
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      transaction.type === "increase"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {transaction.type === "increase" ? "+" : "-"}
                                    {transaction.token} tokens
                                  </p>
                                  {transaction.increase_source && (
                                    <p className="text-muted-foreground text-sm capitalize">
                                      Source: {transaction.increase_source}
                                    </p>
                                  )}
                                  {decreaseSourceText && (
                                    <p className="text-muted-foreground text-sm">
                                      Feature: {decreaseSourceText}
                                    </p>
                                  )}
                                </div>
                                {transaction.created_at && (
                                  <p className="text-muted-foreground text-sm">
                                    {new Date(
                                      transaction.created_at,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                </Tabs.Item>
              </Tabs.Content>
            </Tabs>
          </Card.Content>
        </Card>

        {/* Modals */}
        <PaymentTransactionViewModal
          default={selectedPaymentTransaction || ({} as TPaymentTransaction)}
          isOpen={isPaymentViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openPaymentViewModal(
                    selectedPaymentTransaction || ({} as TPaymentTransaction),
                  )
                : closePaymentViewModal(),
            )
          }
        />
        <TokenTransactionViewModal
          default={selectedTokenTransaction || ({} as TTokenTransaction)}
          isOpen={isTokenViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openTokenViewModal(
                    selectedTokenTransaction || ({} as TTokenTransaction),
                  )
                : closeTokenViewModal(),
            )
          }
        />
      </div>
    </div>
  );
};

export default UserWalletsDetailsPage;
