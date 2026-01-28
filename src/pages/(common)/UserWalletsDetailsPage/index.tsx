import AssignPackageModal from "@/components/modals/AssignPackageModal";
import CreditsTransactionViewModal from "@/components/modals/CreditsTransactionViewModal";
import GiveBonusCreditsModal from "@/components/modals/GiveBonusCreditsModal";
import PackageTransactionViewModal from "@/components/modals/PackageTransactionViewModal";
import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import {
  closeViewModal as closeCreditsViewModal,
  openViewModal as openCreditsViewModal,
} from "@/redux/slices/credits-transactions-page-slice";
import {
  closeViewModal as closePackageViewModal,
  openViewModal as openPackageViewModal,
} from "@/redux/slices/package-transactions-page-slice";
import {
  closeViewModal as closePaymentViewModal,
  openViewModal as openPaymentViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchCreditsTransactions } from "@/services/credits-transaction.service";
import type { TPackageTransaction } from "@/services/package-transaction.service";
import { fetchPackageTransactions } from "@/services/package-transaction.service";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import { fetchUserWalletById } from "@/services/user-wallet.service";
import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import type { TPackage } from "@/types/package.type";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { TPlan } from "@/types/plan.type";
import type { TErrorResponse } from "@/types/response.type";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  Coins,
  CreditCard,
  Eye,
  Gift,
  Package,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const UserWalletsDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

  const wallet = (location.state as { wallet?: TUserWallet })?.wallet;

  // Modal States
  const [isBonusCreditsModalOpen, setIsBonusCreditsModalOpen] = useState(false);
  const [isAssignPackageModalOpen, setIsAssignPackageModalOpen] =
    useState(false);

  // Pagination States
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentLimit, setPaymentLimit] = useState(10);
  const [creditsPage, setCreditsPage] = useState(1);
  const [creditsLimit, setCreditsLimit] = useState(10);
  const [packagePage, setPackagePage] = useState(1);
  const [packageLimit, setPackageLimit] = useState(10);

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
  const userId = currentWallet?.user;

  // Fetch payment transactions (admin endpoint) - filtered by user ID
  const { data: paymentTransactionsResponse } = useQuery({
    queryKey: [
      "payment-transactions",
      "user",
      userId,
      paymentPage,
      paymentLimit,
    ],
    queryFn: () =>
      fetchPaymentTransactions({
        user: userId,
        sort: "-created_at",
        limit: paymentLimit,
        page: paymentPage,
      }),
    enabled: !!userId,
  });

  const paymentTransactions = paymentTransactionsResponse?.data || [];
  const paymentMeta = paymentTransactionsResponse?.meta;

  // Fetch credits transactions (admin endpoint) - filtered by user ID
  const { data: creditsTransactionsResponse } = useQuery({
    queryKey: [
      "credits-transactions",
      "user",
      userId,
      creditsPage,
      creditsLimit,
    ],
    queryFn: () =>
      fetchCreditsTransactions({
        user: userId,
        sort: "-created_at",
        limit: creditsLimit,
        page: creditsPage,
      }),
    enabled: !!userId,
  });

  const creditsTransactions = creditsTransactionsResponse?.data || [];
  const creditsMeta = creditsTransactionsResponse?.meta;

  // Fetch package transactions (admin endpoint) - filtered by user ID
  const { data: packageTransactionsResponse } = useQuery({
    queryKey: [
      "package-transactions",
      "user",
      userId,
      packagePage,
      packageLimit,
    ],
    queryFn: () =>
      fetchPackageTransactions({
        user: userId,
        sort: "-created_at",
        limit: packageLimit,
        page: packagePage,
      }),
    enabled: !!userId,
  });

  const packageTransactions = packageTransactionsResponse?.data || [];
  const packageMeta = packageTransactionsResponse?.meta;

  const {
    isViewModalOpen: isPaymentViewModalOpen,
    selectedPaymentTransaction,
  } = useSelector((state: RootState) => state.paymentTransactionsPage);
  const {
    isViewModalOpen: isCreditsViewModalOpen,
    selectedCreditsTransaction,
  } = useSelector((state: RootState) => state.creditsTransactionsPage);
  const {
    isViewModalOpen: isPackageViewModalOpen,
    selectedPackageTransaction,
  } = useSelector((state: RootState) => state.packageTransactionsPage);

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
            {(error as AxiosError<TErrorResponse>).response?.data?.message ||
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

  const userName = currentWallet.email || "N/A";
  const userEmail = currentWallet.email || "N/A";

  const packageName =
    typeof currentWallet.package === "object" && currentWallet.package
      ? currentWallet.package.name
      : currentWallet.package || "N/A";

  const planName =
    typeof currentWallet.plan === "object" && currentWallet.plan
      ? currentWallet.plan.name
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
                    {userEmail !== "N/A" ? (
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        {userEmail}
                      </p>
                    ) : (
                      currentWallet.email && (
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                          {currentWallet.email}
                        </p>
                      )
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="text-muted-foreground text-xs">
                        Credits
                      </div>
                      <div className="text-foreground text-xl font-bold">
                        {currentWallet.credits || 0}
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="text-muted-foreground text-xs">Type</div>
                      <div className="text-foreground text-sm font-bold">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                            currentWallet.type === "paid"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {currentWallet.type || "FREE"}
                        </span>
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

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBonusCreditsModalOpen(true)}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Give Bonus Credits
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAssignPackageModalOpen(true)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Assign Package
                    </Button>
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
                    Wallet Email
                  </div>
                  <div className="text-foreground text-sm font-semibold">
                    {currentWallet.email || "N/A"}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Wallet Type
                  </div>
                  <div className="text-foreground text-sm">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium uppercase",
                        currentWallet.type === "paid"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {currentWallet.type || "FREE"}
                    </span>
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
                    <div className="text-muted-foreground mb-1 text-sm">
                      Plan
                    </div>
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
                  value="credits"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Credits Transactions
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="flex items-center gap-2"
                  value="packages"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Package Transactions
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
                              className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                            >
                              <div className="flex flex-1 items-center justify-between">
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
                              <div className="ml-4 border-l pl-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    dispatch(openPaymentViewModal(transaction))
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  {paymentMeta && (
                    <Pagination
                      total={paymentMeta.total || 0}
                      limit={paymentLimit}
                      page={paymentPage}
                      setLimit={setPaymentLimit}
                      setPage={setPaymentPage}
                      className="mt-4 border-t pt-4"
                    />
                  )}
                </Tabs.Item>
                <Tabs.Item value="credits">
                  <div className="mt-4 space-y-4">
                    {creditsTransactions.length === 0 ? (
                      <div className="text-muted-foreground py-8 text-center">
                        No credits transactions found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {creditsTransactions.map(
                          (transaction: TCreditsTransaction) => {
                            // Safely extract decrease_source (could be object or string)
                            let decreaseSourceText: string | null = null;
                            if (transaction.decrease_source) {
                              if (
                                typeof transaction.decrease_source === "string"
                              ) {
                                decreaseSourceText =
                                  transaction.decrease_source;
                              } else if (
                                typeof transaction.decrease_source ===
                                  "object" &&
                                transaction.decrease_source !== null
                              ) {
                                const sourceObj =
                                  transaction.decrease_source as Record<
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

                            return (
                              <div
                                key={transaction._id}
                                className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                              >
                                <div className="flex flex-1 items-center justify-between">
                                  <div>
                                    <p
                                      className={`font-semibold ${
                                        transaction.type === "increase"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {transaction.type === "increase"
                                        ? "+"
                                        : "-"}
                                      {transaction.credits} credits
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
                                <div className="ml-4 border-l pl-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      dispatch(
                                        openCreditsViewModal(transaction),
                                      )
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                  {creditsMeta && (
                    <Pagination
                      total={creditsMeta.total || 0}
                      limit={creditsLimit}
                      page={creditsPage}
                      setLimit={setCreditsLimit}
                      setPage={setCreditsPage}
                      className="mt-4 border-t pt-4"
                    />
                  )}
                </Tabs.Item>
                <Tabs.Item value="packages">
                  <div className="mt-4 space-y-4">
                    {packageTransactions.length === 0 ? (
                      <div className="text-muted-foreground py-8 text-center">
                        No package transactions found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {packageTransactions.map(
                          (transaction: TPackageTransaction) => (
                            <div
                              key={transaction._id}
                              className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                            >
                              <div className="flex flex-1 items-center justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {typeof transaction.package === "object"
                                      ? (transaction.package as TPackage).name
                                      : "Package"}{" "}
                                    -{" "}
                                    {typeof transaction.plan === "object"
                                      ? (transaction.plan as TPlan).name
                                      : "Plan"}
                                  </p>
                                  <p className="text-muted-foreground text-sm">
                                    Credits: {transaction.credits}
                                  </p>
                                  <p className="text-muted-foreground text-xs capitalize">
                                    Source: {transaction.increase_source}
                                  </p>
                                </div>
                                <div className="text-right">
                                  {transaction.created_at && (
                                    <p className="text-muted-foreground text-sm">
                                      {new Date(
                                        transaction.created_at,
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 border-l pl-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    dispatch(openPackageViewModal(transaction))
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  {packageMeta && (
                    <Pagination
                      total={packageMeta.total || 0}
                      limit={packageLimit}
                      page={packagePage}
                      setLimit={setPackageLimit}
                      setPage={setPackagePage}
                      className="mt-4 border-t pt-4"
                    />
                  )}
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
        <CreditsTransactionViewModal
          default={selectedCreditsTransaction || ({} as TCreditsTransaction)}
          isOpen={isCreditsViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openCreditsViewModal(
                    selectedCreditsTransaction || ({} as TCreditsTransaction),
                  )
                : closeCreditsViewModal(),
            )
          }
        />
        <PackageTransactionViewModal
          default={selectedPackageTransaction || ({} as TPackageTransaction)}
          isOpen={isPackageViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openPackageViewModal(
                    selectedPackageTransaction || ({} as TPackageTransaction),
                  )
                : closePackageViewModal(),
            )
          }
        />

        {/* Give Bonus Credits Modal */}
        {currentWallet && (
          <GiveBonusCreditsModal
            isOpen={isBonusCreditsModalOpen}
            setIsOpen={setIsBonusCreditsModalOpen}
            wallet={currentWallet}
          />
        )}
        {currentWallet && (
          <AssignPackageModal
            isOpen={isAssignPackageModalOpen}
            setIsOpen={setIsAssignPackageModalOpen}
            wallet={currentWallet}
          />
        )}
      </div>
    </div>
  );
};

export default UserWalletsDetailsPage;
